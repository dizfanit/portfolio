import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { staticWorkItems } from "../data/workItems";
import { getCaseStudy } from "../data/caseStudies";
import { adminCategories, type AdminMedia, type CaseInput, type StoredCase } from "../data/adminTypes";

export const contentDirectory = path.resolve(/* turbopackIgnore: true */ process.env.PORTFOLIO_CONTENT_DIR || path.join(process.cwd(), ".portfolio-content"));
const contentFile = path.join(contentDirectory, "cases.json");
export class ContentError extends Error { constructor(message: string, public status = 400) { super(message); } }
const globalStore = globalThis as typeof globalThis & { portfolioWriteQueue?: Promise<unknown> };

let builtIns: Promise<StoredCase[]> | undefined;
function builtInCases(): Promise<StoredCase[]> {
  // Resolve only known cover dimensions once; the original media stays in public.
  return builtIns ??= Promise.all(staticWorkItems.map(async item => {
    const study = getCaseStudy(item.slug)!;
    const src = "cover" in item ? item.cover : undefined;
    let cover: AdminMedia | null = null;
    if (src) {
      const dimensions = await sharp(path.join(/* turbopackIgnore: true */ process.cwd(), "public", src)).metadata();
      cover = { src, width: dimensions.width!, height: dimensions.height!, kind: "image", title: item.title, alt: item.title };
    }
    return {
      id: "builtin:" + item.slug, slug: item.slug, number: item.number, revision: 0,
      title: item.title, type: item.type, year: item.year, industry: item.industry,
      description: item.description, category: item.category, favorite: item.favorite,
      status: "published", singleWork: false, cover, media: study.media, sections: study.sections,
      source: "builtin", mediaLayout: study.mediaLayout, createdAt: "", updatedAt: "",
    } satisfies StoredCase;
  }));
}

export async function readCases(): Promise<StoredCase[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(contentFile, "utf8"));
    if (parsed.version !== 1 || !Array.isArray(parsed.cases)) throw new Error("Invalid content store");
    return parsed.cases.map((item: StoredCase) => ({ ...item, singleWork: item.singleWork ?? false }));
  } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
}

export async function readAdminCases(): Promise<StoredCase[]> {
  const [defaults, stored] = await Promise.all([builtInCases(), readCases()]);
  const overrides = new Map(stored.map(item => [item.id, item]));
  const defaultIds = new Set(defaults.map(item => item.id));
  return [
    ...defaults.map(item => ({ ...item, ...overrides.get(item.id), source: "builtin" as const })),
    ...stored.filter(item => !defaultIds.has(item.id)),
  ].filter(item => !item.deleted);
}

export async function publishedCases() { return (await readAdminCases()).filter(item => item.status === "published"); }
function text(value: unknown, label: string, max: number, required = true) {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new ContentError("Проверьте поле «" + label + "».");
  return value.trim();
}
function media(value: unknown, originalMedia: AdminMedia[]): AdminMedia {
  if (!value || typeof value !== "object") throw new ContentError("Добавьте изображение.");
  const m = value as AdminMedia;
  const original = originalMedia.find(image => image.src === m.src && image.width === m.width && image.height === m.height);
  if ((!original && !/^\/media\/[a-f0-9-]{36}\.webp$/.test(m.src)) || !Number.isInteger(m.width) || !Number.isInteger(m.height) || m.width < 1 || m.height < 1 || m.width > 25000 || m.height > 25000 || !["image", "website"].includes(m.kind)) throw new ContentError("Некорректное изображение.");
  return { src: m.src, width: m.width, height: m.height, kind: m.kind, title: text(m.title, "Подпись изображения", 200, false), alt: text(m.alt, "Описание изображения", 500, false) };
}
function validate(value: unknown, builtin?: StoredCase): CaseInput {
  if (!value || typeof value !== "object") throw new ContentError("Некорректные данные кейса.");
  const v = value as CaseInput;
  if (!/^\d{4}$/.test(v.year)) throw new ContentError("Год должен состоять из четырёх цифр.");
  if (!(adminCategories.some(category => category === v.category) || v.category === "Избранное") || !["draft", "published"].includes(v.status) || typeof v.favorite !== "boolean") throw new ContentError("Проверьте вкладку и статус кейса.");
  if (v.singleWork !== undefined && typeof v.singleWork !== "boolean") throw new ContentError("Проверьте формат работы.");
  if (!Array.isArray(v.media) || v.media.length > 40) throw new ContentError("Можно добавить до 40 изображений.");
  const sections = {} as StoredCase["sections"];
  for (const key of ["about", "task", "problem", "solution", "visual", "result"] as const) {
    const paragraphs = v.sections?.[key] ?? [];
    if (!Array.isArray(paragraphs) || paragraphs.length > 30) throw new ContentError("Проверьте текст кейса.");
    sections[key] = paragraphs.map(p => text(p, "Текст кейса", 10000, false)).filter(Boolean);
  }
  const originalMedia = builtin ? [...(builtin.cover ? [builtin.cover] : []), ...builtin.media] : [];
  const cover = v.cover === null && builtin && !builtin.cover ? null : media(v.cover, originalMedia);
  return {
    title: text(v.title, "Название", 120), type: text(v.type, "Тип работы", 120), year: text(v.year, "Год", 4), industry: text(v.industry, "Сфера", 160, false), description: text(v.description, "Описание", 3000),
    category: v.category, favorite: v.category === "Избранное" || v.favorite, status: v.status, singleWork: v.singleWork ?? false,
    cover, media: v.media.map(image => media(image, originalMedia)), sections, id: v.id, revision: v.revision,
  };
}
export async function saveCase(value: unknown) {
  const defaults = await builtInCases();
  const builtin = defaults.find(item => item.id === (value as CaseInput | null)?.id);
  const input = validate(value, builtin);
  const job = (globalStore.portfolioWriteQueue ?? Promise.resolve()).then(async () => {
    const items = await readCases();
    const stored = input.id ? items.find(item => item.id === input.id) : undefined;
    const existing = stored ?? builtin;
    if (input.id && (!existing || existing.deleted)) throw new ContentError("Кейс не найден.", 404);
    if (existing && input.revision !== existing.revision) throw new ContentError("Кейс изменён в другом окне. Обновите страницу и повторите изменения.", 409);
    for (const image of [...(input.cover ? [input.cover] : []), ...input.media]) {
      // Original public assets already passed the per-case allowlist above.
      if (!image.src.startsWith("/media/")) continue;
      let meta: {width: number; height: number};
      try { meta = JSON.parse(await fs.readFile(path.join(contentDirectory, "media", path.basename(image.src) + ".json"), "utf8")); }
      catch { throw new ContentError("Изображение не найдено. Загрузите его заново."); }
      if (image.width !== meta.width || image.height !== meta.height) throw new ContentError("Размеры изображения не совпадают.");
    }
    const now = new Date().toISOString(); const id = existing?.id ?? randomUUID();
    const nextNumber = Math.max(staticWorkItems.length, ...items.map(item => Number(item.number))) + 1;
    const record: StoredCase = {
      ...input, id, slug: existing?.slug ?? "case-" + id, number: existing?.number ?? String(nextNumber).padStart(3,"0"),
      revision: (existing?.revision ?? 0) + 1, createdAt: existing?.createdAt || now, updatedAt: now,
      ...(builtin ? { source: "builtin", mediaLayout: builtin.mediaLayout } : {}),
    };
    if (!record.sections.about.length) record.sections.about = [record.description];
    const next = stored ? items.map(item => item.id === id ? record : item) : [...items, record];
    await writeCases(next);
    return record;
  });
  globalStore.portfolioWriteQueue = job.catch(() => {});
  return job;
}

async function writeCases(items: StoredCase[]) {
  await fs.mkdir(contentDirectory, {recursive:true});
  const temp = contentFile + "." + randomUUID() + ".tmp";
  await fs.writeFile(temp, JSON.stringify({version:1,cases:items}, null, 2), {mode:0o600});
  await fs.rename(temp, contentFile);
}

async function changeCaseState(value: unknown, remove: boolean) {
  if (!value || typeof value !== "object") throw new ContentError("Некорректные данные кейса.");
  const input = value as { id: string; revision: number; status?: StoredCase["status"] };
  if (typeof input.id !== "string" || !input.id || input.id.length > 160 || !Number.isInteger(input.revision) || input.revision < 0) throw new ContentError("Проверьте выбранный кейс.");
  if (!remove && input.status !== "draft" && input.status !== "published") throw new ContentError("Проверьте статус кейса.");
  const defaults = await builtInCases();
  const job = (globalStore.portfolioWriteQueue ?? Promise.resolve()).then(async () => {
    const items = await readCases();
    const stored = items.find(item => item.id === input.id);
    const existing = stored ?? defaults.find(item => item.id === input.id);
    if (!existing || existing.deleted) throw new ContentError("Кейс не найден.", 404);
    if (input.revision !== existing.revision) throw new ContentError("Кейс изменён в другом окне. Обновите страницу и повторите изменения.", 409);
    const record: StoredCase = {
      ...existing, status: remove ? "draft" : input.status!, revision: existing.revision + 1,
      updatedAt: new Date().toISOString(), ...(remove ? { deleted: true } : {}),
    };
    // Keep the deletion marker so original cases cannot reappear from code defaults.
    await writeCases(stored ? items.map(item => item.id === record.id ? record : item) : [...items, record]);
    return record;
  });
  globalStore.portfolioWriteQueue = job.catch(() => {});
  return job;
}

export async function setCaseStatus(value: unknown) { return changeCaseState(value, false); }
export async function deleteCase(value: unknown) { return changeCaseState(value, true); }
