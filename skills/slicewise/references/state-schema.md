# Workflow State Schema

The milestone README frontmatter is the durable workflow memory for Slicewise.

Primary location:

```txt
sw/<NN>-<milestone-name>/README.md
```

`sw/index.json` is not required for skill operation. If it exists, the initialization and continuation steps may read it as migration context only. A project may keep it as optional derived state for external tools, but it is not the skill-owned source of truth.

## Example

```yaml
---
swWorkflow: true
workflowType: slice-driven-development
status: in_progress
mode: coordinator
milestoneId: "01-markdown-blog"
milestoneNumber: "01"
milestoneName: "Markdown Blog"
lastStep: 2
stepsCompleted: [1]
sourceDocuments:
  - "sw/project-description.md"
  - "sw/roadmap.md"
currentSlice: "00-parse-frontmatter"
nextSlice: "01-template-system"
slices:
  - id: "00-parse-frontmatter"
    file: "slices/00-parse-frontmatter.md"
    status: current
    detailLevel: current
    questionsStatus: open
  - id: "01-template-system"
    file: "slices/01-template-system.md"
    status: planned
    detailLevel: next
    questionsStatus: unknown
decisions: []
pendingQuestions: []
implementationReports: []
updatedAt: "ISO-8601 timestamp"
---
```

## Fields

- `swWorkflow`: must be `true` for the README to be treated as workflow state.
- `workflowType`: must be `slice-driven-development`.
- `status`: `in_progress`, `complete`, `paused`, `blocked`, or another explicit project status.
- `mode`: last active mode, usually `coordinator` or `executor`.
- `milestoneId`: stable directory-style id, usually `<NN>-<name>`.
- `milestoneNumber`: two-numeral milestone number.
- `milestoneName`: human-readable milestone name.
- `lastStep`: number of the last loaded step.
- `stepsCompleted`: numbers of completed gated steps.
- `sourceDocuments`: project-level docs used as source context.
- `currentSlice`: current slice id.
- `nextSlice`: next slice id.
- `slices`: ordered slice records with id, file, status, detail level, and question status.
- `decisions`: decision record paths or ids.
- `pendingQuestions`: unresolved or deferred question records.
- `implementationReports`: report summaries or report paths needing Coordinator processing.
- `updatedAt`: ISO-8601 timestamp for the latest state update.
- `completedAt`: ISO-8601 timestamp added when a milestone is complete.

## Consistency Rules

- If frontmatter and document body disagree, call out the mismatch and ask the user how to reconcile it before overwriting.
- If state is partially missing or corrupted, attempt bounded recovery by scanning milestone README files, architecture docs, slice docs, decisions, and report summaries; then ask the user to confirm the recovered state.
- Update state before routing to another step.
- Preserve unknowns instead of inventing certainty.
