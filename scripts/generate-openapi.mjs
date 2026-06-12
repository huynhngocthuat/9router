// Build-time generator: writes public/openapi.json from the @swagger annotations.
// Runs via the `prebuild` npm script so the standalone production bundle (which
// has no route.js sources to scan) serves a baked spec. Run manually with
// `npm run openapi:generate`.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getApiSpec } from "../src/lib/openapi/spec.js";

const spec = getApiSpec();
const outDir = path.join(process.cwd(), "public");
const out = path.join(outDir, "openapi.json");

await mkdir(outDir, { recursive: true });
await writeFile(out, JSON.stringify(spec, null, 2));

const pathCount = Object.keys(spec.paths || {}).length;
console.log(`Wrote ${out} (${pathCount} paths)`);
if (pathCount === 0) {
  console.warn("WARNING: spec has 0 paths — check @swagger annotations under src/app/api.");
}
