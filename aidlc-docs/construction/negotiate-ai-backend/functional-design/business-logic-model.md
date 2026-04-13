# Business Logic Model — negotiate-ai-backend

---

## Core Business Flows

### Flow 1: Strategy Generation
```
Input: { scenario: ScenarioData, style: NegotiationStyle }
  |
  +--> buildStrategyPrompt(scenario, style)
  |       - Select tone instructions based on style
  |       - Inject negotiation type, amounts, context
  |       - Request 4 labeled sections: Opening, Pushback, Counteroffer, Closing
  |
  +--> BedrockClient.invokeStream(systemPrompt, userPrompt)
  |
  +--> Pipe chunk.delta.text to SSE response
```

### Flow 2: Roleplay Turn
```
Input: { scenario, style, history: Turn[], message: string }
  |
  +--> buildOtherPartyPersona(scenario.type)
  |       - 'salary'    --> employer persona
  |       - 'rent'      --> landlord persona
  |       - 'freelance' --> client persona
  |
  +--> formatHistory(history) --> Bedrock messages array
  |
  +--> BedrockClient.invokeStream(personaPrompt, message, formattedHistory)
  |
  +--> Pipe chunk.delta.text to SSE response
```

### Flow 3: Per-Turn Coaching
```
Input: { message: string, history: Turn[], scenario, style }
  |
  +--> buildCoachingPrompt(message, scenario, style)
  |       - Instruct AI to analyze the user's message only
  |       - Identify: hedging language, passive voice, weak anchoring
  |       - Require: quote exact phrase + provide stronger alternative
  |       - Limit: 2-4 bullet points
  |
  +--> BedrockClient.invokeStream(coachingSystemPrompt, userPrompt)
  |
  +--> Pipe chunk.delta.text to SSE response
```

### Flow 4: Session Summary
```
Input: { transcript: Turn[], scenario, style }
  |
  +--> buildSummaryPrompt(transcript, scenario, style)
  |       - Serialize full transcript into prompt
  |       - Request structured report: Assessment, Strengths, Improvements, Examples
  |
  +--> BedrockClient.invokeStream(summarySystemPrompt, userPrompt)
  |
  +--> Pipe chunk.delta.text to SSE response
```

---

## Prompt Construction Logic

### Style Tone Map
| Style | Tone Instructions |
|---|---|
| assertive | Direct, confident, data-driven. Use declarative statements. Avoid hedging. |
| diplomatic | Warm, collaborative framing. Acknowledge the other party. Seek mutual benefit. |
| collaborative | Value-focused. Emphasize shared goals. Frame asks around delivered value. |

### Negotiation Type → Other Party Persona
| Type | Persona | Typical Objections |
|---|---|---|
| salary | Employer / Hiring Manager | "That's above our budget", "We have a salary band", "We can revisit after 6 months" |
| rent | Landlord / Property Manager | "Market rate is higher", "We have other applicants", "Maintenance costs have increased" |
| freelance | Client / Project Manager | "That's a big jump", "We're working within a fixed budget", "We can find someone cheaper" |

---

## SSE Streaming Protocol

All endpoints use Server-Sent Events format:
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"text": "chunk of text"}\n\n
data: [DONE]\n\n
```

Frontend reads the stream using `fetch` + `ReadableStream` and appends each `text` chunk to the UI.

---

## Error Handling Logic

| Error Scenario | Handling |
|---|---|
| Missing required field in request body | Return HTTP 400 with field name |
| Bedrock API error (throttling, model error) | Send `data: {"error": "message"}\n\n` then close stream |
| Invalid negotiation type | Return HTTP 400 |
| AWS credentials not found | Return HTTP 500 with descriptive message |
