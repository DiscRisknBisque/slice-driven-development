// sw-nextslice.jsx — Step 6 · Draft or promote the next slice.
// J1 — Promote slice 01: Coordinator sharpens it from sketched → detailed,
//      carrying forward what slice 00 taught, at the step-06 gate.
// J2 — Slice queue: milestone progress + the slice pipeline after slice 00.
// Reuses AppWindow + Menu (on window). Exports screens to window.

/* ─── Sidebar: slice 00 done, slice 01 promoted to current ──── */
function NextSliceSidebar() {
  const slices = [
    { num: "00", name: "timeline data model", state: "done" },
    { num: "01", name: "scrubber + playhead", state: "current" },
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
        <div className="ms-item active">
          <span className="chev">▾</span>
          <span className="num">05</span>
          <span className="name">Timeline playback</span>
          <span className="ms-status draft">1/4</span>
        </div>
        <div className="ms-slices">
          {slices.map((s) => (
            <div
              className={
                "slice-item" +
                (s.state === "current"
                  ? " active"
                  : s.state === "proposed"
                    ? " proposed"
                    : "")
              }
              key={s.num}
            >
              <span
                className="dot"
                style={
                  s.state === "done"
                    ? {
                        background: "var(--success)",
                        borderColor: "var(--success)",
                      }
                    : null
                }
              ></span>
              <span className="num">{s.num}</span>
              <span
                className="name"
                style={
                  s.state === "done" ? { color: "var(--text-muted)" } : null
                }
              >
                {s.name}
              </span>
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
              {s.state === "current" && <span className="pill">new</span>}
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
            19
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
            idle
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="ico" style={{ color: "var(--info)" }}>
          ●
        </span>
        <span>Drafting slice 01</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

const NEXT_MENU = [
  {
    key: "C",
    label: "Promote slice 01 to current",
    desc: "Lock this brief as the current slice and open its preparation gate.",
    primary: true,
    rec: true,
  },
  {
    key: "A",
    label: "Amend the draft",
    desc: "Adjust goal, scope, tasks, or verification before promoting.",
  },
  {
    key: "D",
    label: "Add or update a decision",
    desc: "Record a choice slice 01 depends on (e.g. seek precision).",
  },
  {
    key: "R",
    label: "Re-slice the remainder",
    desc: "Split, reorder, or re-scope slices 01–03 given what 00 taught.",
  },
  {
    key: "X",
    label: "Exit",
    desc: "Keep the draft and stop here.",
    danger: true,
  },
];

/* ════════════════════════════════════════════════════════════
   J1 — Promote slice 01 (sketched → detailed)
   ════════════════════════════════════════════════════════════ */
function NextSlicePromote() {
  return (
    <AppWindow
      ctx={["diorama", "05 timeline playback"]}
      sidebar={<NextSliceSidebar />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-timeline-playback
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--info)" }}>
            promoting · step 6
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
            <span className="crumb current">slice 01</span>
            <span className="sep">/</span>
            <span className="crumb">promote</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Draft next slice</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>slice 01 · scrubber + playhead
                </span>
                <span className="xform">
                  <span className="from">sketched</span>
                  <span className="ar">→</span>
                  <span className="to">detailed</span>
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Amend <span className="kbd">A</span>
              </button>
              <button className="btn primary">
                Promote slice 01 <span className="kbd">C</span>
              </button>
            </div>
          </div>

          {/* slice 00 accepted → drafting 01 */}
          <div className="verdict promote">
            <span className="verdict-icon">→</span>
            <div className="verdict-main">
              <div className="verdict-label">Coordinator · step 6</div>
              <div className="verdict-text">
                Slice 00 accepted —{" "}
                <span className="em">
                  I sharpened slice 01 into an implementable brief, carrying
                  forward what implementation taught us.
                </span>
              </div>
            </div>
            <span className="verdict-pill">1 / 4 done</span>
          </div>

          {/* what slice 00 taught us, folded into 01 */}
          <div className="delta">
            <span className="ico">✲</span>
            <span>
              Slice 00 stored keyframes as a <b>sorted array</b> (
              <code>0019-keyframe-storage.md</code>). Slice 01 can bind the
              scrubber to ordered reads directly — no extra index needed.
            </span>
          </div>

          {/* The freshly-detailed slice 01 brief */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Slice 01 · scrubber + playhead</span>
                <span className="sub">
                  drafted from the sketch + slice 00 findings
                </span>
              </div>
              <div className="card-progress">ready to promote</div>
            </div>

            <div
              className="plan-slice detailed"
              style={{ borderBottom: "none" }}
            >
              <div className="plan-rail">
                <span className="plan-node">●</span>
              </div>
              <div className="plan-main">
                <div
                  className="plan-goal"
                  style={{
                    fontSize: 13,
                    color: "var(--text)",
                    marginBottom: 14,
                  }}
                >
                  A draggable scrubber bound to the timeline model — moving the
                  playhead seeks the scene and re-renders every registered
                  component at the new time{" "}
                  <code
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                  >
                    t
                  </code>
                  , live.
                </div>
                <div className="plan-fields">
                  <div className="plan-field">
                    <div className="pf-label">
                      Reviewable outcome{" "}
                      <span className="fresh-tag">drafted</span>
                    </div>
                    <div className="pf-val">
                      Drag the scrubber across a fixture scene; components
                      visibly reflect the seeked time.
                    </div>
                  </div>
                  <div className="plan-field">
                    <div className="pf-label">Non-goals</div>
                    <div className="pf-val">
                      No play/pause loop yet (slice 03). Linear time only.
                    </div>
                  </div>
                  <div className="plan-field" style={{ gridColumn: "1 / -1" }}>
                    <div className="pf-label">
                      Implementation tasks{" "}
                      <span className="fresh-tag">drafted</span>
                    </div>
                    <ul className="plan-tasks">
                      <li>
                        <span className="tk"></span>Scrubber component → emits{" "}
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                          }}
                        >
                          seek(t)
                        </code>{" "}
                        on drag.
                      </li>
                      <li>
                        <span className="tk"></span>Bind{" "}
                        <code
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                          }}
                        >
                          seek(t)
                        </code>{" "}
                        to the model's value-at-t read; push to the registry.
                      </li>
                      <li>
                        <span className="tk"></span>Playhead marker + time
                        readout synced to the scene clock.
                      </li>
                    </ul>
                  </div>
                  <div className="plan-field" style={{ gridColumn: "1 / -1" }}>
                    <div className="pf-label">Verification</div>
                    <div className="pf-val mono">
                      verify:scrubber-seek — drag → scene reflects t · within 1
                      frame
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* carried-forward open question from slice 00 */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Carried forward</span>
                <span className="sub">
                  deferred from slice 00 — re-evaluated against this slice
                </span>
              </div>
              <div className="card-progress">1 question</div>
            </div>
            <div>
              <div className="carry-row">
                <span className="carry-icon">↪</span>
                <div className="carry-body">
                  <div className="carry-text">
                    Does value-at-t need to be allocation-free for 60fps?
                  </div>
                  <div className="carry-from">
                    <span className="src">from slice 00</span> · still
                    non-blocking — scrubbing is user-paced, so it stays parked
                    for the playback engine (slice 03).
                  </div>
                </div>
                <span className="carry-state">
                  <span className="state-tag open">still deferred</span>
                </span>
              </div>
            </div>
          </div>

          <Menu
            title="Next slice"
            hint="step-06-next-slice"
            items={NEXT_MENU}
            foot={
              <React.Fragment>
                <span className="ico" style={{ fontSize: 12 }}>
                  ⏎
                </span>{" "}
                Promoting makes slice 01 current and routes to its preparation
                gate (step 3).
              </React.Fragment>
            }
          />
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   J2 — Slice queue / pipeline after slice 00
   ════════════════════════════════════════════════════════════ */
function NextSliceQueue() {
  const rows = [
    {
      num: "00",
      state: "done",
      name: "timeline data model",
      goal: "Serializable model resolves any component value at time t.",
      meta: ["accepted", "+349 −3", "decision 0019"],
    },
    {
      num: "01",
      state: "current",
      name: "scrubber + playhead",
      goal: "Draggable scrubber seeks the scene live, bound to the model.",
      meta: ["just drafted", "detailed", "1 carried question"],
    },
    {
      num: "02",
      state: "next",
      name: "keyframe interpolation",
      goal: "Tween between keyframes, linear first.",
      meta: ["sketched"],
    },
    {
      num: "03",
      state: "next",
      name: "playback engine",
      goal: "rAF loop drives the playhead at scene fps.",
      meta: ["outline", "owns the perf question"],
    },
  ];
  return (
    <AppWindow
      ctx={["diorama", "05 timeline playback"]}
      sidebar={<NextSliceSidebar />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-timeline-playback
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-item" style={{ color: "var(--info)" }}>
            promoting · step 6
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
            <span className="crumb current">slices</span>
          </div>

          <div
            className="page-head"
            style={{ marginBottom: 16, paddingBottom: 16 }}
          >
            <div className="page-title-block">
              <h1 className="page-title">Milestone 05 · slice queue</h1>
              <div className="page-meta">
                <span className="meta-chip">
                  <i>⌥</i>1 of 4 accepted
                </span>
                <span className="status-chip">
                  <span className="dot"></span>Slice 01 drafted — promote to
                  continue
                </span>
              </div>
            </div>
            <div className="page-actions">
              <button className="btn">
                Re-slice <span className="kbd">R</span>
              </button>
              <button className="btn primary">
                Promote slice 01 <span className="kbd">C</span>
              </button>
            </div>
          </div>

          {/* progress strip */}
          <div className="card">
            <div className="ms-progress">
              <span className="mp-label">
                <b>1</b> / 4 slices
              </span>
              <span className="mp-track">
                <span className="mp-seg done"></span>
                <span className="mp-seg current"></span>
                <span className="mp-seg next"></span>
                <span className="mp-seg next"></span>
              </span>
              <span className="mp-label">
                milestone <b>25%</b>
              </span>
            </div>
          </div>

          {/* the loop, named */}
          <div
            className="delta"
            style={{ margin: "0 0 16px", borderRadius: "var(--r-lg)" }}
          >
            <span className="ico">↻</span>
            <span>
              The loop:{" "}
              <b>promote slice → prepare → implement → process report</b>.
              You're between slices — slice 00's report is recorded; slice 01 is
              drafted and waiting at the gate.
            </span>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Slices</span>
                <span className="sub">detail sharpens as each is promoted</span>
              </div>
              <div className="card-progress">4 total</div>
            </div>
            <div>
              {rows.map((r) => (
                <div
                  className={
                    "queue-row" + (r.state === "current" ? " current" : "")
                  }
                  key={r.num}
                >
                  <span className={"q-node " + r.state}>
                    {r.state === "done" ? "✓" : r.num}
                  </span>
                  <div className="q-main">
                    <div className="q-top">
                      <span className="q-num">{r.num}</span>
                      <span
                        className={
                          "q-name" + (r.state === "next" ? " muted" : "")
                        }
                      >
                        {r.name}
                      </span>
                      <span className={"q-tag " + r.state}>
                        {r.state === "done"
                          ? "accepted"
                          : r.state === "current"
                            ? "current · new"
                            : "queued"}
                      </span>
                    </div>
                    <div className="q-goal">{r.goal}</div>
                    <div className="q-meta">
                      {r.meta.map((m, i) => (
                        <React.Fragment key={m}>
                          {i > 0 && <span className="d">·</span>}
                          <span className="m">{m}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="next-strip">
              <span className="ns-text">
                <b>Slice 01</b> is drafted and detailed — promote it to open its
                preparation gate.
              </span>
              <span className="spacer"></span>
              <button className="btn sm primary">
                Promote &amp; prepare →
              </button>
            </div>
          </div>

          <Menu
            title="Next slice"
            hint="step-06-next-slice"
            items={NEXT_MENU}
          />
        </main>
      }
    />
  );
}

Object.assign(window, {
  NextSlicePromote,
  NextSliceQueue,
});
