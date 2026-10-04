import { NextResponse } from "next/server";
import { ensureDemoJob, upsertUser } from "@/lib/content-store";
import {
  createUserToken,
  setUserSessionCookie,
} from "@/lib/user-auth";

/** Demo credentials for client preview — not for production SMS. */
export const DEMO_PHONE = "09121234567";
export const DEMO_NAME = "کاربر آزمایشی";

export async function POST() {
  const { user } = await upsertUser({
    name: DEMO_NAME,
    phone: DEMO_PHONE,
    source: "other",
  });
  await ensureDemoJob(DEMO_PHONE, DEMO_NAME);

  const token = await createUserToken({
    phone: user.phone,
    name: user.name,
  });
  await setUserSessionCookie(token);

  return NextResponse.json({
    ok: true,
    user,
    demo: true,
    hint: {
      name: DEMO_NAME,
      phone: DEMO_PHONE,
    },
  });
}
