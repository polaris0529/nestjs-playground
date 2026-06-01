// 비밀번호 변경 (셀프)

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('passwordForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const payload = {
      currentPassword: document.getElementById('currentPassword').value,
      newPassword: document.getElementById('newPassword').value,
    };

    axios
      .patch('/accounts/me/password', payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function () {
        showMessage('success', '비밀번호가 변경되었습니다.');
        form.reset();
      })
      .catch(showRequestError);
  });
});
