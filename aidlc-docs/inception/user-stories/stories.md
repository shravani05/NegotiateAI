# User Stories — NegotiateAI

Stories follow INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable.

---

## Epic 1: Scenario Intake

### US-01: Describe My Negotiation Situation
**As** Alex, Jordan, or Sam,
**I want to** fill in a structured form describing my negotiation situation (type, current offer, target, context),
**so that** the AI has the context it needs to generate a relevant, personalized strategy.

**Acceptance Criteria**:
- [ ] Form includes fields: negotiation type (salary / rent / freelance rate), current offer/amount, target amount, and free-text context
- [ ] All fields are validated before submission (negotiation type required; amounts must be numeric)
- [ ] Submitted data is stored in session state and passed to all subsequent AI features
- [ ] User can edit the scenario and restart from scratch at any time

**Persona**: Alex, Jordan, Sam

---

### US-02: Take the Negotiation Style Quiz
**As** Alex,
**I want to** answer a short personality quiz,
**so that** the system knows my negotiation style (assertive / diplomatic / collaborative) and tailors all scripts and coaching to it.

**Acceptance Criteria**:
- [ ] Quiz presents 4–6 questions with multiple-choice answers
- [ ] Quiz result maps to one of three styles: assertive, diplomatic, collaborative
- [ ] Result is displayed to the user with a brief description of their style
- [ ] Style is stored in session state and used in all AI prompts
- [ ] User can retake the quiz and update their style before generating a strategy

**Persona**: Alex, Jordan, Sam, Morgan

---

## Epic 2: Strategy Generator

### US-03: Generate a Personalized Negotiation Plan
**As** Alex,
**I want to** receive a personalized negotiation plan with word-for-word scripts,
**so that** I know exactly what to say and how to say it in my style.

**Acceptance Criteria**:
- [ ] Strategy is generated using AWS Bedrock (`anthropic.claude-opus-4-6-v1:0`)
- [ ] Strategy includes: opening statement, handling pushback, making a counteroffer, and closing
- [ ] Scripts are explicitly tailored to the user's negotiation style (assertive / diplomatic / collaborative)
- [ ] Strategy is displayed in a readable, structured format (sections with headers)
- [ ] A loading indicator is shown while the strategy is being generated
- [ ] Response streams to the UI progressively (not all at once)

**Persona**: Alex, Jordan, Sam

---

### US-04: Regenerate My Strategy
**As** Sam,
**I want to** regenerate my negotiation strategy if I'm not satisfied with the first version,
**so that** I can get a fresh perspective or try a different angle.

**Acceptance Criteria**:
- [ ] A "Regenerate" button is available on the strategy page
- [ ] Clicking it calls the Bedrock API again with the same scenario context
- [ ] The new strategy replaces the previous one in the UI
- [ ] User is not required to re-enter scenario details

**Persona**: Sam, Morgan

---

## Epic 3: Live Roleplay Simulator

### US-05: Practice Against an AI Other Party
**As** Jordan,
**I want to** practice my negotiation in a live turn-based roleplay against an AI playing my landlord,
**so that** I can rehearse my arguments and get comfortable with real pushback before the actual conversation.

**Acceptance Criteria**:
- [ ] Roleplay UI shows a chat-style interface with clear separation between user messages and AI other-party messages
- [ ] AI other-party is aware of the scenario (negotiation type, amounts, user style)
- [ ] AI other-party responds with realistic pushback, counteroffers, and objections appropriate to the negotiation type
- [ ] User types their message and submits; AI responds in turn
- [ ] AI responses stream progressively to the UI
- [ ] User can end the roleplay session at any time via an "End Session" button
- [ ] Full conversation transcript is retained for the coaching stage

**Persona**: Jordan, Alex, Sam

---

### US-06: AI Other Party Adapts to Negotiation Type
**As** Alex,
**I want** the AI employer to respond differently than an AI landlord or AI client,
**so that** the roleplay feels realistic and relevant to my specific situation.

**Acceptance Criteria**:
- [ ] AI other-party persona is set based on negotiation type: employer (salary), landlord (rent), client (freelance)
- [ ] AI other-party uses vocabulary and objections appropriate to their role (e.g., employer says "budget constraints"; landlord says "market rate")
- [ ] AI other-party difficulty/realism is consistent across the session

**Persona**: Alex, Jordan, Sam

---

## Epic 4: Real-Time Coaching

### US-07: Receive Per-Turn Coaching Feedback
**As** Alex,
**I want to** receive specific coaching feedback after each thing I say in the roleplay,
**so that** I can immediately learn what I did well and what I should improve.

**Acceptance Criteria**:
- [ ] After each user turn in the roleplay, a coaching feedback block appears below the user's message
- [ ] Feedback is specific and actionable (identifies exact phrases, suggests alternatives)
- [ ] Feedback is visually distinct from the conversation (different color/style)
- [ ] Feedback is generated using AWS Bedrock (`anthropic.claude-opus-4-6-v1:0`)
- [ ] Feedback does not block the roleplay — it appears alongside the conversation flow
- [ ] Feedback streams progressively to the UI

**Persona**: Alex, Jordan, Sam, Morgan

---

### US-08: Receive an End-of-Session Coaching Summary
**As** Morgan,
**I want to** receive a comprehensive coaching summary at the end of my roleplay session,
**so that** I can understand my overall performance, key strengths, and the most important areas to improve.

**Acceptance Criteria**:
- [ ] After ending the roleplay, a "Session Summary" is generated and displayed
- [ ] Summary covers: overall performance assessment, top 2–3 strengths, top 2–3 improvement areas, specific examples from the conversation
- [ ] Summary is generated using AWS Bedrock (`anthropic.claude-opus-4-6-v1:0`) with the full transcript as context
- [ ] User can scroll back through the full conversation transcript alongside the summary
- [ ] User can start a new scenario from the summary page

**Persona**: Morgan, Alex, Jordan, Sam

---

## Epic 5: Session Management

### US-09: Start a New Scenario
**As** Morgan,
**I want to** start a completely new negotiation scenario at any time,
**so that** I can practice different situations without being locked into one session.

**Acceptance Criteria**:
- [ ] A "New Scenario" button is accessible from any page
- [ ] Clicking it clears all session state (scenario, quiz result, strategy, transcript)
- [ ] User is returned to the scenario intake form
- [ ] No confirmation dialog required (session is not persisted anyway)

**Persona**: Morgan, Alex, Jordan, Sam

---

## Story Summary

| Epic | Stories | Personas Covered |
|---|---|---|
| Scenario Intake | US-01, US-02 | All |
| Strategy Generator | US-03, US-04 | All |
| Live Roleplay | US-05, US-06 | All |
| Real-Time Coaching | US-07, US-08 | All |
| Session Management | US-09 | All |

**Total Stories**: 9
**Total Epics**: 5
