import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// PANTHER v7.1 — LOCAL-FIRST DAILY UTILITY
// ============================================================================
//
// 1. SCRIPT   — Read-only daily view + one-tap step-through workout runner
// 2. SHOP     — Import & curate weekly Factor / HelloFresh meals (auto-fetch)
// 3. FUEL     — Daily nutrition checklist (staples + selected meals)
// 4. STRETCH  — Full body guided stretch routine (importable)
// 5. PROGRESS — Streak, gains logging, charts, workout history
//
// Workout & stretch routines importable via text files
// Meals auto-fetched from GitHub Actions or imported manually
// Video links: YouTube embeds inline, any other URL opens in new tab
// 100% client-side · localStorage persistence · GitHub Pages
// ============================================================================

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// ============================================================================
// DEFAULT WORKOUT DATA — used if no text file imported
// ============================================================================

const DEFAULT_WORKOUT = {
  Monday: {
    name: "Lower Body Power",
    am: { title: "Trail Run + Lower Prehab", duration: "35 min", sections: [
      { name: "Cardio", exercises: [
        { name: "Trail Run 1.75 Miles", sets: 1, reps: "Complete", rest: 0, notes: "Run/walk - push to run more each week", video: "8Y3MhCNIm0k" }
      ]},
      { name: "Lower Body Prehab", exercises: [
        { name: "Tibialis Raises", sets: 3, reps: 25, rest: 30, notes: "Back against wall, lift toes high", video: "gNS_QjGAs_k" },
        { name: "Single-Leg Calf Raises", sets: 3, reps: "20 each", rest: 30, notes: "Slow 3 sec up, 3 sec down", video: "OeTJ7NHJD7M" },
        { name: "Single-Leg Glute Bridge", sets: 3, reps: "15 each", rest: 30, notes: "Squeeze glute hard at top", video: "AVAXhy6pl7o" },
        { name: "Big Toe Raises", sets: 3, reps: 20, rest: 30, notes: "Lift only big toe while other toes stay down", video: "adbbCKNj1IM" }
      ]}
    ]},
    pm: { title: "LEGS", duration: "50 min", sections: [
      { name: "Warm-Up", exercises: [
        { name: "Leg Swings", sets: 1, reps: "15 each direction", rest: 0, notes: "Front/back and side/side each leg", video: "4aoUZEZFJF8" },
        { name: "Bodyweight Squats", sets: 1, reps: 20, rest: 60, notes: "Deep, controlled, warm up joints", video: "aclHkVaku9U" }
      ]},
      { name: "Main Work", exercises: [
        { name: "Bodyweight Squats", sets: 3, reps: "MAX", rest: 90, notes: "Deep as possible, full range", video: "aclHkVaku9U" },
        { name: "Nordic Curl Negatives", sets: 5, reps: 5, rest: 90, notes: "5 sec lowering - FIGHT IT! Catch with hands.", video: "HUXS3S2xSK4" },
        { name: "Bulgarian Split Squats", sets: 4, reps: "12 each", rest: 60, notes: "15 lb each hand, rear foot elevated, deep", video: "2C-uNgKwPLE" },
        { name: "Single-Leg RDL", sets: 4, reps: "10 each", rest: 60, notes: "15 lb, feel hamstring stretch at bottom", video: "j7pPR0XAX4s" },
        { name: "Jump Squats", sets: 4, reps: 15, rest: 60, notes: "Explode every rep - max height", video: "YGGq0AE5Vyk" }
      ]}
    ]}
  },
  Tuesday: {
    name: "Upper Push",
    am: { title: "Sprints + Rotator Cuff", duration: "30 min", sections: [
      { name: "Sprint Intervals", exercises: [
        { name: "Warm-up Sprints (70%)", sets: 3, reps: "40m each", rest: 60, notes: "Walk back recovery", video: "w1xUbXvnkYA" },
        { name: "Hard Sprints (90-95%)", sets: 5, reps: "40m each", rest: 90, notes: "Near max effort - explode!", video: "w1xUbXvnkYA" },
        { name: "Cooldown Sprints (70%)", sets: 2, reps: "40m each", rest: 60, notes: "Walk back, shake out legs", video: "w1xUbXvnkYA" }
      ]},
      { name: "Rotator Cuff", exercises: [
        { name: "Wall Slides", sets: 3, reps: 15, rest: 30, notes: "Back flat on wall, slide arms up/down", video: "8lDC4ti4g9A" },
        { name: "External Rotation (Side-Lying)", sets: 3, reps: "20 each", rest: 30, notes: "Elbow glued to side, rotate forearm up", video: "WVKb13Oqhg4" }
      ]}
    ]},
    pm: { title: "PUSH", duration: "50 min", sections: [
      { name: "Warm-Up", exercises: [
        { name: "Arm Circles", sets: 1, reps: "20 each direction", rest: 0, notes: "Small to large, forward and back", video: "HWvKbZcPT0Y" },
        { name: "Push-ups", sets: 1, reps: 15, rest: 60, notes: "Get blood flowing", video: "_l3ySVKYVJ8" }
      ]},
      { name: "Main Work", exercises: [
        { name: "Dips", sets: 5, reps: "MAX", rest: 120, notes: "Full depth, lean slightly forward, GO TO FAILURE", video: "2z8JmcrW-As" },
        { name: "Mike Tyson Push-ups", sets: 4, reps: 10, rest: 90, notes: "Feet on wall, rock back to squat, dive forward", video: "WeFGIPR8yxA" },
        { name: "Pike Push-ups (Feet Elevated)", sets: 5, reps: "MAX", rest: 90, notes: "Feet on chair/stairs - shoulder builder", video: "sposDXWEB0A" },
        { name: "Push-ups", sets: 5, reps: "MAX", rest: 90, notes: "Perfect form to failure - chest to ground", video: "_l3ySVKYVJ8" },
        { name: "Diamond Push-ups", sets: 4, reps: "MAX", rest: 60, notes: "Hands together, elbows tight - tricep killer", video: "J0DnG1_S92I" },
        { name: "DB Overhead Press", sets: 3, reps: 20, rest: 45, notes: "15 lb each hand, standing, core tight", video: "qEwKCR5JCog" }
      ]}
    ]}
  },
  Wednesday: {
    name: "Core & Conditioning",
    am: { title: "Trail Run + Core", duration: "35 min", sections: [
      { name: "Cardio", exercises: [
        { name: "Trail Run 1.75 Miles", sets: 1, reps: "Complete", rest: 0, notes: "Push pace on flat sections", video: "8Y3MhCNIm0k" }
      ]},
      { name: "Core Stability", exercises: [
        { name: "Dead Bug", sets: 3, reps: "12 each side", rest: 30, notes: "Low back GLUED to floor", video: "4XLEnwUr1d8" },
        { name: "Plank", sets: 3, reps: "60 sec", rest: 30, notes: "Straight line head to heels", video: "pSHjTRCQxIw" },
        { name: "Side Plank", sets: 3, reps: "45 sec each", rest: 30, notes: "Stack feet, squeeze obliques", video: "K2VljzCC16g" }
      ]}
    ]},
    pm: { title: "CORE + GRIP", duration: "40 min", sections: [
      { name: "Warm-Up", exercises: [
        { name: "Jumping Jacks", sets: 1, reps: 50, rest: 0, notes: "Get heart rate up", video: "2W4ZNSwoW_4" },
        { name: "Mountain Climbers", sets: 1, reps: 30, rest: 60, notes: "Drive knees to chest fast", video: "nmwgirgXLYM" }
      ]},
      { name: "Main Work", exercises: [
        { name: "Hanging Leg Raises", sets: 5, reps: "MAX", rest: 90, notes: "Control the swing - NO KIPPING", video: "Pr1ieGZ5atk" },
        { name: "Russian Twists (15 lb)", sets: 4, reps: "30 total", rest: 45, notes: "Feet elevated, control rotation", video: "wkD8rjkodUI" },
        { name: "Dead Hang", sets: 5, reps: "Max Time", rest: 60, notes: "Full grip on bar - DON'T LET GO", video: "dkOAOjPqaOQ" },
        { name: "Towel Hang", sets: 3, reps: "Max Time", rest: 60, notes: "Towel over bar - brutal grip", video: "IEOwe3xXWcg" }
      ]}
    ]}
  },
  Thursday: {
    name: "Upper Pull",
    am: { title: "Sprints + Rotator Cuff", duration: "30 min", sections: [
      { name: "Sprint Intervals", exercises: [
        { name: "Warm-up Sprints (70%)", sets: 3, reps: "40m each", rest: 60, notes: "Walk back recovery", video: "w1xUbXvnkYA" },
        { name: "Hard Sprints (90-95%)", sets: 5, reps: "40m each", rest: 90, notes: "Near max effort", video: "w1xUbXvnkYA" },
        { name: "Cooldown Sprints (70%)", sets: 2, reps: "40m each", rest: 60, notes: "Shake it out", video: "w1xUbXvnkYA" }
      ]},
      { name: "Rotator Cuff", exercises: [
        { name: "External Rotation (Side-Lying)", sets: 3, reps: "15 each", rest: 30, notes: "Elbow at 90°, rotate forearm up", video: "WVKb13Oqhg4" },
        { name: "Wall Slides", sets: 3, reps: 15, rest: 30, notes: "Back flat on wall", video: "8lDC4ti4g9A" }
      ]}
    ]},
    pm: { title: "PULL", duration: "55 min", sections: [
      { name: "Warm-Up", exercises: [
        { name: "Arm Circles", sets: 1, reps: "20 each direction", rest: 0, notes: "Loosen shoulders", video: "HWvKbZcPT0Y" },
        { name: "Inverted Rows", sets: 1, reps: 10, rest: 60, notes: "Get blood to back muscles", video: "hXTc1mDnZCw" }
      ]},
      { name: "Main Work", exercises: [
        { name: "Pull-ups", sets: 5, reps: "MAX", rest: 120, notes: "Dead hang start, chin over bar, TO FAILURE", video: "eGo4IYlbE5g" },
        { name: "Inverted Rows", sets: 5, reps: "MAX", rest: 90, notes: "Body horizontal, pull chest to bar", video: "hXTc1mDnZCw" },
        { name: "Chin-ups", sets: 4, reps: "MAX", rest: 90, notes: "Palms facing you - bicep emphasis", video: "brhRXlOhsAM" }
      ]},
      { name: "Neck Work", exercises: [
        { name: "Neck Curls (Face Up)", sets: 4, reps: 15, rest: 45, notes: "Chin to chest, head off edge of bed", video: "gA3uw5yk3zU" },
        { name: "Neck Extensions (Face Down)", sets: 4, reps: 15, rest: 45, notes: "Look up, squeeze back of neck", video: "gA3uw5yk3zU" },
        { name: "Isometric Neck Holds", sets: 3, reps: "15 sec × 4 directions", rest: 30, notes: "Push head into hand, resist", video: "gA3uw5yk3zU" }
      ]},
      { name: "Finisher", exercises: [
        { name: "Dead Hang", sets: 1, reps: "Max Time", rest: 0, notes: "Beat your record!", video: "dkOAOjPqaOQ" }
      ]}
    ]}
  },
  Friday: {
    name: "Lower Body Strength",
    am: { title: "Trail Run + Hip Mobility", duration: "30 min", sections: [
      { name: "Cardio", exercises: [
        { name: "Trail Run 1.75 Miles", sets: 1, reps: "Complete", rest: 0, notes: "Push harder today", video: "8Y3MhCNIm0k" }
      ]},
      { name: "Hip Mobility", exercises: [
        { name: "Deep Squat Hold", sets: 2, reps: "90 sec", rest: 30, notes: "Sink as deep as possible", video: "M8xSPpfv2ME" },
        { name: "90/90 Hip Stretch", sets: 1, reps: "45 sec each", rest: 15, notes: "Front leg 90°, back leg 90°", video: "8xF4HzjJxeM" }
      ]}
    ]},
    pm: { title: "LEGS", duration: "50 min", sections: [
      { name: "Warm-Up", exercises: [
        { name: "Leg Swings", sets: 1, reps: "15 each direction", rest: 0, notes: "Each leg", video: "4aoUZEZFJF8" },
        { name: "Bodyweight Squats", sets: 1, reps: 20, rest: 60, notes: "Deep, controlled", video: "aclHkVaku9U" }
      ]},
      { name: "Main Work", exercises: [
        { name: "Bodyweight Squats", sets: 3, reps: "MAX", rest: 90, notes: "Full depth every rep", video: "aclHkVaku9U" },
        { name: "Nordic Curl Negatives", sets: 5, reps: 5, rest: 90, notes: "Fight the lowering", video: "HUXS3S2xSK4" },
        { name: "Bulgarian Split Squats", sets: 4, reps: "15 each", rest: 60, notes: "More reps than Monday", video: "2C-uNgKwPLE" },
        { name: "Box Jumps", sets: 4, reps: 10, rest: 60, notes: "Explode up, soft landing", video: "52r_Ul5k03g" },
        { name: "Single-Leg Calf Raises", sets: 4, reps: "25 each", rest: 30, notes: "15 lb, full range", video: "OeTJ7NHJD7M" }
      ]}
    ]}
  },
  Saturday: {
    name: "Full Body Power",
    am: { title: "Hill Sprints + Prehab", duration: "35 min", sections: [
      { name: "Hill Sprints", exercises: [
        { name: "Warm-up Hill Sprint", sets: 2, reps: "1 sprint", rest: 90, notes: "Walk down for recovery", video: "txsijsUqetI" },
        { name: "MAX EFFORT Hill Sprint", sets: 6, reps: "1 sprint", rest: 120, notes: "FULL SEND", video: "txsijsUqetI" },
        { name: "Cooldown Hill Sprint (80%)", sets: 2, reps: "1 sprint", rest: 90, notes: "Walk down", video: "txsijsUqetI" }
      ]},
      { name: "Prehab", exercises: [
        { name: "External Rotation", sets: 2, reps: "12 each arm", rest: 30, notes: "Shoulder health", video: "WVKb13Oqhg4" },
        { name: "Tibialis Raises", sets: 2, reps: 20, rest: 30, notes: "Shin strength", video: "gNS_QjGAs_k" },
        { name: "Neck Isometrics", sets: 2, reps: "10 sec × 4 directions", rest: 30, notes: "Neck armor", video: "gA3uw5yk3zU" }
      ]}
    ]},
    pm: { title: "FULL BODY", duration: "50 min", sections: [
      { name: "Warm-Up", exercises: [
        { name: "Jumping Jacks", sets: 1, reps: 50, rest: 0, notes: "Full body activation", video: "2W4ZNSwoW_4" },
        { name: "Bodyweight Squats", sets: 1, reps: 20, rest: 60, notes: "Loosen up", video: "aclHkVaku9U" }
      ]},
      { name: "Power", exercises: [
        { name: "Jump Squats", sets: 4, reps: 12, rest: 60, notes: "MAX height", video: "YGGq0AE5Vyk" },
        { name: "Clap Push-ups", sets: 4, reps: 10, rest: 60, notes: "Explode off the ground", video: "EYwWCgM198U" },
        { name: "Mike Tyson Push-ups", sets: 3, reps: 10, rest: 60, notes: "Explosive", video: "WeFGIPR8yxA" },
        { name: "Explosive Pull-ups", sets: 4, reps: 6, rest: 60, notes: "Pull chest to bar FAST", video: "5eSk68SBqMM" }
      ]},
      { name: "Strength", exercises: [
        { name: "Bulgarian Split Squats", sets: 4, reps: "12 each", rest: 60, notes: "15 lb each hand", video: "2C-uNgKwPLE" },
        { name: "Dips", sets: 4, reps: 15, rest: 60, notes: "Full depth", video: "2z8JmcrW-As" },
        { name: "Pull-ups", sets: 4, reps: "MAX", rest: 90, notes: "Full range", video: "eGo4IYlbE5g" }
      ]}
    ]}
  },
  Sunday: {
    name: "Active Recovery",
    am: { title: "Walk + Light Stretch", duration: "30 min", sections: [
      { name: "Easy Movement", exercises: [
        { name: "Walk Your Trail", sets: 1, reps: "20 min", rest: 0, notes: "Conversation pace, nasal breathing", video: "8Y3MhCNIm0k" }
      ]},
      { name: "Light Stretch", exercises: [
        { name: "Deep Squat Hold", sets: 1, reps: "90 sec", rest: 15, notes: "Sink and relax", video: "M8xSPpfv2ME" },
        { name: "Lying Hamstring Stretch", sets: 1, reps: "60 sec each", rest: 15, notes: "Use towel if needed", video: "FDwpEdxZ4H4" },
        { name: "Doorway Chest Stretch", sets: 1, reps: "45 sec each arm", rest: 0, notes: "Open up chest", video: "WUdMILZ55S4" }
      ]}
    ]},
    pm: { title: "REST", duration: "—", sections: [
      { name: "Recovery", exercises: [
        { name: "Complete Rest", sets: 1, reps: "—", rest: 0, notes: "Sleep well. Recover fully.", video: null }
      ]}
    ]}
  }
};

// ============================================================================
// DEFAULT STRETCH DATA — used if no text file imported
// ============================================================================

const STRETCH_DATA = [
  { id: 1, bodyPart: "Neck", muscles: "Trapezius, Sternocleidomastoid, Scalenes", stretches: [
    { name: "Neck Side Stretch", duration: "30 sec each side", video: "wQylqaCl8Zc", notes: "Ear to shoulder, gentle pull" },
    { name: "Neck Forward Stretch", duration: "30 sec", video: "wQylqaCl8Zc", notes: "Chin to chest, hands behind head" },
    { name: "Neck Rotation", duration: "30 sec each side", video: "wQylqaCl8Zc", notes: "Look over shoulder, gentle" }
  ]},
  { id: 2, bodyPart: "Shoulders", muscles: "Deltoids, Rotator Cuff", stretches: [
    { name: "Cross-Body Shoulder Stretch", duration: "30 sec each arm", video: "Jxz7S1gDiXs", notes: "Pull arm across chest" },
    { name: "Doorway Chest/Shoulder Stretch", duration: "45 sec each arm", video: "WUdMILZ55S4", notes: "Arm on frame, lean through" },
    { name: "Behind Back Shoulder Stretch", duration: "30 sec each arm", video: "A-F1LMmYe5Q", notes: "Reach up behind back" }
  ]},
  { id: 3, bodyPart: "Chest", muscles: "Pectoralis Major & Minor", stretches: [
    { name: "Doorway Chest Stretch", duration: "45 sec each side", video: "WUdMILZ55S4", notes: "Elbow at 90°, lean forward" },
    { name: "Floor Chest Opener", duration: "60 sec", video: "9pON5i7DP0Q", notes: "Lie face down, arms out in T" }
  ]},
  { id: 4, bodyPart: "Upper Back", muscles: "Rhomboids, Lats, Traps", stretches: [
    { name: "Cat Stretch", duration: "30 sec", video: "kqnua4rHVVA", notes: "Round back up, tuck chin" },
    { name: "Child's Pose with Reach", duration: "60 sec", video: "2JfBwFUA9y4", notes: "Walk hands forward, sink hips" },
    { name: "Lat Stretch on Wall", duration: "30 sec each side", video: "RWDL68jHCvE", notes: "Arm on wall, lean away" }
  ]},
  { id: 5, bodyPart: "Lower Back", muscles: "Erector Spinae, QL", stretches: [
    { name: "Knees to Chest", duration: "45 sec", video: "DqRGodMPxdg", notes: "Hug both knees, rock gently" },
    { name: "Supine Twist", duration: "45 sec each side", video: "2tM_W8sPtOs", notes: "Knees fall to one side" },
    { name: "Cat-Cow", duration: "10 reps slow", video: "kqnua4rHVVA", notes: "Alternate arch and round" }
  ]},
  { id: 6, bodyPart: "Hip Flexors", muscles: "Iliopsoas, Rectus Femoris", stretches: [
    { name: "Kneeling Hip Flexor Stretch", duration: "60 sec each side", video: "UWIYsL5ewug", notes: "Back knee down, squeeze glute" },
    { name: "Couch Stretch", duration: "60 sec each side", video: "MU07BCmGXuA", notes: "Back foot on wall/couch" }
  ]},
  { id: 7, bodyPart: "Glutes", muscles: "Glute Max/Med/Min, Piriformis", stretches: [
    { name: "Pigeon Pose", duration: "60 sec each side", video: "SzfFkrRWyMQ", notes: "Front shin across, back leg extended" },
    { name: "Figure 4 Stretch", duration: "45 sec each side", video: "Y2S0fPPFRkU", notes: "Ankle on knee, pull thigh" },
    { name: "Seated Glute Stretch", duration: "45 sec each side", video: "mI_jPKJhtxU", notes: "Cross leg over, twist toward knee" }
  ]},
  { id: 8, bodyPart: "Groin", muscles: "Adductor Magnus/Longus/Brevis", stretches: [
    { name: "Butterfly Stretch", duration: "60 sec", video: "3vkFbL2gDG8", notes: "Soles together, press knees down" },
    { name: "Frog Stretch", duration: "60 sec", video: "4Oco8R0XBUY", notes: "Knees wide, sink hips" },
    { name: "Side Lunge Stretch", duration: "45 sec each side", video: "_wyPwiGDYec", notes: "Shift weight, other leg straight" }
  ]},
  { id: 9, bodyPart: "Quadriceps", muscles: "Rectus Femoris, Vastus group", stretches: [
    { name: "Standing Quad Stretch", duration: "45 sec each leg", video: "R3u6_eFk_Lo", notes: "Pull heel to glute" },
    { name: "Lying Quad Stretch", duration: "60 sec each leg", video: "YUg89eeSfag", notes: "Side-lying, pull heel back" },
    { name: "Couch Stretch", duration: "60 sec each side", video: "MU07BCmGXuA", notes: "Also hits hip flexors" }
  ]},
  { id: 10, bodyPart: "Hamstrings", muscles: "Biceps Femoris, Semi-T/M", stretches: [
    { name: "Standing Hamstring Stretch", duration: "45 sec each leg", video: "Ya-h4vVtbwg", notes: "Heel elevated, hinge forward" },
    { name: "Lying Hamstring Stretch", duration: "60 sec each leg", video: "FDwpEdxZ4H4", notes: "Use strap, leg toward ceiling" },
    { name: "Seated Forward Fold", duration: "60 sec", video: "GZcSJg4k0Ec", notes: "Legs extended, reach for toes" }
  ]},
  { id: 11, bodyPart: "Calves", muscles: "Gastrocnemius, Soleus", stretches: [
    { name: "Wall Calf Stretch", duration: "45 sec each leg", video: "5-NPJrr_C1I", notes: "Hands on wall, back leg straight" },
    { name: "Bent Knee Calf Stretch", duration: "30 sec each leg", video: "5-NPJrr_C1I", notes: "Bend back knee for soleus" },
    { name: "Step Drop Stretch", duration: "30 sec each leg", video: "gwbcI1xbsZM", notes: "Heel hanging off step" }
  ]},
  { id: 12, bodyPart: "Ankles & Feet", muscles: "Tibialis, Peroneals, Plantar Fascia", stretches: [
    { name: "Ankle Circles", duration: "20 each direction, each foot", video: "S9xxdAewpCk", notes: "Full range of motion" },
    { name: "Top of Foot Stretch", duration: "30 sec each foot", video: "kH6yvrz-yaM", notes: "Point toe, press top into floor" },
    { name: "Toe Splay", duration: "30 sec", video: "sON7Lk0x1iE", notes: "Spread toes wide, hold" },
    { name: "Big Toe Stretch", duration: "30 sec each foot", video: "adbbCKNj1IM", notes: "Pull big toe up and back" }
  ]}
];

// ============================================================================
// STAPLES & UTILITIES
// ============================================================================

const DAILY_STAPLES = [
  { id: 'yogurt',   name: 'Greek Yogurt + Go Raw Pumpkin Seeds', cal: 180, pro: 8 },
  { id: 'collagen', name: 'Vital Proteins Collagen',             cal: 70,  pro: 18 },
  { id: 'shake',    name: 'Factor Protein Shake',                cal: 210, pro: 32 },
  { id: 'bar',      name: "Honey Mama's Protein Bar",            cal: 260, pro: 13 },
];

const parseNum = (s) => parseFloat(s) || 0;
const parseMealMacros = (n) => ({ cal: Math.round(parseNum(n?.Calories)), pro: Math.round(parseNum(n?.Protein)) });
const todayStr = () => new Date().toISOString().split('T')[0];
const fmtTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
const fmtDate = (d) => new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});

const safeJson = (str, fb) => {
  if (str == null) return fb;
  try { const r = JSON.parse(str); return r != null ? r : fb; } catch { return fb; }
};

const playBeep = () => {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.frequency.value = 800; o.type = 'sine';
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.5);
    o.start(c.currentTime); o.stop(c.currentTime + 0.5);
  } catch {}
};

const parseVideoRef = (str) => {
  if (!str) return null;
  str = str.trim();
  if (/^[\w-]{10,12}$/.test(str)) return str;
  const m = str.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]+)/);
  if (m) return m[1];
  if (/^https?:\/\//i.test(str)) return str;
  return str;
};

const isYtId = (v) => v && /^[\w-]{10,12}$/.test(v);

// ============================================================================
// WORKOUT TEXT PARSER
// ============================================================================

function parseWorkoutText(text) {
  const data = {};
  let curDay = null, curSess = null, curSec = null;
  for (const raw of text.split('\n')) {
    const ln = raw.trim();
    if (!ln || ln.startsWith('//')) continue;
    if (ln.startsWith('# ') && !ln.startsWith('## ') && !ln.startsWith('### ')) {
      const p = ln.slice(2).split('|').map(s => s.trim());
      const key = p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase();
      curDay = { name: p[1] || key, am: null, pm: null };
      data[key] = curDay; curSess = null; curSec = null;
    } else if (ln.startsWith('## ') && !ln.startsWith('### ')) {
      if (!curDay) continue;
      const p = ln.slice(3).split('|').map(s => s.trim());
      const t = p[0].toLowerCase();
      curSess = { title: p[1] || t.toUpperCase(), duration: p[2] || '', sections: [] };
      curDay[t] = curSess; curSec = null;
    } else if (ln.startsWith('### ')) {
      if (!curSess) continue;
      curSec = { name: ln.slice(4).trim(), exercises: [] };
      curSess.sections.push(curSec);
    } else if (ln.startsWith('- ')) {
      if (!curSec) continue;
      const parts = ln.slice(2).split('|').map(s => s.trim());
      const ex = { name: parts[0], sets: 1, reps: '—', rest: 0, notes: '', video: null };
      const notes = [];
      for (let i = 1; i < parts.length; i++) {
        const p = parts[i];
        if (/^\d+\s*x\s*.+/i.test(p)) {
          const m = p.match(/^(\d+)\s*x\s*(.+)/i);
          if (m) { ex.sets = parseInt(m[1]); ex.reps = m[2].trim(); }
        } else if (/^rest:\s*\d+/i.test(p)) {
          ex.rest = parseInt(p.replace(/^rest:\s*/i, ''));
        } else if (/^video:\s*.+/i.test(p)) {
          ex.video = parseVideoRef(p.replace(/^video:\s*/i, ''));
        } else { notes.push(p); }
      }
      ex.notes = notes.join(', ');
      curSec.exercises.push(ex);
    }
  }
  return data;
}

// ============================================================================
// STRETCH TEXT PARSER
// ============================================================================

function parseStretchText(text) {
  const data = [];
  let curPart = null;
  for (const raw of text.split('\n')) {
    const ln = raw.trim();
    if (!ln || ln.startsWith('//')) continue;
    if (ln.startsWith('# ') && !ln.startsWith('## ')) {
      const p = ln.slice(2).split('|').map(s => s.trim());
      curPart = { id: data.length + 1, bodyPart: p[0], muscles: p[1] || '', stretches: [] };
      data.push(curPart);
    } else if (ln.startsWith('- ')) {
      if (!curPart) continue;
      const parts = ln.slice(2).split('|').map(s => s.trim());
      const str = { name: parts[0], duration: '', notes: '', video: null };
      const noteParts = [];
      for (let i = 1; i < parts.length; i++) {
        const p = parts[i];
        if (/^video:\s*.+/i.test(p)) {
          str.video = parseVideoRef(p.replace(/^video:\s*/i, ''));
        } else if (!str.duration && (/\d+\s*(sec|min|rep)/i.test(p) || /each/i.test(p))) {
          str.duration = p;
        } else {
          noteParts.push(p);
        }
      }
      str.notes = noteParts.join(', ');
      curPart.stretches.push(str);
    }
  }
  return data;
}

// ============================================================================
// MINI CHART
// ============================================================================

function MiniChart({ data, label, unit, color }) {
  if (!data || data.length < 2) return (
    <div style={S.chartWrap}><span style={S.chartLabel}>{label}</span><div style={S.chartEmpty}>Need 2+ entries</div></div>
  );
  const W=320,H=130,pad={t:15,r:10,b:28,l:42},pw=W-pad.l-pad.r,ph=H-pad.t-pad.b;
  const vals=data.map(d=>d.v),mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const pts=data.map((d,i)=>({x:pad.l+(data.length===1?pw/2:(i/(data.length-1))*pw),y:pad.t+ph-((d.v-mn)/rng)*ph,...d}));
  const line=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return (
    <div style={S.chartWrap}><span style={S.chartLabel}>{label}</span>
      <svg viewBox={`0 0 ${W} ${H}`} style={S.chartSvg}>
        {[0,.5,1].map(f=>{const y=pad.t+(1-f)*ph;return(<g key={f}><line x1={pad.l} y1={y} x2={W-pad.r} y2={y} stroke="#2C2C2C"/><text x={pad.l-6} y={y+3} fill="#666" fontSize="9" textAnchor="end">{(mn+f*rng).toFixed(0)}{unit}</text></g>);})}
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="#000" strokeWidth="1.5"/>)}
        {pts.length>0&&<><text x={pts[0].x} y={H-5} fill="#666" fontSize="8" textAnchor="start">{fmtDate(pts[0].date)}</text>{pts.length>1&&<text x={pts[pts.length-1].x} y={H-5} fill="#666" fontSize="8" textAnchor="end">{fmtDate(pts[pts.length-1].date)}</text>}</>}
      </svg>
    </div>
  );
}

// ============================================================================
// VIDEO RENDER HELPERS
// ============================================================================

function VideoEmbed({ video, title }) {
  if (!video) return null;
  if (isYtId(video)) return (
    <div style={S.videoWrap}>
      <iframe src={`https://www.youtube.com/embed/${video}?rel=0&modestbranding=1`} style={S.video} allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen title={title}/>
    </div>
  );
  return (
    <a href={video} target="_blank" rel="noopener noreferrer" style={S.extVideoBtn}>
      ▶ Watch Demo Video
    </a>
  );
}

function VideoLink({ video }) {
  if (!video) return null;
  const href = isYtId(video) ? `https://www.youtube.com/watch?v=${video}` : video;
  return <a href={href} target="_blank" rel="noopener noreferrer" style={S.vidLink}>▶</a>;
}

// ============================================================================
// ICONS
// ============================================================================

const ScriptIcon=({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#BDC3C7':'#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>;
const ShopIcon=({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#BDC3C7':'#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const FuelIcon=({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#BDC3C7':'#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 6v6l4 2"/></svg>;
const StretchIcon=({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#BDC3C7':'#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v10"/><path d="M8 21l4-4 4 4"/></svg>;
const ProgressIcon=({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#BDC3C7':'#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

// ============================================================================
// MAIN APP
// ============================================================================

export default function PantherApp() {
  const [tab, setTab] = useState('script');

  // Workout data (parsed from text or default)
  const [workoutData, setWorkoutData] = useState(DEFAULT_WORKOUT);
  const [routineSource, setRoutineSource] = useState('default');

  // Stretch data (importable)
  const [stretchData, setStretchData] = useState(STRETCH_DATA);
  const [stretchSource, setStretchSource] = useState('default');

  // Script tab
  const [scriptSession, setScriptSession] = useState(()=>new Date().getHours()<14?'am':'pm');

  // Workout runner (step-through mode)
  const [wkActive, setWkActive] = useState(false);
  const [wkDay, setWkDay] = useState(null);
  const [wkSession, setWkSession] = useState(null);
  const [wkSecIdx, setWkSecIdx] = useState(0);
  const [wkExIdx, setWkExIdx] = useState(0);
  const [wkSet, setWkSet] = useState(1);
  const [wkResting, setWkResting] = useState(false);
  const [wkRestTime, setWkRestTime] = useState(0);
  const [wkDone, setWkDone] = useState(0);
  const [wkTotal, setWkTotal] = useState(0);
  const [showResume, setShowResume] = useState(false);

  // Stretch mode
  const [stretchOn, setStretchOn] = useState(false);
  const [strPartIdx, setStrPartIdx] = useState(0);
  const [strIdx, setStrIdx] = useState(0);

  // Shop
  const [factorMeals, setFactorMeals] = useState(()=>safeJson(localStorage.getItem('p_factor_meals'),null));
  const [hfMeals, setHfMeals] = useState(()=>safeJson(localStorage.getItem('p_hf_meals'),null));
  const [factorSel, setFactorSel] = useState(()=>safeJson(localStorage.getItem('p_factor_sel'),[]));
  const [hfSel, setHfSel] = useState(()=>safeJson(localStorage.getItem('p_hf_sel'),[]));
  const [shopSearch, setShopSearch] = useState('');
  const [shopSection, setShopSection] = useState('factor');
  const [showImport, setShowImport] = useState(null);
  const [importText, setImportText] = useState('');

  // Fuel
  const [fuelDate, setFuelDate] = useState(todayStr);
  const [fuelChecks, setFuelChecks] = useState({});

  // Progress / Gains
  const [gainsLog, setGainsLog] = useState(()=>safeJson(localStorage.getItem('p_gains'),[]));
  const [gForm, setGForm] = useState({bodyweight:'',puWeight:'',puReps:'',puSets:'',hangEdge:'',hangWeight:'',hangTime:''});
  const [workoutHistory, setWorkoutHistory] = useState(()=>safeJson(localStorage.getItem('p_history'),[]));
  const [currentStreak, setCurrentStreak] = useState(0);
  const [progView, setProgView] = useState('overview');

  // Import modals
  const [showRoutineImport, setShowRoutineImport] = useState(false);
  const [routineText, setRoutineText] = useState('');
  const [showStretchImport, setShowStretchImport] = useState(false);
  const [stretchText, setStretchText] = useState('');

  const wakeLockRef = useRef(null);
  const today = DAYS[new Date().getDay()];
  const dayData = workoutData[today] || DEFAULT_WORKOUT[today];

  // ---- Load saved workout routine ----
  useEffect(() => {
    const saved = localStorage.getItem('p_workout_text');
    if (saved) {
      try {
        const parsed = parseWorkoutText(saved);
        if (Object.keys(parsed).length > 0) { setWorkoutData(parsed); setRoutineSource('imported'); }
      } catch {}
    }
  }, []);

  // ---- Load saved stretch routine ----
  useEffect(() => {
    const saved = localStorage.getItem('p_stretch_text');
    if (saved) {
      try {
        const parsed = parseStretchText(saved);
        if (parsed.length > 0) { setStretchData(parsed); setStretchSource('imported'); }
      } catch {}
    }
  }, []);

  // ---- Load fuel ----
  useEffect(() => { setFuelChecks(safeJson(localStorage.getItem(`p_fuel_${fuelDate}`),{})); }, [fuelDate]);

  // ---- Persist shop ----
  useEffect(()=>{if(factorMeals)localStorage.setItem('p_factor_meals',JSON.stringify(factorMeals));},[factorMeals]);
  useEffect(()=>{if(hfMeals)localStorage.setItem('p_hf_meals',JSON.stringify(hfMeals));},[hfMeals]);
  useEffect(()=>{localStorage.setItem('p_factor_sel',JSON.stringify(factorSel));},[factorSel]);
  useEffect(()=>{localStorage.setItem('p_hf_sel',JSON.stringify(hfSel));},[hfSel]);

  // ---- Auto-fetch meal data from GitHub Actions ----
  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/panther/';
    if (!factorMeals) {
      fetch(`${base}data/factor_week.json`).then(r=>r.ok?r.json():null).then(d=>{
        if(d?.meals?.length){
          const meals=d.meals.map(m=>({name:m.meal||m.name||'Unknown',headline:m.headline||'',...parseMealMacros(m.nutrition),category:(typeof m.category==='object'?m.category?.name:m.category)||'',type:m.meal_type||'Meal'}));
          setFactorMeals({week:d.week||'',scraped:d.scraped_on||'',meals});
        }
      }).catch(()=>{});
    }
    if (!hfMeals) {
      fetch(`${base}data/hellofresh_week.json`).then(r=>r.ok?r.json():null).then(d=>{
        if(d?.meals?.length){
          const meals=d.meals.map(m=>({name:m.meal||m.name||'Unknown',headline:m.headline||'',...parseMealMacros(m.nutrition),category:(typeof m.category==='object'?m.category?.name:m.category)||'',type:m.meal_type||'Meal'}));
          setHfMeals({week:d.week||'',scraped:d.scraped_on||'',meals});
        }
      }).catch(()=>{});
    }
  }, []);

  // ---- Streak calc ----
  useEffect(() => {
    const h = safeJson(localStorage.getItem('p_history'),[]);
    let s=0; const t=new Date(); t.setHours(0,0,0,0);
    for(let i=0;i<365;i++){const d=new Date(t);d.setDate(d.getDate()-i);const ds=d.toISOString().split('T')[0];const has=h.some(w=>w.date===ds);if(has||i===0){if(has)s++;}else break;}
    setCurrentStreak(s);
  }, [workoutHistory]);

  // ---- Workout runner rest timer ----
  useEffect(() => {
    if (!wkResting || wkRestTime <= 0) return;
    const t = setTimeout(() => {
      setWkRestTime(r => { if (r <= 1) { playBeep(); setWkResting(false); return 0; } return r - 1; });
    }, 1000);
    return () => clearTimeout(t);
  }, [wkResting, wkRestTime]);

  // ---- Resume check ----
  useEffect(() => {
    const s = localStorage.getItem('p_workout_state');
    if (s) { try { const p=JSON.parse(s); if(new Date(p.date).toDateString()===new Date().toDateString()&&p.active) setShowResume(true); else localStorage.removeItem('p_workout_state'); } catch { localStorage.removeItem('p_workout_state'); }}
  }, []);

  // ---- Save workout runner state ----
  useEffect(() => {
    if (wkActive) localStorage.setItem('p_workout_state', JSON.stringify({active:true,day:wkDay,session:wkSession,secIdx:wkSecIdx,exIdx:wkExIdx,set:wkSet,done:wkDone,date:new Date().toISOString()}));
  }, [wkActive,wkSecIdx,wkExIdx,wkSet,wkDone]);

  // ---- Wake lock ----
  useEffect(() => {
    const acq=async()=>{if((wkActive||stretchOn)&&'wakeLock' in navigator){try{wakeLockRef.current=await navigator.wakeLock.request('screen');}catch{}}};
    const rel=async()=>{if(wakeLockRef.current){try{await wakeLockRef.current.release();wakeLockRef.current=null;}catch{}}};
    if(wkActive||stretchOn)acq();else rel(); return ()=>rel();
  }, [wkActive, stretchOn]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const h=(e)=>{
      if(stretchOn){if(e.code==='Space'){e.preventDefault();nextStretch();}else if(e.code==='Escape'){e.preventDefault();exitStretch();}return;}
      if(!wkActive)return;
      if(e.code==='Space'){e.preventDefault();if(wkResting)skipWkRest();else completeWkSet();}
      else if(e.code==='Escape'){e.preventDefault();exitWorkout();}
    };
    window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);
  }, [wkActive,wkResting,stretchOn,strPartIdx,strIdx]);

  // ---- Workout runner helpers ----
  const getWkSessionData = () => {
    if (!wkDay || !wkSession) return null;
    const d = workoutData[wkDay] || DEFAULT_WORKOUT[wkDay];
    return d ? d[wkSession] : null;
  };
  const getWkExercise = () => { const sd=getWkSessionData(); if(!sd)return null; const sec=sd.sections[wkSecIdx]; return sec?sec.exercises[wkExIdx]:null; };
  const getWkSection = () => { const sd=getWkSessionData(); return sd?sd.sections[wkSecIdx]:null; };

  const startWorkout = (day, session) => {
    const d = workoutData[day] || DEFAULT_WORKOUT[day];
    const sd = d[session];
    let total=0; sd.sections.forEach(s=>{total+=s.exercises.length;});
    setWkDay(day); setWkSession(session); setWkSecIdx(0); setWkExIdx(0); setWkSet(1); setWkResting(false); setWkRestTime(0); setWkDone(0); setWkTotal(total); setWkActive(true); setShowResume(false);
  };

  const resumeWorkout = () => {
    const s=JSON.parse(localStorage.getItem('p_workout_state'));
    setWkDay(s.day);setWkSession(s.session);setWkSecIdx(s.secIdx);setWkExIdx(s.exIdx);setWkSet(s.set);setWkDone(s.done);
    const d=workoutData[s.day]||DEFAULT_WORKOUT[s.day];const sd=d[s.session];let t=0;sd.sections.forEach(sec=>{t+=sec.exercises.length;});setWkTotal(t);
    setWkResting(false);setWkRestTime(0);setWkActive(true);setShowResume(false);
  };

  const completeWkSet = () => {
    const ex=getWkExercise(); if(!ex)return;
    if(wkSet<ex.sets){setWkSet(wkSet+1);if(ex.rest>0){setWkResting(true);setWkRestTime(ex.rest);}}
    else nextWkExercise();
  };

  const nextWkExercise = () => {
    const sd=getWkSessionData(); const sec=getWkSection();
    setWkDone(d=>d+1);
    if(wkExIdx<sec.exercises.length-1){setWkExIdx(wkExIdx+1);setWkSet(1);}
    else if(wkSecIdx<sd.sections.length-1){setWkSecIdx(wkSecIdx+1);setWkExIdx(0);setWkSet(1);}
    else finishWorkout();
  };

  const prevWkExercise = () => {
    const sd=getWkSessionData();
    if(wkExIdx>0){setWkExIdx(wkExIdx-1);const sec=sd.sections[wkSecIdx];setWkSet(sec.exercises[wkExIdx-1]?.sets||1);setWkDone(d=>Math.max(0,d-1));}
    else if(wkSecIdx>0){const ps=sd.sections[wkSecIdx-1];setWkSecIdx(wkSecIdx-1);setWkExIdx(ps.exercises.length-1);setWkSet(ps.exercises[ps.exercises.length-1]?.sets||1);setWkDone(d=>Math.max(0,d-1));}
  };

  const skipWkRest = () => { setWkResting(false); setWkRestTime(0); };

  const finishWorkout = () => {
    const entry={date:todayStr(),day:wkDay,session:wkSession,title:getWkSessionData()?.title||'',completedAt:new Date().toISOString()};
    const h=[entry,...workoutHistory].slice(0,100);
    setWorkoutHistory(h);localStorage.setItem('p_history',JSON.stringify(h));
    exitWorkout();
  };

  const exitWorkout = () => {
    setWkActive(false);setWkDay(null);setWkSession(null);setWkSecIdx(0);setWkExIdx(0);setWkSet(1);setWkResting(false);setWkRestTime(0);setWkDone(0);
    localStorage.removeItem('p_workout_state');
  };

  // ---- Stretch helpers ----
  const nextStretch = () => {
    const p=stretchData[strPartIdx];
    if(strIdx<p.stretches.length-1)setStrIdx(strIdx+1);
    else if(strPartIdx<stretchData.length-1){setStrPartIdx(strPartIdx+1);setStrIdx(0);}
    else exitStretch();
  };
  const prevStretch = () => {
    if(strIdx>0)setStrIdx(strIdx-1);
    else if(strPartIdx>0){const pp=stretchData[strPartIdx-1];setStrPartIdx(strPartIdx-1);setStrIdx(pp.stretches.length-1);}
  };
  const exitStretch = () => { setStretchOn(false); setStrPartIdx(0); setStrIdx(0); };

  // ---- Shop helpers ----
  const importMeals = (brand) => {
    let raw; try{raw=JSON.parse(importText);}catch{alert('Invalid JSON');return;}
    const meals=(raw.meals||[]).map(m=>({name:m.meal||m.name||'Unknown',headline:m.headline||'',...parseMealMacros(m.nutrition),category:(typeof m.category==='object'?m.category?.name:m.category)||'',type:m.meal_type||'Meal'}));
    if(!meals.length){alert('No meals found');return;}
    const data={week:raw.week||'',scraped:raw.scraped_on||'',meals};
    if(brand==='factor'){setFactorMeals(data);setFactorSel([]);}else{setHfMeals(data);setHfSel([]);}
    setImportText('');setShowImport(null);
  };
  const handleFileImport = (brand,file) => {
    const r=new FileReader();r.onload=(e)=>{let raw;try{raw=JSON.parse(e.target.result);}catch{alert('Invalid JSON');return;}
    const meals=(raw.meals||[]).map(m=>({name:m.meal||m.name||'Unknown',headline:m.headline||'',...parseMealMacros(m.nutrition),category:(typeof m.category==='object'?m.category?.name:m.category)||'',type:m.meal_type||'Meal'}));
    if(!meals.length){alert('No meals found');return;}const data={week:raw.week||'',scraped:raw.scraped_on||'',meals};
    if(brand==='factor'){setFactorMeals(data);setFactorSel([]);}else{setHfMeals(data);setHfSel([]);}};r.readAsText(file);
  };
  const toggleShopSel = (brand,idx) => {
    if(brand==='factor')setFactorSel(p=>p.includes(idx)?p.filter(i=>i!==idx):p.length<7?[...p,idx]:p);
    else setHfSel(p=>p.includes(idx)?p.filter(i=>i!==idx):p.length<7?[...p,idx]:p);
  };

  // ---- Fuel helpers ----
  const toggleFuel = (key) => { setFuelChecks(p=>{const n={...p,[key]:!p[key]};localStorage.setItem(`p_fuel_${fuelDate}`,JSON.stringify(n));return n;}); };
  const shiftFuelDate = (d) => { const dt=new Date(fuelDate+'T12:00:00');dt.setDate(dt.getDate()+d);setFuelDate(dt.toISOString().split('T')[0]); };
  const getSelectedMeals = (brand) => { const src=brand==='factor'?factorMeals:hfMeals,sel=brand==='factor'?factorSel:hfSel; if(!src)return[]; return sel.map(i=>src.meals[i]).filter(Boolean); };
  const fuelTotal = (()=>{ let c=0,p=0; DAILY_STAPLES.forEach(s=>{if(fuelChecks[`s_${s.id}`]){c+=s.cal;p+=s.pro;}}); getSelectedMeals('factor').forEach((m,i)=>{if(fuelChecks[`f_${i}`]){c+=m.cal;p+=m.pro;}}); getSelectedMeals('hf').forEach((m,i)=>{if(fuelChecks[`h_${i}`]){c+=m.cal;p+=m.pro;}}); return{cal:c,pro:p}; })();

  // ---- Progress / Gains helpers ----
  const logGains = () => {
    const e={date:todayStr(),bodyweight:parseFloat(gForm.bodyweight)||null,pullup:(gForm.puWeight||gForm.puReps)?{weight:parseFloat(gForm.puWeight)||0,reps:parseInt(gForm.puReps)||0,sets:parseInt(gForm.puSets)||1}:null,hang:(gForm.hangEdge||gForm.hangTime)?{edge:parseFloat(gForm.hangEdge)||0,weight:parseFloat(gForm.hangWeight)||0,time:parseFloat(gForm.hangTime)||0}:null};
    if(!e.bodyweight&&!e.pullup&&!e.hang)return;
    const n=[e,...gainsLog].slice(0,500);setGainsLog(n);localStorage.setItem('p_gains',JSON.stringify(n));
    setGForm({bodyweight:'',puWeight:'',puReps:'',puSets:'',hangEdge:'',hangWeight:'',hangTime:''});
  };

  // ---- Routine import ----
  const importRoutine = (text) => {
    const parsed = parseWorkoutText(text);
    if (Object.keys(parsed).length === 0) { alert('Could not parse any workout days. Check the format.'); return; }
    setWorkoutData(parsed); setRoutineSource('imported');
    localStorage.setItem('p_workout_text', text);
    setShowRoutineImport(false); setRoutineText('');
  };
  const handleRoutineFile = (file) => { const r=new FileReader();r.onload=(e)=>importRoutine(e.target.result);r.readAsText(file); };
  const resetRoutine = () => { setWorkoutData(DEFAULT_WORKOUT); setRoutineSource('default'); localStorage.removeItem('p_workout_text'); };

  // ---- Stretch import ----
  const importStretch = (text) => {
    const parsed = parseStretchText(text);
    if (parsed.length === 0) { alert('Could not parse any body parts. Check the format.'); return; }
    setStretchData(parsed); setStretchSource('imported');
    localStorage.setItem('p_stretch_text', text);
    setShowStretchImport(false); setStretchText('');
  };
  const handleStretchFile = (file) => { const r=new FileReader();r.onload=(e)=>importStretch(e.target.result);r.readAsText(file); };
  const resetStretch = () => { setStretchData(STRETCH_DATA); setStretchSource('default'); localStorage.removeItem('p_stretch_text'); };

  // ============================================================================
  // WORKOUT RUNNER (full-screen step-through)
  // ============================================================================

  if (showResume) return (
    <div style={S.container}><div style={S.center}>
      <h1 style={{fontSize:24,fontWeight:700,marginBottom:12}}>CONTINUE?</h1>
      <p style={{fontSize:15,color:'#888',marginBottom:32}}>Unfinished workout from today</p>
      <div style={{display:'flex',flexDirection:'column',gap:12,width:'100%',maxWidth:280}}>
        <button onClick={resumeWorkout} style={S.primaryBtn}>RESUME</button>
        <button onClick={()=>{localStorage.removeItem('p_workout_state');setShowResume(false);}} style={S.secondaryBtn}>Start Fresh</button>
      </div>
    </div></div>
  );

  if (wkActive) {
    const sd = getWkSessionData();
    const ex = getWkExercise();
    const sec = getWkSection();

    if (!ex) return (
      <div style={S.container}><div style={S.center}>
        <div style={{width:70,height:70,borderRadius:'50%',background:'linear-gradient(145deg,#6B7D8E,#4D5D6E)',color:'#ECF0F1',fontSize:36,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>✓</div>
        <h1 style={{fontSize:26,fontWeight:700,margin:'0 0 8px'}}>DONE</h1>
        <p style={{fontSize:15,color:'#888',margin:'0 0 8px'}}>Workout logged. Rest and recover.</p>
        <p style={{fontSize:18,color:'#95A5A6',margin:'0 0 24px'}}>🔥 {currentStreak} day streak</p>
        <button onClick={exitWorkout} style={S.primaryBtn}>BACK</button>
      </div></div>
    );

    if (wkResting) return (
      <div style={S.container}><div style={S.center}>
        <p style={{fontSize:13,letterSpacing:4,color:'#666',margin:'0 0 12px'}}>REST</p>
        <div style={{fontSize:64,fontWeight:700,color:'#BDC3C7',fontFamily:'monospace',margin:'0 0 12px'}}>{fmtTime(wkRestTime)}</div>
        <p style={{fontSize:14,color:'#888',marginBottom:24}}>Next: Set {wkSet}/{ex.sets}</p>
        <button onClick={skipWkRest} style={S.secondaryBtn}>SKIP</button>
      </div></div>
    );

    const canBack = wkSecIdx > 0 || wkExIdx > 0;
    return (
      <div style={S.container}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          <button onClick={exitWorkout} style={S.exitBtn}>✕</button>
          <div style={{flex:1}}><div style={S.progressBar}><div style={{...S.progressFill,width:`${(wkDone/wkTotal)*100}%`}}/></div></div>
        </div>
        <p style={S.sectionTag}>{sec?.name}</p>
        <div style={{textAlign:'center',marginBottom:16}}>
          <h1 style={{fontSize:20,fontWeight:700,margin:'0 0 16px',lineHeight:1.3}}>{ex.name}</h1>
          <div style={{display:'flex',justifyContent:'center',gap:16,marginBottom:12}}>
            <div style={S.statBox}><span style={S.statLabel}>SET</span><span style={S.statVal}>{wkSet}/{ex.sets}</span></div>
            <div style={S.statBox}><span style={S.statLabel}>REPS</span><span style={{...S.statVal,color:'#fff'}}>{ex.reps}</span></div>
          </div>
          {ex.notes&&<p style={S.notes}>{ex.notes}</p>}
        </div>
        <VideoEmbed video={ex.video} title={ex.name}/>
        <div style={{display:'flex',gap:12,marginTop:'auto'}}>
          <button onClick={prevWkExercise} style={{...S.navBtn,opacity:canBack?1:0.3}} disabled={!canBack}>← PREV</button>
          <button onClick={completeWkSet} style={S.primaryBtn}>{wkSet<ex.sets?`DONE SET ${wkSet}`:'NEXT →'}</button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STRETCH MODE (full-screen step-through)
  // ============================================================================

  if (stretchOn) {
    const part=stretchData[strPartIdx],str=part.stretches[strIdx];
    let totalS=0,doneS=0;stretchData.forEach((p,pi)=>p.stretches.forEach((_,si)=>{totalS++;if(pi<strPartIdx||(pi===strPartIdx&&si<strIdx))doneS++;}));
    return (
      <div style={S.container}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          <button onClick={exitStretch} style={S.exitBtn}>✕</button>
          <div style={{flex:1}}><div style={{fontSize:11,color:'#666',marginBottom:4}}>{doneS+1}/{totalS}</div><div style={S.progressBar}><div style={{...S.progressFill,width:`${((doneS+1)/totalS)*100}%`}}/></div></div>
        </div>
        <div style={{backgroundColor:'#1A1A1A',borderRadius:16,padding:20,textAlign:'center',marginBottom:16,border:'2px solid #5D6D7E'}}>
          <div style={{fontSize:11,color:'#666',letterSpacing:2}}>{strPartIdx+1}/{stretchData.length}</div>
          <h2 style={{fontSize:24,fontWeight:800,color:'#BDC3C7',margin:'4px 0'}}>{part.bodyPart}</h2>
          <p style={{fontSize:12,color:'#888',margin:0}}>{part.muscles}</p>
        </div>
        <div style={{textAlign:'center',marginBottom:16}}>
          <p style={{fontSize:11,color:'#666',letterSpacing:1}}>Stretch {strIdx+1} of {part.stretches.length}</p>
          <h1 style={{fontSize:20,fontWeight:700,margin:'8px 0'}}>{str.name}</h1>
          <div style={{fontSize:18,color:'#95A5A6',fontWeight:600,marginBottom:8}}>{str.duration}</div>
          {str.notes&&<p style={{fontSize:13,color:'#888',margin:0}}>{str.notes}</p>}
        </div>
        <VideoEmbed video={str.video} title={str.name}/>
        <div style={{display:'flex',gap:12,marginTop:'auto'}}>
          <button onClick={prevStretch} style={{...S.navBtn,opacity:(strPartIdx===0&&strIdx===0)?0.3:1}} disabled={strPartIdx===0&&strIdx===0}>← PREV</button>
          <button onClick={nextStretch} style={S.primaryBtn}>{strPartIdx===stretchData.length-1&&strIdx===part.stretches.length-1?'FINISH':'NEXT →'}</button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TAB: SCRIPT
  // ============================================================================

  const renderScript = () => {
    const session = dayData?.[scriptSession];
    if (!session) return <div style={S.center}><p style={{color:'#666'}}>No session data for today</p></div>;
    return (<>
      <div style={{textAlign:'center',marginBottom:16,paddingTop:12}}>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:5,margin:0}}>{today.toUpperCase()}</h1>
        <p style={{fontSize:14,color:'#95A5A6',marginTop:4}}>{dayData.name}</p>
      </div>
      <button onClick={()=>startWorkout(today,scriptSession)} style={{...S.primaryBtn,marginBottom:16,padding:'20px 24px',fontSize:17,letterSpacing:0.5}}>
        START {scriptSession.toUpperCase()} WORKOUT
      </button>
      <div style={S.toggleRow}>
        <button onClick={()=>setScriptSession('am')} style={{...S.toggleBtn,...(scriptSession==='am'?S.toggleAct:{})}}>AM — {dayData.am?.title||'AM'}</button>
        <button onClick={()=>setScriptSession('pm')} style={{...S.toggleBtn,...(scriptSession==='pm'?S.toggleAct:{})}}>PM — {dayData.pm?.title||'PM'}</button>
      </div>
      <div style={{textAlign:'center',marginBottom:16}}><span style={{fontSize:13,color:'#666',letterSpacing:1}}>{session.duration}</span></div>
      {session.sections.map((sec,si)=>(
        <div key={si} style={{marginBottom:20}}>
          <div style={S.sectionTag}>{sec.name}</div>
          {sec.exercises.map((ex,ei)=>(
            <div key={ei} style={S.scriptCard}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 style={{fontSize:15,fontWeight:700,margin:0,flex:1}}>{ex.name}</h3>
                <VideoLink video={ex.video}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                <span style={{fontSize:14,color:'#BDC3C7',fontWeight:600}}>{ex.sets} × {ex.reps}</span>
                {ex.rest>0&&<span style={{fontSize:11,color:'#5D6D7E',fontWeight:600}}>REST {ex.rest}s</span>}
              </div>
              {ex.notes&&<p style={{fontSize:12,color:'#888',margin:'8px 0 0',lineHeight:1.4}}>{ex.notes}</p>}
            </div>
          ))}
        </div>
      ))}
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <button onClick={()=>setShowRoutineImport(true)} style={S.smallBtn}>Import Routine</button>
        {routineSource==='imported'&&<button onClick={resetRoutine} style={S.smallBtn}>Reset to Default</button>}
      </div>
      {showRoutineImport&&(
        <div style={S.modal}><div style={S.modalBox}>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:16,marginTop:0}}>Import Workout Routine</h3>
          <p style={{fontSize:12,color:'#888',marginBottom:12}}>Paste text in WorkoutRoutine_style.txt format, or upload a .txt file</p>
          <label style={{...S.primaryBtn,marginBottom:10,display:'block'}}>Upload .txt File<input type="file" accept=".txt" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleRoutineFile(e.target.files[0])}/></label>
          <textarea value={routineText} onChange={e=>setRoutineText(e.target.value)} placeholder="Paste workout routine here..." style={S.modalTextarea}/>
          <div style={{display:'flex',gap:10,marginTop:16}}>
            <button onClick={()=>importRoutine(routineText)} style={S.primaryBtn}>Import</button>
            <button onClick={()=>{setShowRoutineImport(false);setRoutineText('');}} style={S.secondaryBtn}>Cancel</button>
          </div>
        </div></div>
      )}
    </>);
  };

  // ============================================================================
  // TAB: SHOP
  // ============================================================================

  const renderShop = () => {
    const src=shopSection==='factor'?factorMeals:hfMeals,sel=shopSection==='factor'?factorSel:hfSel,brand=shopSection==='factor'?'factor':'hf',brandLabel=shopSection==='factor'?'Factor':'HelloFresh';
    const fi=src?src.meals.map((_,i)=>i).filter(i=>{const m=src.meals[i];return m.name.toLowerCase().includes(shopSearch.toLowerCase())||m.headline.toLowerCase().includes(shopSearch.toLowerCase())||m.category.toLowerCase().includes(shopSearch.toLowerCase());}):[];
    return (<>
      <div style={S.tabHeader}><h1 style={S.tabTitle}>SHOP MODE</h1><p style={S.tabSub}>Select 7 meals from each service</p></div>
      <div style={S.toggleRow}>
        <button onClick={()=>{setShopSection('factor');setShopSearch('');}} style={{...S.toggleBtn,...(shopSection==='factor'?S.toggleAct:{})}}>Factor ({factorSel.length}/7)</button>
        <button onClick={()=>{setShopSection('hf');setShopSearch('');}} style={{...S.toggleBtn,...(shopSection==='hf'?S.toggleAct:{})}}>HelloFresh ({hfSel.length}/7)</button>
      </div>
      {!src?(
        <div style={{textAlign:'center',padding:'40px 0'}}>
          <p style={{fontSize:16,fontWeight:600,marginBottom:8}}>No {brandLabel} meals imported</p>
          <p style={{fontSize:13,color:'#666',marginBottom:24}}>Run the scraper, then import the JSON</p>
          <label style={{...S.primaryBtn,display:'block',marginBottom:10}}>Upload JSON File<input type="file" accept=".json" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleFileImport(brand,e.target.files[0])}/></label>
          <button onClick={()=>{setShowImport(brand);setImportText('');}} style={S.secondaryBtn}>Paste JSON</button>
        </div>
      ):(
        <>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><span style={{fontSize:12,color:'#95A5A6'}}>{src.week||`Scraped ${src.scraped}`}</span><span style={{fontSize:12,color:'#666'}}>{src.meals.length} meals</span></div>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <label style={S.smallBtn}>Re-import<input type="file" accept=".json" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleFileImport(brand,e.target.files[0])}/></label>
            <button onClick={()=>{setShowImport(brand);setImportText('');}} style={S.smallBtn}>Paste JSON</button>
          </div>
          <input type="text" placeholder="Search meals..." value={shopSearch} onChange={e=>setShopSearch(e.target.value)} style={S.searchInput}/>
          {sel.length>0&&<div style={{marginBottom:16}}><div style={S.sectionTag}>SELECTED ({sel.length}/7)</div>{sel.map(idx=>{const m=src.meals[idx];if(!m)return null;return(<button key={idx} onClick={()=>toggleShopSel(brand,idx)} style={S.selChip}><span style={{flex:1,fontSize:13,fontWeight:600,color:'#ECF0F1'}}>{m.name}</span><span style={{fontSize:11,color:'#95A5A6'}}>{m.cal}cal·{m.pro}g</span><span style={{fontSize:14,color:'#888',marginLeft:4}}>✕</span></button>);})}</div>}
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {fi.map(idx=>{const m=src.meals[idx],isSel=sel.includes(idx),isDis=!isSel&&sel.length>=7;return(
              <button key={idx} onClick={()=>!isDis&&toggleShopSel(brand,idx)} style={{...S.mealCard,opacity:isDis?0.35:1,borderColor:isSel?'#5D6D7E':'#2C2C2C'}} disabled={isDis}>
                <div style={{...S.mealCheck,backgroundColor:isSel?'#5D6D7E':'transparent'}}>{isSel&&'✓'}</div>
                <div style={{display:'flex',flexDirection:'column',flex:1}}>
                  <span style={{fontSize:14,fontWeight:600,color:'#ECF0F1'}}>{m.name}</span>
                  {m.headline&&<span style={{fontSize:11,color:'#888',marginTop:2}}>{m.headline}</span>}
                  <span style={{fontSize:11,color:'#5D6D7E',marginTop:4,fontWeight:500}}>{m.cal}cal · {m.pro}g protein · {m.category}</span>
                </div>
              </button>
            );})}
          </div>
        </>
      )}
      {showImport&&<div style={S.modal}><div style={S.modalBox}><h3 style={{fontSize:16,fontWeight:700,marginBottom:16,marginTop:0}}>Paste {showImport==='factor'?'Factor':'HelloFresh'} JSON</h3><textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder="Paste JSON here..." style={S.modalTextarea}/><div style={{display:'flex',gap:10,marginTop:16}}><button onClick={()=>importMeals(showImport)} style={S.primaryBtn}>Import</button><button onClick={()=>{setShowImport(null);setImportText('');}} style={S.secondaryBtn}>Cancel</button></div></div></div>}
    </>);
  };

  // ============================================================================
  // TAB: FUEL
  // ============================================================================

  const renderFuel = () => {
    const fSel=getSelectedMeals('factor'),hSel=getSelectedMeals('hf');
    return (<>
      <div style={S.tabHeader}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
          <button onClick={()=>shiftFuelDate(-1)} style={S.dateArrow}>‹</button>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{fontSize:16,fontWeight:700}}>{fmtDate(fuelDate)}</span>
            {fuelDate!==todayStr()&&<button onClick={()=>setFuelDate(todayStr())} style={{background:'none',border:'1px solid #5D6D7E',color:'#95A5A6',borderRadius:4,padding:'2px 8px',fontSize:10,cursor:'pointer',marginTop:4}}>Today</button>}
          </div>
          <button onClick={()=>shiftFuelDate(1)} style={S.dateArrow}>›</button>
        </div>
      </div>
      <div style={S.macroBar}><div style={S.macroItem}><span style={S.macroNum}>{fuelTotal.cal.toLocaleString()}</span><span style={S.macroLabel}>CALORIES</span></div><div style={S.macroDivider}/><div style={S.macroItem}><span style={S.macroNum}>{fuelTotal.pro}g</span><span style={S.macroLabel}>PROTEIN</span></div></div>
      <div style={{marginBottom:20}}><div style={S.sectionTag}>STAPLES</div>
        {DAILY_STAPLES.map(s=><button key={s.id} onClick={()=>toggleFuel(`s_${s.id}`)} style={{...S.fuelRow,borderColor:fuelChecks[`s_${s.id}`]?'#5D6D7E':'#2C2C2C'}}>
          <div style={{...S.fuelCheck,backgroundColor:fuelChecks[`s_${s.id}`]?'#5D6D7E':'transparent'}}>{fuelChecks[`s_${s.id}`]&&'✓'}</div>
          <div style={{display:'flex',flexDirection:'column',flex:1}}>
            <span style={{fontSize:14,fontWeight:600,color:'#ECF0F1',textDecoration:fuelChecks[`s_${s.id}`]?'line-through':'none',opacity:fuelChecks[`s_${s.id}`]?0.5:1}}>{s.name}</span>
            <span style={{fontSize:11,color:'#5D6D7E',marginTop:3,fontWeight:500}}>{s.cal} cal · {s.pro}g protein</span>
          </div>
        </button>)}
      </div>
      <div style={{marginBottom:20}}><div style={S.sectionTag}>LUNCH — Factor</div>
        {fSel.length===0?<p style={{fontSize:13,color:'#555',padding:'16px 0',textAlign:'center'}}>Select Factor meals in Shop Mode first</p>:
        fSel.map((m,i)=><button key={i} onClick={()=>toggleFuel(`f_${i}`)} style={{...S.fuelRow,borderColor:fuelChecks[`f_${i}`]?'#5D6D7E':'#2C2C2C'}}>
          <div style={{...S.fuelCheck,backgroundColor:fuelChecks[`f_${i}`]?'#5D6D7E':'transparent'}}>{fuelChecks[`f_${i}`]&&'✓'}</div>
          <div style={{display:'flex',flexDirection:'column',flex:1}}>
            <span style={{fontSize:14,fontWeight:600,color:'#ECF0F1',textDecoration:fuelChecks[`f_${i}`]?'line-through':'none',opacity:fuelChecks[`f_${i}`]?0.5:1}}>{m.name}</span>
            <span style={{fontSize:11,color:'#5D6D7E',marginTop:3,fontWeight:500}}>{m.cal} cal · {m.pro}g protein</span>
          </div>
        </button>)}
      </div>
      <div style={{marginBottom:20}}><div style={S.sectionTag}>DINNER — HelloFresh</div>
        {hSel.length===0?<p style={{fontSize:13,color:'#555',padding:'16px 0',textAlign:'center'}}>Select HelloFresh meals in Shop Mode first</p>:
        hSel.map((m,i)=><button key={i} onClick={()=>toggleFuel(`h_${i}`)} style={{...S.fuelRow,borderColor:fuelChecks[`h_${i}`]?'#5D6D7E':'#2C2C2C'}}>
          <div style={{...S.fuelCheck,backgroundColor:fuelChecks[`h_${i}`]?'#5D6D7E':'transparent'}}>{fuelChecks[`h_${i}`]&&'✓'}</div>
          <div style={{display:'flex',flexDirection:'column',flex:1}}>
            <span style={{fontSize:14,fontWeight:600,color:'#ECF0F1',textDecoration:fuelChecks[`h_${i}`]?'line-through':'none',opacity:fuelChecks[`h_${i}`]?0.5:1}}>{m.name}</span>
            <span style={{fontSize:11,color:'#5D6D7E',marginTop:3,fontWeight:500}}>{m.cal} cal · {m.pro}g protein</span>
          </div>
        </button>)}
      </div>
    </>);
  };

  // ============================================================================
  // TAB: STRETCH
  // ============================================================================

  const renderStretch = () => (<>
    <div style={S.tabHeader}><h1 style={S.tabTitle}>FULL BODY STRETCH</h1><p style={S.tabSub}>{stretchData.length} body parts · ~20 minutes</p></div>
    <button onClick={()=>{setStretchOn(true);setStrPartIdx(0);setStrIdx(0);}} style={{...S.primaryBtn,marginBottom:20,padding:'20px 24px',fontSize:17}}>START STRETCH ROUTINE</button>
    <div style={S.sectionTag}>BODY PARTS COVERED</div>
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {stretchData.map((p,i)=>(
        <div key={i} style={{backgroundColor:'#111',borderRadius:12,padding:16,display:'flex',alignItems:'center',gap:14,border:'1px solid #222'}}>
          <div style={{width:36,height:36,borderRadius:'50%',backgroundColor:'#5D6D7E',color:'#ECF0F1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,flexShrink:0}}>{i+1}</div>
          <div><span style={{fontSize:15,fontWeight:600,color:'#fff',display:'block'}}>{p.bodyPart}</span><span style={{fontSize:12,color:'#666',marginTop:2,display:'block'}}>{p.stretches.length} stretches</span></div>
        </div>
      ))}
    </div>
    <div style={{display:'flex',gap:8,marginTop:16}}>
      <button onClick={()=>setShowStretchImport(true)} style={S.smallBtn}>Import Stretches</button>
      {stretchSource==='imported'&&<button onClick={resetStretch} style={S.smallBtn}>Reset to Default</button>}
    </div>
    <p style={{fontSize:11,color:'#555',marginTop:12,lineHeight:1.5}}>Import saves to this browser. Use StretchRoutine_style.txt format.</p>
    {showStretchImport&&(
      <div style={S.modal}><div style={S.modalBox}>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:16,marginTop:0}}>Import Stretch Routine</h3>
        <p style={{fontSize:12,color:'#888',marginBottom:12}}>Paste text in StretchRoutine_style.txt format, or upload a .txt file</p>
        <label style={{...S.primaryBtn,marginBottom:10,display:'block'}}>Upload .txt File<input type="file" accept=".txt" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleStretchFile(e.target.files[0])}/></label>
        <textarea value={stretchText} onChange={e=>setStretchText(e.target.value)} placeholder="Paste stretch routine here..." style={S.modalTextarea}/>
        <div style={{display:'flex',gap:10,marginTop:16}}>
          <button onClick={()=>importStretch(stretchText)} style={S.primaryBtn}>Import</button>
          <button onClick={()=>{setShowStretchImport(false);setStretchText('');}} style={S.secondaryBtn}>Cancel</button>
        </div>
      </div></div>
    )}
  </>);

  // ============================================================================
  // TAB: PROGRESS
  // ============================================================================

  const renderProgress = () => {
    const bwData=gainsLog.filter(e=>e.bodyweight).map(e=>({date:e.date,v:e.bodyweight})).reverse();
    const puData=gainsLog.filter(e=>e.pullup?.weight).map(e=>({date:e.date,v:e.pullup.weight})).reverse();
    const hangData=gainsLog.filter(e=>e.hang?.time).map(e=>({date:e.date,v:e.hang.time})).reverse();
    return (<>
      <div style={S.tabHeader}><h1 style={S.tabTitle}>PROGRESS</h1></div>
      <div style={{backgroundColor:'#1A1A1A',borderRadius:16,padding:28,textAlign:'center',marginBottom:20,border:'2px solid #2C2C2C'}}>
        <span style={{fontSize:36,display:'block',marginBottom:8}}>🔥</span>
        <span style={{fontSize:48,fontWeight:800,color:'#BDC3C7',display:'block'}}>{currentStreak}</span>
        <span style={{fontSize:11,letterSpacing:2,color:'#666',marginTop:4,display:'block'}}>DAY STREAK</span>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:24}}>
        {[['Total',workoutHistory.length],['AM',workoutHistory.filter(w=>w.session==='am').length],['PM',workoutHistory.filter(w=>w.session==='pm').length]].map(([l,n])=>(
          <div key={l} style={{flex:1,backgroundColor:'#1A1A1A',borderRadius:12,padding:16,textAlign:'center',border:'2px solid #2C2C2C'}}>
            <span style={{display:'block',fontSize:22,fontWeight:700,color:'#fff'}}>{n}</span>
            <span style={{display:'block',fontSize:10,color:'#666',marginTop:4}}>{l}</span>
          </div>
        ))}
      </div>
      <div style={S.toggleRow}>
        <button onClick={()=>setProgView('overview')} style={{...S.toggleBtn,...(progView==='overview'?S.toggleAct:{})}}>Overview</button>
        <button onClick={()=>setProgView('log')} style={{...S.toggleBtn,...(progView==='log'?S.toggleAct:{})}}>Log</button>
        <button onClick={()=>setProgView('charts')} style={{...S.toggleBtn,...(progView==='charts'?S.toggleAct:{})}}>Charts</button>
      </div>
      {progView==='overview'&&<div style={{display:'flex',flexDirection:'column',gap:8}}>
        <div style={S.sectionTag}>RECENT WORKOUTS</div>
        {workoutHistory.length===0?<p style={{fontSize:14,color:'#666',textAlign:'center',padding:'40px 0'}}>No workouts yet. Start training!</p>:
        workoutHistory.slice(0,15).map((w,i)=>(
          <div key={i} style={{backgroundColor:'#111',borderRadius:12,padding:16,display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #222'}}>
            <div><span style={{fontSize:14,fontWeight:600,color:'#fff',display:'block'}}>{w.title}</span><span style={{fontSize:11,color:'#666',marginTop:2,display:'block'}}>{w.day} · {w.session?.toUpperCase()}</span></div>
            <span style={{fontSize:12,color:'#666'}}>{fmtDate(w.date)}</span>
          </div>
        ))}
        {workoutHistory.length>0&&<button onClick={()=>{if(window.confirm('Clear all workout history?')){localStorage.removeItem('p_history');setWorkoutHistory([]);}}} style={{background:'none',border:'1px solid #500',color:'#a00',borderRadius:12,padding:12,fontSize:13,cursor:'pointer',marginTop:16}}>Clear History</button>}
      </div>}
      {progView==='log'&&<div>
        <div style={S.sectionTag}>BODYWEIGHT</div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><input type="number" placeholder="Weight" value={gForm.bodyweight} onChange={e=>setGForm(p=>({...p,bodyweight:e.target.value}))} style={S.numInput}/><span style={S.inputUnit}>lbs</span></div>
        <div style={{...S.sectionTag,marginTop:20}}>WEIGHTED PULL-UPS</div>
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}><label style={S.inputLabel}>Added Weight</label><div style={{display:'flex',alignItems:'center',gap:8}}><input type="number" placeholder="0" value={gForm.puWeight} onChange={e=>setGForm(p=>({...p,puWeight:e.target.value}))} style={S.numInput}/><span style={S.inputUnit}>lbs</span></div></div>
          <div style={{flex:1}}><label style={S.inputLabel}>Reps</label><input type="number" placeholder="0" value={gForm.puReps} onChange={e=>setGForm(p=>({...p,puReps:e.target.value}))} style={S.numInput}/></div>
          <div style={{flex:1}}><label style={S.inputLabel}>Sets</label><input type="number" placeholder="0" value={gForm.puSets} onChange={e=>setGForm(p=>({...p,puSets:e.target.value}))} style={S.numInput}/></div>
        </div>
        <div style={{...S.sectionTag,marginTop:20}}>GRIP / HANGS</div>
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}><label style={S.inputLabel}>Edge</label><div style={{display:'flex',alignItems:'center',gap:8}}><input type="number" placeholder="0" value={gForm.hangEdge} onChange={e=>setGForm(p=>({...p,hangEdge:e.target.value}))} style={S.numInput}/><span style={S.inputUnit}>mm</span></div></div>
          <div style={{flex:1}}><label style={S.inputLabel}>Added Wt</label><div style={{display:'flex',alignItems:'center',gap:8}}><input type="number" placeholder="0" value={gForm.hangWeight} onChange={e=>setGForm(p=>({...p,hangWeight:e.target.value}))} style={S.numInput}/><span style={S.inputUnit}>lbs</span></div></div>
          <div style={{flex:1}}><label style={S.inputLabel}>Hold</label><div style={{display:'flex',alignItems:'center',gap:8}}><input type="number" placeholder="0" value={gForm.hangTime} onChange={e=>setGForm(p=>({...p,hangTime:e.target.value}))} style={S.numInput}/><span style={S.inputUnit}>sec</span></div></div>
        </div>
        <button onClick={logGains} style={{...S.primaryBtn,marginTop:24}}>LOG ENTRY</button>
        {gainsLog.length>0&&<><div style={{...S.sectionTag,marginTop:24}}>RECENT ENTRIES</div>{gainsLog.slice(0,10).map((e,i)=>(
          <div key={i} style={{backgroundColor:'#111',borderRadius:10,padding:14,border:'1px solid #222',marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:600,color:'#95A5A6',display:'block',marginBottom:8}}>{fmtDate(e.date)}</span>
            {e.bodyweight&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:11,color:'#666',fontWeight:600}}>BW</span><span style={{fontSize:13,color:'#BDC3C7'}}>{e.bodyweight} lbs</span></div>}
            {e.pullup&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:11,color:'#666',fontWeight:600}}>Pull-up</span><span style={{fontSize:13,color:'#BDC3C7'}}>+{e.pullup.weight}lbs × {e.pullup.reps}r × {e.pullup.sets}s</span></div>}
            {e.hang&&<div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:11,color:'#666',fontWeight:600}}>Hang</span><span style={{fontSize:13,color:'#BDC3C7'}}>{e.hang.edge}mm · +{e.hang.weight}lbs · {e.hang.time}s</span></div>}
          </div>
        ))}</>}
      </div>}
      {progView==='charts'&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
        <MiniChart data={bwData} label="Bodyweight" unit="lbs" color="#7FB3D8"/>
        <MiniChart data={puData} label="Pull-up Weight" unit="lbs" color="#A8D8A8"/>
        <MiniChart data={hangData} label="Hang Time" unit="s" color="#D8A87F"/>
      </div>}
    </>);
  };

  // ============================================================================
  // MAIN RETURN
  // ============================================================================

  const tabs=[{id:'script',label:'Script',I:ScriptIcon},{id:'shop',label:'Shop',I:ShopIcon},{id:'fuel',label:'Fuel',I:FuelIcon},{id:'stretch',label:'Stretch',I:StretchIcon},{id:'progress',label:'Progress',I:ProgressIcon}];

  return (
    <div style={S.container}>
      {tab==='script'&&renderScript()}
      {tab==='shop'&&renderShop()}
      {tab==='fuel'&&renderFuel()}
      {tab==='stretch'&&renderStretch()}
      {tab==='progress'&&renderProgress()}
      <div style={S.bottomNav}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{...S.navItem,...(tab===t.id?{color:'#BDC3C7'}:{})}}>
          <t.I a={tab===t.id}/><span style={{fontSize:9,letterSpacing:0.5,color:tab===t.id?'#BDC3C7':'#666'}}>{t.label}</span>
        </button>)}
      </div>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const S={
  container:{minHeight:'100vh',backgroundColor:'#000',color:'#fff',fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:'20px',paddingBottom:'90px',display:'flex',flexDirection:'column',maxWidth:'430px',margin:'0 auto',boxSizing:'border-box'},
  center:{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',flex:1,textAlign:'center'},
  bottomNav:{position:'fixed',bottom:0,left:0,right:0,backgroundColor:'#111',borderTop:'1px solid #2C2C2C',display:'flex',justifyContent:'space-around',padding:'8px 0 12px',maxWidth:'430px',margin:'0 auto',boxShadow:'0 -2px 8px rgba(0,0,0,0.6)'},
  navItem:{background:'none',border:'none',color:'#666',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',cursor:'pointer',padding:'4px 8px'},
  tabHeader:{textAlign:'center',marginBottom:20,paddingTop:12},
  tabTitle:{fontSize:22,fontWeight:800,letterSpacing:4,margin:0},
  tabSub:{fontSize:12,color:'#666',marginTop:6},
  toggleRow:{display:'flex',gap:8,marginBottom:16},
  toggleBtn:{flex:1,padding:'12px 8px',fontSize:12,fontWeight:600,backgroundColor:'#1A1A1A',border:'2px solid #2C2C2C',borderRadius:10,color:'#888',cursor:'pointer',textAlign:'center'},
  toggleAct:{borderColor:'#5D6D7E',color:'#ECF0F1',backgroundColor:'#1E2A35'},
  sectionTag:{fontSize:10,letterSpacing:2,color:'#5D6D7E',textTransform:'uppercase',marginBottom:10,fontWeight:700},
  primaryBtn:{backgroundColor:'#5D6D7E',color:'#ECF0F1',border:'none',borderRadius:10,padding:'14px 24px',fontSize:14,fontWeight:600,cursor:'pointer',textAlign:'center',width:'100%'},
  secondaryBtn:{backgroundColor:'transparent',border:'2px solid #5D6D7E',color:'#95A5A6',borderRadius:10,padding:'12px 24px',fontSize:14,fontWeight:600,cursor:'pointer',width:'100%'},
  smallBtn:{backgroundColor:'#1A1A1A',border:'1px solid #2C2C2C',color:'#888',borderRadius:8,padding:'8px 14px',fontSize:11,fontWeight:600,cursor:'pointer',display:'inline-block',textAlign:'center'},
  exitBtn:{backgroundColor:'rgba(93,109,126,0.2)',border:'2px solid rgba(93,109,126,0.3)',color:'#95A5A6',width:40,height:40,borderRadius:12,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'},
  navBtn:{flex:1,backgroundColor:'transparent',border:'2px solid #5D6D7E',color:'#95A5A6',borderRadius:12,padding:16,fontSize:15,fontWeight:600,cursor:'pointer',background:'rgba(93,109,126,0.1)'},
  progressBar:{height:4,backgroundColor:'#2C2C2C',borderRadius:2,overflow:'hidden'},
  progressFill:{height:'100%',background:'linear-gradient(90deg,#7F8C8D,#95A5A6)',transition:'width 0.3s'},
  statBox:{display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'#1A1A1A',padding:'16px 24px',borderRadius:12,border:'2px solid #2C2C2C'},
  statLabel:{fontSize:10,letterSpacing:1,color:'#666',marginBottom:2},
  statVal:{fontSize:24,fontWeight:700,color:'#BDC3C7'},
  notes:{fontSize:13,color:'#BDC3C7',margin:0,padding:'10px 14px',backgroundColor:'#1A1A1A',borderRadius:8,textAlign:'left',border:'1px solid #2C2C2C'},
  videoWrap:{aspectRatio:'16/9',marginBottom:16,borderRadius:10,overflow:'hidden',backgroundColor:'#1A1A1A',border:'1px solid #3A3A3A'},
  video:{width:'100%',height:'100%',border:'none'},
  extVideoBtn:{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'16px 24px',marginBottom:16,backgroundColor:'rgba(93,109,126,0.15)',border:'2px solid rgba(93,109,126,0.3)',borderRadius:12,color:'#95A5A6',fontSize:15,fontWeight:600,textDecoration:'none',cursor:'pointer'},
  scriptCard:{backgroundColor:'#111',borderRadius:12,padding:'14px 16px',marginBottom:8,border:'1px solid #222'},
  vidLink:{width:30,height:30,borderRadius:8,backgroundColor:'rgba(93,109,126,0.2)',border:'1px solid rgba(93,109,126,0.3)',color:'#95A5A6',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',flexShrink:0},
  modal:{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:200,backgroundColor:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',padding:20},
  modalBox:{backgroundColor:'#1A1A1A',borderRadius:16,padding:24,width:'100%',maxWidth:400,border:'1px solid #2C2C2C'},
  modalTextarea:{width:'100%',height:200,padding:12,fontSize:12,backgroundColor:'#111',color:'#ECF0F1',border:'1px solid #2C2C2C',borderRadius:8,resize:'vertical',fontFamily:'monospace',boxSizing:'border-box',outline:'none'},
  searchInput:{width:'100%',padding:'12px 16px',fontSize:14,backgroundColor:'#111',color:'#ECF0F1',border:'1px solid #2C2C2C',borderRadius:10,marginBottom:16,boxSizing:'border-box',outline:'none'},
  selChip:{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'10px 14px',marginBottom:6,backgroundColor:'#1E2A35',border:'1px solid #5D6D7E',borderRadius:8,cursor:'pointer',textAlign:'left'},
  mealCard:{display:'flex',alignItems:'flex-start',gap:12,width:'100%',padding:'12px 14px',backgroundColor:'#111',border:'2px solid #2C2C2C',borderRadius:10,cursor:'pointer',textAlign:'left',transition:'border-color 0.2s'},
  mealCheck:{width:24,height:24,borderRadius:6,flexShrink:0,border:'2px solid #5D6D7E',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#ECF0F1',marginTop:2},
  dateArrow:{background:'none',border:'none',color:'#95A5A6',fontSize:28,cursor:'pointer',padding:'4px 12px',fontWeight:300},
  macroBar:{display:'flex',alignItems:'center',justifyContent:'center',gap:24,backgroundColor:'#111',borderRadius:14,padding:20,marginBottom:20,border:'2px solid #2C2C2C'},
  macroItem:{display:'flex',flexDirection:'column',alignItems:'center'},
  macroNum:{fontSize:28,fontWeight:800,color:'#ECF0F1'},
  macroLabel:{fontSize:9,letterSpacing:2,color:'#666',marginTop:2},
  macroDivider:{width:1,height:36,backgroundColor:'#2C2C2C'},
  fuelRow:{display:'flex',alignItems:'center',gap:12,width:'100%',padding:14,marginBottom:6,backgroundColor:'#111',border:'2px solid #2C2C2C',borderRadius:10,cursor:'pointer',textAlign:'left',transition:'border-color 0.2s'},
  fuelCheck:{width:22,height:22,borderRadius:6,flexShrink:0,border:'2px solid #5D6D7E',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#ECF0F1',transition:'background-color 0.2s'},
  numInput:{width:'100%',padding:12,fontSize:16,fontWeight:600,backgroundColor:'#111',color:'#ECF0F1',border:'1px solid #2C2C2C',borderRadius:8,boxSizing:'border-box',outline:'none',textAlign:'center'},
  inputUnit:{fontSize:12,color:'#666',flexShrink:0,width:30},
  inputLabel:{fontSize:10,color:'#666',letterSpacing:0.5,display:'block',marginBottom:4},
  chartWrap:{backgroundColor:'#111',borderRadius:12,padding:14,border:'1px solid #2C2C2C'},
  chartLabel:{fontSize:11,fontWeight:700,letterSpacing:1,color:'#95A5A6',display:'block',marginBottom:8},
  chartSvg:{width:'100%',height:'auto',display:'block'},
  chartEmpty:{fontSize:12,color:'#555',textAlign:'center',padding:'20px 0'},
};
