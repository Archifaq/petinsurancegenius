# Checkpoint 5 Review Pack

Context: Checkpoint 4 was Approved. This pack covers the first content-quality review pass and species-pillar split.

## One-Line Confirmation

Cross-collection duplicate slug validation was not lost: scripts/validate-content.mjs still uses one shared Map across all seven collections, and this checkpoint adds pillarSlug/relatedSlugs existence validation on top of it.

## Verification

- npm run prepare-content-index: passed. Validated 36 content slugs across 7 collections. Wrote 30 noindex paths.
- npm run build: passed with 0 errors, 0 warnings, 0 hints.
- Sitemap now includes /, /advertising-disclosure/, and the six pages switched to noindex: false.
- relatedSlugs and pillarSlug references are validated by scripts/validate-content.mjs; unknown references fail validation/build.

## Pages Switched to noindex: false

- src/content/guide/pet-insurance-guide.md — Core pillar page; expanded from placeholder into a general comparison framework covering mechanics, pre-existing condition timing, species branching, and clear non-agency language. No affiliate offers, no provider rankings, no numeric claims.
- src/content/blog/does-pet-insurance-cover-dental.md — Informational evergreen explainer; now distinguishes dental injury, dental illness, routine cleaning, and wellness add-ons. No affiliate offers, no quotes, and no unsupported coverage promise.
- src/content/blog/pet-insurance-before-surgery.md — High-intent trigger-event page with unique timing value; focuses on pre-existing condition risk, waiting periods, and emergency-care priority without soliciting or promising coverage.
- src/content/blog/switching-providers.md — Unique policy-transition guidance; explains record review, coverage gaps, and waiting-period resets. No affiliate offers or provider rankings.
- src/content/condition/cruciate-ligament-waiting-period.md — Dog/orthopedic-specific condition page; expanded with cruciate/CCL terminology, bilateral-condition language, and timing caveats. No ratings, quotes, or carrier claims.
- src/content/condition/hip-dysplasia.md — Condition page with distinct orthopedic/hereditary/pre-existing framework and breed-context links. No medical advice, provider rankings, or invented numeric claims.

## New Pillar Pages

- src/content/guide/dog-insurance-guide.md — noindex: true pending a later content-quality review.
- src/content/guide/cat-insurance-guide.md — noindex: true pending a later content-quality review.

## Pillar Split

Relevant dog/cat breed, condition, comparison, and obvious species-specific carrier/blog pages now use dog-insurance-guide or cat-insurance-guide as pillarSlug. Generic state/general pages remain on pet-insurance-guide.

## Full Code

## package.json

```json
{
  "name": "petinsurancegenius.com",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "predev": "npm run prepare-content-index",
    "dev": "astro dev",
    "prepare-content-index": "astro sync && node scripts/validate-content.mjs",
    "prebuild": "npm run prepare-content-index",
    "build": "astro check && astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.0.0",
    "@astrojs/sitemap": "^3.3.1",
    "astro": "^5.13.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "devalue": "5.9.2",
    "typescript": "^5.9.2"
  }
}
```

## scripts/validate-content.mjs

```js
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse } from "devalue";

const contentStorePath = ".astro/data-store.json";
const noindexPathsPath = ".astro/noindex-paths.json";
const contentRoot = "src/content";
const collections = [
  "guide",
  "breed",
  "state",
  "condition",
  "carrier-review",
  "comparison",
  "blog"
];

if (!existsSync(contentStorePath)) {
  console.log(".astro/data-store.json not found, skipping validation.");
  process.exit(0);
}

const store = parse(readFileSync(contentStorePath, "utf8"));
const slugs = new Map();
const references = [];
const noindexPaths = [];
const errors = [];

function normalizedPath(slug) {
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

function getMarkdownFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

function readFrontmatter(filePath) {
  const contents = readFileSync(filePath, "utf8");
  const match = contents.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return {};
  }

  const frontmatter = {};
  let activeArray;

  for (const line of match[1].split("\n")) {
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    const arrayItemMatch = line.match(/^\s*-\s*["']?([^"']+)["']?\s*$/);

    if (activeArray && arrayItemMatch) {
      frontmatter[activeArray].push(arrayItemMatch[1].trim());
      continue;
    }

    if (!keyMatch) {
      continue;
    }

    const [, key, rawValue] = keyMatch;
    activeArray = undefined;

    if (rawValue.length === 0) {
      if (key === "relatedSlugs") {
        activeArray = key;
        frontmatter[key] = [];
      }
      continue;
    }

    const value = rawValue.replace(/^["']|["']$/g, "").trim();

    if (key === "slug" || key === "pillarSlug") {
      frontmatter[key] = value;
    }

    if (key === "noindex" && /^(true|false)$/.test(value)) {
      frontmatter.noindex = value === "true";
    }
  }

  return frontmatter;
}

for (const collection of collections) {
  const entries = store.get(collection);

  if (!(entries instanceof Map)) {
    errors.push(`Missing content collection in Astro content store: ${collection}`);
    continue;
  }

  for (const filePath of getMarkdownFiles(join(contentRoot, collection))) {
    const frontmatter = readFrontmatter(filePath);
    const slug = frontmatter.slug;

    if (typeof slug !== "string" || slug.length === 0) {
      errors.push(`Missing frontmatter slug in ${filePath}`);
      continue;
    }

    const previous = slugs.get(slug);
    if (previous) {
      errors.push(`Duplicate slug "${slug}" in ${previous} and ${filePath}`);
    } else {
      slugs.set(slug, filePath);
    }

    if (frontmatter.noindex !== false) {
      noindexPaths.push(normalizedPath(slug));
    }

    references.push({
      filePath,
      slug,
      pillarSlug: frontmatter.pillarSlug,
      relatedSlugs: frontmatter.relatedSlugs ?? []
    });
  }
}

for (const reference of references) {
  if (reference.pillarSlug && !slugs.has(reference.pillarSlug)) {
    errors.push(
      `Unknown pillarSlug "${reference.pillarSlug}" in ${reference.filePath}`
    );
  }

  for (const relatedSlug of reference.relatedSlugs) {
    if (relatedSlug === reference.slug) {
      errors.push(`Self-referential relatedSlug "${relatedSlug}" in ${reference.filePath}`);
    } else if (!slugs.has(relatedSlug)) {
      errors.push(`Unknown relatedSlug "${relatedSlug}" in ${reference.filePath}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Content validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

mkdirSync(dirname(noindexPathsPath), { recursive: true });
writeFileSync(noindexPathsPath, `${JSON.stringify([...new Set(noindexPaths)].sort(), null, 2)}\n`);
console.log(`Validated ${slugs.size} content slugs across ${collections.length} collections.`);
console.log(`Wrote ${noindexPaths.length} noindex path(s) to ${noindexPathsPath}.`);
```

## src/content.config.ts

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const collectionsDirectory = "./src/content";

const affiliateOfferSchema = z.object({
  carrierName: z.string(),
  carrierSlug: z.string(),
  disclosureRequired: z.literal(true),
  network: z.string()
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string()
});

function collectionLoader(collection: string) {
  const seenSlugs = new Map<string, string>();

  return glob({
    pattern: "**/*.md",
    base: `${collectionsDirectory}/${collection}`,
    generateId: ({ data, entry }) => {
      const slug = data.slug;

      if (typeof slug !== "string" || slug.length === 0) {
        throw new Error(`Missing frontmatter slug in ${collection}/${entry}`);
      }

      const previousEntry = seenSlugs.get(slug);
      if (previousEntry && previousEntry !== entry) {
        throw new Error(
          `Duplicate slug "${slug}" inside ${collection}: ${previousEntry} and ${entry}`
        );
      }

      seenSlugs.set(slug, entry);
      return slug;
    }
  });
}

const baseSchema = z.object({
  title: z.string(),
  metaDescription: z.string().min(50).max(160),
  // Astro reserves `slug` and strips it from `entry.data`; `glob().generateId`
  // uses frontmatter `slug` as `entry.id`, which is the flat URL source of truth.
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date(),
  noindex: z.boolean().default(true),
  canonicalUrl: z.string().url().optional(),
  pillarSlug: z.string().default("pet-insurance-guide"),
  relatedSlugs: z.array(z.string()).default([]),
  faq: z.array(faqSchema).default([]),
  affiliateOffers: z.array(affiliateOfferSchema).default([])
});

const guide = defineCollection({
  loader: collectionLoader("guide"),
  schema: baseSchema.extend({
    pillar: z.boolean().default(true)
  })
});

const breed = defineCollection({
  loader: collectionLoader("breed"),
  schema: baseSchema.extend({
    breed: z.string(),
    species: z.enum(["dog", "cat", "other"])
  })
});

const state = defineCollection({
  loader: collectionLoader("state"),
  schema: baseSchema.extend({
    state: z.string(),
    stateAbbreviation: z.string().length(2),
    availabilityNote: z
      .string()
      .default(
        "Not all insurance products are available in every state. Availability and terms vary by state and provider. Confirm details directly with the insurance carrier."
      )
  })
});

const condition = defineCollection({
  loader: collectionLoader("condition"),
  schema: baseSchema.extend({
    condition: z.string(),
    species: z.enum(["dog", "cat", "other", "multiple"]).default("multiple")
  })
});

const carrierReview = defineCollection({
  loader: collectionLoader("carrier-review"),
  schema: baseSchema.extend({
    carrier: z.string()
  })
});

const comparison = defineCollection({
  loader: collectionLoader("comparison"),
  schema: baseSchema.extend({
    carriers: z.array(z.string()).min(2)
  })
});

const blog = defineCollection({
  loader: collectionLoader("blog"),
  schema: baseSchema.extend({
    category: z.string()
  })
});

export const collections = {
  guide,
  breed,
  state,
  condition,
  "carrier-review": carrierReview,
  comparison,
  blog
};
```

## src/content/guide/pet-insurance-guide.md

```markdown
---
title: "Pet Insurance Guide"
metaDescription: "Learn how pet insurance works, what it may cover, and how to compare providers without treating estimates as real quotes."
slug: "pet-insurance-guide"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "dog-insurance-guide"
  - "cat-insurance-guide"
  - "pet-insurance-california"
  - "pet-insurance-before-surgery"
faq:
  - question: "Does this site sell pet insurance?"
    answer: "No. Pet Insurance Genius publishes general information and routes quote or purchase activity to third-party providers."
affiliateOffers: []
pillar: true
---

Pet insurance is easiest to compare when owners separate three questions: what type of problem might happen, when symptoms first appeared, and where the real policy terms will be confirmed. This guide is the general hub for that decision process.

Start with policy mechanics rather than brand slogans. Most pet insurance research comes down to deductibles, reimbursement percentage, annual limits, waiting periods, exclusions, and whether routine care is part of a separate wellness add-on. Those variables can change the usefulness of a policy even when two plans sound similar at a headline level.

Pre-existing condition language deserves special attention. A symptom, treatment note, or diagnosis documented before enrollment may affect future eligibility, so owners should compare policy definitions before assuming a later claim will be covered. This matters for orthopedic issues, allergies, dental illness, cancer, and surgery-related research.

Breed and species context matters too. Dog owners often need to look closely at orthopedic and hereditary wording, while cat owners may care more about chronic illness, dental language, and indoor-cat risk tradeoffs. Use the dog and cat guides as more specific hubs, then move into condition, state, and comparison pages when the question becomes narrower.

Pet Insurance Genius is an informational publisher, not an insurance agency. We do not produce binding quotes or sell policies on this site. When a page links to a provider or partner, the actual quote, availability, application, and purchase flow happens on the third-party site.
```

## src/content/guide/dog-insurance-guide.md

```markdown
---
title: "Dog Insurance Guide"
metaDescription: "Learn how to compare dog insurance by breed risks, waiting periods, orthopedic terms, exclusions, and provider quote flows."
slug: "dog-insurance-guide"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-guide"
  - "pet-insurance-hip-dysplasia"
  - "pet-insurance-for-dogs-with-allergies"
faq:
  - question: "Does dog insurance work the same for every breed?"
    answer: "No. Policy terms are provider-specific, and owners should pay close attention to hereditary, orthopedic, and pre-existing condition language for their dog's situation."
  - question: "Can this site give my dog a real quote?"
    answer: "No. Pet Insurance Genius is informational only. Real quotes and applications happen through the provider or partner site."
affiliateOffers: []
pillar: true
---

Dog insurance research often starts with breed, age, and the kinds of conditions that are most expensive or disruptive for a household to handle. This guide organizes those questions without ranking providers or generating on-site quotes.

For dogs, orthopedic wording is especially important. Hip dysplasia, cruciate ligament issues, bilateral condition clauses, and special waiting periods may be handled differently by different providers. Owners should read current policy documents and confirm terms directly before relying on coverage.

Breed pages should not be treated as medical predictions. A French Bulldog, Labrador, Golden Retriever, German Shepherd, or senior dog may raise different comparison questions, but eligibility and claim outcomes depend on the actual policy and veterinary record.

Use this pillar to move into dog-specific condition pages, breed pages, and comparisons. Pages remain noindexed until their body copy is reviewed for distinct, useful detail.
```

## src/content/guide/cat-insurance-guide.md

```markdown
---
title: "Cat Insurance Guide"
metaDescription: "Learn how to compare cat insurance around chronic illness, hereditary conditions, dental terms, exclusions, and quote verification."
slug: "cat-insurance-guide"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-guide"
  - "pet-insurance-for-maine-coons-hereditary-conditions"
  - "pet-insurance-for-senior-cats-with-cancer"
faq:
  - question: "Should indoor cat owners compare pet insurance?"
    answer: "They can, especially for illness, dental, emergency, and chronic-care questions. The right comparison depends on the cat's age, health history, and policy terms."
  - question: "Does this guide rank cat insurance providers?"
    answer: "No. It is a research hub and does not publish fabricated rankings, ratings, or testimonials."
affiliateOffers: []
pillar: true
---

Cat insurance comparisons can look different from dog insurance comparisons. Owners often ask about chronic illness, dental illness versus routine cleaning, hereditary or congenital language, and how a provider reviews symptoms that appeared before enrollment.

Age and health history matter. Senior cat owners may need to confirm age eligibility, renewal terms, cancer-related exclusions, and whether prior symptoms in the veterinary record could affect future claims. Breed-specific pages, such as Maine Coon guides, should focus on policy language rather than implying a guaranteed medical outcome.

Dental coverage is another common source of confusion. Accident-related dental care, illness-related dental care, and routine wellness cleanings may be treated as separate benefits or add-ons. Owners should compare those terms directly in provider documents.

Use this pillar as the cat-specific hub for breed, condition, and comparison pages. New cat pages stay noindexed until reviewed for unique content quality.
```

## src/content/blog/does-pet-insurance-cover-dental.md

```markdown
---
title: "Does Pet Insurance Cover Dental Care?"
metaDescription: "Learn the policy terms pet owners should check when researching dental coverage, exclusions, and wellness add-ons."
slug: "does-pet-insurance-cover-dental"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "does-pet-insurance-cover-dental-in-texas"
  - "pet-insurance-california"
  - "cat-insurance-guide"
category: "Coverage"
faq: []
affiliateOffers: []
---

Dental coverage is one of the easiest pet insurance topics to misunderstand because the word "dental" can refer to several different policy areas. A plan may treat dental injury, dental illness, and routine dental cleaning as separate benefits.

When reviewing a policy, start by identifying whether the dental issue is tied to an accident, an illness, or preventive care. A broken tooth after an accident may be discussed differently from periodontal disease, and both may be separate from routine cleanings.

Wellness add-ons can create another layer. Some providers may offer routine-care packages that reimburse limited preventive services, while the core accident-and-illness policy handles eligible unexpected problems. That does not mean every dental procedure is covered, so owners should read exclusions closely.

Cats and dogs can raise different dental questions, but the comparison method is the same: look for definitions, exclusions, waiting periods, annual limits, and whether a current symptom already appears in the veterinary record.

This site does not decide whether a specific claim will be covered. Pet owners should confirm current terms directly with the insurance provider before enrolling or relying on coverage.
```

## src/content/blog/pet-insurance-before-surgery.md

```markdown
---
title: "Pet Insurance Before Surgery"
metaDescription: "Learn what pet owners should know before buying pet insurance when surgery may already be recommended or expected."
slug: "pet-insurance-before-surgery"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-emergency-vet-visits"
  - "pet-insurance-waiting-period-for-cruciate-ligament"
category: "Trigger events"
faq:
  - question: "Can insurance cover surgery that is already recommended?"
    answer: "A recommended or symptomatic issue before enrollment may be treated as pre-existing. Confirm the policy terms directly."
affiliateOffers: []
---

Pet owners often research insurance quickly after hearing that surgery may be possible. That timing matters because pet insurance is generally designed for future unexpected issues, not procedures that were already recommended or symptoms that were already documented before enrollment.

The first question is not "which company is cheapest?" It is whether the condition behind the surgery could be considered pre-existing under the policy. A diagnosis, a vet note, limping before enrollment, recurring symptoms, or a prior recommendation may all be relevant depending on the provider's definitions.

Waiting periods also matter. Even if a policy is purchased before the actual operation, coverage may not begin immediately. Accident, illness, and orthopedic waiting periods can differ, and some procedures may be subject to additional rules.

Owners should also separate emergency decisions from insurance research. If a pet needs care now, a veterinarian's advice should come first. Insurance comparison can help for future risk planning, but it should not delay urgent medical care.

This page does not provide a quote or coverage determination. It gives owners a checklist of timing questions to ask before relying on a newly purchased policy.
```

## src/content/blog/switching-providers.md

```markdown
---
title: "Switching Pet Insurance Providers"
metaDescription: "Review questions to ask before switching pet insurance providers, including pre-existing conditions and coverage gaps."
slug: "switching-pet-insurance-providers"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-dogs-with-allergies"
  - "pet-insurance-for-french-bulldogs-with-pre-existing-conditions"
category: "Policy changes"
faq:
  - question: "Can switching reset pre-existing condition review?"
    answer: "It may. Owners should compare the new provider's definitions and avoid assuming prior coverage transfers."
affiliateOffers: []
---

Switching pet insurance providers can make sense when a household's budget, coverage needs, or provider experience changes. The risky part is assuming a new policy will treat the pet's history the same way the old policy did.

A new insurer may review the pet's veterinary records from the beginning. Conditions, symptoms, or treatments that were covered under an existing policy may be treated differently if they predate the new policy. That is why owners should compare pre-existing condition definitions before cancelling current coverage.

Waiting periods can also restart. A pet owner who switches too quickly may create a coverage gap for accidents, illnesses, or orthopedic issues. The practical comparison is not just premium versus premium; it is total risk during the transition.

Before switching, owners should collect the current policy, the renewal notice, recent vet records, and the candidate provider's sample policy language. Questions about chronic care, prescription eligibility, deductibles, and annual limits should be answered before the old policy is allowed to lapse.

This page avoids provider rankings because switching decisions depend on the individual pet, timing, and current carrier terms.
```

## src/content/blog/just-adopted-puppy-insurance.md

```markdown
---
title: "Just Adopted a Puppy: Pet Insurance Questions to Ask"
metaDescription: "Review pet insurance questions new puppy owners should ask about waiting periods, exclusions, and quote timing."
slug: "just-adopted-a-puppy-pet-insurance"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

New puppy owners should compare waiting periods, first exam requirements, hereditary condition terms, and what happens if symptoms appear before enrollment.
```

## src/content/breed/french-bulldog.md

```markdown
---
title: "Pet Insurance for French Bulldogs"
metaDescription: "Review common comparison factors for French Bulldog pet insurance, including exclusions, waiting periods, and provider terms."
slug: "pet-insurance-for-french-bulldogs"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-hip-dysplasia"
  - "dog-insurance-guide"
  - "pet-insurance-california"
breed: "French Bulldog"
species: "dog"
faq: []
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

French Bulldog owners often compare pet insurance with extra attention to hereditary condition language, exclusions, and waiting periods. This placeholder stays noindexed until reviewed for unique value.
```

## src/content/breed/german-shepherd-hip-dysplasia.md

```markdown
---
title: "Pet Insurance for German Shepherds With Hip Dysplasia"
metaDescription: "Compare German Shepherd pet insurance considerations for hip dysplasia, orthopedic exclusions, and provider terms."
slug: "pet-insurance-for-german-shepherds-with-hip-dysplasia"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-hip-dysplasia"
  - "pet-insurance-for-golden-retrievers-with-hip-dysplasia"
  - "dog-insurance-guide"
breed: "German Shepherd"
species: "dog"
faq:
  - question: "Can a waiting period affect hip dysplasia coverage?"
    answer: "It can. Owners should confirm orthopedic waiting periods directly with each provider before relying on coverage."
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

German Shepherd owners may want to compare policies by how they define orthopedic issues, hereditary conditions, and symptoms that appear before the policy begins.
```

## src/content/breed/golden-retriever-hip-dysplasia.md

```markdown
---
title: "Pet Insurance for Golden Retrievers With Hip Dysplasia"
metaDescription: "Review pet insurance questions for Golden Retrievers where hip dysplasia, hereditary terms, and waiting periods matter."
slug: "pet-insurance-for-golden-retrievers-with-hip-dysplasia"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-hip-dysplasia"
  - "pet-insurance-waiting-period-for-cruciate-ligament"
  - "dog-insurance-guide"
breed: "Golden Retriever"
species: "dog"
faq:
  - question: "Should Golden Retriever owners compare hereditary condition language?"
    answer: "Yes. Policy wording around hereditary and orthopedic conditions can affect what is eligible after enrollment."
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

Golden Retriever owners researching hip dysplasia coverage should read policy definitions for hereditary conditions, orthopedic waiting periods, and pre-existing condition exclusions before requesting a real quote from a provider.
```

## src/content/breed/labrador-allergies.md

```markdown
---
title: "Pet Insurance for Labradors With Allergies"
metaDescription: "Learn what Labrador owners should check when comparing pet insurance for allergies, chronic care, and exclusions."
slug: "pet-insurance-for-labradors-with-allergies"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Labrador owners comparing allergy-related coverage should look for policy language around chronic illness, dermatology visits, prescriptions, and symptoms documented before enrollment.
```

## src/content/breed/maine-coon-hereditary-conditions.md

```markdown
---
title: "Pet Insurance for Maine Coons and Hereditary Conditions"
metaDescription: "Review Maine Coon pet insurance questions around hereditary conditions, exclusions, and documentation timing."
slug: "pet-insurance-for-maine-coons-hereditary-conditions"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Maine Coon owners should compare policy language for hereditary and congenital conditions, exam-history requirements, and whether symptoms before enrollment could affect future eligibility.
```

## src/content/breed/senior-dogs-texas.md

```markdown
---
title: "Pet Insurance for Senior Dogs in Texas"
metaDescription: "Compare senior dog pet insurance considerations in Texas, including enrollment limits, exclusions, and provider availability."
slug: "pet-insurance-for-senior-dogs-in-texas"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-texas"
  - "pets-best-vs-metlife-for-senior-dogs"
  - "dog-insurance-guide"
breed: "Senior dog"
species: "dog"
faq:
  - question: "What should owners of senior dogs confirm first?"
    answer: "Confirm age eligibility, waiting periods, and how the provider treats conditions already documented by a veterinarian."
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

Senior dog owners in Texas should compare age rules, chronic condition language, and state availability before leaving the site for a provider quote.
```

## src/content/carrier-review/lemonade-cats-review.md

```markdown
---
title: "Lemonade Pet Insurance Review for Cats"
metaDescription: "Review Lemonade pet insurance questions for cat owners, including exclusions, add-ons, and direct term verification."
slug: "lemonade-pet-insurance-review-for-cats"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Cat owners researching Lemonade should verify current exclusions, add-ons, waiting periods, and state availability directly before relying on any comparison.
```

## src/content/carrier-review/trupanion-dogs-review.md

```markdown
---
title: "Trupanion Pet Insurance Review for Dogs"
metaDescription: "Review Trupanion pet insurance questions for dog owners without fabricated ratings or unsourced provider claims."
slug: "trupanion-pet-insurance-review-for-dogs"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "healthy-paws-vs-embrace-for-dogs"
  - "pet-insurance-for-dogs-with-allergies"
  - "dog-insurance-guide"
carrier: "Trupanion"
faq:
  - question: "Should provider terms be checked before purchase?"
    answer: "Yes. Coverage language and availability can change, so pet owners should verify directly with the provider."
affiliateOffers: []
---

This dog-focused carrier review placeholder keeps the comparison factual and avoids numeric scoring until sourced first-party review data exists.
```

## src/content/comparison/healthy-paws-vs-embrace-dogs.md

```markdown
---
title: "Healthy Paws vs Embrace for Dogs"
metaDescription: "Compare Healthy Paws and Embrace research questions for dog owners without fake ratings or unsourced rankings."
slug: "healthy-paws-vs-embrace-for-dogs"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "embrace-pet-insurance-cost-review"
  - "pet-insurance-for-german-shepherds-with-hip-dysplasia"
  - "dog-insurance-guide"
carriers:
  - "Healthy Paws"
  - "Embrace"
faq:
  - question: "Is this a ranked recommendation?"
    answer: "No. This placeholder organizes comparison questions and does not rank providers."
affiliateOffers: []
---

Dog owners comparing Healthy Paws and Embrace should verify current waiting periods, exclusions, reimbursement structures, and state availability through provider materials.
```

## src/content/comparison/lemonade-vs-spot-cats.md

```markdown
---
title: "Lemonade vs Spot for Cats"
metaDescription: "Compare Lemonade and Spot pet insurance questions for cat owners, including exclusions, add-ons, and availability."
slug: "lemonade-vs-spot-for-cats"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Cat owners comparing Lemonade and Spot should review dental language, hereditary condition treatment, wellness options, and state availability before requesting quotes.
```

## src/content/comparison/pets-best-vs-metlife-senior-dogs.md

```markdown
---
title: "Pets Best vs MetLife for Senior Dogs"
metaDescription: "Compare Pets Best and MetLife pet insurance questions for senior dog owners, including eligibility and exclusions."
slug: "pets-best-vs-metlife-for-senior-dogs"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-senior-dogs-in-texas"
  - "pet-insurance-for-emergency-vet-visits"
  - "dog-insurance-guide"
carriers:
  - "Pets Best"
  - "MetLife"
faq:
  - question: "What should senior dog owners compare first?"
    answer: "Age eligibility, chronic condition wording, waiting periods, and renewal terms should be confirmed directly."
affiliateOffers: []
---

Senior dog owners comparing Pets Best and MetLife should focus on eligibility, exclusions, and current provider documents rather than relying on generic rankings.
```

## src/content/comparison/sample-vs-example-cats.md

```markdown
---
title: "Sample Partner vs Example Provider for Cats"
metaDescription: "Placeholder cat insurance comparison for validating carrier comparison templates without ratings or invented claims."
slug: "pet-insurance-for-cats-sample-vs-example"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "cat-insurance-guide"
relatedSlugs:
  - "sample-partner-review"
  - "lemonade-vs-spot-for-cats"
  - "cat-insurance-guide"
carriers:
  - "Sample Partner"
  - "Example Provider"
faq:
  - question: "Why is this page noindexed?"
    answer: "It is a placeholder template validation page and needs content-quality review before indexing."
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

This cat comparison placeholder validates affiliate disclosure behavior and avoids fabricated provider ratings.
```

## src/content/condition/cruciate-ligament-waiting-period.md

```markdown
---
title: "Pet Insurance Waiting Period for Cruciate Ligament Issues"
metaDescription: "Learn what pet owners should ask about cruciate ligament waiting periods, orthopedic terms, and exclusions."
slug: "pet-insurance-waiting-period-for-cruciate-ligament"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-hip-dysplasia"
  - "pet-insurance-for-golden-retrievers-with-hip-dysplasia"
  - "dog-insurance-guide"
condition: "Cruciate ligament"
species: "dog"
faq:
  - question: "Why should owners ask about orthopedic waiting periods?"
    answer: "Orthopedic issues can have special timing rules, so owners should confirm the current policy wording directly."
affiliateOffers: []
---

Cruciate ligament injuries are a common reason dog owners look closely at pet insurance timing. The key issue is that orthopedic conditions may have waiting-period rules that differ from ordinary accident or illness language.

Owners should compare the exact policy wording for cruciate ligament, CCL, ACL, knee, orthopedic, and bilateral condition references. Similar phrases can lead to different outcomes depending on the provider, the state, and the pet's veterinary record.

Timing is especially important. If a dog shows symptoms such as limping before enrollment, or if a veterinarian has already noted knee concerns, the provider may review that history when deciding whether a future claim is eligible. A policy bought after symptoms appear may not solve the immediate problem.

Some owners also need to understand bilateral language. A provider may treat an issue in one knee as relevant to the other knee, depending on the policy. That is a detail to confirm before assuming a second future injury would be covered.

This page is intentionally informational. It does not make a coverage promise, rank providers, or replace reading current policy documents.
```

## src/content/condition/dog-allergies.md

```markdown
---
title: "Pet Insurance for Dogs With Allergies"
metaDescription: "Compare policy language for dogs with allergies, chronic symptoms, prescriptions, and pre-existing exclusions."
slug: "pet-insurance-for-dogs-with-allergies"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Dog owners researching allergy coverage should compare chronic condition wording, medication eligibility, specialist care, and whether prior symptoms appear in veterinary records.
```

## src/content/condition/hip-dysplasia.md

```markdown
---
title: "Pet Insurance and Hip Dysplasia"
metaDescription: "Understand how pet insurance policies may treat hip dysplasia, waiting periods, exclusions, and hereditary condition language."
slug: "pet-insurance-hip-dysplasia"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: false
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-french-bulldogs"
  - "pet-insurance-for-german-shepherds-with-hip-dysplasia"
  - "dog-insurance-guide"
condition: "Hip dysplasia"
species: "multiple"
faq: []
affiliateOffers: []
---

Hip dysplasia coverage questions usually turn on policy language rather than the diagnosis name alone. Pet owners should look for terms such as hereditary condition, congenital condition, orthopedic condition, bilateral condition, and pre-existing condition.

Timing is the first filter. If symptoms, exam notes, imaging, or treatment recommendations appeared before enrollment or during a waiting period, a provider may review that history before deciding whether a claim is eligible. Owners should not assume a future hip-related bill will be covered just because a policy includes illness coverage.

Breed context can make the research more urgent, but it does not create a guaranteed outcome. French Bulldogs, German Shepherds, Golden Retrievers, and other dogs may prompt owners to compare orthopedic language closely, while the final decision still depends on the individual pet's records and the active policy.

Waiting periods deserve a separate check. Some providers may use special orthopedic waiting periods or additional exam requirements. Those details should be confirmed directly before relying on coverage for a hip-related issue.

This page gives a policy-review framework and links to breed-specific pages. It does not provide veterinary advice, a claim decision, or a provider ranking.
```

## src/content/condition/pre-existing-french-bulldogs.md

```markdown
---
title: "Pet Insurance for French Bulldogs With Pre-Existing Conditions"
metaDescription: "Review how pre-existing condition language may affect French Bulldog pet insurance comparisons before enrollment."
slug: "pet-insurance-for-french-bulldogs-with-pre-existing-conditions"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "dog-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-french-bulldogs"
  - "switching-pet-insurance-providers"
  - "dog-insurance-guide"
condition: "Pre-existing conditions"
species: "dog"
faq:
  - question: "Can a past symptom matter even without a diagnosis?"
    answer: "It can. Pet owners should review how each provider defines pre-existing symptoms and documented conditions."
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

French Bulldog owners should compare how policies define pre-existing conditions, whether curable conditions are treated differently, and what veterinary records may be reviewed.
```

## src/content/condition/senior-cats-cancer.md

```markdown
---
title: "Pet Insurance for Senior Cats With Cancer"
metaDescription: "Review senior cat insurance comparison questions around cancer, exclusions, age eligibility, and provider terms."
slug: "pet-insurance-for-senior-cats-with-cancer"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Senior cat owners should review age eligibility, oncology-related exclusions, waiting periods, and how prior symptoms may be evaluated.
```

