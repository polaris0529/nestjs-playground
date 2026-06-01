// 메뉴 생성 폼

document.addEventListener('DOMContentLoaded', function () {
  // 상위 메뉴 SELECTBOX 채우기 (선택 안하면 최상위)
  function populateParents() {
    const el = document.getElementById('parentMenuId');
    return axios.get('/menus').then(function (res) {
      fillSelect(el, res.data, {
        value: 'menuId',
        labelFn: function (m) {
          return m.menuName + ' (Lv.' + m.menuLevel + ')';
        },
        required: false,
        emptyLabel: '최상위 (없음)',
      });
    });
  }

  Promise.all([populateCodeSelects(), populateParents()]);

  const form = document.getElementById('menuForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const payload = {
      menuCode: form.menuCode.value.trim(),
      menuName: form.menuName.value.trim(),
      menuType: form.menuType.value,
      sortOrder: Number(form.sortOrder.value),
      useYn: form.useYn.value,
    };
    if (form.parentMenuId.value) payload.parentMenuId = Number(form.parentMenuId.value);
    if (form.menuUrl.value.trim()) payload.menuUrl = form.menuUrl.value.trim();
    if (form.openType.value) payload.openType = form.openType.value;

    submitJson('/menus', payload)
      .then(function () {
        window.location.href = '/admin/menu';
      })
      .catch(showRequestError);
  });
});
