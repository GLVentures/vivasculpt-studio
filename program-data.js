/* ═══════════════════════════════════════════════════
   VivaSculpt — 28-Day System Data
   program-data.js
   ═══════════════════════════════════════════════════ */

'use strict';

var PROGRAM = {
  name: '28-Day Discipline & Sculpt System',
  weeks: [
    {
      num: 1, name: 'Reset Discipline', phase: 'reset',
      goal: 'Break inconsistency. Create daily rhythm.',
      color: '#0F766E',
      days: [
        {
          day: 1, title: 'Full Body Reset', type: 'workout',
          duration: 20, tag: 'Full Body',
          moves: [
            { name: 'Squat', reps: '12 reps', low: 'Chair squat — touch and rise slowly', classic: 'Full squat — drive through heels' },
            { name: 'Incline Push-Up', reps: '8 reps', low: 'Hands on wall — slow 4-count', classic: 'Hands on bench — full range' },
            { name: 'Glute Bridge', reps: '15 reps', low: 'Feet flat, slow squeeze at top', classic: 'Single-leg, 3s hold at top' },
            { name: 'Plank Hold', reps: '20 sec', low: 'Knees down — steady breath', classic: 'Full forearm plank — brace core' }
          ],
          rounds: 3,
          meal: { name: 'Protein Reset Bowl', desc: 'Greek yogurt · berries · walnuts · honey', macros: '~25g protein' }
        },
        {
          day: 2, title: 'Core Activation', type: 'workout',
          duration: 15, tag: 'Core',
          moves: [
            { name: 'Dead Bug', reps: '10 reps', low: 'Arms only, back pressed down', classic: 'Opposite arm + leg, slow & controlled' },
            { name: 'Crunch', reps: '15 reps', low: 'Hands behind neck, small range', classic: 'Full crunch, exhale at top' },
            { name: 'Plank Hold', reps: '30 sec', low: 'Knees down — focus on breathing', classic: 'Full plank — don\'t let hips drop' },
            { name: 'Leg Raise', reps: '10 reps', low: 'Bent knees, lower slowly', classic: 'Straight legs, controlled descent' }
          ],
          rounds: 2,
          meal: { name: 'Eggs & Greens Plate', desc: 'Scrambled eggs · spinach · olive oil · sea salt', macros: '~20g protein' }
        },
        {
          day: 3, title: 'Lower Body Flow', type: 'workout',
          duration: 20, tag: 'Lower Body',
          moves: [
            { name: 'Squat', reps: '15 reps', low: 'Chair squat — controlled tempo', classic: 'Deep squat — drive through heels' },
            { name: 'Reverse Lunge', reps: '10 each leg', low: 'Shallow range, hold wall', classic: 'Drop knee low — drive up' },
            { name: 'Glute Bridge', reps: '15 reps', low: 'Feet flat, hold 2s at top', classic: 'Single leg alternating' },
            { name: 'Calf Raise', reps: '20 reps', low: 'Hold wall for balance', classic: 'Single leg, full range' }
          ],
          rounds: 3,
          meal: { name: 'Chicken & Veg Bowl', desc: 'Grilled chicken · roasted broccoli · sweet potato · olive oil', macros: '~35g protein' }
        },
        {
          day: 4, title: 'Active Recovery', type: 'recovery',
          duration: 20, tag: 'Recovery',
          moves: [],
          rounds: 0,
          description: 'Take a 20–30 min walk outside. Do gentle hip circles, cat-cow, and child\'s pose. Hydrate well. This day is as important as training days.',
          meal: { name: 'Salmon & Avocado Plate', desc: 'Baked salmon · avocado · mixed greens · lemon', macros: '~32g protein' }
        },
        {
          day: 5, title: 'Full Body Repeat', type: 'workout',
          duration: 20, tag: 'Full Body',
          moves: [
            { name: 'Squat', reps: '15 reps', low: 'Chair squat — add 2s pause', classic: 'Full squat — slight progression from Day 1' },
            { name: 'Push-Up', reps: '10 reps', low: 'Incline on bench', classic: 'Floor push-up — full range' },
            { name: 'Glute Bridge', reps: '20 reps', low: 'Standard — 3s hold', classic: 'Single leg — 10 each side' },
            { name: 'Mountain Climbers', reps: '20 sec', low: 'Slow alternating — hands on bench', classic: 'Fast — hands on floor' }
          ],
          rounds: 3,
          meal: { name: 'Power Oat Bowl', desc: 'Oats · protein powder · banana · almond butter · chia seeds', macros: '~28g protein' }
        },
        {
          day: 6, title: 'Burn Circuit', type: 'workout',
          duration: 15, tag: 'HIIT',
          moves: [
            { name: 'Squat Pulse', reps: '30 sec', low: 'Small range, controlled', classic: 'Fast pulses at bottom' },
            { name: 'Mountain Climbers', reps: '30 sec', low: 'Slow — hands on bench', classic: 'Fast — max speed' },
            { name: 'Glute Bridge March', reps: '30 sec', low: 'Slow alternating lifts', classic: 'Fast knee drives, hips high' },
            { name: 'Plank Hold', reps: '30 sec', low: 'Knees down', classic: 'Full plank' }
          ],
          rounds: 3,
          meal: { name: 'Turkey Wrap', desc: 'Turkey slices · hummus · spinach · wholegrain wrap · lemon', macros: '~30g protein' }
        },
        {
          day: 7, title: 'Recovery + Reflection', type: 'recovery',
          duration: 15, tag: 'Recovery',
          moves: [],
          rounds: 0,
          description: 'Gentle mobility only. Foam roll your legs and back. Weigh yourself. Take photos. Write 3 words describing how you feel vs Day 1. You completed Week 1.',
          meal: { name: 'Nourishing Lentil Bowl', desc: 'Red lentils · sweet potato · spinach · cumin · turmeric', macros: '~22g protein' }
        }
      ]
    },
    {
      num: 2, name: 'Build Control', phase: 'build',
      goal: 'Increase consistency under mild resistance.',
      color: '#0A5C56',
      days: [
        { day: 8,  title: 'Upper Body Strength', type: 'workout', duration: 25, tag: 'Upper Body', moves: [{ name:'Push-Up', reps:'12 reps', low:'Incline', classic:'Floor' }, { name:'Tricep Dip', reps:'10 reps', low:'Bent knees', classic:'Legs extended' }, { name:'Shoulder Press', reps:'15 reps', low:'Light weight/no weight', classic:'Full overhead ROM' }, { name:'Superman Hold', reps:'10 reps', low:'Arms by sides', classic:'Arms overhead, 3s hold' }], rounds: 3, meal: { name:'Egg & Cottage Cheese Bowl', desc:'Eggs · cottage cheese · spinach · cherry tomatoes', macros:'~32g protein' } },
        { day: 9,  title: 'Lower Body Strength', type: 'workout', duration: 25, tag: 'Lower Body', moves: [{ name:'Sumo Squat', reps:'15 reps', low:'Narrow stance', classic:'Wide stance, pulse at bottom' }, { name:'Reverse Lunge', reps:'12 each', low:'Shallow range', classic:'Deep lunge, knee drive' }, { name:'Side-Lying Clam', reps:'20 reps', low:'Slow controlled', classic:'Resistance band' }, { name:'Donkey Kick', reps:'15 each', low:'Small arc', classic:'Full extension, squeeze' }], rounds: 3, meal: { name:'Salmon Rice Bowl', desc:'Salmon · brown rice · edamame · sesame · ginger-soy', macros:'~38g protein' } },
        { day: 10, title: 'Core + Cardio', type: 'workout', duration: 20, tag: 'Core', moves: [{ name:'Dead Bug', reps:'12 reps', low:'Arms only', classic:'Full opposite arm/leg' }, { name:'Bird Dog', reps:'10 each', low:'Small range, 2s hold', classic:'Full extension, 3s hold' }, { name:'Mountain Climbers', reps:'30 sec', low:'Slow on bench', classic:'Fast on floor' }, { name:'Plank Shoulder Tap', reps:'20 taps', low:'Knees down', classic:'Full plank, hips stable' }], rounds: 3, meal: { name:'Greek Protein Bowl', desc:'Greek yogurt · protein powder · berries · granola · honey', macros:'~30g protein' } },
        { day: 11, title: 'Active Recovery', type: 'recovery', duration: 20, tag: 'Recovery', moves: [], rounds: 0, description: 'Walk 25 minutes. Focus on posture — shoulders back, core lightly engaged. Do 10 min of stretching afterward.', meal: { name:'Avocado Toast + Eggs', desc:'Sourdough · smashed avocado · 2 poached eggs · chilli flakes', macros:'~24g protein' } },
        { day: 12, title: 'Full Body Circuit', type: 'workout', duration: 25, tag: 'Full Body', moves: [{ name:'Squat', reps:'15 reps', low:'Chair squat', classic:'Full squat' }, { name:'Push-Up', reps:'12 reps', low:'Incline', classic:'Floor' }, { name:'Glute Bridge', reps:'20 reps', low:'Standard', classic:'Single leg' }, { name:'Plank Hold', reps:'40 sec', low:'Knees down', classic:'Full plank' }], rounds: 4, meal: { name:'Chicken Quinoa Bowl', desc:'Grilled chicken · quinoa · roasted courgette · tahini', macros:'~40g protein' } },
        { day: 13, title: 'Endurance Flow', type: 'workout', duration: 20, tag: 'Endurance', moves: [{ name:'Squat to Calf Raise', reps:'15 reps', low:'Slow tempo', classic:'Fast transition' }, { name:'Reverse Lunge', reps:'12 each', low:'Shallow', classic:'Deep with knee drive' }, { name:'Push-Up', reps:'10 reps', low:'Incline', classic:'Floor' }, { name:'Plank', reps:'45 sec', low:'Knees', classic:'Full' }], rounds: 3, meal: { name:'Cottage Cheese Wrap', desc:'Cottage cheese · wholegrain wrap · spinach · cucumber · lemon', macros:'~28g protein' } },
        { day: 14, title: 'Week 2 Reflection', type: 'recovery', duration: 15, tag: 'Recovery', moves: [], rounds: 0, description: 'Light walk + full body stretch. You\'re halfway through the foundation phase. Note your energy levels. Your discipline is becoming automatic.', meal: { name:'Anti-Inflammatory Bowl', desc:'Turmeric lentils · roasted veg · spinach · ginger · lemon', macros:'~24g protein' } }
      ]
    },
    {
      num: 3, name: 'Sculpt Phase', phase: 'sculpt',
      goal: 'Body shaping begins. Visible change.',
      color: '#064E3B',
      days: [
        { day: 15, title: 'Glutes & Legs Focus', type: 'workout', duration: 25, tag: 'Glutes', moves: [{ name:'Sumo Squat Pulse', reps:'30 sec', low:'Small pulse', classic:'Deep pulse, explosive' }, { name:'Glute Bridge', reps:'20 reps', low:'Standard hold', classic:'Single leg, max squeeze' }, { name:'Donkey Kick', reps:'20 each', low:'Controlled arc', classic:'Full extension + pulse' }, { name:'Side Lunge', reps:'12 each', low:'Small range', classic:'Deep lateral lunge' }], rounds: 4, meal: { name:'Power Protein Plate', desc:'Grilled chicken · sweet potato · broccoli · olive oil', macros:'~42g protein' } },
        { day: 16, title: 'Abs & Waist Shaping', type: 'workout', duration: 20, tag: 'Core', moves: [{ name:'Bicycle Crunch', reps:'20 reps', low:'Slow, controlled', classic:'Fast alternating' }, { name:'Side Plank', reps:'20 sec each', low:'Knees down', classic:'Full side plank' }, { name:'Leg Raise', reps:'15 reps', low:'Bent knees', classic:'Straight legs' }, { name:'Russian Twist', reps:'20 reps', low:'Feet on floor', classic:'Feet elevated, add weight' }], rounds: 3, meal: { name:'Tuna & Veg Salad', desc:'Tuna · mixed greens · cherry tomatoes · olive oil · capers', macros:'~35g protein' } },
        { day: 17, title: 'Upper Body Tone', type: 'workout', duration: 25, tag: 'Upper Body', moves: [{ name:'Push-Up', reps:'15 reps', low:'Incline', classic:'Floor — max range' }, { name:'Tricep Dip', reps:'12 reps', low:'Bent knees', classic:'Legs extended' }, { name:'Shoulder Press', reps:'15 reps', low:'No weight, slow', classic:'Light dumbbells' }, { name:'Plank Shoulder Tap', reps:'30 taps', low:'Knees down', classic:'Full plank — minimal sway' }], rounds: 4, meal: { name:'Egg White Scramble', desc:'Egg whites · whole egg · peppers · spinach · feta · olive oil', macros:'~30g protein' } },
        { day: 18, title: 'Active Recovery', type: 'recovery', duration: 20, tag: 'Recovery', moves: [], rounds: 0, description: 'Your body is reshaping. Let it. 25 min walk, 15 min stretch. Focus on glutes, hips, and shoulders today.', meal: { name:'Greek Yogurt Power Bowl', desc:'Full-fat Greek yogurt · mixed berries · walnuts · honey', macros:'~25g protein' } },
        { day: 19, title: 'HIIT Sculpt Circuit', type: 'workout', duration: 25, tag: 'HIIT', moves: [{ name:'Squat Jump', reps:'30 sec', low:'Squat pulse — no jump', classic:'Explosive jump squat' }, { name:'Mountain Climbers', reps:'30 sec', low:'Slow on bench', classic:'Fast on floor' }, { name:'Push-Up', reps:'30 sec', low:'Incline', classic:'Floor — max reps' }, { name:'Glute Bridge March', reps:'30 sec', low:'Slow alternating', classic:'Fast march, hips high' }], rounds: 4, meal: { name:'Salmon & Quinoa Power Bowl', desc:'Baked salmon · quinoa · avocado · cucumber · sesame', macros:'~40g protein' } },
        { day: 20, title: 'Full Body Burnout', type: 'workout', duration: 20, tag: 'Full Body', moves: [{ name:'Squat', reps:'20 reps', low:'Chair squat', classic:'Deep squat' }, { name:'Push-Up', reps:'15 reps', low:'Incline', classic:'Floor' }, { name:'Reverse Lunge', reps:'15 each', low:'Shallow', classic:'Deep — knee drive' }, { name:'Plank Hold', reps:'1 min', low:'Knees down', classic:'Full plank — hold strong' }], rounds: 3, meal: { name:'Beef & Veg Stir-fry', desc:'Lean beef (or tofu) · broccoli · peppers · ginger-soy · brown rice', macros:'~38g protein' } },
        { day: 21, title: 'Sculpt Reflection', type: 'recovery', duration: 15, tag: 'Recovery', moves: [], rounds: 0, description: 'Take progress photos. Compare to Day 1 and Day 7. You are in the sculpt phase. Your body is actively reshaping. One week left.', meal: { name:'Nourishing Lentil Soup', desc:'Red lentils · tomatoes · spinach · cumin · turmeric · lemon', macros:'~22g protein' } }
      ]
    },
    {
      num: 4, name: 'Discipline Peak', phase: 'peak',
      goal: 'Finish strong. Lock the identity.',
      color: '#0B0F14',
      days: [
        { day: 22, title: 'Full Body HIIT', type: 'workout', duration: 25, tag: 'HIIT', moves: [{ name:'Squat Jump', reps:'40 sec', low:'Squat pulse', classic:'Explosive squat jump' }, { name:'Push-Up', reps:'40 sec', low:'Incline', classic:'Floor — max reps' }, { name:'Mountain Climbers', reps:'40 sec', low:'Slow on bench', classic:'Max speed on floor' }, { name:'Glute Bridge', reps:'40 sec', low:'Standard', classic:'Single leg — alternating' }], rounds: 4, meal: { name:'High-Protein Scramble', desc:'3 eggs + egg white · cottage cheese · spinach · tomatoes', macros:'~35g protein' } },
        { day: 23, title: 'Sculpt Circuit', type: 'workout', duration: 25, tag: 'Sculpt', moves: [{ name:'Sumo Squat', reps:'20 reps', low:'Controlled tempo', classic:'Explosive, full range' }, { name:'Donkey Kick', reps:'20 each', low:'Controlled arc', classic:'Full extension + squeeze' }, { name:'Tricep Dip', reps:'15 reps', low:'Bent knees', classic:'Legs fully extended' }, { name:'Side Plank', reps:'30 sec each', low:'Knees', classic:'Full, hips up' }], rounds: 4, meal: { name:'Chicken & Avocado Bowl', desc:'Grilled chicken · avocado · quinoa · mixed greens · lemon', macros:'~42g protein' } },
        { day: 24, title: 'No Excuses Day', type: 'workout', duration: 20, tag: 'Full Body', moves: [{ name:'Squat', reps:'20 reps', low:'Chair squat', classic:'Full deep squat' }, { name:'Push-Up', reps:'15 reps', low:'Incline', classic:'Floor' }, { name:'Plank Hold', reps:'60 sec', low:'Knees — hold steady', classic:'Full plank — don\'t break' }, { name:'Glute Bridge', reps:'25 reps', low:'Standard', classic:'Single leg' }], rounds: 3, meal: { name:'Tuna Power Salad', desc:'Tuna · boiled egg · mixed greens · olive oil · lemon · capers', macros:'~40g protein' } },
        { day: 25, title: 'Active Recovery', type: 'recovery', duration: 20, tag: 'Recovery', moves: [], rounds: 0, description: '3 days left. Walk 30 min. Full body stretch. You\'ve earned this. Your discipline is now a habit.', meal: { name:'Salmon & Roasted Veg', desc:'Baked salmon · sweet potato · broccoli · avocado · lemon', macros:'~38g protein' } },
        { day: 26, title: 'Final Burn Session', type: 'workout', duration: 25, tag: 'HIIT', moves: [{ name:'Squat Jump', reps:'45 sec', low:'Squat pulse', classic:'Explosive — max effort' }, { name:'Push-Up', reps:'45 sec', low:'Incline', classic:'Floor — go until failure' }, { name:'Mountain Climbers', reps:'45 sec', low:'Slow on bench', classic:'Sprint speed' }, { name:'Plank', reps:'60 sec', low:'Knees', classic:'Full — hold until the end' }], rounds: 4, meal: { name:'Peak Performance Bowl', desc:'Grilled chicken · brown rice · broccoli · almonds · ginger-soy', macros:'~45g protein' } },
        { day: 27, title: 'Strength Finale', type: 'workout', duration: 25, tag: 'Full Body', moves: [{ name:'Sumo Squat', reps:'20 reps', low:'Controlled', classic:'Explosive' }, { name:'Push-Up', reps:'20 reps', low:'Incline', classic:'Floor' }, { name:'Glute Bridge', reps:'25 reps', low:'Standard', classic:'Single leg' }, { name:'Dead Bug', reps:'15 reps', low:'Arms only', classic:'Full opposite arm/leg' }], rounds: 4, meal: { name:'Lean Protein & Veg', desc:'Turkey breast · steamed broccoli · sweet potato · olive oil', macros:'~40g protein' } },
        { day: 28, title: 'Completion Ritual', type: 'recovery', duration: 20, tag: 'Finish', moves: [], rounds: 0, description: 'You finished the 28-Day Discipline & Sculpt System. Take your final photos. Compare Day 1 to today. You are not the same person who started. Begin your next cycle stronger.', meal: { name:'Celebration Bowl', desc:'Whatever you love — you earned it. Keep the protein high.', macros: 'You decide' } }
      ]
    }
  ]
};

// Flatten all days for easy access
var ALL_DAYS = [];
PROGRAM.weeks.forEach(function(week) {
  week.days.forEach(function(day) {
    day.week = week.num;
    day.weekName = week.name;
    day.weekPhase = week.phase;
    day.weekColor = week.color;
    ALL_DAYS.push(day);
  });
});