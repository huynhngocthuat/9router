import { handleTts } from "@/sse/handlers/tts.js";

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
 * /v1/audio/speech:
 *   post:
 *     tags: [Audio]
 *     summary: Text-to-speech (OpenAI-compatible)
 *     description: Returns synthesized audio bytes. Use /v1/audio/voices to discover model ids.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: { schema: { $ref: '#/components/schemas/SpeechRequest' } }
 *     responses:
 *       200:
 *         description: Audio stream.
 *         content:
 *           audio/mpeg: { schema: { type: string, format: binary } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  return await handleTts(request);
}
