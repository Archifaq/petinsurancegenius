# Codex Prompt Template

Use this template when writing prompts for Codex.

```text
Read these files before editing:
- docs/00-project-brief.md
- docs/01-keyword-strategy.md
- docs/02-technical-spec.md
- docs/03-codex-master-prompt.md
- docs/04-legal-compliance-checklist.md

Task:
[Describe the checkpoint or fix.]

Files to create or modify:
- [file path]
- [file path]

Requirements:
- [Specific behavior]
- [Specific compliance requirement]
- [Specific SEO/technical requirement]

Do not:
- Remove or weaken affiliate disclosures.
- Add fake reviews, ratings, testimonials, or urgency mechanics.
- Add on-site quote, application, purchase, or insurance-sales flows.
- Invent numeric claims without sources.
- Publish/index thin placeholder content.

Acceptance criteria:
- `npm run build` passes.
- Relevant route(s) return expected status codes.
- No monetized page template renders without required disclosure.
- Any placeholder/generated content remains `noindex: true`.

Return for review:
- Summary of changes.
- Compliance checklist status.
- SEO/technical checklist status.
- Judgment calls.
- Skipped or noindexed pages and why.
- Full code for new/changed files, or a single review pack containing the full code.
```
