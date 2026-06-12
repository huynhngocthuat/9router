/**
 * @swagger
 * /v1:
 *   get:
 *     tags: [Models]
 *     summary: List models (alias of /v1/models)
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *       - CliTokenAuth: []
 *     responses:
 *       200:
 *         description: List of models.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/ModelList' } }
 *       401:
 *         description: Missing or invalid API key.
 *         content:
 *           application/json: { schema: { $ref: '#/components/schemas/Error' } }
 */
export { GET, OPTIONS } from "./models/route";
