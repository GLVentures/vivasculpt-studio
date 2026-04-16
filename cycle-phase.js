// ============================================================
// VivaSculpt — Cycle-Phase Workout Engine  v4
// Storage key and phase logic mirror calendar.js exactly.
//
// Add to index.html AFTER calendar.js and app.js:
//   <script src="cycle-phase.js"></script>
//
// Plan logic (mirrors app.js):
//   localStorage 'vs_plan' === 'pro'     → Pro
//   localStorage 'vs_plan' === 'starter' → Starter
//   localStorage 'vs_plan' === null      → Free
//
// Workout access:
//   free    → phase info + tip only; workout locked with paywall
//   starter → workouts[0] per phase (foundational)
//   pro     → all 3 workouts, rotating by week in phase
// ============================================================

(function () {
  'use strict';

  // ── Storage keys — must match calendar.js and app.js exactly ─
  var CAL_KEY  = 'vs_cycle_days';   // ← calendar.js uses this
  var PLAN_KEY = 'vs_plan';         // ← app.js uses this

  // ── Phase lengths — must match calendar.js PHASE_LENS exactly ─
  var PHASE_LENS = { menstrual: 5, follicular: 9, ovulation: 2, luteal: 12 };
  var DEF_CYCLE  = 28;

  // ── Plan helpers — mirror app.js exactly ────────────────────
  function getPlan() { return localStorage.getItem(PLAN_KEY); } // 'starter'|'pro'|null
  function isPaid()  { var p = getPlan(); return p === 'starter' || p === 'pro'; }
  function isPro()   { return getPlan() === 'pro'; }

  // ── Cycle helpers — copied from calendar.js ──────────────────
  function todayMs() {
    var d = new Date();
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function keyMs(key) {
    var p = key.split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }
  function diffDays(msA, msB) { return Math.round((msB - msA) / 86400000); }
  function addDays(ms, n)     { return ms + n * 86400000; }

  function loadDays() {
    try {
      var r = localStorage.getItem(CAL_KEY);
      return r ? JSON.parse(r) : [];
    } catch (e) { return []; }
  }

  // Mirrors calendar.js detectStarts exactly
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

  // Mirrors calendar.js avgLen exactly
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

  // Mirrors calendar.js phaseFor exactly
  function phaseFor(targetMs, starts, cycleLen) {
    if (!starts.length) return null;
    var last = null;
    for (var i = 0; i < starts.length; i++) {
      if (starts[i] <= targetMs) last = starts[i];
    }
    if (last === null) return null;
    while (addDays(last, cycleLen) <= targetMs) last = addDays(last, cycleLen);
    var day = diffDays(last, targetMs) + 1;
    if (day < 1) return null;
    var m  = PHASE_LENS.menstrual;
    var f  = m + PHASE_LENS.follicular;
    var o  = f + PHASE_LENS.ovulation;
    var ll = o + PHASE_LENS.luteal;
    if (day <= m)  return { name: 'menstrual',  cycleDay: day, dayInPhase: day };
    if (day <= f)  return { name: 'follicular', cycleDay: day, dayInPhase: day - m };
    if (day <= o)  return { name: 'ovulation',  cycleDay: day, dayInPhase: day - f };
    if (day <= ll) return { name: 'luteal',     cycleDay: day, dayInPhase: day - o };
    return { name: 'menstrual', cycleDay: day, dayInPhase: 1 };
  }

  // Get current phase result {name, cycleDay, dayInPhase} or null
  function getCurrentPhaseResult() {
    var marked = loadDays();
    if (!marked.length) return null;
    var starts   = detectStarts(marked);
    var cycleLen = avgLen(starts);
    return phaseFor(todayMs(), starts, cycleLen);
  }

  // ── Workout picker ───────────────────────────────────────────
  function pickWorkout(phaseData, cycleDay) {
    if (!isPaid()) return null;
    if (!isPro())  return phaseData.workouts[0];
    var weekNum = Math.floor((cycleDay - 1) / 7);
    return phaseData.workouts[weekNum % phaseData.workouts.length];
  }

  // ── Phase workout data ───────────────────────────────────────
  // workouts[0] = Starter (all paid users)
  // workouts[1,2] = Pro only

  var PHASE_DATA = {
    menstrual: {
      emoji: '🩸', color: '#e11d48', bg: '#fff1f2', border: '#fda4af',
      energy: 'Low energy · be gentle',
      tagline: 'Rest is productive. Your body is working hard.',
      tip: 'Honour the bleed. Light movement reduces cramps and boosts mood — but never push through pain.',
      workouts: [
        {
          tier: 'starter',
          title: 'Restorative Yoga Flow', duration: '15 min', intensity: 'Very Low', tag: 'Flexibility', rounds: '1 flow',
          moves: [
            { name: "Child's Pose",     work: 60,  rest: 0,  mod: 'Hips wide, arms forward' },
            { name: 'Supine Twist (R)', work: 45,  rest: 10, mod: 'Both shoulders stay grounded' },
            { name: 'Supine Twist (L)', work: 45,  rest: 10, mod: 'Breathe into the stretch' },
            { name: 'Happy Baby',       work: 60,  rest: 0,  mod: 'Rock gently side to side' },
            { name: 'Legs Up The Wall', work: 120, rest: 0,  mod: 'Relieves pelvic tension' },
            { name: 'Savasana',         work: 120, rest: 0,  mod: 'Full body release' },
          ],
          why: 'Gentle inversions and hip openers reduce prostaglandins — the compounds that cause cramps.',
        },
        {
          tier: 'pro',
          title: 'Slow Walk + Breathwork', duration: '20 min', intensity: 'Very Low', tag: 'Cardio · Recovery', rounds: '1 session',
          moves: [
            { name: '4-7-8 Breathing',      work: 60,  rest: 0,  mod: 'Inhale 4s, hold 7s, exhale 8s' },
            { name: 'Slow March (in place)', work: 120, rest: 30, mod: 'Swing arms naturally' },
            { name: 'Neck Rolls',            work: 45,  rest: 0,  mod: 'Ear to shoulder, slow circles' },
            { name: 'Shoulder Circles',      work: 45,  rest: 0,  mod: 'Forward then back' },
            { name: 'Standing Hip Sway',     work: 60,  rest: 0,  mod: 'Hands on hips, slow sways' },
            { name: 'Box Breathing',         work: 60,  rest: 0,  mod: 'In 4, hold 4, out 4, hold 4' },
          ],
          why: 'Light walking increases blood flow and reduces bloating without taxing your body.',
        },
        {
          tier: 'pro',
          title: 'Yin Yoga for Cramp Relief', duration: '18 min', intensity: 'Very Low', tag: 'Flexibility · Pain relief', rounds: '1 flow',
          moves: [
            { name: 'Butterfly Pose',        work: 90,  rest: 0,  mod: 'Let knees fall heavy' },
            { name: 'Dragon Pose (R)',        work: 75,  rest: 10, mod: 'Low lunge, sink the hips' },
            { name: 'Dragon Pose (L)',        work: 75,  rest: 10, mod: 'Keep back knee soft' },
            { name: 'Sphinx Pose',           work: 90,  rest: 0,  mod: 'Forearms on floor, gentle backbend' },
            { name: 'Reclining Bound Angle', work: 120, rest: 0,  mod: 'Soles together, pillow under knees' },
            { name: 'Corpse Pose',           work: 90,  rest: 0,  mod: 'Completely surrender' },
          ],
          why: 'Yin targets the fascia around the pelvis, easing menstrual tension deeper than active yoga.',
        },
      ],
      meals: {
        focus: 'Iron · Anti-inflammatory · Magnesium',
        note: 'Replace iron lost during bleeding. Cut inflammatory foods (sugar, alcohol, processed grains).',
        ideas: ['Dark leafy greens + lean red meat', 'Pumpkin seeds & dark chocolate', 'Ginger + turmeric tea', 'Salmon with sweet potato'],
      },
    },

    follicular: {
      emoji: '🌸', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
      energy: 'Rising energy · build strength',
      tagline: "Estrogen is rising. You're getting stronger every day.",
      tip: 'This is your best window for learning new movements and adding weight. Your body recovers faster now.',
      workouts: [
        {
          tier: 'starter',
          title: 'Strength Builder — Lower Body', duration: '25 min', intensity: 'Moderate–High', tag: 'Strength', rounds: '3 rounds',
          moves: [
            { name: 'Goblet Squat',      work: 40, rest: 20, mod: 'Use a water bottle as weight' },
            { name: 'Romanian Deadlift', work: 40, rest: 20, mod: 'Hinge at hips, soft knees' },
            { name: 'Reverse Lunges',    work: 40, rest: 20, mod: 'Step back, knee hovers floor' },
            { name: 'Glute Bridge',      work: 40, rest: 20, mod: 'Squeeze top, hold 2 sec' },
            { name: 'Sumo Squat Pulse',  work: 30, rest: 30, mod: 'Toes out 45°, tiny pulses' },
          ],
          why: 'Rising estrogen increases muscle protein synthesis — ideal for building lower body strength.',
        },
        {
          tier: 'pro',
          title: 'Strength Builder — Upper Body', duration: '22 min', intensity: 'Moderate', tag: 'Strength', rounds: '3 rounds',
          moves: [
            { name: 'Push-Up (any level)', work: 40, rest: 20, mod: 'Knees OK — focus on chest squeeze' },
            { name: 'Tricep Dips (chair)', work: 35, rest: 25, mod: 'Elbows track back, not out' },
            { name: 'Pike Shoulder Press', work: 35, rest: 25, mod: 'Hips high, press floor away' },
            { name: 'Plank Hold',          work: 30, rest: 30, mod: 'Core braced, hips level' },
            { name: 'Superman Hold',       work: 30, rest: 20, mod: 'Lift arms + legs together' },
          ],
          why: 'Higher estrogen means better tendon stability — safe to push upper body limits.',
        },
        {
          tier: 'pro',
          title: 'Power Circuit — Full Body', duration: '28 min', intensity: 'High', tag: 'Strength · Cardio', rounds: '3 rounds',
          moves: [
            { name: 'Jump Squat',        work: 40, rest: 20, mod: 'Land soft, absorb through hips' },
            { name: 'Push-Up to T',      work: 35, rest: 25, mod: 'Rotate at top, arm to ceiling' },
            { name: 'Lateral Lunge',     work: 40, rest: 20, mod: 'Sit into the bend, other leg straight' },
            { name: 'Renegade Row',      work: 35, rest: 25, mod: 'Plank position, row to hip' },
            { name: 'Mountain Climbers', work: 30, rest: 30, mod: 'Drive knees, keep hips down' },
          ],
          why: 'Peak estrogen = peak power output. This is your window to crush full-body circuits.',
        },
      ],
      meals: {
        focus: 'Protein · Fibre · Phytoestrogens',
        note: 'Support muscle building and hormone balance. Load up on whole foods.',
        ideas: ['Edamame + quinoa bowl', 'Lentil soup with crusty bread', 'Greek yogurt + flaxseed + berries', 'Tempeh stir-fry'],
      },
    },

    ovulation: {
      emoji: '⚡', color: '#d97706', bg: '#fffbeb', border: '#fcd34d',
      energy: 'Peak energy · maximum power',
      tagline: "You are at your strongest. Don't hold back.",
      tip: 'Testosterone peaks at ovulation alongside estrogen. Your strength, speed, and pain tolerance are at their highest.',
      workouts: [
        {
          tier: 'starter',
          title: 'Peak HIIT — Metabolic Blast', duration: '20 min', intensity: 'Very High', tag: 'HIIT · Cardio', rounds: '4 rounds',
          moves: [
            { name: 'Burpee',       work: 40, rest: 15, mod: 'Add jump at top for max intensity' },
            { name: 'High Knees',   work: 35, rest: 15, mod: 'Drive arms, pump knees to chest' },
            { name: 'Jump Squat',   work: 35, rest: 15, mod: 'Arms swing up, land silent' },
            { name: 'Speed Skater', work: 35, rest: 20, mod: 'Leap side to side, touch floor' },
            { name: 'Plank Jack',   work: 30, rest: 20, mod: 'Jump feet wide and back' },
          ],
          why: "Testosterone + estrogen peak = highest pain threshold and fastest recovery. Go hard.",
        },
        {
          tier: 'pro',
          title: 'Heavy Lift + Sprint Intervals', duration: '30 min', intensity: 'Very High', tag: 'Strength · HIIT', rounds: '3 rounds',
          moves: [
            { name: 'Squat Jump (explosive)',  work: 45, rest: 15, mod: 'Explode up, full extension' },
            { name: 'Push-Up to Clap',         work: 30, rest: 20, mod: 'Explosive push, catch soft' },
            { name: 'Sprint in Place',         work: 30, rest: 15, mod: 'Max effort, 100%' },
            { name: 'Box Jump (or step-up)',   work: 35, rest: 20, mod: 'Land with both feet together' },
            { name: 'Tuck Jump',               work: 30, rest: 20, mod: 'Pull knees to chest at peak' },
            { name: 'Plank to Downdog Sprint', work: 35, rest: 20, mod: 'Alternate fast' },
          ],
          why: 'Compound explosive movements at peak hormones = maximum strength and calorie burn.',
        },
        {
          tier: 'pro',
          title: 'Dance Cardio Flow', duration: '25 min', intensity: 'High', tag: 'Cardio · Fun', rounds: '1 continuous',
          moves: [
            { name: 'Side Step + Clap', work: 60, rest: 0,  mod: 'Wide steps, big arm swing' },
            { name: 'Grapevine',        work: 60, rest: 0,  mod: 'Side cross-step pattern' },
            { name: 'Cha-Cha Step',     work: 60, rest: 10, mod: 'Quick-quick-slow rhythm' },
            { name: 'Pivot Turns',      work: 45, rest: 10, mod: 'Quarter turns, arms wide' },
            { name: 'Jumping Jacks',    work: 45, rest: 10, mod: 'Full extension each rep' },
            { name: 'Hip Circle Sway',  work: 60, rest: 0,  mod: 'Hands above head, big circles' },
          ],
          why: 'Joyful movement boosts the natural oxytocin spike at ovulation.',
        },
      ],
      meals: {
        focus: 'Antioxidants · Fibre · Light protein',
        note: 'Support the surge. Keep digestion light — heavy meals blunt your energy peak.',
        ideas: ['Açaí bowl with granola + seeds', 'Grilled chicken + roasted veg', 'Smoothie: banana, spinach, protein', 'Sushi bowl with edamame'],
      },
    },

    luteal: {
      emoji: '🍂', color: '#0f766e', bg: '#f0fdfa', border: '#99f6e4',
      energy: 'Winding down · steady & strong',
      tagline: 'Progesterone rises. Steady beats explosive now.',
      tip: 'Cravings are real and valid this phase. Honour them with nourishing whole foods. Your body genuinely needs more calories in the luteal phase.',
      workouts: [
        {
          tier: 'starter',
          title: 'Pilates Core & Sculpt', duration: '22 min', intensity: 'Low–Moderate', tag: 'Pilates · Core', rounds: '2 rounds',
          moves: [
            { name: 'Dead Bug',                work: 40, rest: 20, mod: 'Exhale on extension, lower back pressed' },
            { name: 'Single Leg Stretch',      work: 35, rest: 20, mod: 'Chin to chest, shoulders off' },
            { name: 'Roll-Up',                 work: 30, rest: 20, mod: 'Peel spine off floor vertebra by vertebra' },
            { name: 'Side-Lying Leg Lift (R)', work: 35, rest: 15, mod: 'Stack hips, point toes' },
            { name: 'Side-Lying Leg Lift (L)', work: 35, rest: 15, mod: 'Same — lead with heel' },
            { name: 'Plank Reach',             work: 30, rest: 20, mod: 'Alternate arm reach, hips stable' },
          ],
          why: 'Progesterone raises body temperature — controlled pilates maintains strength without spiking cortisol.',
        },
        {
          tier: 'pro',
          title: 'Barre Sculpt — Lower Focus', duration: '25 min', intensity: 'Moderate', tag: 'Barre · Toning', rounds: '2 rounds',
          moves: [
            { name: 'Parallel Pliés',        work: 45, rest: 15, mod: 'Heels together, toes apart, pulse' },
            { name: 'Turnout Pliés',          work: 45, rest: 15, mod: 'Wide stance, controlled pulse' },
            { name: 'Standing Arabesque (R)', work: 35, rest: 15, mod: 'Back leg lifts, core tight' },
            { name: 'Standing Arabesque (L)', work: 35, rest: 15, mod: 'Keep square hips' },
            { name: 'Curtsy Lunge',           work: 40, rest: 20, mod: 'Cross behind, squeeze glute' },
            { name: 'Calf Raises',            work: 30, rest: 20, mod: 'Slow up, slower down' },
          ],
          why: "Barre's isometric holds match luteal phase energy — sustained muscle work without cardio spikes.",
        },
        {
          tier: 'pro',
          title: 'Stretch & Mobility Reset', duration: '18 min', intensity: 'Very Low', tag: 'Flexibility · Recovery', rounds: '1 flow',
          moves: [
            { name: "World's Greatest Stretch (R)", work: 60, rest: 0, mod: 'Lunge + twist + arm reach' },
            { name: "World's Greatest Stretch (L)", work: 60, rest: 0, mod: 'Breathe into every position' },
            { name: '90/90 Hip Stretch',            work: 90, rest: 0, mod: 'Both legs at 90° angle' },
            { name: 'Pigeon Pose (R)',               work: 75, rest: 0, mod: 'Fold forward for depth' },
            { name: 'Pigeon Pose (L)',               work: 75, rest: 0, mod: 'Equal time each side' },
            { name: 'Seated Forward Fold',           work: 60, rest: 0, mod: 'Flex feet, hinge from hips' },
          ],
          why: 'Progesterone relaxes ligaments — perfect timing to make real flexibility gains.',
        },
      ],
      meals: {
        focus: 'Magnesium · Complex carbs · B6',
        note: 'Calm PMS naturally. Complex carbs stabilise serotonin. Magnesium reduces bloating and mood swings.',
        ideas: ['Brown rice + roasted chickpeas', 'Banana + almond butter', 'Pumpkin soup with seeds', 'Dark chocolate + walnuts'],
      },
    },
  };

  // ── UI builders ──────────────────────────────────────────────

  function workoutSectionHTML(phaseData, phaseName, cycleDay) {
    var workout  = pickWorkout(phaseData, cycleDay);
    var proOnly  = phaseData.workouts.filter(function(w) { return w.tier === 'pro'; });
    var color    = phaseData.color;
    var border   = phaseData.border;
    var bg       = phaseData.bg;

    // FREE
    if (!isPaid()) {
      return '<div style="border-top:1px solid ' + border + ';padding:.85rem 0">' +
        '<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + color + ';margin-bottom:.55rem">🏋️ Phase Workout</div>' +
        '<div style="background:rgba(0,0,0,.03);border:1.5px dashed ' + border + ';border-radius:12px;padding:1.1rem;text-align:center">' +
          '<div style="font-size:1.5rem;margin-bottom:.4rem">🔒</div>' +
          '<div style="font-weight:700;font-size:.9rem;color:#1e293b;margin-bottom:.3rem">Cycle-synced workouts</div>' +
          '<div style="font-size:.75rem;color:#64748b;margin-bottom:.85rem;line-height:1.45">Get workouts matched to your exact phase — gentle yoga during your period, strength in follicular, HIIT at ovulation, pilates in luteal.</div>' +
          '<button onclick="if(typeof switchTab===\'function\')switchTab(\'pricing\')" style="background:' + color + ';color:#fff;border:none;border-radius:10px;padding:.6rem 1.2rem;font-size:.8rem;font-weight:700;cursor:pointer;font-family:inherit;width:100%">Unlock Phase Workouts →</button>' +
          '<div style="font-size:.65rem;color:#94a3b8;margin-top:.5rem">Starter $14/mo · Pro $29/mo · 7-day free trial</div>' +
        '</div></div>';
    }

    // STARTER
    if (!isPro()) {
      var proRows = proOnly.map(function(w) {
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.3rem 0;border-bottom:1px solid #f1f5f9">' +
          '<span style="font-size:.78rem;font-weight:500;color:#94a3b8">' + w.title + '</span>' +
          '<span style="font-size:.68rem;color:#94a3b8">' + w.duration + ' 🔒</span></div>';
      }).join('');

      return '<div style="border-top:1px solid ' + border + ';padding:.85rem 0">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.55rem">' +
          '<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + color + '">🏋️ Recommended Workout</div>' +
          '<span style="font-size:.6rem;background:#f1f5f9;color:#64748b;padding:.2rem .5rem;border-radius:99px;font-weight:600">STARTER</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.5rem">' +
          '<div><div style="font-weight:800;font-size:.95rem;color:#1e293b;margin-bottom:.2rem">' + workout.title + '</div>' +
          '<div style="font-size:.75rem;color:#64748b">' + workout.duration + ' · ' + workout.tag + ' · ' + workout.rounds + '</div></div>' +
          '<button id="btn-phase-workout" style="background:' + color + ';color:#fff;border:none;border-radius:10px;padding:.5rem .9rem;font-size:.78rem;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0">Start →</button>' +
        '</div>' +
        '<div style="font-size:.72rem;color:#64748b;font-style:italic;background:rgba(255,255,255,.6);padding:.5rem .7rem;border-radius:8px;line-height:1.45;margin-bottom:.6rem">' +
          '<strong style="color:' + color + ';font-style:normal">Why this?</strong> ' + workout.why + '</div>' +
        (proOnly.length ? '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:.7rem .85rem">' +
          '<div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#94a3b8;margin-bottom:.4rem">🔒 ' + proOnly.length + ' more Pro workouts this phase</div>' +
          proRows +
          '<button onclick="if(typeof switchTab===\'function\')switchTab(\'pricing\')" style="margin-top:.55rem;width:100%;background:none;border:1px solid #e2e8f0;border-radius:8px;padding:.45rem;font-size:.72rem;color:#64748b;cursor:pointer;font-family:inherit;font-weight:600">Upgrade to Pro — $29/mo →</button>' +
        '</div>' : '') +
      '</div>';
    }

    // PRO
    var allRows = phaseData.workouts.map(function(w, i) {
      var active = (w.title === workout.title);
      return '<div class="pro-workout-row" data-workout-idx="' + i + '" style="display:flex;align-items:center;gap:.6rem;padding:.4rem .6rem;border-radius:8px;background:' + (active ? bg : 'transparent') + ';border:1px solid ' + (active ? border : 'transparent') + ';margin-bottom:.2rem;cursor:pointer">' +
        '<div style="width:6px;height:6px;border-radius:50%;flex-shrink:0;background:' + (active ? color : '#cbd5e1') + '"></div>' +
        '<div style="flex:1;min-width:0"><span style="font-size:.78rem;font-weight:' + (active ? '700' : '500') + ';color:' + (active ? '#1e293b' : '#64748b') + '">' + w.title + '</span>' +
        '<span style="font-size:.65rem;color:#94a3b8;margin-left:.35rem">' + w.duration + ' · ' + w.intensity + '</span></div>' +
        (active ? '<span style="font-size:.6rem;background:' + color + ';color:#fff;padding:.15rem .45rem;border-radius:99px;font-weight:700;flex-shrink:0">This week</span>' :
          '<span style="font-size:.65rem;color:#94a3b8;flex-shrink:0">' + (w.tier === 'starter' ? 'Starter' : 'Pro') + '</span>') +
      '</div>';
    }).join('');

    return '<div style="border-top:1px solid ' + border + ';padding:.85rem 0">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.55rem">' +
        '<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + color + '">🏋️ Phase Workouts</div>' +
        '<span style="font-size:.6rem;background:' + color + ';color:#fff;padding:.2rem .5rem;border-radius:99px;font-weight:700">PRO · ' + phaseData.workouts.length + ' workouts</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.5rem">' +
        '<div><div style="font-weight:800;font-size:.95rem;color:#1e293b;margin-bottom:.2rem">' + workout.title + '</div>' +
        '<div style="font-size:.75rem;color:#64748b">' + workout.duration + ' · ' + workout.tag + ' · ' + workout.rounds + '</div></div>' +
        '<button id="btn-phase-workout" style="background:' + color + ';color:#fff;border:none;border-radius:10px;padding:.5rem .9rem;font-size:.78rem;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0">Start →</button>' +
      '</div>' +
      '<div style="font-size:.72rem;color:#64748b;font-style:italic;background:rgba(255,255,255,.6);padding:.5rem .7rem;border-radius:8px;line-height:1.45;margin-bottom:.65rem">' +
        '<strong style="color:' + color + ';font-style:normal">Why this?</strong> ' + workout.why + '</div>' +
      '<div><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#94a3b8;margin-bottom:.4rem">All phase workouts (tap any to start)</div>' +
      allRows + '</div>' +
    '</div>';
  }

  // ── Main banner render ───────────────────────────────────────
  function renderCyclePhaseBanner() {
    var banner = document.getElementById('current-phase-banner');
    if (!banner) return;

    var result = getCurrentPhaseResult();

    if (!result) {
      // Let calendar.js handle the no-data state — don't override it
      return;
    }

    var phaseName = result.name;
    var cycleDay  = result.cycleDay;
    var dayInPhase = result.dayInPhase;
    var phaseData = PHASE_DATA[phaseName];
    if (!phaseData) return;

    var planLabel = isPro() ? '⭐ Pro' : (isPaid() ? 'Starter' : 'Free');

    var hormonemap = Object.keys(PHASE_DATA).map(function(key) {
      var p = PHASE_DATA[key];
      var phaseDays = {
        menstrual:  '1–5',
        follicular: '6–13',
        ovulation:  '14–15',
        luteal:     '16–28'
      };
      var active = (key === phaseName);
      return '<div style="flex:1;background:' + p.bg + ';border:1px solid ' + p.border + ';border-radius:8px;padding:.4rem .35rem;text-align:center;' + (active ? 'outline:2px solid ' + p.color + ';' : '') + '">' +
        '<div style="font-size:1rem">' + p.emoji + '</div>' +
        '<div style="font-size:.6rem;font-weight:700;color:' + p.color + ';margin-top:.15rem">' + key.charAt(0).toUpperCase() + key.slice(1) + '</div>' +
        '<div style="font-size:.55rem;color:#94a3b8">Days ' + phaseDays[key] + '</div>' +
      '</div>';
    }).join('');

    var mealIdeas = phaseData.meals.ideas.map(function(idea) {
      return '<span style="background:rgba(255,255,255,.8);border:1px solid ' + phaseData.border + ';border-radius:6px;padding:.22rem .55rem;font-size:.68rem;color:#334155">' + idea + '</span>';
    }).join('');

    // Override the calendar.js banner entirely with the richer version
    banner.className = 'current-phase-banner';
    banner.style.cssText = 'background:' + phaseData.bg + ';border:1.5px solid ' + phaseData.border + ';border-radius:16px;padding:1.1rem 1.1rem 0;margin-bottom:1rem;';

    banner.innerHTML =
      '<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">' +
        '<div style="font-size:2rem;line-height:1;flex-shrink:0">' + phaseData.emoji + '</div>' +
        '<div style="flex:1">' +
          '<div style="font-weight:800;font-size:1.1rem;color:' + phaseData.color + '">' + phaseName.charAt(0).toUpperCase() + phaseName.slice(1) + ' Phase</div>' +
          '<div style="font-size:.78rem;color:#64748b;margin-top:.1rem">Day ' + dayInPhase + ' of phase · ' + phaseData.energy + '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-size:.7rem;font-weight:700;background:' + phaseData.color + ';color:#fff;padding:.3rem .6rem;border-radius:99px">Cycle Day ' + cycleDay + '</div>' +
          '<div style="font-size:.6rem;color:#94a3b8;margin-top:.25rem;text-transform:uppercase;font-weight:600">' + planLabel + '</div>' +
        '</div>' +
      '</div>' +

      '<p style="font-size:.82rem;color:#475569;font-style:italic;margin-bottom:.75rem;line-height:1.5">"' + phaseData.tagline + '"</p>' +

      '<div style="background:rgba(255,255,255,.7);border-radius:10px;padding:.85rem;margin-bottom:.85rem">' +
        '<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + phaseData.color + ';margin-bottom:.4rem">💡 Phase Tip</div>' +
        '<p style="font-size:.78rem;color:#334155;line-height:1.5;margin:0">' + phaseData.tip + '</p>' +
      '</div>' +

      workoutSectionHTML(phaseData, phaseName, cycleDay) +

      '<div style="border-top:1px solid ' + phaseData.border + ';padding:.85rem 0 .1rem">' +
        '<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + phaseData.color + ';margin-bottom:.45rem">🥗 Nutrition Focus</div>' +
        '<div style="font-size:.75rem;font-weight:700;color:#334155;margin-bottom:.25rem">' + phaseData.meals.focus + '</div>' +
        '<p style="font-size:.73rem;color:#64748b;margin:0 0 .45rem;line-height:1.45">' + phaseData.meals.note + '</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:.35rem">' + mealIdeas + '</div>' +
      '</div>' +

      '<div style="margin:0 -1.1rem;padding:.85rem 1.1rem;border-top:1px solid ' + phaseData.border + ';margin-top:.85rem">' +
        '<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:.5rem">Your 28-Day Hormone Map</div>' +
        '<div style="display:flex;gap:.35rem">' + hormonemap + '</div>' +
      '</div>';

    // Wire up buttons after render
    setTimeout(function() {
      var startBtn = document.getElementById('btn-phase-workout');
      if (startBtn) {
        var workout = pickWorkout(phaseData, cycleDay);
        if (workout) {
          startBtn.addEventListener('click', function() { launchPhaseWorkout(workout, phaseData); });
        }
      }
      if (isPro()) {
        banner.querySelectorAll('.pro-workout-row').forEach(function(row) {
          row.addEventListener('click', function() {
            var idx = parseInt(row.getAttribute('data-workout-idx'), 10);
            launchPhaseWorkout(phaseData.workouts[idx], phaseData);
          });
        });
      }
    }, 0);
  }

  // ── Today tab phase tip ──────────────────────────────────────
  function injectTodayPhaseTip() {
    var result = getCurrentPhaseResult();
    if (!result) return;

    var phaseName  = result.name;
    var dayInPhase = result.dayInPhase;
    var phaseData  = PHASE_DATA[phaseName];
    if (!phaseData) return;

    var existing = document.getElementById('today-phase-tip');
    if (existing) existing.remove();

    var tip = document.createElement('div');
    tip.id = 'today-phase-tip';
    tip.style.cssText = 'background:' + phaseData.bg + ';border:1.5px solid ' + phaseData.border + ';border-radius:14px;padding:.85rem 1rem;margin-bottom:.85rem;display:flex;gap:.65rem;align-items:flex-start;';
    tip.innerHTML =
      '<div style="font-size:1.5rem;line-height:1;flex-shrink:0">' + phaseData.emoji + '</div>' +
      '<div style="flex:1">' +
        '<div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.2rem;flex-wrap:wrap">' +
          '<span style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:' + phaseData.color + '">' +
            phaseName.charAt(0).toUpperCase() + phaseName.slice(1) + ' Phase · Day ' + dayInPhase + ' of phase' +
          '</span>' +
          (isPro() ? '<span style="font-size:.55rem;background:' + phaseData.color + ';color:#fff;padding:.1rem .4rem;border-radius:99px;font-weight:700">PRO</span>' : '') +
        '</div>' +
        '<div style="font-size:.78rem;color:#334155;line-height:1.45">' + phaseData.tip + '</div>' +
        '<button onclick="if(typeof switchTab===\'function\')switchTab(\'cycle\')" style="margin-top:.5rem;background:none;border:none;color:' + phaseData.color + ';font-size:.72rem;font-weight:700;cursor:pointer;font-family:inherit;padding:0">' +
          (isPaid() ? 'View phase workout →' : 'Learn about your phase →') +
        '</button>' +
      '</div>';

    var anchor = document.getElementById('streak-bar') || document.getElementById('mission-card');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(tip, anchor.nextSibling);
  }

  // ── Workout launcher ─────────────────────────────────────────
  function launchPhaseWorkout(workout, phaseData) {
    // Hook into app.js's existing workout player if available
    if (typeof startWorkoutSession === 'function') {
      startWorkoutSession(workout.moves, parseInt(workout.rounds) || 1, 0);
      return;
    }
    showMinimalPlayer(workout, phaseData);
  }

  // ── Minimal fallback player ──────────────────────────────────
  function showMinimalPlayer(workout, phaseData) {
    var existing = document.getElementById('phase-player-overlay');
    if (existing) existing.remove();

    var mi = 0, round = 1;
    var totalRounds = parseInt(workout.rounds) || 1;
    var timeLeft = workout.moves[0].work;
    var isRest = false, paused = false, timer = null;

    var overlay = document.createElement('div');
    overlay.id = 'phase-player-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0f172a;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:inherit;padding:1.5rem;';

    function m()   { return workout.moves[Math.min(mi, workout.moves.length - 1)]; }
    function dur() { return isRest ? (m().rest || 15) : m().work; }

    function render() {
      var mv = m(), pct = timeLeft / dur();
      var next = workout.moves[mi + 1] || (round < totalRounds ? workout.moves[0] : null);
      var circ = 2 * Math.PI * 54;
      overlay.innerHTML =
        '<button id="pp-close" style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;font-family:inherit">✕</button>' +
        '<div style="position:absolute;top:1rem;left:1rem;font-size:.7rem;font-weight:700;background:' + phaseData.color + ';color:#fff;padding:.3rem .7rem;border-radius:99px">' + phaseData.emoji + ' ' + workout.title + '</div>' +
        '<div style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:' + (isRest ? '#94a3b8' : phaseData.color) + ';margin-bottom:1rem">' + (isRest ? 'REST' : 'WORK') + '</div>' +
        '<div style="position:relative;width:160px;height:160px;margin-bottom:1.25rem">' +
          '<svg style="position:absolute;inset:0;transform:rotate(-90deg)" viewBox="0 0 120 120">' +
            '<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>' +
            '<circle id="pp-ring" cx="60" cy="60" r="54" fill="none" stroke="' + (isRest ? '#475569' : phaseData.color) + '" stroke-width="8" stroke-dasharray="' + circ + '" stroke-dashoffset="' + (circ * (1 - pct)) + '" stroke-linecap="round" style="transition:stroke-dashoffset .9s linear"/>' +
          '</svg>' +
          '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
            '<div id="pp-time" style="font-size:3rem;font-weight:800;line-height:1">' + timeLeft + '</div>' +
            '<div style="font-size:.65rem;color:#94a3b8;margin-top:.15rem">Round ' + round + '/' + totalRounds + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:1.4rem;font-weight:800;text-align:center;margin-bottom:.35rem">' + mv.name + '</div>' +
        '<div style="font-size:.8rem;color:#94a3b8;text-align:center;margin-bottom:1.5rem;max-width:280px">' + (mv.mod || '') + '</div>' +
        (next ? '<div style="font-size:.72rem;color:#64748b;margin-bottom:1.5rem">Next: ' + (isRest ? mv.name : next.name) + '</div>' : '<div style="font-size:.72rem;color:#10b981;margin-bottom:1.5rem;font-weight:700">Last exercise!</div>') +
        '<div style="display:flex;gap:.75rem">' +
          '<button id="pp-skip" style="background:rgba(255,255,255,.08);border:none;color:#fff;padding:.7rem 1.4rem;border-radius:10px;cursor:pointer;font-size:.85rem;font-family:inherit">Skip →</button>' +
          '<button id="pp-pause" style="background:' + phaseData.color + ';border:none;color:#fff;padding:.7rem 1.6rem;border-radius:10px;cursor:pointer;font-size:.85rem;font-weight:700;font-family:inherit">' + (paused ? '▶ Resume' : '⏸ Pause') + '</button>' +
        '</div>';

      overlay.querySelector('#pp-close').onclick  = function() { clearInterval(timer); overlay.remove(); };
      overlay.querySelector('#pp-skip').onclick   = advance;
      overlay.querySelector('#pp-pause').onclick  = function() { paused = !paused; render(); };
    }

    function advance() {
      clearInterval(timer);
      var mv = m();
      if (!isRest && (mv.rest || 0) > 0) { isRest = true; timeLeft = mv.rest; }
      else {
        isRest = false; mi++;
        if (mi >= workout.moves.length) {
          mi = 0; round++;
          if (round > totalRounds) { complete(); return; }
        }
        timeLeft = workout.moves[mi].work;
      }
      startTimer();
    }

    function startTimer() {
      render();
      timer = setInterval(function() {
        if (paused) return;
        timeLeft--;
        if (timeLeft <= 0) { advance(); return; }
        var t = overlay.querySelector('#pp-time');
        if (t) t.textContent = timeLeft;
        var r = overlay.querySelector('#pp-ring');
        if (r) r.setAttribute('stroke-dashoffset', 2 * Math.PI * 54 * (1 - timeLeft / dur()));
      }, 1000);
    }

    function complete() {
      clearInterval(timer);
      overlay.innerHTML =
        '<div style="text-align:center">' +
          '<div style="font-size:4rem;margin-bottom:.75rem">💪</div>' +
          '<h2 style="font-size:1.6rem;font-weight:800;margin-bottom:.5rem">Workout Complete!</h2>' +
          '<p style="color:#94a3b8;font-size:.85rem;margin-bottom:1.75rem">' + phaseData.emoji + ' ' + workout.title + ' done.<br>Rest 5 minutes. Drink water. You showed up.</p>' +
          '<button onclick="document.getElementById(\'phase-player-overlay\').remove()" style="background:' + phaseData.color + ';border:none;color:#fff;padding:1rem 2rem;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit;width:100%;max-width:260px">✓ Done</button>' +
        '</div>';
    }

    document.body.appendChild(overlay);
    startTimer();
  }

  // ── Tab watching ─────────────────────────────────────────────
  function watchTabs() {
    document.querySelectorAll('[data-tab]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.getAttribute('data-tab');
        if (tab === 'cycle') setTimeout(renderCyclePhaseBanner, 80);
        if (tab === 'today') setTimeout(injectTodayPhaseTip, 150);
      });
    });
  }

  // Patch localStorage to re-render when calendar or plan changes
  var _origSet = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key, value) {
    _origSet(key, value);
    if (key === CAL_KEY || key === PLAN_KEY) {
      setTimeout(function() {
        renderCyclePhaseBanner();
        var old = document.getElementById('today-phase-tip');
        if (old) old.remove();
        var paidToday = document.getElementById('paid-today');
        if (paidToday && !paidToday.classList.contains('hidden')) injectTodayPhaseTip();
      }, 150);  // slight delay so calendar.js renders first
    }
  };

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    watchTabs();
    // Delay so calendar.js renderBanner() runs first, then we upgrade it
    setTimeout(renderCyclePhaseBanner, 200);
    var paidToday = document.getElementById('paid-today');
    if (paidToday && !paidToday.classList.contains('hidden')) {
      setTimeout(injectTodayPhaseTip, 400);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();