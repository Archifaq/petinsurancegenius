# Current Project State for Claude

Last accepted checkpoint: Checkpoint 5 plus the follow-up
`src/pages/[slug].astro` / `hip-dysplasia.md` fix, accepted by Claude after review.

Use `CHECKPOINT_5_ACCEPTED_BASELINE.md` as the latest code baseline. Older
checkpoint packs are historical only unless the owner explicitly asks for comparison.

## Current Implementation Baseline

- Astro installed version: 5.18.2.
- Content collections use Astro 5 `glob()` loaders in `src/content.config.ts`.
- Frontmatter `slug` is the source of truth for flat page URLs via
  `glob().generateId`; rendered route params use `entry.id`.
- Seven collections exist: `guide`, `breed`, `state`, `condition`,
  `carrier-review`, `comparison`, and `blog`.
- There are 36 unique content slugs across the seven collections.
- Duplicate slugs are checked inside each collection during loader id generation
  and across all collections by `scripts/validate-content.mjs`.
- `scripts/validate-content.mjs` also validates that `pillarSlug` and
  `relatedSlugs` references resolve to existing slugs.
- `npm run predev` and `npm run prebuild` both run content validation.
- `npm run build` runs content validation, Astro check, and Astro build.
- `devalue` is explicitly pinned as a devDependency because the validation script
  imports it directly.
- `public/robots.txt` allows indexing, disallows `/go/`, and points crawlers to
  `https://petinsurancegenius.com/sitemap-index.xml`.
- Sitemap filtering excludes content-collection pages where `noindex` is not
  explicitly `false`, and excludes standalone noindex pages listed in
  `staticNoindexPaths` in `astro.config.mjs`.
- Current standalone noindex page: `/privacy-policy/`.
- `/advertising-disclosure/` is indexable and linked from affiliate disclosures.
- `/privacy-policy/` exists as a real route but remains excluded from the sitemap.
- `/pet-insurance-guide/`, `/dog-insurance-guide/`, and `/cat-insurance-guide/`
  are rendered from the `guide` collection.
- `/go/[carrier]` remains the only place where real affiliate destination URLs
  are resolved.
- Affiliate click tracking remains wrapped in try/catch in the redirect handler.

## Current Content Baseline

- There are 36 content entries across the seven collections.
- Six content entries are `noindex: false`; the remaining 30 content entries are
  `noindex: true`.
- Checkpoint 5 added two species pillar pages:
  - `src/content/guide/dog-insurance-guide.md`
  - `src/content/guide/cat-insurance-guide.md`
- Dog/cat breed, condition, comparison, and obvious species-specific carrier/blog
  pages now use `dog-insurance-guide` or `cat-insurance-guide` as `pillarSlug`.
- Generic state/general pages remain on `pet-insurance-guide`.
- Content entries include `pillarSlug` and/or `relatedSlugs` relationships to
  support internal linking.

## Indexable Content Pages

These six content pages are currently `noindex: false`:

- `src/content/guide/pet-insurance-guide.md` — Core pillar page expanded from a
  placeholder into a general comparison framework covering policy mechanics,
  pre-existing condition timing, species branching, and non-agency language.
- `src/content/blog/does-pet-insurance-cover-dental.md` — Evergreen informational
  explainer distinguishing dental injury, dental illness, routine cleanings, and
  wellness add-ons without unsupported coverage promises.
- `src/content/blog/pet-insurance-before-surgery.md` — High-intent trigger-event
  page focused on timing, pre-existing condition risk, waiting periods, and urgent
  care caveats without quote or solicitation behavior.
- `src/content/blog/switching-providers.md` — Policy-transition guide explaining
  record review, coverage gaps, and waiting-period resets without provider rankings.
- `src/content/condition/cruciate-ligament-waiting-period.md` — Dog/orthopedic
  condition page covering cruciate/CCL terminology, bilateral-condition language,
  timing caveats, and policy-review questions.
- `src/content/condition/hip-dysplasia.md` — Dog condition page with orthopedic,
  hereditary, pre-existing-condition, waiting-period, and breed-context guidance.
  `species` is now `dog` to match its dog-only body copy and dog pillar.

## Current Template Baseline

- `src/pages/[slug].astro` renders all seven collections as flat URLs.
- Rendered content pages include canonical URL support, breadcrumb JSON-LD,
  Article JSON-LD, and FAQPage JSON-LD when FAQ entries exist.
- The "Related Guides" pillar link now resolves the actual guide entry title from
  the `guide` collection by matching `entry.id === entry.data.pillarSlug`.
- If a pillar guide entry cannot be found, the template falls back to a humanized
  version of the `pillarSlug`.
- The rendered pillar link for both `/pet-insurance-hip-dysplasia/` and
  `/pet-insurance-waiting-period-for-cruciate-ligament/` reads
  `Dog Insurance Guide` and points to `/dog-insurance-guide/`.
- Carrier-review pages must not use `Review`, `Product`, `Rating`, or
  `AggregateRating` JSON-LD unless a future legal/compliance review explicitly
  approves a compliant approach.
- Monetized pages render `DisclosureBanner` before affiliate-linked content.
- `BaseLayout` renders the site-wide footer on every page.
- Footer includes the "not an insurance agency" disclaimer.

## Review Posture for Next Checkpoint

For the next prompt to Codex, keep focusing on:

- Content-quality safeguards before any additional page moves to `noindex: false`.
- No fake reviews, fake ratings, urgency mechanics, or unsourced numeric claims.
- No on-site quote, application, purchase, or insurance-sales flow.
- Strong affiliate disclosure placement on every monetized page.
- Internal linking and canonical/noindex/sitemap behavior.
- Keeping `/go/[carrier]` measurable and auditable as the conversion event.
