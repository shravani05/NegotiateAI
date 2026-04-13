# Business Logic Model — negotiate-ai-frontend

---

## Application State Machine

The app follows a linear user journey with one global session state:

```
[ScenarioIntake] --> [StrategyView] --> [RoleplayChat] --> [SessionSummary]
        ^                                                          |
        +---------------------------[New Scenario]----------------+
```

State transitions are driven by user actions. All state lives in `SessionContext`.

---

## Flow 1: Scenario Intake + Quiz

```
User fills form fields
  |
  +--> validateForm()
  |       - type required
  |       - currentOffer: positive number
  |       - targetAmount: positive number
  |       - context: optional string
  |
  +--> computeStyle(quizAnswers)
  |       - Each quiz question has weighted options
  |       - Tally assertive / diplomatic / collaborative scores
  |       - Return style with highest score
  |
  +--> SessionContext.setScenario(data)
  +--> SessionContext.setStyle(style)
  +--> navigate('/strategy')
```

### Quiz Scoring Logic
- 5 questions, each with 3 options mapping to one style
- Count votes per style → highest count wins
- Tie-break: diplomatic wins over assertive; collaborative wins over diplomatic

---

## Flow 2: Strategy Streaming

```
StrategyView mounts
  |
  +--> POST /api/strategy with { scenario, style }
  |
  +--> Open SSE stream via fetch + ReadableStream
  |
  +--> For each chunk:
  |       - Parse JSON: { text } or { error } or "[DONE]"
  |       - If text: append to strategyText state
  |       - If error: set errorMessage state
  |       - If [DONE]: set isComplete = true
  |
  +--> Render strategyText progressively
```

---

## Flow 3: Roleplay Turn

```
User types message + submits
  |
  +--> Append { role: 'user', content: message } to transcript
  +--> Set isOtherPartyLoading = true
  |
  +--> POST /api/roleplay/turn with { scenario, style, history: transcript, message }
  |       Stream response --> append to otherPartyBuffer
  |       On [DONE]: append { role: 'assistant', content: buffer } to transcript
  |       Set isOtherPartyLoading = false
  |
  +--> POST /api/coaching/turn with { message, history: transcript, scenario, style }
  |       Stream response --> append to coachingBuffer for this turn index
  |       On [DONE]: set coaching[turnIndex] = buffer
  |
  +--> Both fetches run concurrently (Promise.all not needed — independent state updates)
```

---

## Flow 4: Session Summary

```
User clicks "End Session"
  |
  +--> SessionContext.appendTranscript(transcript)
  +--> navigate('/summary')

SessionSummary mounts
  |
  +--> POST /api/coaching/summary with { transcript, scenario, style }
  +--> Stream summary text progressively
  +--> On [DONE]: set isComplete = true
```

---

## SSE Client Pattern (useStream hook)

```javascript
async function streamFetch(url, body, onChunk, onDone, onError) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop(); // keep incomplete line
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') { onDone(); return; }
      const parsed = JSON.parse(data);
      if (parsed.error) { onError(parsed.error); return; }
      if (parsed.text) onChunk(parsed.text);
    }
  }
}
```
