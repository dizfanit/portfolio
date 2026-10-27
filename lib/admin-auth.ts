import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ContentError, contentDirectory } from "./content-store";
const scrypt = promisify(scryptCallback);
const authFile = path.join(contentDirectory, "admin.json");
type Auth = { salt: string; hash: string; secret: string };
export const sessionCookie = "portfolio_admin";
export async function authConfig(): Promise<Auth | null> {
  try { return JSON.parse(await fs.readFile(authFile,"utf8")); }
  catch(error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).protocol + "//" + request.headers.get("host");
  if (!origin || origin !== expected) throw new ContentError("Запрос должен быть отправлен со страницы админки.",403);
}
export function allowSetup(request: Request) {
  const url = new URL(request.url);
  return process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && (request.headers.get("x-forwarded-for") || "127.0.0.1").split(",").every(ip => ["127.0.0.1","::1","::ffff:127.0.0.1"].includes(ip.trim()));
}
export async function setupPassword(password: string) {
  if (typeof password !== "string" || password.length < 10 || password.length > 200) throw new ContentError("Пароль должен содержать от 10 до 200 символов.");
  const salt = randomBytes(32).toString("hex");
  const hash = (await scrypt(password, salt, 64) as Buffer).toString("hex");
  const config = {salt,hash,secret:randomBytes(32).toString("hex")};
  await fs.mkdir(contentDirectory,{recursive:true});
  try { await fs.writeFile(authFile,JSON.stringify(config),{flag:"wx",mode:0o600}); }
  catch(error) { if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new ContentError("Пароль уже задан. Войдите в админку.",409); throw error; }
  return config;
}
const globalAuth = globalThis as typeof globalThis & { portfolioLoginAttempts?: {count:number; reset:number} };
export async function verifyPassword(password: unknown, config: Auth) {
  const now = Date.now();
  const attempt = globalAuth.portfolioLoginAttempts;
  if (attempt && attempt.reset > now && attempt.count >= 8) throw new ContentError("Слишком много попыток. Повторите через 15 минут.",429);
  if (!attempt || attempt.reset <= now) globalAuth.portfolioLoginAttempts = {count:0,reset:now + 15*60*1000};
  globalAuth.portfolioLoginAttempts!.count++;
  if (typeof password !== "string" || password.length > 200) return false;
  const actual = await scrypt(password,config.salt,64) as Buffer;
  const ok = timingSafeEqual(actual,Buffer.from(config.hash,"hex"));
  if (ok) globalAuth.portfolioLoginAttempts = {count:0,reset:0};
  return ok;
}
export function makeSession(config: Auth) {
  const payload = Math.floor(Date.now()/1000 + 8*3600) + "." + randomBytes(16).toString("hex");
  return payload + "." + createHmac("sha256",config.secret).update(payload).digest("hex");
}
export async function isAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^\d+\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(token)) return false;
  const config = await authConfig(); if (!config) return false;
  const [expiry,nonce,signature] = token.split(".");
  if (Number(expiry) < Date.now()/1000) return false;
  const expected = createHmac("sha256",config.secret).update(expiry + "." + nonce).digest();
  return timingSafeEqual(expected,Buffer.from(signature,"hex"));
}
export async function requireAdmin(request?: Request) {
  if (request) checkOrigin(request);
  if (!await isAdmin()) throw new ContentError("Войдите в админку.",401);
}
export function apiError(error: unknown) {
  if (error instanceof SyntaxError) return Response.json({error:"Некорректные данные запроса."},{status:400});
  if (error instanceof ContentError) return Response.json({error:error.message},{status:error.status});
  console.error("Admin request failed",error);
  return Response.json({error:"Не удалось выполнить действие. Повторите попытку."},{status:500});
}


export async function readRequestBytes(request: Request, maxBytes: number) {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new ContentError("Запрос слишком большой.",413);
  const reader = request.body?.getReader(); if (!reader) return new Uint8Array();
  const parts: Uint8Array[] = []; let length=0;
  try {
    while (true) {
      const {done,value} = await reader.read(); if(done) break;
      length += value.byteLength; if(length>maxBytes) {await reader.cancel();throw new ContentError("Запрос слишком большой.",413);}
      parts.push(value);
    }
  } finally {reader.releaseLock();}
  const bytes = new Uint8Array(length); let offset=0;
  for(const part of parts) {bytes.set(part,offset);offset+=part.length;}
  return bytes;
}
