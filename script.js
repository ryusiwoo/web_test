// Firebase 설정
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
const auth = firebase.auth();

// 댓글 데이터베이스 참조
const commentsRef = db.ref('comments');
const likeRef = db.ref('likeCount');

// 좋아요 카운트 불러오기
likeRef.on('value', (snapshot) => {
  const likeCount = snapshot.val() || 0;
  document.getElementById('likeCount').textContent = likeCount;
});

// 댓글 등록 함수
document.getElementById('message').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const message = document.getElementById('message').value.trim();
    if (message) {
      commentsRef.push({ message, timestamp: Date.now() });
      document.getElementById('message').value = ''; // 댓글 입력창 비우기
    }
  }
});

// 댓글 삭제 이벤트 감지
commentsRef.on('child_removed', (snapshot) => {
  const commentId = snapshot.key;
  const commentElement = document.getElementById(commentId); // 해당 ID를 가진 댓글 요소를 찾음
  if (commentElement) {
    commentElement.remove(); // 화면에서 댓글 요소 제거
  }
});

// 댓글 출력 함수 (수정)
commentsRef.on('child_added', (snapshot) => {
  const commentData = snapshot.val();
  const commentId = snapshot.key;
  const commentElement = document.createElement('div');
  commentElement.textContent = commentData.message;
  commentElement.id = commentId; // 댓글 요소에 고유한 ID를 부여

  // 관리자일 경우 삭제 버튼 추가
  // (관리자 확인 로직은 필요에 따라 수정)
  if (auth.currentUser && auth.currentUser.uid === 'FCiHMPxEBAO7vvZv8SKWzgOxP9s1') {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.onclick = () => deleteComment(commentId);
    commentElement.appendChild(deleteButton);
  }

  document.getElementById('comments').appendChild(commentElement);
});


  
  // 관리자일 경우 삭제 버튼 추가
  if (auth.currentUser && auth.currentUser.uid === '관리자 UID') {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.onclick = () => deleteComment(commentId);
    commentElement.appendChild(deleteButton);
  }

  document.getElementById('comments').appendChild(commentElement);
});

// 댓글 삭제 함수 (관리자만)
function deleteComment(commentId) {
  commentsRef.child(commentId).remove();
}

// 좋아요 버튼 클릭시 카운트 증가
function likePage() {
  likeRef.transaction(currentLikeCount => {
    return (currentLikeCount || 0) + 1;
  });
}

// 관리자 로그인 팝업 열기
document.getElementById('adminLogin').addEventListener('click', function (e) {
  e.preventDefault();
  window.open('admin-login.html', 'Admin Login', 'width=400,height=500');
});
