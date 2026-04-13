# Services — NegotiateAI

---

## Service Layer Overview

The backend uses a thin service layer. Each service owns one AI feature domain and is called directly by the router. There is no shared orchestration service — each feature is independent.

```
ScenarioRouter
    |
    +---> StrategyService  ---> BedrockClient ---> AWS Bedrock
    |
    +---> RoleplayService  ---> BedrockClient ---> AWS Bedrock
    |
    +---> CoachingService  ---> BedrockClient ---> AWS Bedrock
```

---

## S-1: StrategyService

**Responsibility**: Owns the strategy generation feature end-to-end.

**Orchestration**:
1. Receive scenario + style from router
2. Call `buildStrategyPrompt()` to construct system and user prompts
3. Call `BedrockClient.invokeStream()` with prompts
4. Pipe streamed chunks to HTTP response as Server-Sent Events (SSE)
5. Close response stream on completion or error

**Prompt Strategy**:
- System prompt: Sets AI as an expert negotiation coach; instructs it to produce a structured plan with four labeled sections (Opening, Handling Pushback, Counteroffer, Closing); specifies style tone (assertive = direct/confident, diplomatic = warm/collaborative framing, collaborative = value-focused/mutual-gain)
- User prompt: Injects negotiation type, current offer, target, context, and style

---

## S-2: RoleplayService

**Responsibility**: Owns the live roleplay simulation feature.

**Orchestration**:
1. Receive scenario, style, conversation history, and latest user message from router
2. Call `buildOtherPartyPrompt()` to construct the other-party persona system prompt
3. Format conversation history into Bedrock messages format
4. Call `BedrockClient.invokeStream()` with system prompt + history + new user message
5. Pipe streamed chunks to HTTP response as SSE

**Prompt Strategy**:
- System prompt: Sets AI as the other party (employer / landlord / client); instructs it to respond realistically with pushback, counteroffers, and objections; tells it to stay in character and never break the fourth wall; difficulty calibrated to be challenging but not impossible
- Conversation history: Full prior turns passed as alternating user/assistant messages

---

## S-3: CoachingService

**Responsibility**: Owns both per-turn coaching feedback and end-of-session summary.

**Per-Turn Orchestration**:
1. Receive user message, conversation history, scenario, and style from router
2. Call `buildTurnCoachingPrompt()` — prompt instructs AI to act as a negotiation coach analyzing the user's last message
3. Call `BedrockClient.invokeStream()`
4. Pipe streamed feedback to HTTP response as SSE

**Summary Orchestration**:
1. Receive full transcript, scenario, and style from router
2. Call `buildSummaryPrompt()` — prompt instructs AI to produce a structured report: overall assessment, top strengths (2–3), top improvement areas (2–3), specific examples from transcript
3. Call `BedrockClient.invokeStream()`
4. Pipe streamed summary to HTTP response as SSE

**Prompt Strategy (Per-Turn)**:
- Instructs AI to identify specific language patterns (hedging, passive voice, vague anchoring)
- Requires AI to quote the exact phrase and provide a concrete alternative
- Keeps feedback concise (2–4 bullet points max per turn)

**Prompt Strategy (Summary)**:
- Provides full transcript as context
- Instructs AI to evaluate overall negotiation arc, not just individual turns
- Requires structured output with labeled sections

---

## S-4: BedrockClient (Shared Infrastructure)

**Responsibility**: Shared AWS Bedrock integration used by all three services.

**Configuration**:
- Region: `process.env.AWS_REGION` (default: `us-east-1`)
- Model ID: `process.env.BEDROCK_MODEL_ID` (default: `anthropic.claude-opus-4-6-v1:0`)
- Credentials: AWS SDK default credential chain (env vars or `~/.aws/credentials`)

**Streaming**:
- Uses `InvokeModelWithResponseStream` API
- Yields text delta chunks from the Anthropic streaming response format
- Caller is responsible for piping chunks to HTTP response

---
