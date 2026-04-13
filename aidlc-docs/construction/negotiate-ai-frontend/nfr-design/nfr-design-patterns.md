# NFR Design Patterns — negotiate-ai-frontend

---

## Pattern 1: Append-Only String State (Performance)
Streaming text is accumulated as a single string, not an array of chunks:
```javascript
const [text, setText] = useState('');
// On each chunk:
setText(prev => prev + chunk);
```
This minimizes React re-renders — one state update per chunk, one DOM update.

## Pattern 2: Independent Concurrent Streams (Roleplay UX)
Other-party response and coaching feedback are fetched concurrently but update independent state slices. Neither waits for the other:
```javascript
// Both start immediately after user submits
fetchOtherPartyResponse(history);   // updates transcript
fetchCoachingFeedback(message);     // updates coaching[turnIndex]
```

## Pattern 3: Route Guards (Reliability)
Each route checks SessionContext before rendering. If prerequisites are missing, redirect to intake:
```javascript
// In StrategyView:
if (!scenario || !style) return <Navigate to="/" />;
```

## Pattern 4: Isolated API Layer (Maintainability)
All `fetch` calls live in `src/api/negotiate.js`. Components call API functions, not `fetch` directly. This makes the API base URL change a one-line edit.

## Pattern 5: useStream Hook (Maintainability)
The SSE read loop is extracted into a reusable `useStream` hook. All four streaming features use the same hook with different URLs and callbacks. No duplicated streaming logic across components.
