// 🔽 Firebase 설정 코드를 여기에 붙여넣으세요 🔽

const firebaseConfig = {
  apiKey: "AIzaSyBPHER9uMFWodYGEVsdj2KGY_m8HEOCUAQ",
  authDomain: "comments-24767.firebaseapp.com",
  databaseURL: "https://comments-24767-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comments-24767",
  storageBucket: "comments-24767.firebasestorage.app",
  messagingSenderId: "559876960346",
  appId: "1:559876960346:web:faf067629f4c00497de863",
  measurementId: "G-T2DTS2SY4D"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allComments = [];     // 전체 댓글 저장용
let expanded = false;     // 확장 여부 (초기값은 false로 설정)

// Firebase에서 댓글을 가져오는 부분
db.ref('comments').on('value', snapshot => {
  const comments = snapshot.val();
  if (comments) {
    allComments = Object.values(comments)
      .sort((a, b) => b.timestamp - a.timestamp); // 최신 댓글부터 정렬
    renderComments(); // 5개 댓글만 먼저 렌더링
  }
});

// 댓글을 렌더링하는 함수
function renderComments() {
  const commentsDiv = document.getElementById('comments');
  commentsDiv.innerHTML = '';

  // 'expanded' 값에 따라 보여줄 댓글을 선택
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

  // "더 보기" 버튼 처리
  const toggleButton = document.getElementById('toggleButton');
  toggleButton.style.display = allComments.length > 5 ? 'block' : 'none';  // 5개 이상일 때만 버튼 보이기
  toggleButton.innerText = expanded ? '간단히 보기' : '더 보기';
}

// "더 보기" 또는 "간단히 보기" 버튼 클릭 시 댓글 확장/축소
function toggleComments() {
  expanded = !expanded;
  renderComments();
}

// 댓글 입력창에 엔터 키 이벤트 추가
document.getElementById('message').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // 엔터 키 눌렀을 때 기본 동작(줄바꿈)을 막음
    submitComment(); // 댓글 등록 함수 호출
  }
});


// 댓글 등록 처리 (이 부분은 기존 코드와 동일)
function submitComment() {
  const message = document.getElementById('message').value.trim();
  if (!message) {
    alert("댓글을 입력해주세요.");
    return;
  }
  const newCommentRef = db.ref('comments').push();
  newCommentRef.set({
    message: message,
    timestamp: Date.now()
  });
  document.getElementById('message').value = '';
}
