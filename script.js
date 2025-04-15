document.addEventListener('DOMContentLoaded', () => {
    // Supabase 클라이언트 설정 (본인의 Supabase 프로젝트 설정으로 변경)
    const SUPABASE_URL = 'https://ivqpiiaznzuxgrutukrk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cXBpaWF6bnp1eGdydXR1a3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzMwODQsImV4cCI6MjA2MDIwOTA4NH0.gdfTjIRsB8t-vb_JFPFhQo8sqmFoObfKq1iYLGohiOI';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const commentInput = document.getElementById('comment-input');
    const submitButton = document.getElementById('submit-button');
    const commentList = document.getElementById('comment-list');

    // 댓글 불러오기
    async function loadComments() {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('댓글 불러오기 오류:', error);
                return;
            }

            commentList.innerHTML = ''; // 댓글 목록 초기화
            data.forEach((comment) => {
                const newComment = document.createElement('li');
                const commentDate = new Date(comment.created_at).toLocaleString();
                newComment.textContent = `${comment.text} (${commentDate})`;
                commentList.appendChild(newComment);
            });
        } catch (error) {
            console.error('댓글 불러오기 중 오류 발생:', error);
        }
    }

    loadComments(); // 페이지 로드 시 댓글 불러오기

    // 댓글 등록
    submitButton.addEventListener('click', async () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            try {
                const { error } = await supabase.from('comments').insert([{ text: commentText }]);

                if (error) {
                    console.error('댓글 등록 오류:', error);
                    return;
                }

                commentInput.value = ''; // 입력창 초기화
                loadComments(); // 댓글 목록 갱신
            } catch (error) {
                console.error('댓글 등록 중 오류 발생:', error);
            }
        }
    });
});
