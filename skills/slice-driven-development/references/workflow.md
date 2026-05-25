# Slice-Driven Development Workflow

This reference is the full lifecycle contract for Slice-Driven Development. Use it when planning a milestone, preparing an implementation prompt, processing post-slice findings, reviewing a milestone, or deciding whether artifacts should be condensed. Git transitions are handled by SDD actions, not by Coordinator or Executor chat prompts.

## Roles

### Coordinator Mode

Coordinator Mode owns planning memory and workflow gates.

It may:

- create and maintain roadmap, architecture, slice, and decision docs
- classify and process post-slice questions
- record accepted decisions and guardrails
- draft the next slice when enough signal exists
- compare milestone implementation against milestone docs
- inventory provisional verification and examples
- recommend cleanup before milestone merge
- rely on SDD actions for branch/status transitions
- treat `sdd/index.json` as the portable milestone and slice ledger

It must not edit product code, tests, runtime configuration, build files, examples, fixtures, generated outputs, or package scripts unless the session explicitly switches into Executor Mode.

### Executor Mode

Executor Mode owns one implementation slice at a time.

It may:

- read milestone docs and decisions
- implement only the current slice
- add provisional verification, examples, fixtures, or scripts needed to prove the slice
- promote verification artifacts when the promotion is explicit and aligned with existing project architecture
- update docs only when implementation changes the plan
- avoid branch switches, commits, merges, and pushes; actions perform those mechanics

It must end with changed files, run instructions, verification evidence, artifact disposition notes, and remaining open questions.

## Pipeline

### 0. Ingest or Refresh the SDD Ledger

Run `Ingest SDD Plan` for new projects and for existing in-progress projects being adopted into SDD.

Exit criteria:

- `sdd/index.json` exists
- roadmap milestone headings have been captured
- existing milestone directories and slice docs have been reconciled
- unknown existing progress is marked `unknown`, not guessed as completed

### 1. Plan a Numbered Milestone

Create or update:

```txt
sdd/<milestone>/
  README.md
  architecture.md
  slices/
  decisions/
```

The current slice and next slice may include implementation detail. Future slices should stay light: Goal, Scope, Non-Goals, and Open Questions.

Exit criteria:

- milestone goal is clear
- current slice is detailed enough to implement
- future slices are directional rather than over-specified
- relevant risks and open questions are recorded
- planning docs are ready for the `Start Milestone` action

### 2. Prepare One Slice

Before implementation, the Coordinator should produce or confirm an Executor prompt that names:

- milestone docs to read
- current slice file
- relevant decisions
- explicit non-goals
- verification expectations

Exit criteria:

- Executor has enough context to implement one vertical slice
- scope boundaries are explicit
- verification is observable
- slice work starts after the `Start Slice` action marks the slice active in `sdd/index.json` and creates the slice branch

### 3. Implement One Slice

The Executor implements only the current slice and verifies it.

Slice-created verification code, examples, fixtures, generated outputs, and package scripts are provisional by default. Name or report them as provisional unless they are deliberately promoted to durable coverage.

Exit criteria:

- working demo or reviewable artifact exists
- verification evidence is reported
- artifact disposition notes identify provisional and durable artifacts
- open questions are reported
- implementation changes are ready for the next action

### 4. Review and Answer Open Questions

The user reviews the implementation and answers remaining questions. The Coordinator classifies each open question as:

- `answered directly`
- `answered indirectly`
- `still open`
- `superseded`

Exit criteria:

- every open question is accounted for
- accepted decisions are recorded
- architecture docs reflect durable changes
- the next slice is drafted or the current slice is refined

### 5. Commit and Merge the Slice

Use the SDD actions for deterministic Git transitions.

If there were no open questions, run `Start Slice` from the current slice branch. It marks the current slice completed, commits the implementation, merges it into the milestone branch, creates the next slice branch when one exists, and starts the next Executor thread.

If there were open questions, discuss them with the Coordinator first, then run `Answer Questions` from the slice branch. It marks the current slice completed, commits the answer-driven docs, and merges the slice branch into the milestone branch.

Recommended commit messages:

- `Plan <milestone>`
- `Start <milestone>-<slice>`
- `Impl <milestone>-<slice>`
- `Ansr <milestone>-<slice>`

Exit criteria:

- implementation or answer changes are committed by the action
- slice branch is merged into the milestone branch by the action
- next slice starts only after the action reaches a clean branch state

### 6. Review and Condense the Milestone

When all slices are complete, compare the final codebase to the milestone docs and the user's stated understanding of the milestone outcome.

Then perform artifact condensation before merging to trunk. The goal is to keep the repository's executable surface focused on the milestone's current end-state while preserving planning and decision docs as history.

Exit criteria:

- milestone gaps or drift are identified
- durable verification commands pass
- provisional artifacts are promoted, merged, documented, or removed
- package scripts use durable behavior-level names where practical
- decision docs and slice docs remain available as the historical trail
- milestone condensation changes are ready for the `Close Milestone` action

For detailed artifact rules, see `artifact-lifecycle.md`.
For action behavior, see `actions.md`.
