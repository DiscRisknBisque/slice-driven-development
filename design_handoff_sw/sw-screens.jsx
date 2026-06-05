// sw-screens.jsx — Slicewise empty-state screens
// Shared AppWindow chrome + four empty-state variations.
// Exports screen components to window for the canvas file.

const { useState } = React;

/* ─── Shared chrome ─────────────────────────────────────────── */
function AppWindow({
  ctx = [],
  statusItems,
  sidebar,
  main,
  noSidebar = false,
}) {
  return (
    <div className="sw" style={{ width: "100%", height: "100%" }}>
      <div className="app-window">
        {/* Title bar */}
        <div className="titlebar">
          <div className="traffic">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="brand">
            <span className="logo">🍕</span>
            <span>Slicewise</span>
            {ctx.map((c, i) => (
              <React.Fragment key={i}>
                <span className="sep">·</span>
                <span className="ctx">{c}</span>
              </React.Fragment>
            ))}
          </div>
          <div className="title-actions">
            <button className="icon-btn" aria-label="Search">
              ⌕
            </button>
            <button className="icon-btn" aria-label="Settings">
              ⚙
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={"body" + (noSidebar ? " no-sidebar" : "")}>
          {!noSidebar && <aside className="sidebar">{sidebar}</aside>}
          {main}
        </div>

        {/* Status bar */}
        <div className="statusbar">{statusItems}</div>
      </div>
    </div>
  );
}

/* ─── Sidebar pieces ────────────────────────────────────────── */
function EmptySidebar() {
  return (
    <React.Fragment>
      <div className="repo-switcher">
        <div className="repo-icon empty">—</div>
        <div className="repo-meta">
          <div className="repo-name muted">No project</div>
          <div className="repo-path">nothing open</div>
        </div>
        <span className="chev">▾</span>
      </div>

      <div className="sb-section">
        <div className="sb-section-head">
          <span>Milestones</span>
          <span className="add">+</span>
        </div>
        <div className="sb-ghost">
          <span className="dot"></span>
          <span className="bar" style={{ width: "54%" }}></span>
        </div>
        <div className="sb-ghost">
          <span className="dot"></span>
          <span className="bar" style={{ width: "38%" }}></span>
        </div>
        <div className="sb-ghost">
          <span className="dot"></span>
          <span className="bar" style={{ width: "46%" }}></span>
        </div>
        <div className="sb-empty-note">
          Milestones appear here
          <br />
          once a project is open.
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-head">
          <span>Project</span>
        </div>
        <div className="sb-link disabled">
          <i className="ico">▤</i> Description
        </div>
        <div className="sb-link disabled">
          <i className="ico">▦</i> Roadmap
        </div>
        <div className="sb-link disabled">
          <i className="ico">⌥</i> All decisions
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="ico" style={{ color: "var(--text-faint)" }}>
          ○
        </span>
        <span>No project</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

function ProjectSidebar({ descDone = false, roadmapDone = false }) {
  const missing = (!descDone ? 1 : 0) + (!roadmapDone ? 1 : 0);
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
        <div className="sb-empty-note">
          {missing > 0 ? (
            <React.Fragment>
              Add the required docs
              <br />
              before planning milestones.
            </React.Fragment>
          ) : (
            <React.Fragment>
              No milestones yet.
              <br />
              Plan one to begin.
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-section-head">
          <span>Project</span>
        </div>
        <div className="sb-link">
          <i className="ico">▤</i> Description
          {!descDone && <span className="miss">missing</span>}
        </div>
        <div className="sb-link">
          <i className="ico">▦</i> Roadmap
          {!roadmapDone && <span className="miss">missing</span>}
        </div>
        <div className="sb-link disabled">
          <i className="ico">⌥</i> All decisions{" "}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-faint)",
            }}
          >
            0
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span
          className="ico"
          style={{ color: missing > 0 ? "var(--warning)" : "var(--success)" }}
        >
          ●
        </span>
        <span>{missing > 0 ? "Setup required" : "Ready"}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
          v0.4.2
        </span>
      </div>
    </React.Fragment>
  );
}

/* ─── Add-project action set ────────────────────────────────── */
const ADD_ACTIONS = [
  {
    icon: "⌖",
    title: "Open local folder",
    desc: "Point Slicewise at an existing repo on disk.",
    kbd: "⌘O",
    primary: true,
  },
  {
    icon: "⎇",
    title: "Clone from Git",
    desc: "Paste an HTTPS or SSH remote URL.",
  },
  {
    icon: "✧",
    title: "Create new project",
    desc: "Start from an empty Slicewise scaffold.",
  },
];

/* ════════════════════════════════════════════════════════════
   A1 — No projects · full chrome · centered onboarding (warm)
   ════════════════════════════════════════════════════════════ */
function NoProjectsCentered() {
  const [picked, setPicked] = useState(null);
  return (
    <AppWindow
      ctx={[]}
      sidebar={<EmptySidebar />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="idle-dot"></span>no project open
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main center">
          <div className="empty">
            <div className="empty-mark">🍕</div>
            <div className="empty-kicker">Welcome to Slicewise</div>
            <h1 className="empty-title">Add a project to begin</h1>
            <p className="empty-sub">
              Slicewise steers your coding work through small, reviewable
              vertical slices. Open a repo and Slicewise keeps the milestones,
              decisions, and open questions in one place.
            </p>

            <div className="action-grid">
              {ADD_ACTIONS.map((a) => (
                <div
                  key={a.title}
                  className={
                    "action-row" + (picked === a.title ? " picked" : "")
                  }
                  onClick={() => setPicked(a.title)}
                  style={
                    picked === a.title
                      ? { borderColor: "var(--bg-invert)" }
                      : null
                  }
                >
                  <span className="ac-icon">{a.icon}</span>
                  <span className="ac-body">
                    <span className="ac-title">{a.title}</span>
                    <span className="ac-desc" style={{ display: "block" }}>
                      {a.desc}
                    </span>
                  </span>
                  <span className="arrow">→</span>
                </div>
              ))}
            </div>

            <div className="sub-links">
              <a>
                <span className="ico">↺</span> Open recent
              </a>
              <a>
                <span className="ico">▤</span> Read the docs
              </a>
              <a>
                <span className="ico">⌘</span> Command palette
              </a>
            </div>
          </div>
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   A2 — No projects · sidebar collapsed · welcome hero + motif
   ════════════════════════════════════════════════════════════ */
function NoProjectsWelcome() {
  return (
    <AppWindow
      ctx={[]}
      noSidebar
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="idle-dot"></span>no project open
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main center">
          <div className="empty wide">
            <div className="empty-mark invert">🍕</div>
            <h1 className="empty-title" style={{ fontSize: 28 }}>
              Slicewise
            </h1>
            <p className="empty-sub">
              Steer agentic coding through small, reviewable vertical slices —
              you keep the architectural decisions and review gates, the agent
              handles the repeatable mechanics.
            </p>

            <div className="flow">
              <span className="step lit">
                <span className="glyph"></span>Plan
              </span>
              <span className="arrow">→</span>
              <span className="step">
                <span className="glyph"></span>Slice
              </span>
              <span className="arrow">→</span>
              <span className="step">
                <span className="glyph"></span>Review
              </span>
              <span className="arrow">→</span>
              <span className="step">
                <span className="glyph"></span>Complete
              </span>
            </div>

            <div className="action-grid cols-3">
              {ADD_ACTIONS.map((a) => (
                <div
                  key={a.title}
                  className={"action-card" + (a.primary ? " primary" : "")}
                >
                  <span className="ac-icon">{a.icon}</span>
                  <span className="ac-title">{a.title}</span>
                  <span className="ac-desc">{a.desc}</span>
                  {a.kbd && <span className="ac-kbd">{a.kbd}</span>}
                </div>
              ))}
            </div>

            <div className="sub-links">
              <a>
                <span className="ico">↺</span> Open recent
              </a>
              <a>
                <span className="ico">▤</span> Documentation
              </a>
              <a>
                <span className="ico">↗</span> npx skills add slicewise
              </a>
            </div>
          </div>
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   B1 — Project open · missing docs · terse checklist
   ════════════════════════════════════════════════════════════ */
const DOCS = [
  {
    key: "desc",
    path: "sw/project-description.md",
    desc: "What the project is, who it’s for, the problem it solves, and any non-goals.",
  },
  {
    key: "roadmap",
    path: "sw/roadmap.md",
    desc: "Product direction and the milestones Slicewise will slice through — kept short, revised as you learn.",
  },
];

function MissingDocsTerse() {
  const [done, setDone] = useState({ desc: false, roadmap: false });
  const missingCount = Object.values(done).filter((v) => !v).length;
  const allDone = missingCount === 0;

  return (
    <AppWindow
      ctx={["diorama", "setup"]}
      sidebar={
        <ProjectSidebar descDone={done.desc} roadmapDone={done.roadmap} />
      }
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>main
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span
            className="sb-item"
            style={{ color: allDone ? "var(--success)" : "var(--warning)" }}
          >
            {allDone
              ? "docs ready"
              : `${missingCount} doc${missingCount > 1 ? "s" : ""} missing`}
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div
            className="breadcrumb"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-faint)",
              marginBottom: 10,
              display: "flex",
              gap: 6,
            }}
          >
            <span>diorama</span>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>sw</span>
          </div>

          <div
            className="page-head"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                Project setup
              </h1>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--text-muted)",
                  maxWidth: 520,
                  lineHeight: 1.55,
                }}
              >
                Slicewise needs lightweight product context before it can slice
                work. Add the two required docs to unlock milestone planning.
              </div>
            </div>
            <button
              className="btn primary"
              disabled={!allDone}
              style={!allDone ? { opacity: 0.35, cursor: "not-allowed" } : null}
            >
              Plan first milestone <span className="kbd">⌘↵</span>
            </button>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Required documents</span>
                <span className="sub">readiness gate before planning</span>
              </div>
              <div className="card-progress">
                {2 - missingCount} / 2 present
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {DOCS.map((d) => (
                <div className="doc-row" key={d.key}>
                  <span className={"doc-check" + (done[d.key] ? " done" : "")}>
                    {done[d.key] ? "✓" : ""}
                  </span>
                  <div className="doc-main">
                    <div className="doc-path">
                      {d.path}
                      <span className={"req" + (done[d.key] ? " ok" : "")}>
                        {done[d.key] ? "present" : "required"}
                      </span>
                    </div>
                    <div className="doc-desc">{d.desc}</div>
                  </div>
                  <div className="doc-action">
                    {done[d.key] ? (
                      <button
                        className="btn sm"
                        onClick={() =>
                          setDone((s) => ({ ...s, [d.key]: false }))
                        }
                      >
                        Open ↗
                      </button>
                    ) : (
                      <button
                        className="btn sm primary"
                        onClick={() =>
                          setDone((s) => ({ ...s, [d.key]: true }))
                        }
                      >
                        Create file
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="setup-footer">
              <span className="hint">
                {allDone ? (
                  <React.Fragment>
                    <b>Ready.</b> You can plan your first milestone.
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    Both files live under <b>sw/</b> in your repo.
                  </React.Fragment>
                )}
              </span>
              <button className="btn sm">Create both from template</button>
            </div>
          </div>
        </main>
      }
    />
  );
}

/* ════════════════════════════════════════════════════════════
   B2 — Project open · missing docs · guided w/ scaffold preview
   ════════════════════════════════════════════════════════════ */
function MissingDocsGuided() {
  const [roadmapDone, setRoadmapDone] = useState(false);

  return (
    <AppWindow
      ctx={["diorama", "setup"]}
      sidebar={<ProjectSidebar descDone={true} roadmapDone={roadmapDone} />}
      statusItems={
        <React.Fragment>
          <span className="sb-item">
            <span className="ico">⎇</span>main
          </span>
          <span className="sb-item">
            <span className="live-dot"></span>app-server connected
          </span>
          <span
            className="sb-item"
            style={{ color: roadmapDone ? "var(--success)" : "var(--warning)" }}
          >
            {roadmapDone ? "docs ready" : "step 2 of 2"}
          </span>
          <span className="sb-version">Slicewise 0.4.2 · pizza build</span>
        </React.Fragment>
      }
      main={
        <main className="main">
          <div
            className="breadcrumb"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-faint)",
              marginBottom: 10,
              display: "flex",
              gap: 6,
            }}
          >
            <span>diorama</span>
            <span>/</span>
            <span>sw</span>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>roadmap.md</span>
          </div>

          <div
            className="page-head"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                Finish setting up{" "}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 18 }}>
                  diorama
                </span>
              </h1>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--text-muted)",
                  maxWidth: 540,
                  lineHeight: 1.55,
                }}
              >
                One doc to go. Drop in a roadmap and Slicewise can start slicing
                your first milestone.
              </div>
            </div>
            <button
              className="btn primary"
              disabled={!roadmapDone}
              style={
                !roadmapDone ? { opacity: 0.35, cursor: "not-allowed" } : null
              }
            >
              Plan first milestone <span className="kbd">⌘↵</span>
            </button>
          </div>

          {/* Progress: desc done, roadmap active */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <span>Setup</span>
                <span className="sub">2 required documents</span>
              </div>
              <div className="card-progress">
                {roadmapDone ? "2" : "1"} / 2 present
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="doc-row">
                <span className="doc-check done">✓</span>
                <div className="doc-main">
                  <div className="doc-path">
                    sw/project-description.md{" "}
                    <span className="req ok">present</span>
                  </div>
                  <div className="doc-desc">
                    Captured what diorama is and who it’s for.
                  </div>
                </div>
                <div className="doc-action">
                  <button className="btn sm">Open ↗</button>
                </div>
              </div>
              <div
                className="doc-row"
                style={{
                  background: roadmapDone ? "transparent" : "var(--bg-subtle)",
                }}
              >
                <span
                  className={"doc-check" + (roadmapDone ? " done" : "")}
                  style={
                    !roadmapDone
                      ? {
                          borderStyle: "solid",
                          borderColor: "var(--text)",
                          color: "var(--text)",
                        }
                      : null
                  }
                >
                  {roadmapDone ? "✓" : "2"}
                </span>
                <div className="doc-main">
                  <div className="doc-path">
                    sw/roadmap.md{" "}
                    <span className={"req" + (roadmapDone ? " ok" : "")}>
                      {roadmapDone ? "present" : "in progress"}
                    </span>
                  </div>
                  <div className="doc-desc">
                    Product direction + milestones. Start from the template
                    below, then refine.
                  </div>
                </div>
                <div className="doc-action">
                  {roadmapDone ? (
                    <button
                      className="btn sm"
                      onClick={() => setRoadmapDone(false)}
                    >
                      Open ↗
                    </button>
                  ) : (
                    <button
                      className="btn sm primary"
                      onClick={() => setRoadmapDone(true)}
                    >
                      Use template
                    </button>
                  )}
                </div>
              </div>
            </div>

            {!roadmapDone && (
              <React.Fragment>
                <div className="scaffold">
                  <div className="scaffold-head">
                    <span className="dotpair">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    sw/roadmap.md — preview
                  </div>
                  <pre>
                    {``}
                    <span className="h"># Roadmap</span>
                    {`

`}
                    <span className="h">## Product Direction</span>
                    {`

- Audience:
- Problem:
- Desired outcome:
- Constraints:
- Non-goals:

`}
                    <span className="h">## Milestones</span>
                    {`

`}
                    <span className="h">### Milestone 01: Name</span>
                    {`

- Outcome:
- Why now:
- Scope:
- Non-goals:
- Success signals:
- Risks or open questions:`}
                  </pre>
                </div>

                <div className="tip">
                  <span className="ico">✲</span>
                  <span>
                    Don’t have a direction yet? Run a lightweight thinking pass
                    first — the <a>thinking-partner</a> skill is built for
                    assumption-checking and choosing a practical first
                    milestone. Slicewise slices the work afterward.
                  </span>
                </div>
              </React.Fragment>
            )}

            <div className="setup-footer">
              <span className="hint">
                {roadmapDone ? (
                  <React.Fragment>
                    <b>All set.</b> diorama is ready for its first milestone.
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    Keep it short — you’ll revise it as you learn.
                  </React.Fragment>
                )}
              </span>
              {!roadmapDone && (
                <button className="btn sm" onClick={() => setRoadmapDone(true)}>
                  Create blank instead
                </button>
              )}
            </div>
          </div>
        </main>
      }
    />
  );
}

Object.assign(window, {
  NoProjectsCentered,
  NoProjectsWelcome,
  MissingDocsTerse,
  MissingDocsGuided,
});
