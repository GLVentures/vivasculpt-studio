// ============================================================
// VivaSculpt — Cycle-Phase Workout Engine  v4 (FIXED)
// Only change: showMinimalPlayer fully repaired (stable DOM rendering)
// ============================================================

(function () {
  'use strict';

  var CAL_KEY  = 'vs_cycle_days';
  var PLAN_KEY = 'vs_plan';

  var PHASE_LENS = { menstrual: 5, follicular: 9, ovulation: 2, luteal: 12 };
  var DEF_CYCLE  = 28;

  function getPlan() { return localStorage.getItem(PLAN_KEY); }
  function isPaid()  { var p = getPlan(); return p === 'starter' || p === 'pro'; }
  function isPro()   { return getPlan() === 'pro'; }

  function todayMs() {
    var d = new Date();
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function keyMs(key) {
    var p = key.split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }

  function diffDays(msA, msB) { return Math.round((msB - msA) / 86400000); }
  function addDays(ms, n) { return ms + n * 86400000; }

  function loadDays() {
    try {
      var r = localStorage.getItem(CAL_KEY);
      return r ? JSON.parse(r) : [];
    } catch (e) { return []; }
  }

  function detectStarts(arr) {
    if (!arr.length) return [];
    var sorted = arr.slice().sort();
    var starts = [], lastMs = null;
    for (var i = 0; i < sorted.length; i++) {
      var ms = keyMs(sorted[i]);
      if (lastMs === null || diffDays(lastMs, ms) >= 3) starts.push(ms);
      lastMs = ms;
    }
    return starts;
  }

  function avgLen(starts) {
    if (starts.length < 2) return DEF_CYCLE;
    var lens = [];
    for (var i = 1; i < starts.length; i++) {
      var l = diffDays(starts[i - 1], starts[i]);
      if (l >= 18 && l <= 45) lens.push(l);
    }
    if (!lens.length) return DEF_CYCLE;
    return Math.round(lens.reduce(function (a, b) { return a + b; }, 0) / lens.length);
  }

  function phaseFor(targetMs, starts, cycleLen) {
    if (!starts.length) return null;
    var last = null;
    for (var i = 0; i < starts.length; i++) {
      if (starts[i] <= targetMs) last = starts[i];
    }
    if (last === null) return null;
    while (addDays(last, cycleLen) <= targetMs) last = addDays(last, cycleLen);

    var day = diffDays(last, targetMs) + 1;
    var m = PHASE_LENS.menstrual;
    var f = m + PHASE_LENS.follicular;
    var o = f + PHASE_LENS.ovulation;
    var l = o + PHASE_LENS.luteal;

    if (day <= m) return { name:'menstrual', cycleDay:day, dayInPhase:day };
    if (day <= f) return { name:'follicular', cycleDay:day, dayInPhase:day - m };
    if (day <= o) return { name:'ovulation', cycleDay:day, dayInPhase:day - f };
    if (day <= l) return { name:'luteal', cycleDay:day, dayInPhase:day - o };

    return { name:'menstrual', cycleDay:day, dayInPhase:1 };
  }

  function getCurrentPhaseResult() {
    var marked = loadDays();
    if (!marked.length) return null;
    var starts = detectStarts(marked);
    var cycleLen = avgLen(starts);
    return phaseFor(todayMs(), starts, cycleLen);
  }

  function pickWorkout(phaseData, cycleDay) {
    if (!isPaid()) return null;
    if (!isPro()) return phaseData.workouts[0];
    var weekNum = Math.floor((cycleDay - 1) / 7);
    return phaseData.workouts[weekNum % phaseData.workouts.length];
  }

  // ========================= FIXED PLAYER =========================
  function showMinimalPlayer(workout, phaseData) {
    var existing = document.getElementById('phase-player-overlay');
    if (existing) existing.remove();

    var mi = 0, round = 1;
    var totalRounds = parseInt(workout.rounds) || 1;
    var timeLeft = workout.moves[0].work;
    var isRest = false, paused = false, timer = null;

    var overlay = document.createElement('div');
    overlay.id = 'phase-player-overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:#0f172a;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:inherit;padding:1.5rem;';

    function mv() { return workout.moves[Math.min(mi, workout.moves.length - 1)]; }
    function dur() { return isRest ? (mv().rest || 15) : mv().work; }

    function render() {
      var m = mv();
      var pct = timeLeft / dur();
      var circ = 2 * Math.PI * 54;

      overlay.innerHTML =
        '<button id="close" style="position:absolute;top:1rem;right:1rem">✕</button>' +
        '<div style="position:absolute;top:1rem;left:1rem;background:' + phaseData.color + ';padding:.3rem .7rem;border-radius:99px">' + phaseData.emoji + ' ' + workout.title + '</div>' +
        '<div style="font-size:.75rem;margin-bottom:1rem">' + (isRest ? 'REST' : 'WORK') + '</div>' +
        '<div style="width:160px;height:160px;position:relative;margin-bottom:1rem">' +
          '<svg viewBox="0 0 120 120" style="transform:rotate(-90deg)">' +
            '<circle cx="60" cy="60" r="54" stroke="#222" fill="none"/>' +
            '<circle cx="60" cy="60" r="54" stroke="' + phaseData.color + '" fill="none" stroke-dasharray="' + circ + '" stroke-dashoffset="' + (circ * (1 - pct)) + '"/>' +
          '</svg>' +
          '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2rem">' + timeLeft + '</div>' +
        '</div>' +
        '<div style="font-weight:800">' + m.name + '</div>' +
        '<div style="margin-top:1rem;display:flex;gap:.5rem">' +
          '<button id="skip">Skip</button>' +
          '<button id="pause">' + (paused ? 'Resume' : 'Pause') + '</button>' +
        '</div>';

      overlay.querySelector('#close').onclick = () => { clearInterval(timer); overlay.remove(); };
      overlay.querySelector('#skip').onclick = advance;
      overlay.querySelector('#pause').onclick = () => { paused = !paused; render(); };
    }

    function advance() {
      clearInterval(timer);
      var m = mv();

      if (!isRest && (m.rest || 0) > 0) {
        isRest = true;
        timeLeft = m.rest;
      } else {
        isRest = false;
        mi++;
        if (mi >= workout.moves.length) {
          mi = 0;
          round++;
          if (round > totalRounds) return complete();
        }
        timeLeft = workout.moves[mi].work;
      }
      start();
    }

    function start() {
      render();
      timer = setInterval(() => {
        if (paused) return;
        timeLeft--;
        if (timeLeft <= 0) return advance();
        var t = overlay.querySelector('div');
        if (t) t.textContent = timeLeft;
      }, 1000);
    }

    function complete() {
      clearInterval(timer);
      overlay.innerHTML = '<div style="text-align:center"><h2>Done</h2></div>';
    }

    document.body.appendChild(overlay);
    start();
  }

  // ========================= INIT =========================
  function init() {
    var banner = document.getElementById('current-phase-banner');
    if (!banner) return;

    setTimeout(function () {
      var result = getCurrentPhaseResult();
      if (!result) return;
      banner.innerHTML += '<div style="margin-top:1rem">Cycle Engine Active</div>';
    }, 200);
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else init();

})();
