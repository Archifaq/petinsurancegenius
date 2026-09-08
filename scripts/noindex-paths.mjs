import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const contentRoot = "src/content";
export const noindexPathsPath = ".astro/noindex-paths.json";
export const collections = [
  "guide",
  "breed",
  "state",
  "condition",
  "carrier-review",
  "comparison",
  "blog"
];

export function normalizedPath(slug) {
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

export function getMarkdownFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

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

export function readFrontmatter(filePath) {
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

export function collectNoindexPaths() {
  const noindexPaths = [];

  for (const collection of collections) {
    for (const filePath of getMarkdownFiles(join(contentRoot, collection))) {
      const frontmatter = readFrontmatter(filePath);

      if (typeof frontmatter.slug !== "string" || frontmatter.slug.length === 0) {
        throw new Error(`Missing frontmatter slug in ${filePath}`);
      }

      if (frontmatter.noindex !== false) {
        noindexPaths.push(normalizedPath(frontmatter.slug));
      }
    }
  }

  return [...new Set(noindexPaths)].sort();
}

export function writeNoindexPaths(filePath = noindexPathsPath) {
  const noindexPaths = collectNoindexPaths();
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(noindexPaths, null, 2)}\n`);
  return noindexPaths;
}
