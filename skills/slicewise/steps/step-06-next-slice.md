# Step 06 - Next Slice

## Purpose

Use Coordinator Mode to move from one completed or accepted slice to the next slice without performing external workflow mechanics.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode`.
- Do not read later step files unless this step routes there.
- Confirm whether the current slice can be marked accepted before promoting the next slice.
- Keep future slices lightweight.
- Update durable state before routing.
- Return to this menu after amendments or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- milestone README
- current slice file
- next slice file, if present
- future slice summaries
- architecture doc
- relevant decisions
- pending questions and report summaries

Do not edit product implementation files in this step.

## Expected Inputs

- Current slice status.
- User acceptance or revision notes.
- Next slice candidate.
- Implementation findings that affect ordering or scope.

## Allowed Actions

- Confirm current slice acceptance.
- Promote the next slice to current when appropriate.
- Draft or refine the new current slice.
- Draft or refine the new next slice.
- Keep future slices lightweight.
- Update README frontmatter and slice docs.
- Generate a copyable Executor prompt.

## Document Changes It May Make

- Milestone README.
- Current slice file.
- New current slice file.
- New next slice file.
- Architecture doc or decisions only when ordering changes reveal durable design changes.

## Frontmatter Fields It Updates

- current slice status in `slices`
- `currentSlice`
- `nextSlice`
- `slices`
- `pendingQuestions`
- `lastStep`
- `stepsCompleted`
- `updatedAt`

## Procedure

1. Confirm whether the current slice can be marked accepted.
2. If accepted, update the previous current slice status.
3. Promote the appropriate next slice to current.
4. Draft or refine the new current slice to full readiness-detail.
5. Draft or refine the new next slice to moderate detail.
6. Reduce later slices to lightweight summaries if they have drifted into over-planning.
7. Update milestone README frontmatter.
8. Show the menu and stop.

## Menu

```text
Next-slice planning complete.

[S] Prepare new current slice
[P] Prepare a copyable Executor prompt
[A] Amend slice sequence or scope
[V] Review milestone
[X] Exit
```

## Routing

- `[S]`: save state, then load `step-03-prepare-slice.md`.
- `[P]`: generate a prompt from `references/executor-prompt-template.md`, then return to this menu.
- `[A]`: revise slice ordering or scope, update docs/state, and return to this menu.
- `[V]`: save state, then load `step-07-milestone-review.md`.
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

- Current slice is not accepted: route to report processing or slice preparation instead of promoting.
- No next slice exists: ask whether to plan another slice or review the milestone.
- Next slice is too vague: draft only enough detail for readiness preparation.
- Future slices are over-detailed: condense them back to lightweight summaries.
- Acceptance depends on unresolved questions: keep the questions pending and ask for user confirmation.

## Stop Rule

After showing the menu, stop. Do not prepare the new current slice or review the milestone without the user's menu choice.
