---
name: slice-driven-development
description: Use when the user wants to plan, implement, or steer a project through verifiable vertical slices; create or update roadmap, architecture, slice, and decision docs; answer slice-readiness questions; process implementation findings; draft the next slice; review a milestone; condense verification/examples after a milestone; or preserve architecture memory across separate implementation sessions.
---

# Slice-Driven Development

Use this skill when work should proceed through small, reviewable vertical slices rather than broad infrastructure phases.

The loop is:

```txt
plan -> slice brief -> answer open questions -> implementation -> findings -> decisions -> next slice -> milestone review -> condensation
```

## Core Rules

- Prefer vertical slices that prove end-to-end behavior.
- Keep only the current and next slice implementation-detailed. Future slices should contain only Goal, Scope, Non-Goals, and Open Questions. Do not add Implementation Tasks, Architecture Touchpoints, or detailed Verification criteria to a slice until it becomes the current or next slice.
- Do not build ahead unless the current slice cannot work without a small prerequisite.
- Treat open questions as slice-readiness gates, and treat implementation findings as design data.
- Capture user answers as durable docs, not only chat history.
- Push back when an answer creates brittleness, premature abstraction, or excessive scope.
- Preserve open questions until there is enough evidence to answer or explicitly defer them.
- Number milestones when the user has not already specified a milestone numbering scheme.
- Keep milestone and slice structure in the SDD docs and workflow. Product code should follow the best architecture for that product, not mirror milestone or slice boundaries.
- Treat slice-created verification code, examples, fixtures, generated artifacts, and package scripts as provisional until explicitly promoted.
- Preserve decision documents as durable history. Condense executable verification and examples so the repository validates the current milestone end-state instead of preserving every intermediate slice artifact.
- Treat Git branch switches, commits, and merges as deterministic action-script responsibilities. Do not perform Git ceremony inside Coordinator or Executor prompts unless the user explicitly asks you to debug the action system.
- Expect project description at `sdd/project-description.md`, roadmap context at `sdd/roadmap.md`, and portable workflow state at `sdd/index.json` when actions auto-fill prompts.
- Treat `sdd/index.json` as the shared SDD ledger for milestone and slice names, ordering, source paths, and statuses. Treat `.codex/sdd-state.json` as disposable Codex session cache only.

## Modes

This skill supports two complementary session modes.

### Mode Selection

At the start of every session using this skill, identify the active mode as either Coordinator Mode or Executor Mode.

If the user has not specified a mode:

- Use Coordinator Mode for planning, milestone design, slice-readiness questions, implementation findings, decisions, and next-slice drafting.
- Use Executor Mode only when the user explicitly asks to implement a slice or modify code.

State the selected mode before taking action. Do not mix Coordinator and Executor responsibilities in the same response unless the user explicitly requests a mode switch.

### Coordinator Mode

Use in a long-running planning or architecture session.

Responsibilities:

- maintain roadmap, architecture, slice, and decision docs
- process slice-readiness questions and implementation findings
- answer follow-up questions and push back where needed
- record accepted decisions and guardrails
- mark resolved questions in slice files
- draft the next slice when enough signal exists
- review milestone completion against milestone docs
- classify and condense provisional verification/examples before milestone merge
- rely on SDD action scripts for branch switches, commits, and merges

Authority boundaries:

- Coordinator Mode must not edit product code, tests, build files, schemas, migrations, runtime configuration, or other implementation artifacts.
- Coordinator Mode may suggest code changes, but the suggestions must remain scoped to the current slice.
- Coordinator Mode may update planning, architecture, slice, and decision docs.
- Coordinator Mode may inventory and recommend artifact cleanup, but it must switch to Executor Mode before editing product code, tests, examples, package scripts, or generated artifacts.
- Coordinator Mode may delegate code changes to a separate implementation session or sub-agent only when the user explicitly asks for delegation or orchestration.
- Delegated code changes must stay within the current slice. If a change is large enough to require reordering slices or adding a new slice, tell the user and update the relevant planning docs instead of expanding implementation scope.
- If the user wants the same session to make code changes, switch explicitly into Executor Mode before editing implementation artifacts.

Coordinator Mode preserves continuity across implementation sessions.

### Executor Mode

Use in a short implementation session for one slice.

Responsibilities:

- read the roadmap, architecture, current slice, and relevant decisions
- implement only the current slice
- verify the result
- avoid building ahead
- organize code according to the product's best architecture, not the milestone or slice document structure
- update docs only when implementation changes the plan
- label slice-created verification, fixtures, examples, scripts, and generated outputs as provisional unless they are promoted to durable coverage
- do not switch branches, commit, merge, or push; SDD action scripts handle those transitions
- end with changed files, run instructions, verification evidence, artifact disposition notes, and implementation findings or remaining questions for planning

Executor Mode should produce information the Coordinator Mode session can process.

## Planning Docs

Create or maintain this structure unless the repo already has an equivalent:

```txt
sdd/<milestone>/
  README.md
  architecture.md
  slices/
    00-...
    01-...
  decisions/
    00-...
    01-...
```

Shared project-level files:

```txt
sdd/
  project-description.md
  roadmap.md
  index.json
```

Use:

- `sdd/project-description.md` for the stable product description used by action prompts.
- `sdd/roadmap.md` for roadmap and prior milestone context used by action prompts.
- `sdd/index.json` for the portable milestone and slice ledger used by actions.
- `README.md` for roadmap, current files, and working rules.
- `architecture.md` for evolving system boundaries and durable contracts.
- `slices/` for one file per vertical slice.
- `decisions/` for accepted design decisions and guardrails.

Conventions:

- Use consistent two-digit numbering for milestones, slices, and decisions (e.g., `00-`, `01-`, `02-`). The milestone directory, slice files, and decision files all follow the same scheme. Do not use four-digit prefixes for decisions or letter prefixes for milestones.
- If the user has not specified milestone numbering, assign stable milestone numbers.
- Slice and decision documents should already be numbered.
- The docs structure is milestone and slice based, but the product code should use the architecture that best fits the product domain, framework, and runtime.
- Do not create source directories, modules, packages, APIs, or runtime concepts merely to match milestone or slice names.

## Workflow

For the full lifecycle, read `references/workflow.md`.

The shortest version:

1. Plan a numbered milestone.
2. Prepare one detailed current slice and lighter future slices.
3. Answer or explicitly defer the current slice's open questions in Coordinator Mode.
4. Implement one slice in Executor Mode.
5. Process implementation findings and update docs and decisions.
6. Repeat until the milestone is complete.
7. Review the milestone, then condense provisional verification and examples before merge.

Each slice should start only after its open questions have been handled well enough for execution.

Each slice should end with:

- a working demo or reviewable artifact
- verification evidence
- artifact disposition notes
- implementation findings or questions for later planning
- a decision checkpoint before the next slice

## Action-Driven Git

Use Codex Run actions as the workflow gate. The action runner owns Git and app-server mechanics; Coordinator and Executor sessions own judgment, implementation, and documentation.

Available project actions after installation:

- `SDD Actions Ready`: prints status only. It is first so accidental environment-triggered execution is harmless.
- `Ingest SDD Plan`: reads `sdd/roadmap.md`, milestone directories, and slice files into `sdd/index.json`.
- `Plan Milestone`: starts a Coordinator thread and auto-fills `sdd/project-description.md`, `sdd/roadmap.md`, and the next milestone number and name.
- `Start Milestone`: creates or switches to the accepted milestone branch, adds planning docs, and commits `Plan <milestone>`.
- `Start Slice`: after the current slice's open questions are answered or deferred, marks the slice active in `sdd/index.json`, creates the first slice branch or commits and merges the previous slice, then starts the next Executor thread.
- `Answer Questions`: marks the slice completed, commits answer-driven doc or decision updates with `Ansr <milestoneNumber>-<sliceNumber>-<sliceName>`, and merges the slice branch.
- `Review Milestone`: sends the review prompt to the Coordinator thread, leaving `<whatChanged>` for the user to fill in.
- `Close Milestone`: marks the milestone closed in `sdd/index.json`, commits reviewed milestone cleanup, and merges the milestone branch into trunk.

For setup and detailed branch behavior, read `references/actions.md` and `references/git-ceremony.md`.

## Open Question Handling

When the user answers open questions:

- Answer any follow-up questions directly.
- Push back on weak or risky answers.
- Account for every open question before marking it resolved.
- Classify each open question as `answered directly`, `answered indirectly`, `still open`, or `superseded`.
- If a question is answered indirectly by another answer or implementation finding, state that explicitly to the user and document which answer or finding resolved it.
- Update affected docs.
- Add a decision record when the answer changes architecture, workflow, contracts, or policy.
- Draft or refine the slice to be executed next if the answers create enough clarity.
- Do not rewrite history unless the decision truly supersedes earlier docs.

## Milestone Review and Condensation

Use this gate when all slices in a milestone are implemented and reviewed.

1. Compare the codebase to the milestone `README.md`, `architecture.md`, slice docs, and decisions.
2. Ask the user to state their understanding of what changed; confirm gaps or drift directly.
3. Inventory provisional verification code, fixtures, examples, generated outputs, and package scripts.
4. Classify each artifact as `promote`, `canonical example`, `merge`, `archive in docs`, or `delete`.
5. Preserve decision docs and slice docs as history.
6. Keep or create only the durable commands and examples needed to verify the milestone's current end-state.
7. Run the condensed verification commands and report the evidence before merge.

For detailed rules, read `references/artifact-lifecycle.md`.

## References

Load these only when needed:

- `references/workflow.md`: full SDD pipeline, stage gates, and mode responsibilities.
- `references/artifact-lifecycle.md`: provisional vs durable verification, examples, fixtures, package scripts, and milestone cleanup.
- `references/actions.md`: Codex Run action setup, auto-fill behavior, app-server usage, and deterministic Git transitions.
- `references/git-ceremony.md`: branch topology and the Git operations performed by action scripts.
- `references/slice-template.md`: slice file template.
- `references/decision-template.md`: decision record template.
- `references/prompts.md`: prompts for implementation and question-handling sessions.
