/* ===============================
   VivaSculpt Cycle Phase Module v5
   Clean Render Architecture
================================= */

const CAL_KEY = 'vs_cycle_days';
const PHASE_LENS = {
  Menstrual: 5,
  Follicular: 8,
  Ovulation: 2,
  Luteal: 13
};

/* ===============================
   INIT
================================= */

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCyclePhase, 200); // allow calendar.js to render first
});

window.addEventListener('storage', (e) => {
  if (e.key === CAL_KEY) {
    initCyclePhase();
  }
});

/* ===============================
   MAIN INIT
================================= */

function initCyclePhase() {
  const days = getStoredDays();
  if (!days.length) return;

  const cycleData = calculateCycleData(days);
  if (!cycleData) return;

  renderCyclePhaseBanner(cycleData.phaseData, cycleData.cycleDay, cycleData.isPro);
}

/* ===============================
   STORAGE
================================= */

function getStoredDays() {
  try {
    const raw = localStorage.getItem(CAL_KEY);
    return raw ? JSON.parse(raw).sort() : [];
  } catch {
    return [];
  }
}

/* ===============================
   CYCLE LOGIC
   (Replace with your exact calendar.js logic if needed)
================================= */

function calculateCycleData(days) {
  if (!days.length) return null;

  const today = new Date().toISOString().split('T')[0];
  const lastStart = detectLastStart(days);

  if (!lastStart) return null;

  const cycleDay = dayDiff(lastStart, today) + 1;
  const phaseName = phaseFor(cycleDay);

  const phaseData = PHASE_CONTENT[phaseName];

  return {
    cycleDay,
    phaseData,
    isPro: checkProStatus()
  };
}

function detectLastStart(days) {
  if (!days.length) return null;
  return days[days.length - 1];
}

function dayDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function phaseFor(day) {
  let cumulative = 0;
  for (let phase in PHASE_LENS) {
    cumulative += PHASE_LENS[phase];
    if (day <= cumulative) return phase;
  }
  return 'Luteal';
}

function checkProStatus() {
  return localStorage.getItem('vs_plan') === 'pro';
}

/* ===============================
   RENDER
================================= */

function renderCyclePhaseBanner(phaseData, cycleDay, isPro) {
  const existing = document.querySelector('.vs-phase-banner');
  if (existing) existing.remove();

  const container = document.querySelector('#cycle-phase-root');
  if (!container) return;

  const banner = document.createElement('div');
  banner.className = 'vs-phase-banner';

  banner.style.setProperty('--phase-bg', phaseData.bg);
  banner.style.setProperty('--phase-border', phaseData.border);
  banner.style.setProperty('--phase-accent', phaseData.accent);

  banner.innerHTML = `
    ${phaseHeader(phaseData, cycleDay)}
    ${phaseTip(phaseData.tip)}
    ${workoutSection(phaseData, isPro)}
    ${nutritionSection(phaseData.nutrition)}
    ${hormoneMap(phaseData.name)}
  `;

  container.prepend(banner);
}

/* ===============================
   COMPONENTS
================================= */

function phaseHeader(phaseData, cycleDay) {
  return `
    <div class="vs-phase-header">
      <div class="vs-phase-title">${phaseData.name} Phase</div>
      <div class="vs-cycle-day">Cycle Day ${cycleDay}</div>
      <div class="vs-phase-tagline">${phaseData.tagline}</div>
    </div>
  `;
}

function phaseTip(tip) {
  return `
    <div class="vs-phase-card">
      <div class="vs-card-label">💡 Phase Tip</div>
      <div class="vs-card-text">${tip}</div>
    </div>
  `;
}

function workoutSection(phaseData, isPro) {
  if (!isPro) {
    return `
      <div class="vs-phase-card vs-locked">
        <div class="vs-card-label">🔒 Cycle-Synced Workouts</div>
        <div class="vs-card-text">
          Unlock workouts matched to your current phase.
        </div>
        <button class="vs-upgrade-btn">Unlock Phase Workouts →</button>
      </div>
    `;
  }

  return `
    <div class="vs-phase-card">
      <div class="vs-card-label">🏋️ Recommended Workout</div>
      <div class="vs-card-text">${phaseData.workout}</div>
    </div>
  `;
}

function nutritionSection(text) {
  return `
    <div class="vs-phase-card">
      <div class="vs-card-label">🥗 Nutrition Focus</div>
      <div class="vs-card-text">${text}</div>
    </div>
  `;
}

function hormoneMap(currentPhase) {
  const phases = [
    { name: 'Menstrual', range: 'Days 1–5' },
    { name: 'Follicular', range: 'Days 6–13' },
    { name: 'Ovulation', range: 'Days 14–15' },
    { name: 'Luteal', range: 'Days 16–28' }
  ];

  return `
    <div class="vs-hormone-map">
      <div class="vs-hormone-title">Your 28-Day Hormone Map</div>
      <div class="vs-hormone-grid">
        ${phases.map(p => `
          <div class="vs-hormone-pill ${p.name === currentPhase ? 'active' : ''}">
            <div class="vs-hormone-name">${p.name}</div>
            <div class="vs-hormone-range">${p.range}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ===============================
   PHASE CONTENT
================================= */

const PHASE_CONTENT = {
  Menstrual: {
    name: 'Menstrual',
    tagline: 'Rest. Reflect. Reset.',
    tip: 'Prioritize gentle movement and recovery.',
    workout: 'Light yoga or stretching.',
    nutrition: 'Iron-rich foods and warm meals.',
    bg: '#fff6f6',
    border: '#f5c2c2',
    accent: '#e57373'
  },
  Follicular: {
    name: 'Follicular',
    tagline: 'Energy rising. Build momentum.',
    tip: 'Try new workouts and increase intensity.',
    workout: 'Strength training or pilates.',
    nutrition: 'Lean proteins and fresh greens.',
    bg: '#f3fbf6',
    border: '#b7e4c7',
    accent: '#2e7d32'
  },
  Ovulation: {
    name: 'Ovulation',
    tagline: 'Peak power. Go bold.',
    tip: 'Push intensity and challenge yourself.',
    workout: 'HIIT or full-body strength.',
    nutrition: 'High-protein meals and hydration.',
    bg: '#fff9e6',
    border: '#ffe082',
    accent: '#f9a825'
  },
  Luteal: {
    name: 'Luteal',
    tagline: 'Steady. Grounded. Strong.',
    tip: 'Support cravings with nourishing whole foods.',
    workout: 'Pilates or moderate strength.',
    nutrition: 'Magnesium-rich foods and complex carbs.',
    bg: '#f4f6ff',
    border: '#c5cae9',
    accent: '#5c6bc0'
  }
};