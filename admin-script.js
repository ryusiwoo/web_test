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
const auth = firebase.auth();

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("로그인 성공");
      window.opener.location.reload(); // 댓글 페이지 새로 고침
      window.close(); // 팝업 닫기
    })
    .catch(error => {
      alert("로그인 실패: " + error.message);
    });
});
