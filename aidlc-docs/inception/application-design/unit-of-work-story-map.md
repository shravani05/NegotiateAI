# Unit of Work Story Map — NegotiateAI

---

## Unit 1: Frontend (React SPA)

| Story | Title | Priority |
|---|---|---|
| US-01 | Describe My Negotiation Situation | High — entry point for all flows |
| US-02 | Take the Negotiation Style Quiz | High — required for personalization |
| US-03 | Generate a Personalized Negotiation Plan | High — core value feature |
| US-04 | Regenerate My Strategy | Medium — quality-of-life |
| US-05 | Practice Against an AI Other Party | High — core value feature |
| US-06 | AI Other Party Adapts to Negotiation Type | High — realism requirement |
| US-07 | Receive Per-Turn Coaching Feedback | High — core value feature |
| US-08 | Receive an End-of-Session Coaching Summary | High — core value feature |
| US-09 | Start a New Scenario | Medium — session management |

**Note**: All stories have a frontend component. The frontend renders all UI and manages session state. Backend stories below refer to the API that powers each feature.

---

## Unit 2: Backend (Node.js + Bedrock)

| Story | Title | API Endpoint | Priority |
|---|---|---|---|
| US-03 | Generate a Personalized Negotiation Plan | `POST /api/strategy` | High |
| US-04 | Regenerate My Strategy | `POST /api/strategy` (re-call) | Medium |
| US-05 | Practice Against an AI Other Party | `POST /api/roleplay/turn` | High |
| US-06 | AI Other Party Adapts to Negotiation Type | `POST /api/roleplay/turn` (prompt logic) | High |
| US-07 | Receive Per-Turn Coaching Feedback | `POST /api/coaching/turn` | High |
| US-08 | Receive an End-of-Session Coaching Summary | `POST /api/coaching/summary` | High |

**Note**: US-01, US-02, US-09 are frontend-only (no backend API call needed — handled in session state).

---

## Coverage Verification

| Story | Unit 1 (Frontend) | Unit 2 (Backend) | Fully Covered |
|---|---|---|---|
| US-01 | Yes | No (frontend only) | Yes |
| US-02 | Yes | No (frontend only) | Yes |
| US-03 | Yes | Yes | Yes |
| US-04 | Yes | Yes | Yes |
| US-05 | Yes | Yes | Yes |
| US-06 | Yes | Yes | Yes |
| US-07 | Yes | Yes | Yes |
| US-08 | Yes | Yes | Yes |
| US-09 | Yes | No (frontend only) | Yes |

All 9 stories covered. No gaps.

---

## Implementation Order (Recommended)

**Unit 2 (Backend) first** — build and verify Bedrock integration before wiring up frontend:
1. BedrockClient + basic streaming test
2. StrategyService + `/api/strategy` endpoint
3. RoleplayService + `/api/roleplay/turn` endpoint
4. CoachingService + `/api/coaching/turn` + `/api/coaching/summary` endpoints

**Unit 1 (Frontend) second** — build screens in user journey order:
1. SessionContext + App routing
2. ScenarioIntakeForm (US-01, US-02)
3. StrategyView (US-03, US-04)
4. RoleplayChat (US-05, US-06, US-07)
5. SessionSummary (US-08, US-09)
