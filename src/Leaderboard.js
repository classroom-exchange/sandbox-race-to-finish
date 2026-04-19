import React, { useState, useEffect } from 'react';
import { fetchTopScores } from './leaderboardApi';

export default function Leaderboard({ level, variation, onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard(level, variation)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setScores(data || []);
        setLoading(false);
      });
  }, [level, variation]);

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const cardStyle = {
    background: '#fff', borderRadius: 12, padding: 24,
    maxWidth: 400, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  };
  const titleStyle = {
    textAlign: 'center', fontSize: 22, fontWeight: 'bold',
    marginBottom: 16, color: '#333',
  };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: 16 };
  const thStyle = {
    background: '#333', color: '#FFD700', padding: '8px 12px',
    textAlign: 'left', fontWeight: 'bold', fontSize: 13,
  };
  const closeBtnStyle = {
    display: 'block', margin: '0 auto', background: '#e74c3c',
    color: '#fff', border: 'none', borderRadius: 20,
    padding: '10px 28px', fontWeight: 'bold', fontSize: 15,
    cursor: 'pointer',
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>🏆 Leaderboard — Level {level}.{variation}</div>
        {loading && <div style={{ textAlign: 'center', padding: 20 }}>Loading...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>}
        {!loading && !error && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Moves</th>
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16, color: '#888' }}>No scores yet!</td></tr>
              )}
              {scores.map((s, i) => (
                <tr key={i} style={{
                  background: i % 2 === 0 ? '#f9f9f9' : '#fff',
                  borderLeft: i === 0 ? '4px solid #FFD700' : '4px solid transparent',
                }}>
                  <td style={{ padding: '7px 12px', fontWeight: i === 0 ? 'bold' : 'normal' }}>{i + 1}</td>
                  <td style={{ padding: '7px 12px' }}>{s.player_name}</td>
                  <td style={{ padding: '7px 12px' }}>{s.moves_used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button style={closeBtnStyle} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
