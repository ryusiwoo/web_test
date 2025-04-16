// Firebase 설정 (1 ~ 11번째 줄)
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

// 댓글 데이터베이스 참조 (14번째 줄)
const commentsRef = db.ref('comments');
const likeRef = db.ref('likeCount');

// 좋아요 카운트 불러오기 (17 ~ 21번째 줄)
likeRef.on('value', (snapshot) => {
  const likeCount = snapshot.val() || 0;
  document.getElementById('likeCount').textContent = likeCount;
});

// 댓글 등록 함수 (24 ~ 34번째 줄)
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

// 댓글 삭제 이벤트 감지 (37 ~ 44번째 줄 - 그대로 유지)
commentsRef.on('child_removed', (snapshot) => {
  const commentId = snapshot.key;
  const commentElement = document.getElementById(commentId); // 해당 ID를 가진 댓글 요소를 찾음
  if (commentElement) {
    commentElement.remove(); // 화면에서 댓글 요소 제거
  }
});

// "더 보기" 기능 관련 변수 (47 ~ 49번째 줄 - 새로 추가)
let displayedCommentsCount = 5; // 처음 보여줄 댓글 개수
let allComments = []; // 모든 댓글 데이터를 저장할 배열
let lastVisibleComment = null; // 마지막으로 보여진 댓글 스냅샷

// 댓글 출력 함수 (초기 로딩 및 더 보기) (52 ~ 90번째 줄 - 새로 추가 및 수정)
function loadComments(initialLoad = true) {
  let query = commentsRef.orderBy('timestamp', 'desc').limitToLast(displayedCommentsCount);

  if (!initialLoad && lastVisibleComment) {
    query = commentsRef.orderBy('timestamp', 'desc').endBefore(lastVisibleComment).limitToLast(5); // 다음 5개
  }

  query.once('value', (snapshot) => { // 'value' 이벤트는 초기 로딩 및 '더 보기' 클릭 시 한 번만 데이터를 가져옴
    const newComments = [];
    snapshot.forEach((childSnapshot) => {
      newComments.unshift({ id: childSnapshot.key, data: childSnapshot.val() });
      if (newComments.length === 5 && !initialLoad) {
        lastVisibleComment = childSnapshot; // '더 보기' 로드시 마지막 댓글 업데이트
      } else if (newComments.length === displayedCommentsCount && initialLoad) {
        lastVisibleComment = childSnapshot; // 초기 로드시 마지막 댓글 업데이트
      }
    });

    if (initialLoad) {
      allComments = newComments; // 초기 로딩 시 모든 댓글 저장
    } else {
      // '더 보기'로 로드된 댓글을 기존 댓글 목록에 추가 (중복 방지)
      newComments.forEach(newComment => {
        if (!allComments.some(comment => comment.id === newComment.id)) {
          allComments.unshift(newComment);
        }
      });
    }

    renderComments();
    updateToggleButtonVisibility();
  });
}

// 댓글 화면에 렌더링 (93 ~ 113번째 줄 - 새로 추가 및 수정)
function renderComments() {
  const commentsContainer = document.getElementById('comments');
  commentsContainer.innerHTML = ''; // 기존 댓글 비우기
  allComments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.textContent = comment.data.message;
    commentElement.id = comment.id;

    // 관리자일 경우 삭제 버튼 추가 (필요에 따라 수정)
    if (auth.currentUser && auth.currentUser.uid === 'FCiHMPxEBAO7vvZv8SKWzgOxP9s1') {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '삭제';
      deleteButton.onclick = () => deleteComment(comment.id);
      commentElement.appendChild(deleteButton);
    }
    commentsContainer.appendChild(commentElement);
  });
}

// "더 보기" 버튼 표시 여부 업데이트 (116 ~ 135번째 줄 - 새로 추가 및 수정)
function updateToggleButtonVisibility() {
  const toggleButton = document.getElementById('toggleButton');
  if (allComments.length < displayedCommentsCount || allComments.length === 0) {
    toggleButton.style.display = 'none'; // 더 이상 보여줄 댓글이 없거나 댓글이 없으면 숨김
  } else {
    // 한 번 이상 '더 보기'를 눌렀다면 전체 댓글 수와 현재 보여주는 댓글 수를 비교
    commentsRef.orderBy('timestamp', 'desc').once('value', (snapshot) => {
      if (allComments.length < snapshot.numChildren()) {
        toggleButton.style.display = 'block';
      } else {
        toggleButton.style.display = 'none';
      }
    });
  }
}

// "더 보기" 버튼 클릭 이벤트 핸들러 (138 ~ 141번째 줄 - 새로 추가)
function toggleComments() {
  displayedCommentsCount += 5; // 다음에 불러올 댓글 수 증가
  loadComments(false); // 추가 댓글 로드
}

// 초기 댓글 로드 (144번째 줄 - 새로 추가)
loadComments(true);

// 새로운 댓글 추가 시 (147 ~ 157번째 줄 - 기존 child_added 리스너 내용으로 대체)
commentsRef.orderBy('timestamp', 'desc').limitToLast(1).on('child_added', (snapshot) => {
  const newComment = { id: snapshot.key, data: snapshot.val() };
  allComments.unshift(newComment); // 배열 맨 앞에 추가
  if (allComments.length > displayedCommentsCount) {
    allComments.pop(); // 보여지는 개수 초과 시 마지막 댓글 제거
  }
  renderComments();
  updateToggleButtonVisibility();
});

// 댓글 삭제 함수 (160 ~ 163번째 줄 - 그대로 유지)
function deleteComment(commentId) {
  commentsRef.child(commentId).remove();
}

// 좋아요 버튼 클릭시 카운트 증가 (166 ~ 169번째 줄 - 그대로 유지)
function likePage() {
  likeRef.transaction(currentLikeCount => {
    return (currentLikeCount || 0) + 1;
  });
}

// 관리자 로그인 팝업 열기 (172 ~ 176번째 줄 - 그대로 유지)
document.getElementById('adminLogin').addEventListener('click', function (e) {
  e.preventDefault();
  window.open('admin-login.html', 'Admin Login', 'width=400,height=500');
});
