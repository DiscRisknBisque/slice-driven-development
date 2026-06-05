# Step 01 - Initialization

## Purpose

Detect existing Slicewise workflow state or initialize a new milestone with milestone README frontmatter as durable memory.

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

Read only the context needed to determine whether Slicewise state exists:

- `sw/*/README.md`
- `sw/project-description.md`
- `sw/roadmap.md`
- `sw/index.json` as migration context only
- existing `sw/<NN>-*/` folders

Do not inspect product implementation files during initialization unless the user gives a narrowly relevant reason.

## Expected Inputs

- A user request to activate or use Slicewise.
- Optional milestone goal, constraints, non-goals, roadmap context, or continuation intent.
- Optional existing Slicewise docs under `sw/`.

## Allowed Actions

- Search for milestone README files.
- Read frontmatter from detected milestone READMEs.
- Read project description and roadmap if present.
- Read old `sw/index.json` only as optional migration context.
- Ask the minimum missing context needed.
- Create or propose the milestone README, architecture doc, `slices/`, and `decisions/`.
- Initialize milestone README frontmatter.

## Document Changes It May Make

- Create `sw/<NN>-<milestone-name>/README.md`.
- Create `sw/<NN>-<milestone-name>/architecture.md`.
- Create `sw/<NN>-<milestone-name>/slices/`.
- Create `sw/<NN>-<milestone-name>/decisions/`.
- Add brief project context to the milestone README body when needed.

## Frontmatter Fields It Updates

- `swWorkflow`
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

1. Search for `sw/*/README.md`.
2. If any README has `swWorkflow: true`, read all detected workflow frontmatter and route to `step-01b-continue.md`.
3. If no workflow frontmatter exists, inspect available project context:
   - `sw/project-description.md`
   - `sw/roadmap.md`
   - old `sw/index.json` as migration context only
   - existing milestone folders under `sw/`
4. Ask only for missing essentials:
   - milestone goal
   - known project or roadmap context
   - constraints
   - non-goals
   - whether this is a new milestone or continuation
5. Create or propose:
   - `sw/<NN>-<milestone-name>/README.md`
   - `sw/<NN>-<milestone-name>/architecture.md`
   - `sw/<NN>-<milestone-name>/slices/`
   - `sw/<NN>-<milestone-name>/decisions/`
6. Initialize README frontmatter from `references/state-schema.md` and `references/milestone-readme-template.md`.
7. If frontmatter and body content disagree, call out the mismatch and ask how to reconcile before overwriting.
8. Show the menu and stop.

## Menu

```text
Slicewise initialization complete.

[P] Plan this milestone
[A] Add more context
[R] Re-scan existing Slicewise milestones
[M] Migrate old action/index state into README frontmatter
[X] Exit
```

Show `[M]` only when old `sw/index.json` context exists, or show it as unavailable and explain why.

## Routing

- `[P]`: update `lastStep: 1`, ensure initialization state is saved, then load `step-02-plan-milestone.md`.
- `[A]`: incorporate the user's context, update state if needed, and return to this menu.
- `[R]`: rescan milestone READMEs and folders; return to this menu or route to `step-01b-continue.md` if workflow state is found.
- `[M]`: when old `sw/index.json` context exists, migrate useful milestone and slice information into README frontmatter, ask the user to confirm ambiguous mappings, then return to this menu.
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
- Old `sw/index.json` conflicts with milestone docs: summarize the conflict and ask before migrating.
- Frontmatter cannot be parsed: attempt bounded recovery from visible docs, then ask the user to confirm.

## Stop Rule

After showing the menu, stop. Do not plan the milestone until the user explicitly chooses `[P]`.
