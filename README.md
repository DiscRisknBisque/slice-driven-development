# Slice-Driven Development

Slice-Driven Development (SDD) is a Codex plugin for steering agentic coding through human-reviewed, verifiable vertical slices.

It combines:

- a `slice-driven-development` skill for Coordinator and Executor behavior
- Codex Run actions for deterministic branch, commit, merge, and prompt handoff steps
- Codex app-server calls for starting Coordinator and Executor threads
- workflow references for milestone planning, slice execution, post-slice decisions, and milestone review
- artifact lifecycle guidance for condensing provisional verification and examples
- a Git preflight helper for debugging or manual fallback

SDD is designed for projects where you want agents to move quickly without losing architectural memory, review checkpoints, or branch discipline.

## Why Use It

- **Reliable workflow mechanics**: branch switches, commits, merges, and prompt handoffs are handled by deterministic actions.
- **Human control**: each slice ends in something runnable, reviewable, and small enough to reason about.
- **Preserved decisions**: milestone, slice, architecture, and decision docs are durable project memory.
- **Cleaner executable surface**: provisional slice verification, examples, fixtures, and scripts are condensed before milestone merge.
- **Portable workflow state**: `sdd/index.json` records milestone and slice names, ordering, and statuses for any harness.
- **Less prompt assembly**: project description, roadmap, milestone names, slice names, and relevant decisions are auto-filled from `sdd/`.

## Plugin Layout

```txt
.codex-plugin/
  plugin.json
skills/
  slice-driven-development/
    SKILL.md
    agents/openai.yaml
    references/
      actions.md
      artifact-lifecycle.md
      decision-template.md
      git-ceremony.md
      prompts.md
      slice-template.md
      workflow.md
scripts/
  sdd-action.mjs
  sdd-git-preflight.mjs
```

The skill is the judgment layer. The action runner handles repeatable mechanics: Git transitions, prompt auto-fill, and Codex app-server thread calls.

## Installation

For Codex local development, add this plugin to a local marketplace entry. A home-local marketplace convention looks like:

```txt
~/.agents/plugins/marketplace.json
~/plugins/slice-driven-development -> <this repo>
```

The marketplace entry should point to `./plugins/slice-driven-development`.

The legacy skill-only installation is still useful for non-plugin environments that support Agent Skills:

```bash
npx skills add discrisknbisque/slice-driven-development
```

## Project Setup

In each project that should use SDD action buttons, create the shared planning inputs:

```txt
sdd/
  project-description.md
  roadmap.md
```

Then ingest the roadmap and any existing SDD milestone folders into the portable SDD ledger:

```bash
node <plugin-root>/scripts/sdd-action.mjs ingest-plan
```

Then install the project-local Codex actions:

```bash
node <plugin-root>/scripts/sdd-action.mjs install-actions
```

This creates or updates `.codex/environments/environment.toml` with:

- `SDD Actions Ready`
- `Ingest SDD Plan`
- `Plan Milestone`
- `Start Milestone`
- `Start Slice`
- `Answer Questions`
- `Review Milestone`
- `Close Milestone`

`SDD Actions Ready` is intentionally side-effect free. Some Codex local environment flows may run the first action when an environment is selected; making the first action a status check prevents accidental branch changes, commits, or thread creation.

The action runner stores shared workflow truth in `sdd/index.json`. Local Codex thread ids live in `.codex/sdd-state.json`; deleting that file must not change the inferred milestone, slice, status, branch target, or next action.

When the managed Codex app-server control socket is unavailable, actions start a local loopback app-server on `ws://127.0.0.1:47891`. If both transports fail, actions write the filled prompt to `.codex/sdd-prompts/` instead of dropping it.

## SDD Directory

Milestones live under `sdd/`:

```txt
sdd/
  project-description.md
  roadmap.md
  index.json
  <milestone>/
    README.md
    architecture.md
    slices/
      00-...
      01-...
    decisions/
      00-...
      01-...
```

Use consistent two-digit numbering for milestones, slices, and decisions. `sdd/index.json` records the portable milestone and slice ledger. Slice templates include a `Relevant Decisions` section so Executor threads can see the decision records that matter for the slice.

## Workflow

SDD uses two agent roles:

- **Coordinator Mode**: long-running planning and architecture session. It maintains milestone docs, decisions, post-slice questions, next-slice planning, milestone review, and cleanup recommendations.
- **Executor Mode**: focused implementation session. It implements one slice, verifies it, reports artifact disposition, and returns open questions.

The normal action flow is:

```txt
Ingest SDD Plan
-> Plan Milestone
-> Start Milestone
-> Start Slice
-> Executor implements one slice
-> Answer Questions, when needed
-> Start Slice for the next slice
-> Review Milestone
-> Close Milestone
```

### Ingest SDD Plan

Creates or updates `sdd/index.json`.

The action:

- reads `sdd/roadmap.md`
- treats multiple H1 headings as milestones
- treats H2 headings as milestones when the roadmap has one document-title H1
- reconciles existing `sdd/<NN>-.../` milestone directories
- reads slice files under existing milestone `slices/` directories
- preserves existing statuses already recorded in `sdd/index.json`
- marks newly discovered existing directories as `unknown` rather than pretending they are completed

This action is safe to run for a new SDD project or for an existing in-progress project being adopted into SDD.

The normal action flow after ingestion is:

```txt
Plan Milestone
-> Start Milestone
-> Start Slice
-> Executor implements one slice
-> Answer Questions, when needed
-> Start Slice for the next slice
-> Review Milestone
-> Close Milestone
```

### Plan Milestone

Starts a new Coordinator thread.

The action:

- reads `sdd/project-description.md`
- reads `sdd/roadmap.md`
- reads `sdd/index.json` when present
- fills the next milestone number and name
- asks the Coordinator to create or update `sdd/<milestone>/`

The user discusses the milestone with the Coordinator until the plan is ready.

### Start Milestone

Runs after the milestone plan is accepted.

The action:

- finds the next milestone from `sdd/index.json`, or falls back to existing milestone directories
- updates `sdd/index.json` to mark the milestone active
- if no milestone directory exists yet, starts the next indexed milestone branch, falling back to `00-first-milestone`, and waits for docs to be created
- creates or switches to the milestone branch named `<milestoneNumber>-<milestoneName>`
- adds the milestone docs and `sdd/index.json`
- commits `Plan <milestoneNumber>-<milestoneName>`

Set `SDD_MILESTONE_NAME=<name>` before running `Start Milestone` to use a different fallback name for the first branch when no milestone directory exists yet.

### Start Slice

Runs when the user is ready for an Executor thread.

If run from the milestone branch, the action:

- treats the next slice as `00`
- marks the slice active in `sdd/index.json`
- commits `Start <milestoneNumber>-<sliceNumber>-<sliceName>`
- creates or switches to `<milestoneNumber>-<sliceNumber>-<sliceName>`
- starts a new Executor thread with the slice prompt

If run from a slice branch with no open questions, the action:

- marks the current slice completed in `sdd/index.json`
- commits current changes as `Impl <milestoneNumber>-<sliceNumber>-<sliceName>`
- switches to the milestone branch
- merges the completed slice branch
- marks the next slice active in `sdd/index.json`
- commits `Start <milestoneNumber>-<sliceNumber>-<sliceName>`
- creates or switches to the next slice branch
- starts a new Executor thread

Executor Mode must not switch branches, commit, merge, or push. The actions own those steps.

### Answer Questions

Runs from a slice branch after the user has discussed open questions with the Coordinator.

The action:

- marks the slice completed in `sdd/index.json`
- commits current changes as `Ansr <milestoneNumber>-<sliceNumber>-<sliceName>`
- switches to the milestone branch
- merges the slice branch

### Review Milestone

Runs when all slices in the milestone have been implemented.

The action:

- sends the milestone review prompt to the stored Coordinator thread
- fills milestone docs, slice count, and decision paths
- leaves `<whatChanged>` for the user to replace with their own understanding

If no Coordinator thread id is stored, it starts a new review thread.

### Close Milestone

Runs from the milestone branch after review and cleanup are complete.

The action:

- marks the milestone closed in `sdd/index.json`
- commits current changes as `Impl <milestoneNumber>-<milestoneName>`
- switches to `main`
- merges the milestone branch

Set `SDD_TRUNK=<branch>` when the project uses a trunk branch other than `main`.

## Branches And Commits

Branch topology:

```txt
trunk <- milestone branch <- slice branch
```

Example:

```txt
main <- 04-component-registry-and-scene-affordances-v1 <- 04-00-component-registry-contract-and-dom-adapter
```

Commit messages:

- Milestone plan: `Plan <milestoneNumber>-<milestoneName>`
- Slice start ledger update: `Start <milestoneNumber>-<sliceNumber>-<sliceName>`
- Slice implementation: `Impl <milestoneNumber>-<sliceNumber>-<sliceName>`
- Post-slice answers: `Ansr <milestoneNumber>-<sliceNumber>-<sliceName>`
- Milestone close: `Impl <milestoneNumber>-<milestoneName>`

## Codex App-Server

The action runner uses the Codex app-server JSON-RPC API. It first tries:

```bash
codex app-server proxy
```

If that managed control socket is unavailable, it starts or reuses:

```bash
codex app-server --listen ws://127.0.0.1:47891
```

It calls:

- `thread/start` for Coordinator and Executor threads
- `thread/name/set` for readable thread names
- `turn/start` for initial prompts and Coordinator follow-ups

If both app-server transports are unavailable, the action writes the filled prompt to `.codex/sdd-prompts/`. This keeps the Git workflow usable even when thread creation is unavailable in the current Codex install.

## Manual Debugging

The preferred path is `scripts/sdd-action.mjs`, but the plugin still includes a conservative preflight helper:

```bash
node scripts/sdd-git-preflight.mjs --stage <stage> \
  --trunk main \
  --milestone-branch <milestone-branch> \
  --slice-branch <slice-branch>
```

The helper inspects branch and working-tree state, then prints suggested next commands. Use it when debugging a blocked transition or adapting an older project.

## Artifact Lifecycle

Slice-created artifacts are provisional by default:

- slice-specific verification scripts
- scratch examples and demos
- copied fixtures or scenes
- mock responses and request files
- generated verification output
- package scripts named after slice numbers
- temporary working directories

At milestone review, classify each as:

- `promote`: keep as durable regression/evaluation coverage
- `canonical example`: keep as the clearest current example
- `merge`: fold duplicated checks into a broader durable command
- `archive in docs`: preserve the rationale but remove executable clutter
- `delete`: remove scratch, superseded, generated, or confusing artifacts

Prefer durable behavior-level commands after condensation, such as:

```txt
verify:presentation
verify:runtime-answer-loop
verify:presenter-agent
test:evaluations
demo:presentation
```

## Existing Projects

For a project that already used the old skill, migrate the planning directory to `sdd/` first, then run:

```bash
node <plugin-root>/scripts/sdd-action.mjs ingest-plan
node <plugin-root>/scripts/sdd-action.mjs install-actions
```

Before pressing an action, confirm:

- `sdd/project-description.md` exists
- `sdd/roadmap.md` exists
- `sdd/index.json` exists after ingestion
- milestone directories use `<NN>-<milestoneName>`
- slice files use `<NN>-<sliceName>.md`
- the current branch matches the action you intend to run

Use `sdd-git-preflight.mjs` if the current branch state is ambiguous.

## Eval Notes

Earlier skill-only evals showed SDD improved:

- mode identification
- question classification
- decision records
- next-slice drafting
- progressive detail
- consistent two-digit numbering

The current plugin keeps those behaviors and adds action-driven Git plus app-server prompt handoff.

## Special Thanks

Thank you to [Matt Now (@mattnowdev)](https://github.com/mattnowdev) for creating the [thinking-partner](https://github.com/mattnowdev/thinking-partner/tree/main?tab=readme-ov-file) skill, which has been useful when shaping SDD's planning and review loops.
