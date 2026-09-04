# Checkpoint 1 Code Snapshot

Date: 2026-09-04

Status: Astro scaffold and content collections created. Files are currently
uncommitted except for the source instruction docs commit.

## Existing Files Relevant to Review

- `astro.config.mjs`
- `package.json`
- `.env.example`
- `src/content/config.ts`
- `src/data/affiliateOffers.ts`
- `src/lib/analytics.ts`
- `src/pages/go/[carrier].ts`
- `src/env.d.ts`
- `src/pages/index.astro`
- Sample content entries under `src/content/`

## Missing in Checkpoint 1

These are intentionally not implemented yet and should be handled in the next
checkpoint:

- `src/layouts/`
- Shared header/nav
- Shared footer with site-wide "not an insurance agency" disclaimer
- FTC/advertising disclosure component
- Advertising Disclosure page
- Privacy Policy page
- Page templates for each collection
- Custom robots logic
- Custom sitemap filtering beyond the default Astro sitemap integration
- JSON-LD helpers
- Breadcrumb helpers

## Build and Smoke Test

`npm run build` passes.

Smoke checks performed:

- `/` returns `200`
- `/go/sample` returns `302` to the placeholder partner URL configured in `src/data/affiliateOffers.ts`

## Current Implementation Notes

The Cloudflare adapter is enabled for production builds only through
`process.env.npm_lifecycle_event === "build"`. This avoids the local Cloudflare
runtime failing on the current macOS version while preserving Cloudflare Pages as the
production target.

All sample content entries are `noindex: true` because they are placeholders and are
not suitable for indexable publication.

The `/go/[carrier]` route calls `trackOutboundClick()` before redirecting. Plausible is
the default analytics provider; GA4 is intentionally left behind the same interface for
future implementation.

## Code: astro.config.mjs

```js
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

const isProductionBuild = process.env.npm_lifecycle_event === "build";

export default defineConfig({
  site: "https://petinsurancegenius.com",
  adapter:
    isProductionBuild
      ? cloudflare({
          imageService: "compile"
        })
      : undefined,
  integrations: [sitemap()]
});
```

## Code: src/content/config.ts

```ts
import { defineCollection, z } from "astro:content";

const affiliateOfferSchema = z.object({
  carrierName: z.string(),
  url: z.string().url(),
  disclosureRequired: z.literal(true),
  network: z.string()
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const baseSchema = z.object({
  title: z.string(),
  metaDescription: z.string().min(50).max(160),
  // Astro reserves `slug` and exposes it on entries, so authored frontmatter may not reach Zod here.
  slug: z.string().optional(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date(),
  noindex: z.boolean().default(false),
  canonicalUrl: z.string().url().optional(),
  faq: z.array(faqSchema).default([]),
  affiliateOffers: z.array(affiliateOfferSchema).default([])
});

const guide = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    pillar: z.boolean().default(true)
  })
});

const breed = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    breed: z.string(),
    species: z.enum(["dog", "cat", "other"])
  })
});

const state = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    state: z.string(),
    stateAbbreviation: z.string().length(2)
  })
});

const condition = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    condition: z.string(),
    species: z.enum(["dog", "cat", "other", "multiple"]).default("multiple")
  })
});

const carrierReview = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    carrier: z.string()
  })
});

const comparison = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    carriers: z.array(z.string()).min(2)
  })
});

const blog = defineCollection({
  type: "content",
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

## Code: src/data/affiliateOffers.ts

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
    destinationUrl: "[placeholder partner URL]",
    network: "placeholder"
  }
};

export function getAffiliateOffer(carrierSlug: string) {
  return affiliateOffers[carrierSlug];
}
```

## Code: src/lib/analytics.ts

```ts
export type OutboundClickEvent = {
  carrierSlug: string;
  carrierName: string;
  destinationUrl: string;
  sourcePath: string;
  userAgent?: string;
};

type AnalyticsProvider = "plausible" | "ga4" | "none";

function getEnv(context: App.Locals, key: string): string | undefined {
  const runtime = context.runtime?.env as Record<string, string | undefined> | undefined;
  return runtime?.[key] ?? import.meta.env[key];
}

function getProvider(context: App.Locals): AnalyticsProvider {
  const configured = getEnv(context, "ANALYTICS_PROVIDER")?.toLowerCase();

  if (configured === "ga4" || configured === "none") {
    return configured;
  }

  return "plausible";
}

async function withTimeout(fetcher: (signal: AbortSignal) => Promise<Response>, milliseconds = 1200) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), milliseconds);

  try {
    return await fetcher(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

async function trackPlausibleClick(context: App.Locals, event: OutboundClickEvent) {
  const domain = getEnv(context, "PLAUSIBLE_DOMAIN") ?? "petinsurancegenius.com";
  const apiHost = getEnv(context, "PLAUSIBLE_API_HOST") ?? "https://plausible.io";

  await withTimeout((signal) =>
    fetch(`${apiHost.replace(/\/$/, "")}/api/event`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": event.userAgent ?? "petinsurancegenius.com"
      },
      body: JSON.stringify({
        name: "Affiliate Outbound Click",
        url: `https://${domain}${event.sourcePath}`,
        domain,
        props: {
          carrier_slug: event.carrierSlug,
          carrier_name: event.carrierName,
          network: "redirect",
          destination_host: new URL(event.destinationUrl).hostname
        }
      })
    })
  );
}

async function trackGa4Click(_context: App.Locals, _event: OutboundClickEvent) {
  // GA4 is intentionally behind the same interface and can be enabled when funnel depth is needed.
}

export async function trackOutboundClick(context: App.Locals, event: OutboundClickEvent) {
  try {
    const provider = getProvider(context);

    if (provider === "none") {
      return;
    }

    if (provider === "ga4") {
      await trackGa4Click(context, event);
      return;
    }

    await trackPlausibleClick(context, event);
  } catch {
    // Redirects must not fail because analytics is temporarily unavailable.
  }
}
```

## Code: src/pages/go/[carrier].ts

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
