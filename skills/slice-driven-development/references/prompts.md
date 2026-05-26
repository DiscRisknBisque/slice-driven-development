# Universal Prompts

These examples are copyable starting points for any agentic coding harness that can read files, edit files, ask questions, and follow a skill prompt.

## Start Coordinator Mode

```txt
Activate the slice-driven-development skill.
Use Slice-Driven Development in Coordinator Mode.
Read the current SDD docs under sdd/ if they exist, initialize or resume workflow state, and stop at the required menu.
```

## Resume Existing Workflow

```txt
Activate the slice-driven-development skill.
Resume the existing Slice-Driven Development workflow.
Use milestone README frontmatter as workflow memory, summarize the current state, and show the continuation menu.
```

## Plan A Milestone

```txt
Activate the slice-driven-development skill.
Use Coordinator Mode to plan this milestone:
<milestone goal>

Use project context from sdd/project-description.md and sdd/roadmap.md when available.
Create or update milestone docs under sdd/<NN>-<name>/.
Make the current slice implementation-ready, the next slice moderately detailed, and future slices lightweight.
Show the milestone planning menu and stop.
```

## Prepare Current Slice

```txt
Activate the slice-driven-development skill.
Use Coordinator Mode to prepare the current slice.
Read the milestone README, architecture doc, current slice, relevant decisions, and pending questions.
Classify every blocking question before marking the slice ready.
Show the slice readiness menu and stop.
```

## Enter Executor Mode

```txt
Activate the slice-driven-development skill if available.
Use Executor Mode.
Read the milestone README, architecture doc, current slice, and relevant decision records.
Implement only the current slice.
Do not build future slices.
Do not perform version-control operations.
Verify the result using project-appropriate checks.
End with the standard Executor report.
```

## Process An Executor Report

```txt
Activate the slice-driven-development skill.
Use Coordinator Mode to process this Executor report:
<report>

Classify findings and questions, update durable docs and decisions, decide the current slice status, then show the post-slice processing menu and stop.
```

## Answer Open Questions

```txt
Activate the slice-driven-development skill.
Use Coordinator Mode to process these open-question answers:
<questions and answers>

Classify each answer, challenge brittle or scope-expanding assumptions, update docs and decisions, then return to the active checkpoint menu.
```

## Review A Milestone

```txt
Activate the slice-driven-development skill.
Use Coordinator Mode to review the current milestone.
Ask me for my understanding of what changed, compare it with the milestone docs and inspectable behavior, recommend artifact disposition, and show the milestone review menu.
```
