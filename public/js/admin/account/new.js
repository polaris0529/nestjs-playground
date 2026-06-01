// 계정 생성 폼

document.addEventListener('DOMContentLoaded', function () {
  populateCodeSelects();

  const form = document.getElementById('accountForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const payload = {
      loginId: form.loginId.value.trim(),
      password: form.password.value,
      accountName: form.accountName.value.trim(),
      roleCode: form.roleCode.value,
      useYn: form.useYn.value,
    };

    submitJson('/accounts', payload)
      .then(function () {
        window.location.href = '/admin/account';
      })
      .catch(showRequestError);
  });
});
