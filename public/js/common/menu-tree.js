// 사이드바 메뉴 트리: 폴더 클릭 시 하위 펼침/접힘 토글 (기본 접힌 상태)
(function () {
  function bindMenuToggle() {
    const folders = document.querySelectorAll('.app-sidebar [data-menu-toggle]');
    folders.forEach(function (folder) {
      folder.addEventListener('click', function () {
        folder.classList.toggle('open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', bindMenuToggle);
})();
