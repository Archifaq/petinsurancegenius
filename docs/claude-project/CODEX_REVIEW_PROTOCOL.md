# Codex Review Protocol

Use this protocol whenever the owner uploads a Codex checkpoint.

## Required Inputs

Ask the owner for these if missing:

- Codex checkpoint summary.
- Full code for files changed, or a single review pack containing the full code.
- Build/test results.
- Any known judgment calls or skipped/noindexed pages.

## Review Format

Return the review in this structure:

## Verdict

Use one:

- `Approved`
- `Approved with notes`
- `Changes required`

## Findings

List concrete issues first, ordered by severity.

For each finding include:

- Severity: `P0`, `P1`, `P2`, or `P3`
- File and line/section if available
- Problem
- Why it matters
- Required fix

If there are no issues, say so clearly.

## Compliance Checklist

Track the relevant items from `04-legal-compliance-checklist.md` section 7:

- Advertising/affiliate disclosure page published and linked
- Inline disclosures on every monetized page
- "Not an insurance agency" disclaimer site-wide
- "Not available in all states" language on state/carrier pages
- Privacy Policy published
- CCPA opt-out link if applicable
- No fabricated reviews, ratings, or urgency mechanics
- No on-site buy flow or carrier-specific quote generation
- Trademark spot-check assigned/completed by owner
- Backlink/history audit assigned/completed by owner

Use statuses:

- `Pass`
- `Needs changes`
- `Pending later checkpoint`
- `Owner-side`
- `Not applicable`

## SEO/Technical Checklist

Check against `02-technical-spec.md`:

- Astro static-first architecture
- Content Collections and Zod schemas
- Unique title/meta model
- Canonical URL support
- `noindex` support
- Sitemap excludes noindex pages
- Robots support
- JSON-LD support without fake Product/Review/rating schema
- Breadcrumb support
- `/go/[carrier]` redirect handler
- Outbound-click tracking on affiliate redirects
- Minimal JS
- Cloudflare Pages deployment target

## Codex Prompt

End with a paste-ready Codex prompt for the next step.

The prompt should include:

- Context files Codex must re-read if needed.
- Specific files to create or modify.
- Acceptance criteria.
- Build/test commands.
- Checkpoint review output required from Codex.

Do not ask Codex to publish real content batches until checkpoints 1-5 from the master
prompt are reviewed and approved.
