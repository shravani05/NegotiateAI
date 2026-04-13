# NFR Design Patterns — negotiate-ai-backend

---

## Pattern 1: Pass-Through Streaming (Performance)
All four endpoints use the same streaming pattern — no buffering:
```
Bedrock AsyncIterable --> for await loop --> res.write(SSE chunk) --> client
```
The Express response is kept open (`res.flushHeaders()` called immediately after setting SSE headers) so the browser receives chunks as they arrive from Bedrock.

## Pattern 2: Fail-Fast Validation (Reliability)
Request validation runs synchronously before any async Bedrock call:
```
router.post('/api/strategy', (req, res) => {
  const error = validateStrategyRequest(req.body);
  if (error) return res.status(400).json({ error });
  // ... proceed to service
});
```
This prevents wasted Bedrock API calls on bad input.

## Pattern 3: SSE Error Envelope (Reliability)
When a Bedrock error occurs mid-stream, the error is sent as a structured SSE event so the frontend can display it inline rather than showing a broken stream:
```
data: {"error": "Bedrock throttling — please retry"}\n\n
data: [DONE]\n\n
```

## Pattern 4: Prompt Isolation (Maintainability)
All prompt construction is in `src/prompts/` files, not in service files. Services call prompt builder functions and pass the result to BedrockClient. This makes prompt iteration fast without touching service logic.

## Pattern 5: Single Bedrock Abstraction (Maintainability)
`BedrockClient` is the only file that imports `@aws-sdk/client-bedrock-runtime`. All services call `bedrockClient.invokeStream(...)`. This means the AWS SDK version or streaming API can be updated in one place.
