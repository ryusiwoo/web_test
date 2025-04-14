// Firebase 초기화
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 댓글 추가 함수
const addComment = (text) => {
  const commentRef = db.ref('comments/');
  commentRef.push({ text });
};

// 댓글 가져오기 함수
const fetchComments = () => {
  const commentRef = db.ref('comments/');
  commentRef.on('value', (snapshot) => {
    const comments = snapshot.val();
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = ''; // 기존 댓글 초기화

    for (const id in comments) {
      const li = document.createElement('li');
      li.textContent = comments[id].text;
      commentList.appendChild(li);
    }
  });
};

// 폼 제출 이벤트 처리
const commentForm = document.getElementById('commentForm');
commentForm.addEventListener('submit', (e) => {
  e.preventDefault(); // 폼 기본 동작 방지
  const commentInput = document.getElementById('commentInput');
  const comment = commentInput.value;

  if (comment) {
    addComment(comment); // 댓글 추가
    commentInput.value = ''; // 입력 필드 초기화
  }
});

// 초기 댓글 가져오기
fetchComments();
