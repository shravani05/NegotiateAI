# NegotiateAI

## Demo Video
https://drive.google.com/file/d/1xOc-4Xg9-k5lKVM5V9fwkEzsFK0LSuYr/view?usp=sharing

A personal negotiation coach for students and early-career professionals. Practice salary, rent, and freelance rate negotiations with AI-powered strategy generation, live roleplay, and real-time coaching.

## Prerequisites

- Node.js 18+
- AWS account with Bedrock access enabled for `anthropic.claude-opus-4-6-v1:0` in your region
- AWS credentials configured locally (`aws configure` or environment variables)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (region, model ID, port)
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### backend/.env
| Variable | Default | Description |
|---|---|---|
| `AWS_REGION` | `us-east-1` | AWS region for Bedrock |
| `BEDROCK_MODEL_ID` | `anthropic.claude-opus-4-6-v1:0` | Bedrock model ID |
| `PORT` | `3001` | Backend server port |

### frontend/.env
| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:3001` | Backend API base URL |

## Features

1. **Scenario Intake** — Describe your negotiation + take a 5-question style quiz (assertive / diplomatic / collaborative)
2. **Strategy Generator** — Get a personalized word-for-word script with 4 sections, streamed from Claude Opus 4.6
3. **Live Roleplay** — Practice against an AI employer, landlord, or client with realistic pushback
4. **Real-Time Coaching** — Get specific feedback on every message you send, plus an end-of-session report

## Project Structure

```
negotiate-ai/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── bedrock/bedrockClient.js
│   │   ├── router/scenarioRouter.js
│   │   ├── services/{strategy,roleplay,coaching}Service.js
│   │   └── prompts/{strategy,roleplay,coaching}Prompts.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/SessionContext.jsx
│   │   ├── hooks/useStream.js
│   │   ├── api/negotiate.js
│   │   ├── components/{ScenarioIntakeForm,StrategyView,RoleplayChat,SessionSummary}.jsx
│   │   └── styles/index.css
│   └── package.json
└── README.md
```
