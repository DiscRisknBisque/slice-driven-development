---
decisionId: "00-frontmatter-defaults"
status: accepted
milestoneId: "01-markdown-blog"
relatedSlices: ["00-parse-frontmatter"]
createdAt: "2026-06-10T14:00:00Z"
supersedes: []
---

# Decision 00: Frontmatter Format and Defaults

## Context

Slice 00 needed to settle which frontmatter format to support and how to handle
posts whose metadata is missing or malformed.

## Decision

- Support **YAML** frontmatter only for now.
- Apply defaults for missing fields: `title` defaults to the filename, `date`
  defaults to the file's modification time, `tags` defaults to an empty list,
  `draft` defaults to `false`.
- On malformed frontmatter (e.g. an unterminated block), `parsePost` returns a
  structured error object rather than throwing, so callers can report the bad
  file and continue.

## Rationale

YAML covers the common case and keeps the parser dependency-light. Defaults let
posts render without boilerplate. A structured error keeps a single bad post
from crashing a whole site build.

## Consequences

- Downstream slices can assume `title` and `date` are always present.
- Other frontmatter formats (TOML, JSON) are out of scope unless a later
  decision supersedes this one.

## Guardrails

- Do not throw on malformed input; return the structured error.

## Follow-Up

Revisit format support only if a concrete need for TOML/JSON arises.
