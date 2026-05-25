#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const stages = new Set([
  "plan-milestone",
  "start-slice",
  "finish-slice",
  "post-slice-docs",
  "merge-slice",
  "review-milestone",
  "merge-milestone",
]);

function usage(exitCode = 0) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(`Usage:
  node scripts/sdd-git-preflight.mjs --stage <stage> [options]

Stages:
  plan-milestone     Verify milestone planning commit readiness
  start-slice        Verify clean milestone branch before creating a slice branch
  finish-slice       Verify slice branch implementation commit readiness
  post-slice-docs    Verify slice branch answer-driven docs commit readiness
  merge-slice        Verify clean milestone branch before merging a slice branch
  review-milestone   Verify milestone branch before review/condensation
  merge-milestone    Verify clean trunk branch before merging a milestone branch

Options:
  --trunk <branch>               Trunk branch, default: main
  --milestone-branch <branch>    Milestone branch name
  --slice-branch <branch>        Slice branch name
  --milestone-docs <path>        Milestone docs path, for example sdd/03-feature

This helper only inspects state and prints guidance. It does not switch, commit, merge, or push.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { trunk: "main" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") usage(0);
    if (!arg.startsWith("--")) usage(1);
    const key = arg.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }
    args[key] = value;
    index += 1;
  }
  if (!args.stage || !stages.has(args.stage)) {
    throw new Error(`Missing or unsupported --stage. Use --help for supported stages.`);
  }
  return args;
}

function git(args, options = {}) {
  const output = execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", options.allowFailure ? "pipe" : "inherit"],
  });
  return options.preserveWhitespace ? output.replace(/\n$/, "") : output.trim();
}

function gitMaybe(args) {
  try {
    return git(args, { allowFailure: true });
  } catch {
    return "";
  }
}

function requireArg(args, name, stage) {
  if (!args[name]) throw new Error(`--${name} is required for ${stage}`);
}

function branchExists(branch) {
  return gitMaybe(["rev-parse", "--verify", "--quiet", branch]).length > 0;
}

function hasConflicts(statusLines) {
  return statusLines.some((line) => /^(UU|AA|DD|AU|UA|DU|UD) /.test(line));
}

function statusGroups(statusLines) {
  return {
    staged: statusLines.filter((line) => line[0] !== " " && line[0] !== "?"),
    unstaged: statusLines.filter((line) => line[1] !== " " && line[0] !== "?"),
    untracked: statusLines.filter((line) => line.startsWith("?? ")),
  };
}

function assertBranch(current, expected, label, failures) {
  if (current !== expected) {
    failures.push(`Expected ${label} branch '${expected}', but current branch is '${current}'.`);
  }
}

function assertClean(statusLines, failures) {
  if (statusLines.length > 0) {
    failures.push("Working tree is not clean. Commit, stash, or resolve ownership before this stage.");
  }
}

function printSection(title, lines) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
  for (const line of lines) console.log(line);
}

function guidance(args) {
  const milestoneDocs = args["milestone-docs"] || "sdd/<milestone>";
  const milestone = args["milestone-branch"] || "<milestone-branch>";
  const slice = args["slice-branch"] || "<slice-branch>";
  switch (args.stage) {
    case "plan-milestone":
      return [
        `git add ${milestoneDocs}`,
        `git commit -m "Plan ${milestone}"`,
      ];
    case "start-slice":
      return [`git switch -c ${slice}`];
    case "finish-slice":
      return [
        "git add <implementation-files>",
        `git commit -m "Impl ${milestone}-${slice}"`,
      ];
    case "post-slice-docs":
      return [
        `git add ${milestoneDocs}`,
        `git commit -m "Ansr ${milestone}-${slice}"`,
      ];
    case "merge-slice":
      return [`git merge ${slice}`];
    case "review-milestone":
      return [
        "# perform milestone review and artifact condensation",
        "git add <condensation-files>",
        `git commit -m "Condense ${milestone} verification surface"`,
      ];
    case "merge-milestone":
      return [`git merge ${milestone}`];
    default:
      return [];
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  git(["rev-parse", "--is-inside-work-tree"]);

  const current = git(["branch", "--show-current"]);
  const status = git(["status", "--short"], { preserveWhitespace: true });
  const statusLines = status ? status.split("\n") : [];
  const groups = statusGroups(statusLines);
  const recent = git(["log", "--oneline", "--decorate", "-5"]).split("\n");
  const failures = [];
  const warnings = [];

  if (hasConflicts(statusLines)) {
    failures.push("Merge conflicts are present.");
  }

  switch (args.stage) {
    case "plan-milestone":
      requireArg(args, "milestone-branch", args.stage);
      assertBranch(current, args["milestone-branch"], "milestone", failures);
      if (statusLines.length === 0) warnings.push("No changes detected to commit for milestone planning.");
      break;
    case "start-slice":
      requireArg(args, "milestone-branch", args.stage);
      requireArg(args, "slice-branch", args.stage);
      assertBranch(current, args["milestone-branch"], "milestone", failures);
      assertClean(statusLines, failures);
      if (branchExists(args["slice-branch"])) failures.push(`Slice branch '${args["slice-branch"]}' already exists.`);
      break;
    case "finish-slice":
      requireArg(args, "slice-branch", args.stage);
      assertBranch(current, args["slice-branch"], "slice", failures);
      if (statusLines.length === 0) warnings.push("No changes detected to commit for slice implementation.");
      if (groups.untracked.length > 0) warnings.push("Untracked files are present; confirm ownership before adding.");
      break;
    case "post-slice-docs":
      requireArg(args, "slice-branch", args.stage);
      assertBranch(current, args["slice-branch"], "slice", failures);
      if (statusLines.length === 0) warnings.push("No doc changes detected to commit.");
      if (groups.untracked.length > 0) warnings.push("Untracked files are present; confirm ownership before adding.");
      break;
    case "merge-slice":
      requireArg(args, "milestone-branch", args.stage);
      requireArg(args, "slice-branch", args.stage);
      assertBranch(current, args["milestone-branch"], "milestone", failures);
      assertClean(statusLines, failures);
      if (!branchExists(args["slice-branch"])) failures.push(`Slice branch '${args["slice-branch"]}' does not exist locally.`);
      break;
    case "review-milestone":
      requireArg(args, "milestone-branch", args.stage);
      assertBranch(current, args["milestone-branch"], "milestone", failures);
      if (statusLines.length > 0) warnings.push("Working tree is dirty; review whether these are intended condensation changes.");
      break;
    case "merge-milestone":
      requireArg(args, "milestone-branch", args.stage);
      assertBranch(current, args.trunk, "trunk", failures);
      assertClean(statusLines, failures);
      if (!branchExists(args["milestone-branch"])) failures.push(`Milestone branch '${args["milestone-branch"]}' does not exist locally.`);
      break;
  }

  printSection("Git State", [
    `stage: ${args.stage}`,
    `current branch: ${current || "(detached HEAD)"}`,
    `status entries: ${statusLines.length}`,
    `staged entries: ${groups.staged.length}`,
    `unstaged entries: ${groups.unstaged.length}`,
    `untracked entries: ${groups.untracked.length}`,
  ]);

  if (statusLines.length > 0) printSection("Status", statusLines);
  printSection("Recent Commits", recent);
  if (warnings.length > 0) printSection("Warnings", warnings);

  if (failures.length > 0) {
    printSection("Blocked", failures);
    process.exit(1);
  }

  printSection("Preflight Passed", ["Review the guidance below before running commands."]);
  printSection("Suggested Next Commands", guidance(args));
}

try {
  main();
} catch (error) {
  console.error(`sdd-git-preflight: ${error.message}`);
  process.exit(1);
}
