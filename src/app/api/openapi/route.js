import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CORS = { "Access-Control-Allow-Origin": "*" };

// Serves the OpenAPI spec. Dev scans @swagger annotations live (fast iteration);
// production reads the build-time artifact public/openapi.json, because the
// standalone bundle does not include route.js sources for createSwaggerSpec to scan.
export async function GET() {
  if (process.env.NODE_ENV !== "production") {
    const { getApiSpec } = await import("@/lib/openapi/spec.js");
    return NextResponse.json(getApiSpec(), { headers: CORS });
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  try {
    const json = await fs.readFile(path.join(process.cwd(), "public", "openapi.json"), "utf8");
    return new NextResponse(json, {
      headers: { "content-type": "application/json", ...CORS },
    });
  } catch {
    return NextResponse.json(
      { error: "OpenAPI spec not generated. Run `npm run openapi:generate`." },
      { status: 500, headers: CORS },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: { ...CORS, "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" },
  });
}
