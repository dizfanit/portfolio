import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { uploadLimits } from "../../../../data/uploadLimits";
import { requireAdmin, apiError, readRequestBytes } from "../../../../lib/admin-auth";
import { contentDirectory, ContentError } from "../../../../lib/content-store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    if (Number(request.headers.get("content-length")) > uploadLimits.requestBytes) throw new ContentError("Размер файла — до 50 МБ.",413);
    const bytes = await readRequestBytes(request,uploadLimits.requestBytes);
    const bounded = new Request(request.url,{method:"POST",headers:request.headers,body:bytes});
    const file = (await bounded.formData()).get("file");
    if (!(file instanceof File) || !file.size) throw new ContentError("Выберите изображение.");
    if (file.size > uploadLimits.fileBytes) throw new ContentError("Выберите изображение размером до 50 МБ.",413);
    let output: {data:Buffer; info:sharp.OutputInfo};
    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      const metadata = await sharp(bytes,{limitInputPixels:uploadLimits.inputPixels}).metadata();
      if (!["png","jpeg","webp"].includes(metadata.format || "") || (metadata.pages ?? 1) !== 1) throw new Error("Unsupported image");
      output = await sharp(bytes,{limitInputPixels:uploadLimits.inputPixels})
        .rotate()
        .resize(uploadLimits.webpDimension,uploadLimits.webpDimension,{fit:"inside",withoutEnlargement:true})
        .webp({quality:92})
        .toBuffer({resolveWithObject:true});
    } catch { throw new ContentError("Не удалось обработать изображение. Поддерживаются обычные PNG, JPG и WebP до 120 мегапикселей."); }
    const name = randomUUID() + ".webp"; const folder = path.join(contentDirectory,"media");
    await fs.mkdir(folder,{recursive:true});
    await fs.writeFile(path.join(folder,name),output.data,{flag:"wx"});
    await fs.writeFile(path.join(folder,name + ".json"),JSON.stringify({width:output.info.width,height:output.info.height}),{flag:"wx"});
    return Response.json({src:"/media/" + name,width:output.info.width,height:output.info.height,title:file.name.replace(/\.[^.]+$/,"").slice(0,200),alt:"",kind:"image"});
  } catch(error) { return apiError(error); }
}

