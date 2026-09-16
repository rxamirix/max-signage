import { NextResponse } from "next/server";
import { upsertUser } from "@/lib/content-store";
import { isPhoneVerified, isValidMobile, normalizePhone } from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const phone = normalizePhone(body.phone);
  const source =
    body.source === "quote"
      ? "quote"
      : body.source === "other"
        ? "other"
        : "login";

  if (name.length < 2 || !isValidMobile(phone)) {
    return NextResponse.json(
      { error: "نام و شماره موبایل معتبر نیست" },
      { status: 400 },
    );
  }

  const verified = await isPhoneVerified(phone);
  if (!verified) {
    return NextResponse.json(
      { error: "شماره موبایل تأیید نشده است" },
      { status: 403 },
    );
  }

  const { user, isNew } = await upsertUser({ name, phone, source });
  return NextResponse.json({ ok: true, user, isNew });
}
