# Domain Entities — negotiate-ai-backend

---

## ScenarioData
```typescript
interface ScenarioData {
  type: 'salary' | 'rent' | 'freelance';
  currentOffer: number;      // e.g. 65000 or 1500
  targetAmount: number;      // e.g. 75000 or 1350
  context: string;           // free-text notes from user
}
```

## NegotiationStyle
```typescript
type NegotiationStyle = 'assertive' | 'diplomatic' | 'collaborative';
```

## Turn (Conversation History)
```typescript
interface Turn {
  role: 'user' | 'assistant';
  content: string;
}
```

## StrategyRequest
```typescript
interface StrategyRequest {
  scenario: ScenarioData;
  style: NegotiationStyle;
}
```

## RoleplayTurnRequest
```typescript
interface RoleplayTurnRequest {
  scenario: ScenarioData;
  style: NegotiationStyle;
  history: Turn[];
  message: string;
}
```

## CoachingTurnRequest
```typescript
interface CoachingTurnRequest {
  message: string;
  history: Turn[];
  scenario: ScenarioData;
  style: NegotiationStyle;
}
```

## CoachingSummaryRequest
```typescript
interface CoachingSummaryRequest {
  transcript: Turn[];
  scenario: ScenarioData;
  style: NegotiationStyle;
}
```

## BedrockPayload (internal)
```typescript
interface BedrockPayload {
  anthropic_version: 'bedrock-2023-05-31';
  max_tokens: number;
  system?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}
```
