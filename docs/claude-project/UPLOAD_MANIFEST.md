# Upload Manifest for Claude Project

Upload these files to initialize or refresh the Claude project:

1. `docs/00-project-brief.md`
2. `docs/01-keyword-strategy.md`
3. `docs/02-technical-spec.md`
4. `docs/03-codex-master-prompt.md`
5. `docs/04-legal-compliance-checklist.md`
6. `docs/claude-project/CLAUDE_PROJECT_INSTRUCTIONS.md`
7. `docs/claude-project/CODEX_REVIEW_PROTOCOL.md`
8. `docs/claude-project/CODEX_PROMPT_TEMPLATE.md`
9. `docs/claude-project/CURRENT_PROJECT_STATE.md`
10. `docs/claude-project/CHECKPOINT_7_ACCEPTED_BASELINE.md`
11. `docs/claude-project/CHECKPOINT_8_REVIEW_PACK.md`

Historical checkpoint packs can be kept locally for reference, but they do not need
to be uploaded unless Claude asks to compare against an older implementation:

- `docs/claude-project/CHECKPOINT_1_CODE_SNAPSHOT.md`
- `docs/claude-project/CHECKPOINT_3_REVIEW_PACK.md`
- `docs/claude-project/CHECKPOINT_4_REVIEW_PACK.md`
- `docs/claude-project/CHECKPOINT_5_REVIEW_PACK.md`
- `docs/claude-project/CHECKPOINT_5_ACCEPTED_BASELINE.md`
- `docs/claude-project/CHECKPOINT_6_REVIEW_PACK.md`
- `docs/claude-project/CHECKPOINT_7_REVIEW_PACK.md`

After each future Codex checkpoint, upload:

- Updated code files touched by the checkpoint.
- Codex's checkpoint summary.
- Build/test output summary.
- Any reviewer comments already resolved.

Do not upload:

- `node_modules/`
- `dist/`
- `.astro/`
- `.env` files with secrets
- Cloudflare credentials or analytics API secrets
