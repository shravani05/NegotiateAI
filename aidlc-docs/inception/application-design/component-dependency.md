# Component Dependencies — NegotiateAI

---

## Dependency Matrix

### Frontend Dependencies

| Component | Depends On | Communication Pattern |
|---|---|---|
| ScenarioIntakeForm | SessionContext | Write: sets scenario + style on submit |
| StrategyView | SessionContext, Backend `/api/strategy` | Read: reads scenario + style; HTTP SSE stream |
| RoleplayChat | SessionContext, Backend `/api/roleplay/turn`, Backend `/api/coaching/turn` | Read/Write: reads scenario/style, writes transcript; HTTP SSE streams |
| SessionSummary | SessionContext, Backend `/api/coaching/summary` | Read: reads transcript; HTTP SSE stream |

### Backend Dependencies

| Component | Depends On | Communication Pattern |
|---|---|---|
| ScenarioRouter | StrategyService, RoleplayService, CoachingService | Direct function call, passes Express `res` for streaming |
| StrategyService | BedrockClient | Async call, receives AsyncIterable of chunks |
| RoleplayService | BedrockClient | Async call, receives AsyncIterable of chunks |
| CoachingService | BedrockClient | Async call, receives AsyncIterable of chunks |
| BedrockClient | AWS Bedrock Runtime (external) | AWS SDK v3 `InvokeModelWithResponseStream` |

---

## Data Flow Diagram

```
Browser (React SPA)
    |
    |  [1] User fills scenario + quiz
    v
ScenarioIntakeForm --> SessionContext (stores scenario, style)
    |
    |  [2] Navigate to StrategyView
    v
StrategyView --> POST /api/strategy --> StrategyService --> BedrockClient --> Bedrock
    |                                                                              |
    |  <-- SSE stream (strategy text chunks) <------------------------------------+
    |
    |  [3] User clicks "Start Practice"
    v
RoleplayChat
    |-- User types message
    |   |
    |   +--> POST /api/roleplay/turn --> RoleplayService --> BedrockClient --> Bedrock
    |   |                                                                          |
    |   |    <-- SSE stream (other-party response) <------------------------------+
    |   |
    |   +--> POST /api/coaching/turn --> CoachingService --> BedrockClient --> Bedrock
    |                                                                              |
    |        <-- SSE stream (coaching feedback) <---------------------------------+
    |
    |  [4] User clicks "End Session"
    v
SessionSummary --> POST /api/coaching/summary --> CoachingService --> BedrockClient --> Bedrock
    |                                                                                        |
    |  <-- SSE stream (summary report) <----------------------------------------------------+
```

---

## Cross-Cutting Concerns

| Concern | Handled By |
|---|---|
| Session state | SessionContext (React Context, browser memory only) |
| Streaming transport | Server-Sent Events (SSE) on all AI endpoints |
| AWS credentials | BedrockClient reads from AWS SDK default chain |
| Error display | Each frontend component handles stream errors with inline error message |
| Environment config | Backend reads `AWS_REGION`, `BEDROCK_MODEL_ID`, `PORT` from `.env` |

---

## Frontend ↔ Backend API Contract

| Endpoint | Method | Request Body | Response |
|---|---|---|---|
| `/api/strategy` | POST | `{ scenario: ScenarioData, style: NegotiationStyle }` | SSE text stream |
| `/api/roleplay/turn` | POST | `{ scenario, style, history: Turn[], message: string }` | SSE text stream |
| `/api/coaching/turn` | POST | `{ message: string, history: Turn[], scenario, style }` | SSE text stream |
| `/api/coaching/summary` | POST | `{ transcript: Turn[], scenario, style }` | SSE text stream |

### Shared Types
```typescript
type NegotiationStyle = 'assertive' | 'diplomatic' | 'collaborative';
type NegotiationType = 'salary' | 'rent' | 'freelance';

interface ScenarioData {
  type: NegotiationType;
  currentOffer: number;
  targetAmount: number;
  context: string;
}

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}
```
