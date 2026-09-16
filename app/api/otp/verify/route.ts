import { NextResponse } from "next/server";
import {
  isValidMobile,
  normalizePhone,
  verifyOtp,
} from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = normalizePhone(body?.phone);
  const code = String(body?.code || "").trim();
  if (!isValidMobile(phone) || code.length < 4) {
    return NextResponse.json({ error: "کد نامعتبر است" }, { status: 400 });
  }

  const ok = await verifyOtp(phone, code);
  if (!ok) {
    return NextResponse.json(
      { error: "کد اشتباه یا منقضی شده است" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
