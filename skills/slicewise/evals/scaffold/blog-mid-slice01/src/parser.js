// Slice 00 output: parse a Markdown post into frontmatter + body.
//
// parsePost(rawText) -> { frontmatter, body } on success,
//                       { error } when the frontmatter block is malformed.
//
// Frontmatter is a YAML-ish block delimited by lines of "---". Defaults are
// applied per decisions/00-frontmatter-defaults.md.

const DEFAULTS = {
  title: null, // filled by caller from filename when null
  date: null, // filled by caller from mtime when null
  tags: [],
  draft: false,
};

export function parsePost(rawText) {
  const text = String(rawText);

  if (!text.startsWith("---")) {
    // No frontmatter at all: treat the whole file as body, apply defaults.
    return { frontmatter: { ...DEFAULTS }, body: text.trim() };
  }

  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    return { error: "Unterminated frontmatter block" };
  }

  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\s*\n/, "");

  const frontmatter = { ...DEFAULTS };
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key === "tags") {
      frontmatter.tags = value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (key === "draft") {
      frontmatter.draft = value === "true";
    } else {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}
