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
