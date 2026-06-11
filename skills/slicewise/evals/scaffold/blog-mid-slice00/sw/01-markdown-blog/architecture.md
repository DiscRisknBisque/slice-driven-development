# Architecture: Milestone 01

## System Context

A static blog generator. Input is a directory of Markdown post files, each
beginning with a frontmatter block. Output is a set of rendered HTML pages plus
a feed. The generator runs locally as a Node.js project; there is no server and
no network dependency at runtime.

## Relevant Existing Architecture

Greenfield milestone. No product code exists yet. `package.json` defines a Node
project with ES modules.

## Contracts and Interfaces

- `parsePost(rawText) -> { frontmatter: object, body: string }` is the contract
  the first slice establishes. Later slices (templating, feed) consume the
  parsed result.

## Data / State

- A "post" is a file: a frontmatter block followed by a Markdown body.
- Frontmatter carries metadata such as `title`, `date`, `tags`, and `draft`.

## Runtime Behavior

The generator reads posts, parses them, renders them through templates, and
writes HTML and a feed. The first slice covers only the parse step.

## Verification Strategy

Each slice is verified with a small script or test that exercises the new
behavior on a sample post and prints or asserts the result.

## Constraints and Guardrails

- Runtime must not require network access.
- Keep the parser dependency-light.

## Known Risks

- Frontmatter format ambiguity (YAML vs other formats).
- Behavior on malformed input is undecided.

## Decision Links

None yet.
