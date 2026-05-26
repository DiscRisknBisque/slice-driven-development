# Slice-Driven Development

Slice-Driven Development (SDD) is a universal Agent Skill for steering coding work through small, reviewable vertical slices.

It is designed for any agentic coding harness that can read files, edit files, ask the user questions, and follow a skill prompt. The skill does not depend on a particular vendor, local app, automation service, or repository workflow.

## Why Vertical Slices

Vertical slices keep progress concrete. Each slice should produce behavior or an artifact that a reviewer can run, inspect, or discuss.

SDD uses slices to preserve:

- small review boundaries
- visible user value or system behavior
- durable architecture memory
- explicit open-question handling
- decision records instead of chat-only reasoning
- post-implementation findings as design input

Only the current slice and next slice should be detailed. Future slices stay lightweight until there is enough evidence to plan them well.

## Coordinator Mode And Executor Mode

SDD has two modes.

**Coordinator Mode** owns planning, workflow state, questions, decisions, next-slice preparation, milestone review, and completion. It updates SDD docs and asks the user to make decisions at gates.

**Executor Mode** implements exactly one current slice. It reads the milestone docs, relevant decisions, and current slice brief; changes only what that slice requires; verifies the result; and ends with a structured report for Coordinator Mode.

The user remains the reviewer and decision-maker. SDD can recommend, challenge, and record, but it should not silently decide that a gated workflow step is complete.

## Guided Step Workflow

The skill is organized as a micro-file workflow:

```txt
skills/slice-driven-development/
  SKILL.md
  steps/
    step-01-init.md
    step-01b-continue.md
    step-02-plan-milestone.md
    step-03-prepare-slice.md
    step-04-executor-mode.md
    step-05-process-report.md
    step-06-next-slice.md
    step-07-milestone-review.md
    step-08-complete.md
  references/
    state-schema.md
    milestone-readme-template.md
    architecture-template.md
    slice-template.md
    decision-template.md
    executor-prompt-template.md
    report-template.md
    artifact-lifecycle.md
    prompts.md
```

`SKILL.md` is only a bootloader. The active step file contains the operating rules, context boundaries, allowed edits, state updates, menu, routing, interrupt handling, failure modes, and stop rule.

Every menu is a transaction boundary. The agent should stop after showing the menu and wait for explicit user approval before routing to a later step.

## Workflow Memory

The milestone README frontmatter is the durable workflow source of truth:

```txt
sdd/<NN>-<milestone-name>/README.md
```

Example fields include:

- `sddWorkflow`
- `status`
- `mode`
- `lastStep`
- `stepsCompleted`
- `currentSlice`
- `nextSlice`
- `slices`
- `decisions`
- `pendingQuestions`
- `implementationReports`

The full schema lives in `skills/slice-driven-development/references/state-schema.md`.

If an older `sdd/index.json` exists, SDD may read it as migration context. It is optional derived state for external tooling, not the skill-owned source of truth.

## SDD Docs Layout

Projects using SDD usually keep:

```txt
sdd/
  project-description.md
  roadmap.md
  <NN>-<milestone-name>/
    README.md
    architecture.md
    slices/
      <NN>-<slice-name>.md
    decisions/
      <NN>-<decision-title>.md
```

Milestone docs preserve what the team intended, what changed, which decisions were accepted, what questions remain, and what evidence exists.

## Open Questions

Open questions are readiness gates. Before a slice is implemented, each execution-blocking question should be:

- answered directly
- answered indirectly
- still open
- deferred but non-blocking
- superseded

Coordinator Mode should challenge answers that create brittleness, premature abstraction, or unnecessary scope.

## Decision Records

Decision records are for durable changes to architecture, contracts, workflow policy, runtime behavior, verification policy, safety or security boundaries, and ownership boundaries.

They are not for incidental implementation details unless the detail becomes a precedent.

## Executor Reports

Every Executor Mode session ends with the standard report:

```txt
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

Coordinator Mode processes this report, updates durable docs, classifies findings and questions, and decides whether the slice is implemented, accepted, needs revision, or blocked.

## Artifact Lifecycle

Slice-created verification, examples, fixtures, generated outputs, scripts, and demos are provisional until milestone review.

At milestone review, Coordinator Mode recommends whether artifacts should be promoted, kept as canonical examples, combined into durable checks, archived in docs, deleted, or left provisional with an explicit follow-up.

Before marking the milestone complete, the docs should explain the final artifact disposition and the durable verification story.

## Installation And Usage

Install or reference the `skills/slice-driven-development/` directory in any harness that supports Agent Skills or equivalent skill prompts.

Typical prompts:

```txt
Activate the slice-driven-development skill.
Use Slice-Driven Development in Coordinator Mode.
```

```txt
Activate the slice-driven-development skill.
Use Slice-Driven Development in Executor Mode.
```

On activation, the skill reads `steps/step-01-init.md`, detects existing workflow state, initializes new milestone state when needed, and stops at the first menu.

## Migration From The Legacy Automation Package

Older SDD projects may have `sdd/index.json` and milestone folders that were maintained by external automation.

To migrate:

1. Keep existing milestone docs under `sdd/`.
2. Activate the skill in Coordinator Mode.
3. Let Step 01 scan existing milestone README files and old `sdd/index.json` context.
4. Confirm the recovered milestone, current slice, next slice, pending questions, decisions, and report summaries.
5. Let the skill write or update milestone README frontmatter.

After migration, the milestone README frontmatter is the skill-owned workflow memory. External tools may still derive their own state from the docs.

## Optional External Version-Control Checkpoints

The skill does not perform version-control operations.

Branching, commits, merges, releases, and similar repository transitions are owned by the developer or by external tooling such as a GUI wrapper.

Useful human/GUI checkpoints are:

- before accepting a milestone plan
- before starting a slice implementation
- after reviewing an Executor report
- after Coordinator Mode processes implementation findings
- before marking a milestone complete

No repository transition is required by the skill itself.

## Philosophy

SDD is intentionally conservative about abstractions. If a slice exposes a poor type fit, duplicated concept, or uncertain boundary between components you control, fix the underlying design instead of hiding it behind glue.

Mocks belong in tests. Executable paths should use real implementations; if a real dependency is unavailable, surface the blocker.

When a dependency is specified for a task, use it as-is. Do not route around it unless the user agrees that the dependency cannot meet the requirement.
