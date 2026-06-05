# Step 07 - Milestone Review

## Purpose

Use Coordinator Mode for milestone review, documentation drift detection, and artifact condensation planning.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode`.
- Do not read later step files unless this step routes there.
- Ask the user for their understanding of what changed.
- Do not self-certify success without user review.
- Recommend cleanup, but do not delete or change implementation artifacts unless the user explicitly enters Executor Mode for cleanup.
- Update durable state before routing.
- Return to this menu after amendments, decisions, or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- milestone README
- `architecture.md`
- slice docs
- decision records
- implementation reports
- inspectable codebase behavior where needed for review

Do not edit product implementation files in this step.

## Expected Inputs

- Completed or accepted slice records.
- User's understanding of milestone outcome.
- Existing milestone docs and reports.

## Allowed Actions

- Compare completed or accepted slices against milestone goals.
- Ask the user to describe what changed.
- Identify completed behavior, missing behavior, verification gaps, unresolved questions, documentation drift, decisions needing cleanup or supersession, and provisional artifacts needing disposition.
- Recommend artifact disposition.
- Update milestone docs and decisions.
- Create a cleanup slice when the user asks.

## Document Changes It May Make

- Milestone README.
- Architecture doc.
- Slice docs.
- Decision records.
- New cleanup slice file.

## Frontmatter Fields It Updates

- `status`
- `mode`
- `lastStep`
- `stepsCompleted`
- `slices`
- `decisions`
- `pendingQuestions`
- `implementationReports`
- `updatedAt`

## Review Procedure

1. Compare completed or accepted slices against milestone goals.
2. Ask the user for their understanding of what changed.
3. Compare the user's understanding against:
   - milestone README
   - architecture doc
   - slice docs
   - decisions
   - implementation reports
   - codebase behavior where inspectable
4. Identify:
   - completed behavior
   - missing behavior
   - verification gaps
   - unresolved questions
   - documentation drift
   - decisions needing cleanup or supersession
   - provisional artifacts needing disposition
5. Classify artifacts as:
   - `promote`
   - `canonical example`
   - `merge`
   - `archive in docs`
   - `delete`
   - `leave provisional`
6. Recommend cleanup, but leave implementation changes to Executor Mode.

## Menu

```text
Milestone review complete.

[A] Amend milestone docs
[D] Add or update decision records
[N] Plan another slice
[K] Prepare artifact cleanup slice
[C] Accept review and continue to completion
[X] Exit
```

## Routing

- `[A]`: update docs, update state, and return to this menu.
- `[D]`: update decisions, update state, and return to this menu.
- `[N]`: save state, then load `step-06-next-slice.md`.
- `[K]`: create a cleanup slice, update state, then load `step-03-prepare-slice.md`.
- `[C]`: save accepted review state, update `stepsCompleted`, then load `step-08-complete.md`.
- `[X]`: stop.

## Interrupt Handling

When the user says something that is not a menu command:

1. If it is feedback on the current draft, incorporate it and return to the same menu.
2. If it is new context, record it, update state if needed, and return to the same menu.
3. If it is an Executor report, route to `step-05-process-report.md`.
4. If it is an open-question answer, process or classify it and return to the active menu.
5. If it is a request to implement code, enter Executor Mode only if the user explicitly asks for implementation.
6. If it is a request to resume, route to `step-01b-continue.md`.
7. If it is out of scope, answer briefly, restate the current workflow position, and show the active menu.
8. Never abandon the active workflow state silently.

## Failure Modes

- User understanding differs from docs: identify the difference and ask which source should change.
- Verification gaps remain: record them and recommend another slice or cleanup slice.
- Provisional artifacts lack disposition: mark them open and ask for review.
- Decisions conflict or are stale: create a superseding decision record instead of rewriting history.
- Milestone is not ready: route to next-slice planning or current-slice preparation.

## Stop Rule

After showing the menu, stop. Do not mark the milestone complete until the user chooses `[C]`.
