
/* 학생 입력 저장 (localStorage). 기기/브라우저별로 저장됩니다. */
(function (global) {
  var KEY = 'wedding-project-v1';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function saveAll(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }

  var FIELDS = {
    lesson1: ['job','major','salary','satisfaction','reason',
              'gender','region','startAge','preSave','monthlyPay','monthlySave',
              'yearlySave','wishAge','weddingCost','myRatio','note'],
    lesson2: [], lesson3: [], lesson4: [], lesson5: []
  };

  var Store = {
    FIELDS: FIELDS,
    all: loadAll,
    get: function (lesson, k) { var d = loadAll(); return (d[lesson] || {})[k]; },
    set: function (lesson, k, v) {
      var d = loadAll(); if (!d[lesson]) d[lesson] = {}; d[lesson][k] = v; saveAll(d);
    },
    student: function () { return loadAll().student || {}; },
    setStudent: function (k, v) {
      var d = loadAll(); if (!d.student) d.student = {}; d.student[k] = v; saveAll(d);
    },
    /* [data-save] 가 붙은 입력칸을 자동 복원 + 자동 저장 */
    bind: function (lesson, onChange) {
      var saved = loadAll()[lesson] || {};
      var els = document.querySelectorAll('[data-save]');
      Array.prototype.forEach.call(els, function (el) {
        var k = el.getAttribute('data-save');
        if (saved[k] !== undefined && saved[k] !== null && saved[k] !== '') { el.value = saved[k]; }
        var handler = function () {
          Store.set(lesson, k, el.value);
          if (typeof onChange === 'function') { onChange(k, el); }
        };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
      });
    },
    progress: function (lesson) {
      var keys = FIELDS[lesson] || [];
      if (!keys.length) return 0;
      var d = loadAll()[lesson] || {}, n = 0;
      keys.forEach(function (k) {
        var v = d[k];
        if (v !== undefined && v !== null && String(v).trim() !== '') n++;
      });
      return Math.round(n / keys.length * 100);
    },
    exportJSON: function () {
      var d = loadAll();
      d._exportedAt = new Date().toISOString();
      var name = (d.student && d.student.name) ? d.student.name : '학생';
      var cls = (d.student && d.student.cls) ? d.student.cls : '';
      var blob = new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '결혼프로젝트_' + cls + '_' + name + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    },
    importJSON: function (file, done) {
      var r = new FileReader();
      r.onload = function () {
        try { saveAll(JSON.parse(r.result)); done(true); } catch (e) { done(false); }
      };
      r.readAsText(file);
    },
    reset: function () { localStorage.removeItem(KEY); }
  };

  /* 값을 코드로 바꿀 때는 반드시 이 함수를 쓸 것 (저장 + 재계산이 함께 일어남) */
  global.setVal = function (el, v) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.classList.add('flash');
    setTimeout(function () { el.classList.remove('flash'); }, 400);
  };

  global.WPStore = Store;
})(window);
