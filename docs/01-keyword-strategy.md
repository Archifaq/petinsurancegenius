# Keyword & Content Strategy — Long-Tail / Local First

## 1. Core principle
Do not target head terms ("pet insurance", "best pet insurance"). Target the
**intersection of dimensions** below — that's where volume is low individually but the
combinatorial total is large, competition is thin, and buyer intent is often higher
(more specific query = closer to a decision).

## 2. Keyword dimensions to combine
Build a matrix and generate long-tail queries by combining 2–3 dimensions at a time:

1. **Species/breed**: dog, cat, specific breeds (French Bulldog, Golden Retriever,
   German Shepherd, Labrador, Maine Coon, etc.), mixed breed, senior pet, puppy/kitten.
2. **Condition/use-case**: hip dysplasia, cruciate ligament/ACL surgery, cancer, dental,
   allergies, pre-existing conditions, hereditary conditions, emergency vet visit,
   chronic illness, wellness/routine care.
3. **Geography**: state and major metro (California, Texas, Florida, New York, "near
   me" variants). State-level pages also let you address real state-specific facts:
   availability, waiting periods, and — importantly — the "not licensed/available in
   all states" disclaimer becomes content-relevant, not just legal boilerplate.
4. **Carrier/brand comparisons**: "[Carrier A] vs [Carrier B]", "[Carrier] review",
   "[Carrier] cost", "[Carrier] reddit" (informational, not affiliate-linkable
   directly but great for internal links to comparison pages).
5. **Price/cost intent**: "how much does pet insurance cost for a [breed]", "average
   pet insurance cost by state", "cheapest pet insurance for [condition]".
6. **Life stage / trigger events**: "just adopted a puppy insurance", "pet insurance
   before surgery", "pet insurance waiting period explained", "switching pet insurance
   providers".
7. **Question/informational modifiers**: does/is/can/how/what + insurance + specific
   scenario ("does pet insurance cover dental cleaning", "is pet insurance worth it for
   an indoor cat").

## 3. Example long-tail clusters (seed list — expand with real keyword-tool data before
building; these are illustrative patterns, not verified volumes)
- "pet insurance for [breed] with hip dysplasia"
- "best pet insurance for senior dogs in [state]"
- "pet insurance that covers pre-existing conditions [breed]"
- "how much is pet insurance for a [breed] puppy"
- "cheapest pet insurance in [state]"
- "pet insurance waiting period for cruciate ligament"
- "does pet insurance cover dental in [state]"
- "[Carrier] vs [Carrier] for cats"
- "pet insurance for multiple pets discount"
- "pet insurance for exotic pets / rabbits / birds"

## 4. Site architecture (pillar → cluster)
- **Pillar pages** (few, comprehensive, internal-link hubs): "Pet Insurance Guide",
  "Dog Insurance Guide", "Cat Insurance Guide", "Pet Insurance Cost Guide",
  "Pet Insurance by State" (hub linking to all state pages).
- **Cluster/leaf pages** (many, narrow, long-tail-targeted): breed pages, condition
  pages, state pages, carrier review/comparison pages, cost calculator/estimator
  pages, "vs" comparison pages.
- Every leaf page links up to its pillar and sideways to 2–4 related leaf pages
  (breed↔condition↔state crossovers). This internal linking is what lets a small
  site rank for long-tail terms it has no external authority for yet.

## 5. Content types by intent
| Intent | Page type | Primary CTA |
|---|---|---|
| Informational ("does X cover Y") | Explainer article | Soft CTA to pillar/comparison page |
| Commercial investigation ("best for [breed/state]") | Comparison/ranked list | Affiliate links with disclosure |
| Transactional ("[Carrier] quote/review") | Carrier review page | Affiliate link, clear disclosure |
| Tool/utility | Cost estimator (simple JS calculator, no real quoting) | Affiliate links as "get your real quote" |

## 6. Programmatic/scaled content — guardrails
Because many pages will be generated from templates (breed × state × condition), Codex
must avoid **thin/duplicate content** penalties:
- Each generated page needs genuinely distinct, useful content (not just swapped nouns
  in the same three paragraphs) — vary structure, add breed- or state-specific facts,
  real numbers where available, unique FAQs per page.
- No page should be created purely to rank with near-zero unique value; if a
  combination has nothing meaningful to say, don't generate that page.
- Use `noindex` for low-value auto-generated combinations rather than publishing
  thousands of near-duplicate indexable pages — quality-gate before indexing.
- Canonical tags, structured internal linking, and an accurate sitemap are mandatory
  (see technical spec).

## 7. Workflow for producing keyword batches
1. Start from this dimension matrix, pull real search-volume/difficulty data (Ahrefs,
   Semrush, or Google Keyword Planner via Codex-accessible tooling if available).
2. Cluster keywords into single-intent groups (one page per cluster, not one page per
   keyword).
3. Prioritize clusters where: search intent is clear, at least one relevant affiliate
   offer exists, and top-10 ranking pages are weak (thin content, low-authority sites,
   forums) rather than the big finance/media sites.
4. Batch clusters into content sprints (e.g., 20–30 pages per sprint) so Claude can
   review a manageable batch at a time before the next sprint starts.
