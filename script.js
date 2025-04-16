// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBPHER9uMFWodYGEVsdj2KGY_m8HEOCUAQ",
  authDomain: "comments-24767.firebaseapp.com",
  databaseURL: "https://comments-24767-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comments-24767",
  storageBucket: "comments-24767.appspot.com",
  messagingSenderId: "559876960346",
  appId: "1:559876960346:web:faf067629f4c00497de863",
  measurementId: "G-T2DTS2SY4D"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ 현재 URL 기준 photoId 추출
const host = window.location.hostname;
const photoId = host.split('.')[0];
const commentsRef = db.ref('comments/' + photoId);
const likesRef = db.ref('likes/' + photoId);

// ✅ 익명 로그인: 로그인된 사용자가 없을 때만 실행
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    firebase.auth().signInAnonymously()
      .then(() => {
        console.log("익명 로그인 완료");
      })
      .catch((error) => {
        console.error("익명 로그인 실패: ", error);
      });
  } else {
    console.log("이미 로그인됨:", user.uid);
    checkAdmin(user.uid); // 로그인된 사용자 관리자 여부 확인
  }
});

// 📝 댓글 목록
let allComments = [];
let expanded = false;

// 🔄 댓글 불러오기
commentsRef.on('value', snapshot => {
  const comments = snapshot.val();
  if (comments) {
    allComments = Object.entries(comments)
      .map(([key, value]) => ({ id: key, ...value }))
      .sort((a, b) => b.timestamp - a.timestamp);
    renderComments();
  } else {
    allComments = [];
    renderComments();
  }
});

// 💬 댓글 렌더링
function renderComments() {
  const commentsDiv = document.getElementById('comments');
  commentsDiv.innerHTML = '';

  const commentsToShow = expanded ? allComments : allComments.slice(0, 5);

  commentsToShow.forEach(comment => {
    const date = new Date(comment.timestamp);
    const timeString = date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      ${comment.message}<br>
      <small style="color:gray;">${timeString}</small>
    `;

    if (isAdmin) {
      const delBtn = document.createElement('button');
      delBtn.innerText = '삭제';
      delBtn.style.cssText = 'margin-top:5px; float:right;';
      delBtn.onclick = () => deleteComment(comment.id);
      div.appendChild(delBtn);
    }

    commentsDiv.appendChild(div);
  });

  const toggleButton = document.getElementById('toggleButton');
  toggleButton.style.display = allComments.length > 5 ? 'block' : 'none';
  toggleButton.innerText = expanded ? '간단히 보기' : '더 보기';
}

// 🔀 더 보기 토글
function toggleComments() {
  expanded = !expanded;
  renderComments();
}

// ✅ 댓글 작성
function submitComment() {
  const message = document.getElementById('message').value.trim();
  if (!message) {
    alert("댓글을 입력해주세요.");
    return;
  }

  const newCommentRef = commentsRef.push();
  newCommentRef.set({
    message: message,
    timestamp: Date.now(),
    userId: firebase.auth().currentUser.uid
  });

  document.getElementById('message').value = '';
}

// ⌨️ Enter로 댓글 등록
document.getElementById('message').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitComment();
  }
});

// 🗑️ 댓글 삭제 (관리자만)
function deleteComment(commentId) {
  if (confirm("이 댓글을 삭제하시겠습니까?")) {
    commentsRef.child(commentId).remove()
      .then(() => console.log("댓글 삭제됨"))
      .catch(error => console.error("댓글 삭제 오류:", error));
  }
}

// 👍 좋아요 버튼
const likeButton = document.getElementById('likeButton');
const likeCountSpan = document.getElementById('likeCount');

likesRef.child('count').on('value', snapshot => {
  const count = snapshot.val() || 0;
  likeCountSpan.innerText = count;
});

likeButton.addEventListener('click', () => {
  likesRef.child('count').transaction(current => (current || 0) + 1);
});

// 🧑‍💼 관리자 로그인 처리
const adminUID = "nhVQX70DyKXLtQEYPjshL598iPh2";  // 실제 관리자 UID 입력
let isAdmin = false;

function adminLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const uid = result.user.uid;
      checkAdmin(uid);
    })
    .catch(error => {
      console.error("로그인 실패:", error);
    });
}

function checkAdmin(uid) {
  if (uid === adminUID) {
    isAdmin = true;
    renderComments(); // 관리자일 경우 삭제 버튼 보이게 다시 렌더링
    console.log("관리자 로그인됨");
  } else {
    isAdmin = false;
  }
}
