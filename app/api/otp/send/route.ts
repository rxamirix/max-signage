import { NextResponse } from "next/server";
import {
  createOtp,
  isValidMobile,
  normalizePhone,
} from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = normalizePhone(body?.phone);
  if (!isValidMobile(phone)) {
    return NextResponse.json(
      { error: "شماره موبایل معتبر نیست" },
      { status: 400 },
    );
  }

  const result = await createOtp(phone);
  return NextResponse.json({
    ok: true,
    // فقط وقتی پیامک واقعی تنظیم نشده، برای تست محلی نمایش داده می‌شود
    ...(result.code ? { debugCode: result.code } : {}),
    smsConfigured: result.smsConfigured,
  });
}
