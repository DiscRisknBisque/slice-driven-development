# Session Prompts

## Coordinator Session

Use this in a long-running planning session:

```txt
Use $slice-driven-development as the architecture coordinator for this project.

We are building <project description> in verifiable vertical slices.

Read:
- docs/<project>/README.md
- docs/<project>/architecture.md
- docs/<project>/slices/
- docs/<project>/decisions/

I will bring you implementation findings and post-slice questions. Help me answer them, push back where needed, update docs, and draft the next slice when ready.
```

## Implementation Session

Use this when starting a separate coding session for one slice:

```txt
Use $slice-driven-development to implement one vertical slice.

We are building this system in verifiable vertical slices.

Start by reading:

- docs/<project>/README.md
- docs/<project>/architecture.md
- docs/<project>/slices/<slice-file>.md
- relevant decision records in docs/<project>/decisions/

Then implement only the slice described in <slice-file>.

Rules:
- Do not build ahead into later slices unless the current slice cannot work without a small prerequisite.
- Prefer the architecture and decisions already documented.
- If implementation teaches us something that changes the plan, update the relevant slice file or add a short note in the docs.
- Keep the result runnable and reviewable.

End by reporting:
- what changed
- how to run it
- how it was verified
- screenshots/artifact paths, if any
- what remains open for the next slice
```

## Post-Slice Iteration

Use this when the implementation session returns open questions:

```txt
Here are my thoughts on <slice>'s open questions.

Answer any follow-up questions I added. Push back on my answers if you disagree.

- <question>
  - <answer>
```

The architecture session should then:

- answer follow-up questions
- push back where appropriate
- update architecture, slice, and decision docs
- draft the next slice if ready

## Next-Slice Drafting

Use this when the user asks whether to refine the current slice or draft the next one:

```txt
Review the current slice questions and decisions.

If the remaining questions are implementation-level, draft the next slice.
If architecture or policy is still unresolved, update the current slice instead.
```
