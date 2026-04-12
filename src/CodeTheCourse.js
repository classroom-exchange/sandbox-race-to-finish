import { useState, useRef, useEffect } from "react";

// ── Injected keyframe animation ───────────────────────────────────────────────
const PULSE_STYLE = `@keyframes carPulse { 0% { transform: scale(1.25); } 100% { transform: scale(1); } }`;

const GRID = 5;

// ── Rich car SVGs (matching RaceToFinish.js character designs) ─────────────────
function McQueenSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 80 50"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      <ellipse cx="40" cy="32" rx="34" ry="13" fill="#e8002d"/>
      <path d="M20,32 Q22,16 35,14 L52,14 Q64,16 60,32 Z" fill="#cc0022"/>
      <path d="M26,30 Q28,18 37,16 L50,16 Q58,18 56,30 Z" fill="#aee4f7" opacity="0.9"/>
      <ellipse cx="35" cy="23" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="50" cy="23" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="36" cy="23.5" rx="3" ry="3.5" fill="#1a6bb5"/>
      <ellipse cx="51" cy="23.5" rx="3" ry="3.5" fill="#1a6bb5"/>
      <circle cx="37" cy="22.5" r="1.2" fill="black"/>
      <circle cx="52" cy="22.5" r="1.2" fill="black"/>
      <circle cx="35.5" cy="21.5" r="0.8" fill="white"/>
      <circle cx="50.5" cy="21.5" r="0.8" fill="white"/>
      <text x="40" y="37" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Arial">95</text>
      <circle cx="18" cy="38" r="8" fill="#222"/><circle cx="18" cy="38" r="4" fill="#888"/>
      <circle cx="62" cy="38" r="8" fill="#222"/><circle cx="62" cy="38" r="4" fill="#888"/>
      <ellipse cx="72" cy="30" rx="4" ry="3" fill="#ffe066"/>
      <ellipse cx="8" cy="30" rx="3" ry="2.5" fill="#ff6666"/>
      <polygon points="44,17 41,22 43,22 40,28 44,22 42,22" fill="#ffe066"/>
    </svg>
  );
}

function TheKingSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 70"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      <line x1="72" y1="25" x2="72" y2="6" stroke="#87CEEB" strokeWidth="2"/>
      <line x1="78" y1="25" x2="78" y2="6" stroke="#87CEEB" strokeWidth="2"/>
      <rect x="68" y="5" width="14" height="4" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
      <path d="M 15,35 L 25,32 L 70,32 L 82,35 L 82,45 L 15,45 Z" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
      <polygon points="15,32 8,35 15,38" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
      <polygon points="8,35 0,37 8,39" fill="#6BB8D4"/>
      <path d="M 22,32 L 70,30 L 68,25 L 24,27 Z" fill="white" stroke="#e0e0e0" strokeWidth="0.5"/>
      <ellipse cx="32" cy="28" rx="7" ry="8" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <ellipse cx="32" cy="28" rx="5" ry="6" fill="#4a90e2"/>
      <circle cx="32" cy="28" r="2.5" fill="black"/>
      <circle cx="31" cy="26" r="1" fill="white"/>
      <ellipse cx="56" cy="28" rx="7" ry="8" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <ellipse cx="56" cy="28" rx="5" ry="6" fill="#4a90e2"/>
      <circle cx="56" cy="28" r="2.5" fill="black"/>
      <circle cx="55" cy="26" r="1" fill="white"/>
      <text x="44" y="41" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial">43</text>
      <circle cx="28" cy="48" r="6" fill="#222"/><circle cx="28" cy="48" r="3" fill="#666"/>
      <circle cx="66" cy="48" r="6" fill="#222"/><circle cx="66" cy="48" r="3" fill="#666"/>
      <ellipse cx="12" cy="36" rx="2.5" ry="2" fill="#ffe066"/>
    </svg>
  );
}

function MaterSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 90 55"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      <rect x="8" y="28" width="62" height="16" rx="4" fill="#8B6914"/>
      <path d="M30,28 Q32,12 44,11 L60,11 Q70,13 68,28 Z" fill="#7a5c10"/>
      <path d="M35,27 Q36,15 45,13 L58,13 Q65,15 64,27 Z" fill="#aee4f7" opacity="0.85"/>
      <ellipse cx="44" cy="20" rx="5.5" ry="6" fill="white"/>
      <ellipse cx="57" cy="20" rx="5.5" ry="6" fill="white"/>
      <ellipse cx="45" cy="20.5" rx="3.5" ry="4" fill="#4a7c30"/>
      <ellipse cx="58" cy="20.5" rx="3.5" ry="4" fill="#4a7c30"/>
      <circle cx="46" cy="19.5" r="1.2" fill="black"/>
      <circle cx="59" cy="19.5" r="1.2" fill="black"/>
      <circle cx="44.5" cy="18.5" r="0.8" fill="white"/>
      <circle cx="57.5" cy="18.5" r="0.8" fill="white"/>
      <rect x="47" y="27" width="5" height="4" rx="1" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <rect x="53" y="27" width="5" height="4" rx="1" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <line x1="52" y1="27" x2="52" y2="31" stroke="#ddd" strokeWidth="0.5"/>
      <line x1="8" y1="30" x2="2" y2="22" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <line x1="2" y1="22" x2="2" y2="28" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="22" cy="42" r="9" fill="#222"/><circle cx="22" cy="42" r="5" fill="#666"/>
      <circle cx="58" cy="42" r="9" fill="#222"/><circle cx="58" cy="42" r="5" fill="#666"/>
      <ellipse cx="70" cy="33" rx="4" ry="3" fill="#ffe8a0"/>
    </svg>
  );
}

function CarSVG({ car, dir, size = 48 }) {
  if (car === "the-king") return <TheKingSVG dir={dir} size={size} />;
  if (car === "mater")    return <MaterSVG dir={dir} size={size} />;
  return <McQueenSVG dir={dir} size={size} />;
}

// ── Level definitions ─────────────────────────────────────────────────────────
const LEVELS = [
  {
    label: "Straight Shot",
    hint: "Move forward to the flag! 🏁",
    start: { x: 0, y: 2 }, startDir: "right",
    finish: { x: 4, y: 2 }, obstacles: [],
    scaffold: ["forward", null, "forward", null],
    trackPath: [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2}],
  },
  {
    label: "Right Turn Ahead",
    hint: "Go right, then turn and go down!",
    start: { x: 0, y: 0 }, startDir: "right",
    finish: { x: 4, y: 4 }, obstacles: [],
    scaffold: ["forward","forward",null,"forward","forward","turnRight","forward","forward",null,"forward"],
    trackPath: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4}],
  },
  {
    label: "Zigzag",
    hint: "You'll need to turn twice!",
    start: { x: 0, y: 4 }, startDir: "right",
    finish: { x: 4, y: 0 }, obstacles: [],
    scaffold: ["forward","forward","turnLeft",null,"forward","forward","turnRight",null,"forward"],
    trackPath: [{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:2,y:3},{x:2,y:2},{x:2,y:1},{x:2,y:0},{x:3,y:0},{x:4,y:0}],
  },
  {
    label: "Cone Zone",
    hint: "Watch out for the cone! Go around it. 🚧",
    start: { x: 0, y: 2 }, startDir: "right",
    finish: { x: 4, y: 2 }, obstacles: [{ x: 2, y: 2 }],
    scaffold: ["forward", null],
    trackPath: [{x:0,y:2},{x:1,y:2},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:3,y:2},{x:4,y:2}],
  },
  {
    label: "Repeat Road",
    hint: "Try using Repeat ×2 to save steps! 🔁",
    start: { x: 0, y: 2 }, startDir: "right",
    finish: { x: 4, y: 2 }, obstacles: [{ x: 1, y: 2 }, { x: 3, y: 2 }],
    scaffold: [],
    trackPath: [{x:0,y:2},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:4,y:2}],
  },
];

const COMMANDS = [
  { id: "forward",   icon: "⬆️", label: "Forward",    color: "#2980b9" },
  { id: "turnLeft",  icon: "↰",  label: "Turn Left",  color: "#8e44ad" },
  { id: "turnRight", icon: "↱",  label: "Turn Right", color: "#8e44ad" },
  { id: "reverse",   icon: "⬇️", label: "Reverse",    color: "#555"    },
  { id: "repeat2",   icon: "×2", label: "Repeat ×2",  color: "#e67e22" },
];

const MAX_SEQ = 12;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function turnLeft(d)  { return { right:"up", up:"left", left:"down", down:"right" }[d]; }
function turnRight(d) { return { right:"down", down:"left", left:"up", up:"right" }[d]; }
function reverseDir(d){ return { right:"left", left:"right", up:"down", down:"up" }[d]; }
function moveInDir(pos, dir) {
  if (dir === "right") return { x: pos.x + 1, y: pos.y };
  if (dir === "left")  return { x: pos.x - 1, y: pos.y };
  if (dir === "up")    return { x: pos.x,     y: pos.y - 1 };
  return                      { x: pos.x,     y: pos.y + 1 };
}

function buildSlots(scaffold) {
  const slots = scaffold.map(cmdId => ({ cmdId: cmdId || null, locked: cmdId !== null }));
  while (slots.length < MAX_SEQ) slots.push({ cmdId: null, locked: false });
  return slots;
}

export default function CodeTheCourse({ car, onBack }) {
  const [levelIndex, setLevelIndex]   = useState(0);
  const [slots, setSlots]             = useState(() => buildSlots(LEVELS[0].scaffold));
  const [carPos, setCarPos]           = useState(LEVELS[0].start);
  const [carDir, setCarDir]           = useState(LEVELS[0].startDir);
  const [status, setStatus]           = useState("idle");
  const [stars, setStars]             = useState(() => JSON.parse(localStorage.getItem("ctc_stars") || "[]"));
  const [winsThisLevel, setWinsThisLevel] = useState(0);
  const [activeStep, setActiveStep]   = useState(-1);
  const [visitedCells, setVisitedCells] = useState([]);
  const [animCell, setAnimCell]       = useState(null);
  const runningRef = useRef(false);

  const level = LEVELS[levelIndex];

  function resetLevel(idx) {
    const lv = LEVELS[idx];
    setSlots(buildSlots(lv.scaffold));
    setCarPos(lv.start);
    setCarDir(lv.startDir);
    setStatus("idle");
    setActiveStep(-1);
    setVisitedCells([]);
    setAnimCell(null);
    runningRef.current = false;
  }

  function addCommand(id) {
    if (status === "running") return;
    setSlots(prev => {
      const firstEmpty = prev.findIndex(s => !s.cmdId && !s.locked);
      if (firstEmpty === -1) return prev;
      const next = [...prev];
      next[firstEmpty] = { cmdId: id, locked: false };
      return next;
    });
  }

  function removeCommand(idx) {
    if (status === "running") return;
    setSlots(prev => {
      if (prev[idx].locked) return prev;
      const next = [...prev];
      next[idx] = { cmdId: null, locked: false };
      return next;
    });
  }

  function undoLast() {
    if (status === "running") return;
    setSlots(prev => {
      const idx = [...prev].reverse().findIndex(s => s.cmdId && !s.locked);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      const next = [...prev];
      next[realIdx] = { cmdId: null, locked: false };
      return next;
    });
  }

  function clearAll() {
    if (status === "running") return;
    setSlots(buildSlots(level.scaffold));
  }

  const sequence = slots.filter(s => s.cmdId).map(s => s.cmdId);

  const runSequence = async () => {
    if (status === "running" || sequence.length === 0) return;
    runningRef.current = true;
    setStatus("running");
    setVisitedCells([level.start]);

    let pos = { ...level.start };
    let dir = level.startDir;

    const isObstacle = (p) => level.obstacles.some(o => o.x === p.x && o.y === p.y);
    const isFinish   = (p) => p.x === level.finish.x && p.y === level.finish.y;
    const outOfBounds= (p) => p.x < 0 || p.x >= GRID || p.y < 0 || p.y >= GRID;

    const executeCmd = async (cmd, stepIdx) => {
      setActiveStep(stepIdx);
      await sleep(500);
      if (cmd === "turnLeft") {
        dir = turnLeft(dir); setCarDir(dir);
      } else if (cmd === "turnRight") {
        dir = turnRight(dir); setCarDir(dir);
      } else if (cmd === "forward" || cmd === "reverse") {
        const next = moveInDir(pos, cmd === "reverse" ? reverseDir(dir) : dir);
        if (outOfBounds(next) || isObstacle(next)) return "crash";
        pos = next;
        setCarPos({ ...pos });
        setAnimCell(`${pos.x}-${pos.y}`);
        setTimeout(() => setAnimCell(null), 350);
        setVisitedCells(prev => [...prev, { ...pos }]);
        if (isFinish(pos)) return "win";
      }
      return null;
    };

    for (let i = 0; i < sequence.length; i++) {
      if (!runningRef.current) break;
      const cmd = sequence[i];
      let result = null;
      if (cmd === "repeat2" && i > 0) {
        const prev = sequence[i - 1];
        if (prev !== "repeat2") {
          result = await executeCmd(prev, i);
          if (result) break;
          result = await executeCmd(prev, i);
          if (result) break;
        }
      } else if (cmd !== "repeat2") {
        result = await executeCmd(cmd, i);
        if (result) break;
      }
    }

    setActiveStep(-1);
    runningRef.current = false;

    if (pos.x === level.finish.x && pos.y === level.finish.y) {
      setStatus("win");
      const newWins = winsThisLevel + 1;
      if (newWins >= 2) {
        const newStars = [...new Set([...stars, levelIndex])];
        setStars(newStars);
        localStorage.setItem("ctc_stars", JSON.stringify(newStars));
        await sleep(2000);
        if (levelIndex < LEVELS.length - 1) {
          const next = levelIndex + 1;
          setLevelIndex(next);
          setWinsThisLevel(0);
          resetLevel(next);
        } else {
          setStatus("complete");
        }
      } else {
        setWinsThisLevel(newWins);
        await sleep(1800);
        resetLevel(levelIndex);
        setWinsThisLevel(newWins);
      }
    } else if (status !== "win") {
      setStatus("crash");
      await sleep(1500);
      resetLevel(levelIndex);
      setWinsThisLevel(winsThisLevel);
    }
  };

  const isOnTrack = (x, y) => level.trackPath.some(c => c.x === x && c.y === y);
  const isObstacleCell = (x, y) => level.obstacles.some(o => o.x === x && o.y === y);
  const isVisited = (x, y) => visitedCells.some(c => c.x === x && c.y === y);

  const showRepeat = levelIndex >= 3;
  const visibleCmds = COMMANDS.filter(c => c.id !== "repeat2" || showRepeat);

  const bg = "linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)";
  const cardStyle = {
    background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16,
    backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)",
  };

  const cmdBtnStyle = (color, active) => ({
    width: 56, height: 56, borderRadius: 12,
    background: active ? color : color + "cc",
    border: active ? "3px solid #fff" : "2px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: 22, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: active ? "0 0 12px " + color : "none", transition: "all 0.15s", flexShrink: 0,
  });

  if (status === "complete") {
    return (
      <div style={{ minHeight:"100vh", background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',Arial,sans-serif" }}>
        <style>{PULSE_STYLE}</style>
        <div style={{ ...cardStyle, textAlign:"center", padding:40 }}>
          <div style={{ fontSize:"3rem" }}>🎉</div>
          <div style={{ fontSize:"2rem", fontWeight:900, color:"#ffe066", marginTop:12 }}>All done!</div>
          <div style={{ color:"#aee4f7", marginTop:8 }}>You completed all 5 levels!</div>
          <div style={{ marginTop:12 }}>{LEVELS.map((_,i)=><span key={i}>⭐</span>)}</div>
          <button onClick={()=>{ setLevelIndex(0); setWinsThisLevel(0); resetLevel(0); }}
            style={{ marginTop:24, padding:"12px 28px", borderRadius:24, background:"#ffe066", color:"#1a1a2e", fontWeight:700, fontSize:16, border:"none", cursor:"pointer" }}>
            Play Again
          </button>
          <button onClick={onBack}
            style={{ marginTop:12, display:"block", padding:"10px 24px", borderRadius:24, background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:15, border:"none", cursor:"pointer" }}>
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:"relative", minHeight:"100vh", background:bg, display:"flex", flexDirection:"column", alignItems:"center", padding:16, fontFamily:"'Segoe UI',Arial,sans-serif" }}>
      <style>{PULSE_STYLE}</style>

      <button onClick={onBack} style={{ position:"absolute", top:12, left:12, padding:"6px 14px", borderRadius:20, background:"rgba(255,255,255,0.15)", color:"#fff", border:"none", cursor:"pointer", fontSize:14, zIndex:10 }}>
        ← Menu
      </button>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:10, marginTop:36 }}>
        <div style={{ fontSize:"1.6rem", fontWeight:900, color:"#ffe066" }}>💻 Code the Course</div>
        <div style={{ color:"#aee4f7", fontSize:"0.9rem", marginTop:2 }}>
          Level {levelIndex+1} of {LEVELS.length} — {level.label}
          <span style={{ marginLeft:8 }}>{LEVELS.map((_,i)=><span key={i}>{stars.includes(i)?"⭐":"·"}</span>)}</span>
        </div>
        <div style={{ color:"#ffffff99", fontSize:"0.85rem", fontStyle:"italic", marginTop:2 }}>{level.hint}</div>
        <div style={{ color:"#ffe066", fontSize:"0.85rem", marginTop:2 }}>{winsThisLevel===1?"⭐ 1 win — one more for a star!":""}</div>
      </div>

      {/* Status overlays */}
      {status==="win" && (
        <div style={{ position:"fixed", top:"40%", left:"50%", transform:"translate(-50%,-50%)", background:"rgba(39,174,96,0.95)", borderRadius:20, padding:"20px 40px", fontSize:"1.4rem", fontWeight:700, color:"#fff", zIndex:100, textAlign:"center" }}>
          🏁 You made it! {winsThisLevel+1>=2?"⭐ Level complete!":""}
        </div>
      )}
      {status==="crash" && (
        <div style={{ position:"fixed", top:"40%", left:"50%", transform:"translate(-50%,-50%)", background:"rgba(192,57,43,0.95)", borderRadius:20, padding:"20px 40px", fontSize:"1.4rem", fontWeight:700, color:"#fff", zIndex:100, textAlign:"center" }}>
          💥 Crash! Try again.
        </div>
      )}

      {/* Grid */}
      <div style={{ ...cardStyle, marginBottom:12, padding:8 }}>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${GRID}, 64px)`, gap:3 }}>
          {Array.from({ length:GRID }, (_,y) =>
            Array.from({ length:GRID }, (_,x) => {
              const isCarHere  = carPos.x===x && carPos.y===y;
              const isFin      = level.finish.x===x && level.finish.y===y;
              const isObs      = isObstacleCell(x,y);
              const onTrack    = isOnTrack(x,y);
              const visited    = isVisited(x,y);
              const isStart    = level.start.x===x && level.start.y===y;
              const isAnimated = animCell===`${x}-${y}`;

              let bg, border;
              if (isObs) {
                bg = "rgba(255,80,40,0.3)"; border = "2px solid #ff5028";
              } else if (onTrack) {
                bg = visited ? "rgba(255,230,102,0.15)" : "#2c2c2c";
                border = "2px solid #444";
              } else {
                bg = "#1a4a1a"; border = "2px solid #2d6a2d";
              }

              return (
                <div key={`${x}-${y}`} style={{
                  width:64, height:64, background:bg, border,
                  borderRadius:6, display:"flex", alignItems:"center",
                  justifyContent:"center", position:"relative", overflow:"hidden",
                  animation: isAnimated ? "carPulse 0.35s ease-out" : "none",
                }}>
                  {/* Asphalt centre line on track cells */}
                  {onTrack && !isObs && (
                    <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:"rgba(255,255,255,0.2)", borderRadius:1, transform:"translateX(-50%)" }}/>
                  )}
                  {isStart && !isCarHere && (
                    <div style={{ position:"absolute", bottom:3, fontSize:"0.6rem", color:"#27ae60", fontWeight:700 }}>START</div>
                  )}
                  {isObs && !isCarHere && <span style={{ fontSize:"1.6rem" }}>🚧</span>}
                  {isFin && !isCarHere && <span style={{ fontSize:"1.6rem" }}>🏁</span>}
                  {isCarHere && <CarSVG car={car} dir={carDir} size={48} />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Command palette */}
      <div style={{ ...cardStyle, marginBottom:10, width:"100%", maxWidth:380 }}>
        <div style={{ color:"#aee4f7", fontSize:"0.8rem", marginBottom:8, fontWeight:600 }}>COMMAND BLOCKS — tap to add</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {visibleCmds.map(cmd => (
            <button key={cmd.id} onClick={() => addCommand(cmd.id)} title={cmd.label}
              style={cmdBtnStyle(cmd.color, false)}
              disabled={status==="running" || sequence.length>=MAX_SEQ}
            >
              {cmd.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Sequence tray */}
      <div style={{ ...cardStyle, marginBottom:12, width:"100%", maxWidth:380 }}>
        <div style={{ color:"#aee4f7", fontSize:"0.8rem", marginBottom:8, fontWeight:600 }}>
          YOUR SEQUENCE — tap an unlocked block to remove it
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", minHeight:64 }}>
          {slots.map((slot, i) => {
            const cmd = COMMANDS.find(c => c.id === slot.cmdId);
            const isActive = i===activeStep;
            return (
              <div key={i} onClick={() => !slot.locked && removeCommand(i)}
                style={{
                  width:52, height:52, borderRadius:10,
                  border: slot.cmdId
                    ? `${slot.locked?"3px":"2px"} solid ${isActive?"#fff":slot.locked?"#ffe066":"rgba(255,255,255,0.3)"}`
                    : "2px dashed rgba(255,255,255,0.2)",
                  background: cmd ? cmd.color+(isActive?"ff":slot.locked?"ee":"99") : "rgba(255,255,255,0.04)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, color:"#fff",
                  cursor: slot.locked ? "default" : slot.cmdId ? "pointer" : "default",
                  boxShadow: isActive ? "0 0 14px #fff" : slot.locked && slot.cmdId ? "0 0 6px #ffe06666" : "none",
                  transition:"all 0.15s", flexShrink:0,
                  opacity: slot.locked && slot.cmdId ? 1 : undefined,
                }}>
                {cmd ? cmd.icon : <span style={{ fontSize:14, color:"rgba(255,255,255,0.3)" }}>?</span>}
              </div>
            );
          })}
        </div>
        {level.scaffold.length > 0 && (
          <div style={{ color:"#ffe06699", fontSize:"0.72rem", marginTop:6 }}>
            🔒 Gold-bordered blocks are hints — fill in the <span style={{ color:"#fff" }}>?</span> gaps
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        {/* GO button */}
        <button onClick={runSequence}
          disabled={status==="running" || sequence.length===0}
          style={{
            width:72, height:72, borderRadius:36,
            background: status==="running" || sequence.length===0
              ? "#555"
              : "linear-gradient(135deg,#27ae60,#2ecc71)",
            color:"#fff", fontWeight:900, fontSize:sequence.length>0&&status!=="running"?18:15,
            border:"none",
            cursor: status==="running" || sequence.length===0 ? "not-allowed" : "pointer",
            opacity: status==="running" || sequence.length===0 ? 0.5 : 1,
            boxShadow: status!=="running" && sequence.length>0 ? "0 0 20px #27ae6088" : "none",
            transition:"all 0.2s", display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", lineHeight:1.2,
          }}>
          {status==="running" ? <>🚗<span style={{ fontSize:11 }}>...</span></> : <>🚦<span style={{ fontSize:13 }}>GO!</span></>}
        </button>
        <button onClick={undoLast} disabled={status==="running"}
          style={{ padding:"12px 20px", borderRadius:24, background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:15, border:"none", cursor:"pointer" }}>
          ⌫ Undo
        </button>
        <button onClick={clearAll} disabled={status==="running"}
          style={{ padding:"12px 20px", borderRadius:24, background:"rgba(192,57,43,0.5)", color:"#fff", fontSize:15, border:"none", cursor:"pointer" }}>
          ✕ Clear
        </button>
      </div>
    </div>
  );
}
