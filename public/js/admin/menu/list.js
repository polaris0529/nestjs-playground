// 메뉴 관리: 목록(DataTables) + 모달 수정 + 삭제(소프트)

document.addEventListener('DOMContentLoaded', function () {
  const records = {};

  function loadTable() {
    return axios.get('/menus').then(function (res) {
      res.data.forEach(function (m) {
        records[m.menuId] = m;
      });
      const rows = res.data.map(function (m) {
        return [
          m.menuId,
          m.menuLevel,
          m.menuCode,
          m.menuName,
          m.menuType,
          m.menuUrl || '-',
          m.sortOrder,
          useBadge(m.useYn),
          actionButtons(m.menuId),
        ];
      });
      renderAdminTable('#menuTable', rows, [
        { title: 'ID' },
        { title: 'Lv' },
        { title: '메뉴코드' },
        { title: '메뉴명' },
        { title: '유형' },
        { title: 'URL' },
        { title: '정렬' },
        { title: '사용여부' },
        { title: '관리', orderable: false },
      ]);
    });
  }

  // 상위 메뉴 SELECTBOX 채우기 (자기 자신 제외, 최상위 옵션 포함)
  function populateParents(currentId) {
    const list = Object.keys(records)
      .map(function (k) {
        return records[k];
      })
      .filter(function (m) {
        return String(m.menuId) !== String(currentId);
      });
    fillSelect(document.getElementById('editParentMenuId'), list, {
      value: 'menuId',
      labelFn: function (m) {
        return m.menuName + ' (Lv.' + m.menuLevel + ')';
      },
      required: false,
      emptyLabel: '최상위 (없음)',
    });
  }

  function onEdit(id) {
    const m = records[id];
    if (!m) return;
    clearModalMessage();
    populateParents(id);
    document.getElementById('editId').value = m.menuId;
    document.getElementById('editParentMenuId').value = m.parentMenuId || '';
    document.getElementById('editMenuCode').value = m.menuCode;
    document.getElementById('editMenuName').value = m.menuName;
    document.getElementById('editMenuUrl').value = m.menuUrl || '';
    document.getElementById('editMenuType').value = m.menuType;
    document.getElementById('editOpenType').value = m.openType || '';
    document.getElementById('editSortOrder').value = m.sortOrder;
    document.getElementById('editUseYn').value = m.useYn;
    openModal('menuEditModal');
  }

  function onDelete(id) {
    const m = records[id];
    if (!m) return;
    if (!window.confirm('[' + m.menuCode + '] 메뉴를 삭제할까요?')) return;
    apiDelete('/menus/' + id)
      .then(function () {
        showMessage('success', '삭제되었습니다.');
        return loadTable();
      })
      .catch(showRequestError);
  }

  document.getElementById('menuEditForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearModalMessage();
    const id = document.getElementById('editId').value;
    const parentVal = document.getElementById('editParentMenuId').value;
    const payload = {
      parentMenuId: parentVal ? Number(parentVal) : null,
      menuName: document.getElementById('editMenuName').value.trim(),
      menuType: document.getElementById('editMenuType').value,
      sortOrder: Number(document.getElementById('editSortOrder').value),
      useYn: document.getElementById('editUseYn').value,
    };
    const url = document.getElementById('editMenuUrl').value.trim();
    if (url) payload.menuUrl = url;
    const openType = document.getElementById('editOpenType').value;
    if (openType) payload.openType = openType;

    apiPatch('/menus/' + id, payload)
      .then(function () {
        closeModal('menuEditModal');
        showMessage('success', '수정되었습니다.');
        return loadTable();
      })
      .catch(showModalError);
  });

  bindRowActions(onEdit, onDelete);

  populateCodeSelects();
  loadTable();
});
