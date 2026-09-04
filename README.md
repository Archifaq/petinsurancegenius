# petinsurancegenius.com

Astro-based US pet insurance SEO/affiliate experiment.

Project instructions live in `docs/` and should be reviewed before implementation work.

## Commands

- `npm run dev` starts local development.
- `npm run prepare-content-index` syncs Astro content, checks flat slug uniqueness
  across all content collections, and writes `.astro/noindex-paths.json` for sitemap
  filtering.
- `npm run build` checks and builds the site.
- `npm run preview` previews the built output.

## Hosting

Default target: Cloudflare Pages, static-first with hybrid routes where runtime behavior is required.

## Content Validation

The site uses flat content URLs. Frontmatter `slug` values must be unique across all
seven content collections, not only within a single collection. `scripts/validate-content.mjs`
enforces this before production builds and also collects every noindexed content path
for the sitemap filter in `astro.config.mjs`.

Standalone pages outside content collections are not visible to the content validator.
If a standalone page should be noindexed, add its path to `staticNoindexPaths` in
`astro.config.mjs` so it is also excluded from the sitemap.
