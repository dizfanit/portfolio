// Export only public case content. Passwords, drafts and unused uploads stay local.
const fs = require("node:fs/promises");
const path = require("node:path");

const contentDir = path.resolve(process.env.PORTFOLIO_CONTENT_DIR || ".portfolio-content");
const sourceFile = path.join(contentDir, "cases.json");
const snapshotFile = path.join(__dirname, "../data/publishedCases.json");
const publicMediaDir = path.join(__dirname, "../public/published-media");
const localMediaName = /^\/media\/([a-f0-9-]{36}\.webp)$/;
const exportedMediaName = /^\/published-media\/([a-f0-9-]{36}\.webp)$/;

async function main() {
  const sourceBytes = await fs.readFile(sourceFile);
  const source = JSON.parse(sourceBytes.toString("utf8"));
  if (source.version !== 1 || !Array.isArray(source.cases)) throw new Error("Invalid local content store");

  const files = new Set();
  const ids = new Set();
  const exportMedia = (media) => {
    if (!media) return null;
    const match = localMediaName.exec(media.src);
    if (match) {
      files.add(match[1]);
      return { ...media, src: "/published-media/" + match[1] };
    }
    if (!media.src.startsWith("/") || media.src.startsWith("//") || media.src.includes("..") || media.src.startsWith("/media/")) {
      throw new Error("Unsupported media path: " + media.src);
    }
    return media;
  };

  const cases = [];
  const hiddenBuiltIns = [];
  for (const item of source.cases) {
    if (typeof item.id !== "string" || ids.has(item.id)) throw new Error("Duplicate or invalid case ID");
    ids.add(item.id);
    if (item.status !== "published" || item.deleted) {
      if (item.id.startsWith("builtin:")) hiddenBuiltIns.push({ id: item.id, status: "draft", deleted: Boolean(item.deleted) });
      continue;
    }
    const {
      id, slug, number, revision, title, type, year, industry, description,
      category, favorite, singleWork, sections, source: caseSource, mediaLayout,
      createdAt, updatedAt,
    } = item;
    cases.push({
      id, slug, number, revision, title, type, year, industry, description,
      category, favorite, status: "published", singleWork: Boolean(singleWork),
      cover: exportMedia(item.cover), media: (item.media || []).map(exportMedia),
      sections, ...(caseSource === "builtin" ? { source: "builtin" } : {}),
      ...(mediaLayout === "pages" ? { mediaLayout: "pages" } : {}),
      createdAt, updatedAt,
    });
  }

  await fs.mkdir(publicMediaDir, { recursive: true });
  for (const name of files) {
    await fs.copyFile(path.join(contentDir, "media", name), path.join(publicMediaDir, name));
  }
  if (!(await fs.readFile(sourceFile)).equals(sourceBytes)) throw new Error("Content changed during export; run again");

  // Remove only files referenced by the previous export and no longer published.
  const previous = JSON.parse(await fs.readFile(snapshotFile, "utf8"));
  for (const item of previous.cases || []) {
    for (const media of [item.cover, ...(item.media || [])]) {
      const name = media && exportedMediaName.exec(media.src)?.[1];
      if (name && !files.has(name)) await fs.unlink(path.join(publicMediaDir, name)).catch(error => {
        if (error.code !== "ENOENT") throw error;
      });
    }
  }

  await fs.writeFile(snapshotFile, JSON.stringify({ cases, hiddenBuiltIns }, null, 2) + "\n");
  console.log("Exported " + cases.length + " published cases and " + files.size + " images.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
