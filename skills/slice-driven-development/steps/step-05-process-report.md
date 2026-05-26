# Step 05 - Process Report And Open Questions

## Purpose

Use Coordinator Mode to process Executor reports, user review, implementation findings, and open questions.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode`.
- Do not read later step files unless this step routes there.
- Do not edit product implementation files in this step.
- Classify every report finding and question.
- Update durable state before routing.
- Return to this menu after amendments, decisions, or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- Executor report
- user feedback
- current slice
- milestone README
- architecture doc
- decisions
- implementation findings

Inspect product behavior only when needed to understand the report or user feedback.

## Expected Inputs

- A structured Executor report or equivalent user summary.
- User review notes.
- Current slice docs and state.

## Allowed Actions

- Classify questions and findings.
- Challenge risky answers, brittle assumptions, premature abstractions, and scope expansion.
- Update SDD docs and decisions.
- Preserve unresolved questions.
- Decide the current slice status.
- Draft follow-up recommendations.

## Document Changes It May Make

- Current slice file.
- Milestone README.
- `architecture.md`.
- Decision records.
- Report summary sections in docs.

## Frontmatter Fields It Updates

- `mode`
- `lastStep`
- `stepsCompleted`
- `currentSlice`
- `nextSlice`
- `slices`
- `decisions`
- `pendingQuestions`
- `implementationReports`
- `updatedAt`

## Processing Rules

Classify each question or finding as:

- `answered directly`
- `answered indirectly`
- `still open`
- `superseded`
- `deferred but non-blocking`

Create decision records when findings change architecture, contracts, runtime behavior, verification policy, workflow policy, safety or security boundaries, or ownership boundaries.

Decide whether the current slice is:

- `implemented`
- `accepted`
- `needs_revision`
- `blocked`

Summarize all changed docs and state updates.

## Menu

```text
Post-slice processing complete.

[A] Amend answers or findings
[D] Add or update decision records
[N] Draft or promote next slice
[S] Return to current slice preparation
[V] Review milestone
[X] Exit
```

## Routing

- `[A]`: process feedback, update docs/state, and return to this menu.
- `[D]`: create or update decision records, update docs/state, and return to this menu.
- `[N]`: update state, then load `step-06-next-slice.md`.
- `[S]`: update state, then load `step-03-prepare-slice.md`.
- `[V]`: update state, then load `step-07-milestone-review.md`.
- `[X]`: stop.

## Interrupt Handling

When the user says something that is not a menu command:

1. If it is feedback on the current draft, incorporate it and return to the same menu.
2. If it is new context, record it, update state if needed, and return to the same menu.
3. If it is an Executor report, process it in this step and return to the active menu.
4. If it is an open-question answer, process or classify it and return to the active menu.
5. If it is a request to implement code, enter Executor Mode only if the user explicitly asks for implementation.
6. If it is a request to resume, route to `step-01b-continue.md`.
7. If it is out of scope, answer briefly, restate the current workflow position, and show the active menu.
8. Never abandon the active workflow state silently.

## Failure Modes

- Report lacks changed files or verification: ask for missing details or mark the report incomplete.
- User accepts behavior with unresolved blockers: ask whether blockers are deferred or require revision.
- Finding changes architecture: create a decision record before marking accepted.
- Report and docs disagree: call out the mismatch and ask for reconciliation.
- Current slice cannot be accepted: mark `needs_revision` or `blocked` and route back to preparation.

## Stop Rule

After showing the menu, stop. Do not draft the next slice, return to preparation, or review the milestone without the user's menu choice.
