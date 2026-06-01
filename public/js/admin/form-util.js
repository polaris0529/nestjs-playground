// 관리자 생성 폼 공통 유틸 (인라인 JS 금지 규칙에 따라 외부 파일로 분리)

// option 엘리먼트 생성
function makeOption(value, text, opts) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  if (opts && opts.disabled) option.disabled = true;
  if (opts && opts.selected) option.selected = true;
  return option;
}

// SELECTBOX 채우기
// opts: { value(키), label(키) | labelFn(함수), required(필수여부), emptyLabel(선택 안함 라벨) }
function fillSelect(selectEl, items, opts) {
  selectEl.innerHTML = '';
  if (opts.required) {
    selectEl.appendChild(makeOption('', '선택하세요', { disabled: true, selected: true }));
  } else {
    selectEl.appendChild(makeOption('', opts.emptyLabel || '선택 안함'));
  }
  items.forEach(function (item) {
    const text = opts.labelFn ? opts.labelFn(item) : item[opts.label];
    selectEl.appendChild(makeOption(item[opts.value], text));
  });
}

// data-code-group 속성을 가진 모든 SELECTBOX 를 공통코드 API 로 채운다.
// option value = 코드값(code), label = 코드명(codeName)
function populateCodeSelects() {
  const selects = document.querySelectorAll('select[data-code-group]');
  const tasks = Array.prototype.map.call(selects, function (el) {
    return axios
      .get('/common-codes', { params: { groupCode: el.dataset.codeGroup } })
      .then(function (res) {
        fillSelect(el, res.data, {
          value: 'code',
          label: 'codeName',
          required: el.required,
        });
      });
  });
  return Promise.all(tasks);
}

// 메시지 영역 제어 (Bootstrap alert)
function showMessage(type, html) {
  const box = document.getElementById('formMessage');
  box.className = 'alert alert-' + type;
  box.innerHTML = html;
}

function clearMessage() {
  const box = document.getElementById('formMessage');
  box.className = '';
  box.innerHTML = '';
}

// 서버 검증 에러(ValidationPipe) 또는 일반 에러를 메시지로 표시
function showRequestError(err) {
  const data = err && err.response && err.response.data;
  let message = '요청 처리 중 오류가 발생했습니다.';
  if (data && data.message) {
    message = Array.isArray(data.message) ? data.message.join('<br>') : data.message;
  }
  showMessage('danger', message);
}

// JSON POST 요청
function submitJson(url, payload) {
  return axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
}
