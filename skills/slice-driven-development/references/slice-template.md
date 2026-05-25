# Slice Template

```md
# Slice NN: Name

## Goal

What this slice proves end-to-end.

## User-Visible Demo

What the user or reviewer can run, inspect, or experience when the slice is complete.

## Scope

- What is included.

## Non-Goals

- What is explicitly not included yet.

## Relevant Decisions

- Decision records or accepted guardrails that affect this slice.

## Architecture Touchpoints

Expected files, modules, contracts, schemas, or runtime surfaces.

## Implementation Tasks

- Concrete implementation checklist.

## Verification

The slice is verified when:

- observable check
- command or artifact check
- manual review check if automation is intentionally limited

## Open Questions

- Questions to answer after implementation teaches us more.

## Completion Criteria

The slice is complete when...
```

## Guidance

Good slices prove behavior through the whole stack. Avoid slices that only create infrastructure unless that infrastructure itself is directly reviewable.

Keep future slices lighter than the current slice. Future slices should capture intent, risks, and likely review criteria without pretending all details are known.
