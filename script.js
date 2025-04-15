// 🔽 Firebase 설정 코드
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

// 🔐 Firebase 익명 인증 후에 DB 접근
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("익명 사용자로 로그인 완료");

    const db = firebase.database();
    let allComments = [];
    let expanded = false;

    // 댓글 가져오기
    db.ref('comments').on('value', snapshot => {
      const comments = snapshot.val();
      if (comments) {
        allComments = Object.values(comments)
          .sort((a, b) => b.timestamp - a.timestamp); // 최신순 정렬
        renderComments();
      }
    });

    // 댓글 렌더링 함수
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

    // 더 보기 / 간단히 보기 버튼
    window.toggleComments = function () {
      expanded = !expanded;
      renderComments();
    };

    // 댓글 등록 처리
    window.submitComment = function () {
      const message = document.getElementById('message').value.trim();
      if (!message) {
        alert("댓글을 입력해주세요.");
        return;
      }

      db.ref('comments').push({
        message: message,
        timestamp: Date.now(),
        userId: firebase.auth().currentUser.uid
      });

      document.getElementById('message').value = '';
    };

    // 엔터 키 이벤트
    document.getElementById('message').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitComment();
      }
    });

  })
  .catch((error) => {
    console.error("익명 인증 실패: ", error);
  });
