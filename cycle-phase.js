// ============================================================
// VivaSculpt — Cycle-Phase Workout Engine  v4.1 (IMAGE ENABLED)
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

  // ... [Keep your existing calendar logic functions: todayMs, keyMs, diffDays, loadDays, etc.] ...

  function pickWorkout(phaseData, cycleDay) {
    // 1-DAY FREE STARTER PREVIEW
    if (!isPaid()) {
      return {
        title: "1-Day Starter Preview",
        rounds: 3,
        moves: [
          { 
            name: "Squat", 
            work: 40, 
            rest: 15, 
            image: "assets/squats.jpg", // Ensure these paths match your folder
            desc: "Chair squat — touch and rise slowly" 
          },
          { 
            name: "Incline Push-Up", 
            work: 40, 
            rest: 15, 
            image: "assets/pushups.jpg",
            desc: "Hands on elevated surface, core tight"
          },
          { 
            name: "Plank", 
            work: 30, 
            rest: 15, 
            image: "assets/plank.jpg",
            desc: "Keep back flat and breathe"
          }
        ],
        locked: false 
      };
    }
    
    // Normal Paid Logic
    if (!isPro()) return phaseData.workouts[0];
    var weekNum = Math.floor((cycleDay - 1) / 7);
    return phaseData.workouts[weekNum % phaseData.workouts.length];
  }

  // ========================= UPDATED PLAYER WITH IMAGES =========================
 function showMinimalPlayer(workout, phaseData) {
    var existing = document.getElementById('phase-player-overlay');
    if (existing) existing.remove();

    var mi = 0, round = 1;
    var totalRounds = parseInt(workout.rounds) || 1;
    var timeLeft = workout.moves[0].work;
    var isRest = false, paused = false, timer = null;

    var overlay = document.createElement('div');
    overlay.id = 'phase-player-overlay';
    
    // Updated styling to match your screenshot exactly
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15, 23, 42, 0.9);display:flex;align-items:center;justify-content:center;font-family:inherit;padding:20px;';

    function mv() { return workout.moves[mi]; }
    function dur() { return isRest ? (mv().rest || 15) : mv().work; }

    function render() {
      var m = mv();
      var pct = timeLeft / dur();
      var circ = 2 * Math.PI * 54;
      var nextM = workout.moves[mi + 1] ? workout.moves[mi + 1].name : (round < totalRounds ? workout.moves[0].name : "Finish");

      overlay.innerHTML = `
        <div style="background:#fff; width:100%; max-width:500px; border-radius:32px; padding:40px; text-align:center; position:relative; box-shadow:0 20px-25px rgba(0,0,0,0.2);">
          <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:12px; font-weight:bold; margin-bottom:20px;">
            <span>ROUND ${round} / ${totalRounds}</span>
            <span id="close" style="cursor:pointer; font-size:20px;">✕</span>
          </div>

          <div style="color:#0d9488; font-size:12px; font-weight:bold; margin-bottom:10px; letter-spacing:1px;">${isRest ? 'REST' : 'WORK'}</div>

          <div style="width:140px; height:140px; margin: 0 auto 20px; position:relative;">
            <svg viewBox="0 0 120 120" style="transform:rotate(-90deg); width:100%; height:100%;">
              <circle cx="60" cy="60" r="54" stroke="#f1f5f9" stroke-width="6" fill="none"/>
              <circle cx="60" cy="60" r="54" stroke="#0d9488" stroke-width="6" fill="none" 
                stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct)}" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear;"/>
            </svg>
            <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:48px; font-family:serif;">${timeLeft}</div>
          </div>

          <h2 style="font-family:serif; font-size:36px; margin:0 0 15px;">${m.name}</h2>
          
          <div style="width:100%; height:200px; background:#f8fafc; border-radius:16px; margin-bottom:20px; overflow:hidden; display:flex; align-items:center; justify-content:center;">
            <img src="${m.image}" style="max-width:100%; max-height:100%; object-fit:cover;" onerror="this.src='https://via.placeholder.com/400x300?text=Exercise+Image'">
          </div>

          <p style="color:#0d9488; font-size:15px; margin-bottom:10px;">● ${m.desc || 'Focus on your form'}</p>
          <div style="color:#64748b; font-size:13px; margin-bottom:30px;">Next: ${nextM}</div>

          <div style="display:flex; gap:15px;">
            <button id="skip" style="flex:1; padding:18px; border:2px solid #0d9488; background:none; color:#0d9488; border-radius:12px; font-weight:bold; cursor:pointer;">Skip →</button>
            <button id="pause" style="flex:1; padding:18px; border:none; background:#0d9488; color:#fff; border-radius:12px; font-weight:bold; cursor:pointer;">${paused ? 'Resume' : 'Pause'}</button>
          </div>
        </div>
      `;

      overlay.querySelector('#close').onclick = () => { clearInterval(timer); overlay.remove(); };
      overlay.querySelector('#skip').onclick = advance;
      overlay.querySelector('#pause').onclick = () => { paused = !paused; render(); };
    }
    // ... rest of start/advance functions ...

    // ... [Rest of the logic: advance(), start(), complete() remain the same] ...

    function advance() {
      clearInterval(timer);
      if (!isRest && (mv().rest || 0) > 0) {
        isRest = true;
        timeLeft = mv().rest;
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
        render(); // Full re-render to update SVG and Text
      }, 1000);
    }

    function complete() {
      clearInterval(timer);
      overlay.innerHTML = '<div style="text-align:center"><h2>Workout Complete!</h2><button onclick="location.reload()">Back to Dashboard</button></div>';
    }

    document.body.appendChild(overlay);
    start();
  }

  // [Init function stays the same]
  function init() {
    var banner = document.getElementById('current-phase-banner');
    if (!banner) return;
    setTimeout(function () {
      var result = getCurrentPhaseResult();
      if (!result) return;
      banner.innerHTML += '<div style="margin-top:1rem">Cycle Engine Active</div>';
    }, 200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();