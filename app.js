'use strict';

/* ═══════════════════════════════════════════════════
   VivaSculpt Studio – app.js  (Premium Edition)
   Security: all user text via textContent only.
   No innerHTML with user data. No eval. No secrets.
   ═══════════════════════════════════════════════════ */

/* ─────────────── WORKOUT DATA ─────────────── */
const DEFAULT_MOVES = [
  { name:'Squat',            low:'Chair squat — touch seat, rise slowly', classic:'Full squat — drive through heels, chest tall' },
  { name:'Incline Push‑Up',  low:'Hands on counter/wall — slow tempo',    classic:'Hands on floor — full range push-up' },
  { name:'Reverse Lunge',    low:'Shallow range, hold wall for balance',  classic:'Drop knee low — drive front heel to rise' },
  { name:'Mountain Climbers',low:'Slow alternating knee drives on bench', classic:'High-speed knee drives on floor' },
  { name:'Plank Hold',       low:'Forearm plank on knees — steady breath',classic:'Full forearm plank — brace entire core' }
];
const MOVES_LOWER = [
  { name:'Glute Bridge',        low:'Feet flat, slow squeeze at top',        classic:'Single-leg, 3s hold at top' },
  { name:'Side-Lying Clam',     low:'Slow controlled rotation, ankle band',  classic:'Resistance band, full range' },
  { name:'Sumo Squat',          low:'Narrow stance, touch chair',            classic:'Wide stance, pulse at bottom' },
  { name:'Standing Hip Abduction',low:'Hold wall, slow controlled lift',     classic:'No support, add resistance band' },
  { name:'Donkey Kick',         low:'On hands & knees, small controlled arc',classic:'Full extension, squeeze glute at top' }
];
const MOVES_UPPER = [
  { name:'Wall Push-Up',        low:'Hands on wall — slow 4-count',          classic:'Floor push-up — full ROM' },
  { name:'Tricep Dip (Chair)',  low:'Bent knees, small range',               classic:'Legs extended, full dip' },
  { name:'Arm Circle',          low:'Small controlled circles, 30s each way', classic:'Large fast circles with light weights' },
  { name:'Shoulder Press (No Weight)',low:'Slow with control, feel the burn', classic:'Full ROM overhead press' },
  { name:'Superman Hold',       low:'Arms by sides, gentle back extension',   classic:'Arms overhead, 3s hold, lower slowly' }
];
const MOVES_CORE = [
  { name:'Dead Bug',            low:'Arms only variation, lower back pressed down',classic:'Opposite arm+leg, slow & controlled' },
  { name:'Bird Dog',            low:'Hold 2s, small range of motion',        classic:'Full extension, 3s hold, no spine rotation' },
  { name:'Standing Oblique Crunch',low:'Slow, hold at peak contraction',     classic:'Fast reps, add light dumbbell' },
  { name:'Plank Shoulder Tap',  low:'Knees down, slow alternating taps',     classic:'Full plank, minimal hip movement' },
  { name:'Glute Bridge Marching',low:'One foot lift at a time, small range', classic:'Alternating knee drives, hips high' }
];

const WORKOUTS_LOW = [
  { name:'Total Body Burn',        duration:'20 min', moves: DEFAULT_MOVES },
  { name:'Quiet Cardio Boost',     duration:'15 min', moves: [...DEFAULT_MOVES].reverse() },
  { name:'Standing Strength Flow', duration:'25 min', moves: DEFAULT_MOVES },
  { name:'Apartment HIIT Express', duration:'15 min', moves: DEFAULT_MOVES.slice(0,4) },
  { name:'Lower Body Tone',        duration:'20 min', moves: MOVES_LOWER },
  { name:'Morning Wake-Up Flow',   duration:'15 min', moves: DEFAULT_MOVES.slice(1) }
];
const WORKOUTS_CLASSIC = [
  { name:'Classic Full-Body HIIT', duration:'20 min', moves: DEFAULT_MOVES },
  { name:'Power Cardio Blast',     duration:'25 min', moves: [...DEFAULT_MOVES].reverse() },
  { name:'Core & Glute Shred',     duration:'20 min', moves: MOVES_CORE },
  { name:'Upper Body Finisher',    duration:'25 min', moves: MOVES_UPPER },
  { name:'HIIT Express',           duration:'15 min', moves: DEFAULT_MOVES.slice(0,4) },
  { name:'Strength & Sweat',       duration:'20 min', moves: [...MOVES_LOWER,...DEFAULT_MOVES.slice(0,2)] }
];

/* ─────────────── MEAL DATA ─────────────── */
const MEALS_STARTER = [
  {
    icon:'🫙', name:'Greek Yogurt Power Bowl',
    desc:'Full-fat Greek yogurt · mixed berries · walnuts · drizzle of raw honey · pinch of cinnamon',
    macros:['~25g protein','Healthy fats','Antioxidants']
  },
  {
    icon:'🥚', name:'Eggs, Veg & Olive Oil',
    desc:'2–3 eggs scrambled or poached · sautéed spinach & peppers · drizzle of extra-virgin olive oil · sea salt',
    macros:['~20g protein','Good fats','Iron-rich']
  },
  {
    icon:'🥗', name:'Chicken or Tofu Salad',
    desc:'Grilled chicken or firm tofu · mixed greens · cucumber · cherry tomatoes · olive oil & lemon dressing',
    macros:['~30g protein','Omega-3s','High fibre']
  },
  {
    icon:'🐟', name:'Salmon + Roasted Veg',
    desc:'Baked salmon or tofu · roasted broccoli & sweet potato · sliced avocado · squeeze of lemon',
    macros:['~35g protein','Omega-3 rich','Anti-inflammatory']
  }
];

/* Pro meals — 7 days rotating */
const MEALS_PRO = [
  { day:'Monday', icon:'🍳', name:'Protein Scramble & Rye Toast', desc:'3 eggs + egg white · baby spinach · feta · 1 slice rye toast · black coffee or green tea', macros:['~32g protein','Complex carbs','B12 rich'], calories:'420 kcal' },
  { day:'Tuesday', icon:'🥣', name:'Overnight Oats + Protein', desc:'Rolled oats · protein powder (vanilla) · almond milk · chia seeds · sliced banana · almond butter drizzle', macros:['~28g protein','Slow-release energy','Gut health'], calories:'480 kcal' },
  { day:'Wednesday', icon:'🍗', name:'Herb Chicken & Quinoa Bowl', desc:'Grilled herb chicken breast · cooked quinoa · roasted courgette & red pepper · tahini drizzle · parsley', macros:['~40g protein','Complete amino acids','Anti-inflammatory'], calories:'510 kcal' },
  { day:'Thursday', icon:'🥑', name:'Smashed Avo & Cottage Cheese', desc:'2-egg omelette · smashed avocado on sourdough · cottage cheese · cherry tomatoes · chilli flakes', macros:['~26g protein','Healthy fats','Probiotic'], calories:'440 kcal' },
  { day:'Friday', icon:'🐟', name:'Teriyaki Salmon Rice Bowl', desc:'Baked salmon fillet · brown rice · edamame · shredded cabbage · ginger-soy dressing · sesame seeds', macros:['~38g protein','Omega-3 rich','Zinc & selenium'], calories:'530 kcal' },
  { day:'Saturday', icon:'🥙', name:'Turkey & Hummus Wrap', desc:'Lean turkey slices · wholegrain wrap · hummus · baby spinach · roasted peppers · cucumber · lemon squeeze', macros:['~34g protein','High fibre','Gut friendly'], calories:'460 kcal' },
  { day:'Sunday', icon:'🍲', name:'Lentil & Vegetable Stew', desc:'Red lentils · diced tomatoes · sweet potato · spinach · cumin & turmeric · served with sourdough', macros:['~22g protein','Plant-based iron','Anti-inflammatory'], calories:'490 kcal' }
];

const GROCERY_STARTER = {
  'Protein': ['Greek yogurt (full-fat)','Eggs (×12)','Chicken breast','Firm tofu','Salmon fillet','Cottage cheese'],
  'Produce': ['Baby spinach','Broccoli','Sweet potato','Bell peppers','Cucumber','Cherry tomatoes','Mixed berries','Lemon','Avocado'],
  'Healthy Fats': ['Extra-virgin olive oil','Walnuts','Almonds','Almond butter'],
  'Pantry': ['Raw honey','Garlic','Sea salt','Black pepper','Cinnamon','Apple cider vinegar']
};
const GROCERY_PRO = {
  'Proteins': ['Eggs (×18)','Chicken breast (×4)','Salmon fillets (×2)','Lean turkey slices','Red lentils','Edamame (frozen)','Protein powder (vanilla)','Cottage cheese','Feta cheese'],
  'Produce': ['Baby spinach (large bag)','Courgette','Red pepper (×3)','Broccoli','Sweet potato (×2)','Cherry tomatoes','Cucumber','Banana (×4)','Avocado (×2)','Parsley','Cabbage'],
  'Grains': ['Brown rice','Rolled oats','Quinoa','Rye bread','Sourdough bread','Wholegrain wraps'],
  'Fats & Sauces': ['Extra-virgin olive oil','Tahini','Almond butter','Sesame seeds','Ginger','Soy sauce (low sodium)','Hummus'],
  'Pantry': ['Chia seeds','Almond milk','Cumin','Turmeric','Chilli flakes','Sea salt','Black pepper','Lemon (×4)']
};

/* ─────────────── REVIEWS ─────────────── */
const REVIEWS = [
  { text:'"I lost 4kg in my first month. The 20-min sessions are genuinely challenging — I never feel like I\'m cutting corners."', author:'Sofia M.', tag:'Lost 4kg in 30 days', stars:5 },
  { text:'"Finally a fitness app that respects I live in a flat. Zero jumping, zero noise complaints. My neighbours have no idea."', author:'Priya R.', tag:'Apartment-friendly convert', stars:5 },
  { text:'"The meal templates changed everything. Simple, protein-rich, and I actually enjoy eating this way now."', author:'Camille D.', tag:'Starter plan member', stars:5 },
  { text:'"I\'ve tried so many programmes. VivaSculpt is the first one I\'ve stuck with past week 2. The 15-min option is my secret weapon."', author:'Amara T.', tag:'3-month member', stars:5 },
  { text:'"The low-impact option isn\'t easier — it\'s smarter. My knees feel great and I\'m stronger than I\'ve been in years."', author:'Laura K.', tag:'Low-impact devotee', stars:5 },
  { text:'"Upgraded to Pro for the meal plans. Worth every penny. I meal prep on Sunday using the grocery list — takes 1 hour."', author:'Natasha B.', tag:'Pro member', stars:5 }
];

/* ─────────────── FAQ ─────────────── */
const FAQ = [
  { q:'Can I cancel anytime?', a:'Yes. Cancel anytime through your PayPal account before your next renewal date and you won\'t be charged again. No penalties, no questions.' },
  { q:'What\'s the difference between Starter and Pro?', a:'Starter gives you all HIIT workouts, the today builder, 4 meal templates, and the 7-Day Kickstart. Pro adds 7-day rotating meal plans with full macros, weekly prep guides, and priority support.' },
  { q:'Do I need equipment?', a:'No equipment required. Every exercise has a bodyweight version. You need only a small clear floor space and an optional chair for some modifications.' },
  { q:'I\'m a complete beginner — is this for me?', a:'Absolutely. Choose the Low-Impact intensity and Beginner level (2 rounds). Every move has a modification shown during the workout. Start with 15-minute sessions.' },
  { q:'How does the 7-day trial work?', a:'You start the Starter plan trial — no payment is taken for 7 days. If you cancel before the trial ends, you are never charged. After 7 days it renews at $14/month via PayPal.' },
  { q:'Is this safe if I have a health condition?', a:'Always consult your doctor before starting any new exercise programme. All content is general wellness information, not medical advice. Choose Low-Impact and start slowly.' }
];

/* ─────────────── KICKSTART PLAN ─────────────── */
const DAY_PLAN = [
  { label:'Day 1', workout:'HIIT A — Full Body', desc:'Today tab · Classic or Low-Impact · 20 min', tag:'hiit', tagLabel:'HIIT' },
  { label:'Day 2', workout:'Recovery + Steps',    desc:'20–30 min walk · light stretching · hydrate', tag:'rest', tagLabel:'Rest' },
  { label:'Day 3', workout:'HIIT B — Lower Body + Core', desc:'Today tab · Beginner or Intermediate · 20 min', tag:'hiit', tagLabel:'HIIT' },
  { label:'Day 4', workout:'Recovery + Reset',    desc:'Yoga stretches · foam roll · good sleep', tag:'rest', tagLabel:'Rest' },
  { label:'Day 5', workout:'HIIT C — Upper Body + Finisher', desc:'Today tab · push to Intermediate · 25 min', tag:'hiit', tagLabel:'HIIT' },
  { label:'Day 6', workout:'Optional 15-min Burner', desc:'Only if energy allows — never force it', tag:'optional', tagLabel:'Optional' },
  { label:'Day 7', workout:'Recovery + Check-in', desc:'Weigh in · progress photos · 3-word reflection', tag:'rest', tagLabel:'Rest' }
];

/* ─────────────── STATE ─────────────── */
const state = {
  duration:'15', intensity:'low', level:'beginner',
  audioEnabled:true,
  plan: null, // 'starter' | 'pro' | null
  workout:{
    moves:[], moveIndex:0, round:1, totalRounds:2,
    phase:'work', timeLeft:40, paused:false, interval:null
  }
};

/* ─────────────── SECURITY UTILS ─────────────── */
// All user-provided text rendered with textContent ONLY.
// This function is a reminder — never pass user strings to innerHTML.
function safeText(el, str) {
  el.textContent = String(str);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

/* ─────────────── PLAN / PAYPAL ─────────────── */
const PLAN_KEY  = 'vs_plan';
const PLAN_DATE = 'vs_plan_date';
const TRIAL_KEY = 'vs_trial_start';
const TRIAL_DAYS = 7;

function getPlan() {
  return localStorage.getItem(PLAN_KEY) || null;
}
function setPlan(plan) {
  // Only store plan identifier — no sensitive data
  localStorage.setItem(PLAN_KEY, plan);
  localStorage.setItem(PLAN_DATE, Date.now().toString());
}
function getTrialState() {
  const start = localStorage.getItem(TRIAL_KEY);
  if (!start) return null;
  const startMs = parseInt(start, 10);
  const endMs   = startMs + TRIAL_DAYS * 86400000;
  const now     = Date.now();
  return { active: now < endMs, expired: now >= endMs, daysLeft: Math.max(0, Math.ceil((endMs - now) / 86400000)), endDate: new Date(endMs) };
}
function startTrial() {
  localStorage.setItem(TRIAL_KEY, Date.now().toString());
  setPlan('trial_starter');
}

/* ─────────────── PAYPAL SUBSCRIPTION IDs ─────────────── */
const PAYPAL_PLAN_STARTER = 'P-1DD23981LB678535ENHKLPHI';
const PAYPAL_PLAN_PRO     = 'P-4UP82455HM149604SNHKLU3Y';

function renderPayPalButton(containerId, planId, planLabel) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  // Single button — opens PayPal hosted checkout in same tab
  // User can pay with PayPal account OR credit/debit card on that page
  var btn = document.createElement('button');
  btn.className = 'btn-primary';
  btn.style.cssText = 'width:100%;font-size:.95rem;gap:.6rem;';
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Subscribe — ' + (planLabel === 'pro' ? '$29/mo' : '$14/mo');

  var url = 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=' + planId;
  btn.addEventListener('click', function() {
    window.location.href = url;
  });

  var note = document.createElement('p');
  note.style.cssText = 'font-size:.7rem;color:var(--text-muted);text-align:center;margin-top:.4rem;';
  note.textContent = 'Pay with PayPal or any card · Powered by PayPal';

  container.appendChild(btn);
  container.appendChild(note);
}

function showWelcomeScreen() {
  var box = document.createElement('div');
  box.id = 'welcome-screen';
  box.style.cssText = 'position:fixed;inset:0;background:var(--emerald-deeper);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:2rem;text-align:center;';
  box.innerHTML = '<div style="font-size:3.5rem;margin-bottom:1rem">🎉</div><h2 style="font-family:var(--font-display);font-size:2rem;color:#fff;margin-bottom:.5rem">Welcome to VivaSculpt!</h2><p style="color:rgba(255,255,255,.75);margin-bottom:2rem;max-width:280px;line-height:1.6">Your subscription is active. Time to move.</p><button onclick="document.getElementById(\'welcome-screen\').remove();switchTab(\'today\')" style="background:#fff;color:var(--emerald-deeper);border:none;padding:.9rem 2rem;border-radius:10px;font-weight:800;font-size:1rem;cursor:pointer;">Start Training →</button>';
  document.body.appendChild(box);
}

// Buttons are now pure HTML links — no JS injection needed
window.openPayPal = function(planType) {
  switchTab('pricing');
};

function updatePlanBadge() {
  const plan   = getPlan();
  const trial  = getTrialState();
  const badge  = document.getElementById('header-plan-badge');
  const planCard = document.getElementById('active-plan-card');

  if (!plan) { badge.classList.add('hidden'); return; }

  badge.classList.remove('hidden');

  if (plan === 'trial_starter' && trial && trial.active) {
    safeText(badge, 'Trial · ' + trial.daysLeft + 'd left');
    if (planCard) {
      planCard.classList.remove('hidden');
      safeText(planCard, '🎉 Trial active — ' + trial.daysLeft + ' days remaining. Ends ' + trial.endDate.toLocaleDateString());
    }
  } else if (plan === 'starter') {
    safeText(badge, 'Starter');
    if (planCard) { planCard.classList.remove('hidden'); safeText(planCard, '✅ Starter plan active'); }
  } else if (plan === 'pro') {
    safeText(badge, 'Pro ✦');
    if (planCard) { planCard.classList.remove('hidden'); safeText(planCard, '✨ Pro plan active — full access'); }
  }
}

function updateTrialBanner() {
  const banner = document.getElementById('trial-banner');
  const trial  = getTrialState();
  if (trial && trial.active) {
    banner.classList.remove('hidden');
    safeText(banner, 'Trial active · ' + trial.daysLeft + ' day' + (trial.daysLeft !== 1 ? 's' : '') + ' left · Subscribe to continue after trial.');
  } else {
    banner.classList.add('hidden');
  }
}

function checkPaywall() {
  const trial = getTrialState();
  const plan  = getPlan();
  if (trial && trial.expired && plan === 'trial_starter') {
    openModal('modal-paywall');
  }
}

/* ─────────────── TAB NAVIGATION ─────────────── */
function switchTab(tabId) {
  document.querySelectorAll('.tab-section').forEach(s => { s.classList.remove('active'); s.hidden = true; });
  document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); });
  const sec = document.getElementById('tab-' + tabId);
  const btn = document.querySelector('[data-tab="' + tabId + '"]');
  if (sec) { sec.classList.add('active'); sec.hidden = false; }
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-current','page'); }
  if (tabId === 'pricing') updatePlanBadge();
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

/* ─────────────── MODALS ─────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.hidden = false;
  requestAnimationFrame(() => {
    const f = m.querySelector('button,input,a[href]');
    if (f) f.focus();
  });
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.hidden = true;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m => {
      if (m.id !== 'modal-paywall') closeModal(m.id);
    });
  }
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay && overlay.id !== 'modal-paywall') closeModal(overlay.id);
  });
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal('modal-' + btn.dataset.modal));
});
document.getElementById('btn-security').addEventListener('click', () => openModal('modal-security'));

/* ─────────────── WORKOUT PLAYER ─────────────── */
const WORK_TIME = 40;
const REST_TIME = 20;
const CIRC = 2 * Math.PI * 54; // 339.3

function startWorkout(moves) {
  const trial = getTrialState();
  const plan  = getPlan();
  if (trial && trial.expired && plan === 'trial_starter') { openModal('modal-paywall'); return; }

  const rounds = state.level === 'beginner' ? 2 : 3;
  clearInterval(state.workout.interval);
  Object.assign(state.workout, {
    moves: moves || DEFAULT_MOVES, moveIndex:0, round:1,
    totalRounds:rounds, phase:'work', timeLeft:WORK_TIME, paused:false, interval:null
  });
  updatePlayerUI();
  openModal('modal-workout');
  runInterval();
}

function updatePlayerUI() {
  const w = state.workout;
  const move = w.moves[w.moveIndex];
  safeText(document.getElementById('player-round'), 'Round ' + w.round + ' / ' + w.totalRounds);
  const phaseEl = document.getElementById('player-phase');
  safeText(phaseEl, w.phase === 'work' ? 'WORK' : 'REST');
  phaseEl.classList.toggle('rest-phase', w.phase === 'rest');
  const ring = document.getElementById('ring-fg');
  const total = w.phase === 'work' ? WORK_TIME : REST_TIME;
  ring.style.strokeDashoffset = CIRC * (1 - w.timeLeft / total);
  ring.classList.toggle('rest-ring', w.phase === 'rest');
  safeText(document.getElementById('player-time'), w.timeLeft);
  safeText(document.getElementById('player-move'), move ? move.name : '–');
  const modEl = document.getElementById('player-mod');
  if (move) safeText(modEl, (state.intensity === 'low' ? '🟢 ' + move.low : '🔴 ' + move.classic));
  else modEl.textContent = '';
  const nextEl = document.getElementById('player-next-move');
  const nextLabel = document.querySelector('.next-label');
  if (w.phase === 'rest') {
    safeText(nextEl, move ? move.name : '–');
    if (nextLabel) safeText(nextLabel, 'Up next:');
  } else {
    const nm = w.moves[w.moveIndex + 1];
    safeText(nextEl, nm ? nm.name : 'Last move!');
    if (nextLabel) safeText(nextLabel, 'Next:');
  }
  safeText(document.getElementById('btn-pause'), w.paused ? 'Resume' : 'Pause');
}

function runInterval() {
  clearInterval(state.workout.interval);
  state.workout.interval = setInterval(tick, 1000);
}

function tick() {
  const w = state.workout;
  if (w.paused) return;
  w.timeLeft--;
  if (w.timeLeft <= 0) {
    if (w.phase === 'work') {
      w.phase = 'rest'; w.timeLeft = REST_TIME; beep(330,.15,.08);
    } else {
      w.moveIndex++;
      if (w.moveIndex >= w.moves.length) {
        if (w.round < w.totalRounds) {
          w.round++; w.moveIndex = 0; w.phase = 'work'; w.timeLeft = WORK_TIME; beep(660,.2,.15);
        } else { endWorkout(true); return; }
      } else {
        w.phase = 'work'; w.timeLeft = WORK_TIME;
      }
    }
  } else if (w.timeLeft <= 3 && w.phase === 'work') { beep(880,.08,.05); }
  updatePlayerUI();
}

function endWorkout(complete) {
  clearInterval(state.workout.interval);
  state.workout.interval = null;
  closeModal('modal-workout');
  if (complete) openModal('modal-complete');
}

let audioCtx = null;
function beep(freq, dur, vol) {
  if (!state.audioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + dur);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  } catch(_) {}
}

/* ─────────────── PLAYER BUTTONS ─────────────── */
document.getElementById('btn-start-today').addEventListener('click', () => startWorkout(null));
document.getElementById('btn-audio').addEventListener('click', () => {
  state.audioEnabled = !state.audioEnabled;
  document.getElementById('btn-audio').setAttribute('aria-pressed', state.audioEnabled);
  document.getElementById('icon-audio-on').style.display  = state.audioEnabled ? '' : 'none';
  document.getElementById('icon-audio-off').style.display = state.audioEnabled ? 'none' : '';
});
document.getElementById('btn-pause').addEventListener('click', () => {
  state.workout.paused = !state.workout.paused;
  safeText(document.getElementById('btn-pause'), state.workout.paused ? 'Resume' : 'Pause');
});
document.getElementById('btn-next-move').addEventListener('click', () => {
  const w = state.workout;
  w.moveIndex++;
  if (w.moveIndex >= w.moves.length) {
    if (w.round < w.totalRounds) { w.round++; w.moveIndex = 0; w.phase = 'work'; w.timeLeft = WORK_TIME; }
    else { endWorkout(true); return; }
  } else { w.phase = 'work'; w.timeLeft = WORK_TIME; }
  updatePlayerUI();
});
document.getElementById('btn-end-workout').addEventListener('click', () => endWorkout(false));

/* ─────────────── PILL GROUPS ─────────────── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const g = pill.dataset.group;
    document.querySelectorAll('[data-group="'+g+'"]').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state[g] = pill.dataset.value;
  });
});

/* ─────────────── ACCORDIONS (workouts) ─────────────── */
document.querySelectorAll('.accordion-trigger').forEach(t => {
  t.addEventListener('click', () => {
    const expanded = t.getAttribute('aria-expanded') === 'true';
    t.setAttribute('aria-expanded', !expanded);
    document.getElementById(t.getAttribute('aria-controls')).hidden = expanded;
  });
});

/* ─────────────── BUILD WORKOUT LISTS ─────────────── */
function buildWorkoutList(containerId, workouts) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  workouts.forEach(w => {
    const item = document.createElement('div'); item.className = 'workout-item';
    const info = document.createElement('div');
    const name = document.createElement('div'); name.className = 'workout-name'; safeText(name, w.name);
    const meta = document.createElement('div'); meta.className = 'workout-meta'; safeText(meta, w.duration);
    info.appendChild(name); info.appendChild(meta);
    const btn = document.createElement('button'); btn.className = 'workout-start';
    safeText(btn, 'Start'); btn.setAttribute('aria-label', 'Start ' + w.name);
    btn.addEventListener('click', () => startWorkout(w.moves));
    item.appendChild(info); item.appendChild(btn); el.appendChild(item);
  });
}
buildWorkoutList('workout-list-low', WORKOUTS_LOW);
buildWorkoutList('workout-list-classic', WORKOUTS_CLASSIC);

/* ─────────────── BUILD MEALS ─────────────── */
function buildMealCard(meal, includeDay) {
  const card = document.createElement('div'); card.className = 'meal-card';
  const icon = document.createElement('div'); icon.className = 'meal-icon'; safeText(icon, meal.icon);
  const body = document.createElement('div');
  if (includeDay && meal.day) {
    const dayLbl = document.createElement('div'); dayLbl.className = 'meal-day-label'; safeText(dayLbl, meal.day);
    body.appendChild(dayLbl);
  }
  const name = document.createElement('div'); name.className = 'meal-name'; safeText(name, meal.name);
  const desc = document.createElement('div'); desc.className = 'meal-desc'; safeText(desc, meal.desc);
  const macros = document.createElement('div'); macros.className = 'meal-macro';
  (meal.macros || []).forEach(m => {
    const pill = document.createElement('span'); pill.className = 'macro-pill'; safeText(pill, m); macros.appendChild(pill);
  });
  if (meal.calories) {
    const cal = document.createElement('span'); cal.className = 'macro-pill';
    cal.style.background = 'var(--gold-bg)'; cal.style.color = 'var(--gold)'; cal.style.borderColor = 'var(--gold-border)';
    safeText(cal, meal.calories); macros.appendChild(cal);
  }
  body.appendChild(name); body.appendChild(desc); body.appendChild(macros);
  card.appendChild(icon); card.appendChild(body);
  return card;
}

function buildMealsGrid(containerId, meals, includeDay) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  meals.forEach(m => el.appendChild(buildMealCard(m, includeDay)));
}
buildMealsGrid('meals-grid-starter', MEALS_STARTER, false);
buildMealsGrid('meals-grid-pro', MEALS_PRO, true);

/* ─────────────── MEAL PLAN TABS ─────────────── */
document.querySelectorAll('.plan-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.plan-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    const plan = tab.dataset.plan;
    document.querySelectorAll('.meals-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('meals-' + plan).classList.remove('hidden');
    // Check if user has Pro access
    if (plan === 'pro') {
      const userPlan = getPlan();
      if (userPlan === 'pro') {
        document.getElementById('pro-meal-gate').classList.add('hidden');
        document.getElementById('meals-pro-content').classList.remove('hidden');
      }
    }
  });
});
document.getElementById('btn-upgrade-meals').addEventListener('click', () => {
  switchTab('pricing'); window.openPayPal('pro');
});

/* ─────────────── GROCERY LISTS ─────────────── */
function buildGroceryList(containerId, data) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  Object.entries(data).forEach(([section, items]) => {
    const lbl = document.createElement('span'); lbl.className = 'grocery-section'; safeText(lbl, section); el.appendChild(lbl);
    const grid = document.createElement('div'); grid.className = 'grocery-grid';
    items.forEach(item => {
      const div = document.createElement('div'); div.className = 'grocery-item'; safeText(div, item); grid.appendChild(div);
    });
    el.appendChild(grid);
  });
}
document.getElementById('btn-grocery-starter').addEventListener('click', () => {
  const el = document.getElementById('grocery-list-starter');
  buildGroceryList('grocery-list-starter', GROCERY_STARTER);
  el.hidden = false;
  el.scrollIntoView({ behavior:'smooth', block:'start' });
});
document.getElementById('btn-grocery-pro').addEventListener('click', () => {
  const el = document.getElementById('grocery-list-pro');
  buildGroceryList('grocery-list-pro', GROCERY_PRO);
  el.hidden = false;
  el.scrollIntoView({ behavior:'smooth', block:'start' });
});

/* ─────────────── REVIEWS ─────────────── */
function buildReviews() {
  const track = document.getElementById('reviews-track');
  if (!track) return;
  REVIEWS.forEach(r => {
    const card = document.createElement('div'); card.className = 'review-card';
    const stars = document.createElement('div'); stars.className = 'review-stars'; safeText(stars, '★'.repeat(r.stars));
    const text = document.createElement('div'); text.className = 'review-text'; safeText(text, r.text);
    const author = document.createElement('div'); author.className = 'review-author'; safeText(author, r.author);
    const tag = document.createElement('div'); tag.className = 'review-tag'; safeText(tag, r.tag);
    card.appendChild(stars); card.appendChild(text); card.appendChild(author); card.appendChild(tag);
    track.appendChild(card);
  });
}
buildReviews();

/* ─────────────── DAY PLAN ─────────────── */
function buildDayPlan() {
  const el = document.getElementById('day-plan');
  if (!el) return;
  DAY_PLAN.forEach(day => {
    const item = document.createElement('div'); item.className = 'day-item';
    const lbl = document.createElement('div'); lbl.className = 'day-label'; safeText(lbl, day.label);
    const info = document.createElement('div');
    const name = document.createElement('div'); name.className = 'day-workout'; safeText(name, day.workout);
    const desc = document.createElement('div'); desc.className = 'day-desc'; safeText(desc, day.desc);
    info.appendChild(name); info.appendChild(desc);
    const tag = document.createElement('div'); tag.className = 'day-tag ' + day.tag; safeText(tag, day.tagLabel);
    item.appendChild(lbl); item.appendChild(info); item.appendChild(tag); el.appendChild(item);
  });
}
buildDayPlan();

/* ─────────────── FAQ ─────────────── */
function buildFAQ() {
  const el = document.getElementById('faq-list');
  if (!el) return;
  FAQ.forEach((item, i) => {
    const wrapper = document.createElement('div'); wrapper.className = 'faq-item';
    const btn = document.createElement('button'); btn.className = 'faq-trigger';
    btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','faq-body-'+i);
    btn.setAttribute('type','button');
    const qText = document.createElement('span'); safeText(qText, item.q);
    const arrow = document.createElement('svg'); arrow.setAttribute('class','faq-arrow'); arrow.setAttribute('width','18'); arrow.setAttribute('height','18'); arrow.setAttribute('viewBox','0 0 24 24'); arrow.setAttribute('fill','none'); arrow.setAttribute('stroke','currentColor'); arrow.setAttribute('stroke-width','2'); arrow.setAttribute('aria-hidden','true');
    arrow.innerHTML = '<polyline points="6,9 12,15 18,9"/>';
    btn.appendChild(qText); btn.appendChild(arrow);
    const body = document.createElement('div'); body.className = 'faq-body'; body.id = 'faq-body-'+i; body.hidden = true;
    safeText(body, item.a);
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded); body.hidden = expanded;
    });
    wrapper.appendChild(btn); wrapper.appendChild(body); el.appendChild(wrapper);
  });
}
buildFAQ();

/* ─────────────── PDF BUTTON ─────────────── */
// TODO: When your PDF is ready, remove this listener and set the href in index.html:
// <a href="assets/vivasculpt-kickstart.pdf" ...>
document.getElementById('btn-pdf').addEventListener('click', e => {
  e.preventDefault();
  // Just scroll to the "coming soon" note below the button — no popup
  const note = document.querySelector('#tab-kickstart .helper-text');
  if (note) note.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ═══════════════════════════════════════════════════
   DAILY PROTOCOL — Cycle + Mood Engine
   ═══════════════════════════════════════════════════ */

const PROTOCOL_DATA = {
  // [mood][phase] → protocol
  low: {
    menstrual:  { workout:{ name:'Recovery Flow', desc:'Gentle bodyweight movement — honour your body today', moves: DEFAULT_MOVES.slice(0,3) }, meal:{ name:'Iron-Rich Warm Bowl', desc:'Lentil soup · dark leafy greens · beetroot · warm ginger tea · dark chocolate square' }, recovery:{ name:'Box Breathing', desc:'4s inhale · 4s hold · 4s exhale · 4s hold — repeat 5×' }, header:'Gentle day. Full credit.', icon:'🌸' },
    follicular: { workout:{ name:'Light Strength Flow', desc:'Low-intensity · 2 rounds · no jumping', moves: DEFAULT_MOVES.slice(0,3) }, meal:{ name:'Fresh Protein Plate', desc:'Eggs · avocado · mixed greens · lemon · pumpkin seeds' }, recovery:{ name:'Hip Mobility Flow', desc:'5 min · deep hip circles · cat-cow · child\'s pose' }, header:'Easy does it. Still showing up.', icon:'🌱' },
    ovulation:  { workout:{ name:'Balanced HIIT', desc:'Moderate intensity · your body can handle more today', moves: DEFAULT_MOVES }, meal:{ name:'High-Energy Bowl', desc:'Chicken · quinoa · roasted veg · olive oil · lemon' }, recovery:{ name:'Shoulder Roll & Stretch', desc:'3 min · roll tension away before rest' }, header:'Even on low days, you move.', icon:'⚡' },
    luteal:     { workout:{ name:'Slow Strength', desc:'Low-impact · focus on form not speed', moves: MOVES_LOWER }, meal:{ name:'Fibre-Rich Comfort', desc:'Sweet potato · black beans · spinach · tahini · warming spices' }, recovery:{ name:'Legs Up the Wall', desc:'5 min · elevate legs · deep breathing · reduce bloating' }, header:'Stable. Steady. Strong.', icon:'🌙' },
    none:       { workout:{ name:'Recovery Flow', desc:'Gentle movement · honour where you are', moves: DEFAULT_MOVES.slice(0,3) }, meal:{ name:'Protein & Greens', desc:'Greek yogurt · spinach · walnuts · lemon · honey' }, recovery:{ name:'Box Breathing', desc:'2–5 min · calm the nervous system' }, header:'Rest is productive.', icon:'🧘' }
  },
  neutral: {
    menstrual:  { workout:{ name:'Low-Impact HIIT', desc:'Apartment-friendly · no jumping · 20 min', moves: DEFAULT_MOVES }, meal:{ name:'Iron & Warmth', desc:'Lentils · spinach · roasted sweet potato · ginger · turmeric' }, recovery:{ name:'Seated Mobility', desc:'5 min · seated twists · neck rolls · wrist circles' }, header:'Balanced day. Balanced effort.', icon:'⚖️' },
    follicular: { workout:{ name:'Full Body HIIT', desc:'Energy is building — use it · 20 min', moves: DEFAULT_MOVES }, meal:{ name:'Fresh & Protein-Forward', desc:'Grilled chicken · mixed greens · cucumber · olive oil · lemon' }, recovery:null, header:'Rising energy. Rise with it.', icon:'🌱' },
    ovulation:  { workout:{ name:'Classic HIIT', desc:'Peak energy phase · go for it · 25 min', moves: [...DEFAULT_MOVES, ...MOVES_UPPER.slice(0,2)] }, meal:{ name:'Performance Plate', desc:'Salmon · brown rice · broccoli · avocado · sesame' }, recovery:null, header:'Peak phase. Peak effort.', icon:'🔥' },
    luteal:     { workout:{ name:'Strength & Core', desc:'Focus on control · no rushing · 20 min', moves: [...MOVES_LOWER, ...MOVES_CORE.slice(0,2)] }, meal:{ name:'Craving-Stable Meal', desc:'Turkey wrap · hummus · spinach · roasted peppers · complex carbs' }, recovery:{ name:'Foam Roll + Stretch', desc:'5 min · quads · hamstrings · lower back' }, header:'Steady wins. Every time.', icon:'🌙' },
    none:       { workout:{ name:'Balanced HIIT', desc:'Solid session · 20 min · you\'ve got this', moves: DEFAULT_MOVES }, meal:{ name:'Balanced Plate', desc:'Eggs · veg · olive oil · whole grain toast' }, recovery:null, header:'Show up. Do the work.', icon:'💪' }
  },
  high: {
    menstrual:  { workout:{ name:'Low-Impact Power', desc:'Channel that energy gently · protect your body', moves: DEFAULT_MOVES }, meal:{ name:'Iron Power Bowl', desc:'Spinach · lentils · pumpkin seeds · beetroot · tahini dressing' }, recovery:null, header:'Energy up. Intensity smart.', icon:'⚡' },
    follicular: { workout:{ name:'Strength Builder', desc:'Follicular + fired up = ideal combo · 25 min', moves: [...DEFAULT_MOVES, ...MOVES_UPPER.slice(0,3)] }, meal:{ name:'Build & Recover', desc:'Chicken breast · quinoa · roasted veg · almonds · lemon' }, recovery:null, header:'Best time to push. Push.', icon:'🚀' },
    ovulation:  { workout:{ name:'Performance HIIT', desc:'Peak phase + peak mood · full power · 25 min', moves: [...DEFAULT_MOVES, ...MOVES_CORE] }, meal:{ name:'Performance Fuel', desc:'Salmon · sweet potato · edamame · avocado · ginger-soy' }, recovery:null, header:'No ceiling today.', icon:'🔥' },
    luteal:     { workout:{ name:'Endurance Flow', desc:'High mood, but body needs balance · 20 min', moves: [...MOVES_LOWER, ...DEFAULT_MOVES.slice(0,3)] }, meal:{ name:'Fibre + Protein Balance', desc:'Oats · protein powder · chia · banana · almond butter' }, recovery:{ name:'Cool Down Stretch', desc:'5 min · don\'t skip — luteal needs recovery too' }, header:'Fired up. Stay balanced.', icon:'⚡' },
    none:       { workout:{ name:'Full Power HIIT', desc:'Energy is high — use every drop · 25 min', moves: [...DEFAULT_MOVES, ...MOVES_UPPER.slice(0,2)] }, meal:{ name:'High Performance Plate', desc:'Grilled protein · complex carbs · healthy fats · hydrate well' }, recovery:null, header:'All systems go.', icon:'🔥' }
  }
};

const IDENTITY_MESSAGES = [
  '"You showed up today."',
  '"Consistency is becoming your default."',
  '"No negotiation. Just action."',
  '"You did the thing."',
  '"Another day. Another rep."',
  '"Your future self remembers this."',
  '"One session closer."',
  '"This is who you are now."'
];

const STREAK_KEY = 'vs_streak';
const STREAK_DATE_KEY = 'vs_streak_date';

function getStreak() {
  const streak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
  const lastDate = localStorage.getItem(STREAK_DATE_KEY);
  const today = new Date().toDateString();
  if (lastDate === today) return streak; // already done today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return lastDate === yesterday ? streak : 0; // reset if missed day
}
function incrementStreak() {
  const lastDate = localStorage.getItem(STREAK_DATE_KEY);
  const today = new Date().toDateString();
  if (lastDate === today) return getStreak(); // don't double count
  const streak = getStreak() + 1;
  localStorage.setItem(STREAK_KEY, streak.toString());
  localStorage.setItem(STREAK_DATE_KEY, today);
  return streak;
}

let protocolState = { mood: null, phase: 'none', protocol: null };
let protocolWorkout = { moves:[], moveIndex:0, round:1, totalRounds:2, phase:'work', timeLeft:40, paused:false, interval:null };

function buildProtocol() {
  const { mood, phase } = protocolState;
  if (!mood) return;
  const phaseKey = phase || 'none';
  const p = PROTOCOL_DATA[mood][phaseKey] || PROTOCOL_DATA[mood]['none'];
  protocolState.protocol = p;

  // Update output card
  safeText(document.getElementById('proto-header-icon'), p.icon);
  safeText(document.getElementById('proto-header-title'), p.header);
  safeText(document.getElementById('proto-header-sub'), `${mood === 'low' ? '😩 Low' : mood === 'high' ? '🔥 Fired' : '😐 OK'} energy${phase !== 'none' ? ' · ' + phase : ''}`);
  safeText(document.getElementById('proto-workout-name'), p.workout.name);
  safeText(document.getElementById('proto-workout-desc'), p.workout.desc);
  safeText(document.getElementById('proto-meal-name'), p.meal.name);
  safeText(document.getElementById('proto-meal-desc'), p.meal.desc);

  const recoveryBlock = document.getElementById('proto-recovery-block');
  if (p.recovery) {
    recoveryBlock.hidden = false;
    safeText(document.getElementById('proto-recovery-name'), p.recovery.name);
    safeText(document.getElementById('proto-recovery-desc'), p.recovery.desc);
  } else {
    recoveryBlock.hidden = true;
  }

  document.getElementById('protocol-output').classList.remove('hidden');
  document.getElementById('btn-start-protocol').classList.remove('hidden');
}

// Mood buttons
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    protocolState.mood = btn.dataset.mood;
    buildProtocol();
  });
});

// Phase buttons
document.querySelectorAll('.phase-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    protocolState.phase = btn.dataset.phase;
    buildProtocol();
  });
});

// START button — launches full-screen player
document.getElementById('btn-start-protocol').addEventListener('click', () => {
  const p = protocolState.protocol;
  if (!p) return;
  const rounds = 2;
  const moves = p.workout.moves || DEFAULT_MOVES;
  Object.assign(protocolWorkout, {
    moves, moveIndex:0, round:1, totalRounds:rounds,
    phase:'work', timeLeft:40, paused:false
  });
  clearInterval(protocolWorkout.interval);
  updateProtocolPlayerUI();
  document.getElementById('protocol-player').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  protocolWorkout.interval = setInterval(tickProtocol, 1000);
});

function updateProtocolPlayerUI() {
  const w = protocolWorkout;
  const move = w.moves[w.moveIndex];
  const CIRC = 2 * Math.PI * 72; // r=72 → 452.4

  safeText(document.getElementById('pp-phase'), w.phase === 'work' ? 'WORK' : 'REST');
  safeText(document.getElementById('pp-move'), move ? move.name : '–');
  const modEl = document.getElementById('pp-mod');
  if (move) safeText(modEl, protocolState.mood === 'low' ? '🟢 ' + move.low : '🔴 ' + move.classic);
  else modEl.textContent = '';
  safeText(document.getElementById('pp-time'), w.timeLeft);
  safeText(document.getElementById('pp-round'), 'Round ' + w.round + ' / ' + w.totalRounds);
  const total = w.phase === 'work' ? 40 : 20;
  const ring = document.getElementById('pp-ring-fg');
  ring.style.strokeDashoffset = CIRC * (1 - w.timeLeft / total);
  const nextMove = w.moves[w.moveIndex + 1];
  safeText(document.getElementById('pp-next-move'), nextMove ? nextMove.name : 'Last move!');
  safeText(document.getElementById('pp-btn-pause'), w.paused ? 'Resume' : 'Pause');
}

function tickProtocol() {
  const w = protocolWorkout;
  if (w.paused) return;
  w.timeLeft--;
  if (w.timeLeft <= 0) {
    if (w.phase === 'work') {
      w.phase = 'rest'; w.timeLeft = 20; beep(330,.15,.08);
    } else {
      w.moveIndex++;
      if (w.moveIndex >= w.moves.length) {
        if (w.round < w.totalRounds) {
          w.round++; w.moveIndex = 0; w.phase = 'work'; w.timeLeft = 40; beep(660,.2,.15);
        } else { finishProtocol(); return; }
      } else { w.phase = 'work'; w.timeLeft = 40; }
    }
  } else if (w.timeLeft <= 3 && w.phase === 'work') { beep(880,.08,.05); }
  updateProtocolPlayerUI();
}

function finishProtocol() {
  clearInterval(protocolWorkout.interval);
  document.getElementById('protocol-player').classList.add('hidden');
  const streak = incrementStreak();
  const msg = IDENTITY_MESSAGES[Math.floor(Math.random() * IDENTITY_MESSAGES.length)];
  safeText(document.getElementById('post-streak'), 'Day ' + streak + ' streak 🔥');
  safeText(document.getElementById('post-message'), msg);
  document.getElementById('post-action').classList.remove('hidden');
}

document.getElementById('pp-btn-pause').addEventListener('click', () => {
  protocolWorkout.paused = !protocolWorkout.paused;
  safeText(document.getElementById('pp-btn-pause'), protocolWorkout.paused ? 'Resume' : 'Pause');
});
document.getElementById('pp-btn-end').addEventListener('click', () => {
  clearInterval(protocolWorkout.interval);
  document.getElementById('protocol-player').classList.add('hidden');
  document.body.style.overflow = '';
});
document.getElementById('post-done-btn').addEventListener('click', () => {
  document.getElementById('post-action').classList.add('hidden');
  document.body.style.overflow = '';
  switchTab('today');
});
const contactLink = document.getElementById('contact-link');
if (contactLink) {
  contactLink.addEventListener('click', e => {
    e.stopPropagation();
    window.location.href = 'mailto:hello@vivasculptstudioapp.com';
  });
}

/* ─────────────── INIT ─────────────── */
function init() {
  updateTrialBanner();
  updatePlanBadge();
  checkPaywall();
  setInterval(() => { updateTrialBanner(); checkPaywall(); }, 60000);
}
init();