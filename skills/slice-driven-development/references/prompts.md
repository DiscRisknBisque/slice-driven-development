# Session Prompts

These prompts are the source text used by SDD actions. The action runner fills values from the repository and `sdd/index.json` before starting a Codex thread or turn.

## Auto-Filled Inputs

- `projectDescription`: read from `sdd/project-description.md`
- `roadmap`: read from `sdd/roadmap.md`
- `milestoneNumber`: read from `sdd/index.json`, falling back to existing `sdd/<NN>-.../` milestone directories
- `milestoneName`: read from `sdd/index.json` or proposed during Coordinator discussion
- `milestone`: inferred from the current milestone branch, `sdd/index.json`, or existing `sdd/<NN>-.../` directory
- `sliceNumber` and `sliceName`: read from `sdd/index.json`, falling back to `sdd/<milestone>/slices/<NN>-...md`
- `relevantDecisions`: inferred from `sdd/<milestone>/decisions/*.md`

## Plan Milestone

The `Plan Milestone` action starts a new Coordinator thread:

```txt
Use $slice-driven-development in Coordinator Mode.

Let's think through the implementation of milestone `<milestoneNumber>-<milestoneName>`.

Project description is loaded from `sdd/project-description.md`:

<projectDescription>

Roadmap is loaded from `sdd/roadmap.md`:

<roadmap>

Create or update the milestone docs under `sdd/<milestoneNumber>-<milestoneName>/`, draft the current slice in detail, keep future slices light, and include a Relevant Decisions section in each detailed slice.
```

## Start Slice

After the slice's open questions have been answered or deliberately deferred, the `Start Slice` action performs the Git transition first, then starts a new Executor thread:

```txt
Use $slice-driven-development in Executor Mode to implement one vertical slice.

We are building this project in verifiable vertical slices.

Current branch: `<sliceBranch>`
Milestone: `<milestone>`
Slice: `<sliceNumber>-<sliceName>`

Start by reading:
- sdd/<milestone>/README.md
- sdd/<milestone>/architecture.md
- sdd/<milestone>/slices/<sliceFile>

Relevant decisions:
<relevantDecisions>

Then implement only the slice described in `sdd/<milestone>/slices/<sliceFile>`.

Rules:
- Do not build ahead into later slices unless the current slice cannot work without a small prerequisite.
- Prefer the architecture and decisions already documented.
- If implementation teaches us something that changes the plan, update the relevant slice file or add a short note in the SDD docs.
- Keep the result runnable and reviewable.
- Do not switch branches, commit, merge, or push. SDD action scripts handle Git deterministically.

End by reporting:
- what changed
- how to run it
- how it was verified
- artifact disposition notes for provisional verification, examples, fixtures, scripts, and generated outputs
- screenshots/artifact paths, if any
- implementation findings or remaining questions for planning
```

## Question Handling

Use this when a slice has open questions before execution, or when the implementation session returns findings that need Coordinator handling:

```txt
Here are my thoughts on <slice>'s open questions.

Answer any follow-up questions I added. Push back on my answers if you disagree.

- <question>
  - <answer>
```

The Coordinator should then:

- answer follow-up questions
- push back where appropriate
- update architecture, slice, and decision docs
- draft or refine the slice that will execute next if ready

## Review Milestone

The `Review Milestone` action sends this to the Coordinator thread. It fills everything except `<whatChanged>` so the user still supplies their own understanding.

```txt
Use $slice-driven-development in Coordinator Mode to review and condense this milestone.

The <numberOfSlices> slices for Milestone <milestoneNumber> have been implemented.

Read:
- sdd/<milestone>/README.md
- sdd/<milestone>/architecture.md
- sdd/<milestone>/slices/
- sdd/<milestone>/decisions/

Compare the codebase to the milestone docs and tell me whether my understanding is correct:

<whatChanged>

Then inventory provisional verification code, examples, fixtures, generated outputs, and package scripts. Recommend what to promote, merge, archive in docs, or delete so the repo keeps only the durable verification and canonical examples needed for this milestone's current end-state.
```
