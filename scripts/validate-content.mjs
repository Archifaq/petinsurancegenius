import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "devalue";
import {
  collections,
  contentRoot,
  getMarkdownFiles,
  normalizedPath,
  readFrontmatter,
  writeNoindexPaths
} from "./noindex-paths.mjs";

const contentStorePath = ".astro/data-store.json";
const noindexPathsPath = ".astro/noindex-paths.json";

if (!existsSync(contentStorePath)) {
  console.log(".astro/data-store.json not found, skipping validation.");
  process.exit(0);
}

const store = parse(readFileSync(contentStorePath, "utf8"));
const slugs = new Map();
const references = [];
const noindexPaths = [];
const errors = [];

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

writeNoindexPaths(noindexPathsPath);
console.log(`Validated ${slugs.size} content slugs across ${collections.length} collections.`);
console.log(`Wrote ${noindexPaths.length} noindex path(s) to ${noindexPathsPath}.`);
