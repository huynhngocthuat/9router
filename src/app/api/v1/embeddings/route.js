import { handleEmbeddings } from "@/sse/handlers/embeddings.js";

/**
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  });
}

/**
 * @swagger
 * /v1/embeddings:
 *   post:
 *     tags: [Embeddings]
 *     summary: Create embeddings (OpenAI-compatible)
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: { schema: { $ref: '#/components/schemas/EmbeddingRequest' } }
 *     responses:
 *       200:
 *         description: Embedding vectors.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/EmbeddingResponse' } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  return await handleEmbeddings(request);
}
