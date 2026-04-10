(function() {
'use strict';

/* ═══════════════════════════════════════════════
   VivaSculpt – Cycle Calendar  (calendar.js)
   Wrapped in IIFE — no conflicts with app.js
   ═══════════════════════════════════════════════ */

function calText(el, str) {
  if (el) el.textContent = String(str);
}

var CAL_KEY       = 'vs_cycle_days';
var DEF_CYCLE     = 28;
var PHASE_LENS    = { menstrual:5, follicular:9, ovulation:2, luteal:12 };
var MONTH_NAMES   = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

/* ── Date helpers ── */
function todayMs() {
  var d = new Date(); d.setHours(0,0,0,0); return d.getTime();
}
function makeKey(y, m, d) {
  return y + '-' + (m+1<10?'0':'') + (m+1) + '-' + (d<10?'0':'') + d;
}
function keyMs(key) {
  var p = key.split('-');
  return new Date(+p[0], +p[1]-1, +p[2]).getTime();
}
function diffDays(msA, msB) {
  return Math.round((msB - msA) / 86400000);
}
function addDays(ms, n) { return ms + n * 86400000; }

/* ── Storage ── */
function loadDays() {
  try { var r = localStorage.getItem(CAL_KEY); return r ? JSON.parse(r) : []; }
  catch(e) { return []; }
}
function saveDays(arr) {
  try { localStorage.setItem(CAL_KEY, JSON.stringify(arr)); } catch(e) {}
}

/* ── Cycle logic ── */
function detectStarts(arr) {
  if (!arr.length) return [];
  var sorted = arr.slice().sort();
  var starts = [], lastMs = null;
  for (var i = 0; i < sorted.length; i++) {
    var ms = keyMs(sorted[i]);
    if (lastMs === null || diffDays(lastMs, ms) >= 2) starts.push(ms);
    lastMs = ms;
  }
  return starts;
}

function avgLen(starts) {
  if (starts.length < 2) return DEF_CYCLE;
  var lens = [];
  for (var i = 1; i < starts.length; i++) {
    var l = diffDays(starts[i-1], starts[i]);
    if (l >= 18 && l <= 45) lens.push(l);
  }
  if (!lens.length) return DEF_CYCLE;
  return Math.round(lens.reduce(function(a,b){return a+b;},0)/lens.length);
}

function phaseFor(targetMs, starts, cycleLen) {
  if (!starts.length) return null;
  var last = null;
  for (var i = 0; i < starts.length; i++) {
    if (starts[i] <= targetMs) last = starts[i];
  }
  if (last === null) return null;
  // project forward
  while (addDays(last, cycleLen) <= targetMs) last = addDays(last, cycleLen);
  var day = diffDays(last, targetMs) + 1;
  if (day < 1) return null;
  var m = PHASE_LENS.menstrual;
  var f = m + PHASE_LENS.follicular;
  var o = f + PHASE_LENS.ovulation;
  var ll = o + PHASE_LENS.luteal;
  if (day <= m)  return 'menstrual';
  if (day <= f)  return 'follicular';
  if (day <= o)  return 'ovulation';
  if (day <= ll) return 'luteal';
  return 'menstrual';
}

function nextPeriodMs(starts, cycleLen) {
  if (!starts.length) return null;
  var t = todayMs();
  var last = starts[starts.length-1];
  var next = last;
  while (next <= t) next = addDays(next, cycleLen);
  return next;
}

/* ── State ── */
var CAL = {
  year:  new Date().getFullYear(),
  month: new Date().getMonth(),
  marked: loadDays()
};

/* ── Render everything ── */
function renderAll() {
  renderGrid();
  renderBanner();
  renderStats();
  renderNext();
  syncProtocol();
}

function renderGrid() {
  var grid  = document.getElementById('cal-grid');
  var label = document.getElementById('cal-month-label');
  if (!grid) return;

  calText(label, MONTH_NAMES[CAL.month] + ' ' + CAL.year);
  grid.innerHTML = '';

  var starts   = detectStarts(CAL.marked);
  var cycleLen = avgLen(starts);
  var tMs      = todayMs();
  var markedSet = {};
  CAL.marked.forEach(function(k){ markedSet[k] = true; });

  var firstDow = new Date(CAL.year, CAL.month, 1).getDay();
  var offset   = (firstDow + 6) % 7;
  var daysInMo = new Date(CAL.year, CAL.month+1, 0).getDate();

  for (var e = 0; e < offset; e++) {
    var blank = document.createElement('div');
    blank.className = 'cal-day empty';
    grid.appendChild(blank);
  }

  for (var d = 1; d <= daysInMo; d++) {
    var key   = makeKey(CAL.year, CAL.month, d);
    var cellMs = new Date(CAL.year, CAL.month, d).setHours(0,0,0,0);
    var marked = !!markedSet[key];
    var isToday = cellMs === tMs;
    var phase   = phaseFor(cellMs, starts, cycleLen);

    var cell = document.createElement('button');
    cell.className = 'cal-day';
    cell.setAttribute('type','button');
    cell.setAttribute('aria-label', d + ' ' + MONTH_NAMES[CAL.month]);
    cell.textContent = d;

    if (marked)       cell.classList.add('marked-menstrual');
    else if (phase)   cell.classList.add('phase-' + phase);
    if (isToday)      cell.classList.add('today');

    (function(k, btn) {
      btn.addEventListener('click', function() {
        btn.classList.add('tap-pulse');
        setTimeout(function(){ btn.classList.remove('tap-pulse'); }, 220);
        var idx = CAL.marked.indexOf(k);
        if (idx > -1) CAL.marked.splice(idx, 1);
        else CAL.marked.push(k);
        saveDays(CAL.marked);
        renderAll();
      });
    })(key, cell);

    grid.appendChild(cell);
  }
}

function renderBanner() {
  var banner = document.getElementById('current-phase-banner');
  if (!banner) return;

  var starts   = detectStarts(CAL.marked);
  var cycleLen = avgLen(starts);
  var tMs      = todayMs();
  var phase    = phaseFor(tMs, starts, cycleLen);

  var INFO = {
    menstrual:  { icon:'🩸', name:'Menstrual Phase',  cls:'cpb-menstrual',  desc:'Rest and restore. Iron-rich foods and gentle movement today.' },
    follicular: { icon:'🌱', name:'Follicular Phase', cls:'cpb-follicular', desc:'Energy is rising. Build workout intensity gradually.' },
    ovulation:  { icon:'🔥', name:'Ovulation Phase',  cls:'cpb-ovulation',  desc:'Peak energy. Push harder — high protein, balanced macros.' },
    luteal:     { icon:'🌙', name:'Luteal Phase',     cls:'cpb-luteal',     desc:'Fibre-rich meals stabilise cravings. Honour the slower pace.' }
  };

  banner.innerHTML = '';

  if (!phase) {
    banner.className = 'current-phase-banner cpb-unknown';
    var ico = document.createElement('div'); ico.className = 'cpb-icon'; ico.textContent = '📅';
    var bod = document.createElement('div'); bod.className = 'cpb-body';
    var nm  = document.createElement('div'); nm.className  = 'cpb-phase-name'; nm.textContent = 'No cycle data yet';
    var ds  = document.createElement('div'); ds.className  = 'cpb-phase-desc'; ds.textContent = 'Tap any day on the calendar to mark your period start. Phases predict automatically.';
    bod.appendChild(nm); bod.appendChild(ds);
    banner.appendChild(ico); banner.appendChild(bod);
    return;
  }

  var info = INFO[phase];

  // Day in phase
  var last2 = null;
  for (var i = 0; i < starts.length; i++) {
    if (starts[i] <= tMs) last2 = starts[i];
  }
  if (last2 !== null) {
    while (addDays(last2, cycleLen) <= tMs) last2 = addDays(last2, cycleLen);
  }
  var dayInCycle = last2 ? diffDays(last2, tMs) + 1 : 1;
  var pip = dayInCycle;
  if (phase === 'follicular') pip -= PHASE_LENS.menstrual;
  if (phase === 'ovulation')  pip -= (PHASE_LENS.menstrual + PHASE_LENS.follicular);
  if (phase === 'luteal')     pip -= (PHASE_LENS.menstrual + PHASE_LENS.follicular + PHASE_LENS.ovulation);
  pip = Math.max(1, pip);

  banner.className = 'current-phase-banner ' + info.cls;
  var icon = document.createElement('div'); icon.className = 'cpb-icon'; icon.textContent = info.icon;
  var body = document.createElement('div'); body.className = 'cpb-body';
  var name = document.createElement('div'); name.className = 'cpb-phase-name'; name.textContent = info.name;
  var desc = document.createElement('div'); desc.className = 'cpb-phase-desc'; desc.textContent = info.desc;
  var dayn = document.createElement('div'); dayn.className = 'cpb-day-count'; dayn.textContent = 'Day ' + pip + ' of phase';
  body.appendChild(name); body.appendChild(desc); body.appendChild(dayn);
  banner.appendChild(icon); banner.appendChild(body);
}

function renderStats() {
  var starts   = detectStarts(CAL.marked);
  var cycleLen = avgLen(starts);
  calText(document.getElementById('stat-cycles'),    starts.length || '–');
  calText(document.getElementById('stat-cycle-len'), starts.length >= 2 ? cycleLen+'d' : '–');
  calText(document.getElementById('stat-marked'),    CAL.marked.length);
}

function renderNext() {
  var card = document.getElementById('next-period-card');
  if (!card) return;
  var starts   = detectStarts(CAL.marked);
  var cycleLen = avgLen(starts);
  var nextMs   = nextPeriodMs(starts, cycleLen);
  if (!nextMs) { card.style.display = 'none'; return; }
  card.style.display = 'flex';
  var daysUntil = diffDays(todayMs(), nextMs);
  var nextDate  = new Date(nextMs);
  calText(document.getElementById('npc-date'),
    nextDate.toLocaleDateString('en-GB', {weekday:'short',day:'numeric',month:'long'}));
  calText(document.getElementById('npc-days'),
    daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : 'In ' + daysUntil + ' days');
}

function syncProtocol() {
  try {
    var starts   = detectStarts(CAL.marked);
    var cycleLen = avgLen(starts);
    var phase    = phaseFor(todayMs(), starts, cycleLen);
    if (!phase) return;
    document.querySelectorAll('.phase-btn').forEach(function(btn) {
      btn.classList.remove('active');
      if (btn.dataset.phase === phase) btn.classList.add('active');
    });
    if (typeof protocolState !== 'undefined') {
      protocolState.phase = phase;
      if (protocolState.mood && typeof buildProtocol === 'function') buildProtocol();
    }
  } catch(e) {}
}

/* ── Nav ── */
function attachNav() {
  var prev = document.getElementById('cal-prev');
  var next = document.getElementById('cal-next');
  if (prev) prev.addEventListener('click', function() {
    CAL.month--; if (CAL.month < 0) { CAL.month = 11; CAL.year--; }
    renderGrid();
  });
  if (next) next.addEventListener('click', function() {
    CAL.month++; if (CAL.month > 11) { CAL.month = 0; CAL.year++; }
    renderGrid();
  });
}

/* ── Init ── */
function init() { attachNav(); renderAll(); }

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})(); // end IIFE