(function () {
  'use strict';

  var EXERCISE_IMAGES = {
    'squat':                    'assets/squat.jpg',
    'goblet squat':             'assets/squat.jpg',
    'sumo squat pulse':         'assets/squat.jpg',
    'jump squat':               'assets/squat.jpg',
    'squat jump (explosive)':   'assets/squat.jpg',
    'plank hold':               'assets/plank.jpg',
    'plank jack':               'assets/plank.jpg',
    'plank reach':              'assets/plank.jpg',
    'plank to downdog sprint':  'assets/plank.jpg',
    'push-up (any level)':      'assets/pushup.jpg',
    'push-up':                  'assets/pushup.jpg',
    'push-up to t':             'assets/pushup.jpg',
    'push-up to clap':          'assets/pushup.jpg',
    'incline push-up':          'assets/pushup.jpg',
    'glute bridge':             'assets/glutebridges.jpg',
  };

  var EXERCISE_EMOJI = {
    'squat':                    '🏋️',
    'goblet squat':             '🏋️',
    'sumo squat pulse':         '🏋️',
    'jump squat':               '⬆️',
    'squat jump (explosive)':   '💥',
    'lunge':                    '🦵',
    'reverse lunges':           '🦵',
    'lateral lunge':            '↔️',
    'curtsy lunge':             '🫅',
    'glute bridge':             '🍑',
    'romanian deadlift':        '🏋️',
    'plank hold':               '🏔️',
    'plank jack':               '⭐',
    'plank reach':              '🏔️',
    'plank to downdog sprint':  '🔁',
    'push-up':                  '💪',
    'push-up (any level)':      '💪',
    'push-up to t':             '✈️',
    'push-up to clap':          '👏',
    'incline push-up':          '💪',
    'tricep dips (chair)':      '💺',
    'pike shoulder press':      '⬆️',
    'superman hold':            '🦸',
    'renegade row':             '🚣',
    'mountain climbers':        '🧗',
    'calf raises':              '🦶',
    'burpee':                   '💥',
    'high knees':               '🏃',
    'jumping jacks':            '⭐',
    'speed skater':             '⛸️',
    'sprint in place':          '💨',
    'tuck jump':                '🦘',
    'box jump (or step-up)':    '📦',
    "child's pose":             '🧘',
    'savasana':                 '😌',
    'happy baby':               '👶',
    'butterfly pose':           '🦋',
    'pigeon pose (r)':          '🕊️',
    'pigeon pose (l)':          '🕊️',
    'dragon pose (r)':          '🐉',
    'dragon pose (l)':          '🐉',
    'sphinx pose':              '🏛️',
    'corpse pose':              '😌',
    'supine twist (r)':         '🌀',
    'supine twist (l)':         '🌀',
    'legs up the wall':         '🦵',
    'reclining bound angle':    '🦋',
    '90/90 hip stretch':        '📐',
    'seated forward fold':      '🙇',
    "world's greatest stretch (r)": '🌍',
    "world's greatest stretch (l)": '🌍',
    'dead bug':                 '🐛',
    'single leg stretch':       '🦵',
    'roll-up':                  '🌀',
    'side-lying leg lift (r)':  '🦵',
    'side-lying leg lift (l)':  '🦵',
    'parallel pliés':           '🩰',
    'turnout pliés':            '🩰',
    'standing arabesque (r)':   '🦩',
    'standing arabesque (l)':   '🦩',
    'side step + clap':         '💃',
    'grapevine':                '🍇',
    'cha-cha step':             '💃',
    'pivot turns':              '🌀',
    'hip circle sway':          '🌊',
    'slow march (in place)':    '🚶',
    'neck rolls':               '🔄',
    'shoulder circles':         '🔄',
    'standing hip sway':        '🌊',
    '4-7-8 breathing':          '💨',
    'box breathing':            '⬜',
  };

  var EXERCISE_DESC = {
    'squat':                    'Feet shoulder-width, lower until thighs parallel, drive up.',
    'goblet squat':             'Hold weight at chest. Squat deep, elbows inside knees.',
    'sumo squat pulse':         'Wide stance, toes out. Squat low and pulse with tiny movements.',
    'jump squat':               'Squat down, explode upward. Land softly through your heels.',
    'squat jump (explosive)':   'Maximum power — squat deep then drive up as hard as you can.',
    'lunge':                    'Step forward, lower back knee toward the floor. Push back up.',
    'reverse lunges':           'Step one foot back, lower back knee. Front shin stays vertical.',
    'lateral lunge':            'Step wide to one side, sit into that hip. Other leg stays straight.',
    'curtsy lunge':             'Step one foot behind and across like a curtsy. Squeeze glute.',
    'glute bridge':             'On back, feet flat, drive hips up. Squeeze glutes at the top.',
    'romanian deadlift':        'Hinge at hips with soft knees. Feel the hamstring stretch.',
    'plank hold':               'Body in a straight line from head to heels. Core braced tight.',
    'plank jack':               'In plank, jump feet wide then back — like a jumping jack.',
    'plank reach':              'In plank, extend one arm forward. Keep hips completely still.',
    'push-up (any level)':      'Lower chest to floor, press back up. Knees on floor is fine.',
    'push-up to t':             'Do a push-up, rotate open and raise one arm to the ceiling.',
    'push-up to clap':          'Explosive push — hard enough to clap hands in the air.',
    'incline push-up':          'Hands on wall or raised surface. Lower chest toward it.',
    'tricep dips (chair)':      'Hands on chair edge, lower by bending elbows straight back.',
    'pike shoulder press':      'Hips high in downward dog shape, bend elbows toward the floor.',
    'superman hold':            'Lie face down. Lift arms and legs off the floor simultaneously.',
    'renegade row':             'In high plank, row one weight to your hip. Hips stay square.',
    'mountain climbers':        'High plank. Drive knees to chest one at a time, fast.',
    'burpee':                   'Squat → feet back → push-up → feet in → jump up. One motion.',
    'high knees':               'Run in place driving your knees up to hip height. Pump arms.',
    'jumping jacks':            'Jump feet wide while raising arms overhead. Return and repeat.',
    'speed skater':             'Leap side to side, landing on one foot, opposite hand reaches down.',
    'calf raises':              'Rise up onto toes slowly, lower back down slowly.',
    "child's pose":             'Kneel, sit back on heels, fold forward with arms stretched out.',
    'dead bug':                 'On back, lower opposite arm and leg toward the floor. Exhale down.',
    'single leg stretch':       'Shoulders off floor, pull one knee to chest while other extends.',
    'glute bridge':             'On back, feet flat, drive hips up and squeeze at the top.',
  };

  function getImage(name) {
    if (!name) return null;
    return EXERCISE_IMAGES[name.toLowerCase().trim()] || null;
  }

  function getEmoji(name) {
    if (!name) return '💪';
    return EXERCISE_EMOJI[name.toLowerCase().trim()] || '💪';
  }

  function getDesc(name) {
    if (!name) return '';
    return EXERCISE_DESC[name.toLowerCase().trim()] || '';
  }

  function injectImagePanel() {
    var playerBox = document.querySelector('#modal-workout .workout-player');
    if (!playerBox) return;
    if (document.getElementById('exercise-visual-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'exercise-visual-panel';
    panel.style.cssText = 'width:100%;display:flex;flex-direction:column;align-items:center;margin-bottom:.5rem;';

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

    var imgSrc = getImage(moveName);
    var emoji  = getEmoji(moveName);

    if (imgSrc) {
      panel.innerHTML =
        '<div style="width:100%;max-width:320px;height:160px;border-radius:14px;overflow:hidden;margin:.25rem 0 .5rem;background:#f1f5f9;position:relative">' +
          '<img src="' + imgSrc + '" alt="' + moveName + '" ' +
            'style="width:100%;height:100%;object-fit:cover;display:block" ' +
            'onerror="this.parentElement.innerHTML=\'<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;font-size:3.5rem&quot;>' + emoji + '</div>\'">' +
          '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.5));padding:.4rem .6rem">' +
            '<span style="font-size:.62rem;color:#fff;font-weight:600">' + moveName + '</span>' +
          '</div>' +
        '</div>';
    } else {
      panel.innerHTML =
        '<div style="font-size:4rem;line-height:1;margin:.25rem 0 .3rem">' + emoji + '</div>';
    }
  }

  function patchPlayerUI() {
    if (typeof window._origUpdatePlayerUI !== 'undefined') return;
    if (typeof window.updatePlayerUI !== 'function') return;

    window._origUpdatePlayerUI = window.updatePlayerUI;

    window.updatePlayerUI = function () {
      window._origUpdatePlayerUI.apply(this, arguments);

      var w = window.workoutState;
      if (!w || !w.moves) return;

      var move   = w.moves[w.idx];
      var isRest = (w.phase === 'rest');

      injectImagePanel();
      updateVisualPanel(move ? move.name : '', isRest);

      var modEl   = document.getElementById('player-mod');
      var descId  = 'player-exercise-desc';
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

  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    if (typeof window.updatePlayerUI === 'function') {
      patchPlayerUI();
      clearInterval(interval);
    }
    if (attempts > 20) clearInterval(interval);
  }, 100);

})();