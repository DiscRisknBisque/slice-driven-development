# Git Ceremony

Use this reference to understand the Git operations performed by SDD actions. Coordinator and Executor sessions should not perform these operations directly unless the user is debugging the workflow.

## Principle

Git is a workflow gate. SDD makes the gate deterministic by putting branch switches, commits, and merges in project actions. The action runner checks branch shape, stops on conflicts, and uses fixed commit messages.

## Branch Topology

Recommended topology:

```txt
trunk <- milestone branch <- slice branch
```

Example:

```txt
main <- 03-runtime-answer-loop <- 03-02-visual-presenter-actions
```

If a project uses a different branch naming convention, follow the project's convention and keep the same topology.

## Action Preflight

The action runner inspects:

- current branch
- `git status --short`
- expected milestone or slice branch shape
- merge conflict markers in porcelain status
- milestone and slice files under `sdd/`
- portable workflow status in `sdd/index.json`

Stop when:

- the current branch is not the expected branch
- unrelated dirty files are present
- untracked files have unclear ownership
- merge conflicts are present
- the current branch does not match an action's expected stage
- the target branch name is ambiguous

## Stage Gates

### Ingest SDD Plan

Expected branch: any project branch where planning docs should be updated.

Allowed dirty files:

- `sdd/index.json`

Action command pattern:

```sh
node <plugin-root>/scripts/sdd-action.mjs ingest-plan
```

### Plan Milestone

Expected branch: milestone branch.

Allowed dirty files:

- `sdd/index.json`
- `sdd/<milestone>/README.md`
- `sdd/<milestone>/architecture.md`
- `sdd/<milestone>/slices/*`
- `sdd/<milestone>/decisions/*`

Action command pattern:

```sh
git add sdd/<milestone>
git add sdd/index.json
git commit -m "Plan <milestone>"
```

### Start Slice

Expected branch: clean milestone branch.

Action command pattern:

```sh
git add sdd/index.json
git commit -m "Start <milestoneNumber>-<sliceNumber>-<sliceName>"
git switch -c <slice-branch>
```

### Finish Slice Implementation

Expected branch: slice branch.

When `Start Slice` runs from a slice branch with no open questions, it marks the current slice completed, commits current changes, and merges the slice into the milestone branch. If another planned slice exists, it marks that next slice active before creating the next branch.

```sh
git add -A
git commit -m "Impl <milestoneNumber>-<sliceNumber>-<sliceName>"
git switch <milestone-branch>
git merge <slice-branch>
git add sdd/index.json
git commit -m "Start <milestoneNumber>-<nextSliceNumber>-<nextSliceName>"
```

### Commit Answered Questions

Expected branch: slice branch after Coordinator question handling.

Action command pattern:

```sh
git add sdd/index.json
git add -A
git commit -m "Ansr <milestoneNumber>-<sliceNumber>-<sliceName>"
git switch <milestone-branch>
git merge <slice-branch>
```

### Merge Slice

Expected branch: clean milestone branch. This operation is normally part of `Start Slice` or `Answer Questions`.

Exit command pattern:

```sh
git merge <slice-branch>
```

### Review and Condense Milestone

Expected branch: milestone branch.

Perform milestone review and artifact condensation before merging to trunk.

Exit command pattern:

```sh
git add sdd/index.json
git add -A
git commit -m "Impl <milestoneNumber>-<milestoneName>"
```

### Merge Milestone

Expected branch: clean trunk branch.

Action command pattern:

```sh
git merge <milestone-branch>
```

## Helper Script

This plugin includes a conservative preflight helper:

```sh
node <plugin-root>/scripts/sdd-git-preflight.mjs --stage <stage> --milestone-branch <branch> --slice-branch <branch> --trunk <branch>
```

The helper inspects branch and working-tree state, then prints next-command guidance. It does not switch branches, commit, merge, or push. Prefer `scripts/sdd-action.mjs` for normal workflow execution.
