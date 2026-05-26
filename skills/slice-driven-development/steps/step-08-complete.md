# Step 08 - Complete

## Purpose

Mark the SDD milestone complete after user acceptance.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode`.
- Do not read later step files unless this step routes there.
- Confirm all milestone gaps are resolved or explicitly accepted.
- Confirm unresolved questions are non-blocking or intentionally carried forward.
- Update durable state before routing.
- Return to this menu after overview requests or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- milestone README
- architecture doc
- accepted slice docs
- decision records
- unresolved questions
- verification summary

Do not edit product implementation files in this step.

## Expected Inputs

- User acceptance from milestone review.
- Review findings and accepted carry-forward items.
- Final milestone docs.

## Allowed Actions

- Mark the milestone complete.
- Update completion frontmatter.
- Write a concise completion summary.
- Show final overview.
- Route to initialization for another milestone when requested.

## Document Changes It May Make

- Milestone README frontmatter.
- Milestone README completion notes.
- Optional architecture or decision links if completion revealed missing references.

## Frontmatter Fields It Updates

- `status`
- `mode`
- `lastStep`
- `stepsCompleted`
- `completedAt`
- `updatedAt`
- `pendingQuestions`
- `implementationReports`

## Completion Procedure

1. Confirm all milestone gaps are resolved or explicitly accepted.
2. Confirm unresolved questions are non-blocking or intentionally carried forward.
3. Update README frontmatter:
   - `status: complete`
   - `lastStep: 8`
   - `stepsCompleted` includes all completed steps
   - `completedAt`
   - `updatedAt`
4. Produce a concise completion summary:
   - milestone
   - accepted slices
   - durable decisions
   - verification summary
   - unresolved carry-forward items
   - recommended next milestone or maintenance follow-up
5. Show the menu and stop.

## Menu

```text
Milestone marked complete.

[N] Start or plan another milestone
[O] Show final workflow overview
[X] Exit
```

## Routing

- `[N]`: save completion state, then load `step-01-init.md`.
- `[O]`: summarize final state and return to this menu.
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

- User has not accepted milestone review: route to `step-07-milestone-review.md`.
- Gaps remain unresolved: record them and ask whether to accept, defer, or plan another slice.
- Frontmatter is missing completion fields: update them before showing the menu.
- Completion summary conflicts with slice docs: ask for reconciliation before marking complete.

## Stop Rule

After showing the menu, stop. Do not start another milestone or show an overview without the user's menu choice.
