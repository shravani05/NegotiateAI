# Units of Work — NegotiateAI

---

## Unit 1: Frontend (React SPA)

**Name**: `negotiate-ai-frontend`
**Purpose**: The complete React single-page application — all user-facing screens, session state management, and streaming UI.

**Responsibilities**:
- Scenario intake form and personality quiz
- Strategy display with progressive streaming
- Turn-based roleplay chat interface with inline coaching feedback
- End-of-session summary display
- Global session state via React Context
- HTTP SSE client for all streaming API calls

**Components Contained**:
- C-F1: ScenarioIntakeForm
- C-F2: StrategyView
- C-F3: RoleplayChat
- C-F4: SessionSummary
- C-F5: SessionContext

**Code Organization**:
```
frontend/
├── package.json
├── .env                        # REACT_APP_API_URL=http://localhost:3001
├── public/
│   └── index.html
└── src/
    ├── index.jsx
    ├── App.jsx                 # Router + SessionContext provider
    ├── context/
    │   └── SessionContext.jsx  # C-F5
    ├── components/
    │   ├── ScenarioIntakeForm.jsx   # C-F1
    │   ├── StrategyView.jsx         # C-F2
    │   ├── RoleplayChat.jsx         # C-F3
    │   └── SessionSummary.jsx       # C-F4
    ├── hooks/
    │   └── useStream.js        # Shared SSE streaming hook
    ├── api/
    │   └── negotiate.js        # API call functions
    └── styles/
        └── index.css
```

**Technology**:
- React 18, React Router v6
- Fetch API with ReadableStream for SSE
- No external UI library required (plain CSS)

---

## Unit 2: Backend (Node.js + Bedrock)

**Name**: `negotiate-ai-backend`
**Purpose**: The Express API server — all AI prompt orchestration, AWS Bedrock integration, and SSE streaming to the frontend.

**Responsibilities**:
- REST API with 4 SSE streaming endpoints
- Strategy prompt construction and streaming
- Roleplay other-party persona and turn management
- Per-turn coaching feedback generation
- End-of-session summary generation
- AWS Bedrock Runtime client (Claude Opus 4.6)

**Components Contained**:
- C-B1: ScenarioRouter
- C-B2: StrategyService
- C-B3: RoleplayService
- C-B4: CoachingService
- C-B5: BedrockClient

**Code Organization**:
```
backend/
├── package.json
├── .env                        # AWS_REGION, BEDROCK_MODEL_ID, PORT
├── src/
│   ├── index.js                # Express app entry point
│   ├── router/
│   │   └── scenarioRouter.js   # C-B1
│   ├── services/
│   │   ├── strategyService.js  # C-B2
│   │   ├── roleplayService.js  # C-B3
│   │   └── coachingService.js  # C-B4
│   ├── bedrock/
│   │   └── bedrockClient.js    # C-B5
│   └── prompts/
│       ├── strategyPrompts.js
│       ├── roleplayPrompts.js
│       └── coachingPrompts.js
```

**Technology**:
- Node.js 18+, Express 4
- AWS SDK for JavaScript v3 (`@aws-sdk/client-bedrock-runtime`)
- `dotenv` for environment config
- `cors` for local frontend-backend communication

---
