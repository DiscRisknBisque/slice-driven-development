# Handoff: Slicewise UI

## Overview

This is the design handoff for **Slicewise**, a desktop-class developer tool that steers agentic coding through small, reviewable **vertical slices**. The user (a human "Coordinator") owns the architectural decisions and review gates; a coding agent (the "Executor") handles implementation mechanics.

The product is a standalone desktop application (Electron or similar). The UI is a **three-panel shell** — titlebar, sidebar + main content, status bar — with a well-defined 8-step workflow that runs inside it.

---

## About the Design Files

The HTML/JSX/CSS files bundled here are **high-fidelity design references** built as a React prototype. They are **not** production code to ship directly. The task is to **recreate these screens in your target codebase** (Electron + React, Tauri, or the framework your team chooses) using its established patterns and component library.

The prototype was built at **1180 × 760 px** — a comfortable laptop window size. Treat this as the design baseline; implement responsive/resizable behavior as appropriate for a real desktop app.

---

## Fidelity

**High-fidelity.** These are pixel-level mockups with final colors, typography, spacing, copy, and interactions. Implement them faithfully. The only intentional gaps are:

- Real agent streaming (the harness transcript is frozen in the design; replace with live output).
- File system operations (Open folder, Create file, etc. are stubbed).
- Keyboard shortcut handling (letter-key menus are shown but not wired).

---

## Design System

### Fonts

| Role      | Family                            | Weights       |
| --------- | --------------------------------- | ------------- |
| UI sans   | **Geist** (Google Fonts)          | 400, 500, 600 |
| Monospace | **JetBrains Mono** (Google Fonts) | 400, 500      |

```css
--font-sans: "Geist", -apple-system, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
```

### Color Tokens

```css
/* Surfaces */
--bg-page: #ececec /* canvas behind the window */ --bg-app: #fafafa
  /* app background */ --bg-pane: #ffffff /* sidebar, cards, panels */
  --bg-subtle: #f4f4f4 /* hover targets, card footers */ --bg-sunken: #efefef
  /* inset wells */ --bg-hover: #f0f0f0 --bg-active: #e8e8e8
  --bg-invert: #171717 /* primary buttons, active slice row, dark cards */
  /* Borders */ --border: #e5e5e5 --border-strong: #d4d4d4
  --border-faint: #efefef /* Text */ --text: #171717 --text-muted: #6b6b6b
  --text-faint: #a3a3a3 --text-on-invert: #fafafa /* Semantic */
  --success: #15803d --success-bg: #dcfce7 --warning: #a16207
  --warning-bg: #fef3c7 --info: #1d4ed8 --info-bg: #dbeafe --danger: #b91c1c
  --danger-bg: #fee2e2;
```

### Border Radii

```css
--r-sm: 3px /* micro elements */ --r-md: 4px /* buttons, chips, input boxes */
  --r-lg: 6px /* cards, menus, larger containers */;
```

### Typography Scale

| Use                       | Size      | Weight | Notes                             |
| ------------------------- | --------- | ------ | --------------------------------- |
| Page title                | 22px      | 500    | letter-spacing: -0.015em          |
| Card / section title      | 13px      | 500    |                                   |
| Body / list items         | 13px      | 400    | line-height: 1.5                  |
| Secondary / muted         | 12–12.5px | 400    | color: --text-muted               |
| Captions / meta           | 11–11.5px | 400    | color: --text-faint               |
| Section headers (sidebar) | 10px      | 500    | uppercase, letter-spacing: 0.08em |
| Mono code / paths         | 11–12px   | 400    | --font-mono                       |
| Status bar                | 11px      | 400    | --font-mono                       |

---

## App Shell

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ Titlebar (40px)                                         │
├───────────────────┬─────────────────────────────────────┤
│ Sidebar (280px)   │ Main content (flex: 1)              │
│                   │                                     │
│                   │  padding: 24px 32px 48px            │
│                   │                                     │
├───────────────────┴─────────────────────────────────────┤
│ Status bar (26px)                                       │
└─────────────────────────────────────────────────────────┘
```

The `no-sidebar` variant (A2) hides the sidebar column entirely.

### Titlebar

- Left: 3 macOS-style traffic lights (12px circles, color `#E5E5E5` in the design — replace with real OS window controls)
- Center: `🍕` logo + "Slicewise" brand name + breadcrumb context (monospace, muted) — `Slicewise · diorama · 05-00 timeline playback`
- Right: Search `⌕` and Settings `⚙` icon buttons (24×24px, 4px radius, transparent bg)

### Sidebar (280px fixed)

Top-to-bottom:

1. **Repo switcher** — 24×24 monogram icon + project name + path + chevron
2. **Milestones section** — collapsible tree of milestone items + slice sub-items
3. **Project section** — links to Description, Roadmap, All decisions
4. **Agent threads section** (when workflow is active) — Coordinator + Executor status dots
5. **Footer** — status dot + label + version (`v0.4.2`)

### Status bar (26px)

Monospace, 11px. Left-to-right items separated by 16px gap:

- Branch or context chip
- Live/idle dot + connection status
- Step label (color-coded: info=blue, warning=amber, success=green)
- Right-aligned: `Slicewise 0.4.2 · pizza build`

---

## The 8-Step Workflow

The workflow is linear. Each step has a **gate** (a Menu component) where the user chooses what to do next. The Coordinator never proceeds without explicitly choosing.

```
Step 0: No project open          (screens A1, A2)
Step 0b: Missing docs            (screens B1, B2)
Step 1: Milestone init           (screens C1, C2)
Step 2: Milestone planning       (screens D1, D2)
Step 3: Prepare slice            (screens G1, G2)
Step 4: Executor Mode            (screens I1, I2)
Step 5: Process Executor report  (screens E1, E2)
Step 6: Draft/promote next slice (screens J1, J2)
Step 7: Milestone review         (screens F1, F2)
Step 8: Complete                 (screens H1, H2)
```

---

## Screens & Views

### A1 — No Projects (In-shell onboarding)

Full chrome with empty sidebar. Centered empty state.

- **Empty state mark**: 56×56px rounded box (14px radius), border, light shadow, emoji icon
- **Kicker**: monospace uppercase label "Welcome to Slicewise"
- **Title**: 24px, weight 500, "Add a project to begin"
- **Subtitle**: 13.5px muted, max-width 460px
- **Action rows**: 3 stacked clickable rows (`⌖ Open local folder`, `⎇ Clone from Git`, `✧ Create new project`). Each: icon + title + description + arrow. Selected state gets `--bg-invert` border.
- **Sub-links**: "Open recent", "Read the docs", "Command palette" — small muted links with icon prefix

### A2 — No Projects (Welcome hero, sidebar hidden)

No sidebar. Wide empty state (max-width 720px).

- **Inverted mark**: `--bg-invert` background on the logo box
- **Flow strip**: `Plan → Slice → Review → Complete` — 4 step pills with small glyph squares, monospace 11px
- **Action cards** (3-column grid): card variant of the actions, each with icon, title, description. Primary card (Open folder) uses `--bg-invert`.
- **Sub-links** includes install CTA: `npx skills add slicewise`

### B1 — Missing Docs (Terse checklist)

Project open, 2 required files absent.

- **Page title**: "Project setup"
- **Card**: "Required documents" with progress `0/2 present` / `1/2 present` / `2/2 present`
- **Doc rows**: path (monospace) + `required`/`present` badge + description + CTA button. Check circle fills green when done.
- **Primary button** disabled (opacity 0.35, cursor not-allowed) until both docs present.
- **Footer**: "Create both from template" button

### B2 — Missing Docs (Guided + scaffold)

One doc done, second in progress. Shows a **scaffold preview** — dark code block (`--bg-invert`) with the template markdown for `sw/roadmap.md`. Below it: a tip banner with the "thinking-partner" skill suggestion.

### C1 — Milestone Init (Capture sheet)

Coordinator captured goal+constraints from user's prompt.

- **Capture grid**: 2-column grid of labeled blocks — Goal (full-width, 14.5px lead text), Constraints (bullet list), Non-goals (tag pills), Source (monospace, muted)
- **Gate menu**: `[P] Plan · [A] Amend · [D] Decision · [X] Exit`

### C2 — Milestone Init (Coordinator handoff)

Same content but with a **Coordinator restatement** header: badge + prose summary in 14.5px. Below it the user's original prompt rendered in a dark terminal block, then the capture grid, then the menu.

### D1 — Milestone Planning (Slice stack)

Proposed 4-slice plan. Each slice rendered as a vertical rail with connecting line:

- **Slice 00** (detailed): full fields — goal, reviewable outcome, non-goals, implementation tasks (checkboxes), verification criteria. Node is filled `●`.
- **Slice 01** (sketched): goal only, `sketched` chip (blue badge). Node is `01`.
- **Slices 02–03** (outline): single goal line. Node is number.
- **Footer**: summary stats + "View as roadmap diff ↗"
- **Gate menu**: `[C] Accept · [A] Amend · [D] Decision · [X] Exit`

### D2 — Milestone Planning (Compact + side menu)

Two-column layout: left = compact table of slices (1 row per slice, smaller text), right = menu + tip box. Same slice data as D1.

### G1 — Prepare Slice (Readiness brief)

Slice 00 being prepared. 6/7 fields complete.

- **Readiness card**: 2-column grid of cells, each with ✓ or ○ mark + field name + value. Progress bar `86%` wide.
- **Open questions card**: Q1 answered (collapsed, green), Q2 active with 4 option buttons (Pure / Cache / Defer / Write custom). Selected option gets distinct styling.
- **"Mark ready" button** disabled until all questions answered.
- **Gate menu**: `[C] Mark ready · [Q] Answer questions · [A] Amend · [P] Executor prompt · [E] Enter Executor`

### G2 — Prepare Slice (Ready · Executor handoff)

All questions resolved.

- **Handoff cards**: 2-column — "Implement in this session" (inverted, primary) and "Hand to another session"
- **Executor prompt block**: dark terminal box showing the copyable self-contained prompt. Has a `⧉ Copy` button in the header. Prompt lines use colored text: labels in `#8FB8FF`, directives in `rgba(250,250,250,0.45)`.
- **Gate menu**: `[E] Enter Executor · [P] Copy prompt · [A] Amend · [X] Exit`

### I1 — Executor Mode (In-session)

The Slicewise app wraps an embedded **coding harness** (dark terminal pane). Status bar shows orange "executor working" state. Executor thread in sidebar is highlighted amber.

- **Exec strip**: badge + note + "esc to interrupt" button
- **Harness**: dark (`#131313`) flex column. Top bar with model/cwd chips + pulsing "working" badge. Body shows: prose messages (green/violet bullets), tool calls `⏺ Read(…)` / `Write(…)`, diff block, todo checklist, streaming "working" line with spinner + blinking cursor.
- **Harness footer**: keyboard hints (esc, ctrl-t) + file count + time + token count

### I2 — Executor Mode (Standalone)

No Slicewise chrome. A **macOS terminal window** shell (`#0C0C0C` bg, traffic lights colored). Inside: the same harness style but in "bare" mode. Shows completed run: all todos ✓, `npm run verify:…` command + PASS output, then the **standardized Executor report** in a green-bordered block (Summary / Changed files / Verification / Deviations / Open questions / Follow-up). Footer: `y` to copy report.

### E1 — Process Report (Report as received)

- **Verdict banner**: green `✓ accepted` — icon + label + text + pill
- **Report card**: key-value grid (150px key column) — Summary, Changed files (file list with +/~ stats), Verification (✓/– rows), Artifact disposition (state tags), Deviations
- **Findings card**: triage rows — `→ decision` badge + text + meta + "Open ↗" / `deferred` badge + text + meta + "Carry forward"
- **Gate menu**: `[N] Next slice · [S] Return to prep · [V] Review milestone · [D] Decision · [X] Exit`

### E2 — Process Report (Triage view)

Hero is the **classification triage** rather than the raw report. 3 items: `→ decision`, `deferred`, `finding` — each with action button. Below: compact artifacts table. Same gate menu.

### J1 — Next Slice (Promote 01: sketched → detailed)

- **Promote verdict banner**: blue `→` icon, "1 / 4 done" pill
- **Delta note**: blue info box — what slice 00 taught, carried into 01's design
- **Slice 01 brief card**: full detailed format (goal, reviewable outcome, non-goals, tasks with `drafted` badges on newly-added fields)
- **Carried-forward card**: the open question from slice 00, marked `still deferred`
- **Gate menu**: `[C] Promote · [A] Amend · [D] Decision · [R] Re-slice · [X] Exit`

### J2 — Next Slice (Slice queue)

- **Progress bar**: 4 segments — done (green), current (blue), next ×2 (grey)
- **Loop note**: info box explaining the cycle
- **Queue card**: 4 rows, each showing node (✓/number/dashed), name, status tag, goal, meta chips
- Same gate menu

### F1 — Milestone Review (Goal vs delivered)

All 4 slices accepted.

- **Goal card**: dark inverted box — original goal + ✓ Met assessment
- **Stats strip**: 4-up stat row — slices accepted, decisions, verification gaps, artifacts to disposition
- **Accepted slices ledger**: 4 rows, each ✓ node + slice name + outcome sentence
- **Verification story card**: green ✓ "all covered" + amber ⚠ gap warning
- **Gate menu**: `[C] Accept & complete · [A] Amend · [D] Decision · [S] Reopen slice · [X] Exit`

### F2 — Milestone Review (Artifact disposition)

- **Goal met verdict** banner
- **Artifacts table**: 3-col grid — artifact name+kind, state tag, recommended disposition (dropdown-style selector: Promote / Combine / Keep / Archive / Delete — each with a colored dot). "Accept all" button in footer.
- Same gate menu

### H1 — Complete (Summary)

- **Completion hero**: dark inverted banner — green `✓` seal + "Milestone complete" kicker + title + "4 slices · 5 decisions" sub + date
- **Final summary card**: prose paragraph in 13px
- **Durable verification card**: 3 rows — command + description. Footer: artifact counts + "View dispositions ↗"
- **Gate menu**: `[N] Plan next milestone · [V] View docs · [D] Decision · [X] Close`

### H2 — Complete (Roadmap progress)

- Same completion hero (compact, 18px title)
- **Roadmap rail card**: rows for MS 04 (done), 05 (just shipped — green bg, "just shipped" badge), 06 (up next — dashed node), 07 (later)
- Footer CTA: "Plan 06 →" primary button

---

## Key Shared Components

### Menu (The signature Slicewise element)

Used at the end of every gate screen. A bordered card with:

- Header: title (bold) + hint (monospace, faint) — e.g. `step-02-plan-milestone`
- Items: `[key]` box (24×24, monospace, bordered) + label + description + `↵` arrow. Primary item uses `--bg-invert`. Danger items have muted key.
- First item is always the "recommended" happy path — gets a `recommended` green badge next to the label.
- Footer (optional): monospace hint text, `⏎` prefix

### AppWindow chrome wrapper

All screens except I2 wrap in `AppWindow`. Props: `ctx[]` (breadcrumb segments), `sidebar`, `statusItems`, `main`, `noSidebar`.

### Sidebar sections

- `WorkflowSidebar` — for milestone in-flight screens (shows milestone tree with slice sub-items)
- `ReviewSidebar` — for process/review screens (shows slice completion status)
- `PrepareSidebar` — for prepare/complete screens
- `ExecutorSidebar` — for executor mode (Executor thread highlighted amber)
- `EmptySidebar` — for no-project state (ghost placeholder rows)
- `ProjectSidebar` — for setup state (shows missing doc warnings)

### Milestone tree (sidebar)

- Milestone items: chevron + 2-digit number + name + status pill
- Slice sub-items: 8px dot (solid/dashed) + number + name. Active slice row uses `--bg-invert` full-bleed (no border-radius on left side — bleeds to sidebar edge).
- Completed milestones: muted weight, `✓` in green

### Breadcrumb

`diorama / 05-timeline-playback / slice 00 / ready` — monospace 11px, faint color, current segment is `--text`

### Page head

Flex row: title block (h1 + meta chips + status chip) + action buttons (secondary + primary). Bordered bottom.

### Meta chips

Monospace 11px, subtle bg, 1px border, 4px radius. Icon glyph (⌥ ◆ ◷ ⎇ ↳) + label.

### Status chip

Inline flex with a colored pulsing dot. Colors: `--info` (blue, step labels), `--warning` (amber), `--success` (green), `--danger` (red).

### Cards

White bg, 1px border, 6px radius. Card head: title + sub-label (muted) + right-side progress label (monospace). Body varies per screen.

### Buttons

- Default: white bg, 1px border, 12.5px, weight 500
- Primary: `--bg-invert` bg, white text
- Small: 5px 10px padding, 12px font
- Keyboard hint inside button: `<kbd>` monospace 10px, subtle bg

---

## Interactions & Behavior

### Navigation

- All gate menus: pressing the letter key OR clicking the row triggers the action
- Sidebar milestone items: click to navigate to that milestone/slice
- Breadcrumb: click any segment to navigate up
- Repo switcher: click opens project picker
- `⌘O` keyboard shortcut opens local folder

### State transitions

- **B1 doc rows**: clicking "Create file" / "Open ↗" toggles the doc's done state — check mark fills, badge turns green, primary button unlocks at 2/2
- **G1 option buttons**: clicking an option selects it, resolves Q2, unlocks "Mark ready"
- **A1 action rows**: clicking an action row highlights it with `--bg-invert` border
- **Executor harness (I1)**: live streaming — tool calls appear one by one, spinner animates, diff block fills in, working line pulses

### Animations

- Harness pulse dot: `opacity 1 → 0.25 → 1`, 1.1s ease-in-out loop (`hpulse`)
- Harness spinner: `rotate 360deg`, 0.7s linear loop (`hspin`)
- Harness cursor blink: `opacity 0/1`, 1s step-end loop (`hblink`)
- Button hover: `background` transition 100ms ease
- Action card hover: `border-color`, `background`, `transform: translateY(-1px)` 120ms ease

### Hover states

- Sidebar links: `--bg-hover` background
- Milestone items: `--bg-hover`
- Menu items: `--bg-hover` (primary items go to `#000`)
- Repo switcher: `--bg-hover`
- Action cards: `border-color: --border-strong`, `background: #fff`, `translateY(-1px)`

---

## Design Tokens — Quick Reference

```
Spacing used: 4, 6, 8, 10, 12, 14, 16, 20, 24, 32 px
Card gap: 16px
Sidebar width: 280px
Titlebar height: 40px
Status bar height: 26px
Main padding: 24px 32px 48px
Page title: 22px/500
Section dividers: 1px solid --border
```

---

## Assets

No external images or icons. All decorative marks use Unicode glyphs rendered in the UI fonts:

- `🍕` — app logo (emoji)
- `⌖ ⎇ ✧ ◆ ⊘ ⛬ ↳ ✲ ↺ ↗` — action/field glyphs (monospace)
- `▤ ▦ ⌥ ⌕ ⚙ ▾ ▸` — sidebar/chrome glyphs
- `⏺` — tool call marker in the harness

---

## Files in This Package

| File                     | Purpose                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| `Slicewise Screens.html` | Entry point — mounts all screens on a scrollable design canvas              |
| `design-canvas.jsx`      | Pan/zoom design canvas shell (scaffolding only, not a product screen)       |
| `sw-screens.jsx`         | Steps 0–0b: No project + Missing docs (A1, A2, B1, B2)                      |
| `sw-workflow.jsx`        | Steps 1–2: Milestone init + planning (C1, C2, D1, D2)                       |
| `sw-prepare.jsx`         | Steps 3, 8: Prepare slice + Complete (G1, G2, H1, H2)                       |
| `sw-executor.jsx`        | Step 4: Executor Mode (I1, I2)                                              |
| `sw-review.jsx`          | Steps 5, 7: Process report + Milestone review (E1, E2, F1, F2)              |
| `sw-nextslice.jsx`       | Step 6: Draft/promote next slice (J1, J2)                                   |
| `empty-states.css`       | **Core design system** — tokens, app shell, shared components               |
| `workflow.css`           | Steps 1–2 styles (sidebar tree, menu, capture, plan slices)                 |
| `harness.css`            | Step 4 styles (dark terminal harness, transcript elements)                  |
| `review.css`             | Steps 5, 7 styles (verdict banner, report fields, triage, artifacts)        |
| `complete.css`           | Steps 3, 8 styles (readiness grid, handoff cards, completion hero, roadmap) |
| `next.css`               | Step 6 styles (promote banner, delta note, carried questions, queue rows)   |

---

## Notes for the Implementer

1. **The Menu is the core UX primitive.** Every step ends with one. It must be keyboard-navigable (single letter key) with a clear visual hierarchy (primary item inverted, recommended badge, danger items muted).

2. **The harness (I1) will be the most complex screen to implement.** In production it connects to a real streaming agent. The design shows the settled state — build it to progressively render tool calls, diffs, and messages as they stream in.

3. **Slice items in the sidebar are the persistent context indicator.** The active slice row uses `--bg-invert` full-bleed to the left edge (no left border-radius) — this is intentional and should be preserved.

4. **All step-label status bar items are color-coded** by phase: blue = info/stable, amber = in-progress/awaiting, green = accepted/complete. Respect this consistently.

5. **The Executor prompt block (G2)** must have a working "Copy" button — it's a primary handoff mechanism.

6. **Artifact disposition dropdowns (F2)** should be real `<select>` elements or a custom dropdown with the same visual (colored dot + label + chevron).

7. **The verification criteria throughout use `verify:<name>` as runnable script names** — wire these to real `npm run verify:…` commands in the implementation.
