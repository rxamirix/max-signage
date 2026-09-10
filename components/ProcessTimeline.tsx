"use client";

import { Award, Briefcase, Check, FileText, MapPin } from "lucide-react";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { processSteps } from "@/lib/content";

const icons = [
  <MapPin key="visit" className="h-3 w-3" />,
  <Award key="design" className="h-3 w-3" />,
  <FileText key="contract" className="h-3 w-3" />,
  <Briefcase key="build" className="h-3 w-3" />,
  <Check key="deliver" className="h-3 w-3" />,
];

const statuses = ["completed", "completed", "active", "pending", "pending"] as const;

export function ProcessTimeline({
  className,
  variant = "spacious",
}: {
  className?: string;
  variant?: "default" | "compact" | "spacious";
}) {
  const items: TimelineItem[] = processSteps.map((step, index) => ({
    id: step.step,
    title: step.title,
    description: step.description,
    timestamp: step.duration,
    status: statuses[index] ?? "pending",
    icon: icons[index],
    content: (
      <div className="rounded-md bg-muted p-3 text-sm">
        <p className="font-medium">{step.note}</p>
      </div>
    ),
  }));

  return (
    <Timeline
      items={items}
      variant={variant}
      timestampPosition="top"
      className={className}
    />
  );
}
