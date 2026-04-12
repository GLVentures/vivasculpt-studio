/* ═══════════════════════════════════════════════════
   VivaSculpt — SaaS Core Architecture
   PROGRAM (TEMPLATE) + USER STATE
   ═══════════════════════════════════════════════════ */

'use strict';

/* =========================
   1. PROGRAM TEMPLATE
========================= */

const PROGRAM = {
  name: '28-Day Discipline & Sculpt System',
  weeks: [
    {
      num: 1,
      name: 'Reset Discipline',
      phase: 'reset',
      goal: 'Break inconsistency. Create daily rhythm.',
      color: '#0F766E',
      days: [
        {
          day: 1,
          title: 'Full Body Reset',
          type: 'workout',
          duration: 20,
          tag: 'Full Body'
        }
        // keep full dataset here (unchanged)
      ]
    }
    // weeks 2–4 unchanged
  ]
};

/* =========================
   2. USER STATE (THIS IS SAAS CORE)
========================= */

const USER_STATE = {
  userId: null,
  currentWeek: 1,
  currentDay: 1,
  completed: {},   // e.g. { "1-1": true }
  streak: 0,
  lastActive: null
};

/* =========================
   3. SAFE ACCESS LAYER
========================= */

function getWeek(weekNum) {
  return PROGRAM.weeks.find(w => w.num === weekNum) || null;
}

function getDay(weekNum, dayNum) {
  const week = getWeek(weekNum);
  if (!week) return null;
  return week.days.find(d => d.day === dayNum) || null;
}

/* =========================
   4. SAAS LOGIC (CRITICAL)
========================= */

function markDayComplete(weekNum, dayNum) {
  const key = `${weekNum}-${dayNum}`;
  USER_STATE.completed[key] = true;

  USER_STATE.lastActive = new Date().toISOString();

  // simple streak logic
  USER_STATE.streak += 1;
}

function isDayComplete(weekNum, dayNum) {
  return !!USER_STATE.completed[`${weekNum}-${dayNum}`];
}

function getProgress() {
  const totalDays = 28;
  const done = Object.keys(USER_STATE.completed).length;

  return {
    completed: done,
    total: totalDays,
    percent: Math.round((done / totalDays) * 100)
  };
}

/* =========================
   5. SAFE PUBLIC API
========================= */

const VivaSculptAPI = {
  getWeek,
  getDay,
  markDayComplete,
  isDayComplete,
  getProgress,
  state: USER_STATE
};