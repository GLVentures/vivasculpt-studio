// ============================================================
// VivaSculpt — Cycle-Phase Workout Engine
// Drop this file in your project root and add:
// <script src="cycle-phase.js"></script> BEFORE </body>
// (after calendar.js and app.js)
// ============================================================

(function () {
  'use strict';

  // ── Phase definitions ────────────────────────────────────────
  const PHASES = {
    menstrual: {
      name: 'Menstrual',
      emoji: '🩸',
      days: [1, 5],          // cycle days 1–5
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#fda4af',
      energy: 'Low energy · be gentle',
      tagline: 'Rest is productive. Your body is working hard.',
      tip: 'Honour the bleed. Light movement reduces cramps and boosts mood — but never push through pain.',
      workouts: [
        {
          title: 'Restorative Yoga Flow',
          duration: '15 min',
          intensity: 'Very Low',
          tag: 'Flexibility',
          rounds: '1 flow',
          moves: [
            { name: 'Child\'s Pose', work: 60, rest: 0, mod: 'Hips wide, arms forward' },
            { name: 'Supine Twist (R)', work: 45, rest: 10, mod: 'Both shoulders stay grounded' },
            { name: 'Supine Twist (L)', work: 45, rest: 10, mod: 'Breathe into the stretch' },
            { name: 'Happy Baby', work: 60, rest: 0, mod: 'Rock gently side to side' },
            { name: 'Legs Up The Wall', work: 120, rest: 0, mod: 'Relieves pelvic tension' },
            { name: 'Savasana', work: 120, rest: 0, mod: 'Full body release' },
          ],
          why: 'Gentle inversions and hip openers reduce prostaglandins — the compounds that cause cramps.',
        },
        {
          title: 'Slow Walk + Breathwork',
          duration: '20 min',
          intensity: 'Very Low',
          tag: 'Cardio · Recovery',
          rounds: '1 session',
          moves: [
            { name: '4-7-8 Breathing', work: 60, rest: 0, mod: 'Inhale 4s, hold 7s, exhale 8s' },
            { name: 'Slow March (in place)', work: 120, rest: 30, mod: 'Swing arms naturally' },
            { name: 'Neck Rolls', work: 45, rest: 0, mod: 'Ear to shoulder, slow circles' },
            { name: 'Shoulder Circles', work: 45, rest: 0, mod: 'Forward then back' },
            { name: 'Standing Hip Sway', work: 60, rest: 0, mod: 'Hands on hips, slow sways' },
            { name: 'Box Breathing', work: 60, rest: 0, mod: 'In 4, hold 4, out 4, hold 4' },
          ],
          why: 'Light walking increases blood flow and reduces bloating without taxing your body.',
        },
        {
          title: 'Yin Yoga for Cramp Relief',
          duration: '18 min',
          intensity: 'Very Low',
          tag: 'Flexibility · Pain relief',
          rounds: '1 flow',
          moves: [
            { name: 'Butterfly Pose', work: 90, rest: 0, mod: 'Let knees fall heavy' },
            { name: 'Dragon Pose (R)', work: 75, rest: 10, mod: 'Low lunge, sink the hips' },
            { name: 'Dragon Pose (L)', work: 75, rest: 10, mod: 'Keep back knee soft' },
            { name: 'Sphinx Pose', work: 90, rest: 0, mod: 'Forearms on floor, gentle backbend' },
            { name: 'Reclining Bound Angle', work: 120, rest: 0, mod: 'Soles together, pillow under knees' },
            { name: 'Corpse Pose', work: 90, rest: 0, mod: 'Completely surrender' },
          ],
          why: 'Yin targets the fascia and connective tissue around the pelvis, easing menstrual tension.',
        },
      ],
      meals: {
        focus: 'Iron · Anti-inflammatory · Magnesium',
        note: 'Replace iron lost during bleeding. Reduce inflammatory foods (sugar, alcohol, processed grains).',
        ideas: ['Dark leafy greens + lean red meat', 'Pumpkin seeds & dark chocolate', 'Ginger + turmeric tea', 'Salmon with sweet potato'],
      },
    },

    follicular: {
      name: 'Follicular',
      emoji: '🌸',
      days: [6, 13],         // cycle days 6–13
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#c4b5fd',
      energy: 'Rising energy · build strength',
      tagline: 'Estrogen is rising. You\'re getting stronger every day.',
      tip: 'This is your best window for learning new movements and adding weight. Your body recovers faster now.',
      workouts: [
        {
          title: 'Strength Builder — Lower Body',
          duration: '25 min',
          intensity: 'Moderate–High',
          tag: 'Strength',
          rounds: '3 rounds',
          moves: [
            { name: 'Goblet Squat', work: 40, rest: 20, mod: 'Use a water bottle as weight' },
            { name: 'Romanian Deadlift', work: 40, rest: 20, mod: 'Hinge at hips, soft knees' },
            { name: 'Reverse Lunges', work: 40, rest: 20, mod: 'Step back, knee hovers floor' },
            { name: 'Glute Bridge', work: 40, rest: 20, mod: 'Squeeze top, hold 2 sec' },
            { name: 'Sumo Squat Pulse', work: 30, rest: 30, mod: 'Toes out 45°, tiny pulses' },
          ],
          why: 'Rising estrogen increases muscle protein synthesis — ideal for building lower body strength.',
        },
        {
          title: 'Strength Builder — Upper Body',
          duration: '22 min',
          intensity: 'Moderate',
          tag: 'Strength',
          rounds: '3 rounds',
          moves: [
            { name: 'Push-Up (any level)', work: 40, rest: 20, mod: 'Knees OK — focus on chest squeeze' },
            { name: 'Tricep Dips (chair)', work: 35, rest: 25, mod: 'Elbows track back, not out' },
            { name: 'Pike Shoulder Press', work: 35, rest: 25, mod: 'Hips high, press floor away' },
            { name: 'Plank Hold', work: 30, rest: 30, mod: 'Core braced, hips level' },
            { name: 'Superman Hold', work: 30, rest: 20, mod: 'Lift arms + legs together' },
          ],
          why: 'Higher estrogen means better tendon and ligament stability — safe to push upper body limits.',
        },
        {
          title: 'Power Circuit — Full Body',
          duration: '28 min',
          intensity: 'High',
          tag: 'Strength · Cardio',
          rounds: '3 rounds',
          moves: [
            { name: 'Jump Squat', work: 40, rest: 20, mod: 'Land soft, absorb through hips' },
            { name: 'Push-Up to T', work: 35, rest: 25, mod: 'Rotate at top, arm to ceiling' },
            { name: 'Lateral Lunge', work: 40, rest: 20, mod: 'Sit into the bend, other leg straight' },
            { name: 'Renegade Row', work: 35, rest: 25, mod: 'Plank position, row to hip' },
            { name: 'Mountain Climbers', work: 30, rest: 30, mod: 'Drive knees, keep hips down' },
          ],
          why: 'Peak estrogen means peak power output. This is your window to crush full-body circuits.',
        },
      ],
      meals: {
        focus: 'Protein · Fibre · Phytoestrogens',
        note: 'Support muscle building and hormone balance. Load up on whole foods.',
        ideas: ['Edamame + quinoa bowl', 'Lentil soup with crusty bread', 'Greek yogurt + flaxseed + berries', 'Tempeh stir-fry'],
      },
    },

    ovulation: {
      name: 'Ovulation',
      emoji: '⚡',
      days: [14, 17],        // cycle days 14–17
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fcd34d',
      energy: 'Peak energy · maximum power',
      tagline: 'You are at your strongest. Don\'t hold back.',
      tip: 'Testosterone peaks at ovulation alongside estrogen. Your strength, speed, and pain tolerance are at their highest.',
      workouts: [
        {
          title: 'Peak HIIT — Metabolic Blast',
          duration: '20 min',
          intensity: 'Very High',
          tag: 'HIIT · Cardio',
          rounds: '4 rounds',
          moves: [
            { name: 'Burpee', work: 40, rest: 15, mod: 'Add jump at top for max intensity' },
            { name: 'High Knees', work: 35, rest: 15, mod: 'Drive arms, pump knees to chest' },
            { name: 'Jump Squat', work: 35, rest: 15, mod: 'Arms swing up, land silent' },
            { name: 'Speed Skater', work: 35, rest: 20, mod: 'Leap side to side, touch floor' },
            { name: 'Plank Jack', work: 30, rest: 20, mod: 'Jump feet wide and back' },
          ],
          why: 'Testosterone + estrogen peak = your body\'s highest pain threshold and fastest recovery. Go hard.',
        },
        {
          title: 'Heavy Lift + Sprint Intervals',
          duration: '30 min',
          intensity: 'Very High',
          tag: 'Strength · HIIT',
          rounds: '3 rounds',
          moves: [
            { name: 'Squat Jump (heavy intent)', work: 45, rest: 15, mod: 'Explode up, full extension' },
            { name: 'Push-Up to Clap', work: 30, rest: 20, mod: 'Explosive push, catch soft' },
            { name: 'Sprint in Place', work: 30, rest: 15, mod: 'Max effort, 100%' },
            { name: 'Box Jump (or step-up)', work: 35, rest: 20, mod: 'Land with both feet together' },
            { name: 'Tuck Jump', work: 30, rest: 20, mod: 'Pull knees to chest at peak' },
            { name: 'Plank to Downdog Sprint', work: 35, rest: 20, mod: 'Alternate fast' },
          ],
          why: 'Compound explosive movements at peak hormones = maximum strength and calorie burn.',
        },
        {
          title: 'Dance Cardio Flow',
          duration: '25 min',
          intensity: 'High',
          tag: 'Cardio · Fun',
          rounds: '1 continuous',
          moves: [
            { name: 'Side Step + Clap', work: 60, rest: 0, mod: 'Wide steps, big arm swing' },
            { name: 'Grapevine', work: 60, rest: 0, mod: 'Side cross-step pattern' },
            { name: 'Cha-Cha Step', work: 60, rest: 10, mod: 'Quick-quick-slow rhythm' },
            { name: 'Pivot Turns', work: 45, rest: 10, mod: 'Quarter turns, arms wide' },
            { name: 'Jumping Jacks', work: 45, rest: 10, mod: 'Full extension each rep' },
            { name: 'Hip Circle Sway', work: 60, rest: 0, mod: 'Hands above head, big circles' },
          ],
          why: 'Social, joyful movement is proven to boost the natural oxytocin spike that happens at ovulation.',
        },
      ],
      meals: {
        focus: 'Antioxidants · Fibre · Light protein',
        note: 'Support the surge. Keep digestion light — heavy meals blunt your energy peak.',
        ideas: ['Açaí bowl with granola + seeds', 'Grilled chicken + roasted vegetables', 'Smoothie with banana, spinach, protein', 'Sushi bowl with edamame'],
      },
    },

    luteal: {
      name: 'Luteal',
      emoji: '🍂',
      days: [18, 28],        // cycle days 18–28
      color: '#0f766e',
      bg: '#f0fdfa',
      border: '#99f6e4',
      energy: 'Winding down · steady & strong',
      tagline: 'Progesterone rises. Steady beats explosive now.',
      tip: 'Cravings are real and valid this phase. Honour them with nourishing whole foods — don\'t restrict. Your body needs more calories in the luteal phase.',
      workouts: [
        {
          title: 'Pilates Core & Sculpt',
          duration: '22 min',
          intensity: 'Low–Moderate',
          tag: 'Pilates · Core',
          rounds: '2 rounds',
          moves: [
            { name: 'Dead Bug', work: 40, rest: 20, mod: 'Exhale on extension, lower back pressed' },
            { name: 'Single Leg Stretch', work: 35, rest: 20, mod: 'Chin to chest, shoulders off' },
            { name: 'Roll-Up', work: 30, rest: 20, mod: 'Peel spine off floor vertebra by vertebra' },
            { name: 'Side-Lying Leg Lift (R)', work: 35, rest: 15, mod: 'Stack hips, point toes' },
            { name: 'Side-Lying Leg Lift (L)', work: 35, rest: 15, mod: 'Same — lead with heel' },
            { name: 'Plank Reach', work: 30, rest: 20, mod: 'Alternate arm reach, hips stable' },
          ],
          why: 'Progesterone raises body temperature — avoid excess heat. Controlled pilates maintains strength without spiking cortisol.',
        },
        {
          title: 'Barre Sculpt — Lower Focus',
          duration: '25 min',
          intensity: 'Moderate',
          tag: 'Barre · Toning',
          rounds: '2 rounds',
          moves: [
            { name: 'Parallel Pliés', work: 45, rest: 15, mod: 'Heels together, toes apart, pulse' },
            { name: 'Turnout Pliés', work: 45, rest: 15, mod: 'Wide stance, controlled pulse' },
            { name: 'Standing Arabesque (R)', work: 35, rest: 15, mod: 'Back leg lifts, core tight' },
            { name: 'Standing Arabesque (L)', work: 35, rest: 15, mod: 'Keep square hips' },
            { name: 'Curtsy Lunge', work: 40, rest: 20, mod: 'Cross behind, squeeze glute' },
            { name: 'Calf Raises', work: 30, rest: 20, mod: 'Slow up, slower down' },
          ],
          why: 'Barre\'s isometric holds match luteal phase energy — sustained muscle work without cardio spikes.',
        },
        {
          title: 'Stretch & Mobility Reset',
          duration: '18 min',
          intensity: 'Very Low',
          tag: 'Flexibility · Recovery',
          rounds: '1 flow',
          moves: [
            { name: 'World\'s Greatest Stretch (R)', work: 60, rest: 0, mod: 'Lunge + twist + arm reach' },
            { name: 'World\'s Greatest Stretch (L)', work: 60, rest: 0, mod: 'Breathe into every position' },
            { name: '90/90 Hip Stretch', work: 90, rest: 0, mod: 'Both legs at 90° angle' },
            { name: 'Pigeon Pose (R)', work: 75, rest: 0, mod: 'Fold forward for depth' },
            { name: 'Pigeon Pose (L)', work: 75, rest: 0, mod: 'Equal time each side' },
            { name: 'Seated Forward Fold', work: 60, rest: 0, mod: 'Flex feet, hinge from hips' },
          ],
          why: 'Progesterone relaxes ligaments — perfect timing to make real flexibility gains with held stretches.',
        },
      ],
      meals: {
        focus: 'Magnesium · Complex carbs · B6',
        note: 'Calm PMS naturally. Complex carbs stabilise serotonin. Magnesium reduces bloating and mood swings.',
        ideas: ['Brown rice + roasted chickpeas', 'Banana + almond butter', 'Pumpkin soup with seeds', 'Dark chocolate + walnuts'],
      },
    },
  };

  // ── Helpers ──────────────────────────────────────────────────

  function getCycleData() {
    try {
      const raw = localStorage.getItem('vs_cycle_marked');
      if (!raw) return null;
      const marked = JSON.parse(raw); // array of 'YYYY-MM-DD' strings
      if (!Array.isArray(marked) || marked.length === 0) return null;
      return marked;
    } catch (_) { return null; }
  }

  function getLastPeriodStart(marked) {
    if (!marked || marked.length === 0) return null;
    const sorted = [...marked].sort().reverse(); // most recent first
    return sorted[0]; // latest marked day = most recent period start
  }

  function getCurrentPhase(marked) {
    const last = getLastPeriodStart(marked);
    if (!last) return null;

    const start = new Date(last);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysSince = Math.floor((today - start) / 86400000);
    const cycleDay = (daysSince % 28) + 1; // cycle day 1–28

    if (cycleDay <= 5)  return { phase: PHASES.menstrual,  cycleDay };
    if (cycleDay <= 13) return { phase: PHASES.follicular, cycleDay };
    if (cycleDay <= 17) return { phase: PHASES.ovulation,  cycleDay };
    return                     { phase: PHASES.luteal,     cycleDay };
  }

  function pickWorkout(phase, cycleDay) {
    // Rotate through the 3 workouts based on the week
    const idx = Math.floor((cycleDay - 1) / 7) % phase.workouts.length;
    return phase.workouts[idx];
  }

  // ── Inject Phase Banner into Cycle Tab ──────────────────────

  function renderCyclePhaseBanner() {
    const marked = getCycleData();
    const banner = document.getElementById('current-phase-banner');
    if (!banner) return;

    if (!marked || marked.length === 0) {
      banner.innerHTML = `
        <div class="cpb-icon">📅</div>
        <div class="cpb-body">
          <div class="cpb-phase-name">No cycle data yet</div>
          <div class="cpb-phase-desc">Tap days below to mark your period start.</div>
        </div>`;
      banner.className = 'current-phase-banner cpb-unknown';
      return;
    }

    const result = getCurrentPhase(marked);
    if (!result) return;

    const { phase, cycleDay } = result;
    const workout = pickWorkout(phase, cycleDay);

    banner.style.cssText = `background:${phase.bg};border:1.5px solid ${phase.border};border-radius:16px;padding:1.1rem 1.1rem 0;margin-bottom:1rem;`;
    banner.className = 'current-phase-banner';

    banner.innerHTML = `
      <div class="cpb-top-row" style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">
        <div class="cpb-icon" style="font-size:2rem;line-height:1">${phase.emoji}</div>
        <div class="cpb-body" style="flex:1">
          <div class="cpb-phase-name" style="font-weight:800;font-size:1.1rem;color:${phase.color}">${phase.name} Phase</div>
          <div class="cpb-phase-desc" style="font-size:.78rem;color:#64748b;margin-top:.1rem">Cycle Day ${cycleDay} · ${phase.energy}</div>
        </div>
        <div style="font-size:.7rem;font-weight:700;background:${phase.color};color:#fff;padding:.3rem .6rem;border-radius:99px;white-space:nowrap">Day ${cycleDay}</div>
      </div>

      <p style="font-size:.82rem;color:#475569;font-style:italic;margin-bottom:.75rem;line-height:1.5">"${phase.tagline}"</p>

      <div style="background:rgba(255,255,255,.7);border-radius:10px;padding:.85rem;margin-bottom:.85rem">
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${phase.color};margin-bottom:.4rem">💡 Phase Tip</div>
        <p style="font-size:.78rem;color:#334155;line-height:1.5;margin:0">${phase.tip}</p>
      </div>

      <div style="border-top:1px solid ${phase.border};padding:.85rem 0 .85rem">
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${phase.color};margin-bottom:.55rem">🏋️ Recommended Workout</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem">
          <div>
            <div style="font-weight:800;font-size:.95rem;color:#1e293b;margin-bottom:.2rem">${workout.title}</div>
            <div style="font-size:.75rem;color:#64748b">${workout.duration} · ${workout.tag} · ${workout.rounds}</div>
          </div>
          <button
            id="btn-phase-workout"
            style="background:${phase.color};color:#fff;border:none;border-radius:10px;padding:.5rem .9rem;font-size:.78rem;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0"
          >Start →</button>
        </div>
        <div style="margin-top:.6rem;font-size:.72rem;color:#64748b;font-style:italic;background:rgba(255,255,255,.5);padding:.5rem .7rem;border-radius:8px;line-height:1.45">
          <strong style="color:${phase.color};font-style:normal">Why this?</strong> ${workout.why}
        </div>
      </div>

      <div style="border-top:1px solid ${phase.border};padding:.85rem 0 .1rem">
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${phase.color};margin-bottom:.45rem">🥗 Nutrition Focus</div>
        <div style="font-size:.75rem;font-weight:700;color:#334155;margin-bottom:.25rem">${phase.meals.focus}</div>
        <p style="font-size:.73rem;color:#64748b;margin:0 0 .45rem;line-height:1.45">${phase.meals.note}</p>
        <div style="display:flex;flex-wrap:wrap;gap:.35rem">
          ${phase.meals.ideas.map(i => `<span style="background:rgba(255,255,255,.8);border:1px solid ${phase.border};border-radius:6px;padding:.22rem .55rem;font-size:.68rem;color:#334155">${i}</span>`).join('')}
        </div>
      </div>

      <!-- All phases mini guide -->
      <div style="margin:0 -1.1rem;padding:.85rem 1.1rem .85rem;border-top:1px solid ${phase.border};margin-top:.85rem">
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:.5rem">Your 28-Day Hormone Map</div>
        <div style="display:flex;gap:.35rem">
          ${Object.values(PHASES).map(p => `
            <div style="flex:1;background:${p.bg};border:1px solid ${p.border};border-radius:8px;padding:.4rem .35rem;text-align:center;${p.name === phase.name ? `outline:2px solid ${p.color};` : ''}">
              <div style="font-size:1rem">${p.emoji}</div>
              <div style="font-size:.6rem;font-weight:700;color:${p.color};margin-top:.15rem">${p.name}</div>
              <div style="font-size:.55rem;color:#94a3b8">Days ${p.days[0]}–${p.days[1]}</div>
            </div>`).join('')}
        </div>
      </div>
    `;

    // Attach workout start button
    setTimeout(() => {
      const btn = document.getElementById('btn-phase-workout');
      if (btn) btn.addEventListener('click', () => launchPhaseWorkout(workout, phase));
    }, 0);
  }

  // ── Launch the phase workout in the existing workout player ─

  function launchPhaseWorkout(workout, phase) {
    // Build move list in the format the existing workout player expects
    const moves = workout.moves.map(m => ({
      name: m.name,
      work: m.work,
      rest: m.rest || 15,
      mod: m.mod,
    }));

    // Store workout data so app.js player can pick it up
    window._phaseWorkout = {
      title: workout.title,
      moves,
      rounds: parseInt(workout.rounds) || 1,
      phase: phase.name,
      phaseColor: phase.color,
    };

    // Try to hook into the existing workout player
    if (typeof window.startWorkoutPlayer === 'function') {
      window.startWorkoutPlayer(window._phaseWorkout);
      return;
    }

    // Fallback: show our own minimal player
    showMinimalPlayer(workout, phase);
  }

  // ── Minimal Workout Player (fallback) ───────────────────────

  function showMinimalPlayer(workout, phase) {
    // Remove any existing player
    const existing = document.getElementById('phase-player-overlay');
    if (existing) existing.remove();

    let currentMove = 0;
    let currentRound = 1;
    const totalRounds = parseInt(workout.rounds) || 1;
    let timeLeft = workout.moves[0].work;
    let isRest = false;
    let paused = false;
    let timer = null;

    const overlay = document.createElement('div');
    overlay.id = 'phase-player-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:#0f172a;color:#fff;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      font-family:inherit;padding:1.5rem;
    `;

    function getMoveData() {
      return workout.moves[currentMove] || workout.moves[0];
    }

    function render() {
      const move = getMoveData();
      const phaseDuration = isRest ? (move.rest || 15) : move.work;
      const pct = (timeLeft / phaseDuration) * 100;
      const nextMove = workout.moves[currentMove + 1] || (currentRound < totalRounds ? workout.moves[0] : null);

      overlay.innerHTML = `
        <button id="pp-close" style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;font-family:inherit">✕</button>

        <div style="position:absolute;top:1rem;left:1rem;font-size:.7rem;font-weight:700;background:${phase.color};color:#fff;padding:.3rem .7rem;border-radius:99px">${phase.emoji} ${phase.name} Phase</div>

        <div style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${isRest ? '#94a3b8' : phase.color};margin-bottom:1rem">${isRest ? 'REST' : 'WORK'}</div>

        <!-- Timer ring -->
        <div style="position:relative;width:160px;height:160px;margin-bottom:1.25rem">
          <svg style="position:absolute;inset:0;transform:rotate(-90deg)" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="${isRest ? '#64748b' : phase.color}" stroke-width="8"
              stroke-dasharray="${2 * Math.PI * 54}"
              stroke-dashoffset="${2 * Math.PI * 54 * (1 - pct / 100)}"
              stroke-linecap="round"
              style="transition:stroke-dashoffset .9s linear"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div style="font-size:3rem;font-weight:800;line-height:1">${timeLeft}</div>
            <div style="font-size:.65rem;color:#94a3b8;margin-top:.15rem">Round ${currentRound}/${totalRounds}</div>
          </div>
        </div>

        <div style="font-size:1.4rem;font-weight:800;text-align:center;margin-bottom:.35rem">${move.name}</div>
        <div style="font-size:.8rem;color:#94a3b8;text-align:center;margin-bottom:1.5rem;max-width:280px">${move.mod || ''}</div>

        ${nextMove ? `<div style="font-size:.72rem;color:#64748b;margin-bottom:1.5rem">Next: ${isRest ? move.name : nextMove.name}</div>` : '<div style="font-size:.72rem;color:#10b981;margin-bottom:1.5rem;font-weight:700">Last exercise!</div>'}

        <div style="display:flex;gap:.75rem">
          <button id="pp-skip" style="background:rgba(255,255,255,.08);border:none;color:#fff;padding:.7rem 1.4rem;border-radius:10px;cursor:pointer;font-size:.85rem;font-family:inherit">Skip →</button>
          <button id="pp-pause" style="background:${phase.color};border:none;color:#fff;padding:.7rem 1.6rem;border-radius:10px;cursor:pointer;font-size:.85rem;font-weight:700;font-family:inherit">${paused ? '▶ Resume' : '⏸ Pause'}</button>
        </div>
      `;

      document.getElementById('pp-close').onclick = () => { clearInterval(timer); overlay.remove(); };
      document.getElementById('pp-skip').onclick = advance;
      document.getElementById('pp-pause').onclick = () => { paused = !paused; render(); };
    }

    function advance() {
      clearInterval(timer);
      const move = getMoveData();

      if (!isRest && move.rest > 0) {
        isRest = true;
        timeLeft = move.rest;
      } else {
        isRest = false;
        currentMove++;
        if (currentMove >= workout.moves.length) {
          currentMove = 0;
          currentRound++;
          if (currentRound > totalRounds) {
            showComplete();
            return;
          }
        }
        timeLeft = workout.moves[currentMove].work;
      }
      startTimer();
    }

    function startTimer() {
      render();
      timer = setInterval(() => {
        if (paused) return;
        timeLeft--;
        if (timeLeft <= 0) { advance(); return; }
        // Just update the timer display without full re-render for performance
        const timeEl = overlay.querySelector('[style*="font-size:3rem"]');
        if (timeEl) timeEl.textContent = timeLeft;
        // Update ring
        const move = getMoveData();
        const phaseDuration = isRest ? (move.rest || 15) : move.work;
        const pct = (timeLeft / phaseDuration) * 100;
        const ringEl = overlay.querySelector('circle:last-child');
        if (ringEl) ringEl.setAttribute('stroke-dashoffset', 2 * Math.PI * 54 * (1 - pct / 100));
      }, 1000);
    }

    function showComplete() {
      clearInterval(timer);
      overlay.innerHTML = `
        <div style="text-align:center">
          <div style="font-size:4rem;margin-bottom:.75rem">💪</div>
          <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:.5rem">Workout Complete!</h2>
          <div style="font-size:.85rem;color:#94a3b8;margin-bottom.5rem">${phase.emoji} ${phase.name} Phase workout done</div>
          <p style="color:#94a3b8;font-size:.85rem;margin-bottom:1.75rem">Rest 5 minutes. Drink water.<br>You showed up for your body today.</p>
          <button onclick="document.getElementById('phase-player-overlay').remove()"
            style="background:${phase.color};border:none;color:#fff;padding:1rem 2rem;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit;width:100%;max-width:260px">
            ✓ Done
          </button>
        </div>
      `;
    }

    document.body.appendChild(overlay);
    startTimer();
  }

  // ── Inject Phase Tip into Today Tab ─────────────────────────

  function injectTodayPhaseTip() {
    const marked = getCycleData();
    if (!marked || marked.length === 0) return;
    const result = getCurrentPhase(marked);
    if (!result) return;

    const { phase, cycleDay } = result;

    // Don't duplicate
    if (document.getElementById('today-phase-tip')) return;

    const tip = document.createElement('div');
    tip.id = 'today-phase-tip';
    tip.style.cssText = `
      background:${phase.bg};border:1.5px solid ${phase.border};
      border-radius:14px;padding:.85rem 1rem;margin-bottom:.85rem;
      display:flex;gap:.65rem;align-items:flex-start;
    `;
    tip.innerHTML = `
      <div style="font-size:1.5rem;line-height:1;flex-shrink:0">${phase.emoji}</div>
      <div style="flex:1">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${phase.color};margin-bottom:.2rem">${phase.name} Phase · Day ${cycleDay}</div>
        <div style="font-size:.78rem;color:#334155;line-height:1.45">${phase.tip}</div>
        <button onclick="document.querySelector('[data-tab=cycle]').click()"
          style="margin-top:.5rem;background:none;border:none;color:${phase.color};font-size:.72rem;font-weight:700;cursor:pointer;font-family:inherit;padding:0">
          View phase workout →
        </button>
      </div>
    `;

    // Insert after streak bar if available
    const streakBar = document.getElementById('streak-bar');
    const missionCard = document.getElementById('mission-card');
    const insertAfter = streakBar || missionCard;
    if (insertAfter && insertAfter.parentNode) {
      insertAfter.parentNode.insertBefore(tip, insertAfter.nextSibling);
    }
  }

  // ── Watch for cycle tab activation ──────────────────────────

  function watchTabs() {
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'cycle') {
          setTimeout(renderCyclePhaseBanner, 80);
        }
        if (tab === 'today') {
          setTimeout(injectTodayPhaseTip, 120);
        }
      });
    });
  }

  // ── Re-render when cycle data changes ───────────────────────
  // Patch localStorage.setItem to detect calendar updates

  const _origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    if (key === 'vs_cycle_marked') {
      setTimeout(() => {
        renderCyclePhaseBanner();
        // Remove and re-inject today tip if on today tab
        const old = document.getElementById('today-phase-tip');
        if (old) old.remove();
        if (document.getElementById('tab-today')?.classList.contains('active')) {
          injectTodayPhaseTip();
        }
      }, 100);
    }
  };

  // ── Init ─────────────────────────────────────────────────────

  function init() {
    watchTabs();
    renderCyclePhaseBanner();

    // Inject today tip if paid-today is visible
    if (!document.getElementById('paid-today')?.classList.contains('hidden')) {
      setTimeout(injectTodayPhaseTip, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();