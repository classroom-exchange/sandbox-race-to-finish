import { useState } from "react";
import RaceToFinish from "./RaceToFinish";
import CodeTheCourse from "./CodeTheCourse";

// ── Inline car SVGs for the menu ─────────────────────────────────────────────
function McQueenSVG() {
  return (
    <svg width={80} height={44} viewBox="0 0 80 44">
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

function KingSVG() {
  return (
    <svg width={80} height={44} viewBox="0 0 80 44">
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

function MaterSVG() {
  return (
    <svg width={80} height={50} viewBox="0 0 80 50">
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

const CARS = [
  { id: "mcqueen", label: "Lightning McQueen", color: "#e8002d", svg: <McQueenSVG /> },
  { id: "king",    label: "The King",           color: "#87CEEB", svg: <KingSVG /> },
  { id: "mater",   label: "Mater",              color: "#8B6914", svg: <MaterSVG /> },
];

export default function App() {
  const [screen, setScreen] = useState("menu"); // menu | race | code
  const [car, setCar] = useState(null);

  if (screen === "race") {
    return <RaceToFinish car={car} onBack={() => setScreen("menu")} />;
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
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {CARS.map(c => {
            const selected = car === c.id;
            return (
              <div key={c.id} onClick={() => setCar(c.id)} style={{
                background: selected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                border: selected ? `3px solid ${c.color}` : "2px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: "14px 16px",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: selected ? `0 0 18px ${c.color}66` : "none",
                transition: "all 0.2s",
                minWidth: 100,
              }}>
                {c.svg}
                <div style={{ color: selected ? "#ffe066" : "#aee4f7", fontSize: "0.75rem", marginTop: 6, fontWeight: selected ? 700 : 400 }}>
                  {c.label}
                </div>
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
          ↑ Select a car to start
        </div>
      )}
    </div>
  );
}
