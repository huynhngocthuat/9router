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
 * /v1/chat/completions:
 *   post:
 *     tags: [Chat]
 *     summary: Create a chat completion (OpenAI-compatible)
 *     description: >-
 *       Routes to a configured provider/model. Accepts OpenAI chat format;
 *       Claude- and Responses-format payloads are auto-detected and translated.
 *       Set `stream: true` for an SSE token stream.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatCompletionRequest'
 *     responses:
 *       200:
 *         description: Chat completion object, or an SSE stream when `stream` is true.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatCompletionResponse'
 *           text/event-stream:
 *             schema:
 *               type: string
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request) {
  // Fallback to local handling
  await ensureInitialized();
  
  return await handleChat(request);
}

