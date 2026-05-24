import { cp, mkdir, rm, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(projectRoot, "dist");
const nestedDistDir = join(distDir, "dist");

async function mirrorDist() {
  await rm(nestedDistDir, { recursive: true, force: true });
  await mkdir(nestedDistDir, { recursive: true });

  const entries = await readdir(distDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "dist") {
      continue;
    }

    await cp(join(distDir, entry.name), join(nestedDistDir, entry.name), {
      recursive: true,
      force: true,
    });
  }
}

mirrorDist().catch((error) => {
  console.error("Failed to mirror dist folder:", error);
  process.exitCode = 1;
});
