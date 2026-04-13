const { invokeStream } = require('../bedrock/bedrockClient');
const { buildOtherPartySystemPrompt } = require('../prompts/roleplayPrompts');

function sseWrite(res, text) {
  res.write(`data: ${JSON.stringify({ text })}\n\n`);
}

function sseDone(res) {
  res.write('data: [DONE]\n\n');
  res.end();
}

function sseError(res, message) {
  res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  sseDone(res);
}

async function generateTurn(scenario, style, history, message, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const systemPrompt = buildOtherPartySystemPrompt(scenario, style);

    // Build messages: history + new user message
    const messages = [
      ...history.map((t) => ({ role: t.role, content: t.content })),
      { role: 'user', content: message },
    ];

    for await (const chunk of invokeStream(systemPrompt, messages)) {
      sseWrite(res, chunk);
    }
    sseDone(res);
  } catch (err) {
    console.error('Roleplay turn error:', err.message);
    sseError(res, `Failed to generate response: ${err.message}`);
  }
}

module.exports = { generateTurn };
