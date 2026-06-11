# Architecture: Milestone 01

## System Context

A static blog generator. Input is a directory of Markdown post files, each
beginning with a frontmatter block. Output is a set of rendered HTML pages plus
a feed. The generator runs locally as a Node.js project; there is no server and
no network dependency at runtime.

## Relevant Existing Architecture

`src/parser.js` exposes `parsePost(rawText)` from slice 00. The template system
slice consumes its output.

## Contracts and Interfaces

- `parsePost(rawText) -> { frontmatter: object, body: string }` (implemented).
- `renderPost(parsedPost, template) -> htmlString` is the contract this slice
  establishes.

## Data / State

- A "post" is a file: a frontmatter block followed by a Markdown body.
- Frontmatter carries `title`, `date`, `tags`, and `draft` (see decision 00).

## Runtime Behavior

The generator reads posts, parses them, renders them through templates, and
writes HTML and a feed. The current slice covers the render-through-template
step only.

## Verification Strategy

Each slice is verified with a small script or test that exercises the new
behavior on a sample post and prints or asserts the result.

## Constraints and Guardrails

- Runtime must not require network access.
- Keep dependencies light.

## Known Risks

- Template injection if post content is not escaped appropriately.

## Decision Links

- `decisions/00-frontmatter-defaults.md`
