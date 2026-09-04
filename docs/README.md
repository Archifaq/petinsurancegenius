# Pet Insurance SEO Project — File Set

Load all five files below into the Codex project. `03-codex-master-prompt.md` is the
entry-point instruction; it references the other four as context.

1. `00-project-brief.md` — business context, domain-history risk notes, roles
2. `01-keyword-strategy.md` — long-tail/local keyword and content architecture
3. `02-technical-spec.md` — Astro technical/SEO build spec
4. `03-codex-master-prompt.md` — **the prompt to give Codex directly**
5. `04-legal-compliance-checklist.md` — US compliance research + checklist

## How this is meant to work
- Codex builds against files 1–4 as its instructions/context and file 5 as a hard
  constraint list.
- Claude (in this chat/project) reviews Codex's output against the same files —
  particularly the compliance checklist and the technical spec's on-page SEO
  requirements — before content batches go live.
- Two owner-side action items are called out (not things Codex can do): a trademark
  spot-check on the working brand name, and a backlink/history audit of the domain.
  Do these before or in parallel with the build, not as a blocker to starting Codex.

## Known assumption to correct if wrong
These files assume the domain is **petinsurancegenius.com**. If that's not the exact
domain, do a find-and-replace before handing the files to Codex — nothing else in the
strategy depends on the exact string.
