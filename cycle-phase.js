// ============================================================
// VivaSculpt — Cycle-Phase Workout Engine v4.2 (FULL FIX)
// ============================================================

(function () {
  'use strict';

  var CAL_KEY  = 'vs_cycle_days';
  var PLAN_KEY = 'vs_plan';

  var PHASE_LENS = { menstrual: 5, follicular: 9, ovulation: 2, luteal: 12 };
  var DEF_CYCLE  = 28;

  // --- Helpers ---
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

    if (day <= m) return { name:'menstrual', cycleDay:day, dayInPhase:day, color: '#ef4444', emoji: '🩸' };
    if (day <= f) return { name:'follicular', cycleDay:day, dayInPhase:day - m, color: '#3b82f6', emoji: '🌱' };
    if (day <= o) return { name:'ovulation', cycleDay:day, dayInPhase:day - f, color: '#f59e0b', emoji: '☀️' };
    if (day <= l) return { name:'luteal', cycleDay:day, dayInPhase:day - o, color: '#8b5cf6', emoji: '🌙' };

    return { name:'menstrual', cycleDay:day, dayInPhase:1, color: '#ef4444', emoji: '🩸' };
  }

  function getCurrentPhaseResult() {
    var marked = loadDays();
    if (!marked.length) return null;
    var starts = detectStarts(marked);
    var cycleLen = avgLen(starts);
    return phaseFor(todayMs(), starts, cycleLen);
  }

  function pickWorkout(phaseData, cycleDay) {
    // 1-DAY FREE STARTER PREVIEW (Always returns this if not logged in/paid)
    if (!isPaid()) {
      return {
        title: "1-Day Starter Preview",
        rounds: 3,
        moves: [
          { name: "Squat", work: 40, rest: 15, image: "assets/squats.jpg", desc: "Chair squat — touch and rise slowly" },
          { name: "Incline Push-Up", work: 40, rest: 15, image: "assets/pushups.jpg", desc: "Hands on elevated surface, core tight" },
          { name: "Plank", work: 30, rest: 15, image: "assets/plank.jpg", desc: "Keep back flat and breathe" }
        ],
        locked: false 
      };
    }
    
    // Placeholder for Pro logic (you can expand phaseData.workouts later)
    var workouts = phaseData.workouts || [{title: "Phase Session", rounds: 3, moves: []}];
    if (!isPro()) return workouts[0];
    var weekNum = Math.floor((cycleDay - 1) / 7);
    return workouts[weekNum % workouts.length];
  }

  // ========================= UPDATED PLAYER ENGINE =========================
  function showMinimalPlayer(workout, phaseData) {
    var existing = document.getElementById('phase-player-overlay');
    if (existing) existing.remove();

    var mi = 0, round = 1;
    var totalRounds = parseInt(workout.rounds) || 1;
    var timeLeft = workout.moves[0].work;
    var isRest = false, paused = false, timer = null;

    var overlay = document.createElement('div');
    overlay.id = 'phase-player-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15, 23, 42, 0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;font-family:sans-serif;padding:20px;';

    function mv() { return workout.moves[mi]; }
    function dur() { return isRest ? (mv().rest || 15) : mv().work; }

    function render() {
      var m = mv();
      var pct = timeLeft / dur();
      var circ = 2 * Math.PI * 54;
      var nextM = workout.moves[mi + 1] ? workout.moves[mi + 1].name : (round < totalRounds ? workout.moves[0].name : "Finish");

      overlay.innerHTML = `
        <div style="background:#fff; width:100%; max-width:480px; border-radius:32px; padding:35px; text-align:center; position:relative; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
          <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:12px; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">
            <span>Round ${round} / ${totalRounds}</span>
            <div style="display:flex; gap:15px; align-items:center;">
              <span style="font-size:18px;">🔊</span>
              <span id="close" style="cursor:pointer; font-size:22px;">✕</span>
            </div>
          </div>

          <div style="color:#0d9488; font-size:11px; font-weight:bold; margin-bottom:10px; letter-spacing:1px; text-transform:uppercase;">${isRest ? 'Rest' : 'Work'}</div>

          <div style="width:140px; height:140px; margin: 0 auto 15px; position:relative;">
            <svg viewBox="0 0 120 120" style="transform:rotate(-90deg); width:100%; height:100%;">
              <circle cx="60" cy="60" r="54" stroke="#f1f5f9" stroke-width="7" fill="none"/>
              <circle cx="60" cy="60" r="54" stroke="#0d9488" stroke-width="7" fill="none" 
                stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct)}" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear;"/>
            </svg>
            <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:48px; font-family:serif; color:#0f172a;">${timeLeft}</div>
          </div>

          <h2 style="font-family:serif; font-size:32px; margin:0 0 10px; color:#0f172a;">${m.name}</h2>
          
          // Replace the emoji-only block with this:
'<div style="width:100%; height:190px; background:#f8fafc; border-radius:20px; margin-bottom:20px; overflow:hidden; display:flex; align-items:center; justify-content:center; border: 1px solid #eee;">' +
    (isRest 
      ? '<div style="font-size:4.5rem;">😮‍💨</div>' 
      : '<img src="' + (mv.image || 'assets/placeholder.jpg') + '" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.src=\'https://placehold.co/400x300/e2e8f0/0d9488?text=File+Not+Found\'">') +
'</div>'

          <p style="color:#0d9488; font-size:14px; margin-bottom:5px; font-weight:500;">● ${m.desc}</p>
          <div style="color:#94a3b8; font-size:12px; margin-bottom:25px;">Next: ${nextM}</div>

          <div style="display:flex; gap:12px;">
            <button id="skip" style="flex:1; padding:18px; border:2px solid #0d9488; background:none; color:#0d9488; border-radius:15px; font-weight:bold; cursor:pointer;">Skip →</button>
            <button id="pause" style="flex:1; padding:18px; border:none; background:#0d9488; color:#fff; border-radius:15px; font-weight:bold; cursor:pointer;">${paused ? 'Resume' : 'Pause'}</button>
          </div>
        </div>
      `;

      overlay.querySelector('#close').onclick = () => { clearInterval(timer); overlay.remove(); };
      overlay.querySelector('#skip').onclick = advance;
      overlay.querySelector('#pause').onclick = () => { paused = !paused; render(); };
    }

    function advance() {
      clearInterval(timer);
      var current = mv();
      if (!isRest && (current.rest || 0) > 0) {
        isRest = true;
        timeLeft = current.rest;
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
        render(); 
      }, 1000);
    }

    function complete() {
      clearInterval(timer);
      overlay.innerHTML = '<div style="background:#fff; padding:40px; border-radius:32px; text-align:center;"><h2>Well Done!</h2><p>Session Complete.</p><button onclick="location.reload()" style="margin-top:20px; padding:12px 24px; background:#0d9488; color:#fff; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">Finish</button></div>';
    }

    document.body.appendChild(overlay);
    start();
  }

  // --- Exposed for the UI ---
  window.startVivaSession = function() {
    var phaseData = getCurrentPhaseResult() || { name: 'follicular', color: '#0d9488', emoji: '✨' };
    var workout = pickWorkout(phaseData, phaseData.cycleDay || 1);
    showMinimalPlayer(workout, phaseData);
  };

  function init() {
    var banner = document.getElementById('current-phase-banner');
    if (!banner) return;
    setTimeout(function () {
      var result = getCurrentPhaseResult();
      if (!result) return;
      banner.innerHTML += '<button onclick="window.startVivaSession()" style="margin-top:1rem; background:#0d9488; color:#fff; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">Start Today\'s Session</button>';
    }, 200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();