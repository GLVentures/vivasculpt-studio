'use strict';

/* ═══════════════════════════════════════════════════
   VivaSculpt Studio — app.js (28-Day System)
   ═══════════════════════════════════════════════════ */

function safeText(el, str) { if (el) el.textContent = String(str); }
function $(id) { return document.getElementById(id); }

/* ─── STORAGE ─── */
var PLAN_KEY      = 'vs_plan';
var PROGRESS_KEY  = 'vs_28_progress';
var STREAK_KEY    = 'vs_streak';
var STREAK_DATE   = 'vs_streak_date';
var INTENSITY_KEY = 'vs_intensity';
var PWA_KEY       = 'vs_pwa_dismissed';

function getPlan() { return localStorage.getItem(PLAN_KEY) || null; }
function setPlan(p) { localStorage.setItem(PLAN_KEY, p); localStorage.setItem('vs_plan_date', Date.now().toString()); }
function isPaid() { var p = getPlan(); return p === 'starter' || p === 'pro'; }
function isPro()  { return getPlan() === 'pro'; }

function getProgress() {
  try { var r = localStorage.getItem(PROGRESS_KEY); return r ? JSON.parse(r) : {currentDay:1,completedDays:[],startDate:null}; }
  catch(e) { return {currentDay:1,completedDays:[],startDate:null}; }
}
function saveProgress(p) { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch(e) {} }
function isDayCompleted(n) { return getProgress().completedDays.indexOf(n) !== -1; }
function getCurrentDay() { return Math.min(getProgress().currentDay || 1, 28); }
function markDayComplete(n) {
  var p = getProgress();
  if (p.completedDays.indexOf(n) === -1) p.completedDays.push(n);
  if (!p.startDate) p.startDate = new Date().toISOString();
  if (n >= p.currentDay && n < 28) p.currentDay = n + 1;
  saveProgress(p);
  incrementStreak();
}

function getStreak() { return parseInt(localStorage.getItem(STREAK_KEY) || '0', 10); }
function incrementStreak() {
  var last = localStorage.getItem(STREAK_DATE);
  var today = new Date().toDateString();
  if (last === today) return;
  localStorage.setItem(STREAK_KEY, (getStreak() + 1).toString());
  localStorage.setItem(STREAK_DATE, today);
}
function didMissYesterday() {
  var last = localStorage.getItem(STREAK_DATE);
  if (!last) return false;
  var today = new Date().toDateString();
  var yesterday = new Date(Date.now() - 86400000).toDateString();
  return last !== today && last !== yesterday;
}

var currentIntensity = localStorage.getItem(INTENSITY_KEY) || 'low';

/* ─── TAB NAVIGATION ─── */
function switchTab(tabId) {
  document.querySelectorAll('.tab-section').forEach(function(s) { s.classList.remove('active'); s.hidden = true; });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); b.removeAttribute('aria-current'); });
  var sec = document.getElementById('tab-' + tabId);
  var btn = document.querySelector('[data-tab="' + tabId + '"]');
  if (sec) { sec.classList.add('active'); sec.hidden = false; }
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-current','page'); }
  if (tabId === 'today') renderTodayView();
  if (tabId === 'program') renderProgramView();
  if (tabId === 'pricing') updatePlanBadge();
  if (typeof gtag !== 'undefined') gtag('event','page_view',{page_title:tabId});
}
document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { switchTab(btn.dataset.tab); });
});

/* ─── MODALS ─── */
function openModal(id) {
  var m = document.getElementById(id); if (!m) return; m.hidden = false;
  requestAnimationFrame(function() { var f = m.querySelector('button,input,a'); if (f) f.focus(); });
}
function closeModal(id) { var m = document.getElementById(id); if (m) m.hidden = true; }
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay:not([hidden])').forEach(function(m) {
    if (m.id !== 'modal-paywall') closeModal(m.id);
  });
});
document.querySelectorAll('.modal-overlay').forEach(function(o) {
  o.addEventListener('click', function(e) { if (e.target === o && o.id !== 'modal-paywall') closeModal(o.id); });
});
document.querySelectorAll('[data-close]').forEach(function(btn) { btn.addEventListener('click', function() { closeModal(btn.dataset.close); }); });
document.querySelectorAll('[data-modal]').forEach(function(btn) { btn.addEventListener('click', function() { openModal('modal-' + btn.dataset.modal); }); });
var secBtn = document.getElementById('btn-security');
if (secBtn) secBtn.addEventListener('click', function() { openModal('modal-security'); });

/* ─── PLAN BADGE ─── */
function updatePlanBadge() {
  var badge = document.getElementById('header-plan-badge');
  var card  = document.getElementById('active-plan-card');
  var plan  = getPlan();
  if (!badge) return;
  if (!plan) { badge.classList.add('hidden'); if (card) card.classList.add('hidden'); return; }
  badge.classList.remove('hidden');
  safeText(badge, plan === 'pro' ? 'Pro ✦' : 'Starter');
  if (card) { card.classList.remove('hidden'); safeText(card, plan === 'pro' ? '✨ Pro plan active — full 28-day access' : '✅ Starter plan active'); }
}

/* ─── TODAY VIEW ─── */
function renderTodayView() {
  var paid = isPaid();
  var freeEl  = document.getElementById('free-today');
  var paidEl  = document.getElementById('paid-today');
  if (!freeEl || !paidEl) return;

  if (!paid) {
    freeEl.classList.remove('hidden');
    paidEl.classList.add('hidden');
    buildWeekPreviews();
    buildReviews('reviews-track-free');
    return;
  }

  freeEl.classList.add('hidden');
  paidEl.classList.remove('hidden');

  var dayNum  = getCurrentDay();
  var dayData = ALL_DAYS[dayNum - 1];
  if (!dayData) return;

  // Progress bar
  var pct = Math.round(((dayNum - 1) / 28) * 100);
  var fill = document.getElementById('progress-bar-fill');
  var pctEl = document.getElementById('progress-pct');
  var dayLbl = document.getElementById('progress-day-label');
  var wkLbl  = document.getElementById('week-label');
  if (fill) fill.style.width = pct + '%';
  safeText(pctEl, pct + '%');
  safeText(dayLbl, 'Day ' + dayNum + ' of 28');
  safeText(wkLbl, 'Week ' + dayData.week + ' — ' + dayData.weekName);

  // Streak
  var streak = getStreak();
  safeText(document.getElementById('streak-count'), streak);
  var missWarn = document.getElementById('missed-warning');
  if (missWarn) {
    if (didMissYesterday() && streak > 0) missWarn.classList.remove('hidden');
    else missWarn.classList.add('hidden');
  }

  // Already completed today?
  if (isDayCompleted(dayNum)) {
    showCompletedState(dayNum, dayData);
    return;
  }

  // Show mission or recovery
  if (dayData.type === 'recovery') {
    showRecoveryCard(dayNum, dayData);
  } else {
    showMissionCard(dayNum, dayData);
  }

  // Locked future days
  buildLockedPreview(dayNum);
}

function showMissionCard(dayNum, dayData) {
  document.getElementById('mission-card').classList.remove('hidden');
  document.getElementById('recovery-card').classList.add('hidden');
  document.getElementById('completed-card').classList.add('hidden');

  safeText(document.getElementById('mission-day-num'), 'Day ' + dayNum);
  safeText(document.getElementById('mission-week-tag'), 'Week ' + dayData.week + ' · ' + dayData.weekPhase.charAt(0).toUpperCase() + dayData.weekPhase.slice(1));
  safeText(document.getElementById('mission-title'), dayData.title);
  safeText(document.getElementById('mission-duration'), dayData.duration + ' min');
  safeText(document.getElementById('mission-tag'), dayData.tag);
  safeText(document.getElementById('mission-rounds'), dayData.rounds + ' rounds');

  // Moves list
  var movesEl = document.getElementById('mission-moves');
  if (movesEl) {
    movesEl.innerHTML = '';
    dayData.moves.forEach(function(move) {
      var row = document.createElement('div'); row.className = 'move-row';
      var name = document.createElement('div'); name.className = 'move-name'; safeText(name, move.name);
      var reps = document.createElement('div'); reps.className = 'move-reps'; safeText(reps, move.reps);
      var mod  = document.createElement('div'); mod.className  = 'move-mod';
      safeText(mod, currentIntensity === 'low' ? '🟢 ' + move.low : '🔴 ' + move.classic);
      row.appendChild(name); row.appendChild(reps); row.appendChild(mod);
      movesEl.appendChild(row);
    });

    // Intensity toggle
    var toggle = document.createElement('div'); toggle.className = 'intensity-toggle';
    var lowBtn = document.createElement('button'); lowBtn.className = 'itog-btn' + (currentIntensity === 'low' ? ' active' : '');
    safeText(lowBtn, '🟢 Low-Impact');
    var clsBtn = document.createElement('button'); clsBtn.className = 'itog-btn' + (currentIntensity === 'classic' ? ' active' : '');
    safeText(clsBtn, '🔴 Classic');
    lowBtn.addEventListener('click', function() { setIntensity('low'); renderTodayView(); });
    clsBtn.addEventListener('click', function() { setIntensity('classic'); renderTodayView(); });
    toggle.appendChild(lowBtn); toggle.appendChild(clsBtn);
    movesEl.appendChild(toggle);
  }

  // Meal card
  buildMealCard(document.getElementById('mission-meal'), dayData.meal);
}

function showRecoveryCard(dayNum, dayData) {
  document.getElementById('mission-card').classList.add('hidden');
  document.getElementById('completed-card').classList.add('hidden');
  document.getElementById('recovery-card').classList.remove('hidden');

  safeText(document.getElementById('recovery-title'), 'Day ' + dayNum + ' — ' + dayData.title);
  safeText(document.getElementById('recovery-desc'), dayData.description);
  buildMealCard(document.getElementById('recovery-meal'), dayData.meal);
}

function showCompletedState(dayNum, dayData) {
  document.getElementById('mission-card').classList.add('hidden');
  document.getElementById('recovery-card').classList.add('hidden');
  document.getElementById('completed-card').classList.remove('hidden');

  var nextDay = dayNum < 28 ? dayNum + 1 : null;
  var sub = nextDay ? 'Come back tomorrow for Day ' + nextDay + '.' : 'You completed the full 28-day system. 🏆';
  safeText(document.getElementById('completed-sub'), sub);
  safeText(document.getElementById('streak-reward'), '🔥 ' + getStreak() + ' day streak');
}

function buildMealCard(el, meal) {
  if (!el || !meal) return;
  el.innerHTML = '';
  var wrap = document.createElement('div'); wrap.className = 'meal-highlight';
  var lbl  = document.createElement('div'); lbl.className  = 'meal-highlight-label'; safeText(lbl, "Today's Meal");
  var name = document.createElement('div'); name.className = 'meal-highlight-name';  safeText(name, meal.name);
  var desc = document.createElement('div'); desc.className = 'meal-highlight-desc';  safeText(desc, meal.desc);
  var mac  = document.createElement('div'); mac.className  = 'meal-highlight-macro'; safeText(mac, meal.macros);
  wrap.appendChild(lbl); wrap.appendChild(name); wrap.appendChild(desc); wrap.appendChild(mac);
  el.appendChild(wrap);
}

function buildLockedPreview(currentDay) {
  var el = document.getElementById('locked-preview'); if (!el) return;
  el.innerHTML = '';
  var header = document.createElement('div'); header.className = 'locked-header'; safeText(header, 'Coming up 🔒');
  el.appendChild(header);
  var count = 0;
  for (var i = currentDay; i <= 28 && count < 5; i++) {
    var d = ALL_DAYS[i];
    if (!d) break;
    var item = document.createElement('div'); item.className = 'locked-day-item';
    var dayLabel = document.createElement('div'); dayLabel.className = 'locked-day-label'; safeText(dayLabel, 'Day ' + d.day);
    var dayTitle = document.createElement('div'); dayTitle.className = 'locked-day-title'; safeText(dayTitle, d.title);
    var lockIcon = document.createElement('div'); lockIcon.className = 'lock-icon'; safeText(lockIcon, '🔒');
    item.appendChild(dayLabel); item.appendChild(dayTitle); item.appendChild(lockIcon);
    el.appendChild(item);
    count++;
  }
}

/* ─── START WORKOUT ─── */
var workoutState = { moves:[], idx:0, round:1, totalRounds:3, phase:'work', timeLeft:40, paused:false, interval:null, dayNum:0 };

document.getElementById('btn-mission-start').addEventListener('click', function() {
  var dayNum  = getCurrentDay();
  var dayData = ALL_DAYS[dayNum - 1];
  if (!dayData || !dayData.moves.length) return;
  startWorkoutSession(dayData.moves, dayData.rounds, dayNum);
});

function startWorkoutSession(moves, rounds, dayNum) {
  clearInterval(workoutState.interval);
  workoutState = { moves:moves, idx:0, round:1, totalRounds:rounds, phase:'work', timeLeft:40, paused:false, interval:null, dayNum:dayNum };
  updatePlayerUI();
  openModal('modal-workout');
  if (typeof gtag !== 'undefined') gtag('event','workout_start',{day:dayNum});
  workoutState.interval = setInterval(tickWorkout, 1000);
}

var CIRC = 2 * Math.PI * 54;
function updatePlayerUI() {
  var w = workoutState;
  var move = w.moves[w.idx];
  safeText(document.getElementById('player-round'), 'Round ' + w.round + ' / ' + w.totalRounds);
  var phEl = document.getElementById('player-phase');
  safeText(phEl, w.phase === 'work' ? 'WORK' : 'REST');
  phEl.classList.toggle('rest-phase', w.phase === 'rest');
  var ring = document.getElementById('ring-fg');
  var total = w.phase === 'work' ? 40 : 20;
  if (ring) { ring.style.strokeDashoffset = CIRC * (1 - w.timeLeft / total); ring.classList.toggle('rest-ring', w.phase === 'rest'); }
  safeText(document.getElementById('player-time'), w.timeLeft);
  safeText(document.getElementById('player-move'), move ? move.name : '–');
  var modEl = document.getElementById('player-mod');
  if (modEl) safeText(modEl, move ? (currentIntensity === 'low' ? '🟢 ' + move.low : '🔴 ' + move.classic) : '');
  var nextMove = w.moves[w.idx + 1];
  var nextEl = document.getElementById('player-next-move');
  var nextLbl = document.querySelector('.next-label');
  if (w.phase === 'rest') { safeText(nextEl, move ? move.name : '–'); if (nextLbl) safeText(nextLbl, 'Up next:'); }
  else { safeText(nextEl, nextMove ? nextMove.name : 'Last move!'); if (nextLbl) safeText(nextLbl, 'Next:'); }
  safeText(document.getElementById('btn-pause'), w.paused ? 'Resume' : 'Pause');
}

function tickWorkout() {
  var w = workoutState;
  if (w.paused) return;
  w.timeLeft--;
  if (w.timeLeft <= 0) {
    if (w.phase === 'work') { w.phase = 'rest'; w.timeLeft = 20; beep(330,.15,.08); }
    else {
      w.idx++;
      if (w.idx >= w.moves.length) {
        if (w.round < w.totalRounds) { w.round++; w.idx = 0; w.phase = 'work'; w.timeLeft = 40; beep(660,.2,.15); }
        else { finishWorkout(); return; }
      } else { w.phase = 'work'; w.timeLeft = 40; }
    }
  } else if (w.timeLeft <= 3 && w.phase === 'work') beep(880,.08,.05);
  updatePlayerUI();
}

function finishWorkout() {
  clearInterval(workoutState.interval);
  workoutState.interval = null;
  closeModal('modal-workout');
  openModal('modal-complete');
}

document.getElementById('btn-complete-done').addEventListener('click', function() {
  closeModal('modal-complete');
  completeTodayDay();
});

document.getElementById('btn-done-day').addEventListener('click', function() { completeTodayDay(); });
document.getElementById('btn-done-recovery').addEventListener('click', function() { completeTodayDay(); });

function completeTodayDay() {
  var dayNum = getCurrentDay();
  markDayComplete(dayNum);
  var streak = getStreak();
  var dayData = ALL_DAYS[dayNum - 1];
  var msgs = ['"You showed up today."','"Consistency is becoming your default."','"No negotiation. Just action."','"Another day. Another rep."','"Your future self remembers this."','"One session closer."','"This is who you are now."'];
  var msg = msgs[Math.floor(Math.random() * msgs.length)];
  safeText(document.getElementById('day-done-title'), dayNum === 28 ? 'System Complete! 🏆' : 'Day ' + dayNum + ' Done.');
  safeText(document.getElementById('day-done-message'), msg);
  safeText(document.getElementById('day-done-streak'), '🔥 ' + streak + ' day' + (streak !== 1 ? 's' : '') + ' disciplined');
  openModal('modal-day-done');
  setTimeout(function() { renderTodayView(); }, 300);
}

/* ─── AUDIO ─── */
var audioCtx = null;
var audioEnabled = true;
function beep(freq, dur, vol) {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = audioCtx.createOscillator(); var gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + dur);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}
var audioBtn = document.getElementById('btn-audio');
if (audioBtn) audioBtn.addEventListener('click', function() {
  audioEnabled = !audioEnabled;
  audioBtn.setAttribute('aria-pressed', audioEnabled);
  document.getElementById('icon-audio-on').style.display  = audioEnabled ? '' : 'none';
  document.getElementById('icon-audio-off').style.display = audioEnabled ? 'none' : '';
});
var pauseBtn = document.getElementById('btn-pause');
if (pauseBtn) pauseBtn.addEventListener('click', function() {
  workoutState.paused = !workoutState.paused;
  safeText(pauseBtn, workoutState.paused ? 'Resume' : 'Pause');
});
var nextBtn = document.getElementById('btn-next-move');
if (nextBtn) nextBtn.addEventListener('click', function() {
  var w = workoutState; w.idx++;
  if (w.idx >= w.moves.length) { if (w.round < w.totalRounds) { w.round++; w.idx = 0; w.phase = 'work'; w.timeLeft = 40; } else { finishWorkout(); return; } }
  else { w.phase = 'work'; w.timeLeft = 40; }
  updatePlayerUI();
});
var endBtn = document.getElementById('btn-end-workout');
if (endBtn) endBtn.addEventListener('click', function() {
  clearInterval(workoutState.interval); closeModal('modal-workout');
});

/* ─── PROGRAM VIEW ─── */
function renderProgramView() {
  var el = document.getElementById('program-view'); if (!el) return;
  el.innerHTML = '';
  var paid = isPaid();
  var currentDay = getCurrentDay();

  PROGRAM.weeks.forEach(function(week) {
    var weekCard = document.createElement('div'); weekCard.className = 'week-card';

    var weekHeader = document.createElement('div'); weekHeader.className = 'week-header';
    weekHeader.style.borderLeftColor = week.color;
    var wNum = document.createElement('div'); wNum.className = 'week-num'; safeText(wNum, 'Week ' + week.num);
    var wName = document.createElement('div'); wName.className = 'week-name'; safeText(wName, week.name);
    var wGoal = document.createElement('div'); wGoal.className = 'week-goal'; safeText(wGoal, week.goal);
    weekHeader.appendChild(wNum); weekHeader.appendChild(wName); weekHeader.appendChild(wGoal);
    weekCard.appendChild(weekHeader);

    var dayList = document.createElement('div'); dayList.className = 'day-list';

    week.days.forEach(function(day) {
      var isCompleted = isDayCompleted(day.day);
      var isCurrent   = day.day === currentDay;
      var isLocked    = !paid && day.day > 1;

      var item = document.createElement('div');
      item.className = 'day-list-item' + (isCompleted ? ' completed' : '') + (isCurrent ? ' current' : '') + (isLocked ? ' locked' : '');

      var dayNum = document.createElement('div'); dayNum.className = 'dli-num';
      safeText(dayNum, isCompleted ? '✓' : (isLocked ? '🔒' : day.day));

      var info = document.createElement('div'); info.className = 'dli-info';
      var title = document.createElement('div'); title.className = 'dli-title'; safeText(title, day.title);
      var meta  = document.createElement('div'); meta.className  = 'dli-meta';
      safeText(meta, day.type === 'recovery' ? 'Recovery · ' + day.duration + ' min' : day.duration + ' min · ' + day.tag);
      info.appendChild(title); info.appendChild(meta);

      var status = document.createElement('div'); status.className = 'dli-status';
      if (isCompleted) safeText(status, '✅');
      else if (isCurrent) safeText(status, '▶');
      else if (isLocked) safeText(status, '🔒');

      item.appendChild(dayNum); item.appendChild(info); item.appendChild(status);

      if (isCurrent && !isLocked) {
        item.addEventListener('click', function() { switchTab('today'); });
        item.style.cursor = 'pointer';
      }

      dayList.appendChild(item);
    });

    weekCard.appendChild(dayList);
    el.appendChild(weekCard);
  });

  if (!paid) {
    var unlock = document.createElement('div'); unlock.className = 'unlock-cta';
    unlock.innerHTML = '<div style="font-size:2rem;margin-bottom:.5rem">🔒</div><h3>Unlock your full 28-day system</h3><p>Days 2–28 are waiting. One day at a time.</p>';
    var btn = document.createElement('button'); btn.className = 'btn-primary'; btn.style.width = '100%'; btn.style.marginTop = '1rem';
    safeText(btn, 'Unlock Full Program →');
    btn.addEventListener('click', function() { switchTab('pricing'); });
    unlock.appendChild(btn);
    el.appendChild(unlock);
  }
}

/* ─── WEEK PREVIEWS (free view) ─── */
function buildWeekPreviews() {
  var el = document.getElementById('week-previews'); if (!el) return;
  el.innerHTML = '';
  PROGRAM.weeks.forEach(function(week, i) {
    var row = document.createElement('div'); row.className = 'week-preview-row';
    var num = document.createElement('div'); num.className = 'wpv-num'; safeText(num, 'Week ' + week.num);
    var info = document.createElement('div');
    var name = document.createElement('div'); name.className = 'wpv-name'; safeText(name, week.name);
    var goal = document.createElement('div'); goal.className = 'wpv-goal'; safeText(goal, week.goal);
    info.appendChild(name); info.appendChild(goal);
    var lock = document.createElement('div'); lock.className = 'wpv-lock';
    safeText(lock, i === 0 ? 'Day 1 Free' : '🔒');
    row.appendChild(num); row.appendChild(info); row.appendChild(lock);
    el.appendChild(row);
  });
}

/* ─── FREE DAY 1 START — with commitment modal ─── */
var freeStartBtn = document.getElementById('btn-free-start');
if (freeStartBtn) freeStartBtn.addEventListener('click', function() {
  openModal('modal-commitment');
  if (typeof gtag !== 'undefined') gtag('event', 'day1_intent');
});

var commitBtn = document.getElementById('btn-commit-start');
if (commitBtn) commitBtn.addEventListener('click', function() {
  closeModal('modal-commitment');
  var dayData = ALL_DAYS[0];
  if (dayData) {
    if (typeof gtag !== 'undefined') gtag('event', 'day1_start');
    startWorkoutSession(dayData.moves, dayData.rounds, 1);
  }
});

/* ─── REVIEWS ─── */
var REVIEWS = [
  { text:'"I lost 4kg in my first month. The sessions are genuinely challenging."', author:'Sofia M.', tag:'Lost 4kg in 30 days', stars:5 },
  { text:'"Finally a fitness app that respects I live in a flat. Zero jumping."', author:'Priya R.', tag:'Apartment-friendly convert', stars:5 },
  { text:'"The meal templates changed everything. Simple and protein-rich."', author:'Camille D.', tag:'Starter plan member', stars:5 },
  { text:'"VivaSculpt is the first programme I\'ve stuck with past week 2."', author:'Amara T.', tag:'3-month member', stars:5 },
  { text:'"The 28-day structure removes all decision-making. That\'s the magic."', author:'Laura K.', tag:'Pro member', stars:5 },
  { text:'"Upgraded to Pro. Worth every penny. I prep on Sunday in 1 hour."', author:'Natasha B.', tag:'Pro member', stars:5 }
];

function buildReviews(containerId) {
  var track = document.getElementById(containerId); if (!track) return;
  track.innerHTML = '';
  REVIEWS.forEach(function(r) {
    var card = document.createElement('div'); card.className = 'review-card';
    var stars = document.createElement('div'); stars.className = 'review-stars'; safeText(stars, '★'.repeat(r.stars));
    var text  = document.createElement('div'); text.className  = 'review-text';  safeText(text,  r.text);
    var auth  = document.createElement('div'); auth.className  = 'review-author'; safeText(auth,  r.author);
    var tag   = document.createElement('div'); tag.className   = 'review-tag';   safeText(tag,   r.tag);
    card.appendChild(stars); card.appendChild(text); card.appendChild(auth); card.appendChild(tag);
    track.appendChild(card);
  });
}

/* ─── MEALS ─── */
var MEALS_STARTER = [
  { icon:'🫙', name:'Greek Yogurt Power Bowl', desc:'Full-fat Greek yogurt · mixed berries · walnuts · raw honey · cinnamon', macros:['~25g protein','Healthy fats','Antioxidants'] },
  { icon:'🥚', name:'Eggs, Veg & Olive Oil', desc:'2–3 eggs · sautéed spinach & peppers · extra-virgin olive oil · sea salt', macros:['~20g protein','Good fats','Iron-rich'] },
  { icon:'🥗', name:'Chicken or Tofu Salad', desc:'Grilled chicken or tofu · mixed greens · cucumber · olive oil & lemon dressing', macros:['~30g protein','Omega-3s','High fibre'] },
  { icon:'🐟', name:'Salmon + Roasted Veg', desc:'Baked salmon · roasted broccoli & sweet potato · avocado · lemon', macros:['~35g protein','Omega-3 rich','Anti-inflammatory'] }
];
var MEALS_PRO = [
  { day:'Monday',    icon:'🍳', name:'Protein Scramble & Rye Toast', desc:'3 eggs + egg white · spinach · feta · rye toast', macros:['~32g protein'], calories:'420 kcal' },
  { day:'Tuesday',   icon:'🥣', name:'Overnight Oats + Protein',     desc:'Oats · protein powder · banana · chia · almond butter', macros:['~28g protein'], calories:'480 kcal' },
  { day:'Wednesday', icon:'🍗', name:'Herb Chicken & Quinoa Bowl',    desc:'Grilled chicken · quinoa · courgette · tahini', macros:['~40g protein'], calories:'510 kcal' },
  { day:'Thursday',  icon:'🥑', name:'Smashed Avo & Cottage Cheese', desc:'Omelette · avocado on sourdough · cottage cheese', macros:['~26g protein'], calories:'440 kcal' },
  { day:'Friday',    icon:'🐟', name:'Teriyaki Salmon Rice Bowl',     desc:'Salmon · brown rice · edamame · ginger-soy', macros:['~38g protein'], calories:'530 kcal' },
  { day:'Saturday',  icon:'🥙', name:'Turkey & Hummus Wrap',          desc:'Turkey · wholegrain wrap · hummus · spinach', macros:['~34g protein'], calories:'460 kcal' },
  { day:'Sunday',    icon:'🍲', name:'Lentil & Vegetable Stew',       desc:'Red lentils · sweet potato · spinach · turmeric', macros:['~22g protein'], calories:'490 kcal' }
];
var GROCERY_STARTER = {
  'Protein':['Greek yogurt','Eggs x12','Chicken breast','Salmon fillet','Firm tofu'],
  'Produce':['Baby spinach','Broccoli','Sweet potato','Bell peppers','Mixed berries','Avocado','Lemon'],
  'Pantry': ['Extra-virgin olive oil','Walnuts','Raw honey','Sea salt','Cinnamon']
};
var GROCERY_PRO = {
  'Proteins':['Eggs x18','Chicken breast x4','Salmon x2','Turkey slices','Red lentils','Cottage cheese','Protein powder'],
  'Produce': ['Spinach','Courgette','Red pepper','Broccoli','Sweet potato x2','Cherry tomatoes','Cucumber','Banana x4','Avocado x2'],
  'Grains':  ['Brown rice','Rolled oats','Quinoa','Rye bread','Sourdough','Wholegrain wraps'],
  'Pantry':  ['Olive oil','Tahini','Almond butter','Chia seeds','Almond milk','Soy sauce','Hummus','Sesame seeds']
};

function buildMealsGrid(containerId, meals, isPro) {
  var el = document.getElementById(containerId); if (!el) return;
  el.innerHTML = '';
  meals.forEach(function(meal) {
    var card = document.createElement('div'); card.className = 'meal-card';
    var icon = document.createElement('div'); icon.className = 'meal-icon'; safeText(icon, meal.icon);
    var body = document.createElement('div');
    if (isPro && meal.day) { var dl = document.createElement('div'); dl.className = 'meal-day-label'; safeText(dl, meal.day); body.appendChild(dl); }
    var name = document.createElement('div'); name.className = 'meal-name'; safeText(name, meal.name);
    var desc = document.createElement('div'); desc.className = 'meal-desc'; safeText(desc, meal.desc);
    var macros = document.createElement('div'); macros.className = 'meal-macro';
    (meal.macros || []).forEach(function(m) { var p = document.createElement('span'); p.className = 'macro-pill'; safeText(p, m); macros.appendChild(p); });
    if (meal.calories) { var c = document.createElement('span'); c.className = 'macro-pill'; c.style.background = 'var(--gold-bg)'; c.style.color = 'var(--gold)'; safeText(c, meal.calories); macros.appendChild(c); }
    body.appendChild(name); body.appendChild(desc); body.appendChild(macros);
    card.appendChild(icon); card.appendChild(body); el.appendChild(card);
  });
}

function buildGroceryList(containerId, data) {
  var el = document.getElementById(containerId); if (!el) return;
  el.innerHTML = '';
  Object.entries(data).forEach(function(entry) {
    var sec = document.createElement('span'); sec.className = 'grocery-section'; safeText(sec, entry[0]); el.appendChild(sec);
    var grid = document.createElement('div'); grid.className = 'grocery-grid';
    entry[1].forEach(function(item) { var d = document.createElement('div'); d.className = 'grocery-item'; safeText(d, item); grid.appendChild(d); });
    el.appendChild(grid);
  });
}

document.querySelectorAll('.plan-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.plan-tab').forEach(function(t) { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    var plan = tab.dataset.plan;
    document.querySelectorAll('.meals-panel').forEach(function(p) { p.classList.add('hidden'); });
    document.getElementById('meals-' + plan).classList.remove('hidden');
    if (plan === 'pro' && isPro()) {
      document.getElementById('pro-meal-gate').classList.add('hidden');
      document.getElementById('meals-pro-content').classList.remove('hidden');
    }
  });
});

var groceryStarterBtn = document.getElementById('btn-grocery-starter');
if (groceryStarterBtn) groceryStarterBtn.addEventListener('click', function() {
  var el = document.getElementById('grocery-list-starter');
  buildGroceryList('grocery-list-starter', GROCERY_STARTER); el.hidden = false;
  el.scrollIntoView({ behavior:'smooth', block:'start' });
});
var groceryProBtn = document.getElementById('btn-grocery-pro');
if (groceryProBtn) groceryProBtn.addEventListener('click', function() {
  var el = document.getElementById('grocery-list-pro');
  buildGroceryList('grocery-list-pro', GROCERY_PRO); el.hidden = false;
  el.scrollIntoView({ behavior:'smooth', block:'start' });
});
var upgradeBtn = document.getElementById('btn-upgrade-meals');
if (upgradeBtn) upgradeBtn.addEventListener('click', function() { switchTab('pricing'); });

/* ─── FAQ ─── */
var FAQ = [
  { q:'Can I cancel anytime?', a:'Yes. Cancel through your PayPal account before your next renewal date. No penalties.' },
  { q:'What is the 28-day system?', a:'A structured daily programme — one workout, one meal guide, one checkmark. No browsing, no decisions. Just follow the system.' },
  { q:'Do I need equipment?', a:'No equipment required. Every exercise has a bodyweight version. Just a small clear floor space.' },
  { q:'I\'m a beginner — is this for me?', a:'Yes. Choose Low-Impact intensity. Every move has a modification. Start with Day 1.' },
  { q:'How does the 7-day trial work?', a:'Start the Starter plan — no payment for 7 days. Cancel before the trial ends and you\'re never charged. After 7 days it renews at $14/month.' },
  { q:'What\'s the difference between Starter and Pro?', a:'Starter gives you Week 1 access and daily structure. Pro unlocks all 28 days, rotating meal plans, and full progress tracking.' }
];
function buildFAQ() {
  var el = document.getElementById('faq-list'); if (!el) return;
  FAQ.forEach(function(item, i) {
    var wrap = document.createElement('div'); wrap.className = 'faq-item';
    var btn  = document.createElement('button'); btn.className = 'faq-trigger'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('type','button');
    var qText = document.createElement('span'); safeText(qText, item.q);
    var arrow = document.createElement('svg'); arrow.setAttribute('class','faq-arrow'); arrow.setAttribute('width','18'); arrow.setAttribute('height','18'); arrow.setAttribute('viewBox','0 0 24 24'); arrow.setAttribute('fill','none'); arrow.setAttribute('stroke','currentColor'); arrow.setAttribute('stroke-width','2'); arrow.setAttribute('aria-hidden','true');
    arrow.innerHTML = '<polyline points="6,9 12,15 18,9"/>';
    btn.appendChild(qText); btn.appendChild(arrow);
    var body = document.createElement('div'); body.className = 'faq-body'; body.id = 'faq-body-'+i; body.hidden = true; safeText(body, item.a);
    btn.addEventListener('click', function() { var exp = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded',!exp); body.hidden = exp; });
    wrap.appendChild(btn); wrap.appendChild(body); el.appendChild(wrap);
  });
}

/* ─── PWA INSTALL ─── */
var deferredPrompt = null;
function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isInStandaloneMode() { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; }
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault(); deferredPrompt = e;
  if (!localStorage.getItem(PWA_KEY) && !isInStandaloneMode()) setTimeout(showPWABanner, 3000);
});
if (isIOS() && !isInStandaloneMode() && !localStorage.getItem(PWA_KEY)) setTimeout(showPWABanner, 3000);
function showPWABanner() {
  var banner = document.getElementById('pwa-banner'); if (!banner) return;
  var installBtn = document.getElementById('pwa-install-btn');
  var iosInst = document.getElementById('pwa-ios-instructions');
  if (isIOS()) { if (installBtn) installBtn.style.display = 'none'; if (iosInst) iosInst.style.display = 'block'; banner.classList.remove('hidden'); }
  else if (deferredPrompt) { if (installBtn) installBtn.style.display = 'flex'; if (iosInst) iosInst.style.display = 'none'; banner.classList.remove('hidden'); }
}
var pwaInstallBtn = document.getElementById('pwa-install-btn');
if (pwaInstallBtn) pwaInstallBtn.addEventListener('click', function() {
  document.getElementById('pwa-banner').classList.add('hidden');
  if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(function(r) { if (r.outcome === 'accepted' && typeof gtag !== 'undefined') gtag('event','pwa_installed'); deferredPrompt = null; }); }
});
var pwaDismiss = document.getElementById('pwa-dismiss');
if (pwaDismiss) pwaDismiss.addEventListener('click', function() { document.getElementById('pwa-banner').classList.add('hidden'); localStorage.setItem(PWA_KEY,'1'); });

/* ─── TRIAL BANNER (for PayPal redirect back) ─── */
function updateTrialBanner() { /* handled by PayPal externally */ }
function checkPaywall() { /* PayPal handles subscription state */ }

/* ─── COPYRIGHT ─── */
var yearEl = document.getElementById('copy-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── INIT ─── */
function init() {
  buildMealsGrid('meals-grid-starter', MEALS_STARTER, false);
  buildMealsGrid('meals-grid-pro', MEALS_PRO, true);
  buildFAQ();
  renderTodayView();
  updatePlanBadge();
  if (typeof gtag !== 'undefined') gtag('event','app_open');
}
init();

/* ═══════════════════════════════════════════════════
   ADAPTIVE CYCLE SYSTEM — Integration
   ═══════════════════════════════════════════════════ */

/* ─── IDENTITY BAR ─── */
function renderIdentityBar() {
  var bar = document.getElementById('identity-bar');
  if (!bar) return;
  var streak   = getStreak();
  var progress = getProgress();
  var cState   = getCycleState();
  var cycle    = getCurrentCycle();
  var label    = getIdentityLabel(streak, cState.currentCycle);
  var score    = getDisciplineScore(progress, streak, cState.currentCycle);

  bar.innerHTML = '';
  bar.style.display = 'flex';

  var left = document.createElement('div'); left.style.cssText = 'display:flex;flex-direction:column;gap:.1rem;';
  var lbl = document.createElement('div'); lbl.style.cssText = 'font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + label.color;
  lbl.textContent = label.label;
  var cyc = document.createElement('div'); cyc.style.cssText = 'font-size:.75rem;color:var(--text-muted);font-weight:500;';
  cyc.textContent = cycle.icon + ' ' + cycle.name + ' · Cycle ' + cState.currentCycle;
  left.appendChild(lbl); left.appendChild(cyc);

  var right = document.createElement('div'); right.style.cssText = 'text-align:right;';
  var scoreEl = document.createElement('div'); scoreEl.style.cssText = 'font-family:var(--font-display);font-size:1.1rem;color:var(--emerald);';
  scoreEl.textContent = score;
  var scoreLbl = document.createElement('div'); scoreLbl.style.cssText = 'font-size:.65rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;';
  scoreLbl.textContent = 'Discipline Score';
  right.appendChild(scoreEl); right.appendChild(scoreLbl);

  bar.appendChild(left); bar.appendChild(right);
}

/* ─── CYCLE TRANSITION SCREEN ─── */
function showCycleTransition() {
  var modal = document.getElementById('modal-cycle-transition');
  if (!modal) return;

  var cState = getCycleState();
  var streak = getStreak();
  var progress = getProgress();
  var score  = getDisciplineScore(progress, streak, cState.currentCycle);
  var nextCycle = CYCLES.find(function(c) { return c.num === Math.min(cState.currentCycle + 1, 5); });
  var isPaidUser = isPaid();

  // Fill in content
  var scoreEl   = document.getElementById('ct-score');
  var streakEl  = document.getElementById('ct-streak');
  var nextNameEl = document.getElementById('ct-next-name');
  var nextDescEl = document.getElementById('ct-next-desc');
  var nextIconEl = document.getElementById('ct-next-icon');
  var ctLockEl  = document.getElementById('ct-lock-msg');

  if (scoreEl)   scoreEl.textContent   = score;
  if (streakEl)  streakEl.textContent  = streak + ' day streak';
  if (nextIconEl && nextCycle) nextIconEl.textContent = nextCycle.icon;
  if (nextNameEl && nextCycle) nextNameEl.textContent = nextCycle.name;
  if (nextDescEl && nextCycle) nextDescEl.textContent = nextCycle.description;

  var needsPro = nextCycle && nextCycle.tier === 'pro' && !isPro();
  if (ctLockEl) ctLockEl.style.display = needsPro ? 'block' : 'none';

  var startBtn = document.getElementById('ct-start-btn');
  var proBtn   = document.getElementById('ct-pro-btn');
  if (startBtn) startBtn.style.display = needsPro ? 'none' : 'block';
  if (proBtn)   proBtn.style.display   = needsPro ? 'block' : 'none';

  openModal('modal-cycle-transition');
}

/* ─── START NEXT CYCLE ─── */
function startNextCycle() {
  var nextCycle = advanceToNextCycle();
  // Reset 28-day progress for new cycle
  var newProgress = { currentDay: 1, completedDays: [], startDate: new Date().toISOString() };
  saveProgress(newProgress);
  closeModal('modal-cycle-transition');
  renderTodayView();
  renderIdentityBar();
  if (typeof gtag !== 'undefined') gtag('event', 'cycle_started', { cycle: nextCycle.num, name: nextCycle.name });
}

/* ─── CHECK FOR CYCLE COMPLETION ─── */
function checkCycleCompletion() {
  var progress = getProgress();
  if (isCycleComplete(progress)) {
    setTimeout(showCycleTransition, 800);
  }
}

/* ─── OVERRIDE markDayComplete to check cycle ─── */
var _originalMarkDay = markDayComplete;
markDayComplete = function(n) {
  _originalMarkDay(n);
  checkCycleCompletion();
  renderIdentityBar();
};

/* ─── RE-ENTRY SYSTEM ─── */
function checkReEntry() {
  var lastDate = localStorage.getItem(STREAK_DATE);
  if (!lastDate) return;
  var daysSince = Math.floor((Date.now() - new Date(lastDate).getTime()) / 86400000);
  if (daysSince >= 3) {
    var reEntryBanner = document.getElementById('re-entry-banner');
    if (reEntryBanner) {
      reEntryBanner.classList.remove('hidden');
      var msg = daysSince >= 7
        ? 'Your system is waiting. Resume at reduced intensity.'
        : 'Don\'t lose your progress. Pick up where you left off.';
      var msgEl = document.getElementById('re-entry-msg');
      if (msgEl) msgEl.textContent = msg;
    }
  }
}

/* ─── PROGRAM VIEW — update to show cycles ─── */
var _origRenderProgram = renderProgramView;
renderProgramView = function() {
  _origRenderProgram();

  // Add cycle roadmap after program view
  var el = document.getElementById('program-view');
  if (!el || !isPaid()) return;

  var cState   = getCycleState();
  var roadmap  = document.createElement('div');
  roadmap.className = 'cycle-roadmap';

  var header = document.createElement('div'); header.className = 'roadmap-header';
  header.innerHTML = '<h3>Your Progression Path</h3><p>Complete 28 days to unlock the next cycle</p>';
  roadmap.appendChild(header);

  CYCLES.forEach(function(cycle) {
    var isCompleted = cycle.num < cState.currentCycle;
    var isCurrent   = cycle.num === cState.currentCycle;
    var isLocked    = cycle.num > cState.currentCycle;
    var needsPro    = cycle.tier === 'pro' && !isPro();

    var row = document.createElement('div');
    row.className = 'cycle-row' + (isCurrent ? ' current' : '') + (isCompleted ? ' done' : '') + (isLocked ? ' locked' : '');

    var icon = document.createElement('div'); icon.className = 'cycle-row-icon';
    icon.textContent = isCompleted ? '✅' : (isLocked ? '🔒' : cycle.icon);

    var info = document.createElement('div'); info.className = 'cycle-row-info';
    var name = document.createElement('div'); name.className = 'cycle-row-name';
    name.textContent = 'Cycle ' + cycle.num + ' — ' + cycle.name;
    var tag = document.createElement('div'); tag.className = 'cycle-row-tag';
    tag.textContent = cycle.tagline;
    info.appendChild(name); info.appendChild(tag);

    var status = document.createElement('div'); status.className = 'cycle-row-status';
    if (isCurrent) { status.textContent = 'Active'; status.style.color = 'var(--emerald)'; status.style.fontWeight = '700'; }
    else if (isCompleted) { status.textContent = 'Done ✓'; status.style.color = 'var(--emerald)'; }
    else if (needsPro) { status.textContent = 'Pro'; status.style.color = 'var(--gold)'; }
    else { status.textContent = 'Locked'; status.style.color = 'var(--text-muted)'; }

    row.appendChild(icon); row.appendChild(info); row.appendChild(status);
    roadmap.appendChild(row);
  });

  el.appendChild(roadmap);
};

/* ─── INIT IDENTITY BAR ─── */
var origInit = init;
init = function() {
  origInit();
  renderIdentityBar();
  checkReEntry();
};