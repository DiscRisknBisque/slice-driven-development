---
name: slice-driven-development
description: Use when the user wants to plan, implement, or steer a project through verifiable vertical slices; create or update roadmap, architecture, slice, and decision docs; process post-slice questions; draft the next slice; or preserve architecture memory across separate implementation sessions.
---

# Slice-Driven Development

Use this skill when work should proceed through small, reviewable vertical slices rather than broad infrastructure phases.

The loop is:

```txt
plan -> slice brief -> implementation session -> post-slice questions -> decisions -> next slice
```

## Core Rules

- Prefer vertical slices that prove end-to-end behavior.
- Keep only the current and next slice implementation-detailed.
- Do not build ahead unless the current slice cannot work without a small prerequisite.
- Treat post-implementation questions as design data.
- Capture user answers as durable docs, not only chat history.
- Push back when an answer creates brittleness, premature abstraction, or excessive scope.
- Preserve open questions until implementation provides enough evidence.
- Number milestones when the user has not already specified a milestone numbering scheme.
- Keep milestone and slice structure in the docs and workflow. Product code should follow the best architecture for that product, not mirror milestone or slice boundaries.

## Modes

This skill supports two complementary session modes.

### Mode Selection

At the start of every session using this skill, identify the active mode as either Coordinator Mode or Executor Mode.

If the user has not specified a mode:

- Use Coordinator Mode for planning, milestone design, post-slice questions, decisions, and next-slice drafting.
- Use Executor Mode only when the user explicitly asks to implement a slice or modify code.

State the selected mode before taking action. Do not mix Coordinator and Executor responsibilities in the same response unless the user explicitly requests a mode switch.

### Coordinator Mode

Use in a long-running planning or architecture session.

Responsibilities:

- maintain roadmap, architecture, slice, and decision docs
- process implementation findings and post-slice questions
- answer follow-up questions and push back where needed
- record accepted decisions and guardrails
- mark resolved questions in slice files
- draft the next slice when enough signal exists

Authority boundaries:

- Coordinator Mode must not edit product code, tests, build files, schemas, migrations, runtime configuration, or other implementation artifacts.
- Coordinator Mode may suggest code changes, but the suggestions must remain scoped to the current slice.
- Coordinator Mode may update planning, architecture, slice, and decision docs.
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
- end with changed files, run instructions, verification evidence, artifacts, and remaining open questions

Executor Mode should produce information the Coordinator Mode session can process.

## Planning Docs

Create or maintain this structure unless the repo already has an equivalent:

```txt
docs/<milestone>/
  README.md
  architecture.md
  slices/
    00-...
    01-...
  decisions/
    0001-...
```

Use:

- `README.md` for roadmap, current files, and working rules.
- `architecture.md` for evolving system boundaries and durable contracts.
- `slices/` for one file per vertical slice.
- `decisions/` for accepted design decisions and guardrails.

Conventions:

- If the user has not specified milestone numbering, assign stable milestone numbers.
- Slice and decision documents should already be numbered.
- The docs structure is milestone and slice based, but the product code should use the architecture that best fits the product domain, framework, and runtime.
- Do not create source directories, modules, packages, APIs, or runtime concepts merely to match milestone or slice names.

## Slice Workflow

1. Read the roadmap, architecture doc, current slice file, and relevant decisions.
2. If planning, draft or update the slice brief.
3. If implementing, implement only that slice and verify it.
4. After implementation, process open questions with the user.
5. Update architecture and decision docs based on answers.
6. Mark resolved questions in the slice file.
7. Draft the next slice only when enough signal exists.

Each slice should end with:

- a working demo or reviewable artifact
- verification evidence
- open questions
- a decision checkpoint before the next slice

## Post-Slice Question Handling

When the user answers open questions:

- Answer any follow-up questions directly.
- Push back on weak or risky answers.
- Account for every open question before marking it resolved.
- Classify each open question as `answered directly`, `answered indirectly`, `still open`, or `superseded`.
- If a question is answered indirectly by another answer or implementation finding, state that explicitly to the user and document which answer or finding resolved it.
- Update affected docs.
- Add a decision record when the answer changes architecture, workflow, contracts, or policy.
- Draft the next slice if the answers create enough clarity.
- Do not rewrite history unless the decision truly supersedes earlier docs.

## References

Load these only when needed:

- `references/slice-template.md`: slice file template.
- `references/decision-template.md`: decision record template.
- `references/prompts.md`: prompts for implementation and post-slice sessions.
