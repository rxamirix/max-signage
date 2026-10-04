import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth-cookies";

export { ADMIN_COOKIE };
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const CREDENTIALS_PATH = path.join(process.cwd(), "data", "admin.json");

type StoredAdmin = {
  username: string;
  /** scrypt salt:hash hex */
  passwordHash: string;
  updatedAt: string;
};

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(secret);
}

export function getEnvAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "max-admin-change-me",
  };
}

/** @deprecated prefer getEnvAdminCredentials / verifyAdminLogin */
export function getAdminCredentials() {
  return getEnvAdminCredentials();
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPasswordHash(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(password, salt, 64);
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

async function readStoredAdmin(): Promise<StoredAdmin | null> {
  try {
    const raw = await fs.readFile(CREDENTIALS_PATH, "utf8");
    const data = JSON.parse(raw) as StoredAdmin;
    if (!data?.username || !data?.passwordHash) return null;
    return data;
  } catch {
    return null;
  }
}

async function writeStoredAdmin(data: StoredAdmin) {
  await fs.mkdir(path.dirname(CREDENTIALS_PATH), { recursive: true });
  await fs.writeFile(
    CREDENTIALS_PATH,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

export async function getAdminUsername() {
  const stored = await readStoredAdmin();
  if (stored) return stored.username;
  return getEnvAdminCredentials().username;
}

export async function verifyAdminLogin(username: string, password: string) {
  const stored = await readStoredAdmin();
  if (stored) {
    if (username !== stored.username) return false;
    return verifyPasswordHash(password, stored.passwordHash);
  }
  const env = getEnvAdminCredentials();
  return username === env.username && password === env.password;
}

export async function updateAdminAccount(input: {
  currentPassword: string;
  username?: string;
  newPassword?: string;
}) {
  const currentUsername = await getAdminUsername();
  const passwordOk = await verifyAdminLogin(
    currentUsername,
    input.currentPassword,
  );
  if (!passwordOk) {
    return { ok: false as const, error: "رمز فعلی اشتباه است" };
  }

  const nextUsername =
    input.username !== undefined
      ? input.username.trim().slice(0, 64)
      : currentUsername;

  if (nextUsername.length < 3) {
    return { ok: false as const, error: "نام کاربری حداقل ۳ کاراکتر باشد" };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(nextUsername)) {
    return {
      ok: false as const,
      error: "نام کاربری فقط حروف انگلیسی، عدد و ._- باشد",
    };
  }

  const stored = await readStoredAdmin();
  let passwordHash = stored?.passwordHash;

  if (input.newPassword !== undefined && input.newPassword.length > 0) {
    if (input.newPassword.length < 8) {
      return { ok: false as const, error: "رمز جدید حداقل ۸ کاراکتر باشد" };
    }
    passwordHash = hashPassword(input.newPassword);
  } else if (!passwordHash) {
    passwordHash = hashPassword(input.currentPassword);
  }

  await writeStoredAdmin({
    username: nextUsername,
    passwordHash,
    updatedAt: new Date().toISOString(),
  });

  return { ok: true as const, username: nextUsername };
}

export async function createAdminToken(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || typeof payload.username !== "string") {
      return null;
    }
    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function setAdminSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export { MAX_AGE as ADMIN_SESSION_MAX_AGE };
