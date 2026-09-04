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
