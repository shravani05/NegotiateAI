# NFR Requirements — negotiate-ai-frontend

---

## Performance
- NFR-P1: Streaming text must render progressively — no full-response buffering in the UI
- NFR-P2: UI must remain interactive during streaming (input fields, buttons not frozen)
- NFR-P3: React re-renders during streaming must be efficient — append to string state, not array of chunks

## Usability
- NFR-U1: Clear visual distinction between three message types: user message (right-aligned), AI other-party message (left-aligned), coaching feedback (indented, different background)
- NFR-U2: Loading spinners shown for all pending AI responses
- NFR-U3: Error messages shown inline — no alert() dialogs
- NFR-U4: App is usable on a standard laptop screen (1280px+); mobile not required

## Maintainability
- NFR-M1: API base URL configurable via `REACT_APP_API_URL` env var
- NFR-M2: All API call functions isolated in `src/api/negotiate.js`
- NFR-M3: Streaming logic isolated in `src/hooks/useStream.js`

## Reliability
- NFR-R1: If backend is unreachable, show a clear "Could not connect to server" message
- NFR-R2: If a stream errors mid-way, show partial content + error notice — do not blank the screen
