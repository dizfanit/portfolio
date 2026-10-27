import { promises as fs } from "node:fs";
import path from "node:path";
import { contentDirectory } from "../../../lib/content-store";
export const runtime = "nodejs";
export async function GET(_request: Request, {params}: {params:Promise<{file:string}>}) {
  const {file} = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(file)) return new Response(null,{status:404});
  try { const bytes = await fs.readFile(path.join(contentDirectory,"media",file)); return new Response(bytes,{headers:{"Content-Type":"image/webp","Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"}}); }
  catch(error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Response(null,{status:404}); throw error; }
}

