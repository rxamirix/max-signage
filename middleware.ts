import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE, USER_COOKIE } from "@/lib/auth-cookies";

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

async function isAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

async function isUser(request: NextRequest) {
  const token = request.cookies.get(USER_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "user";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginApi = pathname === "/api/admin/login";

  if (isLogin || isLoginApi) {
    if (isLogin && (await isAdmin(request))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminPage || isAdminApi) {
    if (!(await isAdmin(request))) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/account")) {
    if (!(await isUser(request))) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account", "/account/:path*"],
};
