(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('calendarPage');
    const calendarEl = document.getElementById('workflowCalendar');
    if (!root || !calendarEl || !window.FullCalendar || !window.axios) return;

    const state = {
      calendar: null,
      selectedDate: currentDate(),
      isAdmin: root.dataset.isAdmin === 'true',
    };

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'ko',
      timeZone: 'Asia/Seoul',
      height: 'auto',
      navLinks: true,
      dayMaxEvents: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      events: function (info, successCallback, failureCallback) {
        axios
          .get('/calendar/events', { params: rangeParams(info) })
          .then(function (response) {
            successCallback(response.data);
          })
          .catch(function (error) {
            showMessage('calendarMessage', errorMessage(error), 'danger');
            failureCallback(error);
          });
      },
      dateClick: function (info) {
        state.selectedDate = info.dateStr.slice(0, 10);
        loadDay(state.selectedDate);
        openTaskModalForCreate(state.selectedDate);
      },
      eventClick: function (info) {
        handleEventClick(info.event);
      },
      datesSet: function (info) {
        const visibleDate = state.selectedDate || info.startStr.slice(0, 10);
        loadDay(visibleDate);
      },
    });

    state.calendar = calendar;
    calendar.render();
    bindTaskModal(state);
    bindDayForm(state);
    loadDay(state.selectedDate);

    const newTaskButton = document.getElementById('newTaskButton');
    if (newTaskButton) {
      newTaskButton.addEventListener('click', function () {
        openTaskModalForCreate(state.selectedDate || currentDate());
      });
    }

    document.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const closeButton = target.closest('[data-modal-close]');
      const modalOverlay = target.classList.contains('modal-overlay') ? target : null;
      if (closeButton || modalOverlay) {
        closeTaskModal();
      }
    });

    function handleEventClick(event) {
      const id = event.id || '';
      if (id.indexOf('holiday:') === 0) {
        state.selectedDate = event.startStr.slice(0, 10);
        loadDay(state.selectedDate);
        return;
      }

      const parts = id.split(':');
      const type = parts[0];
      const taskId = parts[1];
      if (!taskId) return;

      if (type === 'personal') {
        loadTask('PERSONAL', taskId);
        return;
      }

      if (type === 'common' && state.isAdmin) {
        loadTask('COMMON', taskId);
        return;
      }

      showMessage(
        'calendarMessage',
        '공통 태스크는 관리자 캘린더에서 수정할 수 있습니다.',
        'warning',
      );
    }

    function loadDay(calendarDate) {
      axios
        .get('/calendar/days', {
          params: {
            startDate: calendarDate,
            endDate: nextDate(calendarDate),
          },
        })
        .then(function (response) {
          const day = Array.isArray(response.data) ? response.data[0] : null;
          renderDay(day);
        })
        .catch(function (error) {
          showMessage('calendarMessage', errorMessage(error), 'danger');
        });
    }

    function renderDay(day) {
      const selectedDateLabel = document.getElementById('selectedDateLabel');
      const selectedDayOfWeek = document.getElementById('selectedDayOfWeek');
      const selectedWorkday = document.getElementById('selectedWorkday');
      const selectedHoliday = document.getElementById('selectedHoliday');
      if (!day) return;

      setText(selectedDateLabel, day.calendarDate);
      setText(selectedDayOfWeek, dayLabel(day.dayOfWeek));
      setText(selectedWorkday, day.isWorkday ? '근무일' : '휴무일');
      setText(selectedHoliday, day.isHoliday ? day.holidayName || '공휴일' : '아님');

      const form = document.getElementById('calendarDayForm');
      if (!form) return;
      form.classList.remove('d-none');
      setValue('dayCalendarDate', day.calendarDate);
      setChecked('dayIsHoliday', day.isHoliday);
      setValue('dayHolidayName', day.holidayName || '');
      setChecked('dayIsWorkday', day.isWorkday);
    }

    function loadTask(type, taskId) {
      axios
        .get(taskUrl(type, taskId))
        .then(function (response) {
          openTaskModalForEdit(type, response.data);
        })
        .catch(function (error) {
          showMessage('calendarMessage', errorMessage(error), 'danger');
        });
    }

    function refetchCalendar() {
      if (state.calendar) {
        state.calendar.refetchEvents();
      }
    }

    window.workflowCalendarState = {
      refetchCalendar: refetchCalendar,
      loadDay: loadDay,
      isAdmin: state.isAdmin,
    };
  });

  function bindTaskModal(state) {
    const form = document.getElementById('taskForm');
    const typeSelect = document.getElementById('taskType');
    const deleteButton = document.getElementById('deleteTaskButton');
    if (!form || !typeSelect || !deleteButton) return;

    typeSelect.addEventListener('change', function () {
      syncTaskTypeFields(typeSelect.value);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const type = typeSelect.value;
      if (type === 'COMMON' && !state.isAdmin) return;

      const taskId = valueOf('taskId');
      const payload = taskPayload(type);
      const request = taskId
        ? axios.patch(taskUrl(type, taskId), payload)
        : axios.post(taskCollectionUrl(type), payload);

      request
        .then(function () {
          closeTaskModal();
          state.calendar.refetchEvents();
          state.selectedDate = payload.calendarDate;
          if (window.workflowCalendarState) {
            window.workflowCalendarState.loadDay(payload.calendarDate);
          }
        })
        .catch(function (error) {
          showMessage('taskMessage', errorMessage(error), 'danger');
        });
    });

    deleteButton.addEventListener('click', function () {
      const type = typeSelect.value;
      const taskId = valueOf('taskId');
      if (!taskId || (type === 'COMMON' && !state.isAdmin)) return;

      axios
        .delete(taskUrl(type, taskId))
        .then(function () {
          closeTaskModal();
          state.calendar.refetchEvents();
        })
        .catch(function (error) {
          showMessage('taskMessage', errorMessage(error), 'danger');
        });
    });
  }

  function bindDayForm(state) {
    const form = document.getElementById('calendarDayForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!state.isAdmin) return;

      const calendarDate = valueOf('dayCalendarDate');
      axios
        .patch('/calendar/days/' + encodeURIComponent(calendarDate), {
          isHoliday: checkedOf('dayIsHoliday'),
          holidayName: emptyToNull(valueOf('dayHolidayName')),
          isWorkday: checkedOf('dayIsWorkday'),
        })
        .then(function () {
          showMessage('calendarMessage', '날짜 정보가 저장되었습니다.', 'success');
          state.calendar.refetchEvents();
          if (window.workflowCalendarState) {
            window.workflowCalendarState.loadDay(calendarDate);
          }
        })
        .catch(function (error) {
          showMessage('calendarMessage', errorMessage(error), 'danger');
        });
    });
  }

  function openTaskModalForCreate(calendarDate) {
    setText(document.getElementById('taskModalTitle'), '태스크 등록');
    setValue('taskId', '');
    setValue('taskCalendarDate', calendarDate);
    setValue('taskTitle', '');
    setValue('taskContent', '');
    setValue('taskStatus', 'TODO');
    setValue('taskPriority', 'NORMAL');
    setValue('taskCategory', '');
    setValue('taskStartTime', '');
    setValue('taskEndTime', '');
    setValue('taskType', 'PERSONAL');
    syncTaskTypeFields('PERSONAL');
    clearMessage('taskMessage');
    hideElement('deleteTaskButton');
    openTaskModal();
  }

  function openTaskModalForEdit(type, task) {
    setText(document.getElementById('taskModalTitle'), '태스크 수정');
    setValue('taskId', task.personalTaskId || task.commonTaskId || '');
    setValue('taskType', type);
    setValue('taskCalendarDate', task.calendarDate || '');
    setValue('taskTitle', task.title || '');
    setValue('taskContent', task.content || '');
    setValue('taskStatus', task.status || 'TODO');
    setValue('taskPriority', task.priority || 'NORMAL');
    setValue('taskCategory', task.category || '');
    setValue('taskStartTime', trimTime(task.startTime));
    setValue('taskEndTime', trimTime(task.endTime));
    syncTaskTypeFields(type);
    clearMessage('taskMessage');
    showElement('deleteTaskButton');
    openTaskModal();
  }

  function openTaskModal() {
    const modal = document.getElementById('taskModal');
    if (!modal) return;
    modal.classList.remove('d-none');
    modal.setAttribute('aria-hidden', 'false');
    const title = document.getElementById('taskTitle');
    if (title) title.focus();
  }

  function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    if (!modal) return;
    modal.classList.add('d-none');
    modal.setAttribute('aria-hidden', 'true');
  }

  function syncTaskTypeFields(type) {
    document.querySelectorAll('[data-personal-field]').forEach(function (el) {
      el.classList.toggle('d-none', type !== 'PERSONAL');
    });
    document.querySelectorAll('[data-common-field]').forEach(function (el) {
      el.classList.toggle('d-none', type !== 'COMMON');
    });
  }

  function taskPayload(type) {
    const payload = {
      calendarDate: valueOf('taskCalendarDate'),
      title: valueOf('taskTitle'),
      content: emptyToNull(valueOf('taskContent')),
      status: valueOf('taskStatus'),
      startTime: emptyToNull(valueOf('taskStartTime')),
      endTime: emptyToNull(valueOf('taskEndTime')),
    };

    if (type === 'PERSONAL') {
      payload.priority = emptyToNull(valueOf('taskPriority')) || 'NORMAL';
    }
    if (type === 'COMMON') {
      payload.category = emptyToNull(valueOf('taskCategory'));
    }

    return payload;
  }

  function taskCollectionUrl(type) {
    return type === 'COMMON'
      ? '/calendar/common-tasks'
      : '/calendar/personal-tasks';
  }

  function taskUrl(type, taskId) {
    return taskCollectionUrl(type) + '/' + encodeURIComponent(taskId);
  }

  function rangeParams(info) {
    return {
      startDate: info.startStr.slice(0, 10),
      endDate: info.endStr.slice(0, 10),
    };
  }

  function currentDate() {
    const parts = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const year = partValue(parts, 'year');
    const month = partValue(parts, 'month');
    const day = partValue(parts, 'day');
    return year + '-' + month + '-' + day;
  }

  function partValue(parts, type) {
    const found = parts.find(function (part) {
      return part.type === type;
    });
    return found ? found.value : '';
  }

  function nextDate(dateText) {
    const date = new Date(dateText + 'T00:00:00Z');
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  }

  function dayLabel(code) {
    const labels = {
      MON: '월요일',
      TUE: '화요일',
      WED: '수요일',
      THU: '목요일',
      FRI: '금요일',
      SAT: '토요일',
      SUN: '일요일',
    };
    return labels[code] || code || '-';
  }

  function trimTime(value) {
    return value ? String(value).slice(0, 5) : '';
  }

  function valueOf(id) {
    const element = document.getElementById(id);
    return element && 'value' in element ? element.value : '';
  }

  function setValue(id, value) {
    const element = document.getElementById(id);
    if (element && 'value' in element) {
      element.value = value;
    }
  }

  function checkedOf(id) {
    const element = document.getElementById(id);
    return element && 'checked' in element ? element.checked : false;
  }

  function setChecked(id, value) {
    const element = document.getElementById(id);
    if (element && 'checked' in element) {
      element.checked = Boolean(value);
    }
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value == null ? '' : String(value);
    }
  }

  function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.classList.remove('d-none');
  }

  function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.classList.add('d-none');
  }

  function emptyToNull(value) {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  function showMessage(id, message, type) {
    const element = document.getElementById(id);
    if (!element) return;
    element.className = type ? 'alert alert-' + type : '';
    element.textContent = message || '';
  }

  function clearMessage(id) {
    showMessage(id, '', '');
  }

  function errorMessage(error) {
    const data = error && error.response && error.response.data;
    if (data && Array.isArray(data.message)) {
      return data.message.join('\n');
    }
    if (data && data.message) {
      return data.message;
    }
    return '처리 중 오류가 발생했습니다.';
  }
})();
