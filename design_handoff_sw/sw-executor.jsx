// sw-executor.jsx — Step 4 · Executor Mode (raw coding-agent harness).
// I1 — Executor running in-session (Slicewise app chrome around the embedded harness).
// I2 — same slice handed to a standalone coding agent (raw terminal, no chrome).
// Reuses AppWindow (on window). Exports screens to window.

/* ─── Sidebar: slice 00 current, Executor thread actively working ─── */
function ExecutorSidebar() {
  const slices = [
    { num: "00", name: "timeline data model", state: "current" },
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
        <div className="ms-item active">
          <span className="chev">▾</span>
          <span className="num">05</span>
          <span className="name">Timeline playback</span>
          <span
            className="ms-status draft"
            style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
          >
            exec
          </span>
        </div>
        <div className="ms-slices">
          {slices.map((s) => (
            <div
              className={
                "slice-item" + (s.state === "current" ? " active" : " proposed")
              }
              key={s.num}
            >
              <span className="dot"></span>
              <span className="num">{s.num}</span>
              <span className="name">{s.name}</span>
              {s.state === "current" && <span className="pill">●●●</span>}
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
              background: "var(--text-faint)",
            }}
          ></span>
          <span style={{ flex: 1, color: "var(--text-muted)" }}>
            Coordinator
          </span>
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
        <div
          className="thread-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            fontSize: 12.5,
            background: "var(--warning-bg)",
            borderRadius: "var(--r-md)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--warning)",
              boxShadow: "0 0 0 2px rgba(161,98,7,0.15)",
            }}
          ></span>
          <span style={{ flex: 1, fontWeight: 500 }}>Executor</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--warning)",
            }}
          >
            working
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="ico" style={{ color: "var(--warning)" }}>
          ●
        </span>
        <span>Implementing slice 00</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

/* ─── Harness sub-blocks (shared between I1 / I2) ───────────── */
function HToolRead({ args, tag, children }) {
  return (
    <React.Fragment>
      <div className="h-tool">
        <span className="tk">⏺</span>
        <span className="call">
          <span className="fn">Read</span>(<span className="arg">{args}</span>)
        </span>
        {tag && <span className="tag">{tag}</span>}
      </div>
      {children && <div className="h-res">{children}</div>}
    </React.Fragment>
  );
}

/* ════════════════════════════════════════════════════════════
   I1 — Executor Mode running IN-SESSION (embedded harness)
   ════════════════════════════════════════════════════════════ */
function ExecutorInSession() {
  return (
    <AppWindow
      ctx={["diorama", "05-00 timeline data model"]}
      sidebar={<ExecutorSidebar />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>05-00-timeline-data-model
          </span>
          <span className="sb-item">
            <span
              className="live-dot"
              style={{ background: "var(--warning)" }}
            ></span>
            executor working
          </span>
          <span className="sb-item" style={{ color: "var(--warning)" }}>
            executing · step 4
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main
          className="main"
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 24,
          }}
        >
          <div className="breadcrumb">
            <span className="crumb">diorama</span>
            <span className="sep">/</span>
            <span className="crumb">05-timeline-playback</span>
            <span className="sep">/</span>
            <span className="crumb current">slice 00</span>
            <span className="sep">/</span>
            <span className="crumb">executor</span>
          </div>

          <div className="exec-strip">
            <span className="ex-badge">
              <span className="pulse"></span>Executor Mode
            </span>
            <span className="ex-note">
              Implementing <b>slice 00 · timeline data model</b> in this session
              — changing only what the slice needs.
            </span>
            <span className="ex-stop">esc to interrupt</span>
          </div>

          {/* The embedded coding-agent harness */}
          <div className="harness" style={{ flex: 1, minHeight: 0 }}>
            <div className="h-bar">
              <span className="h-name">
                <span className="h-glyph">◣</span>agent · executor
              </span>
              <span className="h-chip">model: sonnet-4.5</span>
              <span className="h-sep">·</span>
              <span className="h-chip">cwd ~/code/diorama</span>
              <span className="h-spacer"></span>
              <span className="h-state working">
                <span className="pulse"></span>working
              </span>
            </div>

            <div className="h-body">
              <div className="h-msg">
                <span className="bullet">●</span>
                <span className="txt">
                  Reading the slice brief, architecture notes, and the two
                  decisions it references before touching code.
                </span>
              </div>

              <HToolRead
                args="sw/05-timeline-playback/slices/00-timeline-data-model.md"
                tag="read 1–96"
              >
                Goal · serializable timeline; resolve component value at time{" "}
                <span className="num">t</span>.{"\n"}
                Scope · model + read API, wire into existing registry ·{" "}
                <span className="mut">no UI</span>.
              </HToolRead>
              <HToolRead args="src/registry/index.ts" tag="read 1–140">
                <span className="mut">export</span> class ComponentRegistry
                &#123; get(id), observe(id) … &#125;
              </HToolRead>

              <div className="h-msg">
                <span className="bullet violet">●</span>
                <span className="txt">
                  Plan looks right. Three tasks, smallest first.
                </span>
              </div>
              <div className="h-todo">
                <div className="ti done">
                  <span className="box">☑</span>
                  <span className="lbl">
                    Define{" "}
                    <span style={{ color: "var(--h-amber)" }}>
                      Timeline / Track / Keyframe
                    </span>{" "}
                    schemas (Zod)
                  </span>
                </div>
                <div className="ti now">
                  <span className="box">▸</span>
                  <span className="lbl">
                    Resolve component value at time t via registry id
                  </span>
                </div>
                <div className="ti todo">
                  <span className="box">☐</span>
                  <span className="lbl">
                    Serialize / deserialize to scene.timeline.json
                  </span>
                </div>
              </div>

              <div className="h-tool">
                <span className="tk">⏺</span>
                <span className="call">
                  <span className="fn">Write</span>(
                  <span className="arg">src/timeline/model.ts</span>)
                </span>
                <span className="tag">+184</span>
              </div>
              <div className="h-diff">
                <div className="dh">
                  <span className="fp">src/timeline/model.ts</span>
                  <span>new file</span>
                </div>
                <pre>
                  <span className="dl add">
                    <span className="ln">1</span>+ export const Keyframe =
                    z.object(&#123;
                  </span>
                  <span className="dl add">
                    <span className="ln">2</span>+ t:
                    z.number().int().nonnegative(), // ms on scene clock
                  </span>
                  <span className="dl add">
                    <span className="ln">3</span>+ value: z.unknown(),
                  </span>
                  <span className="dl add">
                    <span className="ln">4</span>+ &#125;);
                  </span>
                  <span className="dl ctx">
                    <span className="ln">5</span>{" "}
                  </span>
                  <span className="dl add">
                    <span className="ln">6</span>+ export const Track =
                    z.object(&#123; componentId: z.string(), keys:
                    z.array(Keyframe) &#125;);
                  </span>
                </pre>
              </div>

              <div className="h-working">
                <span className="spin"></span>
                <span>
                  Writing{" "}
                  <span style={{ color: "var(--h-text)" }}>
                    src/timeline/resolve.ts
                  </span>{" "}
                  — value-at-t lookup against the registry
                  <span className="cursor"></span>
                </span>
              </div>
            </div>

            <div className="h-foot">
              <span className="hint">
                <b>esc</b> interrupt
              </span>
              <span className="hint">
                <b>ctrl-t</b> todos
              </span>
              <span className="grow"></span>
              <span className="stat">
                2 files · <b>+184</b>
              </span>
              <span className="stat">
                <b>1m 48s</b>
              </span>
              <span className="stat">
                <b>22.4k</b> tokens
              </span>
            </div>
          </div>
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   I2 — Same slice run in a STANDALONE coding agent (raw terminal)
   ════════════════════════════════════════════════════════════ */
function ExecutorExternal() {
  return (
    <div className="sw" style={{ width: "100%", height: "100%" }}>
      <div className="term-shell">
        <div className="term-titlebar">
          <div className="tl">
            <span className="r"></span>
            <span className="y"></span>
            <span className="g"></span>
          </div>
          <div className="tt">agent — executor — ~/code/diorama — 132×40</div>
          <div className="tr"></div>
        </div>

        <div className="harness bare" style={{ flex: 1, minHeight: 0 }}>
          <div className="h-bar">
            <span className="h-name">
              <span className="h-glyph">◣</span>agent
            </span>
            <span className="h-chip">executor mode</span>
            <span className="h-sep">·</span>
            <span className="h-chip">session 05-00</span>
            <span className="h-spacer"></span>
            <span className="h-state done">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "currentColor",
                }}
              ></span>
              report emitted
            </span>
          </div>

          <div className="h-body">
            {/* the Executor prompt pasted in to kick off the standalone session */}
            <div className="h-prompt">
              <span className="pf">&gt;</span>
              <span className="ptxt">
                You are in{" "}
                <span style={{ color: "var(--h-amber)" }}>Executor Mode</span>.
                Implement exactly one slice —{" "}
                <span style={{ color: "var(--h-blue)" }}>
                  05-00 timeline data model
                </span>
                .{" "}
                <span className="em">
                  Change only the files this slice needs. End with the standard
                  report.
                </span>
              </span>
            </div>

            <div className="h-msg">
              <span className="bullet">●</span>
              <span className="txt">
                Implemented the model, resolver, and serializer; wired a tiny{" "}
                <span className="code">valueAt(id, t)</span> read hook into the
                registry without changing its contract.
              </span>
            </div>

            <div className="h-todo">
              <div className="ti done">
                <span className="box">☑</span>
                <span className="lbl">Timeline / Track / Keyframe schemas</span>
              </div>
              <div className="ti done">
                <span className="box">☑</span>
                <span className="lbl">value-at-t resolver via registry</span>
              </div>
              <div className="ti done">
                <span className="box">☑</span>
                <span className="lbl">serialize → scene.timeline.json</span>
              </div>
            </div>

            <div className="h-run">
              <span className="cmd">
                <span className="dollar">$</span>npm run verify:timeline-model
              </span>
            </div>
            <div className="h-res">
              <span className="ok">PASS</span> round-trip + value-at-t on
              fixture · <span className="num">14 passing</span>{" "}
              <span className="mut">(212ms)</span>
              {"\n"}
              <span className="ok">PASS</span> typecheck — clean
            </div>

            <div className="h-msg">
              <span className="bullet violet">●</span>
              <span className="txt">
                Done. Returning the standard report to Coordinator.
              </span>
            </div>

            {/* the standardized Executor report rendered to the terminal */}
            <div className="h-report">
              <div className="rep-head">
                <span className="seal">✓</span>EXECUTOR REPORT ·
                report-template.md
              </div>
              <div className="rep-body">
                <div className="rf">
                  <span className="k">Slice</span>
                  <span className="v">00 · timeline data model</span>
                </div>
                <div className="rf">
                  <span className="k">Changed files</span>
                  <span className="v">
                    <span className="blue">+3</span> new ·{" "}
                    <span className="amber">~1</span> modified ·{" "}
                    <span style={{ color: "var(--h-dim)" }}>+349 / −3</span>
                  </span>
                </div>
                <div className="rf">
                  <span className="k">Verification</span>
                  <span className="v">
                    <span className="ok">✓ verify:timeline-model</span> ·{" "}
                    <span className="ok">✓ typecheck</span> ·{" "}
                    <span style={{ color: "var(--h-dim)" }}>– visual n/a</span>
                  </span>
                </div>
                <div className="rf">
                  <span className="k">Deviations</span>
                  <span className="v">
                    Keyframes stored as a sorted array, not a map — ordered
                    reads dominate.
                  </span>
                </div>
                <div className="rf">
                  <span className="k">Open questions</span>
                  <span className="v">
                    Allocation-free value-at-t for 60fps?{" "}
                    <span style={{ color: "var(--h-dim)" }}>
                      → defer to playback engine.
                    </span>
                  </span>
                </div>
                <div className="rf">
                  <span className="k">Follow-up</span>
                  <span className="v">
                    <span className="blue">Coordinator:</span> record
                    sorted-array storage as a decision; carry the perf question
                    forward.
                  </span>
                </div>
              </div>
            </div>

            <div className="h-msg" style={{ marginTop: 8 }}>
              <span className="bullet">●</span>
              <span className="txt">
                <span style={{ color: "var(--h-dim)" }}>
                  Paste this report back into the Coordinator session, or run
                </span>{" "}
                <span className="code">sw report 05-00</span>{" "}
                <span style={{ color: "var(--h-dim)" }}>
                  to process it automatically.
                </span>
              </span>
            </div>
          </div>

          <div className="h-foot">
            <span className="hint">
              <b>q</b> quit
            </span>
            <span className="hint">
              <b>y</b> copy report
            </span>
            <span className="grow"></span>
            <span className="stat">
              4 files · <b>+349 −3</b>
            </span>
            <span className="stat">
              <b>6m 02s</b>
            </span>
            <span className="stat">
              <b>48.1k</b> tokens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ExecutorInSession,
  ExecutorExternal,
});
