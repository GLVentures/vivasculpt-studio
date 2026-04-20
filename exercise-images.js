/* ═══════════════════════════════════════════════════════════════
   VivaSculpt — Exercise Image Patch
   
   HOW TO USE:
   1. Add this file to your project: <script src="exercise-images.js"></script>
      in index.html AFTER app.js
   
   2. Download free images (all Pexels/Unsplash — free, no attribution needed)
      and save them into your assets/ folder.
      
      See the IMAGE DOWNLOAD LIST at the bottom of this file.
   
   This script patches the existing app.js workout player to show
   an exercise image above the timer ring during each move.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Exercise → image map ─────────────────────────────────────
     Key:   exact exercise name from program-data.js (lowercase)
     Value: path to image in your assets/ folder
     
     If an image is missing/not downloaded yet → shows emoji instead.
     Add more entries as you add more images.
  ─────────────────────────────────────────────────────────────── */
  var EXERCISE_IMAGES = {
    // ── Already in your assets/ folder ──────────────────────
    'squat':               'assets/squats.jpg',
    'goblet squat':        'assets/squats.jpg',
    'sumo squat pulse':    'assets/squats.jpg',
    'jump squat':          'assets/squats.jpg',
    'plank hold':          'assets/plank.jpg',
    'plank jack':          'assets/plank.jpg',
    'plank reach':         'assets/plank.jpg',
    'plank to downdog sprint': 'assets/plank.jpg',

    // ── Download these (free — see list below) ───────────────
    'push-up':             'assets/pushup.jpg',
    'push-up (any level)': 'assets/pushup.jpg',
    'push-up to t':        'assets/pushup.jpg',
    'push-up to clap':     'assets/pushup.jpg',
    'incline push-up':     'assets/pushup.jpg',

    'lunge':               'assets/lunge.jpg',
    'reverse lunges':      'assets/lunge.jpg',
    'lateral lunge':       'assets/lunge.jpg',
    'curtsy lunge':        'assets/lunge.jpg',

    'glute bridge':        'assets/glute-bridge.jpg',
    'romanian deadlift':   'assets/deadlift.jpg',

    'burpee':              'assets/burpee.jpg',
    'high knees':          'assets/high-knees.jpg',
    'mountain climbers':   'assets/mountain-climbers.jpg',
    'jumping jacks':       'assets/jumping-jacks.jpg',
    'speed skater':        'assets/speed-skater.jpg',

    'tricep dips (chair)': 'assets/tricep-dips.jpg',
    'pike shoulder press': 'assets/pike-pushup.jpg',
    'superman hold':       'assets/superman.jpg',
    'renegade row':        'assets/renegade-row.jpg',

    "child's pose":        'assets/childs-pose.jpg',
    'pigeon pose (r)':     'assets/pigeon-pose.jpg',
    'pigeon pose (l)':     'assets/pigeon-pose.jpg',
    'glute bridge':        'assets/glute-bridge.jpg',
    'dead bug':            'assets/dead-bug.jpg',
    'single leg stretch':  'assets/single-leg-stretch.jpg',
  };

  /* ── Emoji fallback map (shown when image not available) ─────
     Every exercise gets a visual even without images downloaded.
  ─────────────────────────────────────────────────────────────── */
  var EXERCISE_EMOJI = {
    // Strength
    'squat':               '🏋️', 'goblet squat':      '🏋️',
    'sumo squat pulse':    '🏋️', 'jump squat':        '⬆️',
    'lunge':               '🦵', 'reverse lunges':    '🦵',
    'lateral lunge':       '↔️', 'curtsy lunge':      '🫅',
    'glute bridge':        '🍑', 'romanian deadlift': '🏋️',
    'plank hold':          '🏔️', 'plank jack':        '⭐',
    'plank reach':         '🏔️', 'plank to downdog sprint': '🔁',
    'push-up':             '💪', 'push-up (any level)':'💪',
    'push-up to t':        '✈️', 'push-up to clap':   '👏',
    'incline push-up':     '💪', 'tricep dips (chair)':'💺',
    'pike shoulder press': '⬆️', 'superman hold':     '🦸',
    'renegade row':        '🚣', 'mountain climbers': '🧗',
    'calf raises':         '🦶',

    // HIIT / Cardio
    'burpee':              '💥', 'high knees':        '🏃',
    'jumping jacks':       '⭐', 'speed skater':      '⛸️',
    'sprint in place':     '💨', 'tuck jump':         '🦘',
    'box jump (or step-up)':'📦',

    // Yoga / Flexibility
    "child's pose":        '🧘', 'savasana':          '😌',
    'happy baby':          '👶', 'butterfly pose':    '🦋',
    'pigeon pose (r)':     '🕊️', 'pigeon pose (l)':   '🕊️',
    'dragon pose (r)':     '🐉', 'dragon pose (l)':   '🐉',
    'sphinx pose':         '🏛️', 'corpse pose':       '😌',
    'supine twist (r)':    '🌀', 'supine twist (l)':  '🌀',
    'legs up the wall':    '🦵', 'reclining bound angle': '🦋',
    '90/90 hip stretch':   '📐', 'seated forward fold':'🙇',
    "world's greatest stretch (r)": '🌍',
    "world's greatest stretch (l)": '🌍',

    // Pilates / Barre
    'dead bug':            '🐛', 'single leg stretch': '🦵',
    'roll-up':             '🌀', 'side-lying leg lift (r)': '🦵',
    'side-lying leg lift (l)': '🦵',
    'parallel pliés':      '🩰', 'turnout pliés':     '🩰',
    'standing arabesque (r)': '🦩', 'standing arabesque (l)': '🦩',

    // Dance / Recovery
    'side step + clap':    '💃', 'grapevine':         '🍇',
    'cha-cha step':        '💃', 'pivot turns':       '🌀',
    'hip circle sway':     '🌊', 'slow march (in place)': '🚶',
    'neck rolls':          '🔄', 'shoulder circles':  '🔄',
    'standing hip sway':   '🌊', '4-7-8 breathing':  '💨',
    'box breathing':       '⬜',
  };

  function getImage(name) {
    if (!name) return null;
    return EXERCISE_IMAGES[name.toLowerCase().trim()] || null;
  }

  function getEmoji(name) {
    if (!name) return '💪';
    return EXERCISE_EMOJI[name.toLowerCase().trim()] || '💪';
  }

  /* ── Inject image panel into the existing workout modal ──────
     The existing player renders into #modal-workout.
     We add an image panel ABOVE the timer ring.
     
     We hook into the existing updatePlayerUI() by patching it
     after app.js loads.
  ─────────────────────────────────────────────────────────────── */

  function injectImagePanel() {
    var playerBox = document.querySelector('#modal-workout .workout-player');
    if (!playerBox) return;

    // Don't add twice
    if (document.getElementById('exercise-visual-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'exercise-visual-panel';
    panel.style.cssText = [
      'width:100%',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'margin-bottom:.5rem',
    ].join(';');

    // Insert before the player-phase div (WORK label)
    var phaseEl = document.getElementById('player-phase');
    if (phaseEl) {
      playerBox.insertBefore(panel, phaseEl);
    } else {
      playerBox.prepend(panel);
    }
  }

  function updateVisualPanel(moveName, isRest) {
    var panel = document.getElementById('exercise-visual-panel');
    if (!panel) return;

    if (isRest) {
      panel.innerHTML =
        '<div style="font-size:3.5rem;line-height:1;margin:.25rem 0 .5rem;opacity:.7">😮‍💨</div>' +
        '<div style="font-size:.65rem;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.25rem">Rest</div>';
      return;
    }

    var imgSrc  = getImage(moveName);
    var emoji   = getEmoji(moveName);

    if (imgSrc) {
      panel.innerHTML =
        '<div style="width:100%;max-width:320px;height:160px;border-radius:14px;overflow:hidden;margin:.25rem 0 .5rem;background:#f1f5f9;position:relative">' +
          '<img src="' + imgSrc + '" alt="' + moveName + '" ' +
            'style="width:100%;height:100%;object-fit:cover;display:block" ' +
            'onerror="this.parentElement.dataset.fallback=\'1\';this.parentElement.innerHTML=\'<div style=&quot;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:.4rem&quot;><div style=&quot;font-size:3.5rem&quot;>' + emoji + '</div></div>\'">' +
          '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.45));padding:.5rem .75rem;display:flex;align-items:center;justify-content:space-between">' +
            '<span style="font-size:.62rem;color:#fff;font-weight:600;opacity:.9">' + moveName + '</span>' +
          '</div>' +
        '</div>';
    } else {
      // Emoji-only display (no image downloaded yet)
      panel.innerHTML =
        '<div style="font-size:4rem;line-height:1;margin:.25rem 0 .3rem;filter:drop-shadow(0 3px 8px rgba(0,0,0,.15))">' + emoji + '</div>';
    }
  }

  /* ── Also show a plain-English description below exercise name ─
     Patches the existing #player-mod element which already shows
     the low/classic intensity cue. We add a description line.
  ─────────────────────────────────────────────────────────────── */
  var EXERCISE_DESC = {
    'squat':               'Feet shoulder-width, lower until thighs are parallel, drive up.',
    'goblet squat':        'Hold weight at chest. Squat deep, elbows inside knees.',
    'sumo squat pulse':    'Wide stance, toes out. Squat low and pulse with tiny movements.',
    'jump squat':          'Squat down, explode upward. Land softly through your heels.',
    'lunge':               'Step forward, lower back knee toward the floor. Push back up.',
    'reverse lunges':      'Step one foot back, lower back knee. Keep front shin vertical.',
    'lateral lunge':       'Step wide to one side, sit into that hip, other leg stays straight.',
    'curtsy lunge':        'Step one foot behind and across like a curtsy. Squeeze glute.',
    'glute bridge':        'On back, feet flat, drive hips up. Squeeze glutes at the top.',
    'romanian deadlift':   'Hinge at hips with soft knees. Feel the hamstring stretch.',
    'plank hold':          'Body in a straight line from head to heels. Core braced tight.',
    'plank jack':          'In plank, jump feet wide then back together — like a jumping jack.',
    'plank reach':         'In plank, extend one arm forward. Keep hips completely still.',
    'push-up (any level)': 'Lower chest to floor, press back up. Knees on floor is fine.',
    'push-up to t':        'Do a push-up, then rotate open and raise one arm to the ceiling.',
    'push-up to clap':     'Explosive push — push hard enough to clap hands in the air.',
    'tricep dips (chair)': 'Hands on chair edge, lower by bending elbows straight back.',
    'pike shoulder press': 'Hips high in downward dog shape, bend elbows toward the floor.',
    'superman hold':       'Lie face down. Lift arms and legs off the floor simultaneously.',
    'renegade row':        'In high plank with weights, row one to your hip. Hips stay square.',
    'mountain climbers':   'High plank. Drive knees to chest one at a time, fast as you can.',
    'burpee':              'Squat down → feet back → push-up → feet in → jump up. One motion.',
    'high knees':          'Run in place driving your knees up to hip height. Pump your arms.',
    'jumping jacks':       'Jump feet wide while raising arms overhead. Return and repeat.',
    'speed skater':        'Leap side to side, landing on one foot, opposite hand reaches down.',
    'calf raises':         'Rise up onto toes slowly, lower back down slowly. Feel the burn.',
    "child's pose":        'Kneel, sit back on heels, fold forward with arms stretched out.',
    'pigeon pose (r)':     'Right shin across the mat, back leg straight. Fold forward.',
    'pigeon pose (l)':     'Left shin across the mat. Same as right — equal time both sides.',
    'glute bridge':        'On back, feet flat, drive hips up and squeeze at the top.',
    'dead bug':            'On back, lower opposite arm and leg toward the floor. Exhale down.',
    'single leg stretch':  'Shoulders off floor, pull one knee to chest while other extends.',
  };

  function getDesc(name) {
    if (!name) return '';
    return EXERCISE_DESC[name.toLowerCase().trim()] || '';
  }

  /* ── Patch updatePlayerUI ────────────────────────────────────
     We wrap the existing function to run after it, then update
     the visual panel based on what move is now showing.
  ─────────────────────────────────────────────────────────────── */

  function patchPlayerUI() {
    if (typeof window._origUpdatePlayerUI !== 'undefined') return; // already patched
    if (typeof window.updatePlayerUI !== 'function') return;

    window._origUpdatePlayerUI = window.updatePlayerUI;

    window.updatePlayerUI = function () {
      // Run original first
      window._origUpdatePlayerUI.apply(this, arguments);

      // Then update our visual
      var w = window.workoutState;
      if (!w || !w.moves) return;

      var move   = w.moves[w.idx];
      var isRest = (w.phase === 'rest');

      injectImagePanel();
      updateVisualPanel(move ? move.name : '', isRest);

      // Inject description below the mod line
      var modEl = document.getElementById('player-mod');
      var descId = 'player-exercise-desc';
      var existing = document.getElementById(descId);

      if (!isRest && move) {
        var desc = getDesc(move.name);
        if (desc) {
          if (!existing) {
            var descEl = document.createElement('div');
            descEl.id = descId;
            descEl.style.cssText = 'font-size:.72rem;color:#64748b;text-align:center;max-width:280px;line-height:1.45;margin:.2rem auto .1rem;padding:0 .5rem';
            if (modEl && modEl.parentNode) {
              modEl.parentNode.insertBefore(descEl, modEl.nextSibling);
            }
            existing = descEl;
          }
          existing.textContent = desc;
        } else if (existing) {
          existing.textContent = '';
        }
      } else if (existing) {
        existing.textContent = '';
      }
    };
  }

  /* ── Also patch startWorkoutSession to inject panel on open ──*/
  function patchStartSession() {
    if (typeof window._origStartWorkoutSession !== 'undefined') return;
    if (typeof window.startWorkoutSession !== 'function') return;

    window._origStartWorkoutSession = window.startWorkoutSession;

    window.startWorkoutSession = function (moves, rounds, dayNum) {
      window._origStartWorkoutSession.apply(this, arguments);
      // Panel will be injected on next updatePlayerUI call
    };
  }

  /* ── Init: wait for app.js functions to be available ─────── */
  function init() {
    patchPlayerUI();
    patchStartSession();
  }

  // Retry a few times in case app.js hasn't defined the functions yet
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    if (typeof window.updatePlayerUI === 'function') {
      init();
      clearInterval(interval);
    }
    if (attempts > 20) clearInterval(interval);
  }, 100);

})();


/* ═══════════════════════════════════════════════════════════════
   IMAGE DOWNLOAD LIST — all free, no account needed
   
   Go to Pexels.com and search these terms.
   Download the first good result, save it to your assets/ folder
   with the filename shown.
   
   File: assets/pushup.jpg
   Search: "woman push up exercise" on pexels.com
   
   File: assets/lunge.jpg  
   Search: "woman lunge exercise" on pexels.com
   
   File: assets/glute-bridge.jpg
   Search: "woman glute bridge exercise" on pexels.com
   
   File: assets/deadlift.jpg
   Search: "woman deadlift exercise" on pexels.com
   
   File: assets/burpee.jpg
   Search: "woman burpee exercise" on pexels.com
   
   File: assets/high-knees.jpg
   Search: "woman high knees cardio" on pexels.com
   
   File: assets/mountain-climbers.jpg
   Search: "woman mountain climbers exercise" on pexels.com
   
   File: assets/jumping-jacks.jpg
   Search: "woman jumping jacks exercise" on pexels.com
   
   File: assets/speed-skater.jpg
   Search: "woman lateral speed skater exercise" on pexels.com
   
   File: assets/tricep-dips.jpg
   Search: "woman tricep dips chair" on pexels.com
   
   File: assets/pike-pushup.jpg
   Search: "woman pike push up exercise" on pexels.com
   
   File: assets/superman.jpg
   Search: "woman superman exercise floor" on pexels.com
   
   File: assets/renegade-row.jpg
   Search: "woman renegade row plank" on pexels.com
   
   File: assets/childs-pose.jpg
   Search: "woman child's pose yoga" on pexels.com
   
   File: assets/pigeon-pose.jpg
   Search: "woman pigeon pose yoga" on pexels.com
   
   File: assets/dead-bug.jpg
   Search: "woman dead bug exercise pilates" on pexels.com
   
   File: assets/single-leg-stretch.jpg
   Search: "woman pilates leg stretch" on pexels.com
   
   TIP: Keep images around 600x400px and under 150KB each.
   Use squoosh.app (free) to resize/compress before saving.
═══════════════════════════════════════════════════════════════ */