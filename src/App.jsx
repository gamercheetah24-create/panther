import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// PANTHER PROTOCOL v5.0 - ZERO FRICTION WORKOUT APP
// ============================================================================
//
// FEATURES:
// - Quick Start: One tap to begin today's workout
// - Fitness Daily: 6 targeted destruction workouts (15-20 min each)
// - Progress Tracking: See your workout history and streaks
// - Nutrition Guide: Healthy restaurants ranked for muscle building
// - Full Body Stretch: Guided stretch routine by body part with videos
// - Auto-Resume: Never lose progress if app closes
// - Audio Alert: Sound when rest timer ends
// - Keyboard Shortcuts: SPACEBAR to advance, ESC to exit
// - Screen Wake Lock: Phone stays awake during workout
//
// ============================================================================

// ============================================================================
// FITNESS DAILY - Targeted Destruction Workouts
// ============================================================================

const FITNESS_DAILY = {
  shoulders: {
    name: "SHOULDER DESTRUCTION",
    emoji: "🔥",
    duration: "20 min",
    description: "All 3 delt heads annihilated",
    exercises: [
      { name: "DB Overhead Press", sets: 4, reps: "FAILURE", rest: 60, notes: "15 lb each hand, standing, strict form", video: "qEwKCR5JCog" },
      { name: "DB Lateral Raises", sets: 4, reps: "FAILURE", rest: 45, notes: "Control the negative, no swinging", video: "3VcKaXpzqRo" },
      { name: "Pike Push-ups", sets: 4, reps: "FAILURE", rest: 60, notes: "Head toward ground, shoulders burning", video: "sposDXWEB0A" },
      { name: "Reverse Flyes", sets: 4, reps: "FAILURE", rest: 45, notes: "Bent over, squeeze rear delts", video: "lPt0GqwaqEw" },
      { name: "Front Raises", sets: 3, reps: "FAILURE", rest: 30, notes: "Alternate arms or both together", video: "Ir97R3vBB0M" }
    ]
  },
  core: {
    name: "CORE DESTRUCTION",
    emoji: "🔥",
    duration: "20 min",
    description: "Abs, obliques, deep core destroyed",
    exercises: [
      { name: "Sit-ups", sets: 5, reps: "FAILURE", rest: 45, notes: "Full range, touch toes at top", video: "1fbU_MkV7NE" },
      { name: "Russian Twists (15 lb)", sets: 4, reps: "FAILURE", rest: 45, notes: "Feet elevated, touch floor each side", video: "wkD8rjkodUI" },
      { name: "Hanging Leg Raises", sets: 4, reps: "FAILURE", rest: 60, notes: "Control the swing, legs to 90°", video: "Pr1ieGZ5atk" },
      { name: "Bicycle Crunches", sets: 4, reps: "FAILURE", rest: 45, notes: "Slow and controlled, elbow to knee", video: "9FGilxCbdz8" },
      { name: "Plank Hold", sets: 3, reps: "FAILURE (time)", rest: 60, notes: "Straight line, squeeze everything", video: "pSHjTRCQxIw" }
    ]
  },
  hips: {
    name: "HIP DESTRUCTION",
    emoji: "🔥",
    duration: "20 min",
    description: "Glutes, hip flexors, abductors obliterated",
    exercises: [
      { name: "Single-Leg Glute Bridge", sets: 5, reps: "FAILURE each leg", rest: 45, notes: "Squeeze glute hard at top, hold 1 sec", video: "AVAXhy6pl7o" },
      { name: "Bulgarian Split Squats", sets: 4, reps: "FAILURE each leg", rest: 60, notes: "15 lb each hand, deep stretch", video: "2C-uNgKwPLE" },
      { name: "Banded Clamshells", sets: 4, reps: "FAILURE each side", rest: 30, notes: "Band above knees, squeeze at top", video: "hbSM9JxBpNg" },
      { name: "Fire Hydrants", sets: 4, reps: "FAILURE each side", rest: 30, notes: "On all fours, lift leg to side", video: "La3xYT8MGks" },
      { name: "Deep Squat Hold", sets: 3, reps: "FAILURE (time)", rest: 60, notes: "Sink as deep as possible, breathe", video: "M8xSPpfv2ME" }
    ]
  },
  feetKnees: {
    name: "FEET-KNEE DESTRUCTION",
    emoji: "🔥",
    duration: "20 min",
    description: "Calves, shins, feet, toes smoked",
    exercises: [
      { name: "Single-Leg Calf Raises", sets: 5, reps: "FAILURE each leg", rest: 45, notes: "Full range, 3 sec up, 3 sec down", video: "OeTJ7NHJD7M" },
      { name: "Tibialis Raises", sets: 5, reps: "FAILURE", rest: 45, notes: "Back against wall, lift toes high", video: "gNS_QjGAs_k" },
      { name: "Toe Curls (Towel Scrunch)", sets: 4, reps: "FAILURE", rest: 30, notes: "Scrunch towel with toes", video: "Bkz9jVL9bIA" },
      { name: "Big Toe Raises", sets: 3, reps: "20 each foot", rest: 30, notes: "Lift big toe only, other toes stay down", video: "adbbCKNj1IM" },
      { name: "Single-Leg Balance (Eyes Closed)", sets: 3, reps: "FAILURE (time) each", rest: 30, notes: "On ball of foot, don't fall", video: "8DLrXqx8Kvc" }
    ]
  },
  forearms: {
    name: "FOREARM + FINGER DESTRUCTION",
    emoji: "🔥",
    duration: "20 min",
    description: "Flexors, extensors, grip crushed",
    exercises: [
      { name: "Wrist Curls", sets: 5, reps: "FAILURE", rest: 45, notes: "Palm up, curl wrist only", video: "7ac_qmBYdms" },
      { name: "Reverse Wrist Curls", sets: 5, reps: "FAILURE", rest: 45, notes: "Palm down, extend wrist", video: "kMqRqVPUL84" },
      { name: "Dead Hang", sets: 4, reps: "FAILURE (time)", rest: 60, notes: "Full grip, don't let go", video: "dkOAOjPqaOQ" },
      { name: "Towel Hang", sets: 3, reps: "FAILURE (time)", rest: 60, notes: "Towel over bar, brutal grip work", video: "IEOwe3xXWcg" },
      { name: "Finger Extensions (Rubber Band)", sets: 4, reps: "FAILURE", rest: 30, notes: "Band around fingers, spread apart", video: "UHB6wDWiJmk" }
    ]
  },
  neck: {
    name: "NECK DESTRUCTION",
    emoji: "🔥",
    duration: "15 min",
    description: "360° neck hypertrophy",
    exercises: [
      { name: "Neck Curls (Lying Face Up)", sets: 5, reps: "FAILURE", rest: 45, notes: "Head off edge, chin to chest", video: "gA3uw5yk3zU" },
      { name: "Neck Extensions (Lying Face Down)", sets: 5, reps: "FAILURE", rest: 45, notes: "Head off edge, look up", video: "gA3uw5yk3zU" },
      { name: "Lateral Neck Curls", sets: 4, reps: "FAILURE each side", rest: 45, notes: "Side-lying, ear to shoulder", video: "gA3uw5yk3zU" },
      { name: "Isometric Neck Holds", sets: 3, reps: "FAILURE (time) × 4 directions", rest: 30, notes: "Push head into hand, resist", video: "gA3uw5yk3zU" }
    ]
  }
};

// ============================================================================
// WORKOUT DATA - STREAMLINED (Same as v4)
// ============================================================================

const WORKOUT_DATA = {
  Monday: {
    name: "Lower Body Power",
    am: {
      title: "Trail Run + Lower Prehab",
      duration: "35 min",
      sections: [
        {
          name: "Cardio",
          exercises: [
            { name: "Trail Run 1.75 Miles", sets: 1, reps: "Complete", rest: 0, notes: "Run/walk - push to run more each week", video: "8Y3MhCNIm0k" }
          ]
        },
        {
          name: "Lower Body Prehab",
          exercises: [
            { name: "Tibialis Raises", sets: 3, reps: 25, rest: 30, notes: "Back against wall, lift toes high", video: "gNS_QjGAs_k" },
            { name: "Single-Leg Calf Raises", sets: 3, reps: "20 each", rest: 30, notes: "Slow 3 sec up, 3 sec down", video: "OeTJ7NHJD7M" },
            { name: "Single-Leg Glute Bridge", sets: 3, reps: "15 each", rest: 30, notes: "Squeeze glute hard at top", video: "AVAXhy6pl7o" },
            { name: "Big Toe Raises", sets: 3, reps: 20, rest: 30, notes: "Lift only big toe while other toes stay down", video: "adbbCKNj1IM" }
          ]
        }
      ]
    },
    pm: {
      title: "LEGS",
      duration: "50 min",
      sections: [
        {
          name: "Warm-Up",
          exercises: [
            { name: "Leg Swings", sets: 1, reps: "15 each direction", rest: 0, notes: "Front/back and side/side each leg", video: "4aoUZEZFJF8" },
            { name: "Bodyweight Squats", sets: 1, reps: 20, rest: 60, notes: "Deep, controlled, warm up joints", video: "aclHkVaku9U" }
          ]
        },
        {
          name: "Main Work",
          exercises: [
            { name: "Bodyweight Squats", sets: 3, reps: "MAX", rest: 90, notes: "Deep as possible, full range", video: "aclHkVaku9U" },
            { name: "Nordic Curl Negatives", sets: 5, reps: 5, rest: 90, notes: "5 sec lowering - FIGHT IT! Catch with hands.", video: "HUXS3S2xSK4" },
            { name: "Bulgarian Split Squats", sets: 4, reps: "12 each", rest: 60, notes: "15 lb each hand, rear foot elevated, deep", video: "2C-uNgKwPLE" },
            { name: "Single-Leg RDL", sets: 4, reps: "10 each", rest: 60, notes: "15 lb, feel hamstring stretch at bottom", video: "j7pPR0XAX4s" },
            { name: "Jump Squats", sets: 4, reps: 15, rest: 60, notes: "Explode every rep - max height", video: "YGGq0AE5Vyk" }
          ]
        }
      ]
    }
  },
  Tuesday: {
    name: "Upper Push",
    am: {
      title: "Sprints + Rotator Cuff",
      duration: "30 min",
      sections: [
        {
          name: "Sprint Intervals",
          exercises: [
            { name: "Warm-up Sprints (70%)", sets: 3, reps: "40m each", rest: 60, notes: "Walk back recovery", video: "w1xUbXvnkYA" },
            { name: "Hard Sprints (90-95%)", sets: 5, reps: "40m each", rest: 90, notes: "Near max effort - explode!", video: "w1xUbXvnkYA" },
            { name: "Cooldown Sprints (70%)", sets: 2, reps: "40m each", rest: 60, notes: "Walk back, shake out legs", video: "w1xUbXvnkYA" }
          ]
        },
        {
          name: "Rotator Cuff",
          exercises: [
            { name: "Wall Slides", sets: 3, reps: 15, rest: 30, notes: "Back flat on wall, slide arms up/down", video: "8lDC4ti4g9A" },
            { name: "External Rotation (Side-Lying)", sets: 3, reps: "20 each", rest: 30, notes: "Elbow glued to side, rotate forearm up", video: "WVKb13Oqhg4" }
          ]
        }
      ]
    },
    pm: {
      title: "PUSH",
      duration: "50 min",
      sections: [
        {
          name: "Warm-Up",
          exercises: [
            { name: "Arm Circles", sets: 1, reps: "20 each direction", rest: 0, notes: "Small to large, forward and back", video: "HWvKbZcPT0Y" },
            { name: "Push-ups", sets: 1, reps: 15, rest: 60, notes: "Get blood flowing", video: "_l3ySVKYVJ8" }
          ]
        },
        {
          name: "Main Work",
          exercises: [
            { name: "Dips", sets: 5, reps: "MAX", rest: 120, notes: "Full depth, lean slightly forward, GO TO FAILURE", video: "2z8JmcrW-As" },
            { name: "Mike Tyson Push-ups", sets: 4, reps: 10, rest: 90, notes: "Feet on wall, rock back to squat, dive forward into push-up", video: "WeFGIPR8yxA" },
            { name: "Pike Push-ups (Feet Elevated)", sets: 5, reps: "MAX", rest: 90, notes: "Feet on chair/stairs - shoulder builder", video: "sposDXWEB0A" },
            { name: "Push-ups", sets: 5, reps: "MAX", rest: 90, notes: "Perfect form to failure - chest to ground", video: "_l3ySVKYVJ8" },
            { name: "Diamond Push-ups", sets: 4, reps: "MAX", rest: 60, notes: "Hands together, elbows tight - tricep killer", video: "J0DnG1_S92I" },
            { name: "DB Overhead Press", sets: 3, reps: 20, rest: 45, notes: "15 lb each hand, standing, core tight", video: "qEwKCR5JCog" }
          ]
        }
      ]
    }
  },
  Wednesday: {
    name: "Core & Conditioning",
    am: {
      title: "Trail Run + Core",
      duration: "35 min",
      sections: [
        {
          name: "Cardio",
          exercises: [
            { name: "Trail Run 1.75 Miles", sets: 1, reps: "Complete", rest: 0, notes: "Push pace on flat sections, breathe through nose", video: "8Y3MhCNIm0k" }
          ]
        },
        {
          name: "Core Stability",
          exercises: [
            { name: "Dead Bug", sets: 3, reps: "12 each side", rest: 30, notes: "Low back GLUED to floor - no arch", video: "4XLEnwUr1d8" },
            { name: "Plank", sets: 3, reps: "60 sec", rest: 30, notes: "Straight line head to heels - no sagging", video: "pSHjTRCQxIw" },
            { name: "Side Plank", sets: 3, reps: "45 sec each", rest: 30, notes: "Stack feet, straight line, squeeze obliques", video: "K2VljzCC16g" }
          ]
        }
      ]
    },
    pm: {
      title: "CORE + GRIP",
      duration: "40 min",
      sections: [
        {
          name: "Warm-Up",
          exercises: [
            { name: "Jumping Jacks", sets: 1, reps: 50, rest: 0, notes: "Get heart rate up", video: "2W4ZNSwoW_4" },
            { name: "Mountain Climbers", sets: 1, reps: 30, rest: 60, notes: "Drive knees to chest fast", video: "nmwgirgXLYM" }
          ]
        },
        {
          name: "Main Work",
          exercises: [
            { name: "Hanging Leg Raises", sets: 5, reps: "MAX", rest: 90, notes: "Control the swing - NO KIPPING", video: "Pr1ieGZ5atk" },
            { name: "Russian Twists (15 lb)", sets: 4, reps: "30 total", rest: 45, notes: "Feet elevated, control the rotation", video: "wkD8rjkodUI" },
            { name: "Dead Hang", sets: 5, reps: "Max Time", rest: 60, notes: "Full grip on bar - DON'T LET GO", video: "dkOAOjPqaOQ" },
            { name: "Towel Hang", sets: 3, reps: "Max Time", rest: 60, notes: "Towel over bar, grip the towel - brutal", video: "IEOwe3xXWcg" }
          ]
        }
      ]
    }
  },
  Thursday: {
    name: "Upper Pull",
    am: {
      title: "Sprints + Rotator Cuff",
      duration: "30 min",
      sections: [
        {
          name: "Sprint Intervals",
          exercises: [
            { name: "Warm-up Sprints (70%)", sets: 3, reps: "40m each", rest: 60, notes: "Walk back recovery", video: "w1xUbXvnkYA" },
            { name: "Hard Sprints (90-95%)", sets: 5, reps: "40m each", rest: 90, notes: "Near max effort", video: "w1xUbXvnkYA" },
            { name: "Cooldown Sprints (70%)", sets: 2, reps: "40m each", rest: 60, notes: "Shake it out", video: "w1xUbXvnkYA" }
          ]
        },
        {
          name: "Rotator Cuff",
          exercises: [
            { name: "External Rotation (Side-Lying)", sets: 3, reps: "15 each", rest: 30, notes: "Elbow at 90°, rotate forearm up", video: "WVKb13Oqhg4" },
            { name: "Wall Slides", sets: 3, reps: 15, rest: 30, notes: "Back flat on wall", video: "8lDC4ti4g9A" }
          ]
        }
      ]
    },
    pm: {
      title: "PULL",
      duration: "55 min",
      sections: [
        {
          name: "Warm-Up",
          exercises: [
            { name: "Arm Circles", sets: 1, reps: "20 each direction", rest: 0, notes: "Loosen shoulders", video: "HWvKbZcPT0Y" },
            { name: "Inverted Rows", sets: 1, reps: 10, rest: 60, notes: "Get blood to back muscles", video: "hXTc1mDnZCw" }
          ]
        },
        {
          name: "Main Work",
          exercises: [
            { name: "Pull-ups", sets: 5, reps: "MAX", rest: 120, notes: "Dead hang start, chin over bar, TO FAILURE", video: "eGo4IYlbE5g" },
            { name: "Inverted Rows", sets: 5, reps: "MAX", rest: 90, notes: "Body horizontal, pull chest to bar", video: "hXTc1mDnZCw" },
            { name: "Chin-ups", sets: 4, reps: "MAX", rest: 90, notes: "Palms facing you - bicep emphasis", video: "brhRXlOhsAM" }
          ]
        },
        {
          name: "Neck Work",
          exercises: [
            { name: "Neck Curls (Face Up)", sets: 4, reps: 15, rest: 45, notes: "Chin to chest, head off edge of bed", video: "gA3uw5yk3zU" },
            { name: "Neck Extensions (Face Down)", sets: 4, reps: 15, rest: 45, notes: "Look up, squeeze back of neck", video: "gA3uw5yk3zU" },
            { name: "Isometric Neck Holds", sets: 3, reps: "15 sec × 4 directions", rest: 30, notes: "Push head into hand, resist", video: "gA3uw5yk3zU" }
          ]
        },
        {
          name: "Finisher",
          exercises: [
            { name: "Dead Hang", sets: 1, reps: "Max Time", rest: 0, notes: "Beat your record!", video: "dkOAOjPqaOQ" }
          ]
        }
      ]
    }
  },
  Friday: {
    name: "Lower Body Strength",
    am: {
      title: "Trail Run + Hip Mobility",
      duration: "30 min",
      sections: [
        {
          name: "Cardio",
          exercises: [
            { name: "Trail Run 1.75 Miles", sets: 1, reps: "Complete", rest: 0, notes: "Push harder today", video: "8Y3MhCNIm0k" }
          ]
        },
        {
          name: "Hip Mobility",
          exercises: [
            { name: "Deep Squat Hold", sets: 2, reps: "90 sec", rest: 30, notes: "Sink as deep as possible", video: "M8xSPpfv2ME" },
            { name: "90/90 Hip Stretch", sets: 1, reps: "45 sec each", rest: 15, notes: "Front leg 90°, back leg 90°", video: "8xF4HzjJxeM" }
          ]
        }
      ]
    },
    pm: {
      title: "LEGS",
      duration: "50 min",
      sections: [
        {
          name: "Warm-Up",
          exercises: [
            { name: "Leg Swings", sets: 1, reps: "15 each direction", rest: 0, notes: "Each leg", video: "4aoUZEZFJF8" },
            { name: "Bodyweight Squats", sets: 1, reps: 20, rest: 60, notes: "Deep, controlled", video: "aclHkVaku9U" }
          ]
        },
        {
          name: "Main Work",
          exercises: [
            { name: "Bodyweight Squats", sets: 3, reps: "MAX", rest: 90, notes: "Full depth every rep", video: "aclHkVaku9U" },
            { name: "Nordic Curl Negatives", sets: 5, reps: 5, rest: 90, notes: "Fight the lowering", video: "HUXS3S2xSK4" },
            { name: "Bulgarian Split Squats", sets: 4, reps: "15 each", rest: 60, notes: "More reps than Monday", video: "2C-uNgKwPLE" },
            { name: "Box Jumps", sets: 4, reps: 10, rest: 60, notes: "Explode up, soft landing", video: "52r_Ul5k03g" },
            { name: "Single-Leg Calf Raises", sets: 4, reps: "25 each", rest: 30, notes: "15 lb, full range", video: "OeTJ7NHJD7M" }
          ]
        }
      ]
    }
  },
  Saturday: {
    name: "Full Body Power",
    am: {
      title: "Hill Sprints + Prehab",
      duration: "35 min",
      sections: [
        {
          name: "Hill Sprints",
          exercises: [
            { name: "Warm-up Hill Sprint", sets: 2, reps: "1 sprint", rest: 90, notes: "Walk down for recovery", video: "txsijsUqetI" },
            { name: "MAX EFFORT Hill Sprint", sets: 6, reps: "1 sprint", rest: 120, notes: "FULL SEND", video: "txsijsUqetI" },
            { name: "Cooldown Hill Sprint (80%)", sets: 2, reps: "1 sprint", rest: 90, notes: "Walk down", video: "txsijsUqetI" }
          ]
        },
        {
          name: "Prehab",
          exercises: [
            { name: "External Rotation", sets: 2, reps: "12 each arm", rest: 30, notes: "Shoulder health", video: "WVKb13Oqhg4" },
            { name: "Tibialis Raises", sets: 2, reps: 20, rest: 30, notes: "Shin strength", video: "gNS_QjGAs_k" },
            { name: "Neck Isometrics", sets: 2, reps: "10 sec × 4 directions", rest: 30, notes: "Neck armor", video: "gA3uw5yk3zU" }
          ]
        }
      ]
    },
    pm: {
      title: "FULL BODY",
      duration: "50 min",
      sections: [
        {
          name: "Warm-Up",
          exercises: [
            { name: "Jumping Jacks", sets: 1, reps: 50, rest: 0, notes: "Full body activation", video: "2W4ZNSwoW_4" },
            { name: "Bodyweight Squats", sets: 1, reps: 20, rest: 60, notes: "Loosen up", video: "aclHkVaku9U" }
          ]
        },
        {
          name: "Power",
          exercises: [
            { name: "Jump Squats", sets: 4, reps: 12, rest: 60, notes: "MAX height", video: "YGGq0AE5Vyk" },
            { name: "Clap Push-ups", sets: 4, reps: 10, rest: 60, notes: "Explode off the ground", video: "EYwWCgM198U" },
            { name: "Mike Tyson Push-ups", sets: 3, reps: 10, rest: 60, notes: "Explosive - feet on wall, rock back and dive", video: "WeFGIPR8yxA" },
            { name: "Explosive Pull-ups", sets: 4, reps: 6, rest: 60, notes: "Pull chest to bar FAST", video: "5eSk68SBqMM" }
          ]
        },
        {
          name: "Strength",
          exercises: [
            { name: "Bulgarian Split Squats", sets: 4, reps: "12 each", rest: 60, notes: "15 lb each hand", video: "2C-uNgKwPLE" },
            { name: "Dips", sets: 4, reps: 15, rest: 60, notes: "Full depth", video: "2z8JmcrW-As" },
            { name: "Pull-ups", sets: 4, reps: "MAX", rest: 90, notes: "Full range", video: "eGo4IYlbE5g" }
          ]
        }
      ]
    }
  },
  Sunday: {
    name: "Active Recovery",
    am: {
      title: "Walk + Light Stretch",
      duration: "30 min",
      sections: [
        {
          name: "Easy Movement",
          exercises: [
            { name: "Walk Your Trail", sets: 1, reps: "20 min", rest: 0, notes: "Conversation pace, nasal breathing", video: "8Y3MhCNIm0k" }
          ]
        },
        {
          name: "Light Stretch",
          exercises: [
            { name: "Deep Squat Hold", sets: 1, reps: "90 sec", rest: 15, notes: "Sink and relax", video: "M8xSPpfv2ME" },
            { name: "Lying Hamstring Stretch", sets: 1, reps: "60 sec each", rest: 15, notes: "Use towel if needed", video: "FDwpEdxZ4H4" },
            { name: "Doorway Chest Stretch", sets: 1, reps: "45 sec each arm", rest: 0, notes: "Open up chest", video: "WUdMILZ55S4" }
          ]
        }
      ]
    },
    pm: {
      title: "REST",
      duration: "—",
      sections: [
        {
          name: "Recovery",
          exercises: [
            { name: "Complete Rest", sets: 1, reps: "—", rest: 0, notes: "Sleep well. Recover fully.", video: null }
          ]
        }
      ]
    }
  }
};

// ============================================================================
// STRETCH DATA - Full Body Stretch Routine
// ============================================================================

const STRETCH_DATA = [
  {
    id: 1,
    bodyPart: "Neck",
    muscles: "Trapezius, Sternocleidomastoid, Scalenes",
    stretches: [
      { name: "Neck Side Stretch", duration: "30 sec each side", video: "wQylqaCl8Zc", notes: "Ear to shoulder, gentle pull" },
      { name: "Neck Forward Stretch", duration: "30 sec", video: "wQylqaCl8Zc", notes: "Chin to chest, hands behind head" },
      { name: "Neck Rotation", duration: "30 sec each side", video: "wQylqaCl8Zc", notes: "Look over shoulder, gentle" }
    ]
  },
  {
    id: 2,
    bodyPart: "Shoulders",
    muscles: "Deltoids, Rotator Cuff",
    stretches: [
      { name: "Cross-Body Shoulder Stretch", duration: "30 sec each arm", video: "Jxz7S1gDiXs", notes: "Pull arm across chest" },
      { name: "Doorway Chest/Shoulder Stretch", duration: "45 sec each arm", video: "WUdMILZ55S4", notes: "Arm on frame, lean through" },
      { name: "Behind Back Shoulder Stretch", duration: "30 sec each arm", video: "A-F1LMmYe5Q", notes: "Reach up behind back" }
    ]
  },
  {
    id: 3,
    bodyPart: "Chest",
    muscles: "Pectoralis Major, Pectoralis Minor",
    stretches: [
      { name: "Doorway Chest Stretch", duration: "45 sec each side", video: "WUdMILZ55S4", notes: "Elbow at 90°, lean forward" },
      { name: "Floor Chest Opener", duration: "60 sec", video: "9pON5i7DP0Q", notes: "Lie face down, arms out in T" }
    ]
  },
  {
    id: 4,
    bodyPart: "Upper Back",
    muscles: "Rhomboids, Lats, Traps",
    stretches: [
      { name: "Cat Stretch", duration: "30 sec", video: "kqnua4rHVVA", notes: "Round back up, tuck chin" },
      { name: "Child's Pose with Reach", duration: "60 sec", video: "2JfBwFUA9y4", notes: "Walk hands forward, sink hips" },
      { name: "Lat Stretch on Wall", duration: "30 sec each side", video: "RWDL68jHCvE", notes: "Arm on wall, lean away" }
    ]
  },
  {
    id: 5,
    bodyPart: "Lower Back",
    muscles: "Erector Spinae, Quadratus Lumborum",
    stretches: [
      { name: "Knees to Chest", duration: "45 sec", video: "DqRGodMPxdg", notes: "Hug both knees, rock gently" },
      { name: "Supine Twist", duration: "45 sec each side", video: "2tM_W8sPtOs", notes: "Knees fall to one side, look opposite" },
      { name: "Cat-Cow", duration: "10 reps slow", video: "kqnua4rHVVA", notes: "Alternate arch and round" }
    ]
  },
  {
    id: 6,
    bodyPart: "Hip Flexors",
    muscles: "Iliopsoas, Rectus Femoris",
    stretches: [
      { name: "Kneeling Hip Flexor Stretch", duration: "60 sec each side", video: "UWIYsL5ewug", notes: "Back knee down, squeeze glute, lean forward" },
      { name: "Couch Stretch", duration: "60 sec each side", video: "MU07BCmGXuA", notes: "Back foot on wall/couch, stand tall" }
    ]
  },
  {
    id: 7,
    bodyPart: "Glutes",
    muscles: "Gluteus Maximus, Medius, Minimus, Piriformis",
    stretches: [
      { name: "Pigeon Pose", duration: "60 sec each side", video: "SzfFkrRWyMQ", notes: "Front shin across, back leg extended" },
      { name: "Figure 4 Stretch", duration: "45 sec each side", video: "Y2S0fPPFRkU", notes: "Ankle on knee, pull thigh toward chest" },
      { name: "Seated Glute Stretch", duration: "45 sec each side", video: "mI_jPKJhtxU", notes: "Cross leg over, twist toward knee" }
    ]
  },
  {
    id: 8,
    bodyPart: "Groin / Adductors",
    muscles: "Adductor Magnus, Longus, Brevis",
    stretches: [
      { name: "Butterfly Stretch", duration: "60 sec", video: "3vkFbL2gDG8", notes: "Soles together, press knees down" },
      { name: "Frog Stretch", duration: "60 sec", video: "4Oco8R0XBUY", notes: "Knees wide, sink hips toward floor" },
      { name: "Side Lunge Stretch", duration: "45 sec each side", video: "_wyPwiGDYec", notes: "Shift weight to one side, other leg straight" }
    ]
  },
  {
    id: 9,
    bodyPart: "Quadriceps",
    muscles: "Rectus Femoris, Vastus Lateralis, Medialis, Intermedius",
    stretches: [
      { name: "Standing Quad Stretch", duration: "45 sec each leg", video: "R3u6_eFk_Lo", notes: "Pull heel to glute, knees together" },
      { name: "Lying Quad Stretch", duration: "60 sec each leg", video: "YUg89eeSfag", notes: "Side-lying, pull heel back" },
      { name: "Couch Stretch", duration: "60 sec each side", video: "MU07BCmGXuA", notes: "Also hits hip flexors" }
    ]
  },
  {
    id: 10,
    bodyPart: "Hamstrings",
    muscles: "Biceps Femoris, Semitendinosus, Semimembranosus",
    stretches: [
      { name: "Standing Hamstring Stretch", duration: "45 sec each leg", video: "Ya-h4vVtbwg", notes: "Heel on elevated surface, hinge forward" },
      { name: "Lying Hamstring Stretch", duration: "60 sec each leg", video: "FDwpEdxZ4H4", notes: "Use strap/towel, leg up toward ceiling" },
      { name: "Seated Forward Fold", duration: "60 sec", video: "GZcSJg4k0Ec", notes: "Legs extended, reach for toes" }
    ]
  },
  {
    id: 11,
    bodyPart: "Calves",
    muscles: "Gastrocnemius, Soleus",
    stretches: [
      { name: "Wall Calf Stretch", duration: "45 sec each leg", video: "5-NPJrr_C1I", notes: "Hands on wall, back leg straight" },
      { name: "Bent Knee Calf Stretch", duration: "30 sec each leg", video: "5-NPJrr_C1I", notes: "Same position, bend back knee for soleus" },
      { name: "Step Drop Stretch", duration: "30 sec each leg", video: "gwbcI1xbsZM", notes: "Heel hanging off step, let it drop" }
    ]
  },
  {
    id: 12,
    bodyPart: "Ankles & Feet",
    muscles: "Tibialis Anterior, Peroneals, Plantar Fascia, Toe Flexors",
    stretches: [
      { name: "Ankle Circles", duration: "20 each direction, each foot", video: "S9xxdAewpCk", notes: "Full range of motion" },
      { name: "Top of Foot Stretch", duration: "30 sec each foot", video: "kH6yvrz-yaM", notes: "Point toe, press top of foot into floor" },
      { name: "Toe Splay", duration: "30 sec", video: "sON7Lk0x1iE", notes: "Spread toes wide, hold" },
      { name: "Big Toe Stretch", duration: "30 sec each foot", video: "adbbCKNj1IM", notes: "Pull big toe up and back gently" }
    ]
  }
];

// ============================================================================
// NUTRITION DATA
// ============================================================================

const NUTRITION_DATA = [
  {
    rank: 1,
    name: "Health Pack Meals",
    type: "Meal Prep",
    score: "10/10",
    oilStatus: "✅ No Seed Oils",
    order: "Build-A-Bowl: 10oz Steak or Chicken + Sweet Potato + Broccoli",
    location: "340 Main St, Gaithersburg",
    why: "THE BEST. Pre-portioned macros, zero cooking, designed for athletes.",
    tip: "Get the 'Titan' size for max protein"
  },
  {
    rank: 2,
    name: "True Food Kitchen",
    type: "Restaurant",
    score: "9.5/10",
    oilStatus: "✅ 100% Seed Oil Free",
    order: "Grass-Fed Beef Burger (add extra patty) or Grilled Sustainable Salmon",
    location: "221 Rio Blvd, Gaithersburg",
    why: "100% seed oil-free. Uses ONLY olive & avocado oil.",
    tip: "Ask for double protein on any bowl"
  },
  {
    rank: 3,
    name: "Mezeh Mediterranean",
    type: "Fast-Casual",
    score: "9/10",
    oilStatus: "✅ 100% Seed Oil Free",
    order: "Build Your Own Bowl: Double Chicken Shawarma + Hummus + Greens",
    location: "262 Crown Park Ave, Gaithersburg",
    why: "100% seed oil free! Massive portions. 60g+ protein for ~$18.",
    tip: "Best value for daily post-training meals"
  },
  {
    rank: 4,
    name: "Gardenia's Cafe",
    type: "Cafe",
    score: "9/10",
    oilStatus: "✅ No Seed Oils",
    order: "Rosemary Lamb Burger (grass-fed) or Chicken Taco Salad",
    location: "8377 Snouffer School Rd, Gaithersburg",
    why: "Family-run. Only avocado and olive oil. Organic/non-GMO.",
    tip: "Great for a clean sit-down meal"
  },
  {
    rank: 5,
    name: "Sweetgreen",
    type: "Fast-Casual",
    score: "8/10",
    oilStatus: "⚠️ Order from Seed Oil-Free Menu",
    order: "Miso Glazed Salmon Plate (from Seed Oil-Free Menu)",
    location: "299 Copley Pl, Gaithersburg",
    why: "Has specific 'Seed Oil-Free Menu' since 2025.",
    tip: "Ask for the seed oil-free menu specifically"
  },
  {
    rank: 6,
    name: "ISAAC'S Poultry",
    type: "Restaurant",
    score: "7.5/10",
    oilStatus: "⚠️ Roasted = Clean, Fried = Avoid",
    order: "Half/Whole Roasted Chicken + Broccoli Salad",
    location: "12163 Darnestown Rd, Gaithersburg",
    why: "Roasted chicken is 100% clean (dry rub, no oils).",
    tip: "Stick to roasted only"
  },
  {
    rank: 7,
    name: "CAVA",
    type: "Fast-Casual",
    score: "6.5/10",
    oilStatus: "❌ Contains Seed Oils",
    order: "Braised Lamb + Grilled Chicken Bowl",
    location: "213 Kentlands Blvd, Gaithersburg",
    why: "Good protein but uses sunflower/canola oil blends.",
    tip: "Use only when other options unavailable"
  }
];

// ============================================================================
// APP COMPONENT
// ============================================================================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Icon components
const WorkoutIcon = ({ color = 'currentColor' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="4" height="8" rx="1"/>
    <rect x="17" y="8" width="4" height="8" rx="1"/>
    <path d="M7 12h10"/>
  </svg>
);

const DailyIcon = ({ color = 'currentColor' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2s-1.5.62-1.5 2a2.5 2.5 0 0 0 2.5 2.5z"/>
    <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z"/>
    <path d="M21 11h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2z"/>
    <path d="M3 11H4a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2z"/>
    <path d="M18.5 4.5a1 1 0 0 1 .5.87 1 1 0 0 1-.5.87 1 1 0 0 1-.5-.87 1 1 0 0 1 .5-.87z"/>
    <path d="M5.5 4.5a1 1 0 0 1 .5.87 1 1 0 0 1-.5.87 1 1 0 0 1-.5-.87 1 1 0 0 1 .5-.87z"/>
    <path d="M18.5 19.5a1 1 0 0 1 .5.87 1 1 0 0 1-.5.87 1 1 0 0 1-.5-.87 1 1 0 0 1 .5-.87z"/>
    <path d="M8.5 4.5a1 1 0 0 1 .5.87 1 1 0 0 1-.5.87 1 1 0 0 1-.5-.87 1 1 0 0 1 .5-.87z"/>
    <path d="M12 5.5a6.5 6.5 0 1 0 6.5 6.5 6.5 6.5 0 0 0-6.5-6.5z"/>
  </svg>
);

const ProgressIcon = ({ color = 'currentColor' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const StretchIcon = ({ color = 'currentColor' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v10"/>
    <path d="M8 21l4-4 4 4"/>
  </svg>
);

const FoodIcon = ({ color = 'currentColor' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
    <path d="M21 15v7"/>
  </svg>
);

export default function PantherApp() {
  // Navigation
  const [currentTab, setCurrentTab] = useState('workout');
  
  // Workout State
  const [currentDay, setCurrentDay] = useState(DAYS[new Date().getDay()]);
  const [session, setSession] = useState(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  
  // Fitness Daily State
  const [activeFitnessDaily, setActiveFitnessDaily] = useState(null);
  const [fitnessDailyExerciseIndex, setFitnessDailyExerciseIndex] = useState(0);
  const [fitnessDailySet, setFitnessDailySet] = useState(1);
  const [fitnessDailyResting, setFitnessDailyResting] = useState(false);
  const [fitnessDailyRestTime, setFitnessDailyRestTime] = useState(0);
  
  // Stretch State
  const [stretchMode, setStretchMode] = useState(false);
  const [currentStretchPartIndex, setCurrentStretchPartIndex] = useState(0);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(0);
  
  // Progress State
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  const wakeLockRef = useRef(null);

  const dayData = WORKOUT_DATA[currentDay];
  const sessionData = session ? dayData[session] : null;

  // Load saved state on mount
  useEffect(() => {
    const history = localStorage.getItem('pantherHistory');
    if (history) {
      setWorkoutHistory(JSON.parse(history));
    }
    calculateStreak();
    
    const saved = localStorage.getItem('pantherWorkout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedDate = new Date(parsed.date).toDateString();
        const today = new Date().toDateString();
        if (savedDate === today && parsed.workoutStarted) {
          setShowResumePrompt(true);
        } else {
          localStorage.removeItem('pantherWorkout');
        }
      } catch (e) {
        localStorage.removeItem('pantherWorkout');
      }
    }
  }, []);

  const calculateStreak = () => {
    const history = JSON.parse(localStorage.getItem('pantherHistory') || '[]');
    if (history.length === 0) {
      setCurrentStreak(0);
      return;
    }
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasWorkout = history.some(w => w.date === dateStr);
      if (hasWorkout || i === 0) {
        if (hasWorkout) streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  };

  // Save workout state
  useEffect(() => {
    if (workoutStarted) {
      const state = {
        currentDay,
        session,
        workoutStarted,
        currentSectionIndex,
        currentExerciseIndex,
        currentSet,
        isResting,
        restTime,
        completedExercises,
        date: new Date().toISOString()
      };
      localStorage.setItem('pantherWorkout', JSON.stringify(state));
    }
  }, [currentDay, session, workoutStarted, currentSectionIndex, currentExerciseIndex, currentSet, isResting, restTime, completedExercises]);

  const resumeWorkout = () => {
    const saved = localStorage.getItem('pantherWorkout');
    if (saved) {
      const state = JSON.parse(saved);
      setCurrentDay(state.currentDay);
      setSession(state.session);
      setWorkoutStarted(state.workoutStarted);
      setCurrentSectionIndex(state.currentSectionIndex);
      setCurrentExerciseIndex(state.currentExerciseIndex);
      setCurrentSet(state.currentSet);
      setIsResting(state.isResting);
      setRestTime(state.restTime);
      setCompletedExercises(state.completedExercises);
      setShowResumePrompt(false);
    }
  };

  const dismissResume = () => {
    localStorage.removeItem('pantherWorkout');
    setShowResumePrompt(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (stretchMode) {
        if (e.code === 'Space') {
          e.preventDefault();
          nextStretch();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          setStretchMode(false);
          setCurrentStretchPartIndex(0);
          setCurrentStretchIndex(0);
        }
        return;
      }
      
      if (activeFitnessDaily) {
        if (e.code === 'Space') {
          e.preventDefault();
          if (fitnessDailyResting) {
            skipFitnessDailyRest();
          } else {
            completeFitnessDailySet();
          }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        exitFitnessDaily();
      }
        return;
      }
      
      if (!workoutStarted) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isResting) {
          skipRest();
        } else {
          completeSet();
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        resetWorkout();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [workoutStarted, isResting, stretchMode, currentStretchPartIndex, currentStretchIndex, activeFitnessDaily, fitnessDailyResting]);

  // Screen wake lock
  useEffect(() => {
    const requestWakeLock = async () => {
      if ((workoutStarted || stretchMode || activeFitnessDaily) && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {}
      }
    };
    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {}
      }
    };
    if (workoutStarted || stretchMode || activeFitnessDaily) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => releaseWakeLock();
  }, [workoutStarted, stretchMode, activeFitnessDaily]);

  useEffect(() => {
    if (sessionData) {
      let total = 0;
      sessionData.sections.forEach(s => { total += s.exercises.length; });
      setTotalExercises(total);
    }
  }, [sessionData]);

  // Rest timer for main workout
  useEffect(() => {
    let timer;
    if (isResting && restTime > 0) {
      timer = setInterval(() => {
        setRestTime(t => {
          if (t <= 1) {
            playNotification();
            setIsResting(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime]);

  // Rest timer for Fitness Daily
  useEffect(() => {
    let timer;
    if (fitnessDailyResting && fitnessDailyRestTime > 0) {
      timer = setInterval(() => {
        setFitnessDailyRestTime(t => {
          if (t <= 1) {
            playNotification();
            setFitnessDailyResting(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [fitnessDailyResting, fitnessDailyRestTime]);

  const playNotification = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {}
  };

  const getCurrentExercise = () => {
    if (!sessionData) return null;
    const section = sessionData.sections[currentSectionIndex];
    if (!section) return null;
    return section.exercises[currentExerciseIndex];
  };

  const getCurrentSection = () => {
    if (!sessionData) return null;
    return sessionData.sections[currentSectionIndex];
  };

  const completeSet = () => {
    const exercise = getCurrentExercise();
    if (!exercise) return;
    if (currentSet < exercise.sets) {
      setCurrentSet(currentSet + 1);
      if (exercise.rest > 0) {
        setIsResting(true);
        setRestTime(exercise.rest);
      }
    } else {
      nextExercise();
    }
  };

  const nextExercise = () => {
    const section = getCurrentSection();
    setCompletedExercises(c => c + 1);
    if (currentExerciseIndex < section.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
    } else if (currentSectionIndex < sessionData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
    } else {
      finishWorkout();
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      const prevSection = sessionData.sections[currentSectionIndex];
      const prevExercise = prevSection.exercises[currentExerciseIndex - 1];
      setCurrentSet(prevExercise ? prevExercise.sets : 1);
      setCompletedExercises(c => Math.max(0, c - 1));
    } else if (currentSectionIndex > 0) {
      const prevSection = sessionData.sections[currentSectionIndex - 1];
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentExerciseIndex(prevSection.exercises.length - 1);
      const prevExercise = prevSection.exercises[prevSection.exercises.length - 1];
      setCurrentSet(prevExercise ? prevExercise.sets : 1);
      setCompletedExercises(c => Math.max(0, c - 1));
    }
  };

  const finishWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      day: currentDay,
      session: session,
      title: sessionData.title,
      completedAt: new Date().toISOString()
    };
    
    const history = JSON.parse(localStorage.getItem('pantherHistory') || '[]');
    history.unshift(newEntry);
    localStorage.setItem('pantherHistory', JSON.stringify(history.slice(0, 100)));
    setWorkoutHistory(history.slice(0, 100));
    calculateStreak();
    
    setWorkoutStarted(false);
    setSession(null);
    setCurrentSectionIndex(0);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setCompletedExercises(0);
    localStorage.removeItem('pantherWorkout');
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const resetWorkout = () => {
    setWorkoutStarted(false);
    setSession(null);
    setCurrentSectionIndex(0);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setRestTime(0);
    setCompletedExercises(0);
  };

  const quickStartToday = () => {
    const hour = new Date().getHours();
    const todaySession = hour < 14 ? 'am' : 'pm';
    setSession(todaySession);
    setWorkoutStarted(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const clearHistory = () => {
    if (window.confirm('Clear all workout history?')) {
      localStorage.removeItem('pantherHistory');
      setWorkoutHistory([]);
      setCurrentStreak(0);
    }
  };

  // Fitness Daily functions
  const startFitnessDaily = (key) => {
    setActiveFitnessDaily(key);
    setFitnessDailyExerciseIndex(0);
    setFitnessDailySet(1);
    setFitnessDailyResting(false);
  };

  const completeFitnessDailySet = () => {
    const workout = FITNESS_DAILY[activeFitnessDaily];
    const exercise = workout.exercises[fitnessDailyExerciseIndex];
    
    if (fitnessDailySet < exercise.sets) {
      setFitnessDailySet(fitnessDailySet + 1);
      if (exercise.rest > 0) {
        setFitnessDailyResting(true);
        setFitnessDailyRestTime(exercise.rest);
      }
    } else {
      nextFitnessDailyExercise();
    }
  };

  const nextFitnessDailyExercise = () => {
    const workout = FITNESS_DAILY[activeFitnessDaily];
    if (fitnessDailyExerciseIndex < workout.exercises.length - 1) {
      setFitnessDailyExerciseIndex(fitnessDailyExerciseIndex + 1);
      setFitnessDailySet(1);
    } else {
      finishFitnessDaily();
    }
  };

  const previousFitnessDailyExercise = () => {
    if (fitnessDailyExerciseIndex > 0) {
      setFitnessDailyExerciseIndex(fitnessDailyExerciseIndex - 1);
      const workout = FITNESS_DAILY[activeFitnessDaily];
      const prevExercise = workout.exercises[fitnessDailyExerciseIndex - 1];
      setFitnessDailySet(prevExercise ? prevExercise.sets : 1);
    }
  };

  const finishFitnessDaily = () => {
    const workout = FITNESS_DAILY[activeFitnessDaily];
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      day: DAYS[new Date().getDay()],
      session: 'daily',
      title: workout.name,
      completedAt: new Date().toISOString()
    };
    
    const history = JSON.parse(localStorage.getItem('pantherHistory') || '[]');
    history.unshift(newEntry);
    localStorage.setItem('pantherHistory', JSON.stringify(history.slice(0, 100)));
    setWorkoutHistory(history.slice(0, 100));
    calculateStreak();
    
    exitFitnessDaily();
  };

  const skipFitnessDailyRest = () => {
    setFitnessDailyResting(false);
    setFitnessDailyRestTime(0);
  };

  const exitFitnessDaily = () => {
    setActiveFitnessDaily(null);
    setFitnessDailyExerciseIndex(0);
    setFitnessDailySet(1);
    setFitnessDailyResting(false);
    setFitnessDailyRestTime(0);
  };

  // Stretch functions
  const startStretch = () => {
    setStretchMode(true);
    setCurrentStretchPartIndex(0);
    setCurrentStretchIndex(0);
  };

  const nextStretch = () => {
    const currentPart = STRETCH_DATA[currentStretchPartIndex];
    if (currentStretchIndex < currentPart.stretches.length - 1) {
      setCurrentStretchIndex(currentStretchIndex + 1);
    } else if (currentStretchPartIndex < STRETCH_DATA.length - 1) {
      setCurrentStretchPartIndex(currentStretchPartIndex + 1);
      setCurrentStretchIndex(0);
    } else {
      setStretchMode(false);
      setCurrentStretchPartIndex(0);
      setCurrentStretchIndex(0);
    }
  };

  const prevStretch = () => {
    if (currentStretchIndex > 0) {
      setCurrentStretchIndex(currentStretchIndex - 1);
    } else if (currentStretchPartIndex > 0) {
      const prevPart = STRETCH_DATA[currentStretchPartIndex - 1];
      setCurrentStretchPartIndex(currentStretchPartIndex - 1);
      setCurrentStretchIndex(prevPart.stretches.length - 1);
    }
  };

  const exitStretch = () => {
    setStretchMode(false);
    setCurrentStretchPartIndex(0);
    setCurrentStretchIndex(0);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Fitness Daily Active
  if (activeFitnessDaily) {
    const workout = FITNESS_DAILY[activeFitnessDaily];
    const exercise = workout.exercises[fitnessDailyExerciseIndex];
    const totalEx = workout.exercises.length;
    
    if (fitnessDailyResting) {
      return (
        <div style={styles.container}>
          <div style={styles.centerContent}>
            <p style={styles.restLabel}>REST</p>
            <div style={styles.restTimer}>{formatTime(fitnessDailyRestTime)}</div>
            <p style={styles.nextUpLabel}>Next: Set {fitnessDailySet}/{exercise.sets}</p>
            <button onClick={skipFitnessDailyRest} style={styles.secondaryButton}>SKIP</button>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.workoutHeader}>
          <button onClick={exitFitnessDaily} style={styles.exitButton}>✕</button>
          <div style={styles.progress}>
            <div style={styles.progressText}>{fitnessDailyExerciseIndex + 1}/{totalEx}</div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${((fitnessDailyExerciseIndex + 1) / totalEx) * 100}%`}} />
            </div>
          </div>
        </div>

        <p style={styles.sectionTag}>{workout.name}</p>
        
        <div style={styles.exerciseMain}>
          <h1 style={styles.exerciseName}>{exercise.name}</h1>
          
          <div style={styles.setRepsRow}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>SET</span>
              <span style={styles.statValue}>{fitnessDailySet}/{exercise.sets}</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>REPS</span>
              <span style={styles.statValueWhite}>{exercise.reps}</span>
            </div>
          </div>

          {exercise.notes && <p style={styles.notes}>{exercise.notes}</p>}
        </div>

        {exercise.video && (
          <div style={styles.videoContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${exercise.video}?rel=0&modestbranding=1`}
              style={styles.video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={exercise.name}
            />
          </div>
        )}

        <div style={styles.exerciseNavButtons}>
          <button 
            onClick={previousFitnessDailyExercise} 
            style={{...styles.navButton, opacity: fitnessDailyExerciseIndex === 0 ? 0.3 : 1}}
            disabled={fitnessDailyExerciseIndex === 0}
          >
            ← PREV
          </button>
          <button onClick={completeFitnessDailySet} style={styles.primaryButton}>
            {fitnessDailySet < exercise.sets ? `DONE SET ${fitnessDailySet}` : 'NEXT →'}
          </button>
        </div>
      </div>
    );
  }

  // Stretch Mode
  if (stretchMode) {
    const currentPart = STRETCH_DATA[currentStretchPartIndex];
    const currentStretchData = currentPart.stretches[currentStretchIndex];
    const totalParts = STRETCH_DATA.length;
    const totalStretchesInPart = currentPart.stretches.length;
    
    let totalStretches = 0;
    let completedStretches = 0;
    STRETCH_DATA.forEach((part, pIdx) => {
      part.stretches.forEach((s, sIdx) => {
        totalStretches++;
        if (pIdx < currentStretchPartIndex || (pIdx === currentStretchPartIndex && sIdx < currentStretchIndex)) {
          completedStretches++;
        }
      });
    });

    return (
      <div style={styles.container}>
        <div style={styles.workoutHeader}>
          <button onClick={exitStretch} style={styles.exitButton}>✕</button>
          <div style={styles.progress}>
            <div style={styles.progressText}>{completedStretches + 1}/{totalStretches} stretches</div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${((completedStretches + 1) / totalStretches) * 100}%`}} />
            </div>
          </div>
        </div>

        <div style={styles.stretchPartCard}>
          <div style={styles.stretchPartNumber}>{currentStretchPartIndex + 1}/{totalParts}</div>
          <h2 style={styles.stretchPartName}>{currentPart.bodyPart}</h2>
          <p style={styles.stretchPartMuscles}>{currentPart.muscles}</p>
        </div>

        <div style={styles.stretchMain}>
          <p style={styles.stretchCount}>Stretch {currentStretchIndex + 1} of {totalStretchesInPart}</p>
          <h1 style={styles.stretchName}>{currentStretchData.name}</h1>
          <div style={styles.stretchDuration}>{currentStretchData.duration}</div>
          {currentStretchData.notes && <p style={styles.stretchNotes}>{currentStretchData.notes}</p>}
        </div>

        {currentStretchData.video && (
          <div style={styles.videoContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${currentStretchData.video}?rel=0&modestbranding=1`}
              style={styles.video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={currentStretchData.name}
            />
          </div>
        )}

        <div style={styles.stretchNavButtons}>
          <button 
            onClick={prevStretch} 
            style={{...styles.stretchNavButton, opacity: (currentStretchPartIndex === 0 && currentStretchIndex === 0) ? 0.3 : 1}}
            disabled={currentStretchPartIndex === 0 && currentStretchIndex === 0}
          >
            ← PREV
          </button>
          <button onClick={nextStretch} style={styles.primaryButton}>
            {currentStretchPartIndex === STRETCH_DATA.length - 1 && currentStretchIndex === currentPart.stretches.length - 1 
              ? 'FINISH' 
              : 'NEXT →'}
          </button>
        </div>
      </div>
    );
  }

  // Resume prompt
  if (showResumePrompt) {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <h1 style={styles.resumeTitle}>CONTINUE?</h1>
          <p style={styles.resumeText}>Unfinished workout from today</p>
          <div style={styles.resumeButtons}>
            <button onClick={resumeWorkout} style={styles.primaryButton}>RESUME</button>
            <button onClick={dismissResume} style={styles.secondaryButton}>Start Fresh</button>
          </div>
        </div>
      </div>
    );
  }

  // Active Workout
  if (workoutStarted && sessionData) {
    const exercise = getCurrentExercise();
    const section = getCurrentSection();

    if (!exercise) {
      return (
        <div style={styles.container}>
          <div style={styles.centerContent}>
            <div style={styles.completeIcon}>✓</div>
            <h1 style={styles.completeTitle}>DONE</h1>
            <p style={styles.completeText}>Workout logged. Rest and recover.</p>
            <p style={styles.streakText}>🔥 {currentStreak} day streak</p>
            <button onClick={() => { setSession(null); setCurrentTab('workout'); }} style={styles.primaryButton}>BACK</button>
          </div>
        </div>
      );
    }

    if (isResting) {
      return (
        <div style={styles.container}>
          <div style={styles.centerContent}>
            <p style={styles.restLabel}>REST</p>
            <div style={styles.restTimer}>{formatTime(restTime)}</div>
            <p style={styles.nextUpLabel}>Next: Set {currentSet}/{exercise.sets}</p>
            <button onClick={skipRest} style={styles.secondaryButton}>SKIP</button>
          </div>
        </div>
      );
    }

    const canGoBack = currentSectionIndex > 0 || currentExerciseIndex > 0;

    return (
      <div style={styles.container}>
        <div style={styles.workoutHeader}>
          <button onClick={resetWorkout} style={styles.exitButton}>✕</button>
          <div style={styles.progress}>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${(completedExercises / totalExercises) * 100}%`}} />
            </div>
          </div>
        </div>

        <p style={styles.sectionTag}>{section.name}</p>
        
        <div style={styles.exerciseMain}>
          <h1 style={styles.exerciseName}>{exercise.name}</h1>
          
          <div style={styles.setRepsRow}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>SET</span>
              <span style={styles.statValue}>{currentSet}/{exercise.sets}</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>REPS</span>
              <span style={styles.statValueWhite}>{exercise.reps}</span>
            </div>
          </div>

          {exercise.notes && <p style={styles.notes}>{exercise.notes}</p>}
        </div>

        {exercise.video && (
          <div style={styles.videoContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${exercise.video}?rel=0&modestbranding=1`}
              style={styles.video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={exercise.name}
            />
          </div>
        )}

        <div style={styles.exerciseNavButtons}>
          <button 
            onClick={previousExercise} 
            style={{...styles.navButton, opacity: canGoBack ? 1 : 0.3}}
            disabled={!canGoBack}
          >
            ← PREV
          </button>
          <button onClick={completeSet} style={styles.primaryButton}>
            {currentSet < exercise.sets ? `DONE SET ${currentSet}` : 'NEXT →'}
          </button>
        </div>
      </div>
    );
  }

  // Progress Tab
  if (currentTab === 'progress') {
    return (
      <div style={styles.container}>
        <div style={styles.tabHeader}>
          <h1 style={styles.tabTitle}>PROGRESS</h1>
        </div>

        <div style={styles.streakCard}>
          <span style={styles.streakEmoji}>🔥</span>
          <span style={styles.streakNumber}>{currentStreak}</span>
          <span style={styles.streakLabel}>DAY STREAK</span>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.miniStat}>
            <span style={styles.miniStatNumber}>{workoutHistory.length}</span>
            <span style={styles.miniStatLabel}>Total</span>
          </div>
          <div style={styles.miniStat}>
            <span style={styles.miniStatNumber}>{workoutHistory.filter(w => w.session === 'am').length}</span>
            <span style={styles.miniStatLabel}>AM</span>
          </div>
          <div style={styles.miniStat}>
            <span style={styles.miniStatNumber}>{workoutHistory.filter(w => w.session === 'pm').length}</span>
            <span style={styles.miniStatLabel}>PM</span>
          </div>
        </div>

        <h2 style={styles.sectionHeader}>Recent Workouts</h2>
        
        <div style={styles.historyList}>
          {workoutHistory.length === 0 ? (
            <p style={styles.emptyText}>No workouts yet. Start training!</p>
          ) : (
            workoutHistory.slice(0, 20).map((w, i) => (
              <div key={i} style={styles.historyItem}>
                <div style={styles.historyLeft}>
                  <span style={styles.historyTitle}>{w.title}</span>
                  <span style={styles.historyMeta}>{w.day} • {w.session.toUpperCase()}</span>
                </div>
                <span style={styles.historyDate}>{new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))
          )}
        </div>

        {workoutHistory.length > 0 && (
          <button onClick={clearHistory} style={styles.dangerButton}>Clear History</button>
        )}

        <div style={styles.bottomNav}>
          <button onClick={() => setCurrentTab('workout')} style={styles.navItem}>
            <span style={styles.navIcon}><WorkoutIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Workout</span>
          </button>
          <button onClick={() => setCurrentTab('daily')} style={styles.navItem}>
            <span style={styles.navIcon}><DailyIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Daily</span>
          </button>
          <button onClick={() => setCurrentTab('progress')} style={{...styles.navItem, ...styles.navItemActive}}>
            <span style={styles.navIcon}><ProgressIcon color="currentColor" /></span>
            <span style={styles.navLabelActive}>Progress</span>
          </button>
          <button onClick={() => setCurrentTab('stretch')} style={styles.navItem}>
            <span style={styles.navIcon}><StretchIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Stretch</span>
          </button>
          <button onClick={() => setCurrentTab('nutrition')} style={styles.navItem}>
            <span style={styles.navIcon}><FoodIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Food</span>
          </button>
        </div>
      </div>
    );
  }

  // Fitness Daily Tab
  if (currentTab === 'daily') {
    return (
      <div style={styles.container}>
        <div style={styles.tabHeader}>
          <h1 style={styles.tabTitle}>FITNESS DAILY</h1>
          <p style={styles.tabSubtitle}>15-20 min destruction workouts</p>
        </div>

        <div style={styles.dailyList}>
          {Object.entries(FITNESS_DAILY).map(([key, workout]) => (
            <button
              key={key}
              onClick={() => startFitnessDaily(key)}
              style={styles.dailyCard}
            >
              <div style={styles.dailyCardLeft}>
                <span style={styles.dailyEmoji}>{workout.emoji}</span>
                <div>
                  <span style={styles.dailyName}>{workout.name}</span>
                  <span style={styles.dailyDesc}>{workout.description}</span>
                </div>
              </div>
              <span style={styles.dailyDuration}>{workout.duration}</span>
            </button>
          ))}
        </div>

        <div style={styles.bottomNav}>
          <button onClick={() => setCurrentTab('workout')} style={styles.navItem}>
            <span style={styles.navIcon}><WorkoutIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Workout</span>
          </button>
          <button onClick={() => setCurrentTab('daily')} style={{...styles.navItem, ...styles.navItemActive}}>
            <span style={styles.navIcon}><DailyIcon color="currentColor" /></span>
            <span style={styles.navLabelActive}>Daily</span>
          </button>
          <button onClick={() => setCurrentTab('progress')} style={styles.navItem}>
            <span style={styles.navIcon}><ProgressIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Progress</span>
          </button>
          <button onClick={() => setCurrentTab('stretch')} style={styles.navItem}>
            <span style={styles.navIcon}><StretchIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Stretch</span>
          </button>
          <button onClick={() => setCurrentTab('nutrition')} style={styles.navItem}>
            <span style={styles.navIcon}><FoodIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Food</span>
          </button>
        </div>
      </div>
    );
  }

  // Stretch Tab
  if (currentTab === 'stretch') {
    return (
      <div style={styles.container}>
        <div style={styles.tabHeader}>
          <h1 style={styles.tabTitle}>FULL BODY STRETCH</h1>
          <p style={styles.tabSubtitle}>12 body parts • ~20 minutes</p>
        </div>

        <button onClick={startStretch} style={styles.quickStartButton}>
          START STRETCH ROUTINE
        </button>

        <h2 style={styles.sectionHeader}>Body Parts Covered</h2>
        
        <div style={styles.stretchList}>
          {STRETCH_DATA.map((part, i) => (
            <div key={i} style={styles.stretchListItem}>
              <div style={styles.stretchListNumber}>{i + 1}</div>
              <div style={styles.stretchListInfo}>
                <span style={styles.stretchListName}>{part.bodyPart}</span>
                <span style={styles.stretchListMuscles}>{part.stretches.length} stretches</span>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.bottomNav}>
          <button onClick={() => setCurrentTab('workout')} style={styles.navItem}>
            <span style={styles.navIcon}><WorkoutIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Workout</span>
          </button>
          <button onClick={() => setCurrentTab('daily')} style={styles.navItem}>
            <span style={styles.navIcon}><DailyIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Daily</span>
          </button>
          <button onClick={() => setCurrentTab('progress')} style={styles.navItem}>
            <span style={styles.navIcon}><ProgressIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Progress</span>
          </button>
          <button onClick={() => setCurrentTab('stretch')} style={{...styles.navItem, ...styles.navItemActive}}>
            <span style={styles.navIcon}><StretchIcon color="currentColor" /></span>
            <span style={styles.navLabelActive}>Stretch</span>
          </button>
          <button onClick={() => setCurrentTab('nutrition')} style={styles.navItem}>
            <span style={styles.navIcon}><FoodIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Food</span>
          </button>
        </div>
      </div>
    );
  }

  // Nutrition Tab
  if (currentTab === 'nutrition') {
    return (
      <div style={styles.container}>
        <div style={styles.tabHeader}>
          <h1 style={styles.tabTitle}>NUTRITION</h1>
          <p style={styles.tabSubtitle}>Muscle-building • No seed oils</p>
        </div>

        <div style={styles.nutritionList}>
          {NUTRITION_DATA.map((r, i) => (
            <div key={i} style={styles.restaurantCard}>
              <div style={styles.restaurantHeader}>
                <span style={styles.restaurantRank}>#{r.rank}</span>
                <span style={styles.restaurantScore}>{r.score}</span>
              </div>
              <h3 style={styles.restaurantName}>{r.name}</h3>
              <p style={styles.restaurantType}>{r.type} • {r.location}</p>
              <div style={styles.restaurantOil}>{r.oilStatus}</div>
              <p style={styles.restaurantOrder}>🥊 {r.order}</p>
              <p style={styles.restaurantWhy}>{r.why}</p>
              {r.tip && <p style={styles.restaurantTip}>💡 {r.tip}</p>}
            </div>
          ))}
        </div>

        <div style={styles.bottomNav}>
          <button onClick={() => setCurrentTab('workout')} style={styles.navItem}>
            <span style={styles.navIcon}><WorkoutIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Workout</span>
          </button>
          <button onClick={() => setCurrentTab('daily')} style={styles.navItem}>
            <span style={styles.navIcon}><DailyIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Daily</span>
          </button>
          <button onClick={() => setCurrentTab('progress')} style={styles.navItem}>
            <span style={styles.navIcon}><ProgressIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Progress</span>
          </button>
          <button onClick={() => setCurrentTab('stretch')} style={styles.navItem}>
            <span style={styles.navIcon}><StretchIcon color="currentColor" /></span>
            <span style={styles.navLabel}>Stretch</span>
          </button>
          <button onClick={() => setCurrentTab('nutrition')} style={{...styles.navItem, ...styles.navItemActive}}>
            <span style={styles.navIcon}><FoodIcon color="currentColor" /></span>
            <span style={styles.navLabelActive}>Food</span>
          </button>
        </div>
      </div>
    );
  }

  // Workout Tab (Home)
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/panther-logo.svg" alt="Panther Logo" style={styles.logoImage} />
        <h1 style={styles.title}>PANTHER</h1>
        {currentStreak > 0 && <p style={styles.headerStreak}>🔥 {currentStreak} day streak</p>}
      </div>

      <button onClick={quickStartToday} style={styles.quickStartButton}>
        START TODAY'S WORKOUT
      </button>

      <div style={styles.divider}>
        <span style={styles.dividerText}>or choose</span>
      </div>

      <select
        value={currentDay}
        onChange={(e) => setCurrentDay(e.target.value)}
        style={styles.select}
      >
        {DAYS.map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <div style={styles.dayCard}>
        <h2 style={styles.dayName}>{currentDay.toUpperCase()}</h2>
        <h3 style={styles.dayFocus}>{dayData.name}</h3>
      </div>

      <div style={styles.sessionButtons}>
        <button
          onClick={() => { setSession('am'); setWorkoutStarted(true); }}
          style={styles.sessionButton}
        >
          <div>
            <span style={styles.sessionTime}>AM</span>
            <span style={styles.sessionTitle}>{dayData.am.title}</span>
          </div>
          <span style={styles.sessionDuration}>{dayData.am.duration}</span>
        </button>

        <button
          onClick={() => { setSession('pm'); setWorkoutStarted(true); }}
          style={{...styles.sessionButton, ...styles.pmButton}}
        >
          <div>
            <span style={{...styles.sessionTime, color: '#ECF0F1'}}>PM</span>
            <span style={{...styles.sessionTitle, color: '#ECF0F1'}}>{dayData.pm.title}</span>
          </div>
          <span style={{...styles.sessionDuration, color: '#BDC3C7'}}>{dayData.pm.duration}</span>
        </button>
      </div>

      <div style={styles.bottomNav}>
        <button onClick={() => setCurrentTab('workout')} style={{...styles.navItem, ...styles.navItemActive}}>
          <span style={styles.navIcon}><WorkoutIcon color="currentColor" /></span>
          <span style={styles.navLabelActive}>Workout</span>
        </button>
        <button onClick={() => setCurrentTab('daily')} style={styles.navItem}>
          <span style={styles.navIcon}><DailyIcon color="currentColor" /></span>
          <span style={styles.navLabel}>Daily</span>
        </button>
        <button onClick={() => setCurrentTab('progress')} style={styles.navItem}>
          <span style={styles.navIcon}><ProgressIcon color="currentColor" /></span>
          <span style={styles.navLabel}>Progress</span>
        </button>
        <button onClick={() => setCurrentTab('stretch')} style={styles.navItem}>
          <span style={styles.navIcon}><StretchIcon color="currentColor" /></span>
          <span style={styles.navLabel}>Stretch</span>
        </button>
        <button onClick={() => setCurrentTab('nutrition')} style={styles.navItem}>
          <span style={styles.navIcon}><FoodIcon color="currentColor" /></span>
          <span style={styles.navLabel}>Food</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
    paddingBottom: '100px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '430px',
    margin: '0 auto',
    boxSizing: 'border-box',
    transition: 'opacity 0.3s ease-in-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    paddingTop: '16px',
  },
  logoImage: {
    width: '80px',
    height: '80px',
    marginBottom: '12px',
    display: 'block',
    margin: '0 auto 12px auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '6px',
    margin: 0,
  },
  headerStreak: {
    fontSize: '14px',
    color: '#95A5A6',
    marginTop: '8px',
  },
  quickStartButton: {
    backgroundColor: '#5D6D7E',
    color: '#ECF0F1',
    border: 'none',
    borderRadius: '16px',
    padding: '20px 24px',
    fontSize: '17px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    marginBottom: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  divider: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  dividerText: {
    fontSize: '12px',
    color: '#666',
    letterSpacing: '1px',
  },
  select: {
    width: '100%',
    padding: '16px 40px 16px 16px',
    fontSize: '16px',
    backgroundColor: '#1A1A1A',
    color: '#ECF0F1',
    border: '2px solid #2C2C2C',
    borderRadius: '12px',
    marginBottom: '16px',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2395A5A6' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  dayCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '16px',
    border: '2px solid #2C2C2C',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dayName: {
    fontSize: '11px',
    letterSpacing: '3px',
    color: '#666',
    margin: '0 0 6px 0',
  },
  dayFocus: {
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    color: '#95A5A6',
  },
  sessionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sessionButton: {
    backgroundColor: '#1A1A1A',
    border: '2px solid #2C2C2C',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  pmButton: {
    backgroundColor: '#5D6D7E',
    borderColor: '#5D6D7E',
    boxShadow: '0 4px 12px rgba(93, 109, 126, 0.3), 0 2px 4px rgba(0,0,0,0.2)',
  },
  sessionTime: {
    display: 'block',
    fontSize: '11px',
    letterSpacing: '1px',
    color: '#95A5A6',
    fontWeight: '600',
  },
  sessionTitle: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    marginTop: '2px',
  },
  sessionDuration: {
    fontSize: '13px',
    color: '#666',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderTop: '1px solid #2C2C2C',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    maxWidth: '430px',
    margin: '0 auto',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.5)',
  },
  navItem: {
    background: 'none',
    border: 'none',
    color: '#666',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
    padding: '6px 8px',
  },
  navItemActive: {
    color: '#BDC3C7',
  },
  navIcon: {
    fontSize: '18px',
  },
  navLabel: {
    fontSize: '9px',
    letterSpacing: '0.5px',
  },
  navLabelActive: {
    fontSize: '9px',
    letterSpacing: '0.5px',
    color: '#BDC3C7',
  },
  workoutHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  exitButton: {
    backgroundColor: 'rgba(93, 109, 126, 0.2)',
    border: '2px solid rgba(93, 109, 126, 0.3)',
    color: '#95A5A6',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  progress: {
    flex: 1,
  },
  progressText: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '4px',
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#2C2C2C',
    borderRadius: '2px',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #7F8C8D, #95A5A6)',
    transition: 'width 0.3s',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
  },
  sectionTag: {
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#95A5A6',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  exerciseMain: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  exerciseName: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    lineHeight: 1.3,
  },
  setRepsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: '16px 24px',
    borderRadius: '12px',
    border: '2px solid #2C2C2C',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  statLabel: {
    fontSize: '10px',
    letterSpacing: '1px',
    color: '#666',
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#BDC3C7',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  statValueWhite: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
  },
  notes: {
    fontSize: '13px',
    color: '#BDC3C7',
    margin: 0,
    padding: '10px 14px',
    backgroundColor: '#1A1A1A',
    borderRadius: '8px',
    textAlign: 'left',
    border: '1px solid #2C2C2C',
    boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.4), inset 1px 1px 3px rgba(255,255,255,0.03)',
  },
  videoContainer: {
    aspectRatio: '16/9',
    marginBottom: '16px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    border: '1px solid #3A3A3A',
    boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
  },
  video: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  primaryButton: {
    backgroundColor: '#5D6D7E',
    color: '#ECF0F1',
    border: 'none',
    borderRadius: '12px',
    padding: '18px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    border: '2px solid #5D6D7E',
    color: '#95A5A6',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(93, 109, 126, 0.1)',
  },
  dangerButton: {
    background: 'none',
    border: '1px solid #500',
    color: '#a00',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    textAlign: 'center',
  },
  restLabel: {
    fontSize: '13px',
    letterSpacing: '4px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  restTimer: {
    fontSize: '64px',
    fontWeight: '700',
    color: '#BDC3C7',
    margin: '0 0 12px 0',
    fontFamily: "monospace",
    textShadow: '2px 2px 4px rgba(0,0,0,0.5), -1px -1px 2px rgba(255,255,255,0.1)',
  },
  nextUpLabel: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '24px',
  },
  completeIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#5D6D7E',
    color: '#ECF0F1',
    fontSize: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    background: 'linear-gradient(145deg, #6B7D8E, #4D5D6E)',
    boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.5), inset 2px 2px 6px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.3)',
  },
  completeTitle: {
    fontSize: '26px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  completeText: {
    fontSize: '15px',
    color: '#888',
    margin: '0 0 8px 0',
  },
  streakText: {
    fontSize: '18px',
    color: '#95A5A6',
    margin: '0 0 24px 0',
  },
  resumeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  resumeText: {
    fontSize: '15px',
    color: '#888',
    marginBottom: '32px',
  },
  resumeButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '280px',
  },
  tabHeader: {
    textAlign: 'center',
    marginBottom: '24px',
    paddingTop: '16px',
  },
  tabTitle: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '4px',
    margin: 0,
  },
  tabSubtitle: {
    fontSize: '12px',
    color: '#666',
    marginTop: '6px',
  },
  streakCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: '16px',
    padding: '28px',
    textAlign: 'center',
    marginBottom: '20px',
    border: '2px solid #2C2C2C',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  streakEmoji: {
    fontSize: '36px',
    marginBottom: '8px',
  },
  streakNumber: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#BDC3C7',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  streakLabel: {
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#666',
    marginTop: '4px',
  },
  statsRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
  },
  miniStat: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    border: '2px solid #2C2C2C',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  miniStatNumber: {
    display: 'block',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
  },
  miniStatLabel: {
    display: 'block',
    fontSize: '10px',
    color: '#666',
    marginTop: '4px',
  },
  sectionHeader: {
    fontSize: '12px',
    letterSpacing: '2px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  historyItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #2C2C2C',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  historyLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  historyTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  historyMeta: {
    fontSize: '11px',
    color: '#666',
    marginTop: '2px',
  },
  historyDate: {
    fontSize: '12px',
    color: '#666',
  },
  emptyText: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    padding: '40px 0',
  },
  nutritionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  restaurantCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: '16px',
    padding: '18px',
    border: '2px solid #2C2C2C',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  restaurantHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  restaurantRank: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#BDC3C7',
  },
  restaurantScore: {
    fontSize: '13px',
    color: '#4CAF50',
    fontWeight: '600',
  },
  restaurantName: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  restaurantType: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0',
  },
  restaurantOil: {
    fontSize: '12px',
    marginBottom: '10px',
    padding: '6px 10px',
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    display: 'inline-block',
  },
  restaurantOrder: {
    fontSize: '14px',
    color: '#95A5A6',
    margin: '0 0 8px 0',
    fontWeight: '600',
  },
  restaurantWhy: {
    fontSize: '13px',
    color: '#aaa',
    margin: '0 0 8px 0',
    lineHeight: 1.5,
  },
  restaurantTip: {
    fontSize: '12px',
    color: '#4CAF50',
    margin: 0,
    fontStyle: 'italic',
  },
  // Fitness Daily styles
  dailyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dailyCard: {
    backgroundColor: '#1A1A1A',
    border: '2px solid #2C2C2C',
    borderRadius: '16px',
    padding: '18px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  dailyCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dailyEmoji: {
    fontSize: '24px',
  },
  dailyName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
  },
  dailyDesc: {
    display: 'block',
    fontSize: '11px',
    color: '#666',
    marginTop: '2px',
  },
  dailyDuration: {
    fontSize: '12px',
    color: '#95A5A6',
    fontWeight: '600',
  },
  // Stretch styles
  stretchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stretchListItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    border: '2px solid #2C2C2C',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stretchListNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#5D6D7E',
    color: '#ECF0F1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stretchListInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  stretchListName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
  },
  stretchListMuscles: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
  stretchPartCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '16px',
    border: '2px solid #5D6D7E',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stretchPartNumber: {
    fontSize: '11px',
    color: '#666',
    letterSpacing: '2px',
    marginBottom: '4px',
  },
  stretchPartName: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#BDC3C7',
    margin: '0 0 4px 0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  stretchPartMuscles: {
    fontSize: '12px',
    color: '#888',
    margin: 0,
  },
  stretchMain: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  stretchCount: {
    fontSize: '11px',
    color: '#666',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  stretchName: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 12px 0',
  },
  stretchDuration: {
    fontSize: '18px',
    color: '#95A5A6',
    fontWeight: '600',
    marginBottom: '8px',
  },
  stretchNotes: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  stretchNavButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  stretchNavButton: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '2px solid #5D6D7E',
    color: '#95A5A6',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(93, 109, 126, 0.1)',
  },
  navButton: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '2px solid #5D6D7E',
    color: '#95A5A6',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(93, 109, 126, 0.1)',
  },
  exerciseNavButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
};
