# Business Rules — negotiate-ai-backend

---

## Validation Rules

### BR-1: Request Validation
- `scenario.type` MUST be one of: `salary`, `rent`, `freelance`
- `scenario.currentOffer` MUST be a positive number
- `scenario.targetAmount` MUST be a positive number
- `style` MUST be one of: `assertive`, `diplomatic`, `collaborative`
- `message` (roleplay/coaching) MUST be a non-empty string
- `history` MUST be an array (may be empty for first turn)
- `transcript` (summary) MUST be a non-empty array

### BR-2: Target vs Current Offer
- No server-side enforcement — user may target lower (rent) or higher (salary/freelance)
- Frontend handles UX guidance; backend accepts any positive numbers

---

## Prompt Rules

### BR-3: Strategy Prompt
- MUST include all four sections: Opening, Handling Pushback, Counteroffer, Closing
- MUST reference the exact dollar/amount figures from scenario
- MUST apply style-specific tone (see tone map in business-logic-model.md)
- max_tokens: 1500

### BR-4: Roleplay Prompt
- MUST stay in character as the other party for the entire session
- MUST NOT break the fourth wall or acknowledge being an AI
- MUST use objections appropriate to the negotiation type
- MUST reference scenario amounts when making counteroffers
- Conversation history MUST be passed on every turn (stateless backend)
- max_tokens: 600

### BR-5: Per-Turn Coaching Prompt
- MUST analyze only the user's most recent message (not the full history)
- MUST quote the exact phrase being critiqued
- MUST provide a concrete alternative phrasing
- MUST limit output to 2–4 bullet points
- max_tokens: 400

### BR-6: Summary Prompt
- MUST include the full transcript in the prompt
- MUST produce exactly four labeled sections: Overall Assessment, Strengths, Areas for Improvement, Key Examples
- max_tokens: 1200

---

## Streaming Rules

### BR-7: SSE Format
- All streaming responses MUST set `Content-Type: text/event-stream`
- Each chunk MUST be sent as: `data: {"text":"<chunk>"}\n\n`
- Stream MUST end with: `data: [DONE]\n\n`
- On error: send `data: {"error":"<message>"}\n\n` then end stream

### BR-8: CORS
- Backend MUST allow requests from `http://localhost:3000` (React dev server)
- CORS headers MUST be set before streaming begins
