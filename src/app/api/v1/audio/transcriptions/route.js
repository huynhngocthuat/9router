import { handleStt } from "@/sse/handlers/stt.js";

// Allow large audio uploads — 5min for processing large files
export const maxDuration = 300;

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
 * /v1/audio/transcriptions:
 *   post:
 *     tags: [Audio]
 *     summary: Speech-to-text (OpenAI Whisper-compatible)
 *     description: Accepts multipart/form-data with an audio file (processing up to ~5 min).
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *               model: { type: string }
 *     responses:
 *       200:
 *         description: Transcription result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: { text: { type: string } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  return await handleStt(request);
}
