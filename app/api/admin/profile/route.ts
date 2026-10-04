import { NextResponse } from "next/server";
import {
  createAdminToken,
  getAdminSession,
  getAdminUsername,
  setAdminSessionCookie,
  updateAdminAccount,
} from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const username = await getAdminUsername();
  return NextResponse.json({ username });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const action = String(body?.action || "");
  const currentPassword = String(body?.currentPassword || "");

  if (!currentPassword) {
    return NextResponse.json(
      { error: "رمز فعلی الزامی است" },
      { status: 400 },
    );
  }

  if (action === "username") {
    const username = String(body?.username || "").trim();
    if (!username) {
      return NextResponse.json(
        { error: "نام کاربری جدید را وارد کنید" },
        { status: 400 },
      );
    }
    const result = await updateAdminAccount({
      currentPassword,
      username,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const token = await createAdminToken(result.username);
    await setAdminSessionCookie(token);
    return NextResponse.json({ ok: true, username: result.username });
  }

  if (action === "password") {
    const newPassword = String(body?.newPassword || "");
    const confirmPassword = String(body?.confirmPassword || "");
    if (!newPassword) {
      return NextResponse.json(
        { error: "رمز جدید را وارد کنید" },
        { status: 400 },
      );
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "تکرار رمز جدید یکسان نیست" },
        { status: 400 },
      );
    }
    const result = await updateAdminAccount({
      currentPassword,
      newPassword,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const token = await createAdminToken(result.username);
    await setAdminSessionCookie(token);
    return NextResponse.json({ ok: true, username: result.username });
  }

  return NextResponse.json(
    { error: "نوع تغییر نامعتبر است" },
    { status: 400 },
  );
}
