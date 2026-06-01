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
      .then(function (res) {
        showMessage('success', '그룹이 생성되었습니다. (id: ' + res.data.codeGroupId + ')');
        form.reset();
        return populateCodeSelects();
      })
      .catch(showRequestError);
  });
});
