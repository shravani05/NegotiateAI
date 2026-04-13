import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useStream } from '../hooks/useStream';
import { ENDPOINTS } from '../api/negotiate';

function renderStrategy(text) {
  // Convert ## headers to styled elements
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i}>{line.slice(3)}</h2>;
    }
    return <span key={i}>{line}{'\n'}</span>;
  });
}

export default function StrategyView() {
  const navigate = useNavigate();
  const { scenario, style, strategy, setStrategy } = useSession();
  const { isLoading, error, stream } = useStream();
  const [localText, setLocalText] = useState(strategy || '');
  const [isDone, setIsDone] = useState(!!strategy);

  if (!scenario || !style) return <Navigate to="/" />;

  function fetchStrategy() {
    setLocalText('');
    setIsDone(false);
    stream(
      ENDPOINTS.strategy,
      { scenario, style },
      (chunk) => setLocalText((prev) => prev + chunk),
      () => { setIsDone(true); },
      (err) => console.error('Strategy error:', err)
    );
  }

  useEffect(() => { if (!strategy) fetchStrategy(); }, []); // eslint-disable-line

  function handleRegenerate() {
    setStrategy('');
    fetchStrategy();
  }

  function handleStartPractice() {
    setStrategy(localText);
    navigate('/roleplay');
  }

  const typeLabel = { salary: 'Salary', rent: 'Rent', freelance: 'Freelance Rate' }[scenario.type];

  return (
    <div className="page">
      <div className="step-indicator">
        <span className="step done">1. Setup</span>
        <span className="step active">2. Strategy</span>
        <span className="step">3. Practice</span>
        <span className="step">4. Summary</span>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2>Your {typeLabel} Negotiation Strategy</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Style: <span className={`style-badge ${style}`}>{style}</span>
              &nbsp;·&nbsp; Target: <strong>{scenario.targetAmount}</strong> (from {scenario.currentOffer})
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleRegenerate}
            disabled={isLoading}
            style={{ whiteSpace: 'nowrap' }}
          >
            ↺ Regenerate
          </button>
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}

        <div className="streaming-text">
          {isLoading && !localText && <span className="loading-dots">Generating your strategy</span>}
          {renderStrategy(localText)}
          {isLoading && localText && <span style={{ opacity: 0.5 }}>▌</span>}
        </div>
      </div>

      {isDone && (
        <button
          className="btn btn-primary"
          onClick={handleStartPractice}
          style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
        >
          Start Roleplay Practice →
        </button>
      )}
    </div>
  );
}
