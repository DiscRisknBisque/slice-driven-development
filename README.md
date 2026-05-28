# Slice-Driven Development

Slice-Driven Development (SDD) is a universal Agent Skill for steering coding work through small, reviewable vertical slices.

It is designed for any agentic coding harness that can read files, edit files, ask the user questions, and follow a skill prompt. The skill does not depend on a particular vendor, local app, automation service, or repository workflow.

## Why Vertical Slices

Vertical slices keep progress concrete. Each slice should produce behavior or an artifact that a reviewer can run, inspect, or discuss.

It provides the following benefits:

- **Greater Reliability**: While LLMs + coding harnesses generally understand slice-based development methodology, they don't take certain actions consistently, like failing to capture decisions. For eval results see [Why Use This?](#why-use-this).
- **You Maintain Control**: Vertical slices ensure implementation can be verified by you, the developer. Each slice is guided by questions you answer at the end of each previous slice.
- **Reduced Planning Fatigue**: Each slice is easier to consume than one long architecture document.
- **Preserved Decision Traces**: Decision documents are generated through the process, so nothing is lost during development.
- **Reduced Risk**: Any slice or milestone that goes bad can easily be discarded and replanned without losing a large amount of progress.

SDD works best when you keep the architectural decisions and review checkpoints, while the agent handles the repeatable mechanics. You steer the milestone, review each slice, and answer open questions. This isn't about composing the entire roadmap for your project, but about breaking down its implementation by milestones and slices. A milestone could be finishing the entire project in the case of a simple project or it could be akin to a feature in a larger project.

## Coordinator Mode And Executor Mode

SDD has two modes.

**Coordinator Mode** owns planning, workflow state, questions, decisions, next-slice preparation, milestone review, and completion. It updates SDD docs and asks the user to make decisions at gates.

**Executor Mode** implements exactly one current slice. It reads the milestone docs, relevant decisions, and current slice brief; changes only what that slice requires; verifies the result; and ends with a structured report for Coordinator Mode.

The user remains the reviewer and decision-maker. SDD can recommend, challenge, and record, but it should not silently decide that a gated workflow step is complete.

## Installation

SDD is built on the open Agent Skills standard. Works with Claude Code, Cursor, Windsurf, Cline, GitHub Copilot, and any AI agent that supports the standard.

```bash
npx skills add discrisknbisque/slice-driven-development
```

## Before You Start: Product Docs

SDD is a development workflow, not a product strategy method. It helps turn an already-chosen direction into small, reviewable implementation slices.

Before starting a milestone, a project should already have lightweight product context:

```txt
sdd/
  project-description.md
  roadmap.md
```

`sdd/project-description.md` should explain what the project is, who it is for, the problem it solves, important constraints, and any non-goals that should shape development.

`sdd/roadmap.md` should explain the intended direction before SDD starts slicing the work. Keep it short enough to revise as you learn.

Recommended roadmap format:

```md
# Roadmap

## Product Direction

- Audience:
- Problem:
- Desired outcome:
- Constraints:
- Non-goals:

## Milestones

### Milestone 01: Name

- Outcome:
- Why now:
- Scope:
- Non-goals:
- Success signals:
- Risks or open questions:

### Milestone 02: Name

- Outcome:
- Why now:
- Scope:
- Non-goals:
- Success signals:
- Risks or open questions:
```

If you do not have a roadmap yet, use a lightweight thinking pass before activating SDD. One good option is the [`mattnowdev/thinking-partner`](https://github.com/mattnowdev/thinking-partner) skill, which is designed for assumption-checking, mental models, and planning conversations.

Suggested prompt:

```txt
Activate the thinking-partner skill.

Help me create a lightweight product roadmap before I use Slice-Driven Development.

Project idea:
<describe the project in plain language>

Audience:
<who this is for>

Current state:
<what exists today, if anything>

Constraints:
<time, technical, budget, platform, policy, or skill constraints>

Non-goals:
<what we should not solve yet>

Please challenge my assumptions, identify missing context, and help me choose a practical first development direction.

When we are ready to write the roadmap, format it exactly like this:

# Roadmap

## Product Direction

- Audience:
- Problem:
- Desired outcome:
- Constraints:
- Non-goals:

## Milestones

### Milestone 01: Name

- Outcome:
- Why now:
- Scope:
- Non-goals:
- Success signals:
- Risks or open questions:

### Milestone 02: Name

- Outcome:
- Why now:
- Scope:
- Non-goals:
- Success signals:
- Risks or open questions:

Keep the roadmap lightweight. Do not create slice plans, implementation tasks, or architecture decisions yet. SDD will handle those later.
```

## First Milestone Walkthrough

You do not need to understand the whole workflow before using SDD. Treat it like a guided checklist for turning a loose idea into one reviewable piece of working software at a time.

### 1. Start With The Thing You Want

Give the agent the feature, fix, or exploration in normal language. It is fine if the idea is rough.

```txt
Activate the slice-driven-development skill.
Use Slice-Driven Development in Coordinator Mode.

I want users to be able to save profile settings. Keep it lightweight.
Do not redesign the whole account area yet.
```

Coordinator Mode initializes a milestone under `sdd/`, captures the goal and constraints, and stops at the initialization menu.

Useful choice:

```txt
[P] Plan this milestone
```

### 2. Let Coordinator Mode Shape The Milestone

Coordinator Mode turns the goal into a small set of vertical slices. The first slice should be detailed enough to implement. The next slice should be sketched enough to keep direction. Later slices stay lightweight.

A good plan might look like:

- Slice 1: save and reload profile display name
- Slice 2: add validation and user feedback
- Slice 3: add avatar upload, if still needed

If the plan feels too big, too abstract, or not what you meant, choose:

```txt
[A] Amend the plan
```

If the plan depends on an architectural choice that should be remembered later, choose:

```txt
[D] Add or update decision records
```

When the plan is good enough to start, choose:

```txt
[C] Accept plan and continue
```

### 3. Prepare Exactly One Current Slice

The current slice is the only thing Executor Mode should implement. Coordinator Mode checks that the slice has a goal, scope, non-goals, reviewable outcome, implementation tasks, verification criteria, and open questions.

If the agent asks questions, answer them in practical terms. You can keep answers simple:

```txt
Use the existing settings page.
Store the value wherever the current user profile data already lives.
Validation can wait for the next slice.
```

Useful choices:

```txt
[Q] Answer or classify open questions
[A] Amend the slice
[C] Mark slice ready
```

If you want to hand implementation to another agent session, choose:

```txt
[P] Prepare a copyable Executor prompt
```

If you want to implement in the same session, choose:

```txt
[E] Enter Executor Mode in this session
```

### 4. Let Executor Mode Implement One Slice

Executor Mode reads the milestone docs, architecture notes, current slice, and relevant decisions. Then it changes only the files needed for that slice and runs appropriate verification.

At the end, it produces a structured report:

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
Implementation findings:
Open questions:
Deviations from plan:
Recommended Coordinator follow-up:
```

That report matters because implementation often teaches you something the plan did not know yet.

Useful choices:

```txt
[Q] Process this report in Coordinator Mode
[A] Amend or continue implementation within this slice
```

### 5. Process What Actually Happened

Coordinator Mode reads the Executor report, records the important parts, classifies open questions, and decides whether the slice is implemented, accepted, needs revision, or blocked.

If the slice is good, move forward:

```txt
[N] Draft or promote next slice
```

If it needs more work, return to slice preparation:

```txt
[S] Return to current slice preparation
```

If the milestone may already be done, review it:

```txt
[V] Review milestone
```

### 6. Repeat Until The Milestone Is Ready

For each slice, the rhythm is:

```txt
Plan or promote slice -> prepare current slice -> implement -> process report
```

This loop is the heart of SDD. It keeps work small enough to understand, while still preserving the reasons behind important choices.

### 7. Review And Complete The Milestone

At milestone review, Coordinator Mode compares accepted slices against the original goal, asks for your understanding of what changed, identifies verification gaps, and recommends what to do with provisional artifacts such as demos, generated outputs, fixtures, or temporary scripts.

When the review looks right, choose:

```txt
[C] Accept review and continue to completion
```

Completion marks the milestone done, records the final summary, and leaves the docs in a state that another session can resume later.

## Menu Survival Guide

Most menus use the same small vocabulary:

- `[A]` means amend the current draft or result.
- `[D]` means record a durable decision.
- `[Q]` means process questions or reports.
- `[S]` means prepare or return to slice preparation.
- `[N]` means move toward the next slice.
- `[V]` means review the milestone.
- `[C]` means accept the current gate and continue.
- `[X]` means exit and leave the docs where they are.

When unsure, ask the agent to explain the current menu in plain English before choosing.

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

## Special Thanks

- Thank you to [Matt Now (@mattnowdev)](https://github.com/mattnowdev) for creating the [thinking-partner](https://github.com/mattnowdev/thinking-partner/tree/main?tab=readme-ov-file) skill, which I've found extremely helpful here and elsewhere.
- Thank you to [Brian (@bmadcode)](https://github.com/bmadcode) for creating the [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD), which was a helpful reference for creating agents that walk through a process reliably.
