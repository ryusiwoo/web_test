// 🔽 Firebase 설정
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

// 🔑 현재 URL의 서브도메인을 photoId로 사용
const host = window.location.hostname;
const photoId = host.split('.')[0];  // 예: 'brilliant-stardust-0ecc28'
const commentsRef = db.ref('comments/' + photoId);

// ✅ 익명 로그인
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("익명 로그인 완료");
  })
  .catch((error) => {
    console.error("익명 로그인 실패: ", error);
  });

// 📝 댓글 목록 관련 변수
let allComments = [];
let expanded = false;

// 🔄 댓글 불러오기
commentsRef.on('value', snapshot => {
  const comments = snapshot.val();
  if (comments) {
    allComments = Object.values(comments)
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
    commentsDiv.appendChild(div);
  });

  const toggleButton = document.getElementById('toggleButton');
  toggleButton.style.display = allComments.length > 5 ? 'block' : 'none';
  toggleButton.innerText = expanded ? '간단히 보기' : '더 보기';
}

// 🔀 더 보기 / 간단히 보기
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

// ⌨️ Enter 키로 댓글 등록
document.getElementById('message').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitComment();
  }
});
