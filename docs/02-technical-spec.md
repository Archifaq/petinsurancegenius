# Technical Spec — Astro Build

## 1. Stack
- **Framework**: Astro (static-first / hybrid SSR only where genuinely needed, e.g. a
  cost estimator widget). Default to static generation for SEO pages — fastest,
  cheapest, easiest to reason about for Core Web Vitals.
- **Content**: Astro Content Collections, Markdown/MDX, schema-validated frontmatter
  (Zod) per collection (guide, breed, state, condition, carrier-review, comparison,
  blog).
- **Styling**: minimal, fast-loading. No heavy UI framework needed for content pages.
- **Hosting**: static hosting/CDN (Netlify/Vercel/Cloudflare Pages — pick one and note
  it, since deploy config differs).
- **Analytics**: privacy-conscious analytics (e.g. Plausible/GA4) + outbound-link click
  tracking on every affiliate link (this is the real conversion proxy metric).

## 2. Content model (Content Collections)
Each collection needs, at minimum:
- `title`, `metaDescription`, `slug`, `publishDate`, `updatedDate`
- `noindex: boolean` (default false; true for thin/auto-generated pages not ready to
  rank — see keyword strategy §6)
- `canonicalUrl` (optional override)
- `faq: [{question, answer}]` (feeds FAQPage schema when present)
- Collection-specific fields: `breed`, `state`, `condition`, `carrier` as applicable
- `affiliateOffers: [{carrierName, url, disclosureRequired: true, network}]`

## 3. On-page SEO requirements (every page)
- Unique `<title>` and meta description per page (no template-only titles).
- Single `<h1>` matching primary intent; logical `h2`/`h3` structure.
- Structured data via JSON-LD: `Article` or `FAQPage` where relevant; `BreadcrumbList`
  site-wide; **do not** use `Product`/`Review`/aggregate `Rating` schema for insurance
  carriers unless you have genuine, disclosed first-party review data — fabricated
  review/rating schema is a Google spam-policy violation and a consumer-protection risk
  in an insurance context.
- Canonical tags on every page (self-referencing by default).
- `robots.txt` and dynamically generated `sitemap.xml` (exclude `noindex` pages from
  the sitemap).
- Open Graph / Twitter card tags for shareability (secondary priority).
- Internal linking implemented as described in `01-keyword-strategy.md` §4 — pillar/
  cluster links should be real `<a>` tags in content, not JS-only navigation.

## 4. Performance / Core Web Vitals
- Ship minimal JS; the estimator/calculator widget should be the only interactive
  island (Astro islands architecture — hydrate only that component).
- Optimize images (Astro's built-in image optimization, `astro:assets`), lazy-load
  below-the-fold images, serve modern formats (WebP/AVIF).
- Target: LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile 4G throttling.
- No render-blocking third-party scripts above the fold; load analytics/ad/affiliate
  tracking scripts async/deferred.

## 5. Affiliate link handling
- Route all outbound affiliate links through an internal redirect
  (`/go/[carrier-slug]`) that: (a) logs the click for analytics, (b) applies
  `rel="sponsored noopener"` semantics conceptually even though the visible link is
  same-origin, (c) makes it trivial to update/rotate the underlying affiliate URL in
  one place when a program's link changes, without touching every content page.
- Any link that goes **directly** to a partner (not through `/go/`) must carry
  `rel="sponsored nofollow noopener"`.
- Every page containing affiliate links needs the FTC disclosure component (see
  `04-legal-compliance-checklist.md`) rendered above the fold, not just in a footer.

## 6. Page templates to build first (MVP)
1. Homepage (hub linking to pillars)
2. 4–6 pillar pages (dog/cat/cost/state-hub/etc.)
3. Breed page template (data-driven from `breed` collection)
4. State page template (data-driven from `state` collection, includes the "not
   available/licensed in all states" style disclaimer content genuinely relevant per
   state)
5. Carrier review page template
6. Comparison ("X vs Y") page template
7. Blog/informational article template
8. `/go/[carrier]` redirect handler
9. Simple cost-estimator island (illustrative estimate only, clearly labeled as an
   estimate, not a quote — real quotes must go to the carrier/comparison partner)

## 7. What Codex should NOT do without explicit sign-off
- Do not invent/publish specific numeric claims (average costs, coverage percentages,
  claim-approval rates) without a citable source; use ranges and cite sources in text
  where real data is used.
- Do not create fake reviews, fake testimonials, or fake "X people bought this today"
  urgency widgets.
- Do not scrape/copy carrier marketing copy verbatim — write original comparative
  content.
- Do not remove or shrink the affiliate disclosure component to "improve" conversion
  rate — that's a compliance requirement, not a UX preference (see legal checklist).
