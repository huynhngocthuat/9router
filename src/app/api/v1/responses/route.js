import { handleChat } from "@/sse/handlers/chat.js";
import { initTranslators } from "open-sse/translator/index.js";

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initTranslators();
    initialized = true;
  }
}

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
 * /v1/responses:
 *   post:
 *     tags: [Responses]
 *     summary: Create a response (OpenAI Responses API)
 *     description: OpenAI Responses-format payload, auto-detected and translated to the target provider. Set `stream` to true for an SSE stream.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: { schema: { type: object } }
 *     responses:
 *       200:
 *         description: Responses-format object, or an SSE stream when `stream` is true.
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
