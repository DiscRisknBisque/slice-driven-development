#!/usr/bin/env node
import { spawnSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, openSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const pluginRoot = resolve(dirname(scriptPath), "..");
const defaultWsUrl = "ws://127.0.0.1:47891";
let proxyUnavailableError = null;

const actionNames = new Map([
  ["status", "SDD Actions Ready"],
  ["ingest-plan", "Ingest SDD Plan"],
  ["install-actions", "Install SDD Actions"],
  ["plan-milestone", "Plan Milestone"],
  ["start-milestone", "Start Milestone"],
  ["start-slice", "Start Slice"],
  ["answer-questions", "Answer Questions"],
  ["review-milestone", "Review Milestone"],
  ["close-milestone", "Close Milestone"],
]);

function usage(exitCode = 0) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(`Usage:
  node scripts/sdd-action.mjs <action>

Actions:
  status            Print installed action guidance without mutating Git or starting turns
  ingest-plan       Ingest sdd/roadmap.md, milestone dirs, and slice docs into sdd/index.json
  install-actions   Wire SDD buttons into .codex/environments/environment.toml
  plan-milestone    Start a Coordinator thread for the next milestone
  start-milestone   Create/switch milestone branch and commit accepted planning docs
  start-slice       Commit/merge the previous slice if needed, then create the next slice branch and thread
  answer-questions  Commit post-slice answers and merge the slice branch into the milestone branch
  review-milestone  Add a milestone review prompt to the Coordinator thread
  close-milestone   Commit reviewed milestone changes and merge the milestone branch into main

Environment:
  SDD_TRUNK          Trunk branch, default: main
  SDD_MILESTONE_NAME First milestone name fallback, default: first-milestone
  SDD_CODEX_CLI      Codex CLI path, default: detected Codex app binary or codex
  SDD_DRY_RUN        Print commands and prompts without mutating Git or starting turns
`);
  process.exit(exitCode);
}

function fail(message) {
  console.error(`sdd-action: ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const dryRun = process.env.SDD_DRY_RUN === "1";
  const printable = [command, ...args].map(shellQuote).join(" ");
  if (dryRun && options.mutate !== false) {
    console.log(`[dry-run] ${printable}`);
    return "";
  }
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(detail ? `${printable}\n${detail}` : printable);
  }
  return result.stdout?.trim() || "";
}

function git(args, options = {}) {
  const capture = options.capture ?? true;
  const mutate = options.mutate ?? !capture;
  return run("git", args, { ...options, capture, mutate });
}

function shellQuote(value) {
  if (/^[A-Za-z0-9_./:=@+-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function repoRoot() {
  try {
    return git(["rev-parse", "--show-toplevel"], { capture: true });
  } catch {
    return process.cwd();
  }
}

function currentBranch() {
  return git(["branch", "--show-current"], { capture: true });
}

function gitStatusLines() {
  const status = git(["status", "--short"], { capture: true });
  return status ? status.split("\n").filter(Boolean) : [];
}

function assertNoConflicts(statusLines) {
  const conflicts = statusLines.filter((line) => /^(UU|AA|DD|AU|UA|DU|UD) /.test(line));
  if (conflicts.length > 0) {
    fail(`merge conflicts are present:\n${conflicts.join("\n")}`);
  }
}

function hasChanges() {
  return gitStatusLines().length > 0;
}

function commitAll(message) {
  const statusLines = gitStatusLines();
  assertNoConflicts(statusLines);
  if (statusLines.length === 0) {
    console.log(`No changes to commit for "${message}".`);
    return false;
  }
  git(["add", "-A"], { capture: false });
  git(["commit", "-m", message], { capture: false });
  return true;
}

function commitPath(path, message) {
  const statusLines = gitStatusLines();
  assertNoConflicts(statusLines);
  if (statusLines.length === 0) {
    console.log(`No changes to commit for "${message}".`);
    return false;
  }
  git(["add", path], { capture: false });
  git(["commit", "-m", message], { capture: false });
  return true;
}

function commitPaths(paths, message) {
  const statusLines = gitStatusLines();
  assertNoConflicts(statusLines);
  if (statusLines.length === 0) {
    console.log(`No changes to commit for "${message}".`);
    return false;
  }
  git(["add", ...paths], { capture: false });
  git(["commit", "-m", message], { capture: false });
  return true;
}

function switchBranch(branch) {
  git(["switch", branch], { capture: false });
}

function createBranch(branch) {
  git(["switch", "-c", branch], { capture: false });
}

function branchExists(branch) {
  const result = spawnSync("git", ["rev-parse", "--verify", "--quiet", branch], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "ignore",
  });
  return result.status === 0;
}

function safeRead(path, fallback = "") {
  return existsSync(path) ? readFileSync(path, "utf8").trim() : fallback;
}

function sddRoot(root) {
  return join(root, "sdd");
}

function indexPath(root) {
  return join(sddRoot(root), "index.json");
}

function emptyIndex() {
  return { version: 1, milestones: [] };
}

function readIndex(root) {
  const path = indexPath(root);
  if (!existsSync(path)) return emptyIndex();
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  return normalizeIndex(parsed);
}

function writeIndex(root, index) {
  const path = indexPath(root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(normalizeIndex(index), null, 2)}\n`);
}

function normalizeIndex(index) {
  const milestones = Array.isArray(index?.milestones) ? index.milestones : [];
  return {
    version: 1,
    milestones: milestones
      .map(normalizeMilestoneEntry)
      .filter(Boolean)
      .sort((a, b) => a.number.localeCompare(b.number) || a.slug.localeCompare(b.slug)),
  };
}

function normalizeMilestoneEntry(entry) {
  if (!entry?.number || !entry?.slug) return null;
  const slices = Array.isArray(entry.slices) ? entry.slices : [];
  return {
    number: String(entry.number).padStart(2, "0"),
    name: entry.name || titleizeSlug(entry.slug),
    slug: slugify(entry.slug),
    status: normalizeStatus(entry.status, "planned"),
    source: entry.source || null,
    slices: slices
      .map(normalizeSliceEntry)
      .filter(Boolean)
      .sort((a, b) => a.number.localeCompare(b.number) || a.slug.localeCompare(b.slug)),
  };
}

function normalizeSliceEntry(entry) {
  if (!entry?.number || !entry?.slug) return null;
  return {
    number: String(entry.number).padStart(2, "0"),
    name: entry.name || titleizeSlug(entry.slug),
    slug: slugify(entry.slug),
    status: normalizeStatus(entry.status, "planned"),
    source: entry.source || null,
  };
}

function normalizeStatus(status, fallback) {
  return ["planned", "active", "completed", "closed", "unknown"].includes(status) ? status : fallback;
}

function milestoneDirs(root) {
  const dir = sddRoot(root);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{2}-.+/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function latestMilestone(root) {
  const dirs = milestoneDirs(root);
  return dirs.at(-1) || null;
}

function firstMilestoneName() {
  return slugify(process.env.SDD_MILESTONE_NAME || "first-milestone");
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "milestone";
}

function titleizeSlug(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Milestone";
}

function cleanHeadingTitle(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNumberPrefix(value, label) {
  const cleaned = cleanHeadingTitle(value);
  const labelPattern = label ? `${label}\\s*` : "";
  const match = new RegExp(`^(?:${labelPattern})?(\\d{1,2})(?:\\s*[-:.)]\\s*|-)(.+)$`, "i").exec(cleaned);
  if (!match) return { number: null, name: cleaned };
  return {
    number: String(Number(match[1])).padStart(2, "0"),
    name: match[2].trim() || cleaned,
  };
}

function markdownHeadings(text) {
  const headings = [];
  let inFence = false;
  for (const line of text.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    headings.push({ depth: match[1].length, title: cleanHeadingTitle(match[2]) });
  }
  return headings;
}

function roadmapMilestoneHeadings(root) {
  const path = join(sddRoot(root), "roadmap.md");
  if (!existsSync(path)) return [];
  const headings = markdownHeadings(readFileSync(path, "utf8"));
  const h1s = headings.filter((heading) => heading.depth === 1);
  const h2s = headings.filter((heading) => heading.depth === 2);
  if (h1s.length > 1) return h1s;
  if (h2s.length > 0) return h2s;
  return h1s;
}

function milestoneEntryFromHeading(heading, ordinal, existingDirNames) {
  const parsed = stripNumberPrefix(heading.title, "milestone");
  const number = parsed.number || String(ordinal).padStart(2, "0");
  const slug = slugify(parsed.name);
  const dirExists = existingDirNames.some((name) => name.startsWith(`${number}-`));
  return {
    number,
    name: parsed.name,
    slug,
    status: dirExists ? "unknown" : "planned",
    source: "sdd/roadmap.md",
    slices: [],
  };
}

function milestoneEntryFromDir(dir) {
  const number = dir.slice(0, 2);
  const slug = slugify(dir.slice(3));
  return {
    number,
    name: titleizeSlug(slug),
    slug,
    status: "unknown",
    source: `sdd/${dir}/`,
    slices: [],
  };
}

function sliceEntryFromFile(root, milestone, file, defaultStatus) {
  const base = file.replace(/\.md$/, "");
  const number = base.slice(0, 2);
  const slug = slugify(base.slice(3));
  const path = join(sddRoot(root), milestone, "slices", file);
  const headings = existsSync(path) ? markdownHeadings(readFileSync(path, "utf8")) : [];
  const title = headings[0]?.title || titleizeSlug(slug);
  const parsed = stripNumberPrefix(title, "slice");
  return {
    number,
    name: parsed.name || titleizeSlug(slug),
    slug,
    status: defaultStatus,
    source: `sdd/${milestone}/slices/${file}`,
  };
}

function mergeMilestoneEntry(existing, incoming) {
  const incomingIsDirectory = incoming.source?.endsWith("/");
  const keepRoadmapName = incomingIsDirectory && existing?.source === "sdd/roadmap.md";
  return normalizeMilestoneEntry({
    ...existing,
    number: incoming.number,
    name: keepRoadmapName ? existing.name : incoming.name || existing?.name,
    slug: incoming.slug || existing?.slug,
    status: existing?.status || incoming.status || "planned",
    source: incoming.source || existing?.source || null,
    slices: existing?.slices || incoming.slices || [],
  });
}

function mergeSliceEntry(existing, incoming) {
  return normalizeSliceEntry({
    ...existing,
    number: incoming.number,
    name: incoming.name || existing?.name,
    slug: incoming.slug || existing?.slug,
    status: existing?.status || incoming.status || "planned",
    source: incoming.source || existing?.source || null,
  });
}

function nextMilestoneNumber(root) {
  const dirs = milestoneDirs(root);
  if (dirs.length === 0) return "00";
  const max = Math.max(...dirs.map((name) => Number(name.slice(0, 2))));
  return String(max + 1).padStart(2, "0");
}

function parseMilestoneBranch(branch) {
  const match = /^(\d{2})-(.+)$/.exec(branch);
  if (!match || /^(\d{2})-\d{2}-.+$/.test(branch)) return null;
  return { milestoneNumber: match[1], milestoneName: match[2], milestone: branch };
}

function parseSliceBranch(branch) {
  const match = /^(\d{2})-(\d{2})-(.+)$/.exec(branch);
  if (!match) return null;
  const milestone = findMilestoneForNumber(process.cwd(), match[1]);
  return {
    milestoneNumber: match[1],
    sliceNumber: match[2],
    sliceName: match[3],
    sliceBranch: branch,
    milestone,
  };
}

function findMilestoneForNumber(root, number) {
  const found = milestoneDirs(root).find((name) => name.startsWith(`${number}-`));
  return found || null;
}

function milestoneBranchName(entry) {
  return `${entry.number}-${entry.slug}`;
}

function findMilestoneEntry(index, milestone) {
  const parsed = parseMilestoneBranch(milestone);
  const number = parsed?.milestoneNumber || milestone?.slice(0, 2);
  return index.milestones.find((entry) => milestoneBranchName(entry) === milestone)
    || index.milestones.find((entry) => entry.number === number)
    || null;
}

function findNextMilestoneEntry(root) {
  const index = readIndex(root);
  const next = index.milestones.find((entry) => ["planned", "unknown"].includes(entry.status));
  if (next) return next;
  const number = nextMilestoneNumber(root);
  return {
    number,
    name: titleizeSlug(firstMilestoneName()),
    slug: firstMilestoneName(),
    status: "planned",
    source: null,
    slices: [],
  };
}

function updateMilestoneInIndex(root, milestone, update) {
  const index = readIndex(root);
  const existing = findMilestoneEntry(index, milestone);
  const entry = normalizeMilestoneEntry({
    ...(existing || milestoneEntryFromDir(milestone)),
    ...update,
  });
  const without = index.milestones.filter((item) => item.number !== entry.number);
  index.milestones = [...without, entry];
  writeIndex(root, index);
  return entry;
}

function updateSliceInIndex(root, milestone, slice, update) {
  const index = readIndex(root);
  const milestoneEntry = findMilestoneEntry(index, milestone) || milestoneEntryFromDir(milestone);
  const existing = milestoneEntry.slices.find((entry) => entry.number === slice.sliceNumber)
    || {
      number: slice.sliceNumber,
      name: titleizeSlug(slice.sliceName),
      slug: slice.sliceName,
      status: "planned",
      source: `sdd/${milestone}/slices/${slice.sliceFile}`,
    };
  const nextSlice = normalizeSliceEntry({ ...existing, ...update });
  milestoneEntry.slices = [
    ...milestoneEntry.slices.filter((entry) => entry.number !== nextSlice.number),
    nextSlice,
  ];
  updateMilestoneInIndex(root, milestone, { ...milestoneEntry, slices: milestoneEntry.slices });
  return nextSlice;
}

function sliceFiles(root, milestone) {
  const dir = join(sddRoot(root), milestone, "slices");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{2}-.+\.md$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function sliceInfo(root, milestone, number) {
  const file = sliceFiles(root, milestone).find((name) => name.startsWith(`${number}-`));
  if (!file) return null;
  const base = file.replace(/\.md$/, "");
  return {
    sliceNumber: number,
    sliceName: base.slice(3),
    sliceFile: file,
    sliceBranch: `${milestone.slice(0, 2)}-${base}`,
  };
}

function sliceInfoFromIndex(root, milestone, entry) {
  const file = entry.source?.startsWith(`sdd/${milestone}/slices/`)
    ? basename(entry.source)
    : `${entry.number}-${entry.slug}.md`;
  if (!existsSync(join(sddRoot(root), milestone, "slices", file))) return null;
  return {
    sliceNumber: entry.number,
    sliceName: entry.slug,
    sliceFile: file,
    sliceBranch: `${milestone.slice(0, 2)}-${entry.number}-${entry.slug}`,
  };
}

function nextSliceInfoOrNull(root, milestone, currentNumber = null) {
  const index = readIndex(root);
  const milestoneEntry = findMilestoneEntry(index, milestone);
  if (milestoneEntry?.slices?.length > 0) {
    const indexedSlice = milestoneEntry.slices.find((entry) => entry.status === "active")
      || milestoneEntry.slices.find((entry) => ["planned", "unknown"].includes(entry.status));
    if (!indexedSlice) return null;
    const info = sliceInfoFromIndex(root, milestone, indexedSlice);
    if (!info) fail(`could not find slice file for ${indexedSlice.number}-${indexedSlice.slug} in sdd/${milestone}/slices`);
    return info;
  }

  const files = sliceFiles(root, milestone);
  if (files.length === 0) return null;
  const nextNumber = currentNumber == null
    ? "00"
    : String(Number(currentNumber) + 1).padStart(2, "0");
  const info = sliceInfo(root, milestone, nextNumber);
  if (!info) return null;
  return info;
}

function nextSliceInfo(root, milestone, currentNumber = null) {
  const info = nextSliceInfoOrNull(root, milestone, currentNumber);
  if (!info) fail(`could not find the next planned slice in sdd/${milestone}/slices`);
  return info;
}

function countSlices(root, milestone) {
  return String(sliceFiles(root, milestone).length);
}

function ingestRoadmap(root) {
  const index = readIndex(root);
  const dirs = milestoneDirs(root);
  const existingByNumber = new Map(index.milestones.map((entry) => [entry.number, entry]));
  const incoming = roadmapMilestoneHeadings(root).map((heading, ordinal) =>
    milestoneEntryFromHeading(heading, ordinal, dirs));

  for (const entry of incoming) {
    existingByNumber.set(entry.number, mergeMilestoneEntry(existingByNumber.get(entry.number), entry));
  }

  for (const dir of dirs) {
    const entry = milestoneEntryFromDir(dir);
    existingByNumber.set(entry.number, mergeMilestoneEntry(existingByNumber.get(entry.number), entry));
  }

  index.milestones = [...existingByNumber.values()];
  writeIndex(root, index);
  return normalizeIndex(index);
}

function ingestMilestoneSlices(root, milestone) {
  const index = readIndex(root);
  const existing = findMilestoneEntry(index, milestone) || milestoneEntryFromDir(milestone);
  const existingByNumber = new Map((existing.slices || []).map((entry) => [entry.number, entry]));
  const defaultStatus = existing.status === "unknown" ? "unknown" : "planned";

  for (const file of sliceFiles(root, milestone)) {
    const incoming = sliceEntryFromFile(root, milestone, file, defaultStatus);
    existingByNumber.set(incoming.number, mergeSliceEntry(existingByNumber.get(incoming.number), incoming));
  }

  updateMilestoneInIndex(root, milestone, {
    ...existing,
    slices: [...existingByNumber.values()],
  });
}

function ingestPlan(root) {
  const afterRoadmap = ingestRoadmap(root);
  for (const milestone of milestoneDirs(root)) {
    ingestMilestoneSlices(root, milestone);
  }
  const index = readIndex(root);
  console.log(`Ingested ${index.milestones.length} milestone(s) into sdd/index.json.`);
  for (const milestone of index.milestones) {
    console.log(`- ${milestone.number}-${milestone.slug} [${milestone.status}] (${milestone.slices.length} slice(s))`);
  }
  return afterRoadmap;
}

function projectDescription(root) {
  return safeRead(join(sddRoot(root), "project-description.md"), "<projectDescription missing: create sdd/project-description.md>");
}

function roadmap(root) {
  return safeRead(join(sddRoot(root), "roadmap.md"), "<roadmap missing: create sdd/roadmap.md>");
}

function decisionsList(root, milestone) {
  const dir = join(sddRoot(root), milestone, "decisions");
  if (!existsSync(dir)) return "- No decision records yet.";
  const files = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  return files.length === 0
    ? "- No decision records yet."
    : files.map((file) => `- sdd/${milestone}/decisions/${file}`).join("\n");
}

function coordinatorPrompt(root, milestone) {
  const milestoneId = milestoneBranchName(milestone);
  return `Use $slice-driven-development in Coordinator Mode.

Let's think through the implementation of milestone \`${milestoneId}\`.

Planned milestone name: ${milestone.name}

Project description is loaded from \`sdd/project-description.md\`:

${projectDescription(root)}

Roadmap is loaded from \`sdd/roadmap.md\`:

${roadmap(root)}

Create or update the milestone docs under \`sdd/${milestoneId}/\`, draft the current slice in detail, keep future slices light, and include a Relevant Decisions section in each detailed slice.`;
}

function executorPrompt(root, milestone, slice) {
  return `Use $slice-driven-development in Executor Mode to implement one vertical slice.

We are building this project in verifiable vertical slices.

Current branch: \`${slice.sliceBranch}\`
Milestone: \`${milestone}\`
Slice: \`${slice.sliceNumber}-${slice.sliceName}\`

Start by reading:
- sdd/${milestone}/README.md
- sdd/${milestone}/architecture.md
- sdd/${milestone}/slices/${slice.sliceFile}

Relevant decisions:
${decisionsList(root, milestone)}

Then implement only the slice described in \`sdd/${milestone}/slices/${slice.sliceFile}\`.

Rules:
- Do not build ahead into later slices unless the current slice cannot work without a small prerequisite.
- Prefer the architecture and decisions already documented.
- If implementation teaches us something that changes the plan, update the relevant slice file or add a short note in the SDD docs.
- Keep the result runnable and reviewable.
- Do not switch branches, commit, merge, or push. SDD action scripts handle Git deterministically.

End by reporting:
- what changed
- how to run it
- how it was verified
- artifact disposition notes for provisional verification, examples, fixtures, scripts, and generated outputs
- screenshots/artifact paths, if any
- remaining open questions for the Coordinator`;
}

function reviewPrompt(root, milestone) {
  return `Use $slice-driven-development in Coordinator Mode to review and condense this milestone.

The ${countSlices(root, milestone)} slices for Milestone ${milestone.slice(0, 2)} have been implemented.

Read:
- sdd/${milestone}/README.md
- sdd/${milestone}/architecture.md
- sdd/${milestone}/slices/
- sdd/${milestone}/decisions/

Compare the codebase to the milestone docs and tell me whether my understanding is correct:

<whatChanged>

Then inventory provisional verification code, examples, fixtures, generated outputs, and package scripts. Recommend what to promote, merge, archive in docs, or delete so the repo keeps only the durable verification and canonical examples needed for this milestone's current end-state.`;
}

function statePath(root) {
  return join(root, ".codex", "sdd-state.json");
}

function ensureCodexIgnore(root) {
  const codexDir = join(root, ".codex");
  const codexIgnore = join(codexDir, ".gitignore");
  mkdirSync(codexDir, { recursive: true });
  const required = ["sdd-state.json", "sdd-prompts/", "sdd-app-server.log"];
  const existing = existsSync(codexIgnore) ? readFileSync(codexIgnore, "utf8") : "";
  const lines = new Set(existing.split("\n").map((line) => line.trim()));
  const missing = required.filter((line) => !lines.has(line));
  if (missing.length > 0 || !existsSync(codexIgnore)) {
    const prefix = existing.trimEnd();
    writeFileSync(codexIgnore, `${prefix ? `${prefix}\n` : ""}${missing.join("\n")}\n`);
  }
}

function emptyCodexState() {
  return { threads: { milestones: {}, slices: {} } };
}

function readCodexState(root) {
  const path = statePath(root);
  if (!existsSync(path)) return emptyCodexState();
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  const state = {
    threads: {
      milestones: { ...(parsed.threads?.milestones || {}) },
      slices: { ...(parsed.threads?.slices || {}) },
    },
  };

  // One-way compatibility for older local state files. Workflow truth is no
  // longer read from .codex/sdd-state.json.
  for (const [milestone, value] of Object.entries(parsed.milestones || {})) {
    if (value?.coordinatorThreadId) {
      state.threads.milestones[milestone] = {
        ...(state.threads.milestones[milestone] || {}),
        coordinatorThreadId: value.coordinatorThreadId,
      };
    }
    if (value?.currentSliceBranch && value?.currentSliceThreadId) {
      state.threads.slices[`${milestone}/${value.currentSliceBranch}`] = {
        ...(state.threads.slices[`${milestone}/${value.currentSliceBranch}`] || {}),
        executorThreadId: value.currentSliceThreadId,
      };
    }
  }

  return state;
}

function writeCodexState(root, state) {
  const path = statePath(root);
  ensureCodexIgnore(root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify({
    threads: {
      milestones: state.threads?.milestones || {},
      slices: state.threads?.slices || {},
    },
  }, null, 2)}\n`);
}

function updateMilestoneThreadState(root, milestone, patch) {
  const state = readCodexState(root);
  state.threads.milestones[milestone] = { ...(state.threads.milestones[milestone] || {}), ...patch };
  writeCodexState(root, state);
}

function updateSliceThreadState(root, milestone, sliceBranch, patch) {
  const state = readCodexState(root);
  const key = `${milestone}/${sliceBranch}`;
  state.threads.slices[key] = { ...(state.threads.slices[key] || {}), ...patch };
  writeCodexState(root, state);
}

function detectCodexCli() {
  if (process.env.SDD_CODEX_CLI) return process.env.SDD_CODEX_CLI;
  const appBinary = "/Applications/Codex.app/Contents/Resources/codex";
  return existsSync(appBinary) ? appBinary : "codex";
}

async function rpc(method, params) {
  if (process.env.SDD_DRY_RUN === "1") {
    console.log(`[dry-run] app-server ${method}`);
    console.log(JSON.stringify(params, null, 2));
    return method === "thread/start"
      ? { thread: { id: "dry-run-thread" } }
      : {};
  }

  const codex = detectCodexCli();
  if (process.env.SDD_APP_SERVER_TRANSPORT !== "ws" && !proxyUnavailableError) {
    try {
      return await rpcViaProxy(codex, method, params);
    } catch (error) {
      proxyUnavailableError = error;
      spawnSync(codex, ["app-server", "daemon", "start"], { stdio: "ignore" });
      try {
        return await rpcViaProxy(codex, method, params);
      } catch (retryError) {
        proxyUnavailableError = retryError;
      }
    }
  }

  try {
    return await rpcViaWebSocket(codex, method, params);
  } catch (error) {
    const proxyDetail = proxyUnavailableError ? ` Proxy error: ${proxyUnavailableError.message}` : "";
    throw new Error(`${error.message}${proxyDetail}`);
  }
}

function rpcViaProxy(codex, method, params) {
  return rpcWithChild(spawn(codex, ["app-server", "proxy"], {
    stdio: ["pipe", "pipe", "pipe"],
    encoding: "utf8",
  }), method, params);
}

function rpcWithChild(child, method, params) {
  return new Promise((resolvePromise, reject) => {
    let stdout = "";
    let stderr = "";
    const requestId = 2;
    const messages = [{
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        clientInfo: { name: "slice-driven-development", version: "0.1.0" },
        capabilities: {
          experimentalApi: true,
          optOutNotificationMethods: [
            "thread/started",
            "turn/started",
            "agent/message_delta",
            "reasoning/text_delta",
          ],
        },
      },
    }];
    messages.push({ jsonrpc: "2.0", id: requestId, method, params });

    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`timed out waiting for app-server ${method}`));
    }, 15000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      const lines = stdout.split("\n");
      stdout = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        let message;
        try {
          message = JSON.parse(line);
        } catch {
          continue;
        }
        if (message.id === requestId) {
          clearTimeout(timeout);
          child.stdin.end();
          child.kill("SIGTERM");
          if (message.error) reject(new Error(JSON.stringify(message.error)));
          else resolvePromise(message.result);
        }
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("exit", (code) => {
      if (code !== 0 && stdout.trim().length === 0) {
        clearTimeout(timeout);
        reject(new Error(stderr.trim() || `app-server proxy exited with ${code}`));
      }
    });
    for (const message of messages) child.stdin.write(`${JSON.stringify(message)}\n`);
  });
}

async function rpcViaWebSocket(codex, method, params) {
  const url = process.env.SDD_APP_SERVER_WS || defaultWsUrl;
  await ensureWebSocketServer(codex, url);
  return await new Promise((resolvePromise, reject) => {
    if (typeof WebSocket === "undefined") {
      reject(new Error("WebSocket is not available in this Node runtime"));
      return;
    }
    const ws = new WebSocket(url);
    const requestId = 2;
    const timeout = setTimeout(() => {
      try {
        ws.close();
      } catch {}
      reject(new Error(`timed out waiting for app-server ${method} over ${url}`));
    }, 20000);

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          clientInfo: { name: "slice-driven-development", version: "0.1.0" },
          capabilities: {
            experimentalApi: true,
            optOutNotificationMethods: [
              "thread/started",
              "turn/started",
              "agent/message_delta",
              "reasoning/text_delta",
            ],
          },
        },
      }));
    });
    ws.addEventListener("message", (event) => {
      let message;
      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (message.id === 1) {
        ws.send(JSON.stringify({ jsonrpc: "2.0", id: requestId, method, params }));
        return;
      }
      if (message.id !== requestId) return;
      clearTimeout(timeout);
      try {
        ws.close();
      } catch {}
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolvePromise(message.result);
    });
    ws.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error(`failed to connect to app-server WebSocket at ${url}`));
    });
  });
}

async function ensureWebSocketServer(codex, url) {
  if (await isReady(url)) return;
  const out = openSyncLog(process.cwd());
  const child = spawn(codex, ["app-server", "--listen", url], {
    detached: true,
    stdio: ["ignore", out, out],
  });
  child.unref();
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await sleep(250);
    if (await isReady(url)) return;
  }
  throw new Error(`failed to start app-server WebSocket at ${url}`);
}

function openSyncLog(root) {
  ensureCodexIgnore(root);
  const logDir = join(root, ".codex");
  return openSync(join(logDir, "sdd-app-server.log"), "a");
}

async function isReady(url) {
  const readyz = url.replace(/^ws:/, "http:").replace(/^wss:/, "https:").replace(/\/$/, "") + "/readyz";
  try {
    const response = await fetch(readyz, { signal: AbortSignal.timeout(500) });
    return response.ok;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function startThread(root, prompt, name) {
  try {
    const started = await rpc("thread/start", {
      cwd: root,
      approvalPolicy: "never",
      sandbox: "danger-full-access",
      threadSource: "user",
    });
    const threadId = started.thread.id;
    await rpc("thread/name/set", { threadId, name });
    await rpc("turn/start", {
      threadId,
      input: [{ type: "text", text: prompt, text_elements: [] }],
    });
    console.log(`Started Codex thread ${threadId}: ${name}`);
    return threadId;
  } catch (error) {
    writePendingPrompt(root, name, prompt, error);
    return null;
  }
}

async function sendTurn(root, threadId, prompt, name) {
  try {
    await rpc("turn/start", {
      threadId,
      input: [{ type: "text", text: prompt, text_elements: [] }],
    });
    console.log(`Added message to Codex thread ${threadId}.`);
  } catch (error) {
    writePendingPrompt(root, name, prompt, error);
  }
}

function writePendingPrompt(root, name, prompt, error) {
  ensureCodexIgnore(root);
  const dir = join(root, ".codex", "sdd-prompts");
  mkdirSync(dir, { recursive: true });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "prompt";
  const path = join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${slug}.md`);
  writeFileSync(path, `${prompt}\n`);
  console.warn(`Could not reach Codex app-server; wrote prompt to ${path}`);
  console.warn(`App-server error: ${error.message}`);
}

function installActions(root) {
  const envDir = join(root, ".codex", "environments");
  const envFile = join(envDir, "environment.toml");
  mkdirSync(envDir, { recursive: true });
  const projectName = basename(root);
  const commandBase = `node ${shellQuote(scriptPath)}`;
  const block = `# BEGIN SDD ACTIONS
[[actions]]
name = "SDD Actions Ready"
icon = "tool"
command = "${commandBase} status"

[[actions]]
name = "Ingest SDD Plan"
icon = "tool"
command = "${commandBase} ingest-plan"

[[actions]]
name = "Plan Milestone"
icon = "tool"
command = "${commandBase} plan-milestone"

[[actions]]
name = "Start Milestone"
icon = "run"
command = "${commandBase} start-milestone"

[[actions]]
name = "Start Slice"
icon = "run"
command = "${commandBase} start-slice"

[[actions]]
name = "Answer Questions"
icon = "tool"
command = "${commandBase} answer-questions"

[[actions]]
name = "Review Milestone"
icon = "tool"
command = "${commandBase} review-milestone"

[[actions]]
name = "Close Milestone"
icon = "run"
command = "${commandBase} close-milestone"
# END SDD ACTIONS`;
  const base = `version = 1
name = "${projectName}"

[setup]
script = ""
`;
  const existing = existsSync(envFile) ? readFileSync(envFile, "utf8") : base;
  const next = existing.includes("# BEGIN SDD ACTIONS")
    ? existing.replace(/# BEGIN SDD ACTIONS[\s\S]*# END SDD ACTIONS/, block)
    : `${existing.trim()}\n\n${block}\n`;
  writeFileSync(envFile, next);
  ensureCodexIgnore(root);
  console.log(`Wired SDD actions in ${envFile}`);
}

function printStatus(root) {
  const milestones = milestoneDirs(root);
  console.log("SDD actions are installed for this project.");
  console.log("");
  console.log("Select a specific workflow action when ready:");
  console.log("- Ingest SDD Plan");
  console.log("- Plan Milestone");
  console.log("- Start Milestone");
  console.log("- Start Slice");
  console.log("- Answer Questions");
  console.log("- Review Milestone");
  console.log("- Close Milestone");
  console.log("");
  console.log(`Project inputs: ${existsSync(join(sddRoot(root), "project-description.md")) ? "found" : "missing"} sdd/project-description.md, ${existsSync(join(sddRoot(root), "roadmap.md")) ? "found" : "missing"} sdd/roadmap.md`);
  console.log(`SDD index: ${existsSync(indexPath(root)) ? "found" : "missing"} sdd/index.json`);
  console.log(`Milestones found: ${milestones.length === 0 ? "none yet" : milestones.join(", ")}`);
  if (existsSync(indexPath(root))) {
    const index = readIndex(root);
    console.log(`Indexed milestones: ${index.milestones.length === 0 ? "none yet" : index.milestones.map((milestone) => `${milestone.number}-${milestone.slug} [${milestone.status}]`).join(", ")}`);
  }
  console.log("");
  console.log("This status action is intentionally side-effect free.");
}

async function planMilestone(root) {
  const milestone = findNextMilestoneEntry(root);
  const prompt = coordinatorPrompt(root, milestone);
  const threadId = await startThread(root, prompt, `SDD Plan ${milestoneBranchName(milestone)}`);
  updateMilestoneThreadState(root, milestoneBranchName(milestone), { coordinatorThreadId: threadId || null });
}

async function startMilestone(root) {
  const planned = findNextMilestoneEntry(root);
  const plannedDir = milestoneDirs(root).find((name) => name.startsWith(`${planned.number}-`));
  const currentMilestone = parseMilestoneBranch(currentBranch())?.milestone;
  const currentEntry = currentMilestone ? findMilestoneEntry(readIndex(root), currentMilestone) : null;
  const milestone = currentMilestone && (existsSync(join(sddRoot(root), currentMilestone)) || currentEntry?.status === "active")
    ? currentMilestone
    : plannedDir
      || (existsSync(indexPath(root)) ? milestoneBranchName(planned) : latestMilestone(root))
      || milestoneBranchName(planned);
  if (currentBranch() !== milestone) {
    if (branchExists(milestone)) switchBranch(milestone);
    else createBranch(milestone);
  }
  const milestonePath = join("sdd", milestone);
  const existingEntry = findMilestoneEntry(readIndex(root), milestone) || planned;
  updateMilestoneInIndex(root, milestone, {
    status: "active",
    source: existsSync(join(root, milestonePath)) ? `${milestonePath}/` : existingEntry.source,
  });
  if (existsSync(join(root, milestonePath))) {
    commitPaths([milestonePath, "sdd/index.json"], `Plan ${milestone}`);
  } else {
    console.log(`No ${milestonePath} directory found yet.`);
    console.log(`Started milestone branch ${milestone}. Create planning docs under ${milestonePath}/, then run Start Milestone again to commit them.`);
  }
}

async function startSlice(root) {
  const branch = currentBranch();
  const milestoneStage = parseMilestoneBranch(branch);
  const sliceStage = parseSliceBranch(branch);
  let milestone;
  let slice;

  if (milestoneStage) {
    milestone = milestoneStage.milestone;
    if (hasChanges()) fail("start-slice from a milestone branch requires a clean working tree");
    slice = nextSliceInfo(root, milestone);
  } else if (sliceStage) {
    milestone = sliceStage.milestone;
    if (!milestone) fail(`could not find milestone directory for branch ${branch}`);
    updateSliceInIndex(root, milestone, {
      sliceNumber: sliceStage.sliceNumber,
      sliceName: sliceStage.sliceName,
      sliceFile: `${sliceStage.sliceNumber}-${sliceStage.sliceName}.md`,
    }, { status: "completed" });
    commitAll(`Impl ${sliceStage.milestoneNumber}-${sliceStage.sliceNumber}-${sliceStage.sliceName}`);
    switchBranch(milestone);
    git(["merge", branch], { capture: false });
    slice = nextSliceInfoOrNull(root, milestone);
    if (!slice) {
      console.log(`All slices in ${milestone} are completed. Run Review Milestone when ready.`);
      return;
    }
  } else {
    fail(`current branch '${branch}' is neither a milestone branch nor a slice branch`);
  }

  updateSliceInIndex(root, milestone, slice, { status: "active" });
  commitPath("sdd/index.json", `Start ${slice.sliceBranch}`);
  if (branchExists(slice.sliceBranch)) switchBranch(slice.sliceBranch);
  else createBranch(slice.sliceBranch);
  const threadId = await startThread(root, executorPrompt(root, milestone, slice), `SDD ${slice.sliceBranch}`);
  updateSliceThreadState(root, milestone, slice.sliceBranch, { executorThreadId: threadId || null });
}

async function answerQuestions(root) {
  const branch = currentBranch();
  const parsed = parseSliceBranch(branch);
  if (!parsed) fail("answer-questions must be run from a slice branch");
  if (!parsed.milestone) fail(`could not find milestone directory for branch ${branch}`);
  updateSliceInIndex(root, parsed.milestone, {
    sliceNumber: parsed.sliceNumber,
    sliceName: parsed.sliceName,
    sliceFile: `${parsed.sliceNumber}-${parsed.sliceName}.md`,
  }, { status: "completed" });
  commitAll(`Ansr ${parsed.milestoneNumber}-${parsed.sliceNumber}-${parsed.sliceName}`);
  switchBranch(parsed.milestone);
  git(["merge", branch], { capture: false });
}

async function reviewMilestone(root) {
  const branch = currentBranch();
  const milestone = parseMilestoneBranch(branch)?.milestone || latestMilestone(root);
  if (!milestone) fail("no milestone branch or milestone directory found");
  const prompt = reviewPrompt(root, milestone);
  const state = readCodexState(root);
  const threadId = state.threads?.milestones?.[milestone]?.coordinatorThreadId;
  if (threadId) {
    await sendTurn(root, threadId, prompt, `SDD Review ${milestone}`);
  } else {
    const newThreadId = await startThread(root, prompt, `SDD Review ${milestone}`);
    updateMilestoneThreadState(root, milestone, { coordinatorThreadId: newThreadId || null });
  }
}

async function closeMilestone(root) {
  const trunk = process.env.SDD_TRUNK || "main";
  const branch = currentBranch();
  const milestone = parseMilestoneBranch(branch)?.milestone;
  if (!milestone) fail("close-milestone must be run from a milestone branch");
  updateMilestoneInIndex(root, milestone, { status: "closed" });
  commitAll(`Impl ${milestone}`);
  switchBranch(trunk);
  git(["merge", milestone], { capture: false });
}

async function main() {
  const action = process.argv[2];
  if (!action || action === "--help" || action === "-h") usage(0);
  if (!actionNames.has(action)) usage(1);
  const root = repoRoot();
  process.chdir(root);
  try {
    switch (action) {
      case "status":
        printStatus(root);
        break;
      case "ingest-plan":
        ingestPlan(root);
        break;
      case "install-actions":
        installActions(root);
        break;
      case "plan-milestone":
        await planMilestone(root);
        break;
      case "start-milestone":
        await startMilestone(root);
        break;
      case "start-slice":
        await startSlice(root);
        break;
      case "answer-questions":
        await answerQuestions(root);
        break;
      case "review-milestone":
        await reviewMilestone(root);
        break;
      case "close-milestone":
        await closeMilestone(root);
        break;
    }
  } catch (error) {
    fail(error.message);
  }
}

main();
