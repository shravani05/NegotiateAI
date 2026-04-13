const STYLE_TONE = {
  assertive: 'Be direct, confident, and data-driven. Use declarative statements. Avoid hedging language like "I was hoping" or "maybe". Anchor high and justify with facts.',
  diplomatic: 'Be warm and collaborative. Acknowledge the other party\'s perspective. Frame requests as mutual benefits. Maintain a positive, professional tone throughout.',
  collaborative: 'Focus on shared value and long-term relationship. Frame the ask around delivered value and future potential. Seek win-win outcomes.',
};

const TYPE_LABEL = {
  salary: 'salary negotiation with an employer',
  rent: 'rent negotiation with a landlord',
  freelance: 'freelance rate negotiation with a client',
};

function buildStrategyPrompt(scenario, style) {
  const system = `You are an expert negotiation coach helping someone prepare for a ${TYPE_LABEL[scenario.type]}.
Your task is to write a personalized negotiation script with exactly four labeled sections.
Tone style: ${STYLE_TONE[style]}
Format your response with these exact section headers:
## Opening Statement
## Handling Pushback
## Making a Counteroffer
## Closing
Keep each section concise and practical — word-for-word scripts the user can actually say.`;

  const user = `My negotiation details:
- Type: ${scenario.type}
- Current offer/amount: ${scenario.currentOffer}
- My target: ${scenario.targetAmount}
- Context: ${scenario.context || 'No additional context provided.'}
- My negotiation style: ${style}

Write my personalized negotiation script.`;

  return { system, user };
}

module.exports = { buildStrategyPrompt };
