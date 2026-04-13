const { invokeStream } = require('../bedrock/bedrockClient');
const { buildTurnCoachingPrompt, buildSummaryPrompt } = require('../prompts/coachingPrompts');

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

async function generateTurnFeedback(message, history, scenario, style, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const { system, user } = buildTurnCoachingPrompt(message, scenario, style);
    const messages = [{ role: 'user', content: user }];

    for await (const chunk of invokeStream(system, messages)) {
      sseWrite(res, chunk);
    }
    sseDone(res);
  } catch (err) {
    console.error('Coaching turn error:', err.message);
    sseError(res, `Failed to generate coaching feedback: ${err.message}`);
  }
}

async function generateSummary(transcript, scenario, style, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const { system, user } = buildSummaryPrompt(transcript, scenario, style);
    const messages = [{ role: 'user', content: user }];

    for await (const chunk of invokeStream(system, messages)) {
      sseWrite(res, chunk);
    }
    sseDone(res);
  } catch (err) {
    console.error('Summary generation error:', err.message);
    sseError(res, `Failed to generate summary: ${err.message}`);
  }
}

module.exports = { generateTurnFeedback, generateSummary };
