// sw-workflow.jsx — Milestone init (step 1) + planning (step 2) screens.
// Reuses AppWindow (from sw-screens.jsx, on window). Exports its screens to window.

const { useState: useStateWF } = React;

/* ─── Shared: milestone-tree sidebar for an in-flight milestone ─── */
function WorkflowSidebar({ phase }) {
  // phase: 'init' (05 just created, no slices) | 'plan' (05 with proposed slices)
  const proposed = [
    { num: "00", name: "timeline data model" },
    { num: "01", name: "scrubber + playhead" },
    { num: "02", name: "keyframe interpolation" },
    { num: "03", name: "playback engine" },
  ];
  return (
    <React.Fragment>
      <div className="repo-switcher">
        <div className="repo-icon">D</div>
        <div className="repo-meta">
          <div className="repo-name">diorama</div>
          <div className="repo-path">~/code/diorama</div>
        </div>
        <span className="chev">▾</span>
      </div>

      <div className="sb-section">
        <div className="sb-section-head">
          <span>Milestones</span>
          <span className="add">+</span>
        </div>

        <div className="ms-item active">
          <span className="chev">▾</span>
          <span className="num">05</span>
          <span className="name">Timeline playback</span>
          <span className="ms-status draft">
            {phase === "init" ? "new" : "plan"}
          </span>
        </div>

        {phase === "init" ? (
          <div className="sb-plan-note">
            Not planned yet — slices appear once you plan the milestone.
          </div>
        ) : (
          <div className="ms-slices">
            {proposed.map((s) => (
              <div className="slice-item proposed" key={s.num}>
                <span className="dot"></span>
                <span className="num">{s.num}</span>
                <span className="name">{s.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="ms-item completed">
          <span className="chev">▸</span>
          <span className="num">04</span>
          <span className="name">Component registry</span>
          <span className="ms-status complete">✓</span>
        </div>
        <div className="ms-item completed">
          <span className="chev">▸</span>
          <span className="num">03</span>
          <span className="name">Scene affordances</span>
          <span className="ms-status complete">✓</span>
        </div>
        <div className="ms-item completed">
          <span className="chev">▸</span>
          <span className="num">02</span>
          <span className="name">Browser sessions</span>
          <span className="ms-status complete">✓</span>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-head">
          <span>Project</span>
        </div>
        <div className="sb-link">
          <i className="ico">▤</i> Description
        </div>
        <div className="sb-link">
          <i className="ico">▦</i> Roadmap
        </div>
        <div className="sb-link">
          <i className="ico">⌥</i> All decisions{" "}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-faint)",
            }}
          >
            18
          </span>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-head">
          <span>Agent threads</span>
        </div>
        <div
          className="thread-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            fontSize: 12.5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--success)",
              boxShadow: "0 0 0 2px rgba(21,128,61,0.15)",
            }}
          ></span>
          <span style={{ flex: 1 }}>Coordinator</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-faint)",
            }}
          >
            now
          </span>
        </div>
        <div
          className="thread-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            fontSize: 12.5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--text-faint)",
            }}
          ></span>
          <span style={{ flex: 1, color: "var(--text-muted)" }}>Executor</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-faint)",
            }}
          >
            —
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="ico" style={{ color: "var(--info)" }}>
          ●
        </span>
        <span>
          {phase === "init" ? "Milestone initialized" : "Plan proposed"}
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

function StatusBarWF({ extra }) {
  return (
    <React.Fragment>
      <span className="sb-item">
        <span className="ico">⎇</span>05-timeline-playback
      </span>
      <span className="sb-item">
        <span className="live-dot"></span>app-server connected
      </span>
      {extra}
      <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
    </React.Fragment>
  );
}

/* ─── Reusable bracketed-letter menu ─────────────────────────── */
function Menu({ title, hint, items, foot }) {
  return (
    <div className="menu">
      <div className="menu-head">
        <span className="mt">{title}</span>
        {hint && <span className="ms">{hint}</span>}
      </div>
      {items.map((it) => (
        <div
          key={it.key}
          className={
            "menu-item" +
            (it.primary ? " primary" : "") +
            (it.danger ? " danger" : "")
          }
        >
          <span className="menu-key">{it.key}</span>
          <span className="menu-body">
            <span className="menu-label">
              {it.label}
              {it.rec && <span className="rec">recommended</span>}
            </span>
            <span className="menu-desc">{it.desc}</span>
          </span>
          <span className="menu-arrow">↵</span>
        </div>
      ))}
      {foot && <div className="menu-foot">{foot}</div>}
    </div>
  );
}

const INIT_MENU = [
  {
    key: "P",
    label: "Plan this milestone",
    desc: "Break the goal into a small set of vertical slices.",
    primary: true,
    rec: true,
  },
  {
    key: "A",
    label: "Amend goal or constraints",
    desc: "Refine what Coordinator captured before planning.",
  },
  {
    key: "D",
    label: "Add a decision record",
    desc: "Capture an architectural choice that should persist.",
  },
  {
    key: "X",
    label: "Exit",
    desc: "Leave the milestone docs as they are.",
    danger: true,
  },
];

const PLAN_MENU = [
  {
    key: "C",
    label: "Accept plan and continue",
    desc: "Promote slice 00 and move to slice preparation.",
    primary: true,
    rec: true,
  },
  {
    key: "A",
    label: "Amend the plan",
    desc: "Add, remove, reorder, or re-scope the proposed slices.",
  },
  {
    key: "D",
    label: "Add or update decision records",
    desc: "Record a choice the plan depends on (e.g. data model).",
  },
  {
    key: "X",
    label: "Exit",
    desc: "Keep the proposed plan as a draft and stop here.",
    danger: true,
  },
];

/* ════════════════════════════════════════════════════════════
   C1 — Milestone init · capture sheet
   ════════════════════════════════════════════════════════════ */
function MilestoneInitCapture() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline playback"]}
      sidebar={<WorkflowSidebar phase="init" />}
      statusItems={
        <StatusBarWF
          extra={
            <span className="sb-item" style={{ color: "var(--info)" }}>
              initialized · step 1
            </span>
          }
        />
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">05-timeline-playback</span>
          </div>
          <div className="page-head">
            <div className="page-title-block">
              <h1 className="page-title">Timeline playback</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>05-timeline-playback
                </span>
                <span className="meta-chip">
                  <i>◷</i>Coordinator Mode
                </span>
                <span className="status-chip draft">
                  <span className="dot"></span>Initialized — not planned
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Plan milestone <span className="kbd">P</span>
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>What Coordinator captured</span>
                <span className="sub">
                  from your prompt — confirm before planning
                </span>
              </div>
              <div className="card-progress">milestone goal</div>
            </div>
            <div className="capture-grid">
              <div className="capture-block full">
                <div className="capture-label">
                  <span className="ico" style={{ fontSize: 11 }}>
                    ◆
                  </span>{" "}
                  Goal
                </div>
                <div className="capture-value lead">
                  Let users scrub through and play back a composed scene on a
                  timeline, so motion can be reviewed without exporting.
                </div>
              </div>
              <div className="capture-block">
                <div className="capture-label">
                  <span className="ico" style={{ fontSize: 11 }}>
                    ⛬
                  </span>{" "}
                  Constraints
                </div>
                <ul className="bullet-list">
                  <li>
                    Build on the existing scene + component registry (milestone
                    04).
                  </li>
                  <li>Keep it lightweight — reviewable in one milestone.</li>
                  <li>60fps scrubbing on scenes up to ~200 components.</li>
                </ul>
              </div>
              <div className="capture-block">
                <div className="capture-label">
                  <span className="ico" style={{ fontSize: 11 }}>
                    ⊘
                  </span>{" "}
                  Non-goals
                </div>
                <div className="tag-list">
                  <span className="tag neg">audio sync</span>
                  <span className="tag neg">multi-track editor</span>
                  <span className="tag neg">easing curve UI</span>
                  <span className="tag neg">video export</span>
                </div>
              </div>
              <div className="capture-block full">
                <div className="capture-label">
                  <span className="ico" style={{ fontSize: 11 }}>
                    ↳
                  </span>{" "}
                  Source
                </div>
                <div
                  className="capture-value"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  roadmap.md › Milestone 05 · captured from chat 2 min ago
                </div>
              </div>
            </div>
          </div>

          <Menu
            title="Initialization menu"
            hint="step-01-init"
            items={INIT_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Every menu is a stop. Pick an action to continue.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   C2 — Milestone init · coordinator handoff (provenance)
   ════════════════════════════════════════════════════════════ */
function MilestoneInitHandoff() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline playback"]}
      sidebar={<WorkflowSidebar phase="init" />}
      statusItems={
        <StatusBarWF
          extra={
            <span className="sb-item" style={{ color: "var(--info)" }}>
              initialized · step 1
            </span>
          }
        />
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">05-timeline-playback</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 18, paddingBottom: 18 }}
          >
            <div className="page-title-block">
              <div className="coord-line">
                <span className="coord-badge">
                  <span className="live-dot"></span>Coordinator
                </span>
                <span>initialized milestone · 2 min ago</span>
              </div>
              <div className="restate">
                Here's the milestone I set up from your request — a{" "}
                <b>timeline for scrubbing and playing back a composed scene.</b>{" "}
                Review what I captured, then plan it into slices.
              </div>
            </div>
          </div>

          {/* Your prompt */}
          <div style={{ marginBottom: 16 }}>
            <div className="prompt-block">
              <div className="prompt-head">
                <span className="live-dot"></span>your request · Coordinator
                Mode
              </div>
              <div className="prompt-body">
                <span className="dim">›</span>{" "}
                <span className="cmd">Use Slicewise in Coordinator Mode.</span>
                {"\n"}I want a timeline so I can scrub through a scene and watch
                it play back.{"\n"}Keep it lightweight — build on the scene +
                registry work. No audio or{"\n"}export yet.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Captured</span>
                <span className="sub">editable before planning</span>
              </div>
              <div className="card-progress">3 fields</div>
            </div>
            <div className="capture-grid">
              <div className="capture-block full">
                <div className="capture-label">Goal</div>
                <div className="capture-value">
                  Let users scrub through and play back a composed scene on a
                  timeline, so motion can be reviewed without exporting.
                </div>
              </div>
              <div className="capture-block">
                <div className="capture-label">Constraints</div>
                <ul className="bullet-list">
                  <li>Build on milestone 04 (scene + registry).</li>
                  <li>Lightweight — one reviewable milestone.</li>
                </ul>
              </div>
              <div className="capture-block">
                <div className="capture-label">Non-goals</div>
                <div className="tag-list">
                  <span className="tag neg">audio sync</span>
                  <span className="tag neg">multi-track</span>
                  <span className="tag neg">export</span>
                </div>
              </div>
            </div>
          </div>

          <Menu
            title="What next?"
            hint="step-01-init"
            items={INIT_MENU}
            foot={
              <React.Fragment>
                Press a letter, or click. Coordinator stops here until you
                choose.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   D1 — Milestone planning · slice stack (detail gradient)
   ════════════════════════════════════════════════════════════ */
function MilestonePlanStack() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline playback"]}
      sidebar={<WorkflowSidebar phase="plan" />}
      statusItems={
        <StatusBarWF
          extra={
            <span className="sb-item" style={{ color: "var(--warning)" }}>
              plan proposed · step 2
            </span>
          }
        />
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb">plan</span>
          </div>
          <div className="page-head">
            <div className="page-title-block">
              <h1 className="page-title">Proposed plan</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>4 slices
                </span>
                <span className="meta-chip">
                  <i>◆</i>slice 00 detailed
                </span>
                <span className="status-chip proposed">
                  <span className="dot"></span>Awaiting your approval
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Accept plan <span className="kbd">C</span>
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Vertical slices</span>
                <span className="sub">
                  detail tapers — 00 ready to build, later slices stay light
                </span>
              </div>
              <div className="card-progress">first slice fully specified</div>
            </div>

            {/* Slice 00 — detailed */}
            <div className="plan-slice detailed">
              <div className="plan-rail">
                <span className="plan-node">●</span>
                <span className="plan-line"></span>
              </div>
              <div className="plan-main">
                <div className="plan-top">
                  <span className="plan-num">00</span>
                  <span className="plan-name">timeline data model</span>
                  <span className="detail-chip full">detailed</span>
                </div>
                <div className="plan-goal">
                  A serializable timeline that holds tracks, keyframes, and a
                  playhead, wired to the existing registry so each component
                  resolves its value at time{" "}
                  <code
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                  >
                    t
                  </code>
                  .
                </div>
                <div className="plan-fields">
                  <div className="plan-field">
                    <div className="pf-label">Reviewable outcome</div>
                    <div className="pf-val">
                      Load a fixture scene, set t, read back interpolated values
                      in a test harness.
                    </div>
                  </div>
                  <div className="plan-field">
                    <div className="pf-label">Non-goals</div>
                    <div className="pf-val">
                      No UI yet — model + read API only.
                    </div>
                  </div>
                  <div className="plan-field" style={{ gridColumn: "1 / -1" }}>
                    <div className="pf-label">Implementation tasks</div>
                    <ul className="plan-tasks">
                      <li>
                        <span className="tk"></span>Define{" "}
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                          }}
                        >
                          Timeline
                        </code>{" "}
                        /{" "}
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                          }}
                        >
                          Track
                        </code>{" "}
                        /{" "}
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                          }}
                        >
                          Keyframe
                        </code>{" "}
                        schemas (Zod).
                      </li>
                      <li>
                        <span className="tk"></span>Resolve component value at
                        time t via registry id.
                      </li>
                      <li>
                        <span className="tk"></span>Serialize / deserialize to{" "}
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                          }}
                        >
                          scene.timeline.json
                        </code>
                        .
                      </li>
                    </ul>
                  </div>
                  <div className="plan-field" style={{ gridColumn: "1 / -1" }}>
                    <div className="pf-label">Verification</div>
                    <div className="pf-val mono">
                      verify:timeline-model — round-trip + value-at-t on fixture
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slice 01 — sketched */}
            <div className="plan-slice sketched">
              <div className="plan-rail">
                <span className="plan-node">01</span>
                <span className="plan-line"></span>
              </div>
              <div className="plan-main">
                <div className="plan-top">
                  <span className="plan-num">01</span>
                  <span className="plan-name">scrubber + playhead</span>
                  <span className="detail-chip sketch">sketched</span>
                </div>
                <div className="plan-goal">
                  A draggable scrubber bound to the model — moving the playhead
                  updates the scene live. Refined into tasks when promoted.
                </div>
              </div>
            </div>

            {/* Slice 02 — outline */}
            <div className="plan-slice outline">
              <div className="plan-rail">
                <span className="plan-node">02</span>
                <span className="plan-line"></span>
              </div>
              <div className="plan-main">
                <div className="plan-top">
                  <span className="plan-num">02</span>
                  <span className="plan-name">keyframe interpolation</span>
                  <span className="detail-chip outline">outline</span>
                </div>
                <div className="plan-goal">
                  Tween between keyframes (linear first). Direction only —
                  scoped later.
                </div>
              </div>
            </div>

            {/* Slice 03 — outline */}
            <div className="plan-slice outline">
              <div className="plan-rail">
                <span className="plan-node">03</span>
              </div>
              <div className="plan-main">
                <div className="plan-top">
                  <span className="plan-num">03</span>
                  <span className="plan-name">playback engine</span>
                  <span className="detail-chip outline">outline</span>
                </div>
                <div className="plan-goal">
                  requestAnimationFrame loop driving the playhead at scene fps.
                </div>
              </div>
            </div>

            <div className="setup-footer">
              <span className="plan-summary">
                <span className="ps">
                  <b>4</b> slices
                </span>
                <span className="ps">
                  <b>1</b> detailed
                </span>
                <span className="ps">
                  <b>1</b> sketched
                </span>
                <span className="ps">
                  <b>2</b> outlined
                </span>
              </span>
              <button className="btn sm">View as roadmap diff ↗</button>
            </div>
          </div>

          <Menu
            title="Plan gate"
            hint="step-02-plan-milestone"
            items={PLAN_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Accepting promotes slice 00 to current and opens its
                open-questions gate.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   D2 — Milestone planning · compact table + side menu
   ════════════════════════════════════════════════════════════ */
function MilestonePlanCompact() {
  const rows = [
    {
      num: "00",
      name: "timeline data model",
      detail: "full",
      goal: "Serializable tracks + keyframes; resolve component value at time t via the registry.",
      out: "value-at-t on a fixture scene",
    },
    {
      num: "01",
      name: "scrubber + playhead",
      detail: "sketch",
      goal: "Draggable scrubber bound to the model; live scene update on seek.",
      out: "drag → scene reflects t",
    },
    {
      num: "02",
      name: "keyframe interpolation",
      detail: "outline",
      goal: "Tween between keyframes, linear first.",
      out: "—",
    },
    {
      num: "03",
      name: "playback engine",
      detail: "outline",
      goal: "rAF loop driving the playhead at scene fps.",
      out: "—",
    },
  ];
  const chip = { full: "detailed", sketch: "sketched", outline: "outline" };
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline playback"]}
      sidebar={<WorkflowSidebar phase="plan" />}
      statusItems={
        <StatusBarWF
          extra={
            <span className="sb-item" style={{ color: "var(--warning)" }}>
              plan proposed · step 2
            </span>
          }
        />
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb">plan</span>
          </div>
          <div className="page-head">
            <div className="page-title-block">
              <h1 className="page-title">Plan: 4 vertical slices</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>↳</i>from roadmap › Milestone 05
                </span>
                <span className="status-chip proposed">
                  <span className="dot"></span>Proposed — review &amp; accept
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Accept plan <span className="kbd">C</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-head">
                <div className="card-title">
                  <span>Proposed slices</span>
                  <span className="sub">
                    first detailed, rest intentionally light
                  </span>
                </div>
                <div className="card-progress">4 slices</div>
              </div>
              <div>
                {rows.map((r, i) => (
                  <div
                    key={r.num}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "20px 1fr",
                      gap: 12,
                      padding: "13px 16px",
                      borderBottom:
                        i < rows.length - 1
                          ? "1px solid var(--border-faint)"
                          : "none",
                    }}
                  >
                    <span
                      className="plan-node"
                      style={
                        r.detail === "full"
                          ? { borderColor: "var(--text)", color: "var(--text)" }
                          : null
                      }
                    >
                      {r.detail === "full" ? "●" : r.num}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div className="plan-top" style={{ marginBottom: 3 }}>
                        <span className="plan-name" style={{ fontSize: 13 }}>
                          {r.name}
                        </span>
                        <span
                          className={
                            "detail-chip " +
                            (r.detail === "full"
                              ? "full"
                              : r.detail === "sketch"
                                ? "sketch"
                                : "outline")
                          }
                        >
                          {chip[r.detail]}
                        </span>
                      </div>
                      <div
                        className="plan-goal"
                        style={{ margin: 0, fontSize: 12 }}
                      >
                        {r.goal}
                      </div>
                      {r.out !== "—" && (
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10.5,
                            color: "var(--text-faint)",
                            marginTop: 5,
                          }}
                        >
                          ↳ reviewable: {r.out}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Menu title="Plan gate" hint="step-02" items={PLAN_MENU} />
              <div className="tip" style={{ margin: 0 }}>
                <span className="ico">✲</span>
                <span>
                  Slices stay small on purpose — only slice{" "}
                  <b style={{ color: "var(--text)", fontWeight: 500 }}>00</b> is
                  fully specified. The rest sharpen as each is promoted.
                </span>
              </div>
            </div>
          </div>
        </main>
      }
    />
  );
}

Object.assign(window, {
  MilestoneInitCapture,
  MilestoneInitHandoff,
  MilestonePlanStack,
  MilestonePlanCompact,
});
