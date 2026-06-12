import { handleSearch } from "@/sse/handlers/search.js";

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
 * /v1/search:
 *   post:
 *     tags: [Search]
 *     summary: Web search
 *     description: Performs a web search via a configured webSearch provider or combo.
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: { schema: { $ref: '#/components/schemas/SearchRequest' } }
 *     responses:
 *       200:
 *         description: Search results.
 *         content:
 *           application/json: { schema: { type: object } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export async function POST(request) {
  return await handleSearch(request);
}
