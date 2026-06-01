// 관리 화면 공통: 커스텀 모달 + PATCH/DELETE 헬퍼 (인라인 onclick 금지 → 이벤트 위임)

function openModal(id) {
  document.getElementById(id).classList.remove('d-none');
}

function closeModal(id) {
  document.getElementById(id).classList.add('d-none');
}

function apiPatch(url, payload) {
  return axios.patch(url, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
}

function apiDelete(url) {
  return axios.delete(url);
}

// 목록 공통 렌더 조각
function useBadge(useYn) {
  return useYn === 'Y'
    ? '<span class="badge-use on">사용</span>'
    : '<span class="badge-use off">미사용</span>';
}

function actionButtons(id) {
  return (
    '<button class="btn btn-sm btn-outline-primary js-edit" data-id="' +
    id +
    '">수정</button> ' +
    '<button class="btn btn-sm btn-outline-danger js-delete" data-id="' +
    id +
    '">삭제</button>'
  );
}

// 모달 내부 메시지 영역(#modalMessage) 제어
function showModalError(err) {
  const box = document.getElementById('modalMessage');
  if (!box) return;
  const data = err && err.response && err.response.data;
  let msg = '처리 중 오류가 발생했습니다.';
  if (data && data.message) {
    msg = Array.isArray(data.message) ? data.message.join('<br>') : data.message;
  }
  box.className = 'alert alert-danger';
  box.innerHTML = msg;
}

function clearModalMessage() {
  const box = document.getElementById('modalMessage');
  if (!box) return;
  box.className = '';
  box.innerHTML = '';
}

// 오버레이 배경 클릭 또는 [data-modal-close] 클릭 시 모달 닫기
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.hasAttribute('data-modal-close')) {
        overlay.classList.add('d-none');
      }
    });
  });
});
