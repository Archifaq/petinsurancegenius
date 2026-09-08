# Checkpoint 7 Review Pack

Third content-quality review pass. Checkpoint 6 review pack is the baseline for these changes.

## Scope Guard

- Did not modify the 13 pages already noindex:false before Checkpoint 7.
- Did not modify src/pages/[slug].astro.
- Did not touch affiliate disclosure logic, /go/[carrier], or the validator.
- Did not add fake reviews, ratings, testimonials, urgency mechanics, on-site quote flows, or unsourced numeric claims.
- Did not flip template-validation placeholder pages such as pet-insurance-for-cats-sample-vs-example.

## Build Output Summary

```text
Validated 36 content slugs across 7 collections.
Wrote 17 noindex path(s) to .astro/noindex-paths.json.

Result (15 files):
- 0 errors
- 0 warnings
- 0 hints

[build] Complete!
```

## Pages Switched to noindex:false

- src/content/breed/maine-coon-hereditary-conditions.md — Cat pillar priority. Expanded from a one-paragraph placeholder into a Maine Coon-specific hereditary/congenital policy checklist with timing guidance and a forward pointer to Cat Insurance Guide. No claims that Maine Coons will have any specific condition, no affiliate offer, no numeric claims.
- src/content/comparison/lemonade-vs-spot-cats.md — Cat pillar priority. Reframed as question-based policy comparison rather than a ranked winner. Explicitly avoids stars, scores, and universal best-provider claims while covering dental, wellness, hereditary, senior-cat, and state-availability checks.
- src/content/carrier-review/lemonade-cats-review.md — Cat pillar priority. Carrier-specific but safe enough because it is not monetized, does not use Review/Rating schema, does not score Lemonade, and clearly limits itself to verification questions cat owners should ask in provider documents.
- src/content/breed/labrador-allergies.md — Dog/breed-condition long-tail page. Expanded with Labrador-specific chronic allergy research framing, symptom timing, prescription/specialist language, and a forward pointer to the broader dog allergies guide.
- src/content/blog/dental-texas.md — State + dental long-tail page. Expanded with Texas-specific availability language and a concrete question list separating dental injury, dental illness, routine care, and provider-state availability.
- src/content/state/new-york-dental.md — State + dental long-tail page. Expanded with New York availability caveat and a self-built comparison-table workflow, giving it a distinct structure from the Texas dental page.

## Rhetorical Structure Variation

- Maine Coon page uses a checklist plus a forward pointer.
- Lemonade vs Spot uses question-based comparison and ends on a restated comparison question.
- Lemonade cats review uses Verify / Avoids / Use sections and ends with a workflow pointer.
- Labrador allergies uses Core Question / Breed Context and ends by pointing to the broader dog allergies guide.
- Texas dental uses a state-specific starting point plus a written question list.
- New York dental uses context reading plus a do-it-yourself comparison table.

## Updated Live Child Counts

- dog-insurance-guide: 5 live children.
- cat-insurance-guide: 4 live children.

## Built HTML Pillar-Link Verification

- /pet-insurance-for-maine-coons-hereditary-conditions/ renders Cat Insurance Guide -> /cat-insurance-guide/
- /lemonade-vs-spot-for-cats/ renders Cat Insurance Guide -> /cat-insurance-guide/
- /lemonade-pet-insurance-review-for-cats/ renders Cat Insurance Guide -> /cat-insurance-guide/
- /pet-insurance-for-labradors-with-allergies/ renders Dog Insurance Guide -> /dog-insurance-guide/
- /does-pet-insurance-cover-dental-in-texas/ renders Pet Insurance Guide -> /pet-insurance-guide/
- /does-pet-insurance-cover-dental-in-new-york/ renders Pet Insurance Guide -> /pet-insurance-guide/

## Changed Files

## docs/claude-project/CURRENT_PROJECT_STATE.md

```markdown
# Current Project State for Claude

Latest accepted baseline: Checkpoint 5 plus the follow-up
`src/pages/[slug].astro` / `hip-dysplasia.md` fix.

Latest submitted checkpoint: Checkpoint 7. Use `CHECKPOINT_7_REVIEW_PACK.md`
to review the new changes before treating them as accepted.

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
- Nineteen content entries are currently `noindex: false`; the remaining 17
  content entries are `noindex: true`.
- Checkpoint 7 flips six additional content entries to `noindex: false`, with
  priority on strengthening the `cat-insurance-guide` cluster.
- Dog/cat breed, condition, comparison, and obvious species-specific carrier/blog
  pages use `dog-insurance-guide` or `cat-insurance-guide` as `pillarSlug`.
- Generic state/general pages remain on `pet-insurance-guide`.
- Content entries include `pillarSlug` and/or `relatedSlugs` relationships to
  support internal linking.

## Indexable Content Pages

These nineteen content pages are currently `noindex: false`:

- `src/content/guide/pet-insurance-guide.md` — Core pillar page expanded from a
  placeholder into a general comparison framework covering policy mechanics,
  pre-existing condition timing, species branching, and non-agency language.
- `src/content/guide/dog-insurance-guide.md` — Dog-specific hub expanded with
  timing, orthopedic, breed-context, and boundary sections.
- `src/content/guide/cat-insurance-guide.md` — Cat-specific hub expanded with
  chronic illness, dental, senior-cat, policy-reading-order, and boundary sections.
- `src/content/blog/does-pet-insurance-cover-dental.md` — Evergreen informational
  explainer distinguishing dental injury, dental illness, routine cleanings, and
  wellness add-ons without unsupported coverage promises.
- `src/content/blog/pet-insurance-before-surgery.md` — High-intent trigger-event
  page focused on timing, pre-existing condition risk, waiting periods, and urgent
  care caveats without quote or solicitation behavior.
- `src/content/blog/switching-providers.md` — Policy-transition guide explaining
  record review, coverage gaps, and waiting-period resets without provider rankings.
- `src/content/blog/just-adopted-puppy-insurance.md` — New-puppy informational
  page with a distinct research sequence, wellness-vs-accident/illness separation,
  and care-first caveat.
- `src/content/blog/multi-pet-discount.md` — Cost-intent informational page that
  avoids cheapest-provider claims and instead compares household structure,
  deductibles, species differences, renewal pricing, and eligibility.
- `src/content/blog/dental-texas.md` — Texas dental coverage explainer separating
  dental injury, dental illness, routine care, and state-specific availability
  checks without claiming any provider is cheapest or guaranteed.
- `src/content/condition/cruciate-ligament-waiting-period.md` — Dog/orthopedic
  condition page covering cruciate/CCL terminology, bilateral-condition language,
  timing caveats, and policy-review questions.
- `src/content/condition/hip-dysplasia.md` — Dog condition page with orthopedic,
  hereditary, pre-existing-condition, waiting-period, and breed-context guidance.
- `src/content/condition/dog-allergies.md` — Dog-specific chronic-condition page
  covering symptom timing, medication language, specialist care, breed context, and
  better comparison questions.
- `src/content/condition/senior-cats-cancer.md` — Senior-cat condition page using
  a checklist structure around age eligibility, prior symptoms, diagnostics,
  specialist care, medication, and renewal terms.
- `src/content/condition/emergency-vet-visits.md` — Mixed-species emergency-care
  explainer with a scenario-led structure, future-planning policy terms, and a
  clear emergency-care boundary.
- `src/content/breed/labrador-allergies.md` — Labrador allergy page using a
  breed-specific angle to explain chronic symptom timing, dermatology/prescription
  language, and links back to the broader dog allergies guide.
- `src/content/breed/maine-coon-hereditary-conditions.md` — Maine Coon hereditary
  conditions page with a cat-specific checklist and timing guidance; strengthens
  the cat pillar cluster.
- `src/content/carrier-review/lemonade-cats-review.md` — Cat-focused carrier
  research page that explicitly avoids scores, testimonials, Review schema, and
  pricing claims while organizing verification questions.
- `src/content/comparison/lemonade-vs-spot-cats.md` — Cat carrier-comparison page
  framed as policy-reading questions, not rankings or star ratings.
- `src/content/state/new-york-dental.md` — New York dental coverage explainer with
  state availability language and a practical comparison-table workflow.

## Live Child Counts

- `dog-insurance-guide`: 5 live children.
- `cat-insurance-guide`: 4 live children.

## Current Template Baseline

- `src/pages/[slug].astro` renders all seven collections as flat URLs.
- Checkpoint 7 did not modify `src/pages/[slug].astro`.
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

## Checkpoint 7 Verification

- `npm run prepare-content-index` passed.
- Content validation result: 36 content slugs across 7 collections.
- Noindex paths written: 17.
- `npm run build` passed.
- Astro check result: 0 errors, 0 warnings, 0 hints.
- Built HTML pillar-link checks passed for every newly indexable page:
  - `/pet-insurance-for-maine-coons-hereditary-conditions/` renders
    `Cat Insurance Guide` → `/cat-insurance-guide/`.
  - `/lemonade-vs-spot-for-cats/` renders `Cat Insurance Guide` →
    `/cat-insurance-guide/`.
  - `/lemonade-pet-insurance-review-for-cats/` renders `Cat Insurance Guide` →
    `/cat-insurance-guide/`.
  - `/pet-insurance-for-labradors-with-allergies/` renders `Dog Insurance Guide`
    → `/dog-insurance-guide/`.
  - `/does-pet-insurance-cover-dental-in-texas/` renders `Pet Insurance Guide`
    → `/pet-insurance-guide/`.
  - `/does-pet-insurance-cover-dental-in-new-york/` renders
    `Pet Insurance Guide` → `/pet-insurance-guide/`.

## Review Posture for Next Checkpoint

For the next prompt to Codex, keep focusing on:

- Content-quality safeguards before any additional page moves to `noindex: false`.
- No fake reviews, fake ratings, urgency mechanics, or unsourced numeric claims.
- No on-site quote, application, purchase, or insurance-sales flow.
- Strong affiliate disclosure placement on every monetized page.
- Internal linking and canonical/noindex/sitemap behavior.
- Keeping `/go/[carrier]` measurable and auditable as the conversion event.
```

## src/content/breed/maine-coon-hereditary-conditions.md

```markdown
---
title: "Pet Insurance for Maine Coons and Hereditary Conditions"
metaDescription: "Review Maine Coon pet insurance questions around hereditary conditions, exclusions, and documentation timing."
slug: "pet-insurance-for-maine-coons-hereditary-conditions"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "cat-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-senior-cats-with-cancer"
  - "pet-insurance-for-cats-sample-vs-example"
  - "cat-insurance-guide"
breed: "Maine Coon"
species: "cat"
faq:
  - question: "Should Maine Coon owners ask about hereditary exclusions?"
    answer: "Yes. Owners should compare how each provider defines hereditary and congenital conditions before enrolling."
affiliateOffers: []
---

Maine Coon insurance research often starts with the word "hereditary," but the useful work is reading how each policy defines that word. Some policies group hereditary, congenital, chronic, and pre-existing condition language in different places.

## A Maine Coon Reading Checklist

- Hereditary and congenital condition definitions
- Waiting periods for illness coverage
- Exam-history or medical-record requirements
- Whether symptoms before enrollment affect eligibility
- How ongoing medication or specialist care is described
- Whether dental illness and routine dental care are separate

This checklist does not mean every Maine Coon will face the same health issues. It helps owners avoid comparing policies only by brand name when the actual terms may matter more.

## Why Timing Changes The Question

If a symptom, exam note, or treatment recommendation appears before enrollment, the provider may review that history later. That makes timing part of the comparison, especially for owners adopting an adult cat or switching providers.

For broader cat-specific policy questions, use the Cat Insurance Guide as the hub before moving into provider comparisons.
```

## src/content/comparison/lemonade-vs-spot-cats.md

```markdown
---
title: "Lemonade vs Spot for Cats"
metaDescription: "Compare Lemonade and Spot pet insurance questions for cat owners, including exclusions, add-ons, and availability."
slug: "lemonade-vs-spot-for-cats"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "cat-insurance-guide"
relatedSlugs:
  - "lemonade-pet-insurance-review-for-cats"
  - "pet-insurance-for-maine-coons-hereditary-conditions"
  - "cat-insurance-guide"
carriers:
  - "Lemonade"
  - "Spot"
faq:
  - question: "Does this comparison use rating schema?"
    answer: "No. It uses Article and FAQ structured data only when applicable."
affiliateOffers: []
---

Lemonade vs Spot for cats is best treated as a policy-reading comparison, not a winner-take-all ranking. The right answer depends on the cat's age, health history, state availability, and the current terms each provider publishes.

## Compare By Question, Not By Score

Start with the issues cat owners often care about: chronic illness, dental illness, routine wellness care, hereditary or congenital conditions, and how prior symptoms are reviewed. Then read each provider's sample policy and quote flow for the same categories.

This page does not assign stars or declare a universal best provider. That would require sourced, current, consistently collected evidence and would still need careful disclosure.

## Cat-Specific Areas To Check

Dental language can vary between accident-related dental care, illness-related dental care, and routine cleaning. Wellness add-ons, if offered, may not be the same as accident-and-illness coverage.

For older cats, review illness waiting periods, renewal terms, and whether the provider asks for recent veterinary records. For breed-specific questions, compare how hereditary and congenital wording appears in the policy.

The better comparison question is: which provider's current terms fit this cat's age, records, state, and likely care needs?
```

## src/content/carrier-review/lemonade-cats-review.md

```markdown
---
title: "Lemonade Pet Insurance Review for Cats"
metaDescription: "Review Lemonade pet insurance questions for cat owners, including exclusions, add-ons, and direct term verification."
slug: "lemonade-pet-insurance-review-for-cats"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "cat-insurance-guide"
relatedSlugs:
  - "lemonade-vs-spot-for-cats"
  - "pet-insurance-for-senior-cats-with-cancer"
  - "cat-insurance-guide"
carrier: "Lemonade"
faq:
  - question: "Does this review include star ratings?"
    answer: "No. This placeholder does not publish ratings, testimonials, or review schema."
affiliateOffers: []
---

This Lemonade cat insurance page is a research aid, not a scored review. It organizes the questions a cat owner should answer before leaving for any provider quote flow or relying on a third-party comparison.

## What Cat Owners Should Verify

Look for current language on illness coverage, dental illness, optional wellness benefits, hereditary or congenital conditions, waiting periods, exclusions, and state availability. If a cat has existing symptoms or a long medical record, pre-existing condition definitions deserve extra attention.

## What This Page Avoids

It does not publish star ratings, testimonials, review schema, or a made-up score. It also does not quote Lemonade pricing, because pricing depends on provider-controlled inputs and current filings or terms.

## How To Use The Page

Read this alongside the Cat Insurance Guide and the Lemonade vs Spot cat comparison. The goal is to make the provider's own documents easier to inspect, not to replace them.
```

## src/content/breed/labrador-allergies.md

```markdown
---
title: "Pet Insurance for Labradors With Allergies"
metaDescription: "Learn what Labrador owners should check when comparing pet insurance for allergies, chronic care, and exclusions."
slug: "pet-insurance-for-labradors-with-allergies"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-dogs-with-allergies"
  - "switching-pet-insurance-providers"
  - "dog-insurance-guide"
breed: "Labrador Retriever"
species: "dog"
faq:
  - question: "Why do chronic allergy terms matter?"
    answer: "Recurring symptoms may be reviewed differently depending on when they first appeared and how the policy defines ongoing conditions."
affiliateOffers: []
---

Labrador owners researching allergy-related coverage should focus less on the breed name and more on how the policy handles recurring symptoms. Allergies may involve repeated visits, medication, diet trials, dermatology referrals, or records that stretch across more than one appointment.

## The Core Coverage Question

Ask when the symptoms first appeared. If itching, ear infections, skin irritation, or digestive signs were documented before enrollment, a provider may review those notes under its pre-existing condition language.

After timing, read the sections on chronic illness, prescriptions, diagnostics, specialist care, and exclusions. A policy can sound broad while still limiting certain follow-up services.

## Why This Is Not Just A Labrador Page

The Labrador angle makes the research concrete, but the method applies to any dog with recurring allergy symptoms. The value is in building a checklist that can be used against actual provider terms.

Next, compare this page with the broader dog allergies guide to separate breed-specific concerns from policy mechanics.
```

## src/content/blog/dental-texas.md

```markdown
---
title: "Does Pet Insurance Cover Dental in Texas?"
metaDescription: "Review dental coverage questions Texas pet owners should ask about illness, injury, routine care, and wellness add-ons."
slug: "does-pet-insurance-cover-dental-in-texas"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-texas"
  - "does-pet-insurance-cover-dental"
category: "Coverage"
faq:
  - question: "Are routine cleanings and dental illness the same thing?"
    answer: "No. They may appear in different policy sections or add-ons, so owners should read the provider terms."
affiliateOffers: []
---

Texas pet owners researching dental coverage should separate three ideas before comparing providers: dental injury, dental illness, and routine preventive care. Those categories may live in different parts of a policy.

## Texas-Specific Starting Point

Availability and terms can vary by provider and state, so a Texas page should not imply that every plan or add-on is available to every owner. Confirm the current Texas quote flow and policy documents directly with the provider.

Dental injury may be discussed with accident coverage. Dental illness may appear with illness coverage, exclusions, or waiting periods. Routine cleanings are often discussed through wellness or preventive-care language, if they are offered at all.

## Questions Worth Writing Down

- Does the policy distinguish dental injury from dental illness?
- Are routine cleanings part of a separate wellness option?
- Are there exclusions for known dental disease?
- Do waiting periods apply?
- Does the provider make the same terms available in Texas?

Use those answers to compare policy language first, then decide whether a provider quote is worth reviewing.
```

## src/content/state/new-york-dental.md

```markdown
---
title: "Does Pet Insurance Cover Dental in New York?"
metaDescription: "Learn what New York pet owners should check when comparing dental illness, dental injury, and wellness coverage terms."
slug: "does-pet-insurance-cover-dental-in-new-york"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "does-pet-insurance-cover-dental"
  - "does-pet-insurance-cover-dental-in-texas"
state: "New York"
stateAbbreviation: "NY"
availabilityNote: "Not all insurance products are available in New York. Availability and terms vary by provider. Confirm details directly with the insurance carrier."
faq:
  - question: "Is dental cleaning usually the same as dental illness coverage?"
    answer: "Not necessarily. Owners should compare accident, illness, and wellness language directly in each policy."
affiliateOffers: []
---

New York pet owners often search dental coverage as one topic, but policy documents may split it into several pieces. Dental injury, dental illness, and routine cleaning can have different eligibility rules.

## Read The Dental Section In Context

Do not stop at a marketing phrase that says dental is included or available. Check whether the policy is describing accident-related dental care, illness-related dental care, or a wellness add-on for routine cleanings.

State availability matters too. A provider's current New York terms, add-ons, and quote flow should be confirmed directly because not every insurance product is available in every state.

## A Simple Comparison Table To Build Yourself

For each provider, write down whether dental injury is addressed, whether dental illness is addressed, whether routine cleanings require a separate add-on, and whether exclusions mention pre-existing dental disease.

That home-built table is more useful than assuming all dental benefits mean the same thing.
```

