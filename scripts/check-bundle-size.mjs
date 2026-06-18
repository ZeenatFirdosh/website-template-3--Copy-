import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Maximum size (uncompressed) for any single JS chunk.
// Framework chunks (React, Next.js internals) are typically 150-300KB.
// Exceeding this limit usually means a large library was accidentally bundled.
const MAX_CHUNK_KB = 500;

const chunkDir = join(process.cwd(), ".next/static/chunks");

let files;
try {
  files = readdirSync(chunkDir).filter((f) => f.endsWith(".js"));
} catch {
  console.error(
    "No build found. Run `pnpm build` before checking bundle size."
  );
  process.exit(1);
}

const violations = [];
let totalBytes = 0;

for (const file of files) {
  const bytes = statSync(join(chunkDir, file)).size;
  totalBytes += bytes;
  if (bytes > MAX_CHUNK_KB * 1024) {
    violations.push(
      `  ${file}: ${Math.round(bytes / 1024)}KB (limit: ${MAX_CHUNK_KB}KB)`
    );
  }
}

if (violations.length > 0) {
  console.error(`Bundle size limit exceeded (${MAX_CHUNK_KB}KB per chunk):\n`);
  for (const v of violations) {
    console.error(v);
  }
  process.exit(1);
}

console.log(
  `Bundle size OK — ${files.length} chunks, ${Math.round(totalBytes / 1024)}KB total (limit: ${MAX_CHUNK_KB}KB per chunk)`
);
