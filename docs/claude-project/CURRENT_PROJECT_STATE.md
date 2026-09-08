# Current Project State for Claude

Latest accepted baseline: Checkpoint 9.

Latest submitted checkpoint: Checkpoint 9. Checkpoint 9 is accepted as the
current baseline, including the washington-multi-pet.md relatedSlugs fix folded
into the Checkpoint 8 baseline before acceptance.

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
- The pre-launch hardcoded gtag.js blocker has been resolved via Option B:
  site-wide GA4 pageview tracking is gated behind `PUBLIC_GA4_MEASUREMENT_ID`,
  which is unset by default and must be set in Cloudflare Pages production
  environment to activate.
- `src/lib/analytics.ts` outbound-click provider branches remain mutually
  exclusive: Plausible is the default path, `ga4` is opt-in, and `none` disables
  outbound-click analytics.

## Current Content Baseline

- There are 36 content entries across the seven collections.
- Thirty-three content entries are currently `noindex: false`; the remaining 3
  content entries are `noindex: true`.
- Checkpoint 9 flipped the final six real-candidate entries from the priority list
  to `noindex: false`.
- Checkpoint 9 added sourced carrier-specific factual details to the carrier-review
  and comparison pages it flipped, per the Checkpoint 8 gate requirement.
- Checkpoint 9 did not modify `src/pages/[slug].astro`, disclosure logic,
  `/go/[carrier]`, `astro.config.mjs`, or `scripts/validate-content.mjs`.
- Dog/cat breed, condition, comparison, and obvious species-specific carrier/blog
  pages use `dog-insurance-guide` or `cat-insurance-guide` as `pillarSlug`.
- Generic state/general pages remain on `pet-insurance-guide`.
- Content entries include `pillarSlug` and/or `relatedSlugs` relationships to
  support internal linking.

## Indexable Content Pages

These thirty-three content pages are currently `noindex: false`:

- `src/content/guide/pet-insurance-guide.md`
- `src/content/guide/dog-insurance-guide.md`
- `src/content/guide/cat-insurance-guide.md`
- `src/content/blog/does-pet-insurance-cover-dental.md`
- `src/content/blog/pet-insurance-before-surgery.md`
- `src/content/blog/switching-providers.md`
- `src/content/blog/just-adopted-puppy-insurance.md`
- `src/content/blog/multi-pet-discount.md`
- `src/content/blog/dental-texas.md`
- `src/content/condition/cruciate-ligament-waiting-period.md`
- `src/content/condition/hip-dysplasia.md`
- `src/content/condition/dog-allergies.md`
- `src/content/condition/senior-cats-cancer.md`
- `src/content/condition/emergency-vet-visits.md`
- `src/content/condition/pre-existing-french-bulldogs.md`
- `src/content/breed/french-bulldog.md`
- `src/content/breed/german-shepherd-hip-dysplasia.md`
- `src/content/breed/golden-retriever-hip-dysplasia.md`
- `src/content/breed/labrador-allergies.md`
- `src/content/breed/maine-coon-hereditary-conditions.md`
- `src/content/breed/senior-dogs-texas.md`
- `src/content/carrier-review/embrace-cost-review.md`
- `src/content/carrier-review/lemonade-cats-review.md`
- `src/content/carrier-review/trupanion-dogs-review.md`
- `src/content/comparison/healthy-paws-vs-embrace-dogs.md`
- `src/content/comparison/lemonade-vs-spot-cats.md`
- `src/content/comparison/pets-best-vs-metlife-senior-dogs.md`
- `src/content/state/california.md`
- `src/content/state/colorado-emergency-vet.md`
- `src/content/state/florida-cheapest.md`
- `src/content/state/new-york-dental.md`
- `src/content/state/texas.md`
- `src/content/state/washington-multi-pet.md`

## Checkpoint 9 Pages Flipped To noindex:false

- `src/content/carrier-review/embrace-cost-review.md` — Expanded from a placeholder
  into an Embrace cost-research page with sourced Embrace-specific mechanics:
  annual deductible, annual limit, reimbursement rate, and state-specific
  orthopedic waiting-period guidance from Embrace public plan/help materials.
- `src/content/carrier-review/trupanion-dogs-review.md` — Expanded with
  Trupanion-specific mechanics: lifetime per-condition deductible, VetDirect Pay,
  and no annual/lifetime payout cap positioning from Trupanion public FAQ and dog
  insurance materials.
- `src/content/comparison/healthy-paws-vs-embrace-dogs.md` — Expanded with sourced
  provider-specific comparison points: Healthy Paws waiting-period and hip
  dysplasia timing language, plus Embrace annual-deductible and waiting-period
  mechanics from provider FAQ/help materials.
- `src/content/comparison/pets-best-vs-metlife-senior-dogs.md` — Expanded with
  sourced provider-specific senior-dog comparison points: Pets Best no-upper-age
  enrollment language and MetLife accident/illness waiting-period plus
  pre-existing-condition wording from provider public materials.
- `src/content/breed/senior-dogs-texas.md` — Expanded into a Texas senior-dog
  records, eligibility, availability, and quote-flow boundary page.
- `src/content/condition/pre-existing-french-bulldogs.md` — Expanded into a
  French Bulldog pre-existing-condition records/timeline page without medical
  predictions, fake rankings, or unsupported coverage promises.

## Remaining noindex:true Content Pages

- `src/content/carrier-review/sample-partner.md`
- `src/content/comparison/sample-vs-example.md`
- `src/content/comparison/sample-vs-example-cats.md`

Note: `sample-vs-example.md` and `sample-vs-example-cats.md` are fictional
template-validation placeholders and should stay `noindex: true` indefinitely
unless the owner replaces them with real carrier content.

Open owner question: confirm whether `src/content/carrier-review/sample-partner.md`
is also a permanent placeholder tied to the placeholder `sample` affiliate offer, or
whether it is a real carrier slot awaiting replacement content. Do not propose
flipping `sample-partner.md` in a future checkpoint until the owner answers this.

## Live Child Counts

- `dog-insurance-guide`: 13 live children.
- `cat-insurance-guide`: 4 live children.

## Current Template Baseline

- `src/pages/[slug].astro` renders all seven collections as flat URLs.
- Checkpoint 9 did not modify `src/pages/[slug].astro`.
- Rendered content pages include canonical URL support, breadcrumb JSON-LD,
  Article JSON-LD, and FAQPage JSON-LD when FAQ entries exist.
- The "Related Guides" pillar link resolves the actual guide entry title from the
  `guide` collection by matching `entry.id === entry.data.pillarSlug`.
- If a pillar guide entry cannot be found, the template falls back to a humanized
  version of the `pillarSlug`.
- Carrier-review pages must not use `Review`, `Product`, `Rating`, or
  `AggregateRating` JSON-LD unless a future legal/compliance review explicitly
  approves a compliant approach.
- Monetized pages render `DisclosureBanner` before affiliate-linked content.
- `BaseLayout` renders the site-wide footer on every page.
- Footer includes the "not an insurance agency" disclaimer.
- `BaseLayout` renders the GA4 pageview tag only when
  `PUBLIC_GA4_MEASUREMENT_ID` is set; there is no committed hardcoded GA4
  measurement ID in the layout.
- `src/pages/privacy-policy.astro` discloses optional site-wide analytics via a
  third-party analytics provider, including GA4, alongside outbound
  affiliate-click measurement.

## Checkpoint 9 Verification

- `npm run prepare-content-index` passed.
- Content validation result: 36 content slugs across 7 collections.
- Noindex paths written: 3.
- `npm run build` passed.
- Astro check result: 0 errors, 0 warnings, 0 hints.
- Built HTML pillar-link checks passed for every newly indexable page.
- Built carrier-review/comparison HTML was checked for absence of `Review`,
  `Product`, `Rating`, and `AggregateRating` JSON-LD types.

## Pre-Launch Deployment Status

- The gtag.js / GA4 compliance fix was the last pre-launch merge blocker.
- The site is clear for first production deployment pending the owner's
  Cloudflare Pages production environment setup.
- To activate site-wide GA4 pageview tracking in production, set
  `PUBLIC_GA4_MEASUREMENT_ID` in Cloudflare Pages production environment.
- Do not set `GA4_API_SECRET` unless the owner separately decides to switch
  outbound-click tracking from the default Plausible path to
  `ANALYTICS_PROVIDER=ga4`.

## Review Posture for Next Checkpoint

For the next prompt to Codex, keep focusing on:

- Content-quality safeguards before any additional page moves to `noindex: false`.
- The owner decision on whether `sample-partner.md` is a permanent placeholder or a
  real carrier slot awaiting replacement.
- No fake reviews, fake ratings, urgency mechanics, or unsourced numeric claims.
- No on-site quote, application, purchase, or insurance-sales flow.
- Strong affiliate disclosure placement on every monetized page.
- Internal linking and canonical/noindex/sitemap behavior.
- Keeping `/go/[carrier]` measurable and auditable as the conversion event.
