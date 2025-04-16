// 관리자 로그인 메시지 처리
window.addEventListener('message', function (e) {
  if (e.data === 'adminLoggedIn') {
    // 관리자가 로그인되었을 때 처리
    alert('관리자 로그인 완료');
    // 이후 필요한 처리를 추가 (예: 댓글 삭제 버튼 활성화 등)
    enableDeleteButtons();  // 예시로 삭제 버튼을 활성화하는 함수 호출
  }
});

function enableDeleteButtons() {
  // 예시: 댓글 삭제 버튼을 활성화하는 코드
  const deleteButtons = document.querySelectorAll('.delete-comment');
  deleteButtons.forEach(button => {
    button.style.display = 'inline-block';  // 버튼을 보이게 함
  });
}
