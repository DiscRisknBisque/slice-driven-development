// sw-prepare.jsx — Prepare slice (step 3) + Complete (step 8).
// Reuses AppWindow + Menu (on window). Exports screens to window.

/* ─── Sidebar: a milestone mid-flight with current slice ─────── */
function PrepareSidebar({ mode }) {
  // mode: 'prepare' (slice 00 current, being prepared) | 'complete' (milestone 05 done)
  const slices = [
    {
      num: "00",
      name: "timeline data model",
      state: "current",
      pill: mode === "prepare" ? "2" : null,
    },
    { num: "01", name: "scrubber + playhead", state: "proposed" },
    { num: "02", name: "keyframe interpolation", state: "proposed" },
    { num: "03", name: "playback engine", state: "proposed" },
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

        {mode === "complete" ? (
          <React.Fragment>
            <div className="ms-item completed">
              <span className="chev">▸</span>
              <span className="num">05</span>
              <span
                className="name"
                style={{ color: "var(--text)", fontWeight: 500 }}
              >
                Timeline playback
              </span>
              <span className="ms-status complete">✓</span>
            </div>
            <div className="ms-item">
              <span className="chev">▸</span>
              <span className="num">06</span>
              <span className="name" style={{ color: "var(--text-muted)" }}>
                Export &amp; share
              </span>
              <span className="ms-status draft">next</span>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="ms-item active">
              <span className="chev">▾</span>
              <span className="num">05</span>
              <span className="name">Timeline playback</span>
            </div>
            <div className="ms-slices">
              {slices.map((s) => (
                <div
                  className={
                    "slice-item" +
                    (s.state === "current" ? " active" : " proposed")
                  }
                  key={s.num}
                >
                  <span className="dot"></span>
                  <span className="num">{s.num}</span>
                  <span className="name">{s.name}</span>
                  {s.pill && <span className="pill">{s.pill}</span>}
                </div>
              ))}
            </div>
          </React.Fragment>
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
            {mode === "complete" ? 23 : 18}
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
            {mode === "prepare" ? "idle" : "—"}
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span
          className="ico"
          style={{
            color: mode === "complete" ? "var(--success)" : "var(--warning)",
          }}
        >
          ●
        </span>
        <span>
          {mode === "complete" ? "Milestone complete" : "Preparing slice 00"}
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

/* ════════════════════════════════════════════════════════════
   G1 — Prepare slice · readiness brief
   ════════════════════════════════════════════════════════════ */
const PREPARE_MENU = [
  {
    key: "C",
    label: "Mark slice ready",
    desc: "All fields filled and questions resolved — lock the brief for implementation.",
    primary: true,
    rec: true,
  },
  {
    key: "Q",
    label: "Answer or classify open questions",
    desc: "One question remains before the slice is implementable.",
  },
  {
    key: "A",
    label: "Amend the slice",
    desc: "Adjust goal, scope, tasks, or verification criteria.",
  },
  {
    key: "P",
    label: "Prepare a copyable Executor prompt",
    desc: "Hand implementation to a separate agent session.",
  },
  {
    key: "E",
    label: "Enter Executor Mode here",
    desc: "Implement the slice in this session now.",
  },
];

function PrepareSlice() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline data model"]}
      sidebar={<PrepareSidebar mode="prepare" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-00-timeline-data-model
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--warning)" }}>
            preparing · step 3
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
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Timeline data model</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>slice 00 · current
                </span>
                <span className="meta-chip">
                  <i>↳</i>slice-template.md
                </span>
                <span className="status-chip">
                  <span className="dot"></span>1 open question
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button
                className="btn primary"
                aria-disabled="true"
                style={{ opacity: 0.35, cursor: "not-allowed" }}
              >
                Mark ready <span className="kbd">C</span>
              </button>
            </div>
          </div>

          {/* Readiness checklist */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Slice readiness</span>
                <span className="sub">
                  every field present before Executor starts
                </span>
              </div>
              <div className="card-progress">6 / 7 ready</div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "86%" }}></div>
            </div>
            <div className="ready-grid">
              <div className="ready-cell">
                <span className="ready-mark done">✓</span>
                <div className="ready-body">
                  <div className="ready-name">Goal</div>
                  <div className="ready-val">
                    A serializable timeline resolving any component's value at
                    time t.
                  </div>
                </div>
              </div>
              <div className="ready-cell">
                <span className="ready-mark done">✓</span>
                <div className="ready-body">
                  <div className="ready-name">Scope</div>
                  <div className="ready-val">
                    Model + read API. Wires into the existing registry.
                  </div>
                </div>
              </div>
              <div className="ready-cell">
                <span className="ready-mark done">✓</span>
                <div className="ready-body">
                  <div className="ready-name">Non-goals</div>
                  <div className="ready-val">
                    No UI, no interpolation, no playback loop yet.
                  </div>
                </div>
              </div>
              <div className="ready-cell">
                <span className="ready-mark done">✓</span>
                <div className="ready-body">
                  <div className="ready-name">Reviewable outcome</div>
                  <div className="ready-val">
                    Read interpolated values at t in a test harness.
                  </div>
                </div>
              </div>
              <div className="ready-cell">
                <span className="ready-mark done">✓</span>
                <div className="ready-body">
                  <div className="ready-name">Implementation tasks</div>
                  <div className="ready-val">
                    3 tasks — schemas, resolver, serialize.
                  </div>
                </div>
              </div>
              <div className="ready-cell">
                <span className="ready-mark done">✓</span>
                <div className="ready-body">
                  <div className="ready-name">Verification criteria</div>
                  <div className="ready-val mono">verify:timeline-model</div>
                </div>
              </div>
            </div>
          </div>

          {/* Open questions — the gate */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Open questions</span>
                <span className="sub">readiness gate — 1 of 2 answered</span>
              </div>
              <div className="card-progress">1 remaining</div>
            </div>
            <div className="card-body">
              <div className="q answered">
                <div className="q-head">
                  <span className="q-num">01</span>
                  <div className="q-body">
                    <div className="q-text">
                      Where do keyframe times live — absolute ms, or normalized
                      0–1?
                    </div>
                    <span className="q-answer">
                      Absolute milliseconds, matching scene clock
                    </span>
                  </div>
                  <span className="q-edit">edit</span>
                </div>
              </div>
              <div className="q active">
                <div className="q-head">
                  <span className="q-num">02</span>
                  <div className="q-body">
                    <div className="q-text">
                      Should value resolution be pure, or cache the last lookup
                      per track?
                    </div>
                  </div>
                </div>
                <div className="q-options">
                  <button className="q-opt">
                    <span className="opt-mark"></span>
                    <span className="opt-content">
                      <span className="opt-label">Pure, no cache</span>
                      <span className="opt-desc">
                        Simplest contract; revisit if profiling demands it.
                      </span>
                    </span>
                  </button>
                  <button className="q-opt selected">
                    <span className="opt-mark"></span>
                    <span className="opt-content">
                      <span className="opt-label">Cache last lookup</span>
                      <span className="opt-desc">
                        Cheap win for monotonic scrubbing.
                      </span>
                    </span>
                  </button>
                  <button className="q-opt escape">
                    <span className="opt-mark"></span>
                    <span className="opt-content">
                      <span className="opt-label">Defer to slice 03</span>
                      <span className="opt-desc">
                        Decide with the playback engine.
                      </span>
                    </span>
                  </button>
                  <button className="q-opt write">
                    <span className="opt-mark"></span>
                    <span className="opt-content">
                      <span className="opt-label">Write a custom answer</span>
                      <span className="opt-desc">
                        Captured as a decision record.
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Menu
            title="Prepare slice"
            hint="step-03-prepare-slice"
            items={PREPARE_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Answer the last question to unlock “Mark ready”.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   G2 — Prepare slice · ready · executor handoff
   ════════════════════════════════════════════════════════════ */
const HANDOFF_MENU = [
  {
    key: "E",
    label: "Enter Executor Mode here",
    desc: "Implement slice 00 in this session against the brief below.",
    primary: true,
    rec: true,
  },
  {
    key: "P",
    label: "Copy the Executor prompt",
    desc: "Hand it to a separate agent session instead.",
  },
  {
    key: "A",
    label: "Amend the slice",
    desc: "Reopen the brief before implementation begins.",
  },
  {
    key: "X",
    label: "Exit",
    desc: "Leave the slice ready and stop here.",
    danger: true,
  },
];

function PrepareSliceReady() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline data model"]}
      sidebar={<PrepareSidebar mode="prepare" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-00-timeline-data-model
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--success)" }}>
            slice ready · step 3
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
            <span className="crumb">ready</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Slice ready to implement</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>slice 00 · timeline data model
                </span>
                <span className="status-chip ready">
                  <span className="dot"></span>All questions resolved
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Enter Executor <span className="kbd">E</span>
              </button>
            </div>
          </div>

          {/* Two handoff paths */}
          <div className="handoff-cards" style={{ marginBottom: 16 }}>
            <div className="handoff-card primary">
              <span className="hc-icon">▶</span>
              <span className="hc-title">Implement in this session</span>
              <span className="hc-desc">
                Executor reads the brief, decisions, and architecture, then
                changes only what slice 00 needs.
              </span>
              <span className="hc-key">press E</span>
            </div>
            <div className="handoff-card">
              <span className="hc-icon">⧉</span>
              <span className="hc-title">Hand to another session</span>
              <span className="hc-desc">
                Copy a self-contained Executor prompt for a fresh agent or
                teammate to run.
              </span>
              <span className="hc-key">press P</span>
            </div>
          </div>

          {/* Copyable executor prompt */}
          <div className="card" style={{ overflow: "visible" }}>
            <div className="card-head">
              <div className="card-title">
                <span>Executor prompt</span>
                <span className="sub">
                  executor-prompt-template.md · ready to copy
                </span>
              </div>
              <div className="card-progress">self-contained</div>
            </div>
            <div
              className="prompt-block"
              style={{ margin: 12, borderRadius: "var(--r-md)" }}
            >
              <div className="prompt-head">
                <span
                  className="live-dot"
                  style={{ background: "var(--text-faint)" }}
                ></span>
                executor-prompt · 05-00
                <span className="prompt-tools">
                  <span className="prompt-copy">⧉ Copy</span>
                </span>
              </div>
              <div className="prompt-body">
                <span className="hd">You are in</span>{" "}
                <span className="lbl">Executor Mode</span>
                <span className="hd">. Implement exactly one slice.</span>
                {"\n\n"}
                <span className="lbl">Milestone:</span> 05 timeline playback
                {"\n"}
                <span className="lbl">Slice:</span> 00 timeline data model{"\n"}
                <span className="lbl">Goal:</span> serializable timeline;
                resolve component value at time t{"\n"}
                <span className="lbl">Scope:</span> model + read API, wire into
                existing registry{"\n"}
                <span className="lbl">Non-goals:</span> no UI, interpolation, or
                playback loop{"\n"}
                <span className="lbl">Verify:</span> verify:timeline-model
                (round-trip + value-at-t){"\n"}
                <span className="lbl">Decisions:</span> #0012 registry pattern,
                #0014 Zod at boundary{"\n\n"}
                <span className="hd">
                  Change only the files this slice needs. End with the standard
                  report.
                </span>
              </div>
            </div>
          </div>

          <Menu
            title="Slice ready"
            hint="step-03-prepare-slice"
            items={HANDOFF_MENU}
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   H1 — Complete · completion summary
   ════════════════════════════════════════════════════════════ */
const COMPLETE_MENU = [
  {
    key: "N",
    label: "Plan the next milestone",
    desc: "Start milestone 06 (export & share) from the roadmap.",
    primary: true,
    rec: true,
  },
  {
    key: "V",
    label: "View the milestone docs",
    desc: "Open the recorded summary, decisions, and architecture notes.",
  },
  {
    key: "D",
    label: "Record a follow-up decision",
    desc: "Capture anything that should outlive this milestone.",
  },
  {
    key: "X",
    label: "Close milestone",
    desc: "Leave everything recorded; resume any time.",
    danger: true,
  },
];

function MilestoneComplete() {
  return (
    <AppWindow
      ctx={["diorama", "05 timeline playback"]}
      sidebar={<PrepareSidebar mode="complete" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-timeline-playback
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--success)" }}>
            complete · step 8
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
            <span className="crumb">complete</span>
          </div>

          <div className="complete-hero">
            <span className="complete-seal">✓</span>
            <div className="complete-htext">
              <div className="complete-kick">Milestone complete</div>
              <div className="complete-title">Timeline playback</div>
              <div className="complete-sub">
                4 slices · 5 decisions · durable verification recorded
              </div>
            </div>
            <div className="complete-date">
              marked done
              <br />
              Jun 3, 2026
            </div>
          </div>

          {/* Final summary */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Final summary</span>
                <span className="sub">recorded to milestone-readme.md</span>
              </div>
              <div className="card-progress">resumable</div>
            </div>
            <div className="summary-body">
              <p>
                diorama can now scrub and play back a composed scene on a
                timeline. The <code>Timeline</code> model resolves any
                registered component's value at time <code>t</code>, a draggable
                scrubber drives the playhead live, keyframes tween linearly, and
                a <code>requestAnimationFrame</code> loop plays back at scene
                fps.
              </p>
              <p>
                Easing-curve UI, audio sync, and export stayed out of scope as
                planned — <code>06 export &amp; share</code> picks up from here.
              </p>
            </div>
          </div>

          {/* Durable verification story */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Durable verification</span>
                <span className="sub">promoted from provisional at review</span>
              </div>
              <div className="card-progress">3 checks</div>
            </div>
            <div>
              <div className="verif-row">
                <span className="vk">✓</span>
                <span className="vcmd">verify:timeline-model</span>
                <span className="vdesc">round-trip + value-at-t</span>
              </div>
              <div className="verif-row">
                <span className="vk">✓</span>
                <span className="vcmd">verify:interp</span>
                <span className="vdesc">linear tween correctness</span>
              </div>
              <div className="verif-row">
                <span className="vk">✓</span>
                <span className="vcmd">verify:playback-e2e</span>
                <span className="vdesc">scrub a real scene end-to-end</span>
              </div>
            </div>
            <div className="next-strip">
              <span className="ns-text">
                Artifacts resolved — <b>3 promoted</b>, 1 archived, 1 deleted.
              </span>
              <span className="spacer"></span>
              <button className="btn sm">View dispositions ↗</button>
            </div>
          </div>

          <Menu
            title="Milestone done"
            hint="step-08-complete"
            items={COMPLETE_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Docs are left in a resumable state for any future session.
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   H2 — Complete · roadmap progress
   ════════════════════════════════════════════════════════════ */
function MilestoneCompleteRoadmap() {
  return (
    <AppWindow
      ctx={["diorama", "05 timeline playback"]}
      sidebar={<PrepareSidebar mode="complete" />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-timeline-playback
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--success)" }}>
            complete · step 8
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb current">roadmap</span>
            <span className="sep">/</span>
            <span className="crumb">05 complete</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Milestone 05 complete</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>✓</i>timeline playback
                </span>
                <span className="status-chip ready">
                  <span className="dot"></span>5 of 8 milestones done
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                View summary <span className="kbd">V</span>
              </button>
              <button className="btn primary">
                Plan milestone 06 <span className="kbd">N</span>
              </button>
            </div>
          </div>

          <div className="complete-hero" style={{ padding: 16 }}>
            <span
              className="complete-seal"
              style={{ width: 40, height: 40, fontSize: 20 }}
            >
              ✓
            </span>
            <div className="complete-htext">
              <div className="complete-title" style={{ fontSize: 18 }}>
                Timeline playback shipped
              </div>
              <div className="complete-sub">
                Scrub, seek, and play back a composed scene — verified
                end-to-end.
              </div>
            </div>
            <div className="complete-date">Jun 3, 2026</div>
          </div>

          {/* Roadmap rail */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Roadmap</span>
                <span className="sub">diorama · product direction</span>
              </div>
              <div className="card-progress">5 / 8</div>
            </div>
            <div>
              <div className="roadmap-row">
                <span className="rm-node done">✓</span>
                <div className="rm-main">
                  <div className="rm-name muted">04 · Component registry</div>
                  <div className="rm-sub">
                    Mount, look up, and observe components by stable id.
                  </div>
                </div>
                <span className="rm-tag done">done</span>
              </div>
              <div
                className="roadmap-row"
                style={{ background: "var(--bg-subtle)" }}
              >
                <span className="rm-node current">05</span>
                <div className="rm-main">
                  <div className="rm-name">05 · Timeline playback</div>
                  <div className="rm-sub">
                    Scrub + play back a scene; 4 slices accepted just now.
                  </div>
                </div>
                <span className="rm-tag just">just shipped</span>
              </div>
              <div className="roadmap-row">
                <span className="rm-node next">06</span>
                <div className="rm-main">
                  <div className="rm-name muted">06 · Export &amp; share</div>
                  <div className="rm-sub">
                    Render a timeline to video and share a link. Not yet
                    planned.
                  </div>
                </div>
                <span className="rm-tag next">up next</span>
              </div>
              <div className="roadmap-row">
                <span className="rm-node next">07</span>
                <div className="rm-main">
                  <div className="rm-name muted">07 · Collaboration</div>
                  <div className="rm-sub">
                    Multi-user editing on a shared scene.
                  </div>
                </div>
                <span className="rm-tag next">later</span>
              </div>
            </div>
            <div className="next-strip">
              <span className="ns-text">
                <b>Milestone 06</b> is next on the roadmap — plan it when you're
                ready.
              </span>
              <span className="spacer"></span>
              <button className="btn sm primary">Plan 06 →</button>
            </div>
          </div>

          <Menu
            title="Milestone done"
            hint="step-08-complete"
            items={COMPLETE_MENU}
          />
        </main>
      }
    />
  );
}

Object.assign(window, {
  PrepareSlice,
  PrepareSliceReady,
  MilestoneComplete,
  MilestoneCompleteRoadmap,
});
