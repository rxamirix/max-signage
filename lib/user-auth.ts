import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { USER_COOKIE } from "@/lib/auth-cookies";

export { USER_COOKIE };
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.ADMIN_SECRET || process.env.USER_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(secret);
}

export type UserSession = {
  phone: string;
  name: string;
};

export async function createUserToken(session: UserSession) {
  return new SignJWT({ role: "user", phone: session.phone, name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyUserToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.role !== "user" ||
      typeof payload.phone !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return { phone: payload.phone, name: payload.name };
  } catch {
    return null;
  }
}

export async function getUserSession() {
  const jar = await cookies();
  const token = jar.get(USER_COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function setUserSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(USER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearUserSessionCookie() {
  const jar = await cookies();
  jar.set(USER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export { MAX_AGE as USER_SESSION_MAX_AGE };
