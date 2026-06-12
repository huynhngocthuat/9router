import { handleFetch } from "@/sse/handlers/fetch.js";

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
 * /v1/web/fetch:
 *   post:
 *     tags: [Search]
 *     summary: Fetch / extract a web page
 *     description: Fetches and extracts content from a URL via a configured webFetch provider or combo.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: { schema: { $ref: '#/components/schemas/FetchRequest' } }
 *     responses:
 *       200:
 *         description: Fetched/extracted content.
 *         content:
 *           application/json: { schema: { type: object } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  return await handleFetch(request);
}
