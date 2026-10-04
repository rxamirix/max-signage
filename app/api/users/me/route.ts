import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";

export async function GET() {
  const user = await getUserSession();
  return NextResponse.json({ user });
}
