# Component Methods — NegotiateAI

---

## Frontend

### C-F1: ScenarioIntakeForm

| Method | Input | Output | Purpose |
|---|---|---|---|
| `handleSubmit()` | form state | void | Validates fields, writes to SessionContext, navigates to StrategyView |
| `validateForm()` | form state | `{ valid: boolean, errors: string[] }` | Checks required fields and numeric constraints |
| `computeStyle(answers)` | quiz answer array | `'assertive' \| 'diplomatic' \| 'collaborative'` | Maps quiz answers to negotiation style |

---

### C-F2: StrategyView

| Method | Input | Output | Purpose |
|---|---|---|---|
| `fetchStrategy()` | SessionContext scenario + style | void | POSTs to `/api/strategy`, streams response into state |
| `handleRegenerate()` | — | void | Clears strategy state, calls `fetchStrategy()` again |
| `renderStreamingText(chunks)` | string[] | JSX | Progressively renders streamed text chunks |

---

### C-F3: RoleplayChat

| Method | Input | Output | Purpose |
|---|---|---|---|
| `handleUserSubmit(message)` | string | void | Appends user turn to transcript, calls `fetchOtherPartyResponse()` and `fetchCoachingFeedback()` |
| `fetchOtherPartyResponse(history)` | turn array | void | POSTs to `/api/roleplay/turn`, streams AI other-party reply |
| `fetchCoachingFeedback(userMessage, history)` | string, turn array | void | POSTs to `/api/coaching/turn`, streams coaching feedback |
| `handleEndSession()` | — | void | Saves transcript to SessionContext, navigates to SessionSummary |

---

### C-F4: SessionSummary

| Method | Input | Output | Purpose |
|---|---|---|---|
| `fetchSummary(transcript)` | turn array | void | POSTs to `/api/coaching/summary`, streams summary report |
| `handleNewScenario()` | — | void | Calls SessionContext reset, navigates to ScenarioIntakeForm |

---

### C-F5: SessionContext

| Method | Input | Output | Purpose |
|---|---|---|---|
| `setScenario(data)` | scenario object | void | Stores negotiation scenario in context |
| `setStyle(style)` | style string | void | Stores negotiation style |
| `setStrategy(text)` | string | void | Stores generated strategy |
| `appendTurn(turn)` | turn object | void | Appends a roleplay turn to transcript |
| `reset()` | — | void | Clears all session state |

---

## Backend

### C-B1: ScenarioRouter

| Method | Route | Input | Output | Purpose |
|---|---|---|---|---|
| `postStrategy` | POST `/api/strategy` | `{ scenario, style }` | SSE stream | Delegates to StrategyService |
| `postRoleplayTurn` | POST `/api/roleplay/turn` | `{ scenario, style, history, message }` | SSE stream | Delegates to RoleplayService |
| `postCoachingTurn` | POST `/api/coaching/turn` | `{ message, history, scenario, style }` | SSE stream | Delegates to CoachingService |
| `postCoachingSummary` | POST `/api/coaching/summary` | `{ transcript, scenario, style }` | SSE stream | Delegates to CoachingService |

---

### C-B2: StrategyService

| Method | Input | Output | Purpose |
|---|---|---|---|
| `generateStrategy(scenario, style, res)` | scenario obj, style string, Express res | void (streams) | Builds prompt, calls BedrockClient, pipes stream to response |
| `buildStrategyPrompt(scenario, style)` | scenario obj, style string | `{ system, user }` | Constructs system + user prompts tailored to negotiation type and style |

---

### C-B3: RoleplayService

| Method | Input | Output | Purpose |
|---|---|---|---|
| `generateTurn(scenario, style, history, message, res)` | scenario, style, history[], message, res | void (streams) | Builds other-party prompt, calls BedrockClient, pipes stream |
| `buildOtherPartyPrompt(scenario, style)` | scenario, style | `{ system }` | Constructs persona prompt for employer / landlord / client |

---

### C-B4: CoachingService

| Method | Input | Output | Purpose |
|---|---|---|---|
| `generateTurnFeedback(message, history, scenario, style, res)` | string, history[], scenario, style, res | void (streams) | Builds per-turn coaching prompt, streams feedback |
| `generateSummary(transcript, scenario, style, res)` | turn[], scenario, style, res | void (streams) | Builds summary prompt with full transcript, streams report |
| `buildTurnCoachingPrompt(message, history, scenario, style)` | — | `{ system, user }` | Prompt focused on language analysis and specific suggestions |
| `buildSummaryPrompt(transcript, scenario, style)` | — | `{ system, user }` | Prompt for overall performance report |

---

### C-B5: BedrockClient

| Method | Input | Output | Purpose |
|---|---|---|---|
| `invokeStream(systemPrompt, userPrompt, history?)` | string, string, message[]? | AsyncIterable | Calls Bedrock `InvokeModelWithResponseStream`, yields text chunks |
| `formatMessages(systemPrompt, userPrompt, history?)` | string, string, message[]? | Bedrock messages array | Formats input for Anthropic Messages API |

---
