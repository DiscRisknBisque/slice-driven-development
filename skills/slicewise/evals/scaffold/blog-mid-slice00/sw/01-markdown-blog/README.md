---
swWorkflow: true
workflowType: slice-driven-development
status: in_progress
mode: coordinator
milestoneId: "01-markdown-blog"
milestoneNumber: "01"
milestoneName: "Markdown Blog"
lastStep: 2
stepsCompleted: [1, 2]
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
  - id: "02-rss-feed"
    file: "slices/02-rss-feed.md"
    status: planned
    detailLevel: lightweight
    questionsStatus: unknown
  - id: "03-cli"
    file: "slices/03-cli.md"
    status: planned
    detailLevel: lightweight
    questionsStatus: unknown
decisions: []
pendingQuestions:
  - id: "q-malformed-input"
    slice: "00-parse-frontmatter"
    text: "How should the parser handle posts with malformed or missing frontmatter?"
    status: open
  - id: "q-frontmatter-format"
    slice: "00-parse-frontmatter"
    text: "Which frontmatter formats must we support for the first slice?"
    status: open
implementationReports: []
updatedAt: "2026-06-09T17:00:00Z"
---

# Milestone 01: Markdown Blog

## Goal

Build a static blog generator that turns a folder of Markdown posts (each with
frontmatter metadata) into rendered HTML pages, with templating and an RSS feed.

## Current State

Planning is complete. The slice plan is drafted and the first slice
(`00-parse-frontmatter`) is the current slice but still has open questions that
must be resolved before implementation.

## Slice Plan

- **00-parse-frontmatter** (current): Read a post file and return its parsed
  frontmatter metadata plus the Markdown body. Reviewable by parsing a sample
  post and printing the structured result.
- **01-template-system** (next): Render a parsed post into an HTML page using a
  template.
- **02-rss-feed** (future): Generate an RSS/Atom feed from the set of posts.
- **03-cli** (future): Wrap the generator in a command-line entry point.

## Open Questions

- How should the parser handle malformed or missing frontmatter? (slice 00)
- Which frontmatter formats must we support in slice 00? (slice 00)

## Decisions

None recorded yet.

## Verification Summary

No slices implemented yet.

## Implementation Reports

None yet.

## Completion Notes

Milestone in progress.
