# Tech Stack Decisions — negotiate-ai-backend

---

## Runtime
- **Node.js 18+** — LTS, native `fetch`, good AWS SDK v3 support

## Framework
- **Express 4** — minimal, well-understood, easy SSE support via `res.write()`

## AWS SDK
- **@aws-sdk/client-bedrock-runtime** (v3) — modular, tree-shakeable, supports `InvokeModelWithResponseStreamCommand`
- Streaming pattern: `for await (const item of apiResponse.body)` — iterate AsyncIterable of chunks
- Chunk extraction: `JSON.parse(new TextDecoder().decode(item.chunk.bytes))` → check `chunk.type === 'content_block_delta'` → read `chunk.delta.text`

## Environment Config
- **dotenv** — load `.env` at startup

## CORS
- **cors** npm package — configured for `http://localhost:3000`

## Dev Tooling
- **nodemon** (devDependency) — auto-restart on file changes during development

## Dependencies Summary
```json
{
  "dependencies": {
    "@aws-sdk/client-bedrock-runtime": "^3.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^4.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```
