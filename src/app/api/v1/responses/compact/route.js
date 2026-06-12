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
 * /v1/responses/compact:
 *   post:
 *     tags: [Responses]
 *     summary: Compact conversation context
 *     description: Compacts/summarizes the conversation context. Reuses the chat pipeline with an internal compact flag.
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
 *         description: Compacted response.
 *         content:
 *           application/json: { schema: { type: object } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  await ensureInitialized();
  const body = await request.json();
  body._compact = true;
  const newRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify(body)
  });
  return await handleChat(newRequest);
}
