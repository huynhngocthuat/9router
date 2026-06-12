import { handleChat } from "@/sse/handlers/chat.js";
import { initTranslators } from "open-sse/translator/index.js";

let initialized = false;

/**
 * Initialize translators once
 */
async function ensureInitialized() {
  if (!initialized) {
    await initTranslators();
    initialized = true;
  }
}

/**
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  });
}

/**
 * @swagger
 * /v1/messages:
 *   post:
 *     tags: [Messages]
 *     summary: Create a message (Anthropic/Claude-compatible)
 *     description: Claude Messages format, auto-translated to the target provider via the same pipeline as chat completions. Set `stream` to true for an SSE stream.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ChatCompletionRequest' }
 *     responses:
 *       200:
 *         description: Claude-format message, or an SSE stream when `stream` is true.
 *         content:
 *           application/json: { schema: { type: object } }
 *           text/event-stream: { schema: { type: string } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  await ensureInitialized();
  return await handleChat(request);
}

