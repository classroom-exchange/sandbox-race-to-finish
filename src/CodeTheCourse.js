import { useState, useRef, useCallback } from "react";

// ── SVG car renderings (same as RaceToFinish.js) ─────────────────────────────
function McQueenSVG({ scale = 1 }) {
  return (
    <svg width={80*scale} height={44*scale} viewBox="0 0 80 44">
      <rect x="8" y="16" width="64" height="20" rx="4" fill="#e8002d"/>
      <rect x="16" y="8" width="40" height="14" rx="4" fill="#e8002d"/>
      <rect x="18" y="10" width="36" height="10" rx="2" fill="#aee4f7" opacity="0.7"/>
      <circle cx="18" cy="36" r="7" fill="#222"/>
      <circle cx="18" cy="36" r="4" fill="#888"/>
      <circle cx="62" cy="36" r="7" fill="#222"/>
      <circle cx="62" cy="36" r="4" fill="#888"/>
      <rect x="68" y="22" width="6" height="8" rx="2" fill="#ffe066"/>
      <rect x="6" y="22" width="4" height="6" rx="1" fill="#ff8800" opacity="0.8"/>
      <text x="35" y="29" fontSize="8" fill="#fff" fontWeight="bold" textAnchor="middle">95</text>
    </svg>
  );
}

function KingSVG({ scale = 1 }) {
  return (
    <svg width={80*scale} height={44*scale} viewBox="0 0 80 44">
      <rect x="6" y="16" width="68" height="20" rx="4" fill="#87CEEB"/>
      <rect x="14" y="8" width="44" height="14" rx="4" fill="#87CEEB"/>
      <rect x="16" y="10" width="40" height="10" rx="2" fill="#dff4ff" opacity="0.7"/>
      <circle cx="18" cy="36" r="7" fill="#222"/>
      <circle cx="18" cy="36" r="4" fill="#888"/>
      <circle cx="62" cy="36" r="7" fill="#222"/>
      <circle cx="62" cy="36" r="4" fill="#888"/>
      <rect x="68" y="21" width="7" height="9" rx="2" fill="#ffe066"/>
      <rect x="4" y="22" width="4" height="6" rx="1" fill="#ff8800" opacity="0.8"/>
      <rect x="14" y="4" width="20" height="6" rx="2" fill="#87CEEB"/>
      <text x="38" y="29" fontSize="8" fill="#fff" fontWeight="bold" textAnchor="middle">43</text>
    </svg>
  );
}

function MaterSVG({ scale = 1 }) {
  return (
    <svg width={80*scale} height={50*scale} viewBox="0 0 80 50">
      <rect x="10" y="20" width="58" height="20" rx="3" fill="#8B6914"/>
      <rect x="18" y="10" width="30" height="14" rx="3" fill="#7a5c10"/>
      <rect x="20" y="12" width="26" height="8" rx="2" fill="#c8a96e" opacity="0.5"/>
      <circle cx="20" cy="40" r="7" fill="#222"/>
      <circle cx="20" cy="40" r="4" fill="#666"/>
      <circle cx="60" cy="40" r="7" fill="#222"/>
      <circle cx="60" cy="40" r="4" fill="#666"/>
      <rect x="64" y="24" width="6" height="8" rx="1" fill="#ffe066" opacity="0.8"/>
      <rect x="10" y="24" width="4" height="6" rx="1" fill="#ff4400" opacity="0.6"/>
      <rect x="22" y="6" width="6" height="8" rx="1" fill="#8B6914"/>
      <rect x="52" y="6" width="6" height="8" rx="1" fill="#8B6914"/>
    </svg>
  );
}

function CarSVG({ car, dir, scale = 1 }) {
  const transforms = {
    right: "",
    left: "scaleX(-1)",
    up: "rotate(-90deg)",
    down: "rotate(90deg)",
  };
  const style = {
    display: "inline-block",
    transform: transforms[dir] || "",
    transformOrigin: "center center",
  };
  return (
    <span style={style}>
      {car === "mcqueen" && <McQueenSVG scale={scale} />}
      {car === "king" && <KingSVG scale={scale} />}
      {car === "mater" && <MaterSVG scale={scale} />}
    </span>
  );
}

// ── Level definitions ─────────────────────────────────────────────────────────
const LEVELS = [
  {
    label: "Straight Shot",
    hint: "Move forward to the flag! 🏁",
    start: { x: 0, y: 2 }, startDir: "right",
    finish: { x: 4, y: 2 }, obstacles: [],
    // Solution: Forward ×4
  },
  {
    label: "Right Turn Ahead",
    hint: "Go right, then turn and go down!",
    start: { x: 0, y: 0 }, startDir: "right",
    finish: { x: 4, y: 4 }, obstacles: [],
    // Solution: Forward ×4, TurnRight, Forward ×4
  },
  {
    label: "Zigzag",
    hint: "You'll need to turn twice!",
    start: { x: 0, y: 4 }, startDir: "right",
    finish: { x: 4, y: 0 }, obstacles: [],
    // Solution: Forward ×2, TurnLeft, Forward ×4, TurnRight, Forward ×2
  },
  {
    label: "Cone Zone",
    hint: "Watch out for the cone! Go around it. 🚧",
    start: { x: 0, y: 2 }, startDir: "right",
    finish: { x: 4, y: 2 }, obstacles: [{ x: 2, y: 2 }],
    // Solution: Forward, TurnLeft, Forward, TurnRight, Forward, TurnRight, Forward, TurnLeft, Forward
  },
  {
    label: "Repeat Road",
    hint: "Try using Repeat ×2 to save steps! 🔁",
    start: { x: 0, y: 0 }, startDir: "right",
    finish: { x: 4, y: 4 }, obstacles: [{ x: 2, y: 0 }, { x: 2, y: 4 }],
    // Must navigate around two obstacles using Repeat block
  },
];

// ── Command palette ───────────────────────────────────────────────────────────
const COMMANDS = [
  { id: "forward",   icon: "▲", label: "Forward",   color: "#27ae60" },
  { id: "turnLeft",  icon: "↺", label: "Turn Left",  color: "#e67e22" },
  { id: "turnRight", icon: "↻", label: "Turn Right", color: "#2980b9" },
  { id: "reverse",   icon: "▼", label: "Reverse",    color: "#c0392b" },
  { id: "repeat2",   icon: "🔁", label: "Repeat ×2", color: "#8e44ad" },
];

// ── Direction helpers ─────────────────────────────────────────────────────────
function turnLeft(dir) {
  return { right: "up", up: "left", left: "down", down: "right" }[dir];
}
function turnRight(dir) {
  return { right: "down", down: "left", left: "up", up: "right" }[dir];
}
function moveInDir(pos, dir) {
  return {
    right: { x: pos.x + 1, y: pos.y },
    left:  { x: pos.x - 1, y: pos.y },
    up:    { x: pos.x,     y: pos.y - 1 },
    down:  { x: pos.x,     y: pos.y + 1 },
  }[dir];
}
function reverseDir(dir) {
  return { right: "left", left: "right", up: "down", down: "up" }[dir];
}

const GRID = 5;
const MAX_SEQ = 10;

// ── Main component ────────────────────────────────────────────────────────────
export default function CodeTheCourse({ car, onBack }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [winsThisLevel, setWinsThisLevel] = useState(0);
  const [stars, setStars] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ctc_stars") || "[]"); }
    catch { return []; }
  });

  const level = LEVELS[levelIndex];

  const [sequence, setSequence] = useState([]);
  const [carPos, setCarPos] = useState(level.start);
  const [carDir, setCarDir] = useState(level.startDir);
  const [activeStep, setActiveStep] = useState(-1);
  const [status, setStatus] = useState("idle"); // idle | running | win | crash | missed
  const [visitedCells, setVisitedCells] = useState([]);
  const runningRef = useRef(false);

  // Reset to a level
  const resetLevel = useCallback((idx) => {
    const lv = LEVELS[idx];
    setSequence([]);
    setCarPos(lv.start);
    setCarDir(lv.startDir);
    setActiveStep(-1);
    setStatus("idle");
    setVisitedCells([]);
    runningRef.current = false;
  }, []);

  const addCommand = (cmdId) => {
    if (status === "running" || sequence.length >= MAX_SEQ) return;
    setSequence(prev => [...prev, cmdId]);
  };

  const removeCommand = (idx) => {
    if (status === "running") return;
    setSequence(prev => prev.filter((_, i) => i !== idx));
  };

  const undoLast = () => {
    if (status === "running") return;
    setSequence(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    if (status === "running") return;
    setSequence([]);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runSequence = async () => {
    if (status === "running" || sequence.length === 0) return;
    runningRef.current = true;
    setStatus("running");
    setVisitedCells([level.start]);

    let pos = { ...level.start };
    let dir = level.startDir;

    const isObstacle = (p) => level.obstacles.some(o => o.x === p.x && o.y === p.y);
    const isFinish = (p) => p.x === level.finish.x && p.y === level.finish.y;
    const outOfBounds = (p) => p.x < 0 || p.x >= GRID || p.y < 0 || p.y >= GRID;

    const executeCmd = async (cmd, stepIdx) => {
      setActiveStep(stepIdx);
      await sleep(500);
      if (cmd === "turnLeft") {
        dir = turnLeft(dir);
        setCarDir(dir);
      } else if (cmd === "turnRight") {
        dir = turnRight(dir);
        setCarDir(dir);
      } else if (cmd === "forward") {
        const next = moveInDir(pos, dir);
        if (outOfBounds(next) || isObstacle(next)) return "crash";
        pos = next;
        setCarPos({ ...pos });
        setVisitedCells(prev => [...prev, { ...pos }]);
        if (isFinish(pos)) return "win";
      } else if (cmd === "reverse") {
        const next = moveInDir(pos, reverseDir(dir));
        if (outOfBounds(next) || isObstacle(next)) return "crash";
        pos = next;
        setCarPos({ ...pos });
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

    // Check outcome
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

  // ── Styles ────────────────────────────────────────────────────────────────
  const bg = "linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)";
  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const cmdBtnStyle = (color, active) => ({
    width: 56, height: 56,
    borderRadius: 12,
    background: active ? color : color + "cc",
    border: active ? "3px solid #fff" : "2px solid rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: active ? "0 0 12px " + color : "none",
    transition: "all 0.15s",
    flexShrink: 0,
  });

  const isObstacleCell = (x, y) => level.obstacles.some(o => o.x === x && o.y === y);
  const isVisited = (x, y) => visitedCells.some(c => c.x === x && c.y === y);

  const showRepeat = levelIndex >= 3;
  const visibleCmds = COMMANDS.filter(c => c.id !== "repeat2" || showRepeat);

  if (status === "complete") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',Arial,sans-serif" }}>
        <div style={{ ...cardStyle, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "3rem" }}>🎉</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#ffe066", marginTop: 12 }}>All done!</div>
          <div style={{ color: "#aee4f7", marginTop: 8 }}>You completed all 5 levels!</div>
          <div style={{ marginTop: 12 }}>{LEVELS.map((_, i) => <span key={i}>⭐</span>)}</div>
          <button onClick={() => { setLevelIndex(0); setWinsThisLevel(0); resetLevel(0); }} style={{ marginTop: 24, padding: "12px 28px", borderRadius: 24, background: "#ffe066", color: "#1a1a2e", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
            Play Again
          </button>
          <button onClick={onBack} style={{ marginTop: 12, display: "block", padding: "10px 24px", borderRadius: 24, background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 15, border: "none", cursor: "pointer" }}>
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", padding: 16, fontFamily: "'Segoe UI',Arial,sans-serif" }}>
      {/* Back button */}
      <button onClick={onBack} style={{ position: "absolute", top: 12, left: 12, padding: "6px 14px", borderRadius: 20, background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, zIndex: 10 }}>
        ← Menu
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#ffe066" }}>💻 Code the Course</div>
        <div style={{ color: "#aee4f7", fontSize: "0.9rem", marginTop: 2 }}>
          Level {levelIndex + 1} of {LEVELS.length} — {level.label}
          <span style={{ marginLeft: 8 }}>
            {LEVELS.map((_, i) => <span key={i}>{stars.includes(i) ? "⭐" : "·"}</span>)}
          </span>
        </div>
        <div style={{ color: "#ffffff99", fontSize: "0.85rem", fontStyle: "italic", marginTop: 2 }}>{level.hint}</div>
        <div style={{ color: "#ffe066", fontSize: "0.85rem", marginTop: 2 }}>
          {winsThisLevel === 1 ? "⭐ 1 win — one more for a star!" : ""}
        </div>
      </div>

      {/* Status overlay */}
      {status === "win" && (
        <div style={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(39,174,96,0.95)", borderRadius: 20, padding: "20px 40px", fontSize: "1.4rem", fontWeight: 700, color: "#fff", zIndex: 100, textAlign: "center" }}>
          🏁 You made it! {winsThisLevel + 1 >= 2 ? "⭐ Level complete!" : ""}
        </div>
      )}
      {status === "crash" && (
        <div style={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(192,57,43,0.95)", borderRadius: 20, padding: "20px 40px", fontSize: "1.4rem", fontWeight: 700, color: "#fff", zIndex: 100, textAlign: "center" }}>
          💥 Crash! Try again.
        </div>
      )}

      {/* Grid */}
      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID}, 64px)`, gap: 4 }}>
          {Array.from({ length: GRID }, (_, y) =>
            Array.from({ length: GRID }, (_, x) => {
              const isCarHere = carPos.x === x && carPos.y === y;
              const isFin = level.finish.x === x && level.finish.y === y;
              const isObs = isObstacleCell(x, y);
              const visited = isVisited(x, y);
              return (
                <div key={`${x}-${y}`} style={{
                  width: 64, height: 64,
                  background: isObs ? "rgba(255,80,40,0.25)" : visited ? "rgba(255,230,102,0.1)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${isObs ? "#ff5028" : visited ? "rgba(255,230,102,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isCarHere ? undefined : "1.6rem",
                  position: "relative",
                }}>
                  {isObs && !isCarHere && <span>🚧</span>}
                  {isFin && !isCarHere && <span>🏁</span>}
                  {isCarHere && <CarSVG car={car} dir={carDir} scale={0.65} />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Command palette */}
      <div style={{ ...cardStyle, marginBottom: 10, width: "100%", maxWidth: 380 }}>
        <div style={{ color: "#aee4f7", fontSize: "0.8rem", marginBottom: 8, fontWeight: 600 }}>COMMAND BLOCKS — tap to add</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {visibleCmds.map(cmd => (
            <button key={cmd.id} onClick={() => addCommand(cmd.id)} title={cmd.label}
              style={cmdBtnStyle(cmd.color, false)}
              disabled={status === "running" || sequence.length >= MAX_SEQ}
            >
              {cmd.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Sequence tray */}
      <div style={{ ...cardStyle, marginBottom: 10, width: "100%", maxWidth: 380 }}>
        <div style={{ color: "#aee4f7", fontSize: "0.8rem", marginBottom: 8, fontWeight: 600 }}>
          YOUR SEQUENCE — tap a block to remove it
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 64 }}>
          {Array.from({ length: MAX_SEQ }, (_, i) => {
            const cmdId = sequence[i];
            const cmd = COMMANDS.find(c => c.id === cmdId);
            const isActive = i === activeStep;
            return (
              <div key={i} onClick={() => cmdId && removeCommand(i)}
                style={{
                  width: 52, height: 52,
                  borderRadius: 10,
                  border: cmdId
                    ? `2px solid ${isActive ? "#fff" : "rgba(255,255,255,0.3)"}`
                    : "2px dashed rgba(255,255,255,0.15)",
                  background: cmd ? cmd.color + (isActive ? "ff" : "99") : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                  cursor: cmdId ? "pointer" : "default",
                  boxShadow: isActive ? "0 0 14px #fff" : "none",
                  transition: "all 0.15s",
                  color: "#fff",
                  flexShrink: 0,
                }}>
                {cmd ? cmd.icon : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={runSequence}
          disabled={status === "running" || sequence.length === 0}
          style={{ padding: "12px 28px", borderRadius: 24, background: status === "running" || sequence.length === 0 ? "#ffffff22" : "#27ae60", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: status === "running" || sequence.length === 0 ? "not-allowed" : "pointer", opacity: status === "running" || sequence.length === 0 ? 0.6 : 1 }}>
          ▶ Run
        </button>
        <button onClick={undoLast} disabled={status === "running"} style={{ padding: "12px 20px", borderRadius: 24, background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 15, border: "none", cursor: "pointer" }}>
          ⌫ Undo
        </button>
        <button onClick={clearAll} disabled={status === "running"} style={{ padding: "12px 20px", borderRadius: 24, background: "rgba(192,57,43,0.5)", color: "#fff", fontSize: 15, border: "none", cursor: "pointer" }}>
          ✕ Clear
        </button>
      </div>
    </div>
  );
}
