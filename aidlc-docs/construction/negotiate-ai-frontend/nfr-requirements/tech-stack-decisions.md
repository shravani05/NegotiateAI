# Tech Stack Decisions — negotiate-ai-frontend

---

## Framework
- **React 18** — hooks, context, concurrent features for smooth streaming updates

## Routing
- **React Router v6** — declarative routing for the 4-screen linear flow

## Streaming
- **Fetch API + ReadableStream** — native browser API, no extra library needed for SSE client
- Custom `useStream` hook encapsulates the streaming read loop

## Styling
- **Plain CSS** — no UI library dependency; keeps bundle small and styling transparent
- Single `src/styles/index.css` with CSS custom properties for colors

## Build Tool
- **Create React App** (or Vite) — standard React SPA setup
- `REACT_APP_API_URL` env var for backend URL

## Dependencies Summary
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  }
}
```
No additional runtime dependencies needed.
