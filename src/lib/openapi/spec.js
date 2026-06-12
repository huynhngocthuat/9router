import { createSwaggerSpec } from "next-swagger-doc";
import { securitySchemes, schemas } from "./components.js";

// Builds the OpenAPI spec by scanning @swagger JSDoc blocks under src/app/api.
// In dev this runs per-request (live reload). In production the filesystem scan
// returns nothing (output: "standalone" bundle has no route.js sources), so the
// spec is pre-generated to public/openapi.json at build time — see
// scripts/generate-openapi.mjs and src/app/api/openapi.json/route.js.
export function getApiSpec() {
  return createSwaggerSpec({
    // Relative to cwd — next-swagger-doc joins apiFolder with process.cwd()
    // internally, so this must NOT be absolute. Routes nest under src/app/api.
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.3",
      info: {
        title: "9router API",
        version: process.env.npm_package_version || "0.4.71",
        description:
          "Public LLM API for 9router (`/v1/*`), compatible with OpenAI- and " +
          "Claude-style clients. Authenticate with a 9router API key via " +
          "`Authorization: Bearer <key>` or `x-api-key: <key>`.",
      },
      servers: [
        { url: "http://localhost:20128", description: "Local dev" },
        { url: "/", description: "Same-origin (deployed / tunneled)" },
      ],
      components: { securitySchemes, schemas },
      // No document-level `security` — declared per-operation, since /v1 and the
      // (future) /api management surface use different schemes.
      tags: [
        { name: "Chat", description: "OpenAI-compatible chat completions" },
        { name: "Messages", description: "Anthropic-compatible messages" },
        { name: "Responses", description: "OpenAI Responses API" },
        { name: "Models", description: "Model listing & metadata" },
        { name: "Embeddings", description: "Text embeddings" },
        { name: "Images", description: "Image generation" },
        { name: "Audio", description: "Speech (TTS), transcription (STT), voices" },
        { name: "Search", description: "Web search & fetch" },
      ],
    },
  });
}
