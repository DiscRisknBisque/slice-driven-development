---
sliceId: "01-template-system"
status: current
detailLevel: current
milestoneId: "01-markdown-blog"
questionsStatus: resolved
relatedDecisions: ["decisions/00-frontmatter-defaults.md"]
---

# Slice 01: Template System

## Goal

Render a parsed post into a complete HTML page using a template, so a reviewer
can open the generated HTML and see the post's title and body laid out.

## User-Visible Demo / Review Artifact

A demo script parses the sample post with `parsePost`, renders it through a
template, writes `out/hello-world.html`, and the reviewer opens that file to
confirm the title and body render correctly.

## Scope

- Add a `renderPost(parsedPost, template)` function that produces an HTML string.
- Provide one default HTML template with slots for `title`, `date`, and body.
- Convert the Markdown body to HTML for insertion.
- Escape frontmatter values inserted into HTML attributes/text.

## Non-Goals

- RSS/Atom feed generation (slice 02).
- Command-line interface (slice 03).
- Multiple themes or template selection logic beyond a single default template.

## Relevant Decisions

- `decisions/00-frontmatter-defaults.md`: defaults apply when `title`/`date` are
  missing, so the template always has values to render.

## Architecture Touchpoints

Consumes `parsePost` output from `src/parser.js`; establishes `renderPost`.

## Implementation Tasks

- Implement `renderPost` (new module, e.g. `src/render.js`).
- Add a default template.
- Update or add a demo script that parses then renders the sample post to
  `out/hello-world.html`.

## Verification

Run the demo script; confirm `out/hello-world.html` contains the post title in a
heading and the rendered body.

## Open Questions

None blocking.

## Completion Criteria

`renderPost` produces valid HTML for the sample post with title, date, and body
present, and the demo writes a reviewable HTML file.

## Executor Report Summary

Not yet implemented.
