// axios 공통: CSRF 토큰 헤더 자동 첨부 + access 만료(401) 시 refresh 후 재시도
(function () {
  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m.pop()) : '';
  }

  if (!window.axios) return;

  // 변경 요청에 CSRF 토큰 헤더 부착
  axios.interceptors.request.use(function (config) {
    const token = getCookie('csrf_token');
    if (token) config.headers['X-CSRF-Token'] = token;
    return config;
  });

  // 401 → /auth/refresh 1회 시도 후 원요청 재시도, 실패 시 로그인 페이지로
  let refreshing = null;
  axios.interceptors.response.use(null, function (error) {
    const resp = error.response;
    const cfg = error.config;
    const isAuthCall = cfg && cfg.url && cfg.url.indexOf('/auth/') === 0;
    if (resp && resp.status === 401 && cfg && !cfg._retried && !isAuthCall) {
      cfg._retried = true;
      refreshing = refreshing || axios.post('/auth/refresh');
      return refreshing
        .then(function () {
          refreshing = null;
          return axios(cfg);
        })
        .catch(function (e) {
          refreshing = null;
          window.location.href = '/login';
          return Promise.reject(e);
        });
    }
    return Promise.reject(error);
  });
})();
