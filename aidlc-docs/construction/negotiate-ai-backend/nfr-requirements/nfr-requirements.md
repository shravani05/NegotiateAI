# NFR Requirements — negotiate-ai-backend

---

## Performance
- NFR-P1: First streaming chunk must reach the client within 3 seconds of request (Bedrock cold start tolerance)
- NFR-P2: Backend must not buffer the full Bedrock response — stream chunks as they arrive
- NFR-P3: No artificial delays between chunks

## Reliability
- NFR-R1: Bedrock API errors (throttling, model errors) must be caught and surfaced to the client via SSE error event — server must not crash
- NFR-R2: Invalid request bodies must return HTTP 400 immediately, before any Bedrock call is made
- NFR-R3: AWS credential errors must return HTTP 500 with a clear message (not a stack trace)

## Security
- NFR-S1: AWS credentials sourced exclusively from the AWS SDK default credential chain (env vars or `~/.aws/credentials`) — never hardcoded
- NFR-S2: No user data is logged to console beyond request method + path (no prompt content in logs)
- NFR-S3: CORS restricted to `http://localhost:3000` only

## Maintainability
- NFR-M1: All prompt strings isolated in `src/prompts/` — not embedded in service logic
- NFR-M2: Model ID and AWS region configurable via `.env` — not hardcoded
- NFR-M3: BedrockClient is the single point of AWS SDK usage — services do not import AWS SDK directly

## Usability (Developer)
- NFR-U1: `.env.example` file provided with all required variable names
- NFR-U2: Server startup logs port and model ID for easy verification
- NFR-U3: `npm start` starts the server with `node src/index.js`; `npm run dev` uses `nodemon` for development
