import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { existsSync, readFileSync } from "node:fs";

const isProductionBuild = process.env.npm_lifecycle_event === "build";
const noindexPathsFile = new URL("./.astro/noindex-paths.json", import.meta.url);
const noindexPaths = existsSync(noindexPathsFile)
  ? new Set(JSON.parse(readFileSync(noindexPathsFile, "utf8")))
  : new Set();
// Manual noindex list for standalone pages outside content collections.
// Add new standalone noindex paths here so they stay out of the sitemap.
const staticNoindexPaths = new Set(["/privacy-policy/"]);

function normalizeSitemapPath(page) {
  const pathname = new URL(page).pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export default defineConfig({
  site: "https://petinsurancegenius.com",
  adapter:
    isProductionBuild
      ? cloudflare({
          imageService: "compile"
        })
      : undefined,
  integrations: [
    sitemap({
      filter: (page) => {
        const path = normalizeSitemapPath(page);
        return !noindexPaths.has(path) && !staticNoindexPaths.has(path);
      }
    })
  ]
});
