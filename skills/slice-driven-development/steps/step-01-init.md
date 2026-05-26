# Step 01 - Initialization

## Purpose

Detect existing Slice-Driven Development workflow state or initialize a new milestone with milestone README frontmatter as durable memory.

## Mandatory Execution Rules

- Read this complete step file before acting.
- State `Coordinator Mode` unless the user explicitly requested implementation.
- Do not read later step files unless this step routes there.
- Do not proceed to planning without explicit `[P]`.
- Update durable state before routing.
- Return to this menu after amendments, context capture, or interruptions.
- Never silently abandon the active workflow state.
- Do not perform version-control operations.

## Context Boundaries

Read only the context needed to determine whether SDD state exists:

- `sdd/*/README.md`
- `sdd/project-description.md`
- `sdd/roadmap.md`
- `sdd/index.json` as migration context only
- existing `sdd/<NN>-*/` folders

Do not inspect product implementation files during initialization unless the user gives a narrowly relevant reason.

## Expected Inputs

- A user request to activate or use Slice-Driven Development.
- Optional milestone goal, constraints, non-goals, roadmap context, or continuation intent.
- Optional existing SDD docs under `sdd/`.

## Allowed Actions

- Search for milestone README files.
- Read frontmatter from detected milestone READMEs.
- Read project description and roadmap if present.
- Read old `sdd/index.json` only as optional migration context.
- Ask the minimum missing context needed.
- Create or propose the milestone README, architecture doc, `slices/`, and `decisions/`.
- Initialize milestone README frontmatter.

## Document Changes It May Make

- Create `sdd/<NN>-<milestone-name>/README.md`.
- Create `sdd/<NN>-<milestone-name>/architecture.md`.
- Create `sdd/<NN>-<milestone-name>/slices/`.
- Create `sdd/<NN>-<milestone-name>/decisions/`.
- Add brief project context to the milestone README body when needed.

## Frontmatter Fields It Updates

- `sddWorkflow`
- `workflowType`
- `status`
- `mode`
- `milestoneId`
- `milestoneNumber`
- `milestoneName`
- `lastStep`
- `stepsCompleted`
- `sourceDocuments`
- `currentSlice`
- `nextSlice`
- `slices`
- `decisions`
- `pendingQuestions`
- `implementationReports`
- `updatedAt`

## Procedure

1. Search for `sdd/*/README.md`.
2. If any README has `sddWorkflow: true`, read all detected workflow frontmatter and route to `step-01b-continue.md`.
3. If no workflow frontmatter exists, inspect available project context:
   - `sdd/project-description.md`
   - `sdd/roadmap.md`
   - old `sdd/index.json` as migration context only
   - existing milestone folders under `sdd/`
4. Ask only for missing essentials:
   - milestone goal
   - known project or roadmap context
   - constraints
   - non-goals
   - whether this is a new milestone or continuation
5. Create or propose:
   - `sdd/<NN>-<milestone-name>/README.md`
   - `sdd/<NN>-<milestone-name>/architecture.md`
   - `sdd/<NN>-<milestone-name>/slices/`
   - `sdd/<NN>-<milestone-name>/decisions/`
6. Initialize README frontmatter from `references/state-schema.md` and `references/milestone-readme-template.md`.
7. If frontmatter and body content disagree, call out the mismatch and ask how to reconcile before overwriting.
8. Show the menu and stop.

## Menu

```text
SDD initialization complete.

[P] Plan this milestone
[A] Add more context
[R] Re-scan existing SDD milestones
[M] Migrate old action/index state into README frontmatter
[X] Exit
```

Show `[M]` only when old `sdd/index.json` context exists, or show it as unavailable and explain why.

## Routing

- `[P]`: update `lastStep: 1`, ensure initialization state is saved, then load `step-02-plan-milestone.md`.
- `[A]`: incorporate the user's context, update state if needed, and return to this menu.
- `[R]`: rescan milestone READMEs and folders; return to this menu or route to `step-01b-continue.md` if workflow state is found.
- `[M]`: when old `sdd/index.json` context exists, migrate useful milestone and slice information into README frontmatter, ask the user to confirm ambiguous mappings, then return to this menu.
- `[X]`: stop.

## Interrupt Handling

When the user says something that is not a menu command:

1. If it is feedback on the current draft, incorporate it and return to the same menu.
2. If it is new context, record it, update state if needed, and return to the same menu.
3. If it is an Executor report, route to `step-05-process-report.md`.
4. If it is an open-question answer, process or classify it if possible and return to the active menu.
5. If it is a request to implement code, enter Executor Mode only if the user explicitly asks for implementation.
6. If it is a request to resume, route to `step-01b-continue.md`.
7. If it is out of scope, answer briefly, restate the current workflow position, and show the active menu.
8. Never abandon the active workflow state silently.

## Failure Modes

- Multiple possible milestone numbers: present options and ask the user to choose.
- Missing goal or roadmap context: ask the smallest bounded question needed.
- Existing folder lacks README: offer to create README frontmatter for that folder.
- Old `sdd/index.json` conflicts with milestone docs: summarize the conflict and ask before migrating.
- Frontmatter cannot be parsed: attempt bounded recovery from visible docs, then ask the user to confirm.

## Stop Rule

After showing the menu, stop. Do not plan the milestone until the user explicitly chooses `[P]`.
