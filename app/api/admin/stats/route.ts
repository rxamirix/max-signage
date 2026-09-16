import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/content-store";

export async function GET() {
  const stats = await getDashboardStats();
  return NextResponse.json({ data: stats });
}
