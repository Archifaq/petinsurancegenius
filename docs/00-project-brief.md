# Project Brief — US Pet Insurance SEO/Affiliate Site

## 1. What this project is
An Astro-built, content/SEO-driven website targeting US pet owners searching for pet
insurance information, comparisons, and quotes. The site does **not** sell insurance
directly and is **not** an insurance agency — it monetizes purely through affiliate
partnerships with pet insurance carriers and comparison platforms (CPS/CPL/CPA links).

Working domain assumption: **petinsurancegenius.com** (previously owned by a company
selling pet/animal insurance in the US). If the actual domain differs, replace it
throughout these files before handing them to Codex — the SEO/legal logic doesn't change,
only the literal string.

## 2. Business model
- 100% affiliate monetization. No direct insurance sales, no lead-selling to agents
  unless a specific program is explicitly chosen later (this changes the legal picture —
  see `04-legal-compliance-checklist.md`).
- Revenue per visitor is low-probability/high-value (a single converted policy pays
  $20–$125+ one-time or a % of premium), so the site's job is to rank for a **large
  number of long-tail, low-competition queries** rather than chase 2–3 head terms like
  "pet insurance" (which are dominated by Policygenius, NerdWallet, Forbes Advisor,
  MarketWatch, Pawlicy Advisor, and the carriers themselves and are not realistically
  winnable by a new site).
- This is explicitly an **experiment / test project** (per the owner) — the plan should
  favor fast iteration, low build cost, and measurable SEO signals over a large upfront
  build.

## 3. Why this niche (market snapshot, 2026)
- The global pet insurance market is large and still growing at roughly ~15–30%/yr
  depending on the source, with the US as the biggest market.
- Established players affiliates commonly promote: Healthy Paws, Embrace, Trupanion,
  Fetch, ASPCA Pet Health Insurance, Lemonade, Spot, Pets Best, MetLife, Progressive
  (via Pets Best), Figo, and comparison layers like The Swiftest, Pawlicy Advisor,
  Policygenius.
- Typical affiliate terms seen in research (verify current terms before launch — they
  change often): flat fee per lead/sale roughly $20–$40 (e.g. Embrace-style flat fee),
  percentage models around 8–10%, comparison-platform programs reportedly paying up to
  ~$125/conversion (e.g. The Swiftest), cookie windows commonly 30–90 days.
- Competition for head terms is dominated by large media/finance sites (NerdWallet,
  Forbes Advisor, MarketWatch Guides, U.S. News) and category leaders (Policygenius,
  Pawlicy Advisor). A new/expired domain has no realistic path to rank for "pet
  insurance" or "best pet insurance" in a reasonable timeframe. The plan below is built
  around **long-tail and local intent** instead.

## 4. Domain history — risks to flag to the owner before build starts
This is a reused/expired domain that previously belonged to a real pet-insurance-related
company. Before Codex starts building content on it, the owner (not Codex) should verify:

1. **Trademark risk in the name itself.** "___ Genius" is a live naming pattern used by
   a real, litigious-adjacent insurance brand (Policygenius). A name combining
   "Pet Insurance" + "Genius" is close enough to that naming convention that it's worth
   a basic USPTO TESS trademark search and a gut-check with a lawyer before heavy
   investment, even though the domain itself may be generic/descriptive.
2. **Backlink/reputation inheritance.** Check the domain's backlink profile (Ahrefs/
   Majestic/Semrush) and Wayback Machine history for: prior spam links, prior penalties,
   prior unrelated content (parking pages, adult content, pharma spam), and whether
   Google still has "residual trust" or a manual action shadow on it. A clean pivot in
   the same vertical (pet insurance → pet insurance) is one of the *better* cases for
   reusing a domain, but it still needs a backlink audit (disavow if needed) before
   investing in content.
3. **Trailing legal obligations.** If the previous owner had live insurance-producer
   licenses, state filings, or contracts tied to that exact domain/brand name, make sure
   none of that transfers unintentionally (it normally doesn't with a domain purchase
   alone, but confirm there's no leftover WHOIS/legal entity linkage implying
   affiliation with the old company).

None of this blocks Codex from building the Astro codebase — it's a parallel owner-side
check. Flag it once, then proceed.

## 5. Target audience
- US pet owners (dog/cat primarily; some exotic/other) actively researching insurance:
  new pet owners, owners facing a vet bill, owners whose current premium just rose,
  owners comparing providers by breed/condition/state.
- Intent tiers: (a) informational ("does pet insurance cover X"), (b) commercial
  investigation ("best pet insurance for [breed/state/condition]"), (c) transactional
  ("[carrier] pet insurance quote/review/cost").

## 6. Success metrics for the experiment
- Indexed pages and impressions growth in Google Search Console (leading indicator).
- Ranking movement on long-tail clusters within 60–120 days.
- Click-through to affiliate offers (not just rankings) — track outbound clicks as the
  real KPI, since traffic without clicks is worthless in this model.
- Because it's an experiment, define a kill/scale decision point in advance (e.g., "if
  no meaningful indexed growth by month 3, stop"; "if outbound CTR on published clusters
  clears X%, scale content production").

## 7. Roles in this workflow
- **Codex**: writes and maintains the actual Astro codebase, content pipeline, and
  on-page SEO implementation, following `02-technical-spec.md` and
  `03-codex-master-prompt.md`.
- **Claude (this assistant)**: reviews Codex's output for correctness, SEO soundness,
  and compliance against `04-legal-compliance-checklist.md`; helps plan keyword
  batches from `01-keyword-strategy.md`; acts as the human-in-the-loop verifier before
  content ships.
