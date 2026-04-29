import { useState, useEffect, useRef } from "react";

const WINS_NEEDED = 2;
const GRID = 5;

const LEVELS = [
  {
    label: "Level 1 ⭐", hint: "Get to the flag!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [] },
      { start: [4,4], end: [0,0], obstacles: [] },
      { start: [4,2], end: [0,2], obstacles: [] },
      { start: [2,0], end: [2,4], obstacles: [] },
    ]
  },
  {
    label: "Level 2 ⭐⭐", hint: "Watch out for cones!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [[2,2],[1,3]] },
      { start: [4,4], end: [0,0], obstacles: [[2,2],[1,1]] },
      { start: [4,0], end: [0,3], obstacles: [[3,1],[2,2]] },
      { start: [4,2], end: [0,2], obstacles: [[2,1],[2,3]] },
    ]
  },
  {
    label: "Level 3 ⭐⭐⭐", hint: "Tricky road ahead!",
    variations: [
      { start: [4,1], end: [0,3], obstacles: [[3,2],[2,1],[2,3],[1,2]] },
      { start: [4,0], end: [0,4], obstacles: [[3,1],[2,2],[2,3],[1,3]] },
      { start: [4,3], end: [0,1], obstacles: [[3,2],[2,1],[2,3],[1,2]] },
      { start: [3,0], end: [0,4], obstacles: [[2,1],[2,2],[1,3],[1,2]] },
    ]
  },
  {
    label: "Level 4 ⭐⭐⭐⭐", hint: "Navigate around the traffic!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [[3,1],[2,2],[1,3],[3,3],[1,1]] },
      { start: [4,4], end: [0,0], obstacles: [[3,3],[2,2],[1,1],[3,1],[1,3]] },
      { start: [0,0], end: [4,4], obstacles: [[1,1],[2,2],[3,3],[0,3],[4,1]] },
      { start: [0,4], end: [4,0], obstacles: [[1,3],[2,2],[3,1],[0,1],[4,3]] },
    ]
  },
  {
    label: "Level 5 ⭐⭐⭐⭐⭐", hint: "Weave through the cones!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [[3,0],[2,1],[3,2],[1,3],[2,3],[1,1]] },
      { start: [4,4], end: [0,0], obstacles: [[3,4],[2,3],[3,2],[1,1],[2,1],[1,3]] },
      { start: [0,2], end: [4,2], obstacles: [[1,1],[1,3],[2,0],[2,4],[3,1],[3,3]] },
      { start: [4,2], end: [0,2], obstacles: [[3,1],[3,3],[2,0],[2,4],[1,1],[1,3]] },
    ]
  },
  {
    label: "Level 6 ⭐⭐⭐⭐⭐⭐", hint: "Champion's course — toughest yet!",
    variations: [
      { start: [4,0], end: [0,4], obstacles: [[3,1],[3,2],[2,1],[2,3],[1,2],[1,3],[0,2]] },
      { start: [4,4], end: [0,0], obstacles: [[3,3],[3,2],[2,3],[2,1],[1,2],[1,1],[0,2]] },
      { start: [0,0], end: [4,4], obstacles: [[1,0],[0,1],[2,1],[1,2],[2,3],[3,2],[4,3]] },
      { start: [0,4], end: [4,0], obstacles: [[1,4],[0,3],[2,3],[1,2],[2,1],[3,2],[4,1]] },
    ]
  },
];

const DIRS = [
  { label: "⬆️", dr: -1, dc: 0 },
  { label: "⬇️", dr: 1,  dc: 0 },
  { label: "⬅️", dr: 0, dc: -1 },
  { label: "➡️", dr: 0, dc: 1  },
];

const CHARACTERS = [
  { id: "mcqueen", name: "Lightning McQueen", color: "#E63946", description: "The rookie racer with a need for speed!", level: 1 },
  { id: "mater",   name: "Mater",             color: "#8B6914", description: "A lovable tow truck and McQueen's best friend!", level: 2 },
  { id: "sally",   name: "Sally Carrera",      color: "#6B8CFF", description: "A Porsche who keeps Radiator Springs running!", level: 3 },
  { id: "doc",     name: "Doc Hudson",         color: "#4A90D9", description: "The wise Fabulous Hudson Hornet himself!", level: 4 },
  { id: "chick",   name: "Chick Hicks",        color: "#3D7A4A", description: "The sneaky rival who always plays dirty to win!", level: 5 },
  { id: "cruz",    name: "Cruz Ramirez",       color: "#F4A261", description: "A young trainer with big racing dreams!", level: 6 },
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

// The King race car (1970 Plymouth Superbird)
function TheKingSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 70"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      {/* Rear wing struts */}
      <line x1="72" y1="25" x2="72" y2="6" stroke="#87CEEB" strokeWidth="2"/>
      <line x1="78" y1="25" x2="78" y2="6" stroke="#87CEEB" strokeWidth="2"/>
      {/* Rear wing blade */}
      <rect x="68" y="5" width="14" height="4" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
      {/* Main body - royal blue */}
      <path d="M 15,35 L 25,32 L 70,32 L 82,35 L 82,45 L 15,45 Z" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
      {/* Nose cone - long extended */}
      <polygon points="15,32 8,35 15,38" fill="#87CEEB" stroke="#5aaac4" strokeWidth="0.5"/>
      <polygon points="8,35 0,37 8,39" fill="#6BB8D4"/>
      {/* White roof section */}
      <path d="M 22,32 L 70,30 L 68,25 L 24,27 Z" fill="white" stroke="#e0e0e0" strokeWidth="0.5"/>
      {/* Windshield - large oval eyes */}
      <ellipse cx="32" cy="28" rx="7" ry="8" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <ellipse cx="32" cy="28" rx="5" ry="6" fill="#4a90e2"/>
      <circle cx="32" cy="28" r="2.5" fill="black"/>
      <circle cx="31" cy="26" r="1" fill="white"/>
      {/* Right eye */}
      <ellipse cx="56" cy="28" rx="7" ry="8" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <ellipse cx="56" cy="28" rx="5" ry="6" fill="#4a90e2"/>
      <circle cx="56" cy="28" r="2.5" fill="black"/>
      <circle cx="55" cy="26" r="1" fill="white"/>
      {/* Number 43 */}
      <text x="44" y="41" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial">43</text>
      {/* Front wheel */}
      <circle cx="28" cy="48" r="6" fill="#222"/>
      <circle cx="28" cy="48" r="3" fill="#666"/>
      {/* Rear wheel */}
      <circle cx="66" cy="48" r="6" fill="#222"/>
      <circle cx="66" cy="48" r="3" fill="#666"/>
      {/* Headlight */}
      <ellipse cx="12" cy="36" rx="2.5" ry="2" fill="#ffe066"/>
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
    transition:"all 0.15s", boxShadow:disabled?"none":"0 0 0 4px #FFD700, 0 3px 10px #0006"
  };
}


function UnlockModal({ char, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:`linear-gradient(135deg,${char.color}22,#1a1a2e)`,border:`3px solid ${char.color}`,borderRadius:24,padding:"32px 24px",textAlign:"center",maxWidth:320,width:"100%",boxShadow:`0 8px 40px ${char.color}88`,animation:"pop 0.4s"}}>
        <div style={{fontSize:"3rem",marginBottom:8}}>&#x1F3CE;&#xFE0F;</div>
        <div style={{fontSize:"0.85rem",color:"#aee4f7",letterSpacing:2,marginBottom:6,fontWeight:"bold"}}>NEW CHARACTER UNLOCKED!</div>
        <div style={{fontSize:"1.6rem",fontWeight:900,color:char.color,marginBottom:12,textShadow:`0 2px 12px ${char.color}`}}>{char.name}</div>
        <div style={{width:48,height:48,borderRadius:"50%",background:char.color,margin:"0 auto 14px",boxShadow:`0 0 20px ${char.color}88`}}/>
        <div style={{color:"#e0e0e0",fontSize:"1rem",marginBottom:20,lineHeight:1.5}}>{char.description}</div>
        <button onClick={onClose} style={{background:char.color,color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontSize:"1rem",fontWeight:"bold",cursor:"pointer",boxShadow:`0 4px 16px ${char.color}66`}}>Awesome! &#x1F389;</button>
      </div>
    </div>
  );
}

function CollectionModal({ chars, unlocked, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto"}}>
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",border:"2px solid #ffe06644",borderRadius:24,padding:24,maxWidth:380,width:"100%",boxShadow:"0 8px 40px #0008"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:"1.4rem",fontWeight:900,color:"#ffe066"}}>&#x1F3C6; My Collection</div>
          <div style={{color:"#ffffff66",fontSize:"0.85rem"}}>{unlocked.length}/{chars.length} characters found</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {chars.map(c=>{
            const isUnlocked=unlocked.includes(c.id);
            return (
              <div key={c.id} style={{background:isUnlocked?`${c.color}22`:"#ffffff08",border:isUnlocked?`2px solid ${c.color}55`:"2px solid #ffffff18",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,opacity:isUnlocked?1:0.55}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:isUnlocked?c.color:"#444",flexShrink:0,boxShadow:isUnlocked?`0 0 12px ${c.color}88`:"none"}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"bold",color:isUnlocked?c.color:"#555",fontSize:"0.9rem"}}>{isUnlocked?c.name:`&#x1F512; Win Level ${c.level} to unlock`}</div>
                  {isUnlocked&&<div style={{color:"#aaa",fontSize:"0.78rem",marginTop:2,lineHeight:1.3}}>{c.description}</div>}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} style={{display:"block",width:"100%",background:"#ffe066",color:"#1a1a2e",border:"none",borderRadius:12,padding:"12px",fontSize:"1rem",fontWeight:"bold",cursor:"pointer"}}>Close</button>
      </div>
    </div>
  );
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
        {/* The King */}
        <div onClick={()=>onPick("the-king")} style={{
          background:"linear-gradient(135deg,#1a1a3e,#0f3460)",
          border:"3px solid #FFD700", borderRadius:20, padding:"28px 32px",
          cursor:"pointer", textAlign:"center", transition:"transform 0.2s, box-shadow 0.2s",
          boxShadow:"0 4px 24px #FFD70055"
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <div style={{marginBottom:12}}>
            <TheKingSVG dir="right" size={80}/>
          </div>
          <div style={{color:"#ffe066",fontWeight:"bold",fontSize:"1.1rem"}}>👑 The King</div>
          <div style={{color:"#aee4f7",fontSize:"0.85rem",marginTop:4}}>Golden racer!</div>
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

export default function RaceToFinish({ car: initialCar, onBack }) {
  const [selectedCar, setSelectedCar] = useState(initialCar || null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [varIdx, setVarIdx] = useState(0);
  const [moves, setMoves] = useState([]);
  const initialVariation = LEVELS[0].variations[0];
  const [carPos, setCarPos] = useState(initialCar ? initialVariation.start : null);
  const [carDir, setCarDir] = useState("right");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(null);
  const [animStep, setAnimStep] = useState(-1);
  const [trail, setTrail] = useState([]);
  const [winCounts, setWinCounts] = useState([0,0,0,0,0,0]);
  const [touchHint, setTouchHint] = useState(null);
  const [unlockedChars, setUnlockedChars] = useState(() => {
    try { return JSON.parse(localStorage.getItem("race-to-finish-collectibles") || "[]"); } catch { return []; }
  });
  const [showUnlock, setShowUnlock] = useState(null);
  const [showCollection, setShowCollection] = useState(false);
  const [showGoPopup, setShowGoPopup] = useState(false);
  const runRef = useRef(false);

  useEffect(() => {
    if (variation) {
      setCarPos(variation.start);
      setCarDir('right');
      setMoves([]);
      setStatus(null);
      setTrail([]);
      setAnimStep(-1);
    }
  }, [levelIdx, varIdx]);

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

  const controlsRef = useRef(null);

  useEffect(() => { if (variation) resetLevel(); }, [levelIdx, varIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Unlock collectible when a new level is won for the first time
  useEffect(() => {
    if (status === "win") {
      const levelNum = levelIdx + 1;
      const char = CHARACTERS.find(c => c.level === levelNum);
      if (char && !unlockedChars.includes(char.id)) {
        const newUnlocked = [...unlockedChars, char.id];
        setUnlockedChars(newUnlocked);
        try { localStorage.setItem("race-to-finish-collectibles", JSON.stringify(newUnlocked)); } catch(e) {}
        setTimeout(() => setShowUnlock(char), 700);
      }
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetLevel() {
    setMoves([]); setCarPos(variation.start); setCarDir("right");
    setRunning(false); setStatus(null); setAnimStep(-1); setTrail([]);
    runRef.current = false;
  }

  function addMove(dir) {
    if (running || status || moves.length >= 12) return;
    const newMoves = [...moves, dir];
    setMoves(newMoves);
    // Auto-run: simulate path — if final position reaches the flag, start automatically
    if (variation) {
      let pos = [...variation.start];
      let reachedEnd = false;
      for (const d of newMoves) {
        const next = [pos[0]+d.dr, pos[1]+d.dc];
        if (next[0]<0||next[0]>=GRID||next[1]<0||next[1]>=GRID) break;
        if (variation.obstacles.some(o=>o[0]===next[0]&&o[1]===next[1])) break;
        pos = next;
        if (pos[0]===variation.end[0] && pos[1]===variation.end[1]) { reachedEnd = true; break; }
      }
      if (reachedEnd) {
        setTimeout(() => runMoves(newMoves), 80);
      }
    }
  }

  function removeLastMove() {
    if (running || status) return;
    setMoves(m => m.slice(0,-1));
  }

  // Handle tapping a grid cell
  function handleCellTap(r, c) {
    if (running || status) return;
    if (variation.obstacles.some(o=>o[0]===r&&o[1]===c)) return;
    const planned = getPlannedPos();
    if (!planned) return;
    const dr = r - planned[0];
    const dc = c - planned[1];
    const dir = DIRS.find(d => d.dr===dr && d.dc===dc);
    if (dir) {
      addMove(dir);
    } else {
      setTouchHint(`${r}-${c}`);
      setTimeout(() => setTouchHint(null), 400);
    }
  }

  async function runMoves(movesArg) {
    const movesToRun = movesArg !== undefined ? movesArg : moves;
    if (running || movesToRun.length===0) return;
    setRunning(true); setShowGoPopup(true); runRef.current = true;
    let pos = [...variation.start];
    setCarPos([...pos]); setTrail([]);

    for (let i=0; i<movesToRun.length; i++) {
      if (!runRef.current) break;
      setAnimStep(i);
      const d = movesToRun[i];
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
    else if (mastered) { setWinCounts([0,0,0,0,0,0]); setLevelIdx(0); setVarIdx(0); }
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

  useEffect(() => {
    const el = controlsRef.current;
    if (!el) return;
    const prevent = (e) => e.preventDefault();
    el.addEventListener('touchstart', prevent, { passive: false });
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      el.removeEventListener('touchstart', prevent);
      el.removeEventListener('touchmove', prevent);
    };
  }, []);

  // Auto-start: when the drawn path reaches the flag, car starts automatically.
  // Replaces the removed GO button.
  useEffect(() => {
    if (!running && !status && moves.length > 0 && plannedPos &&
        plannedPos[0] === variation.end[0] && plannedPos[1] === variation.end[1]) {
      runMoves();
    }
  }, [plannedPos, moves, running, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-dismiss GO! popup after 1 second
  useEffect(() => {
    if (!showGoPopup) return;
    const timer = setTimeout(() => setShowGoPopup(false), 1000);
    return () => clearTimeout(timer);
  }, [showGoPopup]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!selectedCar) return <CarPicker onPick={setSelectedCar}/>;

  const currentWins = winCounts[levelIdx];
  const mastered = currentWins >= WINS_NEEDED;
  const cellSize = 72;
  const plannedPos = getPlannedPos();
  const VehicleSVG = selectedCar === "mater" ? MaterSVG : selectedCar === "the-king" ? TheKingSVG : CarSVG;

  // Build planned path for arrow overlay
  const plannedCells = [];
  if (!variation || !carPos) {
    // no-op
  } else {
    let pPos = [...variation.start];
    for (let i=0; i<moves.length; i++) {
      const d = moves[i];
      const next = [pPos[0]+d.dr, pPos[1]+d.dc];
      if (next[0]<0||next[0]>=GRID||next[1]<0||next[1]>=GRID) break;
      plannedCells.push({ r:next[0], c:next[1], label:d.label, step:i, isActive:animStep===i });
      if (variation.obstacles.some(o=>o[0]===next[0]&&o[1]===next[1])) break;
      pPos = next;
    }
  }

  return (
    <div style={{position:"relative",minHeight:"100vh",background:"linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)",display:"flex",flexDirection:"column",alignItems:"center",padding:"16px",fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      {showGoPopup && (
        <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,pointerEvents:"none"}}>
          <style>{"@keyframes goPopIn{0%{transform:scale(0.5);opacity:0.7}70%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}"}</style>
          <span style={{fontSize:"5rem",fontWeight:"bold",color:"#FFD700",animation:"goPopIn 0.3s ease-out forwards",textShadow:"0 4px 20px rgba(255,215,0,0.6)"}}>GO!</span>
        </div>
      )}
      {showUnlock && <UnlockModal char={showUnlock} onClose={()=>setShowUnlock(null)}/>}
      {showCollection && <CollectionModal chars={CHARACTERS} unlocked={unlockedChars} onClose={()=>setShowCollection(false)}/>}

      <button onClick={onBack} style={{position:"absolute",top:12,left:12,padding:"6px 14px",borderRadius:20,background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,zIndex:10}}>&#x2190; Menu</button>
      <button onClick={()=>setShowCollection(true)} style={{position:"absolute",top:12,right:12,padding:"6px 14px",borderRadius:20,background:"rgba(255,224,102,0.18)",color:"#ffe066",border:"1px solid #ffe06655",cursor:"pointer",fontSize:13,zIndex:10}}>&#x1F3C6; {unlockedChars.length}/{CHARACTERS.length}</button>

      {/* Title */}
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:"2rem",fontWeight:900,color:"#ffe066",textShadow:"0 2px 12px #ff8800"}}>&#x1F3C1; Race to the Finish! &#x1F3C1;</div>
        <div style={{color:"#aee4f7",fontSize:"1rem",marginTop:2}}>
          {level.label} &middot; {level.hint}
          <span style={{marginLeft:8,fontSize:"0.85rem",color:"#ffffff66"}}>Puzzle {varIdx+1}</span>
          <button onClick={()=>setSelectedCar(null)} style={{marginLeft:12,background:"none",border:"1px solid #ffffff44",borderRadius:8,color:"#aee4f7",fontSize:"0.75rem",padding:"2px 8px",cursor:"pointer"}}>&#x1F697; Change Car</button>
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
              {isAdjToPlanned && !running && !status && planned.length===0 && !isEnd && (
                <div style={{fontSize:"1.1rem",opacity:0.25,pointerEvents:"none"}}>
                  {r<plannedPos[0]?"⬆️":r>plannedPos[0]?"⬇️":c<plannedPos[1]?"⬅️":"➡️"}
                </div>
              )}
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
          &#x1F446; Tap a glowing cell or use the arrows below
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
            {status==="win"?mastered?"&#x1F3C6; MASTERED! Amazing!":"&#x2B50; Great job! New puzzle next!":status==="crash"?"&#x1F4A5; Uh oh! Hit something!":"&#x1F697; Didn't reach the flag!"}
          </div>
          {status==="win"&&(
            <div style={{margin:"8px 0 4px",display:"flex",justifyContent:"center",gap:6,fontSize:"1.8rem"}}>
              {Array.from({length:WINS_NEEDED}).map((_,i)=>(
                <span key={i} style={{filter:i<currentWins?"none":"grayscale(1) opacity(0.3)"}}>&#x2B50;</span>
              ))}
            </div>
          )}
          <div style={{color:"#222",fontWeight:"bold",fontSize:"1rem",marginTop:4}}>
            {status==="win"?mastered?(levelIdx<LEVELS.length-1?"Ready for the next level?":"You beat all levels! &#x1F389;"):`Win ${currentWins} of ${WINS_NEEDED} — a new puzzle is coming!`:"Try a different path!"}
          </div>
          <div style={{marginTop:10,display:"flex",gap:10,justifyContent:"center"}}>
            <button onClick={resetLevel} style={btnStyle("#1a1a2e","#ffe066")}>&#x1F504; Try Again</button>
            {status==="win"&&<button onClick={handleNextVariationOrLevel} style={btnStyle("#1a1a2e","#ffe066")}>
              {mastered?(levelIdx<LEVELS.length-1?"Next Level ➡️":"Play Again &#x1F501;"):"New Puzzle &#x1F5FA;️"}
            </button>}
          </div>
        </div>
      )}

      {/* Code queue */}
      <div style={{width:"100%",maxWidth:380,marginBottom:12}}>
        <div style={{color:"#aee4f7",fontWeight:"bold",fontSize:"0.95rem",marginBottom:6,textAlign:"center"}}>
          &#x1F4CB; Your Code ({moves.length}/12) <span style={{fontWeight:"normal",fontSize:"0.8rem",color:"#ffffff66"}}>&middot; Arrows / Enter / Backspace</span>
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
      

      {/* Undo / Clear */}
      <div style={{display:"flex",gap:12,marginBottom:4}}>
        <button onClick={removeLastMove} disabled={running||!!status||moves.length===0} style={btnStyle("#444","#fff",running||!!status||moves.length===0)}>&#x2B05; Undo</button>
        <button onClick={()=>{setMoves([]);setCarPos(variation.start);setCarDir("right");setTrail([]);}} disabled={running||!!status} style={btnStyle("#444","#fff",running||!!status)}>&#x1F5D1;️ Clear</button>
      </div>

      {/* Level selector */}
      <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap",justifyContent:"center"}}>
        {LEVELS.map((l,i)=>{
          const locked=i>0&&winCounts[i-1]<WINS_NEEDED;
          const char=CHARACTERS.find(c=>c.level===i+1);
          return (
            <button key={i} onClick={()=>{if(!locked){setLevelIdx(i);setVarIdx(0);}}} style={{
              ...btnStyle(i===levelIdx?"#ffe066":"#ffffff22",i===levelIdx?"#1a1a2e":"#fff",locked),
              fontSize:"0.8rem",padding:"6px 12px",opacity:locked?0.45:1
            }}>
              {locked?"&#x1F512; ":""}{l.label}
              {winCounts[i]>0&&<span style={{marginLeft:4}}>{Array.from({length:winCounts[i]}).map(()=>"&#x2B50;").join("")}</span>}
              {char&&unlockedChars.includes(char.id)&&<span style={{marginLeft:3,width:8,height:8,borderRadius:"50%",background:char.color,display:"inline-block"}}/>}
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
