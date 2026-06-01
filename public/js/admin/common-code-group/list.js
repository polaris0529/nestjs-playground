// 공통코드 그룹 관리: 목록(DataTables) + 모달 수정 + 삭제

document.addEventListener('DOMContentLoaded', function () {
  const records = {};

  function loadTable() {
    return axios.get('/common-code-groups').then(function (res) {
      res.data.forEach(function (g) {
        records[g.codeGroupId] = g;
      });
      const rows = res.data.map(function (g) {
        return [
          g.codeGroupId,
          g.groupCode,
          g.groupName,
          g.description || '-',
          useBadge(g.useYn),
          actionButtons(g.codeGroupId),
        ];
      });
      new DataTable('#groupTable', {
        data: rows,
        destroy: true,
        paging: false,
        info: false,
        columns: [
          { title: 'ID' },
          { title: '그룹코드' },
          { title: '그룹명' },
          { title: '설명' },
          { title: '사용여부' },
          { title: '관리', orderable: false },
        ],
      });
    });
  }

  function onEdit(id) {
    const g = records[id];
    if (!g) return;
    clearModalMessage();
    document.getElementById('editId').value = g.codeGroupId;
    document.getElementById('editGroupCode').value = g.groupCode;
    document.getElementById('editGroupName').value = g.groupName;
    document.getElementById('editDescription').value = g.description || '';
    document.getElementById('editUseYn').value = g.useYn;
    openModal('groupEditModal');
  }

  function onDelete(id) {
    const g = records[id];
    if (!g) return;
    if (!window.confirm('[' + g.groupCode + '] 그룹을 삭제할까요?')) return;
    apiDelete('/common-code-groups/' + id)
      .then(function () {
        showMessage('success', '삭제되었습니다.');
        return loadTable();
      })
      .catch(showRequestError);
  }

  // 수정 폼 제출
  document.getElementById('groupEditForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearModalMessage();
    const id = document.getElementById('editId').value;
    const payload = {
      groupName: document.getElementById('editGroupName').value.trim(),
      description: document.getElementById('editDescription').value.trim(),
      useYn: document.getElementById('editUseYn').value,
    };
    apiPatch('/common-code-groups/' + id, payload)
      .then(function () {
        closeModal('groupEditModal');
        showMessage('success', '수정되었습니다.');
        return loadTable();
      })
      .catch(showModalError);
  });

  // 행 액션 위임
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('js-edit')) onEdit(e.target.dataset.id);
    if (e.target.classList.contains('js-delete')) onDelete(e.target.dataset.id);
  });

  populateCodeSelects();
  loadTable();
});
