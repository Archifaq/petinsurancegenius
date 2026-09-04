# Claude Project Upload Pack

Use these files to initialize the Claude project that reviews Codex work for
petinsurancegenius.com.

The Claude project has two jobs:

1. Review Codex checkpoints against the business, SEO, technical, and compliance
   constraints in `docs/`.
2. Produce precise implementation prompts that the owner can paste back into Codex.

Upload these files to Claude along with the authoritative source docs listed in
`UPLOAD_MANIFEST.md`.

Claude should not be treated as the code implementer. Codex remains the implementer;
Claude is the reviewer, verifier, and prompt writer.
