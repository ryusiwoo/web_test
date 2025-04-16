// Firebase 초기화
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
const database = firebase.database();

let currentUser = null;
const adminUid = 'nhVQX70DyKXLtQEYPjshL598iPh2'; // 관리자 UID

// 로그인 처리
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    console.log('로그인 상태:', user.uid);
  } else {
    // 익명 로그인
    firebase.auth().signInAnonymously()
      .then((result) => {
        currentUser = result.user;
        console.log('익명 로그인 완료');
      })
      .catch((error) => {
        console.error('로그인 오류:', error);
      });
  }
});

// 댓글 등록
function submitComment() {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  const photoId = 'luminous-toffee-e32b4d';
  if (text === '') return;

  const newCommentRef = database.ref('comments/' + photoId).push();
  newCommentRef.set({
    text: text,
    timestamp: Date.now(),
    uid: currentUser ? currentUser.uid : null
  });

  input.value = '';
}

// 댓글 불러오기
function loadComments() {
  const photoId = 'luminous-toffee-e32b4d';
  const commentsRef = database.ref('comments/' + photoId);
  commentsRef.on('value', (snapshot) => {
    const commentsContainer = document.getElementById('comments');
    commentsContainer.innerHTML = '';

    snapshot.forEach((child) => {
      const comment = child.val();
      const div = document.createElement('div');
      div.className = 'comment';
      div.textContent = comment.text;

      // 관리자이면 삭제 버튼 추가
      if (currentUser && currentUser.uid === adminUid) {
        const delBtn = document.createElement('button');
        delBtn.textContent = '삭제';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => {
          database.ref(`comments/${photoId}/${child.key}`).remove();
        };
        div.appendChild(delBtn);
      }

      commentsContainer.appendChild(div);
    });
  });
}

// 좋아요 기능
function setupLikeButton() {
  const likeBtn = document.getElementById('likeBtn');
  const likeCount = document.getElementById('likeCount');
  const likeRef = database.ref('likes/luminous-toffee-e32b4d');

  likeRef.on('value', (snapshot) => {
    likeCount.textContent = snapshot.val() || 0;
  });

  likeBtn.addEventListener('click', () => {
    likeRef.transaction((currentLikes) => {
      return (currentLikes || 0) + 1;
    });
  });
}

// 댓글 Enter 키 이벤트
document.getElementById('commentInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    submitComment();
  }
});

// 관리자 로그인 링크 클릭 시 팝업 열기
window.addEventListener('DOMContentLoaded', () => {
  const adminLoginLink = document.getElementById('adminLogin');
  if (adminLoginLink) {
    adminLoginLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.open('admin-login.html', 'Admin Login', 'width=400,height=500');
    });
  }

  loadComments();
  setupLikeButton();
});
