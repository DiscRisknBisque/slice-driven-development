# Executor Prompt Template

```txt
Activate the slice-driven-development skill if available.

Use Executor Mode.

Read:
- sdd/<milestone>/README.md
- sdd/<milestone>/architecture.md
- sdd/<milestone>/slices/<current-slice>.md
- relevant decision records under sdd/<milestone>/decisions/

Implement only this slice:
<slice id/name>

Do not build future slices.
Do not perform version-control operations.
Verify the result using project-appropriate checks.
End with the standard Executor report.
```
