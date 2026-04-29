import { useState } from "react";
import RaceToFinish from "./RaceToFinish";
import CodeTheCourse from "./CodeTheCourse";

// ── Car SVGs imported from RaceToFinish.js ──────────────────────────────────
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

// Doc Hudson — 1951 Hudson Hornet (dark blue-grey classic racer)
function DocHudsonSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 90 55"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      <path d="M12,35 Q14,20 28,18 L62,18 Q74,20 76,35 L76,45 L12,45 Z" fill="#2c3e6e"/>
      <path d="M28,18 Q30,10 38,9 L52,9 Q60,10 62,18 Z" fill="#263360"/>
      <path d="M32,17 Q33,11 40,10 L50,10 Q56,11 58,17 Z" fill="#aee4f7" opacity="0.8"/>
      <rect x="35" y="21" width="8" height="7" rx="2" fill="white"/>
      <rect x="47" y="21" width="8" height="7" rx="2" fill="white"/>
      <rect x="36" y="22" width="5" height="5" rx="1" fill="#3a5fc0"/>
      <rect x="48" y="22" width="5" height="5" rx="1" fill="#3a5fc0"/>
      <circle cx="38" cy="24" r="1.5" fill="black"/>
      <circle cx="50" cy="24" r="1.5" fill="black"/>
      <circle cx="37" cy="23" r="0.7" fill="white"/>
      <circle cx="49" cy="23" r="0.7" fill="white"/>
      <text x="44" y="40" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#aee4f7" fontFamily="Arial">51</text>
      <rect x="12" y="34" width="6" height="8" rx="1" fill="#c0c0c0"/>
      <line x1="13" y1="36" x2="17" y2="36" stroke="#888" strokeWidth="1"/>
      <line x1="13" y1="38" x2="17" y2="38" stroke="#888" strokeWidth="1"/>
      <line x1="13" y1="40" x2="17" y2="40" stroke="#888" strokeWidth="1"/>
      <circle cx="25" cy="46" r="7" fill="#222"/><circle cx="25" cy="46" r="3.5" fill="#777"/>
      <circle cx="65" cy="46" r="7" fill="#222"/><circle cx="65" cy="46" r="3.5" fill="#777"/>
      <ellipse cx="9" cy="36" rx="3" ry="2.5" fill="#ffe066"/>
      <polygon points="76,30 80,26 80,35 76,35" fill="#253055"/>
    </svg>
  );
}

// Cruz Ramirez — modern yellow sports car (#78)
function CruzRamirezSVG({ dir = "right", size = 48 }) {
  const flipH = dir === "left";
  const rotate = dir === "up" ? -90 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 80 50"
      style={{ transform: `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`, transition: "transform 0.3s" }}>
      <path d="M10,32 Q12,22 24,20 L56,20 Q68,22 70,32 L70,42 L10,42 Z" fill="#f5c518"/>
      <path d="M24,20 Q26,13 36,12 L50,12 Q58,13 56,20 Z" fill="#e0b015"/>
      <path d="M28,19 Q29,13 37,12 L49,12 Q55,13 54,19 Z" fill="#aee4f7" opacity="0.85"/>
      <ellipse cx="34" cy="24" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="50" cy="24" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="35" cy="24.5" rx="3.5" ry="4" fill="#c0392b"/>
      <ellipse cx="51" cy="24.5" rx="3.5" ry="4" fill="#c0392b"/>
      <circle cx="36" cy="23.5" r="1.3" fill="black"/>
      <circle cx="52" cy="23.5" r="1.3" fill="black"/>
      <circle cx="35" cy="22.5" r="0.7" fill="white"/>
      <circle cx="51" cy="22.5" r="0.7" fill="white"/>
      <text x="40" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333" fontFamily="Arial">78</text>
      <circle cx="20" cy="43" r="7" fill="#222"/><circle cx="20" cy="43" r="3.5" fill="#888"/>
      <circle cx="60" cy="43" r="7" fill="#222"/><circle cx="60" cy="43" r="3.5" fill="#888"/>
      <ellipse cx="70" cy="30" rx="4" ry="2.5" fill="#ffe066"/>
      <line x1="15" y1="32" x2="65" y2="32" stroke="#e0b015" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

const CARS = [
  { id: "mcqueen",    label: "McQueen",     color: "#e8002d", unlockLevel: 0, svg: <CarSVG dir="right" size={72} /> },
  { id: "mater",      label: "Mater",       color: "#8B6914", unlockLevel: 0, svg: <MaterSVG dir="right" size={72} /> },
  { id: "the-king",   label: "The King",    color: "#87CEEB", unlockLevel: 2, svg: <TheKingSVG dir="right" size={72} /> },
  { id: "doc-hudson", label: "Doc Hudson",  color: "#2c3e6e", unlockLevel: 4, svg: <DocHudsonSVG dir="right" size={72} /> },
  { id: "cruz",       label: "Cruz",        color: "#f5c518", unlockLevel: 6, svg: <CruzRamirezSVG dir="right" size={72} /> },
];

export default function App() {
  const [screen, setScreen] = useState("menu"); // menu | race | code
  const [unlockedCars, setUnlockedCars] = useState(() => {
    try { return JSON.parse(localStorage.getItem('race-to-finish-unlocked-cars')) || ['mcqueen','mater']; }
    catch { return ['mcqueen','mater']; }
  });
  const [car, setCar] = useState(() => {
    try { return localStorage.getItem('race-to-finish-selected-car') || null; }
    catch { return null; }
  });
  const selectCar = (id) => {
    setCar(id);
    try { localStorage.setItem('race-to-finish-selected-car', id); } catch {}
  };

  if (screen === "race") {
    return <RaceToFinish car={car} onBack={() => {
      try { const u = JSON.parse(localStorage.getItem('race-to-finish-unlocked-cars')); if (u) setUnlockedCars(u); } catch {}
      setScreen("menu");
    }} />;
  }
  if (screen === "code") {
    return <CodeTheCourse car={car} onBack={() => setScreen("menu")} />;
  }

  const bg = "linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)";
  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 20,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const gameBtnStyle = (disabled) => ({
    padding: "14px 32px",
    borderRadius: 28,
    fontSize: 18,
    fontWeight: 700,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.2s",
    boxShadow: disabled ? "none" : "0 4px 16px rgba(0,0,0,0.3)",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "'Segoe UI',Arial,sans-serif",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#ffe066", textShadow: "0 2px 16px #ff8800" }}>
          🏁 Race to Finish
        </div>
        <div style={{ color: "#aee4f7", fontSize: "1rem", marginTop: 6 }}>
          Pick your car, then choose a game
        </div>
      </div>

      {/* Car picker */}
      <div style={{ ...cardStyle, marginBottom: 28, width: "100%", maxWidth: 440 }}>
        <div style={{ color: "#aee4f7", fontSize: "0.85rem", fontWeight: 600, marginBottom: 14, textAlign: "center" }}>
          CHOOSE YOUR CAR
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {CARS.map(c => {
            const selected = car === c.id;
            const isUnlocked = unlockedCars.includes(c.id);
            return (
              <div key={c.id} onClick={() => isUnlocked && selectCar(c.id)} style={{
                background: selected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                border: selected ? `3px solid ${c.color}` : "2px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: "12px 14px",
                cursor: isUnlocked ? "pointer" : "not-allowed",
                textAlign: "center",
                boxShadow: selected ? `0 0 18px ${c.color}66` : "none",
                transition: "all 0.2s",
                minWidth: 88,
                filter: isUnlocked ? "none" : "grayscale(1)",
                opacity: isUnlocked ? 1 : 0.55,
                position: "relative",
              }}>
                {c.svg}
                {!isUnlocked && (
                  <div style={{ position: "absolute", top: 6, right: 8, fontSize: "1rem" }}>🔒</div>
                )}
                <div style={{ color: selected ? "#ffe066" : "#aee4f7", fontSize: "0.75rem", marginTop: 6, fontWeight: selected ? 700 : 400 }}>
                  {c.label}
                </div>
                {!isUnlocked && (
                  <div style={{ color: "#ffffff55", fontSize: "0.62rem", marginTop: 2 }}>Level {c.unlockLevel}+</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game buttons */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => car && setScreen("race")}
          disabled={!car}
          style={{
            ...gameBtnStyle(!car),
            background: car ? "linear-gradient(135deg,#e8002d,#ff6b00)" : "rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          🏁 Race to Finish
        </button>
        <button
          onClick={() => car && setScreen("code")}
          disabled={!car}
          style={{
            ...gameBtnStyle(!car),
            background: car ? "linear-gradient(135deg,#2980b9,#8e44ad)" : "rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          💻 Code the Course
        </button>
      </div>

      {!car && (
        <div style={{ color: "#ffffff55", fontSize: "0.85rem", marginTop: 16 }}>
          <div style={{position:"fixed",bottom:8,right:12,color:"rgba(255,255,255,0.2)",fontSize:"0.65rem",fontFamily:"monospace",pointerEvents:"none",userSelect:"none"}}>v1.0</div>
      <div style={{position:"fixed",bottom:8,right:12,color:"rgba(255,255,255,0.2)",fontSize:"0.65rem",fontFamily:"monospace",pointerEvents:"none",userSelect:"none"}}>v1.0</div>
        ↑ Select a car to start
        </div>
      )}
    </div>
  );
}
