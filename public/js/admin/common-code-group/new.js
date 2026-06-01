// 공통코드 그룹 생성 폼

document.addEventListener('DOMContentLoaded', function () {
  populateCodeSelects();

  const form = document.getElementById('codeGroupForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const payload = {
      groupCode: form.groupCode.value.trim(),
      groupName: form.groupName.value.trim(),
      useYn: form.useYn.value,
    };
    const description = form.description.value.trim();
    if (description) payload.description = description;

    submitJson('/common-code-groups', payload)
      .then(function () {
        window.location.href = '/admin/common-code-group';
      })
      .catch(showRequestError);
  });
});
