// 공통코드 생성 폼

document.addEventListener('DOMContentLoaded', function () {
  // 소속 그룹 SELECTBOX 채우기
  function populateGroups() {
    const el = document.getElementById('codeGroupId');
    return axios.get('/common-code-groups').then(function (res) {
      fillSelect(el, res.data, {
        value: 'codeGroupId',
        labelFn: function (g) {
          return g.groupCode + ' — ' + g.groupName;
        },
        required: true,
      });
    });
  }

  Promise.all([populateCodeSelects(), populateGroups()]);

  const form = document.getElementById('codeForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const payload = {
      codeGroupId: Number(form.codeGroupId.value),
      code: form.code.value.trim(),
      codeName: form.codeName.value.trim(),
      sortOrder: Number(form.sortOrder.value),
      useYn: form.useYn.value,
    };
    const description = form.description.value.trim();
    if (description) payload.description = description;

    submitJson('/common-codes', payload)
      .then(function () {
        window.location.href = '/admin/common-code';
      })
      .catch(showRequestError);
  });
});
