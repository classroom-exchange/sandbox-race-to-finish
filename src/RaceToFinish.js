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

function RaceToFinish() {
  const [highScore, setHighScore] = useState(() => {
    const storedScore = localStorage.getItem('race-to-finish-high-score');
    return storedScore !== null ? parseInt(storedScore) : 0;
  });

  useEffect(() => {
    if (wins >= highScore) {
      localStorage.setItem('race-to-finish-high-score', wins);
      setHighScore(wins);
    }
  }, [wins]);

  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState([]);
  const [carPos, setCarPos] = useState([4, 0]);
  const [obstacles, setObstacles] = useState([]);
  const [directions, setDirections] = useState(DIRS);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    if (level < LEVELS.length) {
      const levelData = LEVELS[level];
      const variationIndex = Math.floor(Math.random() * levelData.variations.length);
      const { start, end, obstacles: ob } = levelData.variations[variationIndex];

      setGrid(Array.from({ length: GRID }, () => Array(GRID).fill(0)));
      setCarPos(start);
      setObstacles(ob);

      if (wins >= WINS_NEEDED) {
        alert("You've won the game!");
        setWins(wins + 1);
        setLevel(level + 1);
      }
    } else {
      alert('Congratulations! You have completed all levels.');
    }
  }, [level, wins]);

  const moveCar = (dir) => {
    if (!obstacles.includes(carPos)) {
      const newDirIndex = directions.findIndex(d => d.label === dir);
      const newDir = directions[newDirIndex];
      const newRow = carPos[0] + newDir.dr;
      const newCol = carPos[1] + newDir.dc;

      if (newRow >= 0 && newRow < GRID && newCol >= 0 && newCol < GRID) {
        setCarPos([newRow, newCol]);
      }
    }

    if (carPos.toString() === end.toString()) {
      alert('You reached the flag!');
      setWins(wins + 1);
    }
  };

  return (
    <>
      <h2>High Score: {highScore}</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      width: 50,
                      height: 50,
                      border: '1px solid #ccc',
                      backgroundColor: obstacles.includes([i, j]) ? '#fdd' : '',
                    }}
                  >
                    {car