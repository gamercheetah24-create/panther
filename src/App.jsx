import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// PANTHER v6.0 — LOCAL-FIRST DAILY UTILITY
// ============================================================================
//
// 1. SCRIPT  — Read-only daily workout view with rest timers
// 2. SHOP    — Import & curate weekly Factor / HelloFresh meals
// 3. FUEL    — Daily nutrition checklist (staples + selected meals)
// 4. GAINS   — Bodyweight, weighted pull-up, grip/hang tracking + charts
//
// 100% client-side · localStorage persistence · GitHub Pages
// ============================================================================

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// ============================================================================
// WORKOUT DATA
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
// DAILY STAPLES — fixed macros
// ============================================================================

const DAILY_STAPLES = [
  { id: 'yogurt',   name: 'Greek Yogurt + Go Raw Pumpkin Seeds', cal: 180, pro: 8 },
  { id: 'collagen', name: 'Vital Proteins Collagen',             cal: 70,  pro: 18 },
  { id: 'shake',    name: 'Factor Protein Shake',                cal: 210, pro: 32 },
  { id: 'bar',      name: "Honey Mama's Protein Bar",            cal: 260, pro: 13 },
];

// ============================================================================
// UTILITIES
// ============================================================================

const parseNum = (s) => parseFloat(s) || 0;

const parseMealMacros = (nutrition) => ({
  cal: Math.round(parseNum(nutrition?.Calories)),
  pro: Math.round(parseNum(nutrition?.Protein)),
});

const todayStr = () => new Date().toISOString().split('T')[0];

const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const fmtDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

const safeJsonParse = (str, fallback) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

// ============================================================================
// MINI CHART — simple SVG line chart
// ============================================================================

function MiniChart({ data, label, unit, color }) {
  if (!data || data.length < 2) {
    return (
      <div style={S.chartWrap}>
        <span style={S.chartLabel}>{label}</span>
        <div style={S.chartEmpty}>Need 2+ entries to chart</div>
      </div>
    );
  }

  const W = 320, H = 130;
  const pad = { t: 15, r: 10, b: 28, l: 42 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const vals = data.map(d => d.v);
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const rng = mx - mn || 1;

  const pts = data.map((d, i) => ({
    x: pad.l + (data.length === 1 ? pw / 2 : (i / (data.length - 1)) * pw),
    y: pad.t + ph - ((d.v - mn) / rng) * ph,
    ...d,
  }));

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div style={S.chartWrap}>
      <span style={S.chartLabel}>{label}</span>
      <svg viewBox={`0 0 ${W} ${H}`} style={S.chartSvg}>
        {[0, 0.5, 1].map(f => {
          const y = pad.t + (1 - f) * ph;
          const val = (mn + f * rng).toFixed(unit === 'lbs' || unit === 's' ? 0 : 1);
          return (
            <g key={f}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#2C2C2C" strokeWidth="1" />
              <text x={pad.l - 6} y={y + 3} fill="#666" fontSize="9" textAnchor="end">{val}{unit}</text>
            </g>
          );
        })}
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="#000" strokeWidth="1.5" />
        ))}
        {pts.length > 0 && (
          <>
            <text x={pts[0].x} y={H - 5} fill="#666" fontSize="8" textAnchor="start">
              {fmtDate(pts[0].date)}
            </text>
            {pts.length > 1 && (
              <text x={pts[pts.length - 1].x} y={H - 5} fill="#666" fontSize="8" textAnchor="end">
                {fmtDate(pts[pts.length - 1].date)}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

// ============================================================================
// TAB ICONS
// ============================================================================

const ScriptIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#BDC3C7' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="12" y2="15" />
  </svg>
);

const ShopIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#BDC3C7' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const FuelIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#BDC3C7' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const GainsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#BDC3C7' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// ============================================================================
// MAIN APP
// ============================================================================

export default function PantherApp() {
  const [tab, setTab] = useState('script');

  // ---- SCRIPT state ----
  const [scriptSession, setScriptSession] = useState(() => new Date().getHours() < 14 ? 'am' : 'pm');
  const [restTimer, setRestTimer] = useState(null);
  const timerRef = useRef(null);
  const wakeLockRef = useRef(null);

  // ---- SHOP state ----
  const [factorMeals, setFactorMeals] = useState(() => safeJsonParse(localStorage.getItem('p_factor_meals'), null));
  const [hfMeals, setHfMeals] = useState(() => safeJsonParse(localStorage.getItem('p_hf_meals'), null));
  const [factorSel, setFactorSel] = useState(() => safeJsonParse(localStorage.getItem('p_factor_sel'), []));
  const [hfSel, setHfSel] = useState(() => safeJsonParse(localStorage.getItem('p_hf_sel'), []));
  const [shopSearch, setShopSearch] = useState('');
  const [shopSection, setShopSection] = useState('factor');
  const [showImport, setShowImport] = useState(null);
  const [importText, setImportText] = useState('');

  // ---- FUEL state ----
  const [fuelDate, setFuelDate] = useState(todayStr);
  const [fuelChecks, setFuelChecks] = useState({});

  // ---- GAINS state ----
  const [gainsLog, setGainsLog] = useState(() => safeJsonParse(localStorage.getItem('p_gains'), []));
  const [gForm, setGForm] = useState({ bodyweight: '', puWeight: '', puReps: '', puSets: '', hangEdge: '', hangWeight: '', hangTime: '' });
  const [gainsView, setGainsView] = useState('log');

  const today = DAYS[new Date().getDay()];
  const dayData = WORKOUT_DATA[today];

  // ---- Load fuel checks for current date ----
  useEffect(() => {
    const saved = localStorage.getItem(`p_fuel_${fuelDate}`);
    setFuelChecks(saved ? safeJsonParse(saved, {}) : {});
  }, [fuelDate]);

  // ---- Persist shop data ----
  useEffect(() => { if (factorMeals) localStorage.setItem('p_factor_meals', JSON.stringify(factorMeals)); }, [factorMeals]);
  useEffect(() => { if (hfMeals) localStorage.setItem('p_hf_meals', JSON.stringify(hfMeals)); }, [hfMeals]);
  useEffect(() => { localStorage.setItem('p_factor_sel', JSON.stringify(factorSel)); }, [factorSel]);
  useEffect(() => { localStorage.setItem('p_hf_sel', JSON.stringify(hfSel)); }, [hfSel]);

  // ---- Rest timer tick ----
  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      timerRef.current = setTimeout(() => {
        setRestTimer(r => {
          if (r <= 1) { playBeep(); return null; }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [restTimer]);

  // ---- Screen wake lock when timer running ----
  useEffect(() => {
    const acquire = async () => {
      if (restTimer !== null && 'wakeLock' in navigator) {
        try { wakeLockRef.current = await navigator.wakeLock.request('screen'); } catch {}
      }
    };
    const release = async () => {
      if (wakeLockRef.current) {
        try { await wakeLockRef.current.release(); wakeLockRef.current = null; } catch {}
      }
    };
    if (restTimer !== null) acquire(); else release();
    return () => release();
  }, [restTimer !== null]);

  // ---- Handlers ----

  const startRest = (seconds) => setRestTimer(seconds);
  const cancelRest = () => { setRestTimer(null); clearTimeout(timerRef.current); };

  const importMeals = (brand) => {
    let raw;
    try { raw = JSON.parse(importText); } catch { alert('Invalid JSON'); return; }
    const meals = (raw.meals || []).map(m => ({
      name: m.meal || m.name || 'Unknown',
      headline: m.headline || '',
      ...parseMealMacros(m.nutrition),
      category: (typeof m.category === 'object' ? m.category?.name : m.category) || '',
      type: m.meal_type || 'Meal',
    }));
    if (meals.length === 0) { alert('No meals found in JSON'); return; }
    const data = { week: raw.week || '', scraped: raw.scraped_on || '', meals };
    if (brand === 'factor') { setFactorMeals(data); setFactorSel([]); }
    else { setHfMeals(data); setHfSel([]); }
    setImportText('');
    setShowImport(null);
  };

  const handleFileImport = (brand, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let raw;
      try { raw = JSON.parse(e.target.result); } catch { alert('Invalid JSON file'); return; }
      const meals = (raw.meals || []).map(m => ({
        name: m.meal || m.name || 'Unknown',
        headline: m.headline || '',
        ...parseMealMacros(m.nutrition),
        category: (typeof m.category === 'object' ? m.category?.name : m.category) || '',
        type: m.meal_type || 'Meal',
      }));
      if (meals.length === 0) { alert('No meals found'); return; }
      const data = { week: raw.week || '', scraped: raw.scraped_on || '', meals };
      if (brand === 'factor') { setFactorMeals(data); setFactorSel([]); }
      else { setHfMeals(data); setHfSel([]); }
    };
    reader.readAsText(file);
  };

  const toggleShopSel = (brand, idx) => {
    if (brand === 'factor') {
      setFactorSel(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : prev.length < 7 ? [...prev, idx] : prev);
    } else {
      setHfSel(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : prev.length < 7 ? [...prev, idx] : prev);
    }
  };

  const toggleFuel = (key) => {
    setFuelChecks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`p_fuel_${fuelDate}`, JSON.stringify(next));
      return next;
    });
  };

  const shiftFuelDate = (days) => {
    const d = new Date(fuelDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setFuelDate(d.toISOString().split('T')[0]);
  };

  const logGains = () => {
    const entry = {
      date: todayStr(),
      bodyweight: parseFloat(gForm.bodyweight) || null,
      pullup: (gForm.puWeight || gForm.puReps) ? {
        weight: parseFloat(gForm.puWeight) || 0,
        reps: parseInt(gForm.puReps) || 0,
        sets: parseInt(gForm.puSets) || 1,
      } : null,
      hang: (gForm.hangEdge || gForm.hangTime) ? {
        edge: parseFloat(gForm.hangEdge) || 0,
        weight: parseFloat(gForm.hangWeight) || 0,
        time: parseFloat(gForm.hangTime) || 0,
      } : null,
    };
    if (!entry.bodyweight && !entry.pullup && !entry.hang) return;
    const next = [entry, ...gainsLog].slice(0, 500);
    setGainsLog(next);
    localStorage.setItem('p_gains', JSON.stringify(next));
    setGForm({ bodyweight: '', puWeight: '', puReps: '', puSets: '', hangEdge: '', hangWeight: '', hangTime: '' });
  };

  const deleteGains = (idx) => {
    const next = gainsLog.filter((_, i) => i !== idx);
    setGainsLog(next);
    localStorage.setItem('p_gains', JSON.stringify(next));
  };

  // ---- Computed: fuel macros ----
  const getSelectedMeals = (brand) => {
    const src = brand === 'factor' ? factorMeals : hfMeals;
    const sel = brand === 'factor' ? factorSel : hfSel;
    if (!src) return [];
    return sel.map(i => src.meals[i]).filter(Boolean);
  };

  const fuelTotal = (() => {
    let cal = 0, pro = 0;
    DAILY_STAPLES.forEach(s => { if (fuelChecks[`s_${s.id}`]) { cal += s.cal; pro += s.pro; } });
    getSelectedMeals('factor').forEach((m, i) => { if (fuelChecks[`f_${i}`]) { cal += m.cal; pro += m.pro; } });
    getSelectedMeals('hf').forEach((m, i) => { if (fuelChecks[`h_${i}`]) { cal += m.cal; pro += m.pro; } });
    return { cal, pro };
  })();

  // ============================================================================
  // RENDER: SCRIPT TAB
  // ============================================================================

  const renderScript = () => {
    const session = dayData[scriptSession];
    return (
      <>
        <div style={S.scriptHeader}>
          <h1 style={S.scriptDay}>{today.toUpperCase()}</h1>
          <p style={S.scriptFocus}>{dayData.name}</p>
        </div>

        <div style={S.sessionToggle}>
          <button
            onClick={() => setScriptSession('am')}
            style={{...S.toggleBtn, ...(scriptSession === 'am' ? S.toggleActive : {})}}
          >AM — {dayData.am.title}</button>
          <button
            onClick={() => setScriptSession('pm')}
            style={{...S.toggleBtn, ...(scriptSession === 'pm' ? S.toggleActive : {})}}
          >PM — {dayData.pm.title}</button>
        </div>

        <div style={S.sessionMeta}>
          <span style={S.metaDuration}>{session.duration}</span>
        </div>

        {session.sections.map((sec, si) => (
          <div key={si} style={S.scriptSection}>
            <div style={S.sectionTag}>{sec.name}</div>
            {sec.exercises.map((ex, ei) => (
              <div key={ei} style={S.scriptCard}>
                <div style={S.scriptCardTop}>
                  <h3 style={S.scriptExName}>{ex.name}</h3>
                  {ex.video && (
                    <a
                      href={`https://www.youtube.com/watch?v=${ex.video}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={S.videoLink}
                      title="Watch form video"
                    >▶</a>
                  )}
                </div>
                <div style={S.scriptMeta}>
                  <span style={S.scriptSets}>{ex.sets} × {ex.reps}</span>
                  {ex.rest > 0 && (
                    <button
                      onClick={() => startRest(ex.rest)}
                      style={S.restBtn}
                    >REST {ex.rest}s</button>
                  )}
                </div>
                {ex.notes && <p style={S.scriptNotes}>{ex.notes}</p>}
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  // ============================================================================
  // RENDER: SHOP TAB
  // ============================================================================

  const renderShop = () => {
    const src = shopSection === 'factor' ? factorMeals : hfMeals;
    const sel = shopSection === 'factor' ? factorSel : hfSel;
    const brand = shopSection === 'factor' ? 'factor' : 'hf';
    const brandLabel = shopSection === 'factor' ? 'Factor' : 'HelloFresh';

    const filteredMeals = src ? src.meals.filter(m =>
      m.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      m.headline.toLowerCase().includes(shopSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(shopSearch.toLowerCase())
    ) : [];

    const filteredIndices = src ? src.meals.map((m, i) => i).filter(i => {
      const m = src.meals[i];
      return m.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
        m.headline.toLowerCase().includes(shopSearch.toLowerCase()) ||
        m.category.toLowerCase().includes(shopSearch.toLowerCase());
    }) : [];

    return (
      <>
        <div style={S.tabHeader}>
          <h1 style={S.tabTitle}>SHOP MODE</h1>
          <p style={S.tabSub}>Select 7 meals from each service</p>
        </div>

        <div style={S.sessionToggle}>
          <button
            onClick={() => { setShopSection('factor'); setShopSearch(''); }}
            style={{...S.toggleBtn, ...(shopSection === 'factor' ? S.toggleActive : {})}}
          >Factor ({factorSel.length}/7)</button>
          <button
            onClick={() => { setShopSection('hf'); setShopSearch(''); }}
            style={{...S.toggleBtn, ...(shopSection === 'hf' ? S.toggleActive : {})}}
          >HelloFresh ({hfSel.length}/7)</button>
        </div>

        {!src ? (
          <div style={S.emptyState}>
            <p style={S.emptyTitle}>No {brandLabel} meals imported</p>
            <p style={S.emptyText}>Run the scraper, then import the JSON here</p>
            <div style={S.importBtns}>
              <label style={S.primaryBtn}>
                Upload JSON File
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files[0] && handleFileImport(brand, e.target.files[0])}
                />
              </label>
              <button onClick={() => { setShowImport(brand); setImportText(''); }} style={S.secondaryBtn}>
                Paste JSON
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={S.shopMeta}>
              <span style={S.shopWeek}>{src.week || `Scraped ${src.scraped}`}</span>
              <span style={S.shopCount}>{src.meals.length} meals</span>
            </div>

            <div style={S.importBtnsSmall}>
              <label style={S.smallBtn}>
                Re-import
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files[0] && handleFileImport(brand, e.target.files[0])}
                />
              </label>
              <button onClick={() => { setShowImport(brand); setImportText(''); }} style={S.smallBtn}>
                Paste JSON
              </button>
            </div>

            <input
              type="text"
              placeholder="Search meals..."
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              style={S.searchInput}
            />

            {sel.length > 0 && (
              <div style={S.selectedSection}>
                <div style={S.sectionTag}>SELECTED ({sel.length}/7)</div>
                {sel.map(idx => {
                  const m = src.meals[idx];
                  if (!m) return null;
                  return (
                    <button key={idx} onClick={() => toggleShopSel(brand, idx)} style={S.selectedChip}>
                      <span style={S.chipName}>{m.name}</span>
                      <span style={S.chipMacro}>{m.cal} cal · {m.pro}g</span>
                      <span style={S.chipX}>✕</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div style={S.mealList}>
              {filteredIndices.map(idx => {
                const m = src.meals[idx];
                const isSelected = sel.includes(idx);
                const isDisabled = !isSelected && sel.length >= 7;
                return (
                  <button
                    key={idx}
                    onClick={() => !isDisabled && toggleShopSel(brand, idx)}
                    style={{
                      ...S.mealCard,
                      opacity: isDisabled ? 0.35 : 1,
                      borderColor: isSelected ? '#5D6D7E' : '#2C2C2C',
                    }}
                    disabled={isDisabled}
                  >
                    <div style={S.mealCheck}>{isSelected ? '✓' : ''}</div>
                    <div style={S.mealInfo}>
                      <span style={S.mealName}>{m.name}</span>
                      {m.headline && <span style={S.mealHeadline}>{m.headline}</span>}
                      <span style={S.mealMacro}>{m.cal} cal · {m.pro}g protein · {m.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {showImport && (
          <div style={S.modal}>
            <div style={S.modalBox}>
              <h3 style={S.modalTitle}>Paste {showImport === 'factor' ? 'Factor' : 'HelloFresh'} JSON</h3>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste the contents of the JSON file here..."
                style={S.modalTextarea}
              />
              <div style={S.modalBtns}>
                <button onClick={() => importMeals(showImport)} style={S.primaryBtn}>Import</button>
                <button onClick={() => { setShowImport(null); setImportText(''); }} style={S.secondaryBtn}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // ============================================================================
  // RENDER: FUEL TAB
  // ============================================================================

  const renderFuel = () => {
    const factorSelected = getSelectedMeals('factor');
    const hfSelected = getSelectedMeals('hf');
    const hasMeals = factorSelected.length > 0 || hfSelected.length > 0;

    return (
      <>
        <div style={S.tabHeader}>
          <div style={S.fuelDateRow}>
            <button onClick={() => shiftFuelDate(-1)} style={S.dateArrow}>‹</button>
            <div style={S.fuelDateCenter}>
              <span style={S.fuelDateLabel}>{fmtDate(fuelDate)}</span>
              {fuelDate !== todayStr() && (
                <button onClick={() => setFuelDate(todayStr())} style={S.todayBtn}>Today</button>
              )}
            </div>
            <button onClick={() => shiftFuelDate(1)} style={S.dateArrow}>›</button>
          </div>
        </div>

        <div style={S.macroBar}>
          <div style={S.macroItem}>
            <span style={S.macroNum}>{fuelTotal.cal.toLocaleString()}</span>
            <span style={S.macroLabel}>CALORIES</span>
          </div>
          <div style={S.macroDivider} />
          <div style={S.macroItem}>
            <span style={S.macroNum}>{fuelTotal.pro}g</span>
            <span style={S.macroLabel}>PROTEIN</span>
          </div>
        </div>

        <div style={S.fuelSection}>
          <div style={S.sectionTag}>STAPLES</div>
          {DAILY_STAPLES.map(s => (
            <button
              key={s.id}
              onClick={() => toggleFuel(`s_${s.id}`)}
              style={{...S.fuelRow, borderColor: fuelChecks[`s_${s.id}`] ? '#5D6D7E' : '#2C2C2C'}}
            >
              <div style={{...S.fuelCheck, backgroundColor: fuelChecks[`s_${s.id}`] ? '#5D6D7E' : 'transparent'}}>
                {fuelChecks[`s_${s.id}`] && '✓'}
              </div>
              <div style={S.fuelInfo}>
                <span style={{...S.fuelName, textDecoration: fuelChecks[`s_${s.id}`] ? 'line-through' : 'none', opacity: fuelChecks[`s_${s.id}`] ? 0.5 : 1}}>{s.name}</span>
                <span style={S.fuelMacro}>{s.cal} cal · {s.pro}g protein</span>
              </div>
            </button>
          ))}
        </div>

        <div style={S.fuelSection}>
          <div style={S.sectionTag}>LUNCH — Factor</div>
          {factorSelected.length === 0 ? (
            <p style={S.fuelEmpty}>Select Factor meals in Shop Mode first</p>
          ) : (
            factorSelected.map((m, i) => (
              <button
                key={i}
                onClick={() => toggleFuel(`f_${i}`)}
                style={{...S.fuelRow, borderColor: fuelChecks[`f_${i}`] ? '#5D6D7E' : '#2C2C2C'}}
              >
                <div style={{...S.fuelCheck, backgroundColor: fuelChecks[`f_${i}`] ? '#5D6D7E' : 'transparent'}}>
                  {fuelChecks[`f_${i}`] && '✓'}
                </div>
                <div style={S.fuelInfo}>
                  <span style={{...S.fuelName, textDecoration: fuelChecks[`f_${i}`] ? 'line-through' : 'none', opacity: fuelChecks[`f_${i}`] ? 0.5 : 1}}>{m.name}</span>
                  <span style={S.fuelMacro}>{m.cal} cal · {m.pro}g protein</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div style={S.fuelSection}>
          <div style={S.sectionTag}>DINNER — HelloFresh</div>
          {hfSelected.length === 0 ? (
            <p style={S.fuelEmpty}>Select HelloFresh meals in Shop Mode first</p>
          ) : (
            hfSelected.map((m, i) => (
              <button
                key={i}
                onClick={() => toggleFuel(`h_${i}`)}
                style={{...S.fuelRow, borderColor: fuelChecks[`h_${i}`] ? '#5D6D7E' : '#2C2C2C'}}
              >
                <div style={{...S.fuelCheck, backgroundColor: fuelChecks[`h_${i}`] ? '#5D6D7E' : 'transparent'}}>
                  {fuelChecks[`h_${i}`] && '✓'}
                </div>
                <div style={S.fuelInfo}>
                  <span style={{...S.fuelName, textDecoration: fuelChecks[`h_${i}`] ? 'line-through' : 'none', opacity: fuelChecks[`h_${i}`] ? 0.5 : 1}}>{m.name}</span>
                  <span style={S.fuelMacro}>{m.cal} cal · {m.pro}g protein</span>
                </div>
              </button>
            ))
          )}
        </div>
      </>
    );
  };

  // ============================================================================
  // RENDER: GAINS TAB
  // ============================================================================

  const renderGains = () => {
    const bwData = gainsLog.filter(e => e.bodyweight).map(e => ({ date: e.date, v: e.bodyweight })).reverse();
    const puData = gainsLog.filter(e => e.pullup?.weight).map(e => ({ date: e.date, v: e.pullup.weight })).reverse();
    const hangData = gainsLog.filter(e => e.hang?.time).map(e => ({ date: e.date, v: e.hang.time })).reverse();

    return (
      <>
        <div style={S.tabHeader}>
          <h1 style={S.tabTitle}>GAINS</h1>
          <p style={S.tabSub}>Track progression metrics</p>
        </div>

        <div style={S.sessionToggle}>
          <button onClick={() => setGainsView('log')} style={{...S.toggleBtn, ...(gainsView === 'log' ? S.toggleActive : {})}}>Log</button>
          <button onClick={() => setGainsView('charts')} style={{...S.toggleBtn, ...(gainsView === 'charts' ? S.toggleActive : {})}}>Charts</button>
          <button onClick={() => setGainsView('history')} style={{...S.toggleBtn, ...(gainsView === 'history' ? S.toggleActive : {})}}>History</button>
        </div>

        {gainsView === 'log' && (
          <div style={S.gainsForm}>
            <div style={S.sectionTag}>BODYWEIGHT</div>
            <div style={S.inputRow}>
              <input
                type="number"
                placeholder="Weight"
                value={gForm.bodyweight}
                onChange={(e) => setGForm(p => ({...p, bodyweight: e.target.value}))}
                style={S.numInput}
              />
              <span style={S.inputUnit}>lbs</span>
            </div>

            <div style={{...S.sectionTag, marginTop: 20}}>WEIGHTED PULL-UPS</div>
            <div style={S.inputGrid}>
              <div style={S.inputCol}>
                <label style={S.inputLabel}>Added Weight</label>
                <div style={S.inputRow}>
                  <input type="number" placeholder="0" value={gForm.puWeight} onChange={(e) => setGForm(p => ({...p, puWeight: e.target.value}))} style={S.numInput} />
                  <span style={S.inputUnit}>lbs</span>
                </div>
              </div>
              <div style={S.inputCol}>
                <label style={S.inputLabel}>Reps</label>
                <input type="number" placeholder="0" value={gForm.puReps} onChange={(e) => setGForm(p => ({...p, puReps: e.target.value}))} style={S.numInput} />
              </div>
              <div style={S.inputCol}>
                <label style={S.inputLabel}>Sets</label>
                <input type="number" placeholder="0" value={gForm.puSets} onChange={(e) => setGForm(p => ({...p, puSets: e.target.value}))} style={S.numInput} />
              </div>
            </div>

            <div style={{...S.sectionTag, marginTop: 20}}>GRIP / HANGS</div>
            <div style={S.inputGrid}>
              <div style={S.inputCol}>
                <label style={S.inputLabel}>Edge</label>
                <div style={S.inputRow}>
                  <input type="number" placeholder="0" value={gForm.hangEdge} onChange={(e) => setGForm(p => ({...p, hangEdge: e.target.value}))} style={S.numInput} />
                  <span style={S.inputUnit}>mm</span>
                </div>
              </div>
              <div style={S.inputCol}>
                <label style={S.inputLabel}>Added Wt</label>
                <div style={S.inputRow}>
                  <input type="number" placeholder="0" value={gForm.hangWeight} onChange={(e) => setGForm(p => ({...p, hangWeight: e.target.value}))} style={S.numInput} />
                  <span style={S.inputUnit}>lbs</span>
                </div>
              </div>
              <div style={S.inputCol}>
                <label style={S.inputLabel}>Hold</label>
                <div style={S.inputRow}>
                  <input type="number" placeholder="0" value={gForm.hangTime} onChange={(e) => setGForm(p => ({...p, hangTime: e.target.value}))} style={S.numInput} />
                  <span style={S.inputUnit}>sec</span>
                </div>
              </div>
            </div>

            <button onClick={logGains} style={{...S.primaryBtn, marginTop: 24}}>LOG ENTRY</button>
          </div>
        )}

        {gainsView === 'charts' && (
          <div style={S.chartsContainer}>
            <MiniChart data={bwData} label="Bodyweight" unit="lbs" color="#7FB3D8" />
            <MiniChart data={puData} label="Pull-up Weight" unit="lbs" color="#A8D8A8" />
            <MiniChart data={hangData} label="Hang Time" unit="s" color="#D8A87F" />
          </div>
        )}

        {gainsView === 'history' && (
          <div style={S.historyList}>
            {gainsLog.length === 0 ? (
              <p style={S.fuelEmpty}>No entries yet</p>
            ) : (
              gainsLog.slice(0, 50).map((e, i) => (
                <div key={i} style={S.historyCard}>
                  <div style={S.historyTop}>
                    <span style={S.historyDate}>{fmtDate(e.date)}</span>
                    <button onClick={() => deleteGains(i)} style={S.historyDel}>✕</button>
                  </div>
                  {e.bodyweight && <div style={S.historyRow}><span style={S.historyLabel}>BW</span><span style={S.historyVal}>{e.bodyweight} lbs</span></div>}
                  {e.pullup && <div style={S.historyRow}><span style={S.historyLabel}>Pull-up</span><span style={S.historyVal}>+{e.pullup.weight}lbs × {e.pullup.reps} reps × {e.pullup.sets} sets</span></div>}
                  {e.hang && <div style={S.historyRow}><span style={S.historyLabel}>Hang</span><span style={S.historyVal}>{e.hang.edge}mm edge · +{e.hang.weight}lbs · {e.hang.time}s</span></div>}
                </div>
              ))
            )}
          </div>
        )}
      </>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div style={S.container}>
      {/* Rest timer overlay */}
      {restTimer !== null && (
        <div style={S.timerBar}>
          <span style={S.timerLabel}>REST</span>
          <span style={S.timerTime}>{fmtTime(restTimer)}</span>
          <button onClick={cancelRest} style={S.timerCancel}>SKIP</button>
        </div>
      )}

      {/* Tab content */}
      {tab === 'script' && renderScript()}
      {tab === 'shop' && renderShop()}
      {tab === 'fuel' && renderFuel()}
      {tab === 'gains' && renderGains()}

      {/* Bottom nav */}
      <div style={S.bottomNav}>
        {[
          { id: 'script', label: 'Script', Icon: ScriptIcon },
          { id: 'shop',   label: 'Shop',   Icon: ShopIcon },
          { id: 'fuel',   label: 'Fuel',   Icon: FuelIcon },
          { id: 'gains',  label: 'Gains',  Icon: GainsIcon },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{...S.navItem, ...(tab === t.id ? S.navActive : {})}}
          >
            <t.Icon active={tab === t.id} />
            <span style={{...S.navLabel, color: tab === t.id ? '#BDC3C7' : '#666'}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const S = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
    paddingBottom: '90px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '430px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },

  // ---- Bottom Nav ----
  bottomNav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111', borderTop: '1px solid #2C2C2C',
    display: 'flex', justifyContent: 'space-around',
    padding: '8px 0 12px', maxWidth: '430px', margin: '0 auto',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.6)',
  },
  navItem: {
    background: 'none', border: 'none', color: '#666',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    cursor: 'pointer', padding: '4px 12px',
  },
  navActive: { color: '#BDC3C7' },
  navLabel: { fontSize: '10px', letterSpacing: '0.5px' },

  // ---- Tab headers ----
  tabHeader: { textAlign: 'center', marginBottom: '20px', paddingTop: '12px' },
  tabTitle: { fontSize: '22px', fontWeight: '800', letterSpacing: '4px', margin: 0 },
  tabSub: { fontSize: '12px', color: '#666', marginTop: '6px' },

  // ---- Toggle buttons ----
  sessionToggle: { display: 'flex', gap: '8px', marginBottom: '16px' },
  toggleBtn: {
    flex: 1, padding: '12px 8px', fontSize: '12px', fontWeight: '600',
    backgroundColor: '#1A1A1A', border: '2px solid #2C2C2C', borderRadius: '10px',
    color: '#888', cursor: 'pointer', letterSpacing: '0.3px', textAlign: 'center',
  },
  toggleActive: { borderColor: '#5D6D7E', color: '#ECF0F1', backgroundColor: '#1E2A35' },

  // ---- Section tag ----
  sectionTag: {
    fontSize: '10px', letterSpacing: '2px', color: '#5D6D7E',
    textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700',
  },

  // ---- SCRIPT ----
  scriptHeader: { textAlign: 'center', marginBottom: '16px', paddingTop: '12px' },
  scriptDay: { fontSize: '26px', fontWeight: '800', letterSpacing: '5px', margin: 0 },
  scriptFocus: { fontSize: '14px', color: '#95A5A6', marginTop: '4px', fontWeight: '500' },
  sessionMeta: { textAlign: 'center', marginBottom: '16px' },
  metaDuration: { fontSize: '13px', color: '#666', letterSpacing: '1px' },
  scriptSection: { marginBottom: '20px' },
  scriptCard: {
    backgroundColor: '#111', borderRadius: '12px', padding: '14px 16px',
    marginBottom: '8px', border: '1px solid #222',
  },
  scriptCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  scriptExName: { fontSize: '15px', fontWeight: '700', margin: 0, flex: 1 },
  videoLink: {
    width: '30px', height: '30px', borderRadius: '8px',
    backgroundColor: 'rgba(93,109,126,0.2)', border: '1px solid rgba(93,109,126,0.3)',
    color: '#95A5A6', fontSize: '12px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', textDecoration: 'none', flexShrink: 0,
  },
  scriptMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  scriptSets: { fontSize: '14px', color: '#BDC3C7', fontWeight: '600' },
  restBtn: {
    padding: '6px 12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
    backgroundColor: 'rgba(93,109,126,0.15)', border: '1px solid #5D6D7E',
    borderRadius: '6px', color: '#95A5A6', cursor: 'pointer',
  },
  scriptNotes: { fontSize: '12px', color: '#888', margin: '8px 0 0', lineHeight: 1.4 },

  // ---- Timer bar ----
  timerBar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    backgroundColor: '#1A1A1A', borderBottom: '2px solid #5D6D7E',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
    padding: '14px 20px', maxWidth: '430px', margin: '0 auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
  },
  timerLabel: { fontSize: '11px', letterSpacing: '3px', color: '#666' },
  timerTime: { fontSize: '36px', fontWeight: '700', color: '#BDC3C7', fontFamily: 'monospace' },
  timerCancel: {
    padding: '8px 16px', fontSize: '12px', fontWeight: '700',
    backgroundColor: 'transparent', border: '1px solid #5D6D7E',
    borderRadius: '6px', color: '#95A5A6', cursor: 'pointer',
  },

  // ---- SHOP ----
  emptyState: { textAlign: 'center', padding: '40px 0' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' },
  emptyText: { fontSize: '13px', color: '#666', marginBottom: '24px' },
  importBtns: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' },
  importBtnsSmall: { display: 'flex', gap: '8px', marginBottom: '12px' },
  primaryBtn: {
    backgroundColor: '#5D6D7E', color: '#ECF0F1', border: 'none', borderRadius: '10px',
    padding: '14px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    textAlign: 'center', display: 'inline-block', width: '100%',
  },
  secondaryBtn: {
    backgroundColor: 'transparent', border: '2px solid #5D6D7E', color: '#95A5A6',
    borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', width: '100%',
  },
  smallBtn: {
    backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C', color: '#888',
    borderRadius: '8px', padding: '8px 14px', fontSize: '11px', fontWeight: '600',
    cursor: 'pointer', display: 'inline-block', textAlign: 'center',
  },
  shopMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  shopWeek: { fontSize: '12px', color: '#95A5A6', fontWeight: '500' },
  shopCount: { fontSize: '12px', color: '#666' },
  searchInput: {
    width: '100%', padding: '12px 16px', fontSize: '14px',
    backgroundColor: '#111', color: '#ECF0F1', border: '1px solid #2C2C2C',
    borderRadius: '10px', marginBottom: '16px', boxSizing: 'border-box',
    outline: 'none',
  },
  selectedSection: { marginBottom: '16px' },
  selectedChip: {
    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
    padding: '10px 14px', marginBottom: '6px', backgroundColor: '#1E2A35',
    border: '1px solid #5D6D7E', borderRadius: '8px', cursor: 'pointer',
    textAlign: 'left',
  },
  chipName: { flex: 1, fontSize: '13px', fontWeight: '600', color: '#ECF0F1' },
  chipMacro: { fontSize: '11px', color: '#95A5A6' },
  chipX: { fontSize: '14px', color: '#888', marginLeft: '4px' },
  mealList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  mealCard: {
    display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%',
    padding: '12px 14px', backgroundColor: '#111', border: '2px solid #2C2C2C',
    borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  mealCheck: {
    width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
    border: '2px solid #5D6D7E', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '14px', fontWeight: '700',
    color: '#ECF0F1', backgroundColor: 'transparent', marginTop: '2px',
  },
  mealInfo: { display: 'flex', flexDirection: 'column', flex: 1 },
  mealName: { fontSize: '14px', fontWeight: '600', color: '#ECF0F1' },
  mealHeadline: { fontSize: '11px', color: '#888', marginTop: '2px' },
  mealMacro: { fontSize: '11px', color: '#5D6D7E', marginTop: '4px', fontWeight: '500' },

  // ---- Modal ----
  modal: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '20px',
  },
  modalBox: {
    backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '24px',
    width: '100%', maxWidth: '400px', border: '1px solid #2C2C2C',
  },
  modalTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '16px', marginTop: 0 },
  modalTextarea: {
    width: '100%', height: '200px', padding: '12px', fontSize: '12px',
    backgroundColor: '#111', color: '#ECF0F1', border: '1px solid #2C2C2C',
    borderRadius: '8px', resize: 'vertical', fontFamily: 'monospace',
    boxSizing: 'border-box', outline: 'none',
  },
  modalBtns: { display: 'flex', gap: '10px', marginTop: '16px' },

  // ---- FUEL ----
  fuelDateRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' },
  dateArrow: {
    background: 'none', border: 'none', color: '#95A5A6', fontSize: '28px',
    cursor: 'pointer', padding: '4px 12px', fontWeight: '300',
  },
  fuelDateCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fuelDateLabel: { fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' },
  todayBtn: {
    background: 'none', border: '1px solid #5D6D7E', color: '#95A5A6',
    borderRadius: '4px', padding: '2px 8px', fontSize: '10px', cursor: 'pointer',
    marginTop: '4px',
  },
  macroBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px',
    backgroundColor: '#111', borderRadius: '14px', padding: '20px',
    marginBottom: '20px', border: '2px solid #2C2C2C',
  },
  macroItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  macroNum: { fontSize: '28px', fontWeight: '800', color: '#ECF0F1' },
  macroLabel: { fontSize: '9px', letterSpacing: '2px', color: '#666', marginTop: '2px' },
  macroDivider: { width: '1px', height: '36px', backgroundColor: '#2C2C2C' },
  fuelSection: { marginBottom: '20px' },
  fuelRow: {
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
    padding: '14px', marginBottom: '6px', backgroundColor: '#111',
    border: '2px solid #2C2C2C', borderRadius: '10px', cursor: 'pointer',
    textAlign: 'left', transition: 'border-color 0.2s',
  },
  fuelCheck: {
    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
    border: '2px solid #5D6D7E', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#ECF0F1',
    transition: 'background-color 0.2s',
  },
  fuelInfo: { display: 'flex', flexDirection: 'column', flex: 1 },
  fuelName: { fontSize: '14px', fontWeight: '600', color: '#ECF0F1', transition: 'all 0.2s' },
  fuelMacro: { fontSize: '11px', color: '#5D6D7E', marginTop: '3px', fontWeight: '500' },
  fuelEmpty: { fontSize: '13px', color: '#555', padding: '16px 0', textAlign: 'center' },

  // ---- GAINS ----
  gainsForm: { marginBottom: '20px' },
  inputRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  inputGrid: { display: 'flex', gap: '10px' },
  inputCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  inputLabel: { fontSize: '10px', color: '#666', letterSpacing: '0.5px' },
  numInput: {
    width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600',
    backgroundColor: '#111', color: '#ECF0F1', border: '1px solid #2C2C2C',
    borderRadius: '8px', boxSizing: 'border-box', outline: 'none',
    textAlign: 'center',
  },
  inputUnit: { fontSize: '12px', color: '#666', flexShrink: 0, width: '30px' },

  chartsContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
  chartWrap: {
    backgroundColor: '#111', borderRadius: '12px', padding: '14px',
    border: '1px solid #2C2C2C',
  },
  chartLabel: { fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#95A5A6', display: 'block', marginBottom: '8px' },
  chartSvg: { width: '100%', height: 'auto', display: 'block' },
  chartEmpty: { fontSize: '12px', color: '#555', textAlign: 'center', padding: '20px 0' },

  historyList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  historyCard: {
    backgroundColor: '#111', borderRadius: '10px', padding: '14px',
    border: '1px solid #222',
  },
  historyTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  historyDate: { fontSize: '12px', fontWeight: '600', color: '#95A5A6' },
  historyDel: {
    background: 'none', border: 'none', color: '#555', fontSize: '14px',
    cursor: 'pointer', padding: '2px 6px',
  },
  historyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  historyLabel: { fontSize: '11px', color: '#666', fontWeight: '600', letterSpacing: '0.5px' },
  historyVal: { fontSize: '13px', color: '#BDC3C7', fontWeight: '500' },
};
