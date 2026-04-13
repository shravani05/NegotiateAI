const { invokeStream } = require('../bedrock/bedrockClient');
const { buildStrategyPrompt } = require('../prompts/strategyPrompts');

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

async function generateStrategy(scenario, style, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const { system, user } = buildStrategyPrompt(scenario, style);
    const messages = [{ role: 'user', content: user }];

    for await (const chunk of invokeStream(system, messages)) {
      sseWrite(res, chunk);
    }
    sseDone(res);
  } catch (err) {
    console.error('Strategy generation error:', err.message);
    sseError(res, `Failed to generate strategy: ${err.message}`);
  }
}

module.exports = { generateStrategy };
