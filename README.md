# Slice Driven Development

Slice Driven Development (SDD) is a workflow designed to strike a balance between agentic execution and human in the loop for agentic coding. It provides the following benefits:

- Ensures that each major decision is catalogued
- Each implementation can be verified by you, the developer
- Any slice that goes bad can easily be discarded and replanned without losing a large amount of progress

Notably, you should already have an idea of what you're building. This isn't about composing the entire roadmap for your project, but about breaking down its implementation by milestones and slices. A milestone could be finishing the entire project in the case of a simple project or it could be a akin to a feature in a larger project.

## Workflow

The current workflow is mostly manual, but I plan to add more automation in the future.

### Planning and Implementing a Milestone

1. Use `thinking-partner` and `slice-driven-development` skills to plan the milestone.
2. Once you're satisfied, use `slice-driven-development` to produce the slices and standard document corpus.
3. Checkout a new branch `{milestoneNumber}-{milestoneName}` and commit the slices and document corpus.
4. Keep that planning agent session running (pinned in Codex) as the Operator.
5. Checkout a new branch `{milestoneNumber}-{sliceNumber}-{sliceName}` to cleanly contain the slice implementation.
6. Create a new chat session to implement the slice (use the "Implement a Slice" prompt below).
7. Once the slice is implementended, review the code, request any edits as necessary.
8. Commit the code to the slice branch. Recommended commit message: "Impl {milestoneNumber}-{sliceNumber}-{sliceName}"
9. Answer the open questions with the operator (use the "Answer Open Questions" prompt). Discuss as needed, it should document the answers in decision documents. Then, if the Operator doesn't automatically, have it create the next slice.
10. Commit the new documents to the slice branch. Recommended commit message: "Update docs based on {milestoneNumber}-{sliceNumber}-{sliceName} open question answers"
11. Merge the slice branch into the feature branch.
12. Loop back to step 5, checking out a branch for the next slice.

### Assessing and Merging a Milestone

1. Use the "Milestone Review" prompt to ensure successful implementation based on your instructions.
2. Merge the `{milestoneNumber}-{milestoneName}` branch into `main` or your chosen trunk.

## Git Behavior

`main` <- `{milestoneNumber}-{milestoneName}` <- `{milestoneNumber}-{sliceNumber}-{sliceName}`

If you only plan to have one milestone, you could use `main` as the milestone branch.

## Prompts

### Answer Open Questions

Here are my thoughts on `{featureOrProjectNameAndNumber}` Slice `{sliceNumber}`'s open questions. Answer any follow-up questions I added. Push back on my answers if you disagree.

- `{question}`
  - `{answer}`

### Implement a Slice

We are building {brief-milestone-description} in verifiable vertical slices.

Start by reading:

- docs/{milestoneNumber}-{milestoneName}/README.md
- docs/{milestoneNumber}-{milestoneName}/architecture.md
- docs/{milestoneNumber}-{milestoneName}/slices/{current-slice}.md
- docs/{milestoneNumber}-{milestoneName}/decisions/{decision}.md

Then implement only Slice {currentSliceNumber}.

End by reporting what changed, how to run it, how it was verified, screenshots/artifact paths, and any open questions remaining.

### Milestone Review

The `{numberOfSlices}` slices have all been implemented successfully. Examine the code base and compare it to our initially generated `README`. Then, tell me if my below understanding is correct.

Based on my usage and inspection of the code myself, we have a solid core with a number of pieces implemented “manually“ using the coding agent. We need to extract those into behaviors that execute during the presentation in case of modification. Specifically, the harness can:

- Create a presentation composed of multiple scenes using skills. The skills system can be expanded to cover new scene types.
- Validate the presentation for correctness against our schema and using Chrome CDP.
- Modify or create scenes in response to a viewer’s question.

## Special Thanks

Thank you to [Matt Now (@mattnowdev)](https://github.com/mattnowdev) for creating the [`thinking-partner`](https://github.com/mattnowdev/thinking-partner/tree/main?tab=readme-ov-file#alternative-install) skill, which I've found extremely helpful here and elsewhere.
