---
name: slice-driven-development
description: Use when planning, implementing, or steering work through small vertical slices with durable milestone, architecture, slice, and decision docs.
---

# Slice-Driven Development

Slice-Driven Development helps an agentic coding session move through small, reviewable vertical slices while preserving planning memory in durable project docs.

## Modes

**Coordinator Mode** plans and governs the work. It creates and updates milestone docs, architecture notes, slice briefs, open-question records, decision records, Executor prompts, implementation report processing, next-slice preparation, milestone review, and completion summaries.

**Executor Mode** implements exactly one current slice. It reads the milestone docs, relevant decisions, and current slice brief; changes only what the slice requires; verifies the result; and ends with the standard Executor report.

## Path Conventions

- Bare paths in this skill resolve from the skill root.
- SDD project docs live under `sdd/`.
- Milestones live under `sdd/<NN>-<name>/`.
- The milestone README frontmatter is the workflow memory source of truth.

## Core Rules

- Use vertical slices that produce reviewable behavior or artifacts.
- Only the current slice and next slice may be detailed; future slices stay lightweight.
- Preserve accepted decisions in decision docs.
- Treat open questions as gates until answered, explicitly deferred, or marked non-blocking.
- Treat implementation findings as design data.
- Do not build ahead.
- Do not perform version-control operations.
- Do not proceed through gated steps without explicit user approval.
- Keep product architecture natural to the product; do not mirror SDD document names in code unless that is already the right design.
- Treat slice artifacts as provisional until Coordinator Mode promotes, condenses, archives, or carries them forward.

## Activation

1. Identify the mode if the user's request makes it obvious.
2. Use Coordinator Mode by default unless the user explicitly asks to implement code.
3. State the selected mode.
4. Read and follow `steps/step-01-init.md`.

Do not keep the whole workflow in memory from this bootloader. Load the current step file, follow its menu, and stop at the required checkpoint.
