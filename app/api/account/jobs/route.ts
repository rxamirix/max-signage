import { NextResponse } from "next/server";
import { getJobsByPhone } from "@/lib/content-store";
import { getUserSession } from "@/lib/user-auth";
import {
  formatRemainingFa,
  jobProgressPercent,
  warrantyRemaining,
} from "@/lib/jobs";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await getJobsByPhone(session.phone);
  const enriched = jobs.map((job) => {
    const warranty = warrantyRemaining(job);
    return {
      ...job,
      progressPercent: jobProgressPercent(job),
      warranty: {
        ...warranty,
        remainingLabel: formatRemainingFa(warranty.remainingDays),
      },
    };
  });

  return NextResponse.json({
    user: session,
    jobs: enriched,
  });
}
