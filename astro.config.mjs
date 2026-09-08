import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { writeNoindexPaths } from "./scripts/noindex-paths.mjs";

const isProductionBuild = process.env.npm_lifecycle_event === "build";
// Generate from source content when Astro config loads so direct `astro build`
// commands and empty Cloudflare cache states cannot produce an unfiltered sitemap.
const noindexPaths = new Set(writeNoindexPaths());
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
