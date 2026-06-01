// 로그인 폼: /auth/login 으로 인증하면 서버가 httpOnly 쿠키를 설정한다. 성공 시 대시보드로 이동.

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const payload = {
      loginId: form.loginId.value.trim(),
      password: form.password.value,
    };

    submitJson('/auth/login', payload)
      .then(function () {
        window.location.href = '/admin';
      })
      .catch(showRequestError);
  });
});
