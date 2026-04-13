# Logical Components — negotiate-ai-backend

---

## Component: Request Validator (inline in router)
- Validates all incoming request bodies before service calls
- Returns structured 400 errors with field-level messages
- No external library — plain JS validation functions

## Component: SSE Helper (inline in services)
- `sseWrite(res, text)` — writes `data: {"text":"..."}\n\n`
- `sseDone(res)` — writes `data: [DONE]\n\n` and ends response
- `sseError(res, message)` — writes `data: {"error":"..."}\n\n` then calls `sseDone`
- Shared utility used by all three services

## Component: BedrockClient
- Singleton instance created at startup
- Exposes `invokeStream(systemPrompt, messages)` returning AsyncIterable
- Handles `InvokeModelWithResponseStreamCommand` and chunk decoding
- Reads `AWS_REGION` and `BEDROCK_MODEL_ID` from environment at init

## Component: Prompt Builders (in src/prompts/)
- `strategyPrompts.js` — exports `buildStrategyPrompt(scenario, style)`
- `roleplayPrompts.js` — exports `buildOtherPartySystemPrompt(scenario, style)`
- `coachingPrompts.js` — exports `buildTurnCoachingPrompt(message, scenario, style)` and `buildSummaryPrompt(transcript, scenario, style)`

## Component: Express App (src/index.js)
- Loads dotenv
- Creates Express app
- Applies cors middleware
- Applies JSON body parser
- Mounts ScenarioRouter at `/api`
- Starts server on `PORT` env var (default 3001)
- Logs startup info: port, model ID, region
