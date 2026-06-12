import { handleImageGeneration } from "@/sse/handlers/imageGeneration.js";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

/**
 * @swagger
 * /v1/images/generations:
 *   post:
 *     tags: [Images]
 *     summary: Generate images (OpenAI-compatible)
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: { schema: { $ref: '#/components/schemas/ImageGenerationRequest' } }
 *     responses:
 *       200:
 *         description: Generated image(s).
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/ImageGenerationResponse' } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  return await handleImageGeneration(request);
}
