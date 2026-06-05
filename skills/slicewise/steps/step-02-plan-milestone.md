# Step 02 - Plan Milestone

## Purpose

Use Coordinator Mode to plan or revise a milestone around reviewable vertical slices.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode`.
- Do not read later step files unless this step routes there.
- Do not proceed to slice preparation without explicit `[S]` or `[C]`.
- Update durable state before routing.
- Return to this menu after amendments, decisions, or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- `sw/project-description.md`, if present
- `sw/roadmap.md`, if present
- current milestone README
- current milestone `architecture.md`, if present
- existing slice files, if present
- existing decision records, if present

Do not edit product implementation files in this step.

## Expected Inputs

- Project description.
- Roadmap.
- User-provided milestone goal and constraints.
- Existing milestone docs, if any.
- Previous decisions, if any.

## Allowed Actions

- Draft or revise the milestone goal.
- Create vertical slices that produce reviewable behavior.
- Make the current slice implementation-ready.
- Make the next slice moderately detailed.
- Keep future slices lightweight.
- Record open questions.
- Identify decision records that are already needed.
- Challenge brittle assumptions, premature abstraction, and unnecessary scope.

## Document Changes It May Make

- Create or update `sw/<milestone>/README.md`.
- Create or update `sw/<milestone>/architecture.md`.
- Create or update files under `sw/<milestone>/slices/`.
- Create or update files under `sw/<milestone>/decisions/`.

## Frontmatter Fields It Updates

- `status`
- `mode`
- `lastStep`
- `sourceDocuments`
- `currentSlice`
- `nextSlice`
- `slices`
- `decisions`
- `pendingQuestions`
- `updatedAt`

On `[C]`, also update `stepsCompleted` to include step 2.

## Planning Rules

- Draft a concise milestone goal.
- Create vertical slices that produce reviewable behavior.
- Make the current slice implementation-ready.
- Make the next slice moderately detailed.
- Keep future slices lightweight with only:
  - Goal
  - Scope
  - Non-Goals
  - Risks/Open Questions
- Record open questions.
- Identify decision records that are already needed.
- Do not over-plan later slices.
- If frontmatter and body disagree, ask the user how to reconcile before overwriting.

## Menu

```text
Milestone plan drafted.

[A] Amend the plan
[D] Add or update decision records
[S] Prepare current slice
[C] Accept plan and continue
[X] Exit
```

## Routing

- `[A]`: treat the user response as feedback, revise the plan, update state, and return to this menu.
- `[D]`: create or update decision records, update state, and return to this menu.
- `[S]`: update `lastStep: 2`, ensure plan state is saved, then load `step-03-prepare-slice.md`.
- `[C]`: update `stepsCompleted` and `lastStep`, save state, then load `step-03-prepare-slice.md`.
- `[X]`: stop.

## Interrupt Handling

When the user says something that is not a menu command:

1. If it is feedback on the current draft, incorporate it and return to the same menu.
2. If it is new context, record it, update state if needed, and return to the same menu.
3. If it is an Executor report, route to `step-05-process-report.md`.
4. If it is an open-question answer, process or classify it if possible and return to the active menu.
5. If it is a request to implement code, enter Executor Mode only if the user explicitly asks for implementation.
6. If it is a request to resume, route to `step-01b-continue.md`.
7. If it is out of scope, answer briefly, restate the current workflow position, and show the active menu.
8. Never abandon the active workflow state silently.

## Failure Modes

- The milestone goal is too broad: ask the user to choose the first reviewable outcome.
- Future slices become too detailed: reduce them to lightweight planning fields.
- Open questions block execution: record them and keep the current slice not ready.
- Required decisions are unclear: create a proposed decision record and ask the user to accept, amend, or defer.
- Existing docs conflict with user context: summarize the mismatch and ask for reconciliation.

## Stop Rule

After showing the menu, stop. Do not proceed without explicit `[S]` or `[C]`.
