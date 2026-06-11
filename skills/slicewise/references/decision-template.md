# Decision Template

```md
---
decisionId: "NN-title"
status: accepted
milestoneId: "NN-milestone"
relatedSlices: []
createdAt: ""
supersedes: []
---

# Decision NN: Title

## Context

## Decision

## Rationale

## Consequences

## Guardrails

## Follow-Up
```

## Guidance

Create a decision record for durable changes to architecture, contracts, workflow policy, runtime behavior, verification policy, safety or security boundaries, or ownership boundaries.

Do not create a decision record for incidental local implementation details unless they become a precedent.

Name decision files like slices: a sequential two-digit prefix and a short kebab-case title, numbered per milestone (`decisions/00-frontmatter-defaults.md`, `decisions/01-...md`). Continue from the highest existing decision number in the milestone, and set `decisionId` to the filename stem (`NN-title`). This keeps decisions easy to reference from slice and README frontmatter.
