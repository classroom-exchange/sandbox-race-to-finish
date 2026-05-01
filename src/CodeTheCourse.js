import { useState, useRef, useEffect } from "react";

const PULSE_STYLE = `
@keyframes carPulse { 0%{transform:scale(1.12);} 100%{transform:scale(1);} }
@keyframes trackGlow { 0%{opacity:0.5;} 50%{opacity:1;} 100%{opacity:0.5;} }
`;

const MAX_SEQ = 18;

// ── Rich car SVGs ──────────────────────────────────────────────────────────────
function McQueenSVG({ dir="right", size=48 }) {
  const flipH=dir==="left", rotate=dir==="up"?-90:dir==="down"?90:0;
  return (<svg width={size} height={size} viewBox="0 0 80 50" style={{transform:`rotate(${rotate}deg) scaleX(${flipH?-1:1})`,transition:"transform 0.3s"}}>
    <ellipse cx="40" cy="32" rx="34" ry="13" fill="#e8002d"/>
    <path d="M20,32 Q22,16 35,14 L52,14 Q64,16 60,32 Z" fill="#cc0022"/>
    <path d="M26,30 Q28,18 37,16 L50,16 Q58,18 56,30 Z" fill="#aee4f7" opacity="0.9"/>
    <ellipse cx="35" cy="23" rx="5" ry="5.5" fill="white"/><ellipse cx="50" cy="23" rx="5" ry="5.5" fill="white"/>
    <ellipse cx="36" cy="23.5" rx="3" ry="3.5" fill="#1a6bb5"/><ellipse cx="51" cy="23.5" rx="3" ry="3.5" fill="#1a6bb5"/>
    <circle cx="37" cy="22.5" r="1.2" fill="black"/><circle cx="52" cy="22.5" r="1.2" fill="black"/>
    <circle cx="35.5" cy="21.5" r="0.8" fill="white"/><circle cx="50.5" cy="21.5" r="0.8" fill="white"/>
    <text x="40" y="37" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Arial">95</text>
    <circle cx="18" cy="38" r="8" fill="#222"/><circle cx="18" cy="38" r="4" fill="#888"/>
    <circle cx="62" cy="38" r="8" fill="#222"/><circle cx="62" cy="38" r="4" fill="#888"/>
    <ellipse cx="72" cy="30" rx="4" ry="3" fill="#ffe066"/>
    <ellipse cx="8" cy="30" rx="3" ry="2.5" fill="#ff6666"/>
  </svg>);
}
function TheKingSVG({ dir="right", size=48 }) {
  const flipH=dir==="left", rotate=dir==="up"?-90:dir==="down"?90:0;
  return (<svg width={size} height={size} viewBox="0 0 100 70" style={{transform:`rotate(${rotate}deg) scaleX(${flipH?-1:1})`,transition:"transform 0.3s"}}>
    <line x1="72" y1="25" x2="72" y2="6" stroke="#87CEEB" strokeWidth="2"/>
    <line x1="78" y1="25" x2="78" y2="6" stroke="#87CEEB" strokeWidth="2"/>
    <rect x="68" y="5" width="14" height="4" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
    <path d="M 15,35 L 25,32 L 70,32 L 82,35 L 82,45 L 15,45 Z" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
    <polygon points="15,32 8,35 15,38" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
    <polygon points="8,35 0,37 8,39" fill="#6BB8D4"/>
    <path d="M 22,32 L 70,30 L 68,25 L 24,27 Z" fill="white" stroke="#e0e0e0" strokeWidth="0.5"/>
    <ellipse cx="32" cy="28" rx="7" ry="8" fill="white" stroke="#ccc" strokeWidth="0.5"/>
    <ellipse cx="32" cy="28" rx="5" ry="6" fill="#4a90e2"/>
    <circle cx="32" cy="28" r="2.5" fill="black"/><circle cx="31" cy="26" r="1" fill="white"/>
    <ellipse cx="56" cy="28" rx="7" ry="8" fill="white" stroke="#ccc" strokeWidth="0.5"/>
    <ellipse cx="56" cy="28" rx="5" ry="6" fill="#4a90e2"/>
    <circle cx="56" cy="28" r="2.5" fill="black"/><circle cx="55" cy="26" r="1" fill="white"/>
    <text x="44" y="41" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial">43</text>
    <circle cx="28" cy="48" r="6" fill="#222"/><circle cx="28" cy="48" r="3" fill="#666"/>
    <circle cx="66" cy="48" r="6" fill="#222"/><circle cx="66" cy="48" r="3" fill="#666"/>
    <ellipse cx="12" cy="36" rx="2.5" ry="2" fill="#ffe066"/>
  </svg>);
}
function MaterSVG({ dir="right", size=48 }) {
  const flipH=dir==="left", rotate=dir==="up"?-90:dir==="down"?90:0;
  return (<svg width={size} height={size} viewBox="0 0 90 55" style={{transform:`rotate(${rotate}deg) scaleX(${flipH?-1:1})`,transition:"transform 0.3s"}}>
    <rect x="8" y="28" width="62" height="16" rx="4" fill="#8B6914"/>
    <path d="M30,28 Q32,12 44,11 L60,11 Q70,13 68,28 Z" fill="#7a5c10"/>
    <path d="M35,27 Q36,15 45,13 L58,13 Q65,15 64,27 Z" fill="#aee4f7" opacity="0.85"/>
    <ellipse cx="44" cy="20" rx="5.5" ry="6" fill="white"/><ellipse cx="57" cy="20" rx="5.5" ry="6" fill="white"/>
    <ellipse cx="45" cy="20.5" rx="3.5" ry="4" fill="#4a7c30"/><ellipse cx="58" cy="20.5" rx="3.5" ry="4" fill="#4a7c30"/>
    <circle cx="46" cy="19.5" r="1.2" fill="black"/><circle cx="59" cy="19.5" r="1.2" fill="black"/>
    <circle cx="44.5" cy="18.5" r="0.8" fill="white"/><circle cx="57.5" cy="18.5" r="0.8" fill="white"/>
    <line x1="8" y1="30" x2="2" y2="22" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="22" cy="42" r="9" fill="#222"/><circle cx="22" cy="42" r="5" fill="#666"/>
    <circle cx="58" cy="42" r="9" fill="#222"/><circle cx="58" cy="42" r="5" fill="#666"/>
    <ellipse cx="70" cy="33" rx="4" ry="3" fill="#ffe8a0"/>
  </svg>);
}
function CarSVG({ car, dir, size=48 }) {
  if (car==="the-king") return <TheKingSVG dir={dir} size={size}/>;
  if (car==="mater")    return <MaterSVG   dir={dir} size={size}/>;
  return <McQueenSVG dir={dir} size={size}/>;
}

// ── Directional arrow helper ──────────────────────────────────────────────────
function getTrackArrow(trackPath, idx) {
  if (!trackPath || idx <= 0 || idx >= trackPath.length) return null;
  const prev = trackPath[idx-1], curr = trackPath[idx];
  const dx = curr.x - prev.x, dy = curr.y - prev.y;
  if (dx > 0) return "→";
  if (dx < 0) return "←";
  if (dy > 0) return "↓";
  return "↑";
}
function isHorizontalArrow(arrow) { return arrow === "→" || arrow === "←"; }

const TurnArrow = ({ fromDir, toDir, size = 36 }) => {
  const s = size;
  const h = s / 2;
  const paths = {
    'right-down':  `M${s},${h} L${h},${h} L${h},${s}`,
    'right-up':    `M${s},${h} L${h},${h} L${h},0`,
    'left-down':   `M0,${h} L${h},${h} L${h},${s}`,
    'left-up':     `M0,${h} L${h},${h} L${h},0`,
    'down-right':  `M${h},${s} L${h},${h} L${s},${h}`,
    'down-left':   `M${h},${s} L${h},${h} L0,${h}`,
    'up-right':    `M${h},0 L${h},${h} L${s},${h}`,
    'up-left':     `M${h},0 L${h},${h} L0,${h}`,
  };
  const key = `${fromDir}-${toDir}`;
  const d = paths[key] || '';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block'}}>
      <defs>
        <marker id={`arr-${key}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ffe066" />
        </marker>
      </defs>
      <path d={d} fill="none" stroke="#ffe066" strokeWidth="3"
        markerEnd={`url(#arr-${key})`} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

function buildSlotMap(slots, startCell, startDir) {
  const dirDeltas = { right: [1,0], left: [-1,0], down: [0,1], up: [0,-1] };
  let pos = { ...(startCell || { x: 0, y: 0 }) };
  let dir = startDir || 'right';
  const map = {};
  for (let si = 0; si < slots.length; si++) {
    const slot = slots[si];
    if (!slot || !slot.cmdId) {
      map[si] = { type: 'gap', cmdId: null, locked: slot.locked, cell: { ...pos }, fromDir: dir, toDir: dir };
      continue;
    }
    const cmd = slot.cmdId;
    if (cmd === 'forward') {
      const [dx, dy] = dirDeltas[dir] || [1, 0];
      const dest = { x: pos.x + dx, y: pos.y + dy };
      map[si] = { type: 'forward', cmdId: slot.cmdId, locked: slot.locked, cell: dest, fromDir: dir, toDir: dir };
      pos = dest;
    } else if (cmd === 'turnLeft') {
      const turns = { right: 'up', up: 'left', left: 'down', down: 'right' };
      const newDir = turns[dir] || dir;
      map[si] = { type: 'turn', cmdId: slot.cmdId, locked: slot.locked, cell: { ...pos }, fromDir: dir, toDir: newDir };
      dir = newDir;
    } else if (cmd === 'turnRight') {
      const turns = { right: 'down', down: 'left', left: 'up', up: 'right' };
      const newDir = turns[dir] || dir;
      map[si] = { type: 'turn', cmdId: slot.cmdId, locked: slot.locked, cell: { ...pos }, fromDir: dir, toDir: newDir };
      dir = newDir;
    }
  }
  return map;
}

// ── Level definitions ─────────────────────────────────────────────────────────
// All trackPaths use {x:col, y:row}. startDir: "right"|"left"|"up"|"down"
const LEVELS = [
  {
    // Level 1 — Hairpin U-bend. Simple 3-side oval shape, 1 gap
    label: "Hairpin Bend",
    hint: "Go right, turn, go down, turn, go left! 🔄",
    start:{x:0,y:1}, startDir:"right",
    finish:{x:0,y:3}, obstacles:[],
    scaffold:["forward","forward","forward","turnRight","forward","forward",null,"forward","forward","forward"],
    demoMode:true,
    demoSolution:["forward","forward","forward","turnRight","forward","forward","forward","forward","forward","forward"],
    trackPath:[
      {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},   // top straight →
      {x:3,y:2},{x:3,y:3},                          // right side ↓
      {x:2,y:3},{x:1,y:3},{x:0,y:3}                 // bottom straight ←
    ],
  },
  {
    // Level 2 — Full rectangular oval. 4 corners, 3 gaps
    label: "Oval Circuit",
    hint: "Four corners make a full oval! Can you complete it? 🏁",
    start:{x:0,y:0}, startDir:"right",
    finish:{x:0,y:1}, obstacles:[],
    scaffold:["forward","forward","forward","forward","turnRight","forward","forward","forward","forward",null,"forward","forward","forward","forward",null,"forward","forward",null],
    trackPath:[
      {x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},  // top →
      {x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4},              // right ↓
      {x:3,y:4},{x:2,y:4},{x:1,y:4},{x:0,y:4},              // bottom ←
      {x:0,y:3},{x:0,y:2},{x:0,y:1}                         // left ↑
    ],
  },
  {
    // Level 3 — Figure-8 (two loops sharing a centre crossing). 5 gaps
    label: "Figure-8 Track",
    hint: "Two loops crossing in the middle — watch your turns! ∞",
    start:{x:0,y:0}, startDir:"right",
    finish:{x:4,y:4}, obstacles:[],
    scaffold:["forward","forward",null,"forward","forward",null,"forward","forward",null,"forward","forward",null,"forward","forward","turnLeft","forward","forward","turnRight","forward","forward","turnRight","forward","forward"],
    trackPath:[
      {x:0,y:0},{x:1,y:0},{x:2,y:0},              // top-left top →
      {x:2,y:1},{x:2,y:2},                          // centre top ↓
      {x:1,y:2},{x:0,y:2},                          // left side ←
      {x:0,y:3},{x:0,y:4},                          // left bottom ↓
      {x:1,y:4},{x:2,y:4},                          // bottom-left →
      {x:2,y:3},{x:2,y:2},                          // centre bottom ↑
      {x:3,y:2},{x:4,y:2},                          // right side →
      {x:4,y:3},{x:4,y:4}                           // right bottom ↓
    ],
  },
  {
    // Level 4 — F1-style chicane circuit. 8 gaps — most missing
    label: "Chicane Circuit",
    hint: "An F1-style track with tight chicanes. Fill the gaps! 🏎️",
    start:{x:0,y:0}, startDir:"right",
    finish:{x:4,y:2}, obstacles:[],
    scaffold:["forward","forward","forward",null,"forward",null,"forward","forward",null,"forward","forward",null,"forward","forward","forward",null,"forward"],
    trackPath:[
      {x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},    // top straight →
      {x:3,y:1},                                     // chicane right ↓
      {x:2,y:1},{x:1,y:1},                          // chicane left ←
      {x:1,y:2},{x:1,y:3},                          // down ↓
      {x:2,y:3},{x:3,y:3},{x:4,y:3},               // right →
      {x:4,y:2}                                      // finish ↑
    ],
  },
  {
    // Level 5 — Free build. Full spiral circuit, all gaps, track arrows shown
    label: "Free Build!",
    hint: "The track is yours — fill every block from scratch! 🌀",
    start:{x:0,y:0}, startDir:"right",
    finish:{x:2,y:2}, obstacles:[],
    scaffold:[],   // all empty — child builds entire sequence
    trackPath:[
      {x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},  // top →
      {x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4},              // right ↓
      {x:3,y:4},{x:2,y:4},{x:1,y:4},{x:0,y:4},              // bottom ←
      {x:0,y:3},{x:0,y:2},{x:0,y:1},                        // left ↑
      {x:1,y:1},{x:2,y:1},{x:3,y:1},                        // inner top →
      {x:3,y:2},{x:3,y:3},                                   // inner right ↓
      {x:2,y:3},{x:1,y:3},{x:1,y:2},{x:2,y:2}              // spiral in → finish
    ],
  },
];

const COMMANDS = [
  { id:"forward",    icon:"↑",  label:"Forward",   color:"#2980b9" },
  { id:"turnLeft",   icon:"↶",  label:"Turn Left",  color:"#8e44ad" },
  { id:"turnRight",  icon:"↷",  label:"Turn Right", color:"#8e44ad" },
];

// ── Circuits ──────────────────────────────────────────────────────────────────
const CIRCUITS = [
  { id:0, name:"Starter Lane",  icon:"🏁", color:"#27ae60",
    description:"Learn to code the track!",           levels:LEVELS },
  { id:1, name:"Pattern Park",  icon:"🔁", color:"#f39c12",
    description:"Spot the patterns!",                 levels:[] },
  { id:2, name:"Decision Dash", icon:"🔀", color:"#8e44ad",
    description:"Choose your path!",                  levels:[] },
];

const sleep = ms => new Promise(r => setTimeout(r,ms));
function turnLeft(d)  { return {right:"up",up:"left",left:"down",down:"right"}[d]; }
function turnRight(d) { return {right:"down",down:"left",left:"up",up:"right"}[d]; }
function moveInDir(pos,dir) {
  if (dir==="right") return {x:pos.x+1,y:pos.y};
  if (dir==="left")  return {x:pos.x-1,y:pos.y};
  if (dir==="up")    return {x:pos.x,y:pos.y-1};
  return                    {x:pos.x,y:pos.y+1};
}

function buildSlots(scaffold) {
  const slots = scaffold.map(id=>({cmdId:id||null,locked:id!=null}));
  while (slots.length < MAX_SEQ) slots.push({cmdId:null,locked:false});
  return slots;
}

const GRID = 5;

// ── Sound engine ──────────────────────────────────────────────────────────────────────────────
function useSoundEngine(muted) {
  const ctxRef = useRef(null);
  function getCtx() {
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    return ctxRef.current;
  }
  return function playSound(name) {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      if (name === 'win') {
        [523,659,784].forEach((freq,i)=>{
          const osc=ctx.createOscillator(),gain=ctx.createGain();
          osc.connect(gain);gain.connect(ctx.destination);
          osc.type='sine';osc.frequency.value=freq;
          gain.gain.setValueAtTime(0.3,t+i*0.12);
          gain.gain.exponentialRampToValueAtTime(0.001,t+i*0.12+0.4);
          osc.start(t+i*0.12);osc.stop(t+i*0.12+0.4);
        });
      } else if (name === 'crash') {
        const osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.connect(gain);gain.connect(ctx.destination);
        osc.type='sawtooth';osc.frequency.setValueAtTime(200,t);
        osc.frequency.exponentialRampToValueAtTime(80,t+0.5);
        gain.gain.setValueAtTime(0.4,t);gain.gain.exponentialRampToValueAtTime(0.001,t+0.5);
        osc.start(t);osc.stop(t+0.5);
      } else if (name === 'go') {
        const osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.connect(gain);gain.connect(ctx.destination);
        osc.type='square';osc.frequency.setValueAtTime(300,t);
        osc.frequency.exponentialRampToValueAtTime(600,t+0.15);
        gain.gain.setValueAtTime(0.2,t);gain.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        osc.start(t);osc.stop(t+0.2);
      } else if (name === 'tap') {
        const osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.connect(gain);gain.connect(ctx.destination);
        osc.type='square';osc.frequency.value=800;
        gain.gain.setValueAtTime(0.15,t);gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        osc.start(t);osc.stop(t+0.08);
      }
    } catch(e) {}
  };
}
function ctcTL(d){return{right:'up',up:'left',left:'down',down:'right'}[d]||d;}
function ctcTR(d){return{right:'down',down:'left',left:'up',up:'right'}[d]||d;}
function getDirArrow(d){return{right:'→',left:'←',up:'↑',down:'↓'}[d]||'?';}
function getHeadingAt(idx,slots,startDir){
  let dir=startDir||'right';
  for(let i=0;i<idx&&i<slots.length;i++){
    const s=slots[i];
    if(!s||!s.cmdId)continue;
    if(s.cmdId==='turnLeft')dir=ctcTL(dir);
    else if(s.cmdId==='turnRight')dir=ctcTR(dir);
  }
  return dir;
}

export default function CodeTheCourse({ car, onBack }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);

  const [slots, setSlots]           = useState(()=>buildSlots(LEVELS[0].scaffold));
  const [carPos, setCarPos]         = useState(LEVELS[0].start);
  const [carDir, setCarDir]         = useState(LEVELS[0].startDir);
  const [status, setStatus]         = useState("idle");  // idle|running|win|crash|complete
  const [racing, setRacing]         = useState(false);
  const [winsThisLevel, setWins]    = useState(0);
  const [stars, setStars]           = useState(()=>JSON.parse(localStorage.getItem("ctc_stars")||"[]"));
  const [activeStep, setActiveStep] = useState(-1);
  const [animCell, setAnimCell]     = useState(null);
  const [showGoOverlay, setShowGoOverlay] = useState(false);
  const runRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const playSound = useSoundEngine(muted);
  const [circuitIdx, setCircuitIdx] = useState(null);

  const level = CIRCUITS[circuitIdx ?? 0].levels[levelIndex] || LEVELS[0];
  const sequence    = slots.filter(s=>s.cmdId).map(s=>s.cmdId);
  const isOpenLevel = level.scaffold.length === 0;
  const gapIndices  = level.scaffold.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
  const allFilled   = isOpenLevel ? false : (gapIndices.length > 0 && gapIndices.every(i=>slots[i]?.cmdId));
  const activeGapIdx = isOpenLevel
    ? slots.findIndex(s => !s.cmdId && !s.locked)
    : (gapIndices.find(gi => !slots[gi]?.cmdId) ?? -1);
  const headingAtGap = activeGapIdx >= 0
    ? getHeadingAt(activeGapIdx, slots, level.startDir)
    : level.startDir;
  const getCmdIcon = (cmdId) => cmdId === 'forward' ? getDirArrow(headingAtGap)
    : cmdId === 'turnLeft' ? getDirArrow(ctcTL(headingAtGap))
    : cmdId === 'turnRight' ? getDirArrow(ctcTR(headingAtGap)) : '?';
  const canRun      = isOpenLevel ? sequence.length > 0 : allFilled;
  const isDemoMode  = Boolean(level.demoMode);
  const demoCorrectCmd = (isDemoMode && activeGapIdx >= 0 && level.demoSolution)
    ? (level.demoSolution[activeGapIdx] || null)
    : null;

  // Auto-run when all slots filled
  useEffect(() => {
    if (allFilled && status === 'idle') {
      const t1 = setTimeout(() => { setShowGoOverlay(true); playSound('go'); }, 200);
      const t2 = setTimeout(() => {
        setShowGoOverlay(false);
        runSequence();
      }, 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [allFilled, status]);

  function resetLevel(idx, forCircuitIdx) {
    const activeCircuit = CIRCUITS[forCircuitIdx ?? circuitIdx ?? 0];
    const lv = activeCircuit.levels[idx ?? levelIndex] || LEVELS[0];
    setSlots(buildSlots(lv.scaffold));
    setCarPos(lv.start);
    setCarDir(lv.startDir);
    setStatus("idle");
    setRacing(false);
    setActiveStep(-1);
    setAnimCell(null);
    runRef.current = false;
  }

  function addCmd(id) {
    if (status==="running") return;
    if (isDemoMode && demoCorrectCmd && id !== demoCorrectCmd) return;
    playSound('tap');
    if (isOpenLevel) {
      setSlots(prev=>{
        const i=prev.findIndex(s=>!s.cmdId&&!s.locked);
        if (i===-1) return prev;
        const n=[...prev]; n[i]={cmdId:id,locked:false}; return n;
      });
    } else {
      setSlots(prev=>{
        const i=gapIndices.find(gi=>!prev[gi]?.cmdId);
        if (i===undefined) return prev;
        const n=[...prev]; n[i]={cmdId:id,locked:false}; return n;
      });
    }
  }

  function removeCmd(i) {
    if (status==="running") return;
    setSlots(prev=>{
      if(prev[i].locked) return prev;
      const n=[...prev]; n[i]={cmdId:null,locked:false}; return n;
    });
  }

  function undoLast() {
    if (status==="running") return;
    playSound('tap');
    if (isOpenLevel) {
      setSlots(prev=>{
        const idx=[...prev].reverse().findIndex(s=>s.cmdId&&!s.locked);
        if(idx===-1) return prev;
        const real=prev.length-1-idx;
        const n=[...prev]; n[real]={cmdId:null,locked:false}; return n;
      });
    } else {
      setSlots(prev=>{
        const gi=[...gapIndices].reverse().find(gi=>prev[gi]?.cmdId);
        if(gi===undefined) return prev;
        const n=[...prev]; n[gi]={cmdId:null,locked:false}; return n;
      });
    }
  }

  function clearAll() {
    if(status==="running") return;
    setSlots(buildSlots(level.scaffold));
  }

  const getStarsForLevel = (idx) => {
    const numStars = wrongAttempts === 0 ? 3 : wrongAttempts <= 2 ? 2 : 1;
    return { stars: numStars };
  };

  const runSequence = async () => {
    if (status==='running' || !canRun) return;
    runRef.current = true;
    setStatus('running');
    setRacing(true);

    let pos={...level.start}, dir=level.startDir;
    const isObs  = p=>level.obstacles.some(o=>o.x===p.x&&o.y===p.y);
    const isFin  = p=>p.x===level.finish.x&&p.y===level.finish.y;
    const outOOB = p=>p.x<0||p.x>=GRID||p.y<0||p.y>=GRID;

    let result=null;
    for (let i=0; i<sequence.length&&runRef.current; i++) {
      const cmd=sequence[i];
      setActiveStep(i);
      await sleep(480);
      if (cmd==='turnLeft')  { dir=turnLeft(dir);  setCarDir(dir); }
      else if (cmd==='turnRight') { dir=turnRight(dir); setCarDir(dir); }
      else if (cmd==='forward') {
        const next=moveInDir(pos,dir);
        if (outOOB(next)||isObs(next)) { result='crash'; break; }
        pos=next; setCarPos({...pos});
        setAnimCell(`${pos.x}-${pos.y}`);
        setTimeout(()=>setAnimCell(null),350);
        if (isFin(pos)) { result='win'; break; }
      }
    }
    setActiveStep(-1);
    runRef.current=false;

    if (result==='win' || (!result && pos.x===level.finish.x && pos.y===level.finish.y)) {
      playSound('win'); setStatus('win');
      const newWins=winsThisLevel+1;
      if (newWins>=2) {
        const newStars=[...new Set([...stars,levelIndex])];
        setStars(newStars);
        localStorage.setItem('ctc_stars',JSON.stringify(newStars));
        setLevelComplete(true);
      } else {
        setWins(newWins);
        setWrongAttempts(0);
        await sleep(1800);
        resetLevel(levelIndex); setWins(newWins);
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      playSound('crash'); setStatus('crash');
      setRacing(false);
      await sleep(1500);
      resetLevel(levelIndex); setWins(winsThisLevel);
    }
  };

  const isOnTrack   = (x,y) => level.trackPath.some(c=>c.x===x&&c.y===y);
  const isObsCell   = (x,y) => level.obstacles.some(o=>o.x===x&&o.y===y);
  const trackIdx    = (x,y) => level.trackPath.findIndex(c=>c.x===x&&c.y===y);

  // Build slot→cell map for on-road visualization
  const slotMap = buildSlotMap(
    slots.slice(0, level.scaffold.length),
    level.start || { x: 0, y: 0 },
    level.startDir || 'right'
  );

  const bg = "linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)";
  const card = {background:"rgba(255,255,255,0.05)",borderRadius:16,padding:16,backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)"};

  if (circuitIdx === null) {
    const c0Stars = stars.filter(i => i >= 0 && i < CIRCUITS[0].levels.length).length;
    const c1Unlocked = c0Stars >= 4;
    return (
      <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",padding:16,fontFamily:"'Segoe UI',Arial,sans-serif"}}>
        <style>{PULSE_STYLE}</style>
        <button onClick={onBack} style={{position:"absolute",top:12,left:12,padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,zIndex:10}}>← Menu</button>
        <div style={{textAlign:"center",marginBottom:24,marginTop:48}}>
          <div style={{fontSize:"1.8rem",fontWeight:900,color:"#ffe066"}}>🏎️ Code the Course</div>
          <div style={{color:"#aee4f7",fontSize:"0.9rem",marginTop:4}}>Choose your circuit</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16,width:"100%",maxWidth:380}}>
          {CIRCUITS.map((circuit, ci) => {
            const locked = ci === 1 ? !c1Unlocked : ci === 2;
            const comingSoon = circuit.levels.length === 0;
            const circStars = ci === 0 ? c0Stars : 0;
            const maxLv = CIRCUITS[0].levels.length;
            return (
              <div key={ci}
                onClick={locked || comingSoon ? null : () => {
                  const lv0 = circuit.levels[0] || LEVELS[0];
                  setCircuitIdx(ci);
                  setLevelIndex(0);
                  setSlots(buildSlots(lv0.scaffold));
                  setCarPos(lv0.start);
                  setCarDir(lv0.startDir);
                  setStatus("idle");
                  setRacing(false);
                  setActiveStep(-1);
                  setAnimCell(null);
                  runRef.current = false;
                  setWins(0);
                }}
                style={{
                  ...card,
                  display:"flex",alignItems:"center",gap:16,
                  opacity: locked ? 0.55 : 1,
                  cursor: locked || comingSoon ? "default" : "pointer",
                  border:`2px solid ${locked ? "rgba(255,255,255,0.1)" : circuit.color}`,
                  transition:"all 0.15s",
                }}>
                <div style={{fontSize:"2.5rem"}}>{locked ? "🔒" : circuit.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#ffe066",fontSize:"1rem"}}>{circuit.name}</div>
                  <div style={{color:"#aee4f7",fontSize:"0.8rem",marginTop:2}}>{circuit.description}</div>
                  {ci === 0 && <div style={{marginTop:4,fontSize:"0.8rem",color:"#aee4f7"}}>
                    {Array.from({length:maxLv},(_,i)=><span key={i}>{stars.includes(i)?"⭐":"·"}</span>)}
                    {" "}{circStars}/{maxLv} levels
                  </div>}
                  {locked && ci === 1 && <div style={{fontSize:"0.75rem",color:"#ff9999",marginTop:2}}>Complete 4+ Starter Lane levels to unlock</div>}
                  {comingSoon && ci > 0 && <div style={{fontSize:"0.75rem",color:"#ffe066",marginTop:2}}>🚧 Coming soon</div>}
                </div>
                {!locked && !comingSoon && <div style={{color:"#ffe066",fontSize:"1.2rem"}}>▶</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (status==="complete") {
    return (
      <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
        <style>{PULSE_STYLE}</style>
        <div style={{...card,textAlign:"center",padding:40}}>
          <div style={{fontSize:"3rem"}}>🎉</div>
          <div style={{fontSize:"2rem",fontWeight:900,color:"#ffe066",marginTop:12}}>All done!</div>
          <div style={{color:"#aee4f7",marginTop:8}}>You mastered all 5 tracks!</div>
          <div style={{marginTop:12}}>{LEVELS.map((_,i)=><span key={i}>⭐</span>)}</div>
          <button onClick={()=>{setLevelIndex(0);setWins(0);resetLevel(0);}} style={{marginTop:24,padding:"12px 28px",borderRadius:24,background:"#ffe066",color:"#1a1a2e",fontWeight:700,fontSize:16,border:"none",cursor:"pointer"}}>Play Again</button>
          <button onClick={onBack} style={{marginTop:12,display:"block",padding:"10px 24px",borderRadius:24,background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:15,border:"none",cursor:"pointer"}}>← Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"relative",minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",padding:16,fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <style>{PULSE_STYLE}</style>

      <button onClick={()=>setCircuitIdx(null)} style={{position:"absolute",top:12,left:12,padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,zIndex:10}}>← Circuits</button>
      <button onClick={()=>setMuted(m=>!m)} style={{position:"absolute",top:12,right:12,padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,zIndex:10}}>{muted?"🔇":"🔊"}</button>

      {/* Header */}
      <div style={{textAlign:"center",marginBottom:10,marginTop:36}}>
        <div style={{fontSize:"1.6rem",fontWeight:900,color:"#ffe066"}}>💻 Code the Course</div>
        <div style={{color:"#aee4f7",fontSize:"0.9rem",marginTop:2}}>
          Level {levelIndex+1} of {LEVELS.length} — {level.label}
          <span style={{marginLeft:8}}>{LEVELS.map((_,i)=><span key={i}>{stars.includes(i)?"⭐":"·"}</span>)}</span>
        </div>
        <div style={{color:"#ffffff99",fontSize:"0.85rem",fontStyle:"italic",marginTop:2}}>{level.hint}</div>
        {isDemoMode&&<div style={{color:"#ffe066",fontSize:"0.8rem",fontWeight:600,marginTop:4,background:"rgba(255,224,102,0.1)",borderRadius:8,padding:"4px 12px"}}>👆 Tutorial — tap the glowing command!</div>}
        {winsThisLevel===1&&<div style={{color:"#ffe066",fontSize:"0.85rem",marginTop:2}}>⭐ 1 win — one more for a star!</div>}
      </div>

      {/* Status overlays */}
      {status==="win"&&<div style={{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(39,174,96,0.95)",borderRadius:20,padding:"20px 40px",fontSize:"1.4rem",fontWeight:700,color:"#fff",zIndex:100,textAlign:"center"}}>🏁 You made it!{winsThisLevel+1>=2?" ⭐ Level complete!":""}</div>}
      {status==="crash"&&<div style={{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(192,57,43,0.95)",borderRadius:20,padding:"20px 40px",fontSize:"1.4rem",fontWeight:700,color:"#fff",zIndex:100,textAlign:"center"}}>💥 Crash! Try again.</div>}

      {/* Grid */}
      <div style={{...card,marginBottom:12,padding:8}}>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${GRID},64px)`,gap:3}}>
          {Array.from({length:GRID},(_,y)=>Array.from({length:GRID},(_,x)=>{
            const isCarHere = carPos.x===x&&carPos.y===y;
            const isFin     = level.finish.x===x&&level.finish.y===y;
            const isObs     = isObsCell(x,y);
            const onTrack   = isOnTrack(x,y);
            const tIdx      = trackIdx(x,y);
            const arrow     = onTrack ? getTrackArrow(level.trackPath, tIdx) : null;
            const horiz     = arrow ? isHorizontalArrow(arrow) : true;
            const isAnimated= animCell===`${x}-${y}`;

            let bg, border;
            if (isObs)          { bg="rgba(255,80,40,0.3)"; border="2px solid #ff5028"; }
            else if (onTrack)   { bg="#2c2c2c"; border="2px solid #555"; }
            else                { bg="#1a4a1a"; border="2px solid #2d6a2d"; }

            return (
              <div key={`${x}-${y}`} style={{width:64,height:64,background:bg,border,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",animation:isAnimated?"carPulse 0.35s ease-out":"none"}}>

                {/* Lane markings — always on track, yellow+dotted when racing */}
                {onTrack&&!isObs&&(
                  <div style={{
                    position:"absolute",
                    ...(horiz
                      ? {top:"50%",left:0,right:0,height:racing?3:2,transform:"translateY(-50%)"}
                      : {left:"50%",top:0,bottom:0,width:racing?3:2,transform:"translateX(-50%)"}
                    ),
                    background:racing?"#ffe066":"rgba(255,255,255,0.2)",
                    borderRadius:2,
                    backgroundImage:racing?(horiz?"repeating-linear-gradient(90deg,#ffe066 0,#ffe066 8px,transparent 8px,transparent 14px)":"repeating-linear-gradient(180deg,#ffe066 0,#ffe066 8px,transparent 8px,transparent 14px)"):undefined,
                    backgroundColor:"transparent",
                  }}/>
                )}

{(() => {
                  // Find if this cell has a slot assignment
                  const entry = Object.values(slotMap).find(e => e.cell && e.cell.x === x && e.cell.y === y);
                  if (!entry) {
                    // Regular track cell — faint direction hint
                    if (onTrack && !isObs && !isCarHere && arrow) return <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none',zIndex:2,opacity:0.18,fontSize:'1.1rem',color:'#ffe066'}}>{arrow}</div>;
                    return null;
                  }
                  if (entry.type === 'gap') {
                    const isActive = isDemoMode && activeGapIdx >= 0 && slotMap[activeGapIdx] === entry;
                    const ghostCmd = isActive && demoCorrectCmd
                      ? COMMANDS.find(c => c.id === demoCorrectCmd) : null;
                    return (
                      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,pointerEvents:'none'}}>
                        {ghostCmd ? (
                          <div style={{background:ghostCmd.color+'55',border:`2px dashed ${ghostCmd.color}`,borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',color:'#fff',animation:'ctcPulse 0.8s ease-in-out infinite',opacity:0.75}}>
                            {getCmdIcon(ghostCmd.id)}
                          </div>
                        ) : (
                          <div style={{background:'rgba(255,224,102,0.12)',border:'2px dashed #ffe066',borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',color:'#ffe066',animation:'ctcPulse 1s ease-in-out infinite'}}>?</div>
                        )}
                      </div>
                    );
                  }
                  const cmd = COMMANDS.find(c => c.id === entry.cmdId);
                  const blockColor = cmd ? cmd.color : '#555';
                  const childFilled = !entry.locked && entry.cmdId;
                  const blockStyle = {
                    background: blockColor + 'dd',
                    border: childFilled ? '2px solid #2ecc71' : '1.5px solid rgba(255,255,255,0.2)',
                    borderRadius: 8, width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: childFilled ? '0 0 8px #2ecc71bb' : '0 2px 5px rgba(0,0,0,0.5)',
                    fontSize: '1.25rem', color: '#fff',
                  };
                  if (entry.type === 'turn') {
                    return (
                      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,pointerEvents:'none'}}>
                        <div style={blockStyle}><TurnArrow fromDir={entry.fromDir} toDir={entry.toDir} size={24}/></div>
                      </div>
                    );
                  }
                  const dirArrow = {right:'→',left:'←',up:'↑',down:'↓'}[entry.fromDir] || '→';
                  return (
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,pointerEvents:'none'}}>
                      <div style={blockStyle}>{dirArrow}</div>
                    </div>
                  );
                })()}

                {level.start.x===x&&level.start.y===y&&!isCarHere&&<div style={{position:"absolute",bottom:2,fontSize:"0.55rem",color:"#27ae60",fontWeight:700,zIndex:2}}>START</div>}
                {isObs&&!isCarHere&&<span style={{fontSize:"1.6rem",zIndex:2}}>🚧</span>}
                {isFin&&!isCarHere&&<span style={{fontSize:"1.6rem",zIndex:2}}>🏁</span>}
                {isCarHere&&<div style={{zIndex:3}}><CarSVG car={car} dir={carDir} size={48}/></div>}
              </div>
            );
          }))}
        </div>
      </div>

      {/* Command palette */}
      <div style={{...card,marginBottom:10,width:"100%",maxWidth:380}}>
        <div style={{color:"#aee4f7",fontSize:"0.8rem",marginBottom:8,fontWeight:600}}>
          {isOpenLevel ? "Add commands:" : (allFilled ? "All gaps filled ✓" : "Fill the gap:")}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {COMMANDS.map(cmd=>(
            <button key={cmd.id} onClick={()=>addCmd(cmd.id)} title={cmd.label}
              disabled={status==="running"||(!isOpenLevel&&allFilled)||sequence.length>=MAX_SEQ}
              style={{width:58,height:58,borderRadius:12,background:cmd.color+"cc",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
              {getCmdIcon(cmd.id)}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center',justifyContent:'center',padding:'0.5rem'}}>
          <button
            onClick={undoLast}
            disabled={status === 'running'}
            style={{padding:'0.4rem 1rem',borderRadius:'8px',border:'none',background:'#333',color:'#fff',cursor:'pointer',fontSize:'1rem'}}
          >⌫ Undo</button>
          <button
            onClick={clearAll}
            disabled={status === 'running'}
            style={{padding:'0.4rem 1rem',borderRadius:'8px',border:'none',background:'#333',color:'#fff',cursor:'pointer',fontSize:'1rem'}}
          >✕ Clear</button>
          {isOpenLevel && canRun && status === 'idle' && (
            <button onClick={runSequence} style={{padding:'0.4rem 1rem',borderRadius:'8px',border:'none',background:'#27ae60',color:'#fff',cursor:'pointer',fontSize:'1rem',fontWeight:700}}>▶ GO</button>
          )}
          {!isOpenLevel && allFilled && status === 'idle' && (
            <span style={{color:'#ffe066',fontSize:'0.9rem',marginLeft:'0.5rem'}}>✓ Ready — launching…</span>
          )}
        </div>
      {/* GO! overlay */}
      {showGoOverlay && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,pointerEvents:'none',background:'rgba(0,0,0,0.15)'}}>
          <span style={{fontSize:'6rem',fontWeight:900,color:'#ffe066',textShadow:'0 4px 24px rgba(0,0,0,0.5)',animation:'goPopIn 0.35s ease-out forwards'}}>GO!</span>
        </div>
      )}
      {levelComplete && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <style>{`@keyframes ctcStarPop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
          <div style={{background:'#fff',borderRadius:16,padding:'2rem 2.5rem',textAlign:'center',minWidth:260,boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
            <div style={{fontSize:'2rem',fontWeight:'bold',marginBottom:8}}>🏁 Level Complete!</div>
            <div style={{display:'flex',gap:8,justifyContent:'center',margin:'1rem 0'}}>
              {[1,2,3].map(n => {
                const {stars: _s} = getStarsForLevel(levelIndex);
                return (
                  <span key={n} style={{
                    fontSize:'2.5rem',
                    display:'inline-block',
                    animation: n <= _s ? `ctcStarPop 0.35s ease-out ${(n-1)*0.2}s both` : 'none',
                    opacity: n <= _s ? 1 : 0.25,
                  }}>{n <= _s ? '⭐' : '☆'}</span>
                );
              })}
            </div>
            <div style={{fontSize:'1.1rem',marginBottom:'1.2rem',color:'#555'}}>
              {(() => { const {stars:_s2} = getStarsForLevel(levelIndex); return _s2 === 3 ? '⭐ Perfect!' : _s2 === 2 ? '🌟 Great job!' : '👍 Keep going!'; })()}
            </div>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <button
                onClick={() => {
                  const activeCircuit = CIRCUITS[circuitIdx ?? 0];
                  const next = (levelIndex + 1) % (activeCircuit.levels.length || 1);
                  const nextLv = activeCircuit.levels[next] || LEVELS[0];
                  setLevelIndex(next);
                  setSlots(buildSlots(nextLv.scaffold));
                  setCarPos(nextLv.start); setCarDir(nextLv.startDir);
                  setStatus('idle');
                  setWins(0);
                  setWrongAttempts(0);
                  setLevelComplete(false);
                }}
                style={{padding:'0.6rem 1.2rem',background:'#4caf50',color:'#fff',border:'none',borderRadius:8,fontSize:'1rem',cursor:'pointer',fontWeight:'bold'}}>
                ▶ Next Level
              </button>
              <button
                onClick={() => {
                  setSlots(buildSlots(level.scaffold));
                  setCarPos(level.start); setCarDir(level.startDir);
                  setStatus('idle');
                  setWrongAttempts(0);
                  setLevelComplete(false);
                }}
                style={{padding:'0.6rem 1.2rem',background:'#2196f3',color:'#fff',border:'none',borderRadius:8,fontSize:'1rem',cursor:'pointer',fontWeight:'bold'}}>
                ↩ Replay
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes goPopIn { from { transform: scale(0.4); opacity: 0; } 70% { transform: scale(1.25); } to { transform: scale(1); opacity: 1; } }
        @keyframes ctcPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
