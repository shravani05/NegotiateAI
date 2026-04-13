const {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'amazon.nova-pro-v1:0';

const isAnthropicModel = (id) => id.startsWith('anthropic.');
const isNovaModel = (id) => id.startsWith('amazon.nova');

/**
 * Builds the request payload based on the model provider.
 */
function buildPayload(systemPrompt, messages) {
  if (isAnthropicModel(MODEL_ID)) {
    return {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    };
  }

  if (isNovaModel(MODEL_ID)) {
    // Amazon Nova format: system is an array, messages use "content" as array of objects
    return {
      system: [{ text: systemPrompt }],
      messages: messages.map((m) => ({
        role: m.role,
        content: [{ text: m.content }],
      })),
      inferenceConfig: {
        maxTokens: 2048,
      },
    };
  }

  // Generic fallback — try Nova format
  return {
    system: [{ text: systemPrompt }],
    messages: messages.map((m) => ({
      role: m.role,
      content: [{ text: m.content }],
    })),
    inferenceConfig: { maxTokens: 2048 },
  };
}

/**
 * Extracts text from a streaming chunk based on model provider.
 */
function extractChunkText(chunk) {
  if (isAnthropicModel(MODEL_ID)) {
    if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
      return chunk.delta.text;
    }
  }

  if (isNovaModel(MODEL_ID)) {
    // Nova streaming: { contentBlockDelta: { delta: { text: "..." } } }
    if (chunk.contentBlockDelta?.delta?.text) {
      return chunk.contentBlockDelta.delta.text;
    }
  }

  return null;
}

/**
 * Invokes a Bedrock model with streaming.
 * @param {string} systemPrompt
 * @param {Array<{role: string, content: string}>} messages
 * @returns {AsyncGenerator} yields text chunks
 */
async function* invokeStream(systemPrompt, messages) {
  const payload = buildPayload(systemPrompt, messages);

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);

  for await (const item of response.body) {
    const chunk = JSON.parse(new TextDecoder().decode(item.chunk.bytes));
    const text = extractChunkText(chunk);
    if (text) yield text;
  }
}

module.exports = { invokeStream };
