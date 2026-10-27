import { NextResponse } from "next/server";
import { authConfig, allowSetup, checkOrigin, isAdmin, makeSession, setupPassword, verifyPassword, apiError, sessionCookie, readRequestBytes } from "../../../../lib/admin-auth";
import { ContentError } from "../../../../lib/content-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try { return Response.json({configured:!!await authConfig(), authenticated:await isAdmin(), canSetup:allowSetup(request)},{headers:{"Cache-Control":"no-store"}}); }
  catch(error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (Number(request.headers.get("content-length")) > 2048) throw new ContentError("Запрос слишком большой.",413);
    const {password,setup} = JSON.parse(new TextDecoder().decode(await readRequestBytes(request,2048)));
    let config = await authConfig();
    if (!config) {
      if (!setup || !allowSetup(request)) throw new ContentError("Сначала задайте пароль локально.",403);
      config = await setupPassword(password);
    } else if (!await verifyPassword(password,config)) throw new ContentError("Неверный пароль.",401);
    const response = NextResponse.json({authenticated:true});
    response.cookies.set(sessionCookie,makeSession(config),{httpOnly:true,sameSite:"strict",secure:new URL(request.url).protocol === "https:",path:"/",maxAge:8*3600});
    return response;
  } catch(error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try { checkOrigin(request); const response = NextResponse.json({authenticated:false}); response.cookies.set(sessionCookie,"",{httpOnly:true,sameSite:"strict",path:"/",maxAge:0}); return response; }
  catch(error) { return apiError(error); }
}

