---
sliceId: "00-parse-frontmatter"
status: current
detailLevel: current
milestoneId: "01-markdown-blog"
questionsStatus: open
relatedDecisions: []
---

# Slice 00: Parse Frontmatter

## Goal

Read a Markdown post file and return its parsed frontmatter metadata together
with the remaining Markdown body.

## User-Visible Demo / Review Artifact

A small script reads `posts/hello-world.md` and prints the parsed frontmatter
object plus the first line of the body, so a reviewer can confirm the metadata
was extracted correctly.

## Scope

- Detect and extract the frontmatter block at the top of a post.
- Parse frontmatter into a structured object.
- Return the body text after the frontmatter.

## Non-Goals

- Rendering Markdown to HTML (slice 01).
- Templating (slice 01).
- Feeds (slice 02).
- CLI packaging (slice 03).

## Relevant Decisions

None yet.

## Architecture Touchpoints

Establishes the `parsePost(rawText)` contract described in `architecture.md`.

## Implementation Tasks

- Add a `parsePost` function.
- Add a sample post and a small demo/verification script.

## Verification

Run the demo script on the sample post and confirm the printed frontmatter
matches the file.

## Open Questions

- **q-malformed-input**: How should the parser handle posts with malformed or
  missing frontmatter (e.g. an unterminated block, or no frontmatter at all)?
- **q-frontmatter-format**: Which frontmatter formats must slice 00 support?
  YAML is assumed; is anything else in scope now?

## Completion Criteria

`parsePost` returns the correct frontmatter object and body for the sample post,
and the open questions above are resolved.

## Executor Report Summary

Not yet implemented.
