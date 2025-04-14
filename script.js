// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAejvBpHRHrOoLUbCaSHWl3_GvXQ1k10kQ",
  authDomain: "jirisan-8a0a9.firebaseapp.com",
  databaseURL: "https://jirisan-8a0a9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jirisan-8a0a9",
  storageBucket: "jirisan-8a0a9.firebasestorage.app",
  messagingSenderId: "623824081076",
  appId: "1:623824081076:web:68a519252583e490aa87e1",
  measurementId: "G-7MHTPJZ8H5"
};

// Firebase 앱 초기화
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log("Firebase 초기화 완료:", app);
console.log(typeof firebase); // "object"가 출력되어야 정상입니다.

// 댓글 추가 함수
const addComment = (text) => {
  const commentRef = db.ref('comments/');
  commentRef.push({ text }).then(() => {
    console.log("댓글 작성 완료:", text);
  }).catch((error) => {
    console.error("댓글 작성 중 오류 발생:", error);
  });
};

// 댓글 가져오기 함수
const fetchComments = () => {
  const commentRef = db.ref('comments/');
  commentRef.on('value', (snapshot) => {
    const comments = snapshot.val();
    console.log("실시간 댓글 데이터:", comments);

    const commentList = document.getElementById('commentList');
    commentList.innerHTML = ''; // 기존 댓글 초기화

    for (const id in comments) {
      const li = document.createElement('li');
      li.textContent = comments[id].text;
      commentList.appendChild(li);
    }
  }, (error) => {
    console.error("댓글 가져오는 중 오류 발생:", error);
  });
};

// 폼 제출 이벤트 처리
const commentForm = document.getElementById('commentForm');
commentForm.addEventListener('submit', (e) => {
  e.preventDefault(); // 폼 기본 동작 방지
  const commentInput = document.getElementById('commentInput');
  const comment = commentInput.value;

  if (comment) {
    console.log("댓글 입력 값:", comment);
    addComment(comment); // 댓글 추가
    commentInput.value = ''; // 입력 필드 초기화
  } else {
    console.warn("댓글 입력 필드가 비어 있습니다.");
  }
});

// 초기 댓글 가져오기
fetchComments();
