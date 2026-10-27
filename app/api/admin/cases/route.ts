import { requireAdmin, apiError, readRequestBytes } from "../../../../lib/admin-auth";
import { deleteCase, readAdminCases, saveCase, setCaseStatus } from "../../../../lib/content-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() { try { await requireAdmin(); return Response.json(await readAdminCases(),{headers:{"Cache-Control":"no-store"}}); } catch(error) { return apiError(error); } }
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = new TextDecoder().decode(await readRequestBytes(request,300000));
    return Response.json(await saveCase(JSON.parse(body)));
  } catch(error) { return apiError(error); }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin(request);
    const body = new TextDecoder().decode(await readRequestBytes(request, 2000));
    return Response.json(await setCaseStatus(JSON.parse(body)));
  } catch(error) { return apiError(error); }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin(request);
    const body = new TextDecoder().decode(await readRequestBytes(request, 2000));
    const removed = await deleteCase(JSON.parse(body));
    return Response.json({ id: removed.id });
  } catch(error) { return apiError(error); }
}

