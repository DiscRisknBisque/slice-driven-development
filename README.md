# Slice Driven Development

Slice Driven Development (SDD) is a workflow designed to strike a balance between agentic execution and human in the loop for agentic coding. It provides the following benefits:

- **You Maintain Control**: Vertical slices ensure implementation can be verified by you, the developer. Each slice is guided by questions you answer at the end of each previous slice.
- **Reduced Planning Fatigue**: Each slice is easier to consume than one long architecture document.
- **Preserved Decision Traces**: Decision documents are generated through the process, so nothing is lost during development.
- **Reduced Risk**: Any slice or milestone that goes bad can easily be discarded and replanned without losing a large amount of progress.

SDD works best when you keep the architectural decisions and review checkpoints, while the agent handles the repeatable mechanics. You steer the milestone, review each slice, and answer open questions. This isn't about composing the entire roadmap for your project, but about breaking down its implementation by milestones and slices. A milestone could be finishing the entire project in the case of a simple project or it could be akin to a feature in a larger project.

## Workflow

SDD uses two agent roles:

- **Coordinator Mode**: long-running planning session that maintains docs, decisions, Git workflow, and next-slice planning.
- **Executor Mode**: short implementation session that builds one slice, verifies it, and reports findings.

The developer remains the reviewer and decision-maker. The agents handle repeatable workflow mechanics, but you approve plans, review code, answer open questions, and decide when to merge.

### 1. Plan a Numbered Milestone

Start a Coordinator Mode session with `thinking-partner` and `slice-driven-development`.

<details>
<summary>Suggested Prompt</summary>

```markdown
Let's think through the implementation of the next milestone, `{milestoneNumber}-{milestoneName}`. Once we've discussed we'll use `slice-driven-development` to create the necessary documents.

`{projectDescription}`

If you feel more depth is needed on any completed items, see the `docs` directory.

**Completed Milestones**

`{completedMilestones}`

**Roadmap**

`{roadmap}`
```

</details>

You provide:

- the product or feature goal
- relevant roadmap/context
- constraints and preferences

The Coordinator should:

- identify itself as Coordinator Mode
- plan a numbered milestone
- create or update the standard document corpus
- draft the current slice in detail and future slices lightly
- create the milestone branch and commit planning docs when asked

### 2. Implement One Slice

For each slice, use the Coordinator to prepare the slice branch and implementation prompt, then start an Executor Mode session.

Note that each decision doc should contain information

<details>
<summary>Suggested Prompt</summary>

```markdown
We are building `{brief-milestone-description}` in verifiable vertical slices.

Start by reading:

- `docs/{milestoneNumber}-{milestoneName}/README.md`
- `docs/{milestoneNumber}-{milestoneName}/architecture.md`
- `docs/{milestoneNumber}-{milestoneName}/slices/{current-slice}.md`
- `docs/{milestoneNumber}-{milestoneName}/decisions/{decision}.md`

Then implement only Slice `{currentSliceNumber}`.

End by reporting what changed, how to run it, how it was verified, screenshots/artifact paths, and any open questions remaining.
```

</details>

You provide:

- approval to start the slice
- review feedback after implementation

The Coordinator should:

- check Git status
- create the slice branch from the milestone branch
- generate the Executor prompt from the current docs

The Executor should:

- identify itself as Executor Mode
- read the roadmap, architecture, current slice, and relevant decisions
- implement only the current slice
- organize code according to the product architecture, not the docs/slice structure
- verify the result
- report changed files, run instructions, verification evidence, artifacts, and open questions

### 3. Review and Answer Open Questions

After implementation, review the slice yourself. Then bring findings and open questions back to the Coordinator.

<details>
<summary>Suggested Prompt</summary>

```markdown
Here are my thoughts on Slice `{milestoneNumber}-{sliceNumber}-{sliceName}`'s open questions. Answer any follow-up questions I added. Push back on my answers if you disagree.

- `{question}`
  - `{answer}`
```

</details>

You provide:

- code review feedback
- answers to open questions
- decisions where human judgment is needed

The Coordinator should:

- classify every open question as answered directly, answered indirectly, still open, or superseded
- explicitly call out indirect answers
- push back on risky answers
- update architecture, slice, and decision docs
- draft or refine the next slice

### 4. Commit and Merge the Slice

After review and post-slice docs are complete, merge the slice branch back into the milestone branch.

The Coordinator should:

- check Git status before Git operations
- commit implementation changes with the standard message
- commit post-slice docs with the standard message
- merge the slice branch into the milestone branch after review
- stop if unrelated dirty files, conflicts, or unclear ownership appear

### 5. Review and Merge the Milestone

When all slices are complete, perform a milestone review before merging to trunk.

It's important you provide your own understanding of the milestone here. Don't rely solely on the LLM alone to verify its work. They've been proven to smooth things over, _especially_ when checking their own work.

<details>
<summary>Suggested Prompt</summary>

```markdown
The `{numberOfSlices}` slices have all been implemented successfully. Examine the code base and compare it to our initially generated `README`. Then, tell me if my below understanding is correct.

`{whatChanged}`
```

</details>

You provide:

- your understanding of what was built
- acceptance or correction of the milestone outcome

The Coordinator should:

- compare the implementation against the milestone docs
- identify gaps, drift, or missing verification
- update docs if needed
- merge the milestone branch into trunk after acceptance

## Git Behavior

Branch topology:

```txt
main <- {milestoneNumber}-{milestoneName} <- {milestoneNumber}-{sliceNumber}-{sliceName}
```

If you only plan to have one milestone, you can use `main` as the milestone branch.

Recommended commit messages:

- Planning docs: `Plan {milestoneNumber}-{milestoneName}`
- Slice implementation: `Impl {milestoneNumber}-{sliceNumber}-{sliceName}`
- Post-slice docs: `Update docs based on {milestoneNumber}-{sliceNumber}-{sliceName} open question answers`

The docs are milestone and slice based. The product code should follow the best architecture for the product itself, not mirror the milestone or slice names unless that structure is genuinely correct for the product.

## Special Thanks

Thank you to [Matt Now (@mattnowdev)](https://github.com/mattnowdev) for creating the [thinking-partner](https://github.com/mattnowdev/thinking-partner/tree/main?tab=readme-ov-file) skill, which I've found extremely helpful here and elsewhere.
