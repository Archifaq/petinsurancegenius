# Checkpoint 6 Review Pack

Second content-quality review pass. Checkpoint 5 plus 5b remained the accepted baseline before these changes.

## Scope Guard

- Did not modify src/pages/[slug].astro.
- Did not modify the six previously accepted noindex:false content bodies.
- Did not touch affiliate disclosure logic or /go/[carrier].
- Did not add fake reviews, ratings, testimonials, urgency mechanics, on-site quote flows, or unsourced numeric claims.

## Build Output Summary

```text
Validated 36 content slugs across 7 collections.
Wrote 23 noindex path(s) to .astro/noindex-paths.json.

Result (15 files):
- 0 errors
- 0 warnings
- 0 hints

[build] Complete!
```

## Pages Switched to noindex:false

- src/content/guide/dog-insurance-guide.md — Flipped to noindex:false after expansion because it is now a real dog-specific hub for already-live dog condition pages. It varies structure with Start With Timing / Breed Pages / Boundaries sections and avoids quotes, rankings, affiliate claims, or numeric claims.
- src/content/guide/cat-insurance-guide.md — Flipped to noindex:false after expansion because it is now a real cat-specific hub for live cat/dental condition context. It uses a policy-document reading order and boundary framing, not the same rhythm as dog guide.
- src/content/condition/dog-allergies.md — Flipped to noindex:false because it gives distinct chronic-condition guidance around symptom timing, medication language, specialist care, and breed context; no affiliate offers or provider rankings.
- src/content/condition/senior-cats-cancer.md — Flipped to noindex:false because it uses a senior-cat checklist structure around age eligibility, records, diagnostics, specialist care, medication, and renewal terms; no medical advice or claim promises.
- src/content/blog/just-adopted-puppy-insurance.md — Flipped to noindex:false because it is a clear life-stage trigger page with a distinct research sequence and wellness-vs-accident/illness separation; no solicitation or on-site quote path.
- src/content/blog/multi-pet-discount.md — Flipped to noindex:false because it handles cost intent safely by explaining household variables and discount caveats without naming a cheapest provider or inventing pricing claims.
- src/content/condition/emergency-vet-visits.md — Flipped to noindex:false because it gives scenario-led emergency/future-planning guidance with clear care-first boundaries and no coverage promise.

## Dog/Cat Pillar Decision

Dog Insurance Guide and Cat Insurance Guide are now flipped to noindex:false. Reasoning: after Checkpoint 5, multiple live or review-ready child pages already point to species pillars, and leaving the pillars noindexed while child condition pages are indexed weakens the hub-and-spoke architecture from keyword-strategy section 4. I expanded both pillars first so they are not thin placeholders. They remain informational hubs with no affiliate offers, no fake rankings, no quote flow, and no numeric claims.

## Built HTML Pillar-Link Verification

- /dog-insurance-guide/ renders Pet Insurance Guide -> /pet-insurance-guide/
- /cat-insurance-guide/ renders Pet Insurance Guide -> /pet-insurance-guide/
- /pet-insurance-for-dogs-with-allergies/ renders Dog Insurance Guide -> /dog-insurance-guide/
- /pet-insurance-for-senior-cats-with-cancer/ renders Cat Insurance Guide -> /cat-insurance-guide/
- /just-adopted-a-puppy-pet-insurance/ renders Dog Insurance Guide -> /dog-insurance-guide/
- /pet-insurance-for-multiple-pets-discount/ renders Pet Insurance Guide -> /pet-insurance-guide/
- /pet-insurance-for-emergency-vet-visits/ renders Pet Insurance Guide -> /pet-insurance-guide/

## Changed Files

## docs/claude-project/CURRENT_PROJECT_STATE.md

```markdown
# Current Project State for Claude

Latest accepted baseline: Checkpoint 5 plus the follow-up
`src/pages/[slug].astro` / `hip-dysplasia.md` fix.

Latest submitted checkpoint: second content-quality review pass. Use
`CHECKPOINT_6_REVIEW_PACK.md` to review the new changes before treating them as
accepted.

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
- Thirteen content entries are currently `noindex: false`; the remaining 23
  content entries are `noindex: true`.
- Checkpoint 5 added two species pillar pages:
  - `src/content/guide/dog-insurance-guide.md`
  - `src/content/guide/cat-insurance-guide.md`
- The second content-quality pass expands both species pillars and flips them to
  `noindex: false`.
- Dog/cat breed, condition, comparison, and obvious species-specific carrier/blog
  pages use `dog-insurance-guide` or `cat-insurance-guide` as `pillarSlug`.
- Generic state/general pages remain on `pet-insurance-guide`.
- Content entries include `pillarSlug` and/or `relatedSlugs` relationships to
  support internal linking.

## Indexable Content Pages

These thirteen content pages are currently `noindex: false`:

- `src/content/guide/pet-insurance-guide.md` — Core pillar page expanded from a
  placeholder into a general comparison framework covering policy mechanics,
  pre-existing condition timing, species branching, and non-agency language.
- `src/content/guide/dog-insurance-guide.md` — Dog-specific hub expanded with
  timing, orthopedic, breed-context, and boundary sections. It supports live dog
  condition pages and no longer reads as a thin placeholder.
- `src/content/guide/cat-insurance-guide.md` — Cat-specific hub expanded with
  chronic illness, dental, senior-cat, policy-reading-order, and boundary sections.
  It supports live cat condition content and no longer reads as a thin placeholder.
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
- `src/content/condition/cruciate-ligament-waiting-period.md` — Dog/orthopedic
  condition page covering cruciate/CCL terminology, bilateral-condition language,
  timing caveats, and policy-review questions.
- `src/content/condition/hip-dysplasia.md` — Dog condition page with orthopedic,
  hereditary, pre-existing-condition, waiting-period, and breed-context guidance.
  `species` is `dog` to match its dog-only body copy and dog pillar.
- `src/content/condition/dog-allergies.md` — Dog-specific chronic-condition page
  covering symptom timing, medication language, specialist care, breed context, and
  better comparison questions.
- `src/content/condition/senior-cats-cancer.md` — Senior-cat condition page using
  a checklist structure around age eligibility, prior symptoms, diagnostics,
  specialist care, medication, and renewal terms.
- `src/content/condition/emergency-vet-visits.md` — Mixed-species emergency-care
  explainer with a scenario-led structure, future-planning policy terms, and a
  clear emergency-care boundary.

## Current Template Baseline

- `src/pages/[slug].astro` renders all seven collections as flat URLs.
- The second content-quality pass did not modify `src/pages/[slug].astro`.
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

## Second Content-Quality Pass Verification

- `npm run prepare-content-index` passed.
- Content validation result: 36 content slugs across 7 collections.
- Noindex paths written: 23.
- `npm run build` passed.
- Astro check result: 0 errors, 0 warnings, 0 hints.
- Built HTML pillar-link checks passed for every newly indexable page:
  - `/dog-insurance-guide/` renders `Pet Insurance Guide` → `/pet-insurance-guide/`.
  - `/cat-insurance-guide/` renders `Pet Insurance Guide` → `/pet-insurance-guide/`.
  - `/pet-insurance-for-dogs-with-allergies/` renders `Dog Insurance Guide` →
    `/dog-insurance-guide/`.
  - `/pet-insurance-for-senior-cats-with-cancer/` renders `Cat Insurance Guide` →
    `/cat-insurance-guide/`.
  - `/just-adopted-a-puppy-pet-insurance/` renders `Dog Insurance Guide` →
    `/dog-insurance-guide/`.
  - `/pet-insurance-for-multiple-pets-discount/` renders `Pet Insurance Guide` →
    `/pet-insurance-guide/`.
  - `/pet-insurance-for-emergency-vet-visits/` renders `Pet Insurance Guide` →
    `/pet-insurance-guide/`.

## Review Posture for Next Checkpoint

For the next prompt to Codex, keep focusing on:

- Content-quality safeguards before any additional page moves to `noindex: false`.
- No fake reviews, fake ratings, urgency mechanics, or unsourced numeric claims.
- No on-site quote, application, purchase, or insurance-sales flow.
- Strong affiliate disclosure placement on every monetized page.
- Internal linking and canonical/noindex/sitemap behavior.
- Keeping `/go/[carrier]` measurable and auditable as the conversion event.
```

## src/content/guide/dog-insurance-guide.md

```markdown
---
title: "Dog Insurance Guide"
metaDescription: "Learn how to compare dog insurance by breed risks, waiting periods, orthopedic terms, exclusions, and provider quote flows."
slug: "dog-insurance-guide"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-hip-dysplasia"
  - "pet-insurance-for-dogs-with-allergies"
  - "just-adopted-a-puppy-pet-insurance"
faq:
  - question: "Does dog insurance work the same for every breed?"
    answer: "No. Policy terms are provider-specific, and owners should pay close attention to hereditary, orthopedic, and pre-existing condition language for their dog's situation."
  - question: "Can this site give my dog a real quote?"
    answer: "No. Pet Insurance Genius is informational only. Real quotes and applications happen through the provider or partner site."
affiliateOffers: []
pillar: true
---

Dog insurance research often starts with a concrete worry: a puppy just came home, a dog has a breed-linked condition risk, or a veterinarian mentioned a problem that could become expensive later. This guide organizes those questions without ranking providers or generating on-site quotes.

## Start With Timing

Before comparing brands, dog owners should ask when symptoms first appeared and when coverage would actually begin. Waiting periods, exam-history requirements, and pre-existing condition definitions can matter more than the headline list of covered conditions.

For orthopedic issues, timing can be especially important. Hip dysplasia, cruciate ligament issues, bilateral condition clauses, and special waiting periods may be handled differently by different providers. Owners should read current policy documents and confirm terms directly before relying on coverage.

## Use Breed Pages As Question Lists

Breed pages should not be treated as medical predictions. A French Bulldog, Labrador, Golden Retriever, German Shepherd, or senior dog may raise different comparison questions, but eligibility and claim outcomes depend on the actual policy and veterinary record.

Good dog-insurance research usually asks whether hereditary conditions are eligible, how chronic symptoms are reviewed, whether prescriptions and specialist visits are addressed, and whether a new policy would treat old symptoms as pre-existing.

## What This Guide Does Not Do

This guide does not provide veterinary advice, produce quotes, or rank insurance companies. It is a hub for narrowing the next question before a dog owner reviews provider documents or leaves for a real quote flow.
```

## src/content/guide/cat-insurance-guide.md

```markdown
---
title: "Cat Insurance Guide"
metaDescription: "Learn how to compare cat insurance around chronic illness, hereditary conditions, dental terms, exclusions, and quote verification."
slug: "cat-insurance-guide"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-maine-coons-hereditary-conditions"
  - "pet-insurance-for-senior-cats-with-cancer"
  - "does-pet-insurance-cover-dental"
faq:
  - question: "Should indoor cat owners compare pet insurance?"
    answer: "They can, especially for illness, dental, emergency, and chronic-care questions. The right comparison depends on the cat's age, health history, and policy terms."
  - question: "Does this guide rank cat insurance providers?"
    answer: "No. It is a research hub and does not publish fabricated rankings, ratings, or testimonials."
affiliateOffers: []
pillar: true
---

Cat insurance comparisons can look different from dog insurance comparisons. Indoor status, age, dental history, chronic illness, and breed context can all change the questions an owner should ask before choosing a policy.

## Common Cat-Specific Questions

Cat owners often ask whether illness coverage addresses chronic conditions, whether dental illness is treated separately from routine cleaning, and how a provider reviews symptoms that appeared before enrollment. Those questions are more useful than trying to find a universal "best" provider.

Age and health history matter. Senior cat owners may need to confirm age eligibility, renewal terms, cancer-related exclusions, and whether prior symptoms in the veterinary record could affect future claims. Breed-specific pages, such as Maine Coon guides, should focus on policy language rather than implying a guaranteed medical outcome.

## A Policy-Document Reading Order

Start with exclusions, then waiting periods, then benefit categories. After that, look for annual limits, deductibles, reimbursement language, and whether wellness add-ons are separate from accident-and-illness coverage.

Dental coverage is a common source of confusion. Accident-related dental care, illness-related dental care, and routine wellness cleanings may be treated as separate benefits or add-ons. Owners should compare those terms directly in provider documents.

## Boundaries

This site is informational only. It does not sell insurance, decide claim eligibility, or publish fabricated rankings. Use this pillar as the cat-specific hub for breed, condition, and comparison research.
```

## src/content/condition/dog-allergies.md

```markdown
---
title: "Pet Insurance for Dogs With Allergies"
metaDescription: "Compare policy language for dogs with allergies, chronic symptoms, prescriptions, and pre-existing exclusions."
slug: "pet-insurance-for-dogs-with-allergies"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-labradors-with-allergies"
  - "switching-pet-insurance-providers"
  - "dog-insurance-guide"
condition: "Allergies"
species: "dog"
faq:
  - question: "Can allergy history affect future coverage?"
    answer: "A documented allergy history may matter depending on the policy's pre-existing condition language."
affiliateOffers: []
---

Dog allergy coverage questions are rarely about a single vet visit. They often involve recurring symptoms, medication, follow-up appointments, and the timing of when itching, ear infections, skin irritation, or digestive symptoms first appeared.

## What To Read First

Look for how the policy defines chronic conditions and pre-existing conditions. If allergy symptoms were documented before enrollment, the provider may review that history before deciding whether future care is eligible.

Medication language is another practical detail. Some policies may address prescription drugs, specialist visits, diagnostic testing, or ongoing treatment differently. Owners should compare those sections directly rather than assuming "illness coverage" means every allergy-related cost is handled the same way.

## Why Breed Context Helps

Breed-specific pages can make the research more concrete. A Labrador owner might compare dermatology and prescription language, while a French Bulldog owner might be thinking about allergy symptoms alongside other breed-related health questions. The policy review still depends on the individual dog and the active contract.

## A Better Comparison Question

Instead of asking only whether pet insurance "covers allergies," ask when symptoms began, what the vet record says, whether the condition is chronic, and which policy sections explain eligible follow-up care. That gives owners a more useful checklist before requesting a real provider quote.
```

## src/content/condition/senior-cats-cancer.md

```markdown
---
title: "Pet Insurance for Senior Cats With Cancer"
metaDescription: "Review senior cat insurance comparison questions around cancer, exclusions, age eligibility, and provider terms."
slug: "pet-insurance-for-senior-cats-with-cancer"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "cat-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-maine-coons-hereditary-conditions"
  - "lemonade-vs-spot-for-cats"
  - "cat-insurance-guide"
condition: "Cancer"
species: "cat"
faq:
  - question: "Should senior cat owners confirm age eligibility?"
    answer: "Yes. Enrollment and renewal terms can vary by provider and should be confirmed before applying."
affiliateOffers: []
---

Senior cat insurance research needs a calmer checklist than a generic provider comparison. Cancer-related questions can involve age eligibility, symptoms already in the veterinary record, diagnostics, specialist care, medication, and renewal terms.

## Questions To Ask Before Comparing Prices

- Is the cat currently eligible to enroll?
- Does the policy describe waiting periods for illness coverage?
- How does the provider define pre-existing symptoms or diagnoses?
- Are diagnostics, specialist visits, prescriptions, or ongoing treatment addressed in the sample policy?
- Are renewal terms different from initial enrollment terms?

Those questions do not predict whether a future claim will be approved. They simply help an owner read the policy with the right risk areas in mind.

## Why This Page Is Cat-Specific

Senior cats may have long veterinary histories, and those records can matter when a provider reviews future eligibility. Owners should avoid assuming that a newly purchased policy will address symptoms, tests, or recommendations that were already documented.

## What To Do With The Answer

If the policy language is unclear, ask the provider directly before applying. This page does not provide medical advice, sell insurance, or make a claim decision; it helps cat owners identify the terms worth confirming.
```

## src/content/blog/just-adopted-puppy-insurance.md

```markdown
---
title: "Just Adopted a Puppy: Pet Insurance Questions to Ask"
metaDescription: "Review pet insurance questions new puppy owners should ask about waiting periods, exclusions, and quote timing."
slug: "just-adopted-a-puppy-pet-insurance"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-waiting-period-for-cruciate-ligament"
  - "pet-insurance-before-surgery"
  - "dog-insurance-guide"
category: "New pets"
faq:
  - question: "Should puppy owners wait until something happens?"
    answer: "Waiting can affect eligibility for a future condition, so owners should compare terms before relying on coverage."
affiliateOffers: []
---

The first week with a puppy is busy, so insurance research should be simple and sequenced. The useful question is not whether a puppy "needs" insurance in the abstract; it is what should be compared before health history starts getting more complicated.

## First 30 Minutes Of Research

Start by gathering the puppy's adoption records, vaccination notes, and any exam paperwork. Then compare waiting periods, first-exam requirements, hereditary condition language, and what the policy says about symptoms that appear before coverage begins.

Puppy owners should also separate wellness care from accident-and-illness coverage. Routine vaccines, spay or neuter questions, dental cleaning, and preventive visits may be handled through optional wellness language rather than the core policy.

## What Can Wait

Deep carrier comparisons can wait until the owner understands the basic terms. Deductible, reimbursement, annual limit, exclusions, and waiting periods create the frame for any later provider decision.

## What Should Not Wait

If a puppy is already sick or injured, care decisions should go through a veterinarian first. Pet insurance research can support future planning, but it should not delay immediate care or create an assumption that a newly purchased policy will cover an existing issue.
```

## src/content/blog/multi-pet-discount.md

```markdown
---
title: "Pet Insurance for Multiple Pets Discount"
metaDescription: "Learn how to compare multi-pet insurance discounts without assuming a discount means the lowest total cost."
slug: "pet-insurance-for-multiple-pets-discount"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-multiple-pets-in-washington"
  - "pets-best-vs-metlife-for-senior-dogs"
category: "Cost"
faq:
  - question: "Is a multi-pet discount enough to choose a provider?"
    answer: "No. Owners should compare total terms, exclusions, and quote results, not only discount language."
affiliateOffers: []
---

Multi-pet discounts can be useful, but the discount is only one line in the comparison. A lower advertised percentage may still be a poor fit if the policies have different deductibles, exclusions, limits, or species-specific terms.

## Compare The Household, Not Just The Discount

A household with two young dogs has a different decision from a household with one senior cat and one puppy. Each pet may have a different age, health record, breed profile, and likely care pattern. A useful comparison keeps those differences visible.

## Separate These Variables

- Whether each pet gets a separate policy or shared billing only
- Whether deductibles apply separately
- Whether the discount changes renewal pricing
- Whether dog and cat terms differ
- Whether wellness add-ons are priced separately
- Whether a pet's prior symptoms affect eligibility

None of these details should be assumed from the phrase "multi-pet discount." Owners should confirm current terms directly with the provider.

## When The Cheapest Option Is Not Clear

The lowest monthly payment is not always the lowest-risk choice for a multi-pet household. It may trade off with reimbursement, annual limits, exclusions, or waiting periods. This page avoids naming a cheapest provider because real pricing depends on the pets and the provider quote flow.
```

## src/content/condition/emergency-vet-visits.md

```markdown
---
title: "Pet Insurance for Emergency Vet Visits"
metaDescription: "Learn what pet owners should compare for emergency vet visit coverage, waiting periods, and exam fee language."
slug: "pet-insurance-for-emergency-vet-visits"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-emergency-vet-visits-in-colorado"
  - "pet-insurance-before-surgery"
condition: "Emergency vet visit"
species: "multiple"
faq:
  - question: "Is emergency coverage immediate after enrollment?"
    answer: "Not always. Waiting periods and exclusions should be verified directly with the provider."
affiliateOffers: []
---

Emergency vet visit coverage is a timing question as much as a coverage question. Pet owners should separate care that is needed right now from insurance research for future events.

## A Practical Scenario

If a pet swallows something dangerous tonight, the immediate decision belongs with a veterinarian. Buying a policy after symptoms or an emergency begins may not make that incident eligible, and waiting periods may still apply.

For future planning, owners can compare how policies describe accidents, illnesses, emergency exam fees, diagnostics, hospitalization, prescriptions, and specialist or referral care. The policy may discuss those items in different sections.

## The Terms That Often Matter

Waiting periods tell owners when coverage can begin. Exclusions describe what the policy does not cover. Pre-existing condition language explains how earlier symptoms or records may be reviewed. Limits, deductibles, and reimbursement language shape what an eligible future bill might mean for the household.

## Keep The Boundary Clear

This page does not provide emergency advice or a coverage decision. It is a research checklist for pet owners comparing policies before a future emergency happens.
```

