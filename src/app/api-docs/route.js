import { ApiReference } from "@scalar/nextjs-api-reference";

// Interactive API docs (Scalar) served as a route handler — no React component,
// so it does not conflict with React 19. Reads the spec from /api/openapi.
// Reachable without login: /api-docs is outside /api/ and /dashboard, so the
// request guard (src/dashboardGuard.js) passes it through.
export const GET = ApiReference({
  url: "/api/openapi",
  theme: "default",
  metaData: { title: "9router API Reference" },
});
