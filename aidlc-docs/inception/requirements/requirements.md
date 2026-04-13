# Requirements Document — NegotiateAI

## Intent Analysis

- **User Request**: Build NegotiateAI — a personal negotiation coach for students and early-career professionals
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: Multiple Components (React frontend, Node.js backend, AWS Bedrock integration)
- **Complexity Estimate**: Moderate-to-Complex (multi-step AI workflows, real-time roleplay, coaching feedback)

---

## Functional Requirements

### FR-1: Scenario Intake
- FR-1.1: User can describe their negotiation situation via a structured form (negotiation type, current offer, target value, context/notes)
- FR-1.2: Supported negotiation types: salary negotiation, rent negotiation, freelance rate negotiation
- FR-1.3: User completes a personality quiz to determine negotiation style (assertive / diplomatic / collaborative)
- FR-1.4: Quiz results are stored in session state and used to personalize all subsequent AI outputs
- FR-1.5: User can start a new scenario at any time, resetting the session

### FR-2: Strategy Generator
- FR-2.1: After scenario intake, the system generates a personalized negotiation plan
- FR-2.2: The plan includes word-for-word scripts tailored to the user's negotiation style
- FR-2.3: Scripts cover: opening statement, handling pushback, making a counteroffer, closing
- FR-2.4: Strategy is generated using AWS Bedrock with model `anthropic.claude-opus-4-6-v1:0`
- FR-2.5: User can view the full strategy document before entering roleplay
- FR-2.6: User can regenerate the strategy if unsatisfied

### FR-3: Live Roleplay Simulator
- FR-3.1: User can enter a live roleplay session where the AI plays the other party (employer, landlord, or client)
- FR-3.2: The AI other-party responds realistically with pushback, counteroffers, and objections appropriate to the negotiation type
- FR-3.3: The roleplay is turn-based: user types their message, AI responds as the other party
- FR-3.4: The AI other-party is aware of the scenario context (offer amounts, negotiation type, user style)
- FR-3.5: User can end the roleplay session at any time
- FR-3.6: Full conversation transcript is retained for the coaching feedback stage

### FR-4: Real-Time Coaching
- FR-4.1: After each roleplay round (user turn), the system provides coaching feedback on what the user said
- FR-4.2: Feedback is specific and actionable (e.g., identifies hedging language, suggests stronger phrasing)
- FR-4.3: Feedback is displayed inline alongside the conversation, not as a separate page
- FR-4.4: At the end of the roleplay session, a summary coaching report is generated covering overall performance, strengths, and areas for improvement
- FR-4.5: All coaching uses AWS Bedrock with model `anthropic.claude-opus-4-6-v1:0`

---

## Non-Functional Requirements

### NFR-1: Technology Stack
- NFR-1.1: Frontend — React (single-page application)
- NFR-1.2: Backend — Node.js (Express or similar lightweight framework)
- NFR-1.3: AI — AWS Bedrock, model `anthropic.claude-opus-4-6-v1:0` (Claude Opus 4.6)
- NFR-1.4: Communication — REST API between frontend and backend

### NFR-2: Local-Only Operation
- NFR-2.1: Application runs entirely on localhost — no cloud deployment required
- NFR-2.2: No authentication or user accounts
- NFR-2.3: No persistent database — session state held in memory or browser session storage
- NFR-2.4: No deployment configuration files (no Dockerfile, no CDK, no CloudFormation)

### NFR-3: AWS Bedrock Integration
- NFR-3.1: Backend communicates with AWS Bedrock using the AWS SDK for JavaScript (v3)
- NFR-3.2: AWS credentials sourced from local environment (AWS CLI profile or environment variables)
- NFR-3.3: All four AI features (strategy generation, roleplay other-party, per-turn coaching, session summary) use the same Bedrock model

### NFR-4: Performance
- NFR-4.1: AI responses should stream to the frontend where possible to reduce perceived latency
- NFR-4.2: UI remains responsive during AI generation (loading indicators)

### NFR-5: Usability
- NFR-5.1: Clean, minimal UI appropriate for a coaching tool
- NFR-5.2: Clear visual separation between: user messages, AI other-party messages, and coaching feedback
- NFR-5.3: Mobile-friendly layout is a nice-to-have, not required

### NFR-6: Maintainability
- NFR-6.1: Frontend and backend are separate packages (monorepo or two folders)
- NFR-6.2: Environment variables used for any configurable values (e.g., AWS region, model ID)

---

## User Scenarios

### Scenario A — Salary Negotiation
A recent graduate receives a job offer of $65,000. They want $75,000. They identify as "diplomatic." The system generates a diplomatic script, then lets them practice against an AI employer who pushes back with "that's above our budget." The coaching feedback notes they said "I was hoping maybe..." and suggests "Based on my research, I'm targeting..."

### Scenario B — Rent Negotiation
A student wants to negotiate their rent renewal down by $150/month. They identify as "assertive." The system generates a direct, data-backed script. The AI landlord counters with "the market rate is higher." Coaching feedback praises their directness but flags a missed opportunity to anchor first.

### Scenario C — Freelance Rate
A junior developer wants to raise their rate from $50/hr to $75/hr with an existing client. They identify as "collaborative." The system generates a value-focused script. The AI client says "that's a big jump." Coaching feedback suggests framing the increase around delivered value.

---

## Out of Scope
- User authentication / accounts
- Persistent storage / database
- Cloud deployment
- Mobile native app
- Multi-language support
- Analytics or usage tracking
