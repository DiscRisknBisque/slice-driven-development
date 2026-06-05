// sw-review.jsx — Process Executor report (step 5) + Milestone review (step 7).
// Reuses AppWindow + Menu (on window from earlier files). Exports screens to window.

/* ─── Sidebar: slice 00 done, executor thread idle ──────────── */
function ReviewSidebar({ mode }) {
  // mode: 'process' (slice 00 just implemented) | 'review' (all slices accepted)
  const slices = [
    {
      num: "00",
      name: "timeline data model",
      state: mode === "process" ? "review" : "done",
    },
    {
      num: "01",
      name: "scrubber + playhead",
      state: mode === "review" ? "done" : "proposed",
    },
    {
      num: "02",
      name: "keyframe interpolation",
      state: mode === "review" ? "done" : "proposed",
    },
    {
      num: "03",
      name: "playback engine",
      state: mode === "review" ? "done" : "proposed",
    },
  ];
  const dotStyle = (s) => {
    if (s === "done")
      return { background: "var(--success)", borderColor: "var(--success)" };
    if (s === "review")
      return { background: "var(--info)", borderColor: "var(--info)" };
    return {};
  };
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
          <span
            className="ms-status draft"
            style={
              mode === "review"
                ? { background: "var(--success-bg)", color: "var(--success)" }
                : null
            }
          >
            {mode === "review" ? "review" : "1/4"}
          </span>
        </div>
        <div className="ms-slices">
          {slices.map((s) => (
            <div
              className={
                "slice-item" + (s.state === "proposed" ? " proposed" : "")
              }
              key={s.num}
              style={
                s.state === "review" ? { background: "var(--bg-sunken)" } : null
              }
            >
              <span className="dot" style={dotStyle(s.state)}>
                {s.state === "done" ? "" : ""}
              </span>
              <span className="num">{s.num}</span>
              <span
                className="name"
                style={
                  s.state === "done" ? { color: "var(--text-muted)" } : null
                }
              >
                {s.name}
              </span>
              {s.state === "review" && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--info)",
                  }}
                >
                  ●
                </span>
              )}
              {s.state === "done" && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    color: "var(--success)",
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>

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
            {mode === "review" ? 23 : 19}
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
            {mode === "process" ? "done" : "—"}
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span
          className="ico"
          style={{
            color: mode === "review" ? "var(--success)" : "var(--info)",
          }}
        >
          ●
        </span>
        <span>
          {mode === "review" ? "Milestone review" : "Processing report"}
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

/* ════════════════════════════════════════════════════════════
   E1 — Process report · report as received
   ════════════════════════════════════════════════════════════ */
const PROCESS_MENU = [
  {
    key: "N",
    label: "Draft or promote next slice",
    desc: "Accept slice 00 and move to slice 01 (scrubber + playhead).",
    primary: true,
    rec: true,
  },
  {
    key: "S",
    label: "Return to current slice prep",
    desc: "Slice 00 needs revision — reopen its preparation gate.",
  },
  {
    key: "V",
    label: "Review milestone",
    desc: "Jump to milestone review if the goal may already be met.",
  },
  {
    key: "D",
    label: "Record a decision",
    desc: "Promote a finding into a durable decision record.",
  },
  {
    key: "X",
    label: "Exit",
    desc: "Leave the report processed but take no further action.",
    danger: true,
  },
];

function ProcessReport() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline data model"]}
      sidebar={<ReviewSidebar mode="process" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-00-timeline-data-model
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--info)" }}>
            report received · step 5
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb current">slice 00</span>
            <span className="sep">/</span>
            <span className="crumb">report</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Executor report</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⎇</i>slice 00 · timeline data model
                </span>
                <span className="meta-chip">
                  <i>◷</i>Executor → Coordinator
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend slice <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Promote next slice <span className="kbd">N</span>
              </button>
            </div>
          </div>

          {/* Coordinator verdict */}
          <div className="verdict accepted">
            <span className="verdict-icon">✓</span>
            <div className="verdict-main">
              <div className="verdict-label">Coordinator verdict</div>
              <div className="verdict-text">
                Slice <b>accepted</b> —{" "}
                <span className="em">
                  behavior verified, one finding recorded as a decision, no
                  blocking questions.
                </span>
              </div>
            </div>
            <span className="verdict-pill">accepted</span>
          </div>

          {/* Structured report */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Report</span>
                <span className="sub">report-template.md · as submitted</span>
              </div>
              <div className="card-progress">verified ✓</div>
            </div>
            <div>
              <div className="report-field">
                <span className="rf-key">Summary</span>
                <span className="rf-val">
                  Added a serializable timeline model (tracks, keyframes,
                  playhead) that resolves any registered component's value at
                  time{" "}
                  <code
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                  >
                    t
                  </code>
                  . No UI — model + read API only, as scoped.
                </span>
              </div>
              <div className="report-field">
                <span className="rf-key">Changed files</span>
                <span className="rf-val">
                  <div className="file-list">
                    <div className="file-row">
                      <span className="fstat add">+</span>
                      <span className="fpath">src/timeline/model.ts</span>
                      <span className="floc">+184</span>
                    </div>
                    <div className="file-row">
                      <span className="fstat add">+</span>
                      <span className="fpath">src/timeline/resolve.ts</span>
                      <span className="floc">+92</span>
                    </div>
                    <div className="file-row">
                      <span className="fstat add">+</span>
                      <span className="fpath">src/timeline/serialize.ts</span>
                      <span className="floc">+61</span>
                    </div>
                    <div className="file-row">
                      <span className="fstat mod">~</span>
                      <span className="fpath">src/registry/index.ts</span>
                      <span className="floc">+12 −3</span>
                    </div>
                  </div>
                </span>
              </div>
              <div className="report-field">
                <span className="rf-key">Verification</span>
                <span className="rf-val">
                  <div className="verify-row">
                    <span className="vmark pass">✓</span>
                    <span className="vcmd">verify:timeline-model</span>
                    <span className="vnote">
                      — round-trip + value-at-t on fixture scene · 14 assertions
                    </span>
                  </div>
                  <div className="verify-row">
                    <span className="vmark pass">✓</span>
                    <span className="vcmd">typecheck</span>
                    <span className="vnote">— clean</span>
                  </div>
                  <div className="verify-row">
                    <span className="vmark skip">–</span>
                    <span className="vcmd">visual review</span>
                    <span className="vnote">— n/a, no UI in this slice</span>
                  </div>
                </span>
              </div>
              <div className="report-field">
                <span className="rf-key">Artifact disposition</span>
                <span className="rf-val">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span className="state-tag provisional">
                      provisional · fixtures/scene.basic.json
                    </span>
                    <span className="state-tag generated">
                      generated · scene.timeline.json
                    </span>
                    <span className="state-tag open">
                      open · perf bench deferred
                    </span>
                  </div>
                </span>
              </div>
              <div className="report-field">
                <span className="rf-key">Deviations</span>
                <span className="rf-val">
                  Stored keyframes as a sorted array rather than a map — ordered
                  reads dominate. Recorded below as a decision.
                </span>
              </div>
            </div>
          </div>

          {/* Findings & open questions, classified */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Findings &amp; open questions</span>
                <span className="sub">classified by Coordinator</span>
              </div>
              <div className="card-progress">1 decision · 1 deferred</div>
            </div>
            <div>
              <div className="triage-row">
                <span className="triage-class">
                  <span className="class-badge decision">→ decision</span>
                </span>
                <div className="triage-body">
                  <div className="triage-text">
                    Keyframes are a sorted array keyed by time; inserts re-sort.
                    Reads are O(log n).
                  </div>
                  <div className="triage-meta">
                    Recorded as{" "}
                    <code
                      style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                    >
                      decisions/0019-keyframe-storage.md
                    </code>
                  </div>
                </div>
                <span className="triage-action">
                  <button className="btn sm">Open ↗</button>
                </span>
              </div>
              <div className="triage-row">
                <span className="triage-class">
                  <span className="class-badge deferred">deferred</span>
                </span>
                <div className="triage-body">
                  <div className="triage-text">
                    Does value-at-t need to be allocation-free for 60fps
                    playback?
                  </div>
                  <div className="triage-meta">
                    Parked for slice 03 (playback engine) — not blocking the
                    model.
                  </div>
                </div>
                <span className="triage-action">
                  <button className="btn sm">Carry forward</button>
                </span>
              </div>
            </div>
          </div>

          <Menu
            title="Process report"
            hint="step-05-process-report"
            items={PROCESS_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Coordinator recorded the report. Choose how to move the
                milestone forward.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   E2 — Process report · triage view
   ════════════════════════════════════════════════════════════ */
function ProcessReportTriage() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline data model"]}
      sidebar={<ReviewSidebar mode="process" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-00-timeline-data-model
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--info)" }}>
            report received · step 5
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb current">slice 00</span>
            <span className="sep">/</span>
            <span className="crumb">process</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Process report — slice 00</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>4 changed files
                </span>
                <span className="meta-chip">
                  <i>✓</i>verification passed
                </span>
                <span className="meta-chip">
                  <i>◇</i>3 items to classify
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Return to prep <span className="kbd">S</span>
              </button>
              <button className="btn primary">
                Accept &amp; continue <span className="kbd">N</span>
              </button>
            </div>
          </div>

          <div className="verdict accepted">
            <span className="verdict-icon">✓</span>
            <div className="verdict-main">
              <div className="verdict-label">Status decision</div>
              <div className="verdict-text">
                <b>Accepted.</b>{" "}
                <span className="em">
                  All items classified — nothing blocks promoting the next
                  slice.
                </span>
              </div>
            </div>
            <span className="verdict-pill">accepted</span>
          </div>

          {/* Classification triage as hero */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Classify what implementation taught us</span>
                <span className="sub">
                  findings, questions &amp; deviations
                </span>
              </div>
              <div className="card-progress">3 items</div>
            </div>
            <div>
              <div className="triage-row">
                <span className="triage-class">
                  <span className="class-badge decision">→ decision</span>
                </span>
                <div className="triage-body">
                  <div className="triage-text">
                    Keyframes stored as a sorted array, not a map — ordered
                    reads dominate, inserts re-sort.
                  </div>
                  <div className="triage-meta">
                    Deviation from plan → promoted to{" "}
                    <code>0019-keyframe-storage.md</code>
                  </div>
                </div>
                <span className="triage-action">
                  <button className="btn sm primary">Recorded</button>
                </span>
              </div>
              <div className="triage-row">
                <span className="triage-class">
                  <span className="class-badge deferred">deferred</span>
                </span>
                <div className="triage-body">
                  <div className="triage-text">
                    Must value-at-t be allocation-free for 60fps playback?
                  </div>
                  <div className="triage-meta">
                    Open question → carry to slice 03 (playback engine)
                  </div>
                </div>
                <span className="triage-action">
                  <button className="btn sm">Carry forward</button>
                </span>
              </div>
              <div className="triage-row">
                <span className="triage-class">
                  <span className="class-badge finding">finding</span>
                </span>
                <div className="triage-body">
                  <div className="triage-text">
                    Registry needed a tiny <code>valueAt(id, t)</code> read
                    hook; added without changing its contract.
                  </div>
                  <div className="triage-meta">
                    Noted in slice docs — no decision needed.
                  </div>
                </div>
                <span className="triage-action">
                  <button className="btn sm">Note &amp; close</button>
                </span>
              </div>
            </div>
          </div>

          {/* Artifact disposition compact */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Artifacts</span>
                <span className="sub">provisional until milestone review</span>
              </div>
              <div className="card-progress">3 tracked</div>
            </div>
            <div>
              <div className="artifact-row head">
                <span>Artifact</span>
                <span>State</span>
                <span>At review</span>
              </div>
              <div className="artifact-row">
                <span className="art-name">
                  fixtures/scene.basic.json
                  <span className="art-kind">test fixture scene</span>
                </span>
                <span>
                  <span className="state-tag provisional">provisional</span>
                </span>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  decide later
                </span>
              </div>
              <div className="artifact-row">
                <span className="art-name">
                  verify:timeline-model
                  <span className="art-kind">verification script</span>
                </span>
                <span>
                  <span className="state-tag provisional">provisional</span>
                </span>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  likely promote
                </span>
              </div>
            </div>
          </div>

          <Menu
            title="Process report"
            hint="step-05-process-report"
            items={PROCESS_MENU}
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   F1 — Milestone review · goal vs delivered
   ════════════════════════════════════════════════════════════ */
const REVIEW_MENU = [
  {
    key: "C",
    label: "Accept review and complete",
    desc: "Mark milestone 05 done, record the final summary, lock the docs.",
    primary: true,
    rec: true,
  },
  {
    key: "A",
    label: "Amend before completing",
    desc: "Adjust the summary or artifact dispositions first.",
  },
  {
    key: "D",
    label: "Record a decision",
    desc: "Capture a durable choice surfaced during review.",
  },
  {
    key: "S",
    label: "Reopen a slice",
    desc: "Send a slice back to preparation if the goal is not met.",
  },
  {
    key: "X",
    label: "Exit",
    desc: "Leave the milestone in review; resume later.",
    danger: true,
  },
];

function MilestoneReview() {
  return (
    <AppWindow
      ctx={["diorama", "05 timeline playback"]}
      sidebar={<ReviewSidebar mode="review" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-timeline-playback
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--success)" }}>
            review · step 7
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb">review</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Milestone review</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>4 / 4 slices accepted
                </span>
                <span className="status-chip proposed">
                  <span className="dot"></span>Awaiting your sign-off
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Accept &amp; complete <span className="kbd">C</span>
              </button>
            </div>
          </div>

          {/* Original goal + assessment */}
          <div className="goal-card">
            <div className="gc-label">
              <span className="ico" style={{ fontSize: 11 }}>
                ◆
              </span>{" "}
              Original goal · milestone 05
            </div>
            <div className="gc-text">
              Let users scrub through and play back a composed scene on a
              timeline, so motion can be reviewed without exporting.
            </div>
            <div className="gc-assess">
              <span className="ok">✓ Met</span>
              <span>
                — scrub, seek, and play back are all live against the registry.
                One non-goal (easing UI) stayed out of scope, as planned.
              </span>
            </div>
          </div>

          {/* stat strip */}
          <div className="review-stats">
            <div className="review-stat">
              <div className="rs-num good">4</div>
              <div className="rs-label">slices accepted</div>
            </div>
            <div className="review-stat">
              <div className="rs-num good">5</div>
              <div className="rs-label">decisions recorded</div>
            </div>
            <div className="review-stat">
              <div className="rs-num warn">1</div>
              <div className="rs-label">verification gap</div>
            </div>
            <div className="review-stat">
              <div className="rs-num">6</div>
              <div className="rs-label">artifacts to disposition</div>
            </div>
          </div>

          {/* Accepted slices ledger */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Accepted slices</span>
                <span className="sub">measured against the goal</span>
              </div>
              <div className="card-progress">4 / 4</div>
            </div>
            <div>
              {[
                {
                  num: "00",
                  name: "timeline data model",
                  out: "Serializable model resolves component values at time t.",
                },
                {
                  num: "01",
                  name: "scrubber + playhead",
                  out: "Dragging the scrubber updates the scene live.",
                },
                {
                  num: "02",
                  name: "keyframe interpolation",
                  out: "Linear tween between keyframes; non-linear deferred.",
                },
                {
                  num: "03",
                  name: "playback engine",
                  out: "rAF loop plays back at scene fps; pause/seek respected.",
                },
              ].map((s) => (
                <div className="slice-ledger-row" key={s.num}>
                  <span className="slr-node">✓</span>
                  <div className="slr-main">
                    <div className="slr-top">
                      <span className="slr-num">{s.num}</span>
                      <span className="slr-name">{s.name}</span>
                      <span className="slr-tag">accepted</span>
                    </div>
                    <div className="slr-outcome">{s.out}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification gaps */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Verification story</span>
                <span className="sub">gaps to close before completion</span>
              </div>
              <div className="card-progress">1 gap</div>
            </div>
            <div>
              <div className="gap-row">
                <span className="gap-icon ok">✓</span>
                <div className="gap-text">
                  Model, interpolation, and playback each have a durable check.
                  <div className="gap-sub">
                    verify:timeline-model, verify:interp, verify:playback
                  </div>
                </div>
              </div>
              <div className="gap-row">
                <span className="gap-icon">⚠</span>
                <div className="gap-text">
                  No end-to-end "scrub a real scene" check — only unit-level
                  coverage.
                  <div className="gap-sub">
                    Recommend promoting the demo fixture into an integration
                    check before completing.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Menu
            title="Review gate"
            hint="step-07-milestone-review"
            items={REVIEW_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Completion records the final summary and leaves docs resumable.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   F2 — Milestone review · artifact disposition ledger
   ════════════════════════════════════════════════════════════ */
function MilestoneReviewArtifacts() {
  const arts = [
    {
      name: "verify:timeline-model",
      kind: "verification script",
      state: "provisional",
      dispo: "promote",
      dl: "Promote to durable",
    },
    {
      name: "verify:playback",
      kind: "verification script",
      state: "provisional",
      dispo: "combine",
      dl: "Combine into suite",
    },
    {
      name: "fixtures/scene.basic.json",
      kind: "test fixture",
      state: "provisional",
      dispo: "keep",
      dl: "Keep as example",
    },
    {
      name: "scene.timeline.json",
      kind: "generated output",
      state: "generated",
      dispo: "archive",
      dl: "Archive in docs",
    },
    {
      name: "demo/playback-spike.tsx",
      kind: "throwaway demo",
      state: "provisional",
      dispo: "delete",
      dl: "Delete",
    },
    {
      name: "perf-bench (deferred)",
      kind: "open follow-up",
      state: "open",
      dispo: "keep",
      dl: "Leave provisional",
    },
  ];
  return (
    <AppWindow
      ctx={["diorama", "05 timeline playback"]}
      sidebar={<ReviewSidebar mode="review" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-timeline-playback
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--success)" }}>
            review · step 7
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb">review</span>
            <span className="sep">/</span>
            <span className="crumb">artifacts</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Artifact disposition</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>6 provisional artifacts
                </span>
                <span className="meta-chip">
                  <i>↳</i>artifact-lifecycle.md
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Back to review <span className="kbd">R</span>
              </button>
              <button className="btn primary">
                Accept &amp; complete <span className="kbd">C</span>
              </button>
            </div>
          </div>

          <div className="verdict accepted" style={{ marginBottom: 16 }}>
            <span className="verdict-icon">◆</span>
            <div className="verdict-main">
              <div className="verdict-label">Goal met</div>
              <div className="verdict-text">
                <b>Timeline playback delivered.</b>{" "}
                <span className="em">
                  Resolve provisional artifacts to finish the durable
                  verification story.
                </span>
              </div>
            </div>
            <span className="verdict-pill">ready</span>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Provisional artifacts</span>
                <span className="sub">
                  everything slices created becomes durable, archived, or
                  deleted here
                </span>
              </div>
              <div className="card-progress">recommended dispositions</div>
            </div>
            <div>
              <div className="artifact-row head">
                <span>Artifact</span>
                <span>State</span>
                <span>Recommended</span>
              </div>
              {arts.map((a) => (
                <div className="artifact-row" key={a.name}>
                  <span className="art-name">
                    {a.name}
                    <span className="art-kind">{a.kind}</span>
                  </span>
                  <span>
                    <span className={"state-tag " + a.state}>{a.state}</span>
                  </span>
                  <span>
                    <span className={"dispo " + a.dispo}>
                      <span className="dispo-label">
                        <span className="dot"></span>
                        {a.dl}
                      </span>
                      <span className="chev">▾</span>
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div className="setup-footer">
              <span className="hint">
                Coordinator's recommendations — <b>override any</b> before
                completing.
              </span>
              <button className="btn sm">Accept all recommendations</button>
            </div>
          </div>

          <Menu
            title="Review gate"
            hint="step-07-milestone-review"
            items={REVIEW_MENU}
          />
        </main>
      }
    />
  );
}

Object.assign(window, {
  ProcessReport,
  ProcessReportTriage,
  MilestoneReview,
  MilestoneReviewArtifacts,
});
