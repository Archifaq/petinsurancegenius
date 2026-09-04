# Checkpoint 5 Accepted Baseline

This is the current accepted implementation baseline for Claude review. It includes Checkpoint 5 and the accepted follow-up fix for the pillar-link title rendering bug in src/pages/[slug].astro plus the hip-dysplasia species taxonomy correction.

## Verification

- npm run build passed after the follow-up fix.
- Astro check result: 0 errors, 0 warnings, 0 hints.
- Content validation passed: 36 content slugs across 7 collections.
- noindex sitemap list contains 30 content paths.
- Sitemap includes /, /advertising-disclosure/, and the six content pages listed below.
- Built HTML for /pet-insurance-hip-dysplasia/ and /pet-insurance-waiting-period-for-cruciate-ligament/ renders <a href="/dog-insurance-guide/">Dog Insurance Guide</a>.

## Current Content Status

- Total content entries: 36.
- noindex: false content entries: 6.
- noindex: true content entries: 30.
- Dog and cat guide pillar pages exist but remain noindex: true pending later content-quality review.

## noindex: false Pages

- src/content/guide/pet-insurance-guide.md — Core pillar page expanded into a general comparison framework covering policy mechanics, pre-existing condition timing, species branching, and non-agency language.
- src/content/blog/does-pet-insurance-cover-dental.md — Evergreen informational explainer distinguishing dental injury, dental illness, routine cleaning, and wellness add-ons.
- src/content/blog/pet-insurance-before-surgery.md — High-intent trigger-event page focused on timing, pre-existing condition risk, waiting periods, and urgent-care caveats.
- src/content/blog/switching-providers.md — Policy-transition guide explaining record review, coverage gaps, and waiting-period resets without provider rankings.
- src/content/condition/cruciate-ligament-waiting-period.md — Dog/orthopedic condition page covering cruciate/CCL terminology, bilateral-condition language, timing caveats, and policy-review questions.
- src/content/condition/hip-dysplasia.md — Dog condition page with orthopedic, hereditary, pre-existing-condition, waiting-period, and breed-context guidance; species is dog to match content and pillar.

## Accepted Follow-Up Fix

- src/pages/[slug].astro resolves the pillar link title from the actual guide collection entry matching entry.data.pillarSlug.
- If the guide entry is missing, the template falls back to a humanized pillarSlug.
- src/content/condition/hip-dysplasia.md now uses species: "dog" to match the dog-only body copy, dog pillarSlug, and dog related links.

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

## astro.config.mjs

```js
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
```

## README.md

```markdown
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
```

## public/robots.txt

```text
User-agent: *
Allow: /
Disallow: /go/

Sitemap: https://petinsurancegenius.com/sitemap-index.xml
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

## src/pages/[slug].astro

```astro
---
import { getCollection, render, type CollectionEntry } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import DisclosureBanner from "@/components/DisclosureBanner.astro";
import { getAffiliateOffer } from "@/data/affiliateOffers";

const pageLabels = {
  guide: "Guide",
  breed: "Breed Guide",
  state: "State Guide",
  condition: "Condition Guide",
  "carrier-review": "Carrier Review",
  comparison: "Comparison",
  blog: "Article"
} as const;

type SupportedCollection = keyof typeof pageLabels;

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getStaticPaths() {
  const collectionNames = [
    "guide",
    "breed",
    "state",
    "condition",
    "carrier-review",
    "comparison",
    "blog"
  ] as const;
  const groupedEntries = await Promise.all(
    collectionNames.map((collection) => getCollection(collection))
  );

  return groupedEntries.flat().map((entry) => ({
    params: { slug: entry.id },
    props: { entry }
  }));
}

type SupportedEntry = CollectionEntry<SupportedCollection>;

const { entry } = Astro.props as { entry: SupportedEntry };
const { Content } = await render(entry);
const canonicalUrl =
  entry.data.canonicalUrl ?? new URL(`/${entry.id}/`, Astro.site ?? Astro.url).toString();
const affiliateOffers = entry.data.affiliateOffers.map((offer) => ({
  ...offer,
  resolvedOffer: getAffiliateOffer(offer.carrierSlug)
}));
const hasAffiliateOffers = affiliateOffers.length > 0;
const guideEntries = await getCollection("guide");
const pillarEntry = guideEntries.find((guideEntry) => guideEntry.id === entry.data.pillarSlug);
const relatedLinks = [
  entry.id !== entry.data.pillarSlug
    ? {
        slug: entry.data.pillarSlug,
        title: pillarEntry?.data.title ?? humanizeSlug(entry.data.pillarSlug)
      }
    : undefined,
  ...entry.data.relatedSlugs.map((slug) => ({
    slug,
    title: humanizeSlug(slug)
  }))
].filter(Boolean) as { slug: string; title: string }[];
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: new URL("/", Astro.site ?? Astro.url).toString()
    },
    {
      "@type": "ListItem",
      position: 2,
      name: entry.data.title,
      item: canonicalUrl
    }
  ]
};
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: entry.data.title,
  description: entry.data.metaDescription,
  datePublished: entry.data.publishDate.toISOString(),
  dateModified: entry.data.updatedDate.toISOString(),
  mainEntityOfPage: canonicalUrl
};
const faqJsonLd =
  entry.data.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entry.data.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    : undefined;
const jsonLd = [breadcrumbJsonLd, articleJsonLd, faqJsonLd].filter(Boolean) as Record<
  string,
  unknown
>[];
---

<BaseLayout
  title={entry.data.title}
  description={entry.data.metaDescription}
  canonicalUrl={canonicalUrl}
  noindex={entry.data.noindex}
  jsonLd={jsonLd}
>
  <article>
    <p class="eyebrow">{pageLabels[entry.collection]}</p>
    <h1>{entry.data.title}</h1>
    <p>{entry.data.metaDescription}</p>

    {hasAffiliateOffers && <DisclosureBanner />}

    {
      entry.collection === "state" && (
        <aside class="affiliate-card">
          {entry.data.availabilityNote}
        </aside>
      )
    }

    <div class="content-body">
      <Content />
    </div>

    {
      hasAffiliateOffers && (
        <section aria-labelledby="partner-links">
          <h2 id="partner-links">Partner Links</h2>
          <DisclosureBanner />
          <div class="cta-list">
            {affiliateOffers.map(({ carrierName, carrierSlug, network, resolvedOffer }) => (
              <div class="affiliate-card">
                <p>
                  {carrierName} is listed as a partner through {network}. Continue to the partner site for current
                  availability, terms, and quote details.
                </p>
                {resolvedOffer ? (
                  <a class="button-link" href={`/go/${carrierSlug}`}>Continue to {resolvedOffer.carrierName}</a>
                ) : (
                  <p>This partner link is not active yet.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )
    }

    {
      relatedLinks.length > 0 && (
        <section aria-labelledby="related-pages">
          <h2 id="related-pages">Related Guides</h2>
          <ul>
            {relatedLinks.map((link) => (
              <li>
                <a href={`/${link.slug}/`}>{link.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )
    }

    {
      entry.data.faq.length > 0 && (
        <section aria-labelledby="faq">
          <h2 id="faq">Frequently Asked Questions</h2>
          {entry.data.faq.map((item) => (
            <details>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>
      )
    }
  </article>
</BaseLayout>
```

## src/pages/advertising-disclosure.astro

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";

const title = "Advertising Disclosure";
const description =
  "Advertising disclosure for Pet Insurance Genius, including how affiliate relationships may affect compensation.";
const canonicalUrl = new URL("/advertising-disclosure/", Astro.site ?? Astro.url).toString();
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl} noindex={false}>
  <article>
    <h1>{title}</h1>
    <p>
      Placeholder legal copy for review: Pet Insurance Genius may earn a commission if
      you purchase a policy through links on this site. This compensation does not
      affect our editorial opinions.
    </p>
    <p>
      Pet Insurance Genius is not an insurance agency and does not sell insurance
      policies. We provide informational content and may be compensated for referrals
      to third-party insurance providers.
    </p>
  </article>
</BaseLayout>
```

## src/pages/privacy-policy.astro

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";

const title = "Privacy Policy";
const description =
  "Privacy policy placeholder for Pet Insurance Genius, describing current limited data collection during the test phase.";
const canonicalUrl = new URL("/privacy-policy/", Astro.site ?? Astro.url).toString();
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl} noindex={true}>
  <article>
    <h1>{title}</h1>
    <p>
      Placeholder legal copy for review: this site is currently built for an organic SEO
      test and does not collect quote applications, sell insurance, or process policy
      purchases on-site.
    </p>
    <p>
      Outbound affiliate clicks may be measured to understand whether visitors continue
      to third-party providers. Final privacy language should be reviewed before launch.
    </p>
  </article>
</BaseLayout>
```

## src/pages/index.astro

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";

const title = "Pet Insurance Genius";
const description = "Independent pet insurance guides, comparisons, and state-by-state explainers for US pet owners.";
const canonicalUrl = new URL("/", Astro.site ?? Astro.url).toString();
---

<BaseLayout title={title} description={description} canonicalUrl={canonicalUrl} noindex={false}>
  <section>
    <h1>{title}</h1>
    <p>{description}</p>
    <p>
      Compare policy terms, exclusions, waiting periods, and provider availability before continuing to a carrier or comparison partner for a real quote.
    </p>
  </section>
</BaseLayout>
```

## src/layouts/BaseLayout.astro

```astro
---
import Footer from "@/components/Footer.astro";

interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const { title, description, canonicalUrl, noindex = true, jsonLd = [] } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    {noindex && <meta name="robots" content="noindex,follow" />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary" />
    {jsonLd.map((schema) => <script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />)}
    <!-- Google tag (gtag.js) -->
  <script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-RLFG2NVRK7"></script>
  <script is:inline>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "G-RLFG2NVRK7");
  </script>
</head>
  <body>
    <div class="site-shell">
      <header class="site-header">
        <a class="brand" href="/">Pet Insurance Genius</a>
        <nav aria-label="Primary">
          <a href="/pet-insurance-guide/">Guide</a>
          <a href="/pet-insurance-california/">By State</a>
        </nav>
      </header>
      <main>
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>

<style is:global>
  :root {
    color: #18221d;
    background: #fbfcf9;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
  }

  body {
    margin: 0;
  }

  a {
    color: #0f6840;
  }

  .site-shell {
    margin: 0 auto;
    max-width: 960px;
    padding: 0 1.25rem;
  }

  .site-header {
    align-items: center;
    border-bottom: 1px solid #d8e2dc;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem 0;
  }

  .brand {
    color: #17221b;
    font-weight: 800;
    text-decoration: none;
  }

  .site-header nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  main {
    padding: 2rem 0 0;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.25rem);
    line-height: 1.05;
    margin: 0 0 1rem;
  }

  h2 {
    font-size: 1.5rem;
    margin: 2.5rem 0 0.75rem;
  }

  p,
  li {
    font-size: 1.05rem;
    line-height: 1.65;
  }

  .eyebrow {
    color: #527061;
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 0;
    margin: 0 0 0.75rem;
    text-transform: uppercase;
  }

  .content-body {
    margin-top: 2rem;
  }

  .cta-list {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .affiliate-card {
    border: 1px solid #d8e2dc;
    border-radius: 8px;
    padding: 1rem;
  }

  .button-link {
    background: #126b43;
    border-radius: 6px;
    color: #fff;
    display: inline-block;
    font-weight: 800;
    margin-top: 0.5rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
  }
</style>
```

## src/components/DisclosureBanner.astro

```astro
---
interface Props {
  class?: string;
}

const className = Astro.props.class;
---

<aside class:list={["disclosure-banner", className]} aria-label="Advertising disclosure">
  <strong>Advertising Disclosure:</strong>
  We may earn a commission if you purchase a policy through links on this page. This does not affect our editorial opinions.
  See our <a href="/advertising-disclosure/">Advertising Disclosure</a> page for details.
</aside>

<style>
  .disclosure-banner {
    border: 1px solid #b7d7c2;
    border-radius: 8px;
    background: #eef8f1;
    color: #173522;
    font-size: 1rem;
    line-height: 1.55;
    margin: 1rem 0 1.5rem;
    padding: 1rem;
  }

  .disclosure-banner a {
    color: #0a5b36;
    font-weight: 700;
  }
</style>
```

## src/components/Footer.astro

```astro
<footer class="site-footer">
  <p>
    Pet Insurance Genius is not an insurance agency and does not sell insurance policies.
    We provide informational content and may be compensated for referrals to third-party insurance providers.
  </p>
  <nav aria-label="Footer">
    <a href="/advertising-disclosure/">Advertising Disclosure</a>
    <a href="/privacy-policy/">Privacy Policy</a>
  </nav>
</footer>

<style>
  .site-footer {
    border-top: 1px solid #d8e2dc;
    color: #415247;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-top: 4rem;
    padding: 2rem 0;
  }

  .site-footer nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  .site-footer a {
    color: #0f6840;
    font-weight: 700;
  }
</style>
```

## src/data/affiliateOffers.ts

```ts
export type AffiliateOffer = {
  carrierSlug: string;
  carrierName: string;
  destinationUrl: string;
  network: string;
};

export const affiliateOffers: Record<string, AffiliateOffer> = {
  sample: {
    carrierSlug: "sample",
    carrierName: "Sample Partner",
    destinationUrl: "https://example.com/pet-insurance-affiliate-placeholder",
    network: "placeholder"
  }
};

export function getAffiliateOffer(carrierSlug: string) {
  return affiliateOffers[carrierSlug];
}
```

## src/pages/go/[carrier].ts

```ts
import type { APIRoute } from "astro";
import { getAffiliateOffer } from "@/data/affiliateOffers";
import { trackOutboundClick } from "@/lib/analytics";

export const prerender = false;

export const GET: APIRoute = async ({ locals, params, request }) => {
  const carrierSlug = params.carrier;

  if (!carrierSlug) {
    return new Response("Missing carrier", { status: 400 });
  }

  const offer = getAffiliateOffer(carrierSlug);

  if (!offer) {
    return new Response("Unknown affiliate partner", { status: 404 });
  }

  const sourcePath = new URL(request.url).pathname;

  await trackOutboundClick(locals, {
    carrierSlug,
    carrierName: offer.carrierName,
    destinationUrl: offer.destinationUrl,
    sourcePath,
    userAgent: request.headers.get("user-agent") ?? undefined
  });

  return Response.redirect(offer.destinationUrl, 302);
};
```

# Content Records

## src/content/blog/dental-texas.md

```markdown
---
title: "Does Pet Insurance Cover Dental in Texas?"
metaDescription: "Review dental coverage questions Texas pet owners should ask about illness, injury, routine care, and wellness add-ons."
slug: "does-pet-insurance-cover-dental-in-texas"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Texas pet owners researching dental coverage should separate accident-related dental care, illness-related dental care, and optional routine wellness benefits.
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

## src/content/blog/multi-pet-discount.md

```markdown
---
title: "Pet Insurance for Multiple Pets Discount"
metaDescription: "Learn how to compare multi-pet insurance discounts without assuming a discount means the lowest total cost."
slug: "pet-insurance-for-multiple-pets-discount"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Multi-pet households should compare how each provider handles separate policies, deductibles, species differences, and advertised discounts.
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

## src/content/carrier-review/embrace-cost-review.md

```markdown
---
title: "Embrace Pet Insurance Cost Review"
metaDescription: "Review the questions pet owners should ask when researching Embrace pet insurance cost and policy terms."
slug: "embrace-pet-insurance-cost-review"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "healthy-paws-vs-embrace-for-dogs"
  - "cheapest-pet-insurance-in-florida"
carrier: "Embrace"
faq:
  - question: "Does this page publish an Embrace quote?"
    answer: "No. Pet owners must confirm current pricing through Embrace or a licensed partner."
affiliateOffers: []
---

This carrier review placeholder avoids ratings and unsourced pricing claims. It frames cost research around deductible choices, reimbursement options, exclusions, and current provider quote flows.
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

## src/content/carrier-review/sample-partner.md

```markdown
---
title: "Sample Partner Pet Insurance Review"
metaDescription: "Placeholder carrier review page for validating schema and disclosure handling before real carrier research is added."
slug: "sample-partner-review"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "sample-partner-vs-example-provider"
  - "pet-insurance-california"
carrier: "Sample Partner"
faq: []
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

This placeholder does not contain ratings, testimonials, or unsourced performance claims.
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

## src/content/comparison/sample-vs-example.md

```markdown
---
title: "Sample Partner vs Example Provider"
metaDescription: "Placeholder comparison page for validating collection fields before sourced carrier comparison content is added."
slug: "sample-partner-vs-example-provider"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "sample-partner-review"
  - "pet-insurance-for-cats-sample-vs-example"
carriers:
  - "Sample Partner"
  - "Example Provider"
faq: []
affiliateOffers: []
---

This placeholder comparison is intentionally noindexed until real sourced carrier research is available.
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

## src/content/condition/emergency-vet-visits.md

```markdown
---
title: "Pet Insurance for Emergency Vet Visits"
metaDescription: "Learn what pet owners should compare for emergency vet visit coverage, waiting periods, and exam fee language."
slug: "pet-insurance-for-emergency-vet-visits"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

Emergency vet visit comparisons should separate accidents, illnesses, exam fees, and waiting period language before a pet owner relies on coverage.
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
species: "dog"
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

## src/content/state/california.md

```markdown
---
title: "Pet Insurance in California"
metaDescription: "Compare California pet insurance considerations, including provider availability, state-specific terms, and quote verification."
slug: "pet-insurance-california"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-french-bulldogs"
  - "does-pet-insurance-cover-dental"
state: "California"
stateAbbreviation: "CA"
availabilityNote: "Not all insurance products are available in every state. Availability and terms vary by state and provider. Confirm details directly with the insurance carrier."
faq: []
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

This placeholder validates the state collection schema and state-specific availability note rendering.
```

## src/content/state/colorado-emergency-vet.md

```markdown
---
title: "Pet Insurance for Emergency Vet Visits in Colorado"
metaDescription: "Compare Colorado pet insurance considerations for emergency vet visits, waiting periods, exclusions, and provider terms."
slug: "pet-insurance-for-emergency-vet-visits-in-colorado"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-emergency-vet-visits"
  - "pet-insurance-before-surgery"
state: "Colorado"
stateAbbreviation: "CO"
availabilityNote: "Not all insurance products are available in Colorado. Availability and terms vary by provider. Confirm details directly with the insurance carrier."
faq:
  - question: "Can pet insurance be bought after an emergency starts?"
    answer: "A policy purchased after symptoms or an emergency begins may not cover that incident. Confirm terms directly with the provider."
affiliateOffers: []
---

Colorado pet owners comparing emergency coverage should look at waiting periods, exclusions for known symptoms, and whether emergency exam fees are included.
```

## src/content/state/florida-cheapest.md

```markdown
---
title: "Cheapest Pet Insurance in Florida"
metaDescription: "Review how Florida pet owners can compare lower-cost pet insurance options without relying on unsourced price claims."
slug: "cheapest-pet-insurance-in-florida"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-before-surgery"
  - "pet-insurance-for-multiple-pets-discount"
state: "Florida"
stateAbbreviation: "FL"
availabilityNote: "Not all insurance products are available in Florida. Availability and terms vary by provider. Confirm details directly with the insurance carrier."
faq:
  - question: "Can this page tell me the cheapest policy?"
    answer: "No. It can help organize comparison questions, but real prices must be confirmed through provider quote flows."
affiliateOffers: []
---

Florida pet owners searching for lower-cost coverage should compare deductibles, reimbursement structures, exclusions, and add-ons rather than relying on a single unsourced cheapest-provider claim.
```

## src/content/state/new-york-dental.md

```markdown
---
title: "Does Pet Insurance Cover Dental in New York?"
metaDescription: "Learn what New York pet owners should check when comparing dental illness, dental injury, and wellness coverage terms."
slug: "does-pet-insurance-cover-dental-in-new-york"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
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

New York pet owners researching dental coverage should separate dental injury, dental illness, and routine cleaning language when comparing providers.
```

## src/content/state/texas.md

```markdown
---
title: "Pet Insurance in Texas"
metaDescription: "Compare Texas pet insurance considerations, including state availability, waiting periods, and policy term verification."
slug: "pet-insurance-texas"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-senior-dogs-in-texas"
  - "does-pet-insurance-cover-dental-in-texas"
state: "Texas"
stateAbbreviation: "TX"
availabilityNote: "Not all insurance products are available in Texas. Availability and terms vary by provider. Confirm details directly with the insurance carrier."
faq:
  - question: "Are all pet insurance products available in Texas?"
    answer: "No. Availability can vary by provider, so Texas pet owners should confirm current terms directly with the carrier."
affiliateOffers:
  - carrierName: "Sample Partner"
    carrierSlug: "sample"
    disclosureRequired: true
    network: "placeholder"
---

Texas pet owners should review provider availability, waiting periods, exclusions, and where the actual quote or purchase flow occurs before choosing a policy.
```

## src/content/state/washington-multi-pet.md

```markdown
---
title: "Pet Insurance for Multiple Pets in Washington"
metaDescription: "Review Washington pet insurance comparison questions for households with multiple dogs, cats, or mixed pet families."
slug: "pet-insurance-for-multiple-pets-in-washington"
publishDate: "2026-09-04"
updatedDate: "2026-09-04"
noindex: true
pillarSlug: "pet-insurance-guide"
relatedSlugs:
  - "pet-insurance-for-multiple-pets-discount"
  - "pet-insurance-for-cats-sample-vs-example"
state: "Washington"
stateAbbreviation: "WA"
availabilityNote: "Not all insurance products are available in Washington. Availability and terms vary by provider. Confirm details directly with the insurance carrier."
faq:
  - question: "Do multi-pet discounts guarantee the lowest total cost?"
    answer: "No. Owners should compare total policy terms and provider quotes, not only whether a discount is advertised."
affiliateOffers: []
---

Washington households with multiple pets should compare how each provider handles separate deductibles, discounts, enrollment rules, and species-specific exclusions.
```

