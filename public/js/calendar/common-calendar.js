// 홈 공통 캘린더 (읽기 전용·무인증). /calendar 와 동일한 디자인·옵션으로 렌더링한다.
// 공휴일 + 공통 태스크만 표시하며, 편집 인터랙션은 없다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('workflowCalendar');
    if (!el || !window.FullCalendar) return;

    var calendar = new FullCalendar.Calendar(el, {
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
        var params = new URLSearchParams({
          startDate: info.startStr.slice(0, 10),
          endDate: info.endStr.slice(0, 10),
        });
        fetch('/calendar/common-events?' + params.toString(), {
          headers: { Accept: 'application/json' },
        })
          .then(function (res) {
            if (!res.ok) throw new Error('common events load failed');
            return res.json();
          })
          .then(successCallback)
          .catch(failureCallback);
      },
    });

    calendar.render();
  });
})();
