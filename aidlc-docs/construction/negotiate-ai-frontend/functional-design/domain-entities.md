# Domain Entities — negotiate-ai-frontend

---

## SessionState (React Context)
```typescript
interface SessionState {
  scenario: ScenarioData | null;
  style: NegotiationStyle | null;
  strategy: string;
  transcript: Turn[];
}
```

## ScenarioData
```typescript
interface ScenarioData {
  type: 'salary' | 'rent' | 'freelance';
  currentOffer: number;
  targetAmount: number;
  context: string;
}
```

## NegotiationStyle
```typescript
type NegotiationStyle = 'assertive' | 'diplomatic' | 'collaborative';
```

## Turn
```typescript
interface Turn {
  role: 'user' | 'assistant';
  content: string;
}
```

## QuizQuestion
```typescript
interface QuizQuestion {
  id: number;
  text: string;
  options: Array<{
    label: string;
    style: NegotiationStyle;
  }>;
}
```

## RoleplayChatState (local to RoleplayChat)
```typescript
interface RoleplayChatState {
  transcript: Turn[];
  coaching: Record<number, string>;  // turn index -> coaching text
  inputValue: string;
  isOtherPartyLoading: boolean;
  isCoachingLoading: Record<number, boolean>;
}
```
