import { handleChat } from "@/sse/handlers/chat.js";
import { initTranslators } from "open-sse/translator/index.js";
import { transformToOllama } from "open-sse/utils/ollamaTransform.js";

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
 * /v1/api/chat:
 *   post:
 *     tags: [Chat]
 *     summary: Chat (Ollama-compatible)
 *     description: Ollama /api/chat-compatible endpoint. Routes via the chat pipeline and reshapes the response to Ollama's format.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model: { type: string, example: "llama3.2" }
 *               messages: { type: array, items: { $ref: '#/components/schemas/ChatMessage' } }
 *               stream: { type: boolean }
 *     responses:
 *       200:
 *         description: Ollama-format chat response.
 *         content:
 *           application/json: { schema: { type: object } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  await ensureInitialized();

  const clonedReq = request.clone();
  let modelName = "llama3.2";
  try {
    const body = await clonedReq.json();
    modelName = body.model || "llama3.2";
  } catch {}

  const response = await handleChat(request);
  return transformToOllama(response, modelName);
}

