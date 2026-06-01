// 공통코드 관리: 목록(DataTables) + 모달 수정 + 삭제

document.addEventListener('DOMContentLoaded', function () {
  const records = {};

  function loadTable() {
    return axios.get('/common-codes').then(function (res) {
      res.data.forEach(function (c) {
        records[c.codeId] = c;
      });
      const rows = res.data.map(function (c) {
        return [
          c.codeId,
          c.codeGroup ? c.codeGroup.groupCode : '-',
          c.code,
          c.codeName,
          c.sortOrder,
          useBadge(c.useYn),
          actionButtons(c.codeId),
        ];
      });
      renderAdminTable('#codeTable', rows, [
        { title: 'ID' },
        { title: '그룹' },
        { title: '코드' },
        { title: '코드명' },
        { title: '정렬' },
        { title: '사용여부' },
        { title: '관리', orderable: false },
      ]);
    });
  }

  function onEdit(id) {
    const c = records[id];
    if (!c) return;
    clearModalMessage();
    document.getElementById('editId').value = c.codeId;
    document.getElementById('editCode').value = c.code;
    document.getElementById('editCodeName').value = c.codeName;
    document.getElementById('editDescription').value = c.description || '';
    document.getElementById('editSortOrder').value = c.sortOrder;
    document.getElementById('editUseYn').value = c.useYn;
    openModal('codeEditModal');
  }

  function onDelete(id) {
    const c = records[id];
    if (!c) return;
    if (!window.confirm('[' + c.code + '] 코드를 삭제할까요?')) return;
    apiDelete('/common-codes/' + id)
      .then(function () {
        showMessage('success', '삭제되었습니다.');
        return loadTable();
      })
      .catch(showRequestError);
  }

  document.getElementById('codeEditForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearModalMessage();
    const id = document.getElementById('editId').value;
    const payload = {
      codeName: document.getElementById('editCodeName').value.trim(),
      description: document.getElementById('editDescription').value.trim(),
      sortOrder: Number(document.getElementById('editSortOrder').value),
      useYn: document.getElementById('editUseYn').value,
    };
    apiPatch('/common-codes/' + id, payload)
      .then(function () {
        closeModal('codeEditModal');
        showMessage('success', '수정되었습니다.');
        return loadTable();
      })
      .catch(showModalError);
  });

  bindRowActions(onEdit, onDelete);

  populateCodeSelects();
  loadTable();
});
