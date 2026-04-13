# Unit of Work Dependencies — NegotiateAI

---

## Dependency Matrix

| Unit | Depends On | Type | Notes |
|---|---|---|---|
| Unit 1: Frontend | Unit 2: Backend | Runtime (HTTP) | Frontend calls backend REST API at runtime; no build-time dependency |
| Unit 2: Backend | AWS Bedrock (external) | Runtime (AWS SDK) | Backend calls Bedrock at runtime; requires valid AWS credentials locally |

**Build-time dependencies**: None between units. Each unit builds independently.

---

## Integration Points

### Frontend → Backend
- **Protocol**: HTTP with Server-Sent Events (SSE)
- **Base URL**: `http://localhost:3001` (configurable via `REACT_APP_API_URL`)
- **Endpoints**:
  - `POST /api/strategy`
  - `POST /api/roleplay/turn`
  - `POST /api/coaching/turn`
  - `POST /api/coaching/summary`
- **Contract**: Defined in `component-dependency.md` — shared TypeScript-style types for `ScenarioData`, `Turn`, `NegotiationStyle`

### Backend → AWS Bedrock
- **SDK**: `@aws-sdk/client-bedrock-runtime`
- **API**: `InvokeModelWithResponseStream`
- **Model**: `anthropic.claude-opus-4-6-v1:0`
- **Auth**: AWS default credential chain (env vars or `~/.aws/credentials`)

---

## Build and Startup Order

1. Start **Unit 2 (Backend)** first — `cd backend && npm start` → listens on port 3001
2. Start **Unit 1 (Frontend)** second — `cd frontend && npm start` → listens on port 3000, proxies API calls to backend

Units can be developed independently. Frontend can be developed with mocked API responses before backend is complete.

---

## Rollback Strategy

Local-only project — no deployment. Rollback = revert file changes via git.

---
