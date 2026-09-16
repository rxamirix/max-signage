import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

type OtpRecord = {
  phone: string;
  codeHash: string;
  expiresAt: number;
  verified: boolean;
};

const OTP_FILE = path.join(process.cwd(), "data", "otp.json");
const TTL_MS = 5 * 60 * 1000;

function hashCode(phone: string, code: string) {
  return crypto
    .createHash("sha256")
    .update(`${phone}:${code}`)
    .digest("hex");
}

async function readStore(): Promise<Record<string, OtpRecord>> {
  try {
    const raw = await fs.readFile(OTP_FILE, "utf8");
    return JSON.parse(raw) as Record<string, OtpRecord>;
  } catch {
    return {};
  }
}

async function writeStore(store: Record<string, OtpRecord>) {
  await fs.mkdir(path.dirname(OTP_FILE), { recursive: true });
  await fs.writeFile(OTP_FILE, JSON.stringify(store, null, 2), "utf8");
}

export function normalizePhone(input: string) {
  return String(input || "").replace(/[^\d]/g, "").slice(0, 11);
}

export function isValidMobile(phone: string) {
  return /^09\d{9}$/.test(phone);
}

export async function createOtp(phone: string) {
  const code = String(Math.floor(10000 + Math.random() * 90000));
  const store = await readStore();
  store[phone] = {
    phone,
    codeHash: hashCode(phone, code),
    expiresAt: Date.now() + TTL_MS,
    verified: false,
  };
  await writeStore(store);

  // بدون کلید پیامک واقعی، کد فقط در حالت توسعه برمی‌گردد
  const smsConfigured = Boolean(process.env.SMS_API_KEY);
  if (smsConfigured) {
    await sendSms(phone, code);
  }

  return {
    code: smsConfigured ? undefined : code,
    smsConfigured,
  };
}

async function sendSms(phone: string, code: string) {
  const apiKey = process.env.SMS_API_KEY;
  const template = process.env.SMS_OTP_TEMPLATE || "verify";
  if (!apiKey) return;

  // Kavenegar lookup (optional)
  const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`;
  const body = new URLSearchParams({
    receptor: phone,
    token: code,
    template,
  });
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => {
    // ignore network errors; caller still has OTP stored
  });
}

export async function verifyOtp(phone: string, code: string) {
  const store = await readStore();
  const record = store[phone];
  if (!record) return false;
  if (record.expiresAt < Date.now()) return false;
  if (record.codeHash !== hashCode(phone, code.trim())) return false;
  store[phone] = { ...record, verified: true };
  await writeStore(store);
  return true;
}

export async function isPhoneVerified(phone: string) {
  const store = await readStore();
  const record = store[phone];
  if (!record) return false;
  if (record.expiresAt < Date.now()) return false;
  return record.verified;
}
