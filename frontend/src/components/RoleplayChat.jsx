import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useStream } from '../hooks/useStream';
import { ENDPOINTS } from '../api/negotiate';

const PERSONA_LABEL = { salary: 'Employer', rent: 'Landlord', freelance: 'Client' };

export default function RoleplayChat() {
  const navigate = useNavigate();
  const { scenario, style, strategy, setTranscript: saveTranscript } = useSession();

  const [turns, setTurns] = useState([]); // { role, content }
  const [coaching, setCoaching] = useState({}); // turnIndex -> string
  const [inputValue, setInputValue] = useState('');
  const [otherPartyBuffer, setOtherPartyBuffer] = useState('');
  const [isOtherPartyLoading, setIsOtherPartyLoading] = useState(false);
  const [coachingLoading, setCoachingLoading] = useState({});

  const chatStream = useStream();
  const coachStream = useStream();
  const bottomRef = useRef(null);

  if (!scenario || !style || !strategy) return <Navigate to="/" />;

  const otherPartyLabel = PERSONA_LABEL[scenario.type];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, coaching, otherPartyBuffer]);

  async function handleSubmit(e) {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message || isOtherPartyLoading) return;

    const userTurnIndex = turns.length;
    const updatedTurns = [...turns, { role: 'user', content: message }];
    setTurns(updatedTurns);
    setInputValue('');
    setIsOtherPartyLoading(true);
    setOtherPartyBuffer('');

    // Fetch other-party response
    let assistantText = '';
    chatStream.stream(
      ENDPOINTS.roleplayTurn,
      { scenario, style, history: turns, message },
      (chunk) => {
        assistantText += chunk;
        setOtherPartyBuffer(assistantText);
      },
      () => {
        setTurns((prev) => [...prev, { role: 'assistant', content: assistantText }]);
        setOtherPartyBuffer('');
        setIsOtherPartyLoading(false);
      },
      (err) => {
        setTurns((prev) => [...prev, { role: 'assistant', content: `[Error: ${err}]` }]);
        setOtherPartyBuffer('');
        setIsOtherPartyLoading(false);
      }
    );

    // Fetch coaching feedback concurrently
    setCoachingLoading((prev) => ({ ...prev, [userTurnIndex]: true }));
    let coachText = '';
    coachStream.stream(
      ENDPOINTS.coachingTurn,
      { message, history: turns, scenario, style },
      (chunk) => { coachText += chunk; setCoaching((prev) => ({ ...prev, [userTurnIndex]: coachText })); },
      () => { setCoachingLoading((prev) => ({ ...prev, [userTurnIndex]: false })); },
      (err) => {
        setCoaching((prev) => ({ ...prev, [userTurnIndex]: `[Coaching error: ${err}]` }));
        setCoachingLoading((prev) => ({ ...prev, [userTurnIndex]: false }));
      }
    );
  }

  function handleEndSession() {
    const fullTranscript = [...turns];
    saveTranscript(fullTranscript);
    navigate('/summary');
  }

  const canEnd = turns.filter((t) => t.role === 'user').length >= 1;

  return (
    <div className="page">
      <div className="step-indicator">
        <span className="step done">1. Setup</span>
        <span className="step done">2. Strategy</span>
        <span className="step active">3. Practice</span>
        <span className="step">4. Summary</span>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>Live Roleplay — vs. {otherPartyLabel}</h2>
          {canEnd && (
            <button className="btn btn-danger" onClick={handleEndSession}>
              End Session
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Practice your negotiation. The {otherPartyLabel} will push back realistically.
          Coaching feedback appears below each of your messages.
        </p>

        <div className="chat-container">
          {turns.map((turn, i) => (
            <div key={i} className="chat-turn">
              {turn.role === 'user' ? (
                <>
                  <p className="message-label user">You</p>
                  <div className="message-bubble user">{turn.content}</div>
                  {/* Coaching feedback for this user turn */}
                  {(coaching[i] || coachingLoading[i]) && (
                    <div className="coaching-block">
                      <p className="coaching-label">🎯 Coach Feedback</p>
                      {coachingLoading[i] && !coaching[i]
                        ? <span className="loading-dots">Analyzing</span>
                        : <span style={{ whiteSpace: 'pre-wrap' }}>{coaching[i]}</span>
                      }
                      {coachingLoading[i] && coaching[i] && <span style={{ opacity: 0.5 }}>▌</span>}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="message-label">{otherPartyLabel}</p>
                  <div className="message-bubble assistant">{turn.content}</div>
                </>
              )}
            </div>
          ))}

          {/* Streaming other-party response */}
          {isOtherPartyLoading && (
            <div className="chat-turn">
              <p className="message-label">{otherPartyLabel}</p>
              <div className="message-bubble assistant">
                {otherPartyBuffer || <span className="loading-dots">Thinking</span>}
                {otherPartyBuffer && <span style={{ opacity: 0.5 }}>▌</span>}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <hr className="section-divider" />

        <form onSubmit={handleSubmit} className="chat-input-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isOtherPartyLoading}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isOtherPartyLoading || !inputValue.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
