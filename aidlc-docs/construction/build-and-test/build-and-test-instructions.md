# Build and Test Instructions — NegotiateAI

---

## Prerequisites

- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- AWS credentials configured with Bedrock access:
  - Option A: `aws configure` (sets `~/.aws/credentials`)
  - Option B: Environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- Bedrock model access enabled: `anthropic.claude-opus-4-6-v1:0` in your chosen region
  - Enable via AWS Console → Amazon Bedrock → Model access

---

## Build Steps

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output: `added N packages` with no errors.

### Step 2: Configure Backend Environment

```bash
cp .env.example .env
```

Edit `backend/.env` if needed:
```
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-opus-4-6-v1:0
PORT=3001
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

Expected output: `added N packages` with no errors.

### Step 4: Configure Frontend Environment

```bash
cp .env.example .env
```

`frontend/.env` default is correct for local development:
```
REACT_APP_API_URL=http://localhost:3001
```

---

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Expected startup output:
```
NegotiateAI backend running on port 3001
Model: anthropic.claude-opus-4-6-v1:0
Region: us-east-1
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

Expected: Browser opens at `http://localhost:3000`

---

## Integration Tests

These are manual verification steps to confirm all four AI features work end-to-end.

### Setup
Both backend and frontend must be running (see above).

### Test Scenario 1: Full Happy Path (Salary)

1. Open `http://localhost:3000`
2. Select **Salary**, enter current offer `65000`, target `75000`, any context
3. Answer all 5 quiz questions → verify style badge appears
4. Click **Generate My Negotiation Strategy**
5. **Verify**: Strategy streams progressively with 4 sections (Opening, Handling Pushback, Counteroffer, Closing)
6. Click **Start Roleplay Practice**
7. Type: `"I'd like to discuss the compensation package"`
8. **Verify**: Employer responds with realistic pushback (streams progressively)
9. **Verify**: Coaching feedback appears below your message with specific suggestions
10. Send 2 more messages
11. Click **End Session**
12. **Verify**: Coaching summary streams with 4 sections (Assessment, Strengths, Improvements, Examples)
13. Click **Show Transcript** → verify full conversation visible
14. Click **+ Start a New Scenario** → verify returns to intake form with cleared state

### Test Scenario 2: Rent Negotiation

1. Select **Rent**, current `1500`, target `1350`
2. Complete quiz → generate strategy
3. Verify strategy references rent-specific language
4. In roleplay, verify AI responds as **Landlord** (not employer)
5. Verify coaching feedback is contextually relevant to rent negotiation

### Test Scenario 3: Freelance Rate

1. Select **Freelance Rate**, current `50`, target `75`
2. Complete quiz → generate strategy
3. In roleplay, verify AI responds as **Client**
4. Verify coaching feedback references value framing

### Test Scenario 4: Regenerate Strategy

1. Complete scenario intake
2. On strategy page, click **↺ Regenerate**
3. **Verify**: Previous strategy clears, new strategy streams in

### Test Scenario 5: Error Handling

1. Stop the backend server
2. Try to generate a strategy
3. **Verify**: Error message appears inline (not a crash or blank screen)
4. Restart backend and verify recovery

---

## API Endpoint Smoke Tests

Use curl or any HTTP client to verify backend endpoints directly:

```bash
# Test strategy endpoint
curl -X POST http://localhost:3001/api/strategy \
  -H "Content-Type: application/json" \
  -d '{"scenario":{"type":"salary","currentOffer":65000,"targetAmount":75000,"context":"3 years experience"},"style":"diplomatic"}' \
  --no-buffer

# Test validation (expect 400)
curl -X POST http://localhost:3001/api/strategy \
  -H "Content-Type: application/json" \
  -d '{"scenario":{"type":"invalid","currentOffer":0},"style":"diplomatic"}'
```

Expected for strategy: SSE stream starting with `data: {"text":"..."}` chunks
Expected for validation: `{"error":"scenario.type must be salary, rent, or freelance"}`

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `Cannot find module '@aws-sdk/client-bedrock-runtime'` | Dependencies not installed | Run `npm install` in `backend/` |
| `AccessDeniedException` from Bedrock | Model access not enabled | Enable model in AWS Console → Bedrock → Model access |
| `Could not load credentials` | AWS credentials not configured | Run `aws configure` or set env vars |
| `CORS error` in browser | Backend not running or wrong port | Ensure backend is on port 3001 |
| Frontend shows blank page | React build issue | Check browser console; run `npm start` in `frontend/` |
| Stream stops mid-response | Bedrock throttling | Wait and retry; check AWS service quotas |
