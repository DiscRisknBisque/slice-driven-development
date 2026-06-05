# Artifact Lifecycle

Use this reference when a slice creates verification files, examples, fixtures, generated outputs, scripts, or review artifacts, and whenever a milestone is ready for review.

## Principle

Decision docs and slice docs are durable memory. Verification code and examples are executable surface area. Preserve the first as history; curate the second so future contributors understand how to verify the current system.

## Default Status

Artifacts created during a slice are provisional unless explicitly promoted.

Provisional artifacts include:

- slice-specific verification scripts
- scratch examples and demos
- copied fixtures or scenes
- mock responses and request files
- generated verification output
- temporary working directories

Durable artifacts include:

- regression tests or evaluations that protect current behavior
- canonical examples that explain current supported usage
- fixtures used by durable tests
- behavior-level task entries
- docs that record decisions, architecture, and slice history

## End-of-Slice Reporting

Executor Mode should include an artifact disposition note:

```txt
Artifact disposition:
- Provisional: <files/scripts created only to prove this slice>
- Promoted: <files/scripts that should remain durable>
- Generated: <outputs that can be deleted or regenerated>
- Open: <artifacts needing Coordinator/user decision>
```

## Milestone Review

At milestone review, inventory:

- verification scripts and test entrypoints
- examples and demos
- fixtures, mock responses, and request files
- generated outputs and temporary working directories
- task entries that expose verification or demos

Classify each artifact:

- `promote`: keep as durable regression or evaluation coverage
- `canonical example`: keep as the clearest example of current supported behavior
- `merge`: fold duplicated slice-specific checks into a broader durable check
- `archive in docs`: preserve the rationale or result in docs, but remove executable clutter
- `delete`: remove scratch, superseded, generated, or confusing artifacts
- `leave provisional`: keep temporarily with an explicit follow-up

## Completion Guidance

Before marking the milestone complete, report:

- durable verification checks that now define the milestone end-state
- canonical examples kept
- artifacts combined, documented, removed, or carried forward
- verification evidence from the durable checks
- any remaining cleanup risks

For external workflow tooling, artifact disposition can become a checkpoint. The skill itself only recommends disposition unless the user explicitly enters Executor Mode for cleanup.

Do not delete decision records or slice files as part of condensation. If a decision is superseded, add or update a decision record instead of rewriting history.
