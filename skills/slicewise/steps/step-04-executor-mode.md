# Step 04 - Executor Mode

## Purpose

Implement exactly one current slice and end with the standard Executor report.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State clearly: `Executor Mode`.
- Read the milestone README, architecture doc, current slice, and relevant decisions before editing.
- Implement only the current slice.
- Do not build future slices.
- Do not expand scope to create abstractions not required by the current slice.
- Use product-appropriate architecture; product code must not mirror Slicewise document names unless that is naturally correct.
- Update planning docs only if implementation findings materially change the plan.
- Run project-appropriate verification.
- Update durable state before routing.
- Return to this menu after implementation amendments or report preparation.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read:

- milestone README
- `architecture.md`
- current slice file
- relevant decision records
- the project files needed to implement and verify this slice

Do not inspect or modify files solely for future slices.

## Expected Inputs

- A current slice selected in README frontmatter.
- A slice file detailed enough to implement.
- Relevant decisions and architecture notes.
- User approval to implement.

## Allowed Actions

- Modify product files needed for the current slice.
- Add or update verification that proves the current slice.
- Create provisional examples or generated artifacts only when needed to review the slice.
- Update Slicewise docs only for material implementation findings.
- Run project-appropriate checks.
- Produce the Executor report.

## Document Changes It May Make

- Product implementation files needed by the current slice.
- Verification files needed by the current slice.
- Current slice file, only for material implementation findings or report summary.
- Milestone README, only for report summary or state update.
- Architecture and decision docs, only when implementation changes durable design.

## Frontmatter Fields It Updates

- `mode`
- `lastStep`
- `stepsCompleted`
- `slices`
- `pendingQuestions`
- `implementationReports`
- `updatedAt`

## Report Format

Use `references/report-template.md`:

```text
Mode: Executor Mode
Milestone:
Slice:
Summary:
Changed files:
Behavior added:
How to run/review:
Verification performed:
Artifact disposition:
  - Provisional:
  - Promoted:
  - Generated:
  - Open:
Implementation findings:
Open questions:
Deviations from plan:
Recommended Coordinator follow-up:
```

## Menu

```text
Executor report complete.

[Q] Process this report in Coordinator Mode
[A] Amend or continue implementation within this slice
[P] Prepare a copyable report for another Coordinator session
[X] Exit
```

## Routing

- `[Q]`: update `mode: coordinator`, save the report summary in state, then load `step-05-process-report.md`.
- `[A]`: continue implementation only within current slice scope, rerun appropriate verification, update the report, and return to this menu.
- `[P]`: emit a copyable report and return to this menu.
- `[X]`: stop.

## Interrupt Handling

When the user says something that is not a menu command:

1. If it is feedback on the current implementation, incorporate it only within current slice scope and return to the same menu.
2. If it is new context, record it, update state if needed, and return to the same menu.
3. If it is an Executor report, replace or append to the active report summary, then route to `step-05-process-report.md`.
4. If it is an open-question answer, record it for Coordinator processing and return to the active menu unless it blocks implementation.
5. If it is a request to implement code, continue only within the current slice.
6. If it is a request to resume, route to `step-01b-continue.md`.
7. If it is out of scope, answer briefly, restate the current workflow position, and show the active menu.
8. Never abandon the active workflow state silently.

## Failure Modes

- Current slice is not ready: stop and route to `step-03-prepare-slice.md`.
- Implementation requires future-slice scope: stop, report the blocker, and recommend Coordinator follow-up.
- A real dependency is unavailable: surface the blocker instead of substituting placeholder behavior.
- Verification cannot run: explain why, record the gap, and include it in the report.
- Implementation changes a durable contract: update or recommend a decision record before ending.

## Stop Rule

After showing the report menu, stop. Do not process the report in Coordinator Mode until the user chooses `[Q]`.
