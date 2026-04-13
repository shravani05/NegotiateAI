# Logical Components — negotiate-ai-frontend

---

## Component: SessionContext (src/context/SessionContext.jsx)
- React Context + useReducer
- Actions: SET_SCENARIO, SET_STYLE, SET_STRATEGY, APPEND_TURN, RESET
- Provided at App root — available to all screens

## Component: useStream (src/hooks/useStream.js)
- Custom hook: `useStream(url, body, { onChunk, onDone, onError })`
- Manages fetch lifecycle, ReadableStream reading, SSE parsing
- Returns `{ isLoading, error, start }` — `start()` triggers the fetch
- Handles cleanup on unmount (aborts fetch if component unmounts mid-stream)

## Component: API Module (src/api/negotiate.js)
- Exports: `streamStrategy(body)`, `streamRoleplayTurn(body)`, `streamCoachingTurn(body)`, `streamCoachingSummary(body)`
- Each returns a configured fetch call (URL from `process.env.REACT_APP_API_URL`)
- No business logic — pure HTTP wrappers

## Component: App Router (src/App.jsx)
- Wraps app in `<SessionProvider>`
- Defines routes: `/` → ScenarioIntakeForm, `/strategy` → StrategyView, `/roleplay` → RoleplayChat, `/summary` → SessionSummary

## Visual Design Tokens (src/styles/index.css)
```css
--color-user-bg: #e8f4fd;        /* user message bubble */
--color-assistant-bg: #f5f5f5;   /* AI other-party bubble */
--color-coaching-bg: #fff8e1;    /* coaching feedback */
--color-coaching-border: #ffc107;
--color-primary: #1976d2;
--color-error: #d32f2f;
```
