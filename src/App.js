import { useState, useEffect, useRef } from "react";

const WINS_NEEDED = 2;
const GRID = 5;

const LEVELS = [
  {
    label: "Level 1 🌟", hint: "Get to the flag!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [] },
      { start: [4,4], end: [0,0], obstacles: [] },
      { start: [4,2], end: [0,2], obstacles: [] },
      { start: [2,0], end: [2,4], obstacles: [] },
    ]
  },
  {
    label: "Level 2 🌟🌟", hint: "Watch out for cones!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [[2,2],[1,3]] },
      { start: [4,4], end: [0,0], obstacles: [[2,2],[1,1]] },
      { start: [4,0], end: [0,3], obstacles: [[3,1],[2,2]] },
      { start: [4,2], end: [0,2], obstacles: [[2,1],[2,3]] },
    ]
  },
  {
    label: "Level 3 🌟🌟🌟", hint: "Tricky road ahead!",
    variations: [
      { start: [4,1], end: [0,3], obstacles: [[3,2],[2,1],[2,3],[1,2]] },
      { start: [4,0], end: [0,4], obstacles: [[3,1],[2,2],[2,3],[1,3]] },
      { start: [4,3], end: [0,1], obstacles: [[3,2],[2,1],[2,3],[1,2]] },
      { start: [3,0], end: [0,4], obstacles: [[2,1],[2,2],[1,3],[1,2]] },
    ]
  },
];

const DIRS = [
  { label: "⬆️", dr: -1, dc: 0 },
  { label: "⬇️", dr: 1,  dc: 0 },
  { label: "⬅️", dr: 0, dc: -1 },
  { label: "➡️", dr: 0, dc: 1  },
];

// Lightning McQueen-style racer
function CarSVG({ dir = "right", size = 48 }) {
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

// Mater-style tow truck
function MaterSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 90 55"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      {/* Rusty body */}
      <rect x="8" y="28" width="62" height="16" rx="4" fill="#8B6914"/>
      <rect x="8" y="28" width="62" height="16" rx="4" fill="url(#rust)" opacity="0.4"/>
      {/* Cab */}
      <path d="M30,28 Q32,12 44,11 L60,11 Q70,13 68,28 Z" fill="#7a5c10"/>
      {/* Windshield */}
      <path d="M35,27 Q36,15 45,13 L58,13 Q65,15 64,27 Z" fill="#aee4f7" opacity="0.85"/>
      {/* Eyes */}
      <ellipse cx="44" cy="20" rx="5.5" ry="6" fill="white"/>
      <ellipse cx="57" cy="20" rx="5.5" ry="6" fill="white"/>
      <ellipse cx="45" cy="20.5" rx="3.5" ry="4" fill="#4a7c30"/>
      <ellipse cx="58" cy="20.5" rx="3.5" ry="4" fill="#4a7c30"/>
      <circle cx="46" cy="19.5" r="1.2" fill="black"/>
      <circle cx="59" cy="19.5" r="1.2" fill="black"/>
      <circle cx="44.5" cy="18.5" r="0.8" fill="white"/>
      <circle cx="57.5" cy="18.5" r="0.8" fill="white"/>
      {/* Buck teeth */}
      <rect x="47" y="27" width="5" height="4" rx="1" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <rect x="53" y="27" width="5" height="4" rx="1" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <line x1="52" y1="27" x2="52" y2="31" stroke="#ddd" strokeWidth="0.5"/>
      {/* Tow arm */}
      <line x1="8" y1="30" x2="2" y2="22" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <line x1="2" y1="22" x2="2" y2="28" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Hook */}
      <path d="M2,28 Q-2,28 -2,32 Q-2,36 2,36" stroke="#777" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Wheels */}
      <circle cx="22" cy="42" r="9" fill="#222"/><circle cx="22" cy="42" r="5" fill="#666"/><circle cx="22" cy="42" r="2" fill="#999"/>
      <circle cx="58" cy="42" r="9" fill="#222"/><circle cx="58" cy="42" r="5" fill="#666"/><circle cx="58" cy="42" r="2" fill="#999"/>
      {/* Headlight */}
      <ellipse cx="70" cy="33" rx="4" ry="3" fill="#ffe8a0"/>
      {/* Rust patches */}
      <ellipse cx="20" cy="33" rx="4" ry="2.5" fill="#6b4a0a" opacity="0.4"/>
      <ellipse cx="45" cy="36" rx="3" ry="2" fill="#6b4a0a" opacity="0.35"/>
      <defs>
        <pattern id="rust" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="2" cy="2" r="1.5" fill="#6b4a0a"/>
          <circle cx="6" cy="6" r="1" fill="#5a3a08"/>
        </pattern>
      </defs>
    </svg>
  );
}

function FlagSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <line x1="8" y1="4" x2="8" y2="32" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>
      {[0,1,2].map(row=>[0,1,2].map(col=>(
        <rect key={`${row}-${col}`} x={9+col*6} y={4+row*6} width="6" height="6" fill={(row+col)%2===0?"#222":"#fff"}/>
      )))}
    </svg>
  );
}

function ConeSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <polygon points="14,3 24,25 4,25" fill="#ff8800"/>
      <rect x="4" y="21" width="20" height="4" rx="2" fill="#fff"/>
      <rect x="8" y="13" width="12" height="3" fill="white" opacity="0.6"/>
    </svg>
  );
}


function btnStyle(bg, color, disabled=false) {
  return {
    background:disabled?"#333":bg, color:disabled?"#666":color,
    border:"none", borderRadius:"12px", padding:"10px 20px",
    fontSize:"1rem", fontWeight:"bold", cursor:disabled?"not-allowed":"pointer",
    transition:"all 0.15s", boxShadow:disabled?"none":"0 3px 10px #0006"
  };
}

// Car picker screen
function CarPicker({ onPick }) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <div style={{fontSize:"2rem",fontWeight:900,color:"#ffe066",textShadow:"0 2px 12px #ff8800",marginBottom:8,textAlign:"center"}}>🏁 Race to the Finish!</div>
      <div style={{color:"#aee4f7",fontSize:"1.1rem",marginBottom:32,textAlign:"center"}}>Pick your car to start!</div>
      <div style={{display:"flex",gap:32,flexWrap:"wrap",justifyContent:"center"}}>
        {/* McQueen */}
        <div onClick={()=>onPick("mcqueen")} style={{
          background:"linear-gradient(135deg,#1a1a3e,#0f3460)",
          border:"3px solid #e8002d", borderRadius:20, padding:"28px 32px",
          cursor:"pointer", textAlign:"center", transition:"transform 0.2s, box-shadow 0.2s",
          boxShadow:"0 4px 24px #e8002d55"
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <div style={{marginBottom:12}}>
            <CarSVG dir="right" size={80}/>
          </div>
          <div style={{color:"#ffe066",fontWeight:"bold",fontSize:"1.1rem"}}>⚡ McQueen</div>
          <div style={{color:"#aee4f7",fontSize:"0.85rem",marginTop:4}}>Fast race car!</div>
        </div>
        {/* Mater */}
        <div onClick={()=>onPick("mater")} style={{
          background:"linear-gradient(135deg,#1a1a3e,#0f3460)",
          border:"3px solid #8B6914", borderRadius:20, padding:"28px 32px",
          cursor:"pointer", textAlign:"center", transition:"transform 0.2s, box-shadow 0.2s",
          boxShadow:"0 4px 24px #8B691455"
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <div style={{marginBottom:12}}>
            <MaterSVG dir="right" size={80}/>
          </div>
          <div style={{color:"#ffe066",fontWeight:"bold",fontSize:"1.1rem"}}>🪝 Mater</div>
          <div style={{color:"#aee4f7",fontSize:"0.85rem",marginTop:4}}>Friendly tow truck!</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [varIdx, setVarIdx] = useState(0);
  const [moves, setMoves] = useState([]);
  const [carPos, setCarPos] = useState(null);
  const [carDir, setCarDir] = useState("right");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(null);
  const [animStep, setAnimStep] = useState(-1);
  const [trail, setTrail] = useState([]);
  const [winCounts, setWinCounts] = useState([0,0,0]);
  const [touchHint, setTouchHint] = useState(null);
  const runRef = useRef(false);

  const level = LEVELS[levelIdx];
  const variation = level?.variations[varIdx];

  // Compute planned end position after all queued moves
  function getPlannedPos() {
    if (!variation) return null;
    let pos = [...variation.start];
    for (const d of moves) {
      const next = [pos[0]+d.dr, pos[1]+d.dc];
      if (next[0]<0||next[0]>=GRID||next[1]<0||next[1]>=GRID) break;
      if (variation.obstacles.some(o=>o[0]===next[0]&&o[1]===next[1])) break;
      pos = next;
    }
    return pos;
  }

  useEffect(() => { if (variation) resetLevel(); }, [levelIdx, varIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetLevel() {
    setMoves([]); setCarPos(variation.start); setCarDir("right");
    setRunning(false); setStatus(null); setAnimStep(-1); setTrail([]);
    runRef.current = false;
  }

  function addMove(dir) {
    if (running || status || moves.length >= 12) return;
    setMoves(m => [...m, dir]);
  }

  function removeLastMove() {
    if (running || status) return;
    setMoves(m => m.slice(0,-1));
  }

  // Handle tapping a grid cell
  function handleCellTap(r, c) {
    if (running || status) return;
    const planned = getPlannedPos();
    if (!planned) return;
    const dr = r - planned[0];
    const dc = c - planned[1];
    // Only allow adjacent (one step) taps
    const dir = DIRS.find(d => d.dr===dr && d.dc===dc);
    if (dir) {
      addMove(dir);
    } else {
      // Flash hint that cell is not adjacent
      setTouchHint(`${r}-${c}`);
      setTimeout(() => setTouchHint(null), 400);
    }
  }

  async function runMoves() {
    if (running || moves.length===0 || status) return;
    setRunning(true); runRef.current = true;
    let pos = [...variation.start];
    setCarPos([...pos]); setTrail([]);

    for (let i=0; i<moves.length; i++) {
      if (!runRef.current) break;
      setAnimStep(i);
      const d = moves[i];
      const curPos = [...pos];
      const newPos = [curPos[0]+d.dr, curPos[1]+d.dc];
      let dir = "right";
      if (d.dr===-1) dir="up"; else if (d.dr===1) dir="down"; else if (d.dc===-1) dir="left";
      setCarDir(dir);
      await new Promise(r=>setTimeout(r,500));
      if (!runRef.current) break;
      if (newPos[0]<0||newPos[0]>=GRID||newPos[1]<0||newPos[1]>=GRID) {
        setStatus("crash"); setRunning(false); runRef.current=false; return;
      }
      if (variation.obstacles.some(o=>o[0]===newPos[0]&&o[1]===newPos[1])) {
        setCarPos(newPos); setStatus("crash"); setRunning(false); runRef.current=false; return;
      }
      setTrail(t=>[...t,[...curPos]]);
      pos=newPos; setCarPos([...pos]);
    }

    setAnimStep(-1);
    await new Promise(r=>setTimeout(r,300));
    if (!runRef.current) return;
    if (pos[0]===variation.end[0]&&pos[1]===variation.end[1]) {
      const newCount = Math.min(winCounts[levelIdx]+1, WINS_NEEDED);
      setWinCounts(w=>{ const n=[...w]; n[levelIdx]=newCount; return n; });
      setStatus("win");
    } else { setStatus("miss"); }
    setRunning(false);
  }

  function handleNextVariationOrLevel() {
    const mastered = winCounts[levelIdx] >= WINS_NEEDED;
    if (mastered && levelIdx < LEVELS.length-1) { setLevelIdx(l=>l+1); setVarIdx(0); }
    else if (mastered) { setWinCounts([0,0,0]); setLevelIdx(0); setVarIdx(0); }
    else { setVarIdx((varIdx+1) % level.variations.length); }
  }

  useEffect(() => {
    function onKey(e) {
      if (running||status) return;
      if (e.key==="ArrowUp")    { e.preventDefault(); addMove(DIRS[0]); }
      if (e.key==="ArrowDown")  { e.preventDefault(); addMove(DIRS[1]); }
      if (e.key==="ArrowLeft")  { e.preventDefault(); addMove(DIRS[2]); }
      if (e.key==="ArrowRight") { e.preventDefault(); addMove(DIRS[3]); }
      if (e.key==="Enter")      { runMoves(); }
      if (e.key==="Backspace")  { removeLastMove(); }
      if (e.key==="Delete"||e.key==="c"||e.key==="C") {
        setMoves([]); setCarPos(variation.start); setCarDir("right"); setTrail([]);
      }
    }
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [running, status, moves, levelIdx, varIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!selectedCar) return <CarPicker onPick={setSelectedCar}/>;

  const currentWins = winCounts[levelIdx];
  const mastered = currentWins >= WINS_NEEDED;
  const cellSize = 72;
  const plannedPos = getPlannedPos();
  const VehicleSVG = selectedCar === "mater" ? MaterSVG : CarSVG;

  // Build planned path for arrow overlay
  const plannedCells = [];
  let pPos = [...variation.start];
  for (let i=0; i<moves.length; i++) {
    const d = moves[i];
    const next = [pPos[0]+d.dr, pPos[1]+d.dc];
    if (next[0]<0||next[0]>=GRID||next[1]<0||next[1]>=GRID) break;
    plannedCells.push({ r:next[0], c:next[1], label:d.label, step:i, isActive:animStep===i });
    if (variation.obstacles.some(o=>o[0]===next[0]&&o[1]===next[1])) break;
    pPos = next;
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)",display:"flex",flexDirection:"column",alignItems:"center",padding:"16px",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      {/* Title */}
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:"2rem",fontWeight:900,color:"#ffe066",textShadow:"0 2px 12px #ff8800"}}>🏁 Race to the Finish! 🏁</div>
        <div style={{color:"#aee4f7",fontSize:"1rem",marginTop:2}}>
          {level.label} · {level.hint}
          <span style={{marginLeft:8,fontSize:"0.85rem",color:"#ffffff66"}}>Puzzle {varIdx+1}</span>
          <button onClick={()=>setSelectedCar(null)} style={{marginLeft:12,background:"none",border:"1px solid #ffffff44",borderRadius:8,color:"#aee4f7",fontSize:"0.75rem",padding:"2px 8px",cursor:"pointer"}}>🚗 Change Car</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{position:"relative",width:GRID*cellSize,height:GRID*cellSize,borderRadius:12,overflow:"hidden",boxShadow:"0 8px 32px #0008",border:"3px solid #ffe06644",marginBottom:14}}>
        {Array.from({length:GRID}).map((_,r)=>Array.from({length:GRID}).map((_,c)=>{
          const isEnd = r===variation.end[0]&&c===variation.end[1];
          const isObs = variation.obstacles.some(o=>o[0]===r&&o[1]===c);
          const isTrail = trail.some(t=>t[0]===r&&t[1]===c);
          const planned = !running && plannedCells.filter(p=>p.r===r&&p.c===c);
          const isActive = running && plannedCells.find(p=>p.r===r&&p.c===c&&p.isActive);
          const isPlannedEnd = !running && plannedPos && plannedPos[0]===r && plannedPos[1]===c && moves.length>0;
          const isAdjToPlanned = !running && !status && plannedPos &&
            Math.abs(r-plannedPos[0])+Math.abs(c-plannedPos[1])===1 && !isObs;
          const isTouchHint = touchHint===`${r}-${c}`;

          let bg = (r+c)%2===0?"#2d5a27":"#266022";
          if (isTrail) bg="#ffe06633";
          if (planned&&planned.length>0) bg="rgba(255,224,102,0.15)";
          if (isActive) bg="rgba(255,224,102,0.35)";
          if (isTouchHint) bg="rgba(255,80,80,0.35)";

          return (
            <div key={`${r}-${c}`}
              onClick={()=>handleCellTap(r,c)}
              style={{
                position:"absolute", left:c*cellSize, top:r*cellSize,
                width:cellSize, height:cellSize, background:bg,
                border: isActive ? "2px solid #ffe066"
                  : isPlannedEnd ? "2px solid #ffe06688"
                  : isAdjToPlanned ? "2px dashed #ffffff55"
                  : "1px solid #ffffff18",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor: isAdjToPlanned&&!running&&!status ? "pointer" : "default",
                transition:"background 0.2s, border 0.2s",
                userSelect:"none"
              }}>
              {isEnd && <FlagSVG/>}
              {isObs && <ConeSVG/>}
              {isTrail && <div style={{width:16,height:16,borderRadius:"50%",background:"#ffe066",opacity:0.5}}/>}
              {/* Adjacent tap hint arrows */}
              {isAdjToPlanned && !running && !status && planned.length===0 && !isEnd && (
                <div style={{fontSize:"1.1rem",opacity:0.25,pointerEvents:"none"}}>
                  {r<plannedPos[0]?"⬆️":r>plannedPos[0]?"⬇️":c<plannedPos[1]?"⬅️":"➡️"}
                </div>
              )}
              {/* Planned path arrows */}
              {!running && !isObs && planned&&planned.length>0 && (
                <div style={{position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",gap:1,pointerEvents:"none"}}>
                  {planned.map((p,i)=>(
                    <div key={i} style={{fontSize:planned.length>1?"0.85rem":"1.4rem",lineHeight:1,filter:"drop-shadow(0 1px 3px #0008)",opacity:0.9}}>{p.label}</div>
                  ))}
                  {planned.length===1&&(
                    <div style={{fontSize:"0.6rem",color:"#ffe066",fontWeight:"bold",marginTop:1,background:"#0008",borderRadius:4,padding:"1px 3px"}}>{planned[0].step+1}</div>
                  )}
                </div>
              )}
            </div>
          );
        }))}
        {/* Car */}
        {carPos && (
          <div style={{
            position:"absolute",
            left:carPos[1]*cellSize+(cellSize-48)/2,
            top:carPos[0]*cellSize+(cellSize-48)/2,
            transition:"left 0.45s cubic-bezier(.4,1.4,.6,1),top 0.45s cubic-bezier(.4,1.4,.6,1)",
            zIndex:10,
            filter:status==="crash"?"drop-shadow(0 0 8px red)":status==="win"?"drop-shadow(0 0 10px gold)":"none"
          }}>
            <VehicleSVG dir={carDir} size={48}/>
          </div>
        )}
      </div>

      {/* Touch hint label */}
      {!running && !status && moves.length<12 && (
        <div style={{color:"#ffffff55",fontSize:"0.8rem",marginBottom:6,marginTop:-8}}>
          👆 Tap a glowing cell or use the arrows below
        </div>
      )}

      {/* Status */}
      {status && (
        <div style={{
          background:status==="win"?"linear-gradient(135deg,#ffe066,#ff8800)":"linear-gradient(135deg,#ff4444,#cc0000)",
          borderRadius:16,padding:"16px 28px",textAlign:"center",marginBottom:12,
          boxShadow:"0 4px 24px #0008",animation:"pop 0.4s",maxWidth:380,width:"100%"
        }}>
          <div style={{fontSize:"2rem"}}>
            {status==="win"?mastered?"🏆 MASTERED! Amazing!":"⭐ Great job! New puzzle next!":status==="crash"?"💥 Uh oh! Hit something!":"🚗 Didn't reach the flag!"}
          </div>
          {status==="win"&&(
            <div style={{margin:"8px 0 4px",display:"flex",justifyContent:"center",gap:6,fontSize:"1.8rem"}}>
              {Array.from({length:WINS_NEEDED}).map((_,i)=>(
                <span key={i} style={{filter:i<currentWins?"none":"grayscale(1) opacity(0.3)"}}>⭐</span>
              ))}
            </div>
          )}
          <div style={{color:"#222",fontWeight:"bold",fontSize:"1rem",marginTop:4}}>
            {status==="win"?mastered?(levelIdx<LEVELS.length-1?"Ready for the next level?":"You beat all levels! 🎉"):`Win ${currentWins} of ${WINS_NEEDED} — a new puzzle is coming!`:"Try a different path!"}
          </div>
          <div style={{marginTop:10,display:"flex",gap:10,justifyContent:"center"}}>
            <button onClick={resetLevel} style={btnStyle("#1a1a2e","#ffe066")}>🔄 Try Again</button>
            {status==="win"&&<button onClick={handleNextVariationOrLevel} style={btnStyle("#1a1a2e","#ffe066")}>
              {mastered?(levelIdx<LEVELS.length-1?"Next Level ➡️":"Play Again 🔁"):"New Puzzle 🗺️"}
            </button>}
          </div>
        </div>
      )}

      {/* Code queue */}
      <div style={{width:"100%",maxWidth:380,marginBottom:12}}>
        <div style={{color:"#aee4f7",fontWeight:"bold",fontSize:"0.95rem",marginBottom:6,textAlign:"center"}}>
          📋 Your Code ({moves.length}/12) <span style={{fontWeight:"normal",fontSize:"0.8rem",color:"#ffffff66"}}>· Arrows / Enter / Backspace</span>
        </div>
        <div style={{minHeight:48,background:"#ffffff18",borderRadius:12,padding:"8px 10px",
          display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",border:"2px dashed #ffe06666"}}>
          {moves.length===0&&<span style={{color:"#ffffff44",fontSize:"0.9rem"}}>Tap the grid or click arrows to add moves...</span>}
          {moves.map((m,i)=>(
            <div key={i} style={{
              background:animStep===i?"#ffe066":"#0f3460",
              border:animStep===i?"2px solid #ff8800":"2px solid #aee4f7",
              borderRadius:8,padding:"4px 8px",fontSize:"1.2rem",
              transition:"background 0.2s",boxShadow:animStep===i?"0 0 8px #ffe066":"none"
            }}>{m.label}</div>
          ))}
        </div>
      </div>

      {/* GO button */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
        <button onClick={runMoves} disabled={running||!!status||moves.length===0}
          style={{...btnStyle("#ffe066","#1a1a2e",running||!!status||moves.length===0),
            fontSize:"1.2rem", padding:"18px 20px", borderRadius:16,
            minWidth:80, minHeight:80, lineHeight:1.2}}>
          {running?"🚗\nDriving...":"🚦\nGO!"}
        </button>
      </div>

      {/* Undo / Clear */}
      <div style={{display:"flex",gap:12,marginBottom:4}}>
        <button onClick={removeLastMove} disabled={running||!!status||moves.length===0} style={btnStyle("#444","#fff",running||!!status||moves.length===0)}>⬅ Undo</button>
        <button onClick={()=>{setMoves([]);setCarPos(variation.start);setCarDir("right");setTrail([]);}} disabled={running||!!status} style={btnStyle("#444","#fff",running||!!status)}>🗑️ Clear</button>
      </div>

      {/* Level selector */}
      <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap",justifyContent:"center"}}>
        {LEVELS.map((l,i)=>{
          const locked=i>0&&winCounts[i-1]<WINS_NEEDED;
          return (
            <button key={i} onClick={()=>{if(!locked){setLevelIdx(i);setVarIdx(0);}}} style={{
              ...btnStyle(i===levelIdx?"#ffe066":"#ffffff22",i===levelIdx?"#1a1a2e":"#fff",locked),
              fontSize:"0.8rem",padding:"6px 12px",opacity:locked?0.45:1
            }}>
              {locked?"🔒 ":""}{l.label}
              {winCounts[i]>0&&<span style={{marginLeft:4}}>{Array.from({length:winCounts[i]}).map(()=>"⭐").join("")}</span>}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes pop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        button:active:not(:disabled){transform:scale(0.93);}
      `}</style>
    </div>
  );
}
