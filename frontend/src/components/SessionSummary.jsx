import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useStream } from '../hooks/useStream';
import { ENDPOINTS } from '../api/negotiate';

function renderSummary(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    return <span key={i}>{line}{'\n'}</span>;
  });
}

export default function SessionSummary() {
  const navigate = useNavigate();
  const { scenario, style, transcript, reset } = useSession();
  const { isLoading, error, stream } = useStream();
  const [summaryText, setSummaryText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  if (!scenario || !style || !transcript || transcript.length === 0) return <Navigate to="/" />;

  useEffect(() => { // eslint-disable-line
    stream(
      ENDPOINTS.coachingSummary,
      { transcript, scenario, style },
      (chunk) => setSummaryText((prev) => prev + chunk),
      () => setIsDone(true),
      (err) => console.error('Summary error:', err)
    );
  }, []);

  function handleNewScenario() {
    reset();
    navigate('/');
  }

  const otherPartyLabel = { salary: 'Employer', rent: 'Landlord', freelance: 'Client' }[scenario.type];

  return (
    <div className="page">
      <div className="step-indicator">
        <span className="step done">1. Setup</span>
        <span className="step done">2. Strategy</span>
        <span className="step done">3. Practice</span>
        <span className="step active">4. Summary</span>
      </div>

      <div className="card">
        <h2>Session Coaching Report</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          {scenario.type} negotiation · Style: <span className={`style-badge ${style}`}>{style}</span>
          &nbsp;·&nbsp; {transcript.filter((t) => t.role === 'user').length} turns
        </p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <div className="summary-text">
          {isLoading && !summaryText && <span className="loading-dots">Generating your coaching report</span>}
          {renderSummary(summaryText)}
          {isLoading && summaryText && <span style={{ opacity: 0.5 }}>▌</span>}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Full Transcript</h2>
          <button className="btn btn-secondary" onClick={() => setShowTranscript((v) => !v)}>
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </button>
        </div>

        {showTranscript && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {transcript.map((turn, i) => (
              <div key={i}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>
                  {turn.role === 'user' ? 'You' : otherPartyLabel}
                </p>
                <div className={`message-bubble ${turn.role}`} style={{ maxWidth: '100%' }}>
                  {turn.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDone && (
        <button
          className="btn btn-primary"
          onClick={handleNewScenario}
          style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
        >
          + Start a New Scenario
        </button>
      )}
    </div>
  );
}
