/* ═══════════════════════════════════════════════════
   VivaSculpt — Adaptive Cycle System
   cycles.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── CYCLE DEFINITIONS ─── */
var CYCLES = [
  {
    num: 1, name: 'Foundation Reset', tier: 'starter',
    tagline: 'Build the habit. Lock the identity.',
    icon: '🌱',
    difficulty: 1,
    description: 'Your first transformation cycle. Low friction. High consistency. This is where the habit forms.',
    workRest: { work: 40, rest: 20 },
    roundMultiplier: 1.0
  },
  {
    num: 2, name: 'Sculpt+', tier: 'pro',
    tagline: 'More intensity. More definition.',
    icon: '🔥',
    difficulty: 2,
    description: 'Increased intensity based on your Cycle 1 performance. Your body is ready for more.',
    workRest: { work: 45, rest: 15 },
    roundMultiplier: 1.25
  },
  {
    num: 3, name: 'Lean Definition', tier: 'pro',
    tagline: 'Fat reduction. Advanced circuits.',
    icon: '⚡',
    difficulty: 3,
    description: 'Targeted fat reduction and advanced circuits. Visible definition begins here.',
    workRest: { work: 50, rest: 10 },
    roundMultiplier: 1.5
  },
  {
    num: 4, name: 'Performance Mode', tier: 'pro',
    tagline: 'Strength + endurance. Higher difficulty.',
    icon: '💎',
    difficulty: 4,
    description: 'Strength meets endurance. You are not the same person who started Cycle 1.',
    workRest: { work: 50, rest: 10 },
    roundMultiplier: 1.75
  },
  {
    num: 5, name: 'AI Adaptive Mode', tier: 'pro',
    tagline: 'Fully personalized. Evolves with you.',
    icon: '🤖',
    difficulty: 5,
    description: 'Your system adapts based on your behavior — streak length, skipped days, performance patterns.',
    workRest: { work: 45, rest: 15 },
    roundMultiplier: 1.0 // adapts dynamically
  }
];

/* ─── IDENTITY LABELS ─── */
var IDENTITY_LABELS = [
  { minStreak: 0,  minCycle: 1, label: 'Beginning Disciplined',    color: '#6B7280' },
  { minStreak: 3,  minCycle: 1, label: 'Consistent Starter',        color: '#0F766E' },
  { minStreak: 7,  minCycle: 1, label: 'Habit Builder',             color: '#0F766E' },
  { minStreak: 14, minCycle: 1, label: 'Discipline Active',         color: '#0A5C56' },
  { minStreak: 7,  minCycle: 2, label: 'Sculpt Mode Active',        color: '#B45309' },
  { minStreak: 14, minCycle: 2, label: 'Transformation Builder',    color: '#B45309' },
  { minStreak: 7,  minCycle: 3, label: 'Lean Definition Phase',     color: '#7C3AED' },
  { minStreak: 14, minCycle: 3, label: 'Advanced Sculpt User',      color: '#7C3AED' },
  { minStreak: 7,  minCycle: 4, label: 'Performance Mode',          color: '#DC2626' },
  { minStreak: 7,  minCycle: 5, label: 'Elite Adaptive System',     color: '#0B0F14' }
];

/* ─── COMPLETION MESSAGES ─── */
var IDENTITY_MESSAGES = [
  '"You showed up today."',
  '"Consistency is becoming your default."',
  '"No negotiation. Just action."',
  '"Another day. Another rep."',
  '"Your future self remembers this."',
  '"One session closer."',
  '"This is who you are now."',
  '"Discipline compounds."',
  '"You don\'t miss days anymore."',
  '"The system is working. So are you."'
];

/* ─── CYCLE STATE STORAGE ─── */
var CYCLE_STATE_KEY = 'vs_cycle_state';
// { currentCycle, totalDaysCompleted, disciplineScore, cycleHistory[] }

function getCycleState() {
  try {
    var r = localStorage.getItem(CYCLE_STATE_KEY);
    return r ? JSON.parse(r) : { currentCycle: 1, totalDaysCompleted: 0, disciplineScore: 0, cycleHistory: [] };
  } catch(e) {
    return { currentCycle: 1, totalDaysCompleted: 0, disciplineScore: 0, cycleHistory: [] };
  }
}
function saveCycleState(s) {
  try { localStorage.setItem(CYCLE_STATE_KEY, JSON.stringify(s)); } catch(e) {}
}

function getCurrentCycle() {
  var state = getCycleState();
  return CYCLES.find(function(c) { return c.num === state.currentCycle; }) || CYCLES[0];
}

function advanceToNextCycle() {
  var state = getCycleState();
  var nextNum = Math.min(state.currentCycle + 1, 5);
  state.cycleHistory.push({ cycle: state.currentCycle, completedAt: new Date().toISOString() });
  state.currentCycle = nextNum;
  saveCycleState(state);
  return CYCLES.find(function(c) { return c.num === nextNum; });
}

function getIdentityLabel(streak, cycleNum) {
  var label = IDENTITY_LABELS[0];
  IDENTITY_LABELS.forEach(function(l) {
    if (streak >= l.minStreak && cycleNum >= l.minCycle) label = l;
  });
  return label;
}

function getDisciplineScore(progress, streak, cycleNum) {
  var baseScore = (progress.completedDays || []).length * 10;
  var streakBonus = streak * 5;
  var cycleBonus = (cycleNum - 1) * 50;
  return Math.min(baseScore + streakBonus + cycleBonus, 999);
}

/* ─── ADAPTIVE DIFFICULTY (Cycle 5 logic) ─── */
function getAdaptiveDifficulty(progress, streak) {
  var completedDays = (progress.completedDays || []).length;
  var avgCompletion = completedDays / Math.max(progress.currentDay || 1, 1);
  if (avgCompletion > 0.9 && streak > 10) return 'high';
  if (avgCompletion > 0.7 && streak > 5)  return 'medium';
  return 'low';
}

function getAdaptiveWorkRest(difficulty) {
  if (difficulty === 'high')   return { work: 50, rest: 10 };
  if (difficulty === 'medium') return { work: 45, rest: 15 };
  return { work: 40, rest: 20 };
}

/* ─── CYCLE COMPLETION CHECK ─── */
function isCycleComplete(progress) {
  return (progress.completedDays || []).length >= 28;
}