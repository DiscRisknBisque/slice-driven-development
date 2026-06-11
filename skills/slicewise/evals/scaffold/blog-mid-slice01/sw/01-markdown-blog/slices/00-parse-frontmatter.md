---
sliceId: "00-parse-frontmatter"
status: done
detailLevel: current
milestoneId: "01-markdown-blog"
questionsStatus: resolved
relatedDecisions: ["decisions/00-frontmatter-defaults.md"]
---

# Slice 00: Parse Frontmatter

## Goal

Read a Markdown post file and return its parsed frontmatter metadata together
with the remaining Markdown body.

## User-Visible Demo / Review Artifact

A demo script reads a sample post and prints the parsed frontmatter and body.

## Scope

- Extract and parse the frontmatter block.
- Return the body text after the frontmatter.

## Non-Goals

- Rendering and templating (slice 01).

## Relevant Decisions

- `decisions/00-frontmatter-defaults.md`: YAML frontmatter, with defaults for
  missing fields, and a structured error for malformed input.

## Architecture Touchpoints

Establishes `parsePost(rawText)` in `src/parser.js`.

## Implementation Tasks

- Implement `parsePost`. (done)
- Add a sample post and demo script. (done)

## Verification

Demo script run on the sample post; frontmatter matched. (passed)

## Open Questions

Resolved — see decision 00.

## Completion Criteria

Met.

## Executor Report Summary

`parsePost` implemented in `src/parser.js`; malformed frontmatter returns a
structured error object; verified on the sample post.
