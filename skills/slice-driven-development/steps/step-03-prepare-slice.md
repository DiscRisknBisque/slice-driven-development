# Step 03 - Prepare Current Slice

## Purpose

Use Coordinator Mode as the readiness gate for exactly one current slice.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode`.
- Do not read later step files unless this step routes there.
- Do not implement code in this step.
- Do not proceed to Executor Mode without explicit `[E]`.
- Update durable state before routing.
- Return to this menu after amendments, questions, decisions, or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- milestone README
- `architecture.md`
- current slice file
- relevant decision records
- pending questions

Do not inspect future slice details unless needed to prevent accidental scope expansion.

## Expected Inputs

- A selected milestone.
- A current slice record in README frontmatter.
- A current slice file.
- Any user answers or readiness concerns.

## Allowed Actions

- Refine only the current slice.
- Classify open questions.
- Create or update decision records when answers change durable design.
- Generate a copyable Executor prompt.
- Mark the slice ready when readiness criteria are satisfied.
- Challenge answers that introduce brittleness, premature abstraction, or unnecessary scope.

## Document Changes It May Make

- Update current slice file.
- Update milestone README.
- Update `architecture.md`.
- Create or update decision records.

## Frontmatter Fields It Updates

- `mode`
- `lastStep`
- `stepsCompleted`
- `currentSlice`
- `nextSlice`
- `slices`
- `decisions`
- `pendingQuestions`
- `updatedAt`

## Readiness Requirements

Ensure the current slice has:

- goal
- reviewable demo or artifact
- scope
- non-goals
- relevant decisions
- architecture touchpoints
- implementation tasks
- verification criteria
- open questions
- completion criteria

Every execution-blocking question must be answered, explicitly deferred, or marked non-blocking.

Classify readiness questions as:

- `answered directly`
- `answered indirectly`
- `still open`
- `deferred but non-blocking`
- `superseded`

Create decision records when answers change architecture, contracts, runtime behavior, workflow policy, verification policy, security or safety boundaries, or ownership boundaries.

## Menu

```text
Current slice readiness check complete.

[A] Amend the slice
[Q] Answer or classify open questions
[D] Add or update decision records
[P] Prepare a copyable Executor prompt
[E] Enter Executor Mode in this session
[C] Mark slice ready
[X] Exit
```

## Routing

- `[A]`: update the slice and return to this menu.
- `[Q]`: process questions, update state, and return to this menu.
- `[D]`: update decisions, update state, and return to this menu.
- `[P]`: generate a prompt from `references/executor-prompt-template.md`, then return to this menu.
- `[E]`: update `mode: executor`, save state, then load `step-04-executor-mode.md`.
- `[C]`: mark the slice ready in README frontmatter, update `stepsCompleted` and `lastStep`, then stop with the recommended next action.
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

- Current slice file is missing: ask whether to recreate it from frontmatter or return to milestone planning.
- Blocking questions remain open: keep the slice not ready and show the question menu.
- User answer expands scope: challenge it and offer to defer or create a later slice.
- Decision impact is durable: create or update a decision record before marking ready.
- README state and slice file disagree: ask the user how to reconcile before editing.

## Stop Rule

After showing the menu, stop. Do not implement code in this step.
