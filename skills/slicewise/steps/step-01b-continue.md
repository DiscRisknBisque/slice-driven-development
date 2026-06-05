# Step 01b - Continue Existing Workflow

## Purpose

Resume an existing Slicewise workflow from milestone README frontmatter.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode` unless the user explicitly requested implementation.
- Do not read later step files unless this step routes there.
- Do not overwrite existing work without explicit user approval.
- Update durable state before routing.
- Return to this menu after amendments, context capture, or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read only the detected Slicewise docs needed for continuation:

- all `sw/*/README.md` files with frontmatter
- selected milestone `README.md`
- selected milestone `architecture.md`
- selected milestone `slices/`
- selected milestone `decisions/`
- implementation report summaries referenced by the README

Do not inspect unrelated product files unless needed to explain an apparent inconsistency.

## Expected Inputs

- Existing milestone README frontmatter with `swWorkflow: true`.
- Optional user preference about which milestone to resume.
- Optional new context or report to process.

## Allowed Actions

- Read and compare all detected milestone frontmatter records.
- Present choices when multiple active milestones exist.
- Summarize current workflow state.
- Identify inconsistencies and ask for reconciliation.
- Route to the next user-approved step.

## Document Changes It May Make

- Repair incomplete or stale README frontmatter only after user approval.
- Add a short continuation note to the milestone README if the user provides new durable context.
- Record report paths or summaries when the user provides them.

## Frontmatter Fields It Updates

- `mode`
- `lastStep`
- `sourceDocuments`
- `currentSlice`
- `nextSlice`
- `slices`
- `decisions`
- `pendingQuestions`
- `implementationReports`
- `updatedAt`

## Procedure

1. Read all detected milestone README frontmatter.
2. If multiple active milestones exist, present choices and stop until the user selects one.
3. For the selected milestone, inspect:
   - milestone README
   - `architecture.md`
   - `slices/`
   - `decisions/`
   - implementation report summaries
4. Summarize:
   - milestone status
   - last step
   - steps completed
   - current slice
   - next slice
   - slice statuses
   - pending questions
   - implementation reports needing processing
   - decision records
   - apparent inconsistencies
5. If frontmatter and body disagree, ask the user how to reconcile before editing.
6. Show the menu and stop.

## Menu

```text
Welcome back. I found existing Slicewise workflow state.

[R] Resume from recorded workflow state
[P] Plan or revise milestone
[S] Prepare current slice
[E] Enter Executor Mode for current slice
[Q] Process implementation report or open questions
[N] Draft or promote next slice
[V] Review milestone
[O] Show workflow overview
[X] Exit
```

## Routing

- `[R]`: route from `lastStep`, `stepsCompleted`, current slice status, and pending report state:
  - pending implementation report: load `step-05-process-report.md`
  - no accepted milestone plan: load `step-02-plan-milestone.md`
  - current slice missing or not ready: load `step-03-prepare-slice.md`
  - current slice ready and user wants implementation: load `step-04-executor-mode.md`
  - current slice accepted and next slice exists: load `step-06-next-slice.md`
  - milestone appears ready for review: load `step-07-milestone-review.md`
  - milestone marked complete: load `step-08-complete.md`
- `[P]`: update `lastStep: 1`, then load `step-02-plan-milestone.md`.
- `[S]`: update `lastStep: 1`, then load `step-03-prepare-slice.md`.
- `[E]`: update `mode: executor`, then load `step-04-executor-mode.md`.
- `[Q]`: update `lastStep: 1`, then load `step-05-process-report.md`.
- `[N]`: update `lastStep: 1`, then load `step-06-next-slice.md`.
- `[V]`: update `lastStep: 1`, then load `step-07-milestone-review.md`.
- `[O]`: summarize the eight-step workflow and return to this menu.
- `[X]`: stop.

## Interrupt Handling

When the user says something that is not a menu command:

1. If it is feedback on the current draft, incorporate it and return to the same menu.
2. If it is new context, record it, update state if needed, and return to the same menu.
3. If it is an Executor report, route to `step-05-process-report.md`.
4. If it is an open-question answer, process or classify it if possible and return to the active menu.
5. If it is a request to implement code, enter Executor Mode only if the user explicitly asks for implementation.
6. If it is a request to resume, remain in this step and resummarize state.
7. If it is out of scope, answer briefly, restate the current workflow position, and show the active menu.
8. Never abandon the active workflow state silently.

## Failure Modes

- Multiple active milestones: ask the user to choose one.
- Missing selected milestone docs: summarize what is missing and ask whether to recover or reinitialize.
- Corrupted frontmatter: scan milestone docs for bounded recovery and ask the user to confirm.
- Pending reports lack enough detail: ask for the report text or path.
- Current slice record points to a missing file: ask whether to recreate, select another slice, or revise the plan.

## Stop Rule

After showing the menu, stop. Do not resume or route until the user chooses a menu option.
