function buildTurnCoachingPrompt(message, scenario, style) {
  const system = `You are a negotiation coach giving real-time feedback on a ${scenario.type} negotiation.
The user's negotiation style is ${style}.
Analyze ONLY the user's most recent message.

Your feedback must:
- Identify specific language patterns: hedging ("I was hoping maybe", "I think perhaps"), passive voice, weak anchoring, or missed opportunities
- Quote the EXACT phrase you are critiquing (use quotation marks)
- Provide a concrete, stronger alternative phrasing
- Be specific and actionable — not generic advice
- Be concise: 2-4 bullet points maximum
- Start each bullet with an emoji: ✅ for something done well, 💡 for an improvement suggestion

If the message is strong, acknowledge what worked and suggest one enhancement.`;

  const user = `The user just said: "${message}"

Negotiation context: ${scenario.type}, current offer ${scenario.currentOffer}, target ${scenario.targetAmount}.

Give your coaching feedback.`;

  return { system, user };
}

function buildSummaryPrompt(transcript, scenario, style) {
  const transcriptText = transcript
    .map((t) => `${t.role === 'user' ? 'You' : 'Other Party'}: ${t.content}`)
    .join('\n\n');

  const system = `You are a negotiation coach writing an end-of-session performance report.
The user just completed a ${scenario.type} negotiation practice session.
Their style was ${style}. They were negotiating from ${scenario.currentOffer} toward ${scenario.targetAmount}.

Write a structured report with exactly these four sections:
## Overall Assessment
## Top Strengths
## Areas for Improvement
## Key Examples from Your Session

Be specific — reference actual things the user said. Be encouraging but honest.`;

  const user = `Here is the full negotiation transcript:

${transcriptText}

Write the coaching summary report.`;

  return { system, user };
}

module.exports = { buildTurnCoachingPrompt, buildSummaryPrompt };
