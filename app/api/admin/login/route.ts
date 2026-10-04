import { NextResponse } from "next/server";
import {
  createAdminToken,
  setAdminSessionCookie,
  verifyAdminLogin,
} from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const row = attempts.get(ip);
  if (!row || row.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (row.count >= 20) return false;
  row.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "تعداد تلاش بیش از حد. کمی بعد دوباره امتحان کنید." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const username = String(body?.username || "");
  const password = String(body?.password || "");

  const ok = await verifyAdminLogin(username, password);
  if (!ok) {
    return NextResponse.json(
      { error: "نام کاربری یا رمز عبور اشتباه است" },
      { status: 401 },
    );
  }

  const token = await createAdminToken(username);
  await setAdminSessionCookie(token);
  return NextResponse.json({ ok: true, username });
}
