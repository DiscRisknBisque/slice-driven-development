# Artifact Lifecycle

Use this reference when a slice creates verification files, examples, fixtures, generated outputs, scripts, or package commands, and whenever a milestone is ready to merge.

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
- package scripts named after slice numbers
- temporary working directories

Durable artifacts include:

- regression tests or evaluations that protect current behavior
- canonical examples that explain current supported usage
- fixtures used by durable tests
- behavior-level package scripts
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

## Milestone Condensation

At milestone review, inventory:

- verification scripts and test entrypoints
- examples and demos
- fixtures, mock responses, and request files
- generated outputs and temporary working directories
- `package.json` scripts or equivalent task runner entries

Classify each artifact:

- `promote`: keep as durable regression/evaluation coverage
- `canonical example`: keep as the clearest example of current supported behavior
- `merge`: fold duplicated slice-specific checks into a broader durable command
- `archive in docs`: preserve the rationale or result in docs, but remove executable clutter
- `delete`: remove scratch, superseded, generated, or confusing artifacts

## Package Script Guidance

Prefer durable behavior-level commands after milestone condensation:

```txt
verify:presentation
verify:runtime-answer-loop
verify:presenter-agent
test:evaluations
demo:presentation
```

Treat slice-numbered commands as suspicious after the milestone closes:

```txt
presentation:slice05
answer:slice01
presenter:slice03:live
```

Slice-numbered commands may remain only when they are intentionally historical, clearly documented, and not part of the standard verification surface.

## Condensation Report

Before merge, report:

- durable verification commands that now define the milestone end-state
- canonical examples kept
- artifacts merged or removed
- package scripts renamed, removed, or retained
- verification evidence from the condensed commands
- any remaining cleanup risks

Do not delete decision records or slice files as part of condensation. If a decision is superseded, add or update a decision record instead of rewriting history.
