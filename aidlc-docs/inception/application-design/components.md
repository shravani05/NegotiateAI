# Components — NegotiateAI

---

## Frontend Components (React SPA)

### C-F1: ScenarioIntakeForm
**Purpose**: Collects the user's negotiation situation and personality quiz answers.
**Responsibilities**:
- Render negotiation type selector (salary / rent / freelance rate)
- Render numeric fields for current offer and target amount
- Render free-text context field
- Render personality quiz (4–6 questions → assertive / diplomatic / collaborative)
- Validate all fields before submission
- Emit completed scenario + style to session state on submit

---

### C-F2: StrategyView
**Purpose**: Displays the AI-generated negotiation strategy and scripts.
**Responsibilities**:
- Trigger strategy generation API call on mount
- Render streaming strategy text progressively as it arrives
- Display structured sections (opening, pushback, counteroffer, closing)
- Provide "Regenerate" button to re-fetch strategy
- Show loading indicator during generation
- Navigate user to roleplay on "Start Practice" action

---

### C-F3: RoleplayChat
**Purpose**: Turn-based chat interface for live negotiation roleplay.
**Responsibilities**:
- Render conversation thread with visual separation: user messages, AI other-party messages, coaching feedback blocks
- Accept user text input and submit on Enter or button click
- Send user turn to backend; stream AI other-party response
- Trigger per-turn coaching fetch after each user message
- Stream coaching feedback inline below each user message
- Provide "End Session" button
- Retain full transcript in component state

---

### C-F4: SessionSummary
**Purpose**: Displays the end-of-session coaching summary report.
**Responsibilities**:
- Trigger summary generation API call on mount (with full transcript)
- Render streaming summary text (overall performance, strengths, improvements, examples)
- Display scrollable transcript alongside summary
- Provide "New Scenario" button to reset session

---

### C-F5: SessionContext (React Context / State)
**Purpose**: Global session state shared across all frontend components.
**Responsibilities**:
- Store scenario data (type, current offer, target, context notes)
- Store negotiation style (assertive / diplomatic / collaborative)
- Store generated strategy text
- Store roleplay transcript (array of turns)
- Provide reset function to clear all state for new scenario

---

## Backend Components (Node.js / Express)

### C-B1: ScenarioRouter
**Purpose**: Express router handling all `/api/scenario` endpoints.
**Responsibilities**:
- Route POST `/api/strategy` → StrategyService
- Route POST `/api/roleplay/turn` → RoleplayService
- Route POST `/api/coaching/turn` → CoachingService
- Route POST `/api/coaching/summary` → CoachingService
- Validate request bodies; return 400 on invalid input

---

### C-B2: StrategyService
**Purpose**: Generates the personalized negotiation strategy via Bedrock.
**Responsibilities**:
- Accept scenario context and negotiation style
- Build strategy prompt (system + user) tailored to style
- Call BedrockClient with streaming enabled
- Stream response chunks back to HTTP response
- Handle Bedrock errors gracefully

---

### C-B3: RoleplayService
**Purpose**: Generates AI other-party responses during roleplay.
**Responsibilities**:
- Accept scenario context, negotiation style, conversation history, and latest user message
- Build other-party persona prompt based on negotiation type (employer / landlord / client)
- Maintain conversation context across turns via history array in request
- Call BedrockClient with streaming enabled
- Stream response chunks back to HTTP response

---

### C-B4: CoachingService
**Purpose**: Generates per-turn coaching feedback and end-of-session summary.
**Responsibilities**:
- **Per-turn**: Accept user message + conversation context; build coaching prompt; return specific feedback on language, framing, and confidence
- **Summary**: Accept full transcript; build summary prompt; return overall performance report
- Call BedrockClient with streaming enabled for both modes
- Stream response chunks back to HTTP response

---

### C-B5: BedrockClient
**Purpose**: Encapsulates all AWS Bedrock API interactions.
**Responsibilities**:
- Initialize AWS Bedrock Runtime client with region from environment
- Provide `invokeStream(systemPrompt, userPrompt, conversationHistory)` method
- Use `anthropic.claude-opus-4-6-v1:0` model (configurable via env var)
- Handle Bedrock API errors and surface meaningful error messages
- Format messages in Anthropic Messages API format

---
