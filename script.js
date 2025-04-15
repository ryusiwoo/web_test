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

function submitComment() {
  const message = document.getElementById('message').value.trim();  // ← .trim() 추가
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


db.ref('comments').on('value', snapshot => {
  const commentsDiv = document.getElementById('comments');
  commentsDiv.innerHTML = '';
  const comments = snapshot.val();
  if (comments) {
    Object.values(comments)
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach(comment => {
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
  //        <strong>${comment.name}</strong><br>
          ${comment.message}<br>
          <small style="color:gray;">${timeString}</small>
        `;
        commentsDiv.appendChild(div);
      });
  }
});
