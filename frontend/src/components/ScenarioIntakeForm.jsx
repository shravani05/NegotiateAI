import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: 'When you want something, you typically:',
    options: [
      { label: 'State it directly and confidently', style: 'assertive' },
      { label: 'Frame it as a mutual benefit', style: 'diplomatic' },
      { label: 'Explain the value it creates for both sides', style: 'collaborative' },
    ],
  },
  {
    id: 2,
    text: 'When someone pushes back on your request, you:',
    options: [
      { label: 'Hold your position and restate your case firmly', style: 'assertive' },
      { label: 'Acknowledge their concern and find middle ground', style: 'diplomatic' },
      { label: 'Explore what matters most to them and adjust', style: 'collaborative' },
    ],
  },
  {
    id: 3,
    text: 'Your ideal negotiation outcome is:',
    options: [
      { label: 'Getting exactly what you asked for', style: 'assertive' },
      { label: 'A fair deal that keeps the relationship positive', style: 'diplomatic' },
      { label: 'A creative solution that works well for everyone', style: 'collaborative' },
    ],
  },
  {
    id: 4,
    text: 'Before a negotiation, you prepare by:',
    options: [
      { label: 'Researching market data to back up your number', style: 'assertive' },
      { label: 'Thinking about how to phrase things tactfully', style: 'diplomatic' },
      { label: 'Understanding what the other party needs', style: 'collaborative' },
    ],
  },
  {
    id: 5,
    text: 'If the other party says "that\'s not possible," you:',
    options: [
      { label: 'Ask them to explain why and challenge the constraint', style: 'assertive' },
      { label: 'Suggest a compromise that moves toward your goal', style: 'diplomatic' },
      { label: 'Reframe the conversation around shared interests', style: 'collaborative' },
    ],
  },
];

const STYLE_DESCRIPTIONS = {
  assertive: 'Direct and confident — you lead with data and hold your position.',
  diplomatic: 'Warm and tactful — you build rapport while steering toward your goal.',
  collaborative: 'Value-focused — you seek win-win outcomes and long-term relationships.',
};

function computeStyle(answers) {
  const counts = { assertive: 0, diplomatic: 0, collaborative: 0 };
  Object.values(answers).forEach((s) => { if (s) counts[s]++; });
  const max = Math.max(...Object.values(counts));
  if (counts.collaborative === max) return 'collaborative';
  if (counts.diplomatic === max) return 'diplomatic';
  return 'assertive';
}

export default function ScenarioIntakeForm() {
  const navigate = useNavigate();
  const { setScenario, setStyle } = useSession();

  const [type, setType] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [context, setContext] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [computedStyle, setComputedStyle] = useState(null);

  const allQuizAnswered = QUIZ_QUESTIONS.every((q) => quizAnswers[q.id]);

  function validate() {
    const e = {};
    if (!type) e.type = 'Please select a negotiation type.';
    if (!currentOffer || isNaN(currentOffer) || Number(currentOffer) <= 0)
      e.currentOffer = 'Enter a valid positive number.';
    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0)
      e.targetAmount = 'Enter a valid positive number.';
    if (!allQuizAnswered) e.quiz = 'Please answer all quiz questions.';
    return e;
  }

  function handleQuizChange(questionId, style) {
    const updated = { ...quizAnswers, [questionId]: style };
    setQuizAnswers(updated);
    if (Object.keys(updated).length === QUIZ_QUESTIONS.length) {
      setComputedStyle(computeStyle(updated));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    const style = computeStyle(quizAnswers);
    setScenario({ type, currentOffer: Number(currentOffer), targetAmount: Number(targetAmount), context });
    setStyle(style);
    navigate('/strategy');
  }

  const typeLabels = { salary: 'Salary', rent: 'Rent', freelance: 'Freelance Rate' };
  const offerLabel = type === 'salary' ? 'Current offer ($)' : type === 'rent' ? 'Current rent ($)' : 'Current rate ($/hr or project)';
  const targetLabel = type === 'salary' ? 'Your target salary ($)' : type === 'rent' ? 'Your target rent ($)' : 'Your target rate';

  return (
    <div className="page">
      <div className="step-indicator">
        <span className="step active">1. Setup</span>
        <span className="step">2. Strategy</span>
        <span className="step">3. Practice</span>
        <span className="step">4. Summary</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2>Your Negotiation Situation</h2>

          <div className="form-group">
            <label>Negotiation type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select type...</option>
              <option value="salary">Salary</option>
              <option value="rent">Rent</option>
              <option value="freelance">Freelance Rate</option>
            </select>
            {errors.type && <p className="field-error">{errors.type}</p>}
          </div>

          {type && (
            <>
              <div className="form-group">
                <label>{offerLabel}</label>
                <input
                  type="number"
                  min="1"
                  value={currentOffer}
                  onChange={(e) => setCurrentOffer(e.target.value)}
                  placeholder="e.g. 65000"
                />
                {errors.currentOffer && <p className="field-error">{errors.currentOffer}</p>}
              </div>

              <div className="form-group">
                <label>{targetLabel}</label>
                <input
                  type="number"
                  min="1"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="e.g. 75000"
                />
                {errors.targetAmount && <p className="field-error">{errors.targetAmount}</p>}
              </div>

              <div className="form-group">
                <label>Context (optional)</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Any relevant details — your experience, market research, why you deserve this..."
                />
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h2>Your Negotiation Style Quiz</h2>
          <p style={{ marginBottom: 20, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Answer 5 quick questions so we can tailor your strategy and coaching.
          </p>

          {QUIZ_QUESTIONS.map((q) => (
            <div key={q.id} style={{ marginBottom: 20 }}>
              <h3>{q.id}. {q.text}</h3>
              {q.options.map((opt) => (
                <label key={opt.style} className={`quiz-option ${quizAnswers[q.id] === opt.style ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={opt.style}
                    checked={quizAnswers[q.id] === opt.style}
                    onChange={() => handleQuizChange(q.id, opt.style)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          ))}

          {computedStyle && (
            <div style={{ padding: '12px 16px', background: '#f0f7ff', borderRadius: 'var(--radius)', marginTop: 8 }}>
              <p style={{ fontSize: '0.9rem' }}>
                Your style: <span className={`style-badge ${computedStyle}`}>{computedStyle}</span>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>
                {STYLE_DESCRIPTIONS[computedStyle]}
              </p>
            </div>
          )}

          {errors.quiz && <p className="field-error" style={{ marginTop: 8 }}>{errors.quiz}</p>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          Generate My Negotiation Strategy →
        </button>
      </form>
    </div>
  );
}
