# SDD Actions

SDD uses Codex Run actions to make the repeatable workflow deterministic. The skill still supplies judgment and prompts; the action runner supplies branch detection, commits, merges, prompt auto-fill, and app-server calls.

## Install Actions

From a project repo, run:

```sh
node <plugin-root>/scripts/sdd-action.mjs install-actions
```

This creates or updates:

```txt
.codex/environments/environment.toml
```

The generated actions call `scripts/sdd-action.mjs` in the plugin package.

The first generated action is `SDD Actions Ready`, a side-effect-free status check. This is deliberate: some Codex local environment flows may run the first action when an environment is selected, so the first action must not branch, commit, merge, or start a thread.

## Required Project Files

The action runner expects:

```txt
sdd/
  project-description.md
  roadmap.md
  index.json
  <milestone>/
    README.md
    architecture.md
    slices/
    decisions/
```

`Ingest SDD Plan` creates or updates `sdd/index.json` from `sdd/roadmap.md`, milestone directories, and slice files. `Plan Milestone` can run before a milestone directory exists. It reads `sdd/project-description.md`, `sdd/roadmap.md`, and `sdd/index.json` when present.

## Actions

### SDD Actions Ready

- Prints available SDD actions and basic project status.
- Does not mutate Git.
- Does not call the Codex app-server.
- Exists so accidental first-action execution is harmless.

### Ingest SDD Plan

- Creates or updates `sdd/index.json`.
- Reads `sdd/roadmap.md`.
- Treats multiple H1 headings as milestone names.
- Treats H2 headings as milestone names when the roadmap has one document-title H1.
- Reconciles existing `sdd/<NN>-.../` milestone directories.
- Reads slice files under existing milestone `slices/` directories.
- Preserves statuses already recorded in `sdd/index.json`.
- Marks newly discovered existing directories and slices as `unknown` instead of inferring completion.

### Plan Milestone

- Finds the next planned or unknown milestone in `sdd/index.json`, falling back to scanning `sdd/<NN>-.../`.
- Starts a new Coordinator thread with the recommended prompt.
- Auto-fills project description and roadmap.
- Stores the Coordinator thread id in `.codex/sdd-state.json`.

### Start Milestone

- Finds the next milestone from `sdd/index.json`, or falls back to the latest milestone directory under `sdd/`.
- Marks the milestone active in `sdd/index.json`.
- If no milestone directory exists yet, creates or switches to the next indexed milestone branch, falling back to `00-first-milestone`, and waits for docs to be created.
- Otherwise, creates or switches to a branch with the same name as the milestone directory.
- Adds the milestone docs plus `sdd/index.json` and commits `Plan <milestoneNumber>-<milestoneName>` when the directory exists.
- Use `SDD_MILESTONE_NAME=<name>` to choose a different first-milestone fallback branch name.

### Start Slice

Run this only after the slice's open questions have been answered or deliberately deferred.

If the current branch is the milestone branch:

- Treats the next slice as `00`.
- Marks the slice active in `sdd/index.json`.
- Commits `Start <milestoneNumber>-<sliceNumber>-<sliceName>`.
- Creates or switches to `<milestoneNumber>-<sliceNumber>-<sliceName>`.
- Starts a new Executor thread with the recommended prompt.

If the current branch is a slice branch and no implementation findings need Coordinator handling:

- Marks the current slice completed in `sdd/index.json`.
- Commits current changes as `Impl <milestoneNumber>-<sliceNumber>-<sliceName>`.
- Switches to the milestone branch and merges the completed slice branch.
- Marks the next slice active in `sdd/index.json`.
- Commits `Start <milestoneNumber>-<sliceNumber>-<sliceName>`.
- Creates or switches to the next slice branch.
- Starts a new Executor thread with the recommended prompt.

### Answer Questions

- Runs from a slice branch after the user has discussed implementation findings with the Coordinator and those findings produced doc or decision updates.
- Marks the slice completed in `sdd/index.json`.
- Commits current changes as `Ansr <milestoneNumber>-<sliceNumber>-<sliceName>`.
- Switches to the milestone branch and merges the slice branch.
- Leaves the next slice to be prepared from the milestone branch before `Start Slice` runs again.

### Review Milestone

- Sends the review prompt to the stored Coordinator thread.
- If no Coordinator thread id is stored, starts a new Coordinator review thread.
- Leaves `<whatChanged>` unfilled so the user can state their own understanding before review.

### Close Milestone

- Runs from the milestone branch after review and cleanup are complete.
- Marks the milestone closed in `sdd/index.json`.
- Commits current changes as `Impl <milestoneNumber>-<milestoneName>`.
- Switches to `main` by default and merges the milestone branch.
- Use `SDD_TRUNK=<branch>` to target a different trunk branch.

## App-Server Behavior

The runner calls the Codex app-server JSON-RPC API. It first tries the managed control socket through:

```sh
codex app-server proxy
```

It uses:

- `thread/start` for Coordinator and Executor threads.
- `thread/name/set` for readable thread names.
- `turn/start` for initial prompts and Coordinator follow-ups.

If the proxy socket is unavailable, the runner tries to start the managed daemon with:

```sh
codex app-server daemon start
```

Some Codex Desktop installs do not expose the managed control socket. In that case, the runner starts or reuses a local loopback WebSocket app-server:

```sh
codex app-server --listen ws://127.0.0.1:47891
```

Set `SDD_APP_SERVER_WS=ws://127.0.0.1:<port>` to use a different port. Set `SDD_APP_SERVER_TRANSPORT=ws` to skip the proxy attempt.

If both app-server transports are unavailable, the action does not discard the generated prompt. It writes the filled prompt to:

```txt
.codex/sdd-prompts/
```

This fallback keeps Git actions usable even when app-server thread creation is unavailable in the current Codex install.

The runner intentionally does not manage long-lived thread subscriptions. Actions only need request/response behavior: start a thread, name it, or add a turn. The Codex app can load those persisted threads from app-server state.

## State

Shared SDD workflow state is stored in:

```txt
sdd/index.json
```

This committed ledger records milestone and slice names, ordering, source paths, and statuses. It is the portable source of workflow truth for Codex and non-Codex harnesses.

Local Codex session state is stored in:

```txt
.codex/sdd-state.json
```

This records Codex thread ids only. It must not contain milestone status, last completed slice numbers, current slice truth, or branch targets. If deleting `.codex/sdd-state.json` changes the inferred milestone, slice, status, branch target, or next action, that is a bug.

## Safety

The actions stop on merge conflicts. They intentionally make Git deterministic, but they cannot understand unrelated local edits as well as a human can. Review `git status --short` when an action blocks or when a project has known unrelated work in progress.
