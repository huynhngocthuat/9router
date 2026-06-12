// Reusable OpenAPI components — security schemes + schemas referenced via $ref
// across the @swagger annotations on each route. Keep request/response shapes
// here in sync with the handlers under src/sse/handlers/* and the route files.

// Auth mechanisms mirror src/dashboardGuard.js::extractApiKey (Bearer -> x-api-key)
// plus the local CLI token header and the dashboard session cookie.
export const securitySchemes = {
  BearerAuth: {
    type: "http",
    scheme: "bearer",
    description: "9router API key sent as `Authorization: Bearer <key>` (OpenAI-style clients).",
  },
  ApiKeyAuth: {
    type: "apiKey",
    in: "header",
    name: "x-api-key",
    description: "9router API key sent as `x-api-key: <key>` (Anthropic/Claude-style clients).",
  },
  CliTokenAuth: {
    type: "apiKey",
    in: "header",
    name: "x-9r-cli-token",
    description: "Local CLI token (machineId-derived). Accepted on /v1 and /api/* from the local CLI.",
  },
  CookieAuth: {
    type: "apiKey",
    in: "cookie",
    name: "auth_token",
    description: "Dashboard session JWT set after login. Used by the management /api/* endpoints.",
  },
};

export const schemas = {
  // OpenAI-style error envelope. Most /v1 routes return { error: { message, type } };
  // a few low-level routes return a bare { error: "string" } — both are documented as oneOf.
  Error: {
    type: "object",
    properties: {
      error: {
        oneOf: [
          {
            type: "object",
            properties: {
              message: { type: "string" },
              type: { type: "string", example: "invalid_request_error" },
            },
            required: ["message"],
          },
          { type: "string" },
        ],
      },
    },
    required: ["error"],
  },

  // ---- Chat / Messages / Responses (all delegate to handleChat) ----
  ChatMessage: {
    type: "object",
    required: ["role", "content"],
    properties: {
      role: { type: "string", enum: ["system", "user", "assistant", "tool"] },
      content: {
        description: "Plain string, or an array of typed content parts (text/image).",
        oneOf: [
          { type: "string" },
          { type: "array", items: { type: "object" } },
        ],
      },
    },
  },
  ChatCompletionRequest: {
    type: "object",
    required: ["model", "messages"],
    properties: {
      model: {
        type: "string",
        description: "`<provider-alias>/<model-id>` or a combo name.",
        example: "openai/gpt-4o",
      },
      messages: { type: "array", items: { $ref: "#/components/schemas/ChatMessage" } },
      stream: { type: "boolean", default: false, description: "When true, responds with an SSE stream." },
      temperature: { type: "number" },
      max_tokens: { type: "integer" },
      tools: { type: "array", items: { type: "object" } },
      tool_choice: { description: "OpenAI tool_choice (string or object).", oneOf: [{ type: "string" }, { type: "object" }] },
      reasoning_effort: { type: "string", description: "For reasoning models (e.g. low/medium/high)." },
    },
  },
  ChatCompletionResponse: {
    type: "object",
    description: "OpenAI-compatible chat completion object. When the request format is Claude/Responses, the response is auto-translated to that format instead.",
    properties: {
      id: { type: "string" },
      object: { type: "string", example: "chat.completion" },
      created: { type: "integer" },
      model: { type: "string" },
      choices: { type: "array", items: { type: "object" } },
      usage: { type: "object" },
    },
  },
  CountTokensResponse: {
    type: "object",
    properties: { input_tokens: { type: "integer", description: "Estimated input token count (~4 chars/token)." } },
    required: ["input_tokens"],
  },

  // ---- Models ----
  Model: {
    type: "object",
    properties: {
      id: { type: "string", example: "openai/gpt-4o" },
      object: { type: "string", example: "model" },
      owned_by: { type: "string", description: "Provider alias or `combo`." },
      kind: { type: "string", description: "Only present for non-LLM models (e.g. webSearch, webFetch)." },
    },
  },
  ModelList: {
    type: "object",
    properties: {
      object: { type: "string", example: "list" },
      data: { type: "array", items: { $ref: "#/components/schemas/Model" } },
    },
  },
  ModelInfo: {
    type: "object",
    description: "Metadata for a single model (from /v1/models/info?id=...).",
    properties: {
      id: { type: "string", example: "openai/dall-e-3" },
      name: { type: "string" },
      kind: { type: "string", example: "image" },
      owned_by: { type: "string" },
      endpoint: { type: "string", nullable: true, example: "/v1/images/generations" },
      params: { type: "array", items: { type: "string" } },
      capabilities: { type: "array", items: { type: "string" } },
      contextWindow: { type: "integer" },
      dimensions: { type: "integer" },
      voicesUrl: { type: "string" },
    },
  },

  // ---- Embeddings ----
  EmbeddingRequest: {
    type: "object",
    required: ["model", "input"],
    properties: {
      model: { type: "string", example: "openai/text-embedding-3-small" },
      input: {
        description: "A string or array of strings to embed.",
        oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      },
      encoding_format: { type: "string", enum: ["float", "base64"] },
      dimensions: { type: "integer" },
    },
  },
  EmbeddingResponse: {
    type: "object",
    properties: {
      object: { type: "string", example: "list" },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            object: { type: "string", example: "embedding" },
            embedding: { type: "array", items: { type: "number" } },
            index: { type: "integer" },
          },
        },
      },
      model: { type: "string" },
      usage: { type: "object" },
    },
  },

  // ---- Images ----
  ImageGenerationRequest: {
    type: "object",
    required: ["model", "prompt"],
    properties: {
      model: { type: "string", example: "openai/dall-e-3" },
      prompt: { type: "string" },
      n: { type: "integer", default: 1 },
      size: { type: "string", example: "1024x1024" },
      response_format: { type: "string", enum: ["url", "b64_json"] },
    },
  },
  ImageGenerationResponse: {
    type: "object",
    properties: {
      created: { type: "integer" },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: { url: { type: "string" }, b64_json: { type: "string" } },
        },
      },
    },
  },

  // ---- Audio ----
  SpeechRequest: {
    type: "object",
    required: ["model", "input"],
    properties: {
      model: { type: "string", description: "`<alias>/<voice-id>` (see /v1/audio/voices).", example: "el/rachel" },
      input: { type: "string", description: "Text to synthesize." },
      voice: { type: "string" },
      response_format: { type: "string", example: "mp3" },
      speed: { type: "number" },
    },
  },
  VoiceList: {
    type: "object",
    properties: {
      object: { type: "string", example: "list" },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            lang: { type: "string" },
            gender: { type: "string" },
            model: { type: "string", description: "Ready-to-use model id for /v1/audio/speech." },
          },
        },
      },
    },
  },

  // ---- Web search / fetch ----
  SearchRequest: {
    type: "object",
    required: ["model", "query"],
    properties: {
      model: { type: "string", description: "`<alias>/search` or a webSearch combo.", example: "tavily/search" },
      query: { type: "string" },
      max_results: { type: "integer" },
      country: { type: "string" },
      language: { type: "string" },
      time_range: { type: "string" },
      search_type: { type: "string" },
    },
  },
  FetchRequest: {
    type: "object",
    required: ["model", "url"],
    properties: {
      model: { type: "string", description: "`<alias>/fetch` or a webFetch combo.", example: "jina/fetch" },
      url: { type: "string", format: "uri" },
      format: { type: "string" },
      max_characters: { type: "integer" },
    },
  },

  // Phase 2+ (management /api/*): add ApiKey, ProviderConnection, Combo, ProxyPool
  // mirroring the table shapes in src/lib/db/schema.js.
};
