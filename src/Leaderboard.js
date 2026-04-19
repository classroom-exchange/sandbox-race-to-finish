import React, { useState, useEffect } from 'react';
import { fetchTopScores } from './leaderboardApi';

export default function Leaderboard({ onBack }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [varIdx, setVarIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopScores({ levelIdx, varIdx })
      .then(data => { setScores(data || []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [levelIdx, varIdx]);

  const containerStyle = {
    background: '#1a1a2e', minHeight: '100vh', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
    padding: '32px 16px', color: 'white', fontFamily: 'Arial, sans-serif'
  };
  const headerStyle = { color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 24 };
  const selectStyle = {
    background: '#2a2a4e', color: 'white', border: '1px solid #FFD700',
    borderRadius: 6, padding: '4px 8px', margin: '0 8px', fontSize: 14
  };
  const tableStyle = { width: '100%', maxWidth: 460, borderCollapse: 'collapse', marginTop: 16 };
  const thStyle = { color: '#FFD700', padding: '8px 12px', borderBottom: '2px solid #FFD700', textAlign: 'left' };
  const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #333' };
  const backBtnStyle = {
    marginTop: 32, background: '#2a2a4e', color: 'white', border: 'none',
    borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>🏆 Leaderboard</div>
      <div style={{ marginBottom: 16 }}>
        <label>Level:
          <select style={selectStyle} value={levelIdx} onChange={e => setLevelIdx(Number(e.target.value))}>
            {[1,2,3].map((l,i) => <option key={i} value={i}>Level {l}</option>)}
          </select>
        </label>
        <label>Variation:
          <select style={selectStyle} value={varIdx} onChange={e => setVarIdx(Number(e.target.value))}>
            {[1,2,3,4].map((v,i) => <option key={i} value={i}>Var {v}</option>)}
          </select>
        </label>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#ff6b6b' }}>Error: {error}</div>}
      {!loading && !error && (
        scores.length === 0
          ? <div style={{ color: '#aaa', marginTop: 24 }}>No scores yet — be the first!</div>
          : <table style={tableStyle}>
              <thead><tr>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Player</th>
                <th style={thStyle}>Moves</th>
                <th style={thStyle}>Date</th>
              </tr></thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i} style={i === 0 ? { fontWeight: 'bold', color: '#FFD700' } : {}}>
                    <td style={tdStyle}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i+1}</td>
                    <td style={tdStyle}>{s.player_name}</td>
                    <td style={tdStyle}>{s.move_count}</td>
                    <td style={tdStyle}>{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      )}
      <button style={backBtnStyle} onClick={onBack}>← Back to Menu</button>
    </div>
  );
}
