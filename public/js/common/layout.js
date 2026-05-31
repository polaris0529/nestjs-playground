// 사이드바 토글 및 반응형 처리
(function () {
  const STORAGE_KEY = 'sidebar-collapsed';
  const COLLAPSED_CLASS = 'sidebar-collapsed';

  // 저장된 상태 복원
  function restoreState() {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      document.body.classList.add(COLLAPSED_CLASS);
    }
  }

  // 토글 버튼 클릭
  function bindToggle() {
    const btn = document.getElementById('sidebar-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const collapsed = document.body.classList.toggle(COLLAPSED_CLASS);
      localStorage.setItem(STORAGE_KEY, collapsed);
    });
  }

  // 창 크기 변화 대응: 1200px 미만이면 자동 접힘
  function bindResize() {
    function check() {
      if (window.innerWidth < 1200) {
        document.body.classList.add(COLLAPSED_CLASS);
      } else {
        // 넓은 화면 복귀 시 저장 상태 우선
        if (localStorage.getItem(STORAGE_KEY) !== 'true') {
          document.body.classList.remove(COLLAPSED_CLASS);
        }
      }
    }
    window.addEventListener('resize', check);
    check();
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreState();
    bindToggle();
    bindResize();
  });
})();
