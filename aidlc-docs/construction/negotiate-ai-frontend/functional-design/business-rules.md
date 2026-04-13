# Business Rules — negotiate-ai-frontend

---

## Form Validation Rules
- BR-F1: Negotiation type is required — no default selection
- BR-F2: Current offer must be a positive number (> 0)
- BR-F3: Target amount must be a positive number (> 0)
- BR-F4: Context field is optional — empty string is valid
- BR-F5: All quiz questions must be answered before submission
- BR-F6: Validation errors shown inline per field — form does not submit until valid

## Quiz Rules
- BR-Q1: Quiz has exactly 5 questions
- BR-Q2: Each question has exactly 3 options (one per style)
- BR-Q3: Style is computed by majority vote; tie-break: diplomatic > assertive, collaborative > diplomatic
- BR-Q4: Computed style is shown to user with a one-line description before they proceed

## Navigation Rules
- BR-N1: User cannot navigate to StrategyView without a completed scenario + style in SessionContext
- BR-N2: User cannot navigate to RoleplayChat without a completed strategy
- BR-N3: User cannot navigate to SessionSummary without at least one roleplay turn in transcript
- BR-N4: "New Scenario" from any page resets all SessionContext state and navigates to intake

## Streaming Rules
- BR-S1: Loading indicator shown immediately when a stream request is initiated
- BR-S2: Text appended to UI as each chunk arrives — no waiting for full response
- BR-S3: If stream returns an error event, display inline error message; do not crash
- BR-S4: "Regenerate" button disabled while strategy stream is in progress

## Roleplay Rules
- BR-R1: User input field disabled while other-party response is streaming
- BR-R2: Coaching feedback for a turn appears below that turn's user message
- BR-R3: Coaching feedback loads independently — other-party response does not wait for coaching
- BR-R4: "End Session" button available after at least one complete turn
