import { NextResponse } from "next/server";
import type { Lead } from "@/lib/content-store";
import { getLeads, writeCollection } from "@/lib/content-store";
import { isPhoneVerified, normalizePhone } from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const phone = normalizePhone(body.phone);
  if (name.length < 2 || !/^09\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  }

  const verified = await isPhoneVerified(phone);
  if (!verified) {
    return NextResponse.json({ error: "شماره تأیید نشده" }, { status: 403 });
  }

  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    phone,
    city: String(body.city || "").trim().slice(0, 60),
    service: String(body.service || "").trim().slice(0, 80),
    size: String(body.size || "").trim().slice(0, 120),
    note: String(body.note || "").trim().slice(0, 500),
    createdAt: new Date().toISOString(),
  };

  const leads = await getLeads();
  leads.unshift(lead);
  await writeCollection("leads", leads.slice(0, 500));

  return NextResponse.json({ ok: true, id: lead.id });
}
