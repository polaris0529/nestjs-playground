// 계정 관리: 목록(DataTables) + 모달 수정 + 비활성화

document.addEventListener('DOMContentLoaded', function () {
  const records = {};

  function loadTable() {
    return axios.get('/accounts').then(function (res) {
      res.data.forEach(function (a) {
        records[a.accountId] = a;
      });
      const rows = res.data.map(function (a) {
        return [
          a.accountId,
          a.loginId,
          a.accountName,
          (a.roles || []).join(', ') || '-',
          a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString('ko-KR') : '-',
          useBadge(a.useYn),
          actionButtons(a.accountId),
        ];
      });
      renderAdminTable('#accountTable', rows, [
        { title: 'ID' },
        { title: '로그인 ID' },
        { title: '이름' },
        { title: '역할' },
        { title: '최근 로그인' },
        { title: '사용여부' },
        { title: '관리', orderable: false },
      ]);
    });
  }

  function onEdit(id) {
    const a = records[id];
    if (!a) return;
    clearModalMessage();
    document.getElementById('editId').value = a.accountId;
    document.getElementById('editLoginId').value = a.loginId;
    document.getElementById('editAccountName').value = a.accountName;
    document.getElementById('editRoleCode').value = (a.roles && a.roles[0]) || '';
    document.getElementById('editUseYn').value = a.useYn;
    openModal('accountEditModal');
  }

  function onDelete(id) {
    const a = records[id];
    if (!a) return;
    if (!window.confirm('[' + a.loginId + '] 계정을 비활성화할까요?')) return;
    apiDelete('/accounts/' + id)
      .then(function () {
        showMessage('success', '비활성화되었습니다.');
        return loadTable();
      })
      .catch(showRequestError);
  }

  document.getElementById('accountEditForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearModalMessage();
    const id = document.getElementById('editId').value;
    const payload = {
      accountName: document.getElementById('editAccountName').value.trim(),
      roleCode: document.getElementById('editRoleCode').value,
      useYn: document.getElementById('editUseYn').value,
    };
    apiPatch('/accounts/' + id, payload)
      .then(function () {
        closeModal('accountEditModal');
        showMessage('success', '수정되었습니다.');
        return loadTable();
      })
      .catch(showModalError);
  });

  bindRowActions(onEdit, onDelete);

  populateCodeSelects();
  loadTable();
});
