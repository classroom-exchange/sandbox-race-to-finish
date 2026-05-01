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
    <circle cx="22