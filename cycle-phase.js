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
    var currentMove = workout.moves[0];
    var timeLeft = currentMove.work;
    var isRest = false, paused = false, timer = null;

    var overlay = document.createElement('div');
    overlay.id = 'phase-player-overlay';
    
    // Apply full-screen styling
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#fff;color:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;padding:20px;';

    function mv() { return workout.moves[mi]; }
    function dur() { return isRest ? (mv().rest || 15) : mv().work; }

    function render() {
      var m = mv();
      var pct = timeLeft / dur();
      var circ = 2 * Math.PI * 54;
      var nextM = workout.moves[mi + 1] ? workout.moves[mi + 1].name : (round < totalRounds ? workout.moves[0].name : "Finish");

      overlay.innerHTML = `
        <div style="width:100%; max-width:500px; background:#fff; border-radius:24px; padding:30px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); text-align:center; position:relative;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; color:#94a3b8; margin-bottom:20px; text-transform:uppercase;">
            <span>Round ${round} / ${totalRounds}</span>
            <span id="close" style="cursor:pointer; font-size:18px;">✕</span>
          </div>
          
          <div style="color:${phaseData.color || '#10b981'}; font-weight:800; font-size:12px; margin-bottom:10px; text-transform:uppercase;">
            ${isRest ? 'Rest' : 'Work'}
          </div>

          <div style="width:140px; height:140px; position:relative; margin: 0 auto 20px;">
            <svg viewBox="0 0 120 120" style="transform:rotate(-90deg); width:100%; height:100%;">
              <circle cx="60" cy="60" r="54" stroke="#f1f5f9" stroke-width="8" fill="none"/>
              <circle cx="60" cy="60" r="54" stroke="${phaseData.color || '#0d9488'}" stroke-width="8" fill="none" 
                stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct)}" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear;"/>
            </svg>
            <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:42px; font-weight:300; font-family:serif;">
              ${timeLeft}
            </div>
          </div>

          <h2 style="font-family:serif; font-size:32px; margin:0 0 10px;">${m.name}</h2>
          
          <div style="width:100%; height:180px; margin-bottom:15px; border-radius:12px; overflow:hidden; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
             <img src="${m.image}" alt="${m.name}" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.style.display='none';">
          </div>

          <p style="color:#0d9488; font-size:14px; margin-bottom:20px;">● ${m.desc || 'Keep going!'}</p>
          <div style="font-size:13px; color:#64748b; margin-bottom:30px;">Next: ${nextM}</div>

          <div style="display:flex; gap:15px;">
            <button id="skip" style="flex:1; padding:16px; border-radius:12px; border:2px solid #0d9488; background:transparent; color:#0d9488; font-weight:bold; cursor:pointer;">Skip →</button>
            <button id="pause" style="flex:1; padding:16px; border-radius:12px; border:none; background:#0d9488; color:#fff; font-weight:bold; cursor:pointer;">${paused ? 'Resume' : 'Pause'}</button>
          </div>
        </div>
      `;

      overlay.querySelector('#close').onclick = () => { clearInterval(timer); overlay.remove(); };
      overlay.querySelector('#skip').onclick = advance;
      overlay.querySelector('#pause').onclick = () => { paused = !paused; render(); };
    }

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