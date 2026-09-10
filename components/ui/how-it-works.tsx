import React from "react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  duration?: string;
  note?: string;
  className?: string;
  rotate?: string;
}

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 8v4.2l2.4 1.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  duration,
  note,
  className,
  rotate,
}: CardProps) => {
  return (
    <div
      className={`relative w-[78%] max-w-[17rem] md:w-[300px] md:max-w-none ${rotate ?? ""} ${className ?? ""}`}
    >
      <div className="rounded-2xl border border-navy-200 bg-white p-3 shadow-[0_10px_24px_rgba(20,22,63,0.12)] ring-1 ring-navy-100 md:rounded-[25px] md:p-4 md:shadow-[0_12px_32px_rgba(20,22,63,0.14)]">
        <Pin className="mx-auto mb-3 h-5 w-5 text-navy-600 md:mb-6 md:h-8 md:w-8" />
        <div className="flex flex-col antialiased">
          <div className="mb-2 flex items-start justify-between gap-2 md:mb-4">
            <span className="text-2xl font-extrabold text-navy-800 md:text-4xl">
              {number}
            </span>
            {duration ? (
              <span className="inline-flex max-w-[58%] items-center gap-1 rounded-full border border-navy-100 bg-navy-50 px-2 py-0.5 text-[9px] font-bold leading-tight text-navy-800 md:max-w-none md:px-2.5 md:py-1 md:text-[11px]">
                <ClockIcon className="size-3 shrink-0 text-navy-600 md:size-3.5" />
                <span className="truncate">{duration}</span>
              </span>
            ) : null}
          </div>
          <h3 className="mb-1 text-base leading-snug font-semibold text-navy-800 md:mb-[10px] md:text-2xl">
            {title}
          </h3>
          <p className="line-clamp-2 text-xs leading-5 text-navy-700 md:line-clamp-none md:text-sm md:leading-7">
            {description}
          </p>
          {note ? (
            <p className="mt-2 border-t border-navy-100 pt-2 text-[10px] font-bold leading-4 text-navy-700 md:mt-4 md:pt-3 md:text-xs md:leading-normal">
              {note}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  duration?: string;
  note?: string;
  colorTheme?: "orange" | "blue" | "purple";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  {
    className:
      "relative z-[1] mr-auto ml-1 md:absolute md:top-0 md:left-[15%] md:mx-0 md:z-auto",
    rotate: "rotate-3 md:rotate-8",
  },
  {
    className:
      "relative z-[2] mt-5 ml-auto mr-1 md:absolute md:top-[120px] md:right-[15%] md:mt-0 md:mx-0 md:z-auto",
    rotate: "-rotate-3 md:-rotate-8",
  },
  {
    className:
      "relative z-[3] mt-5 mr-auto ml-1 md:absolute md:top-[450px] md:left-[15%] md:mt-0 md:mx-0 md:z-auto",
    rotate: "rotate-3 md:rotate-8",
  },
  {
    className:
      "relative z-[4] mt-5 ml-auto mr-1 md:absolute md:top-[570px] md:right-[10%] md:mt-0 md:mx-0 md:z-auto",
    rotate: "-rotate-3 md:-rotate-8",
  },
  {
    className:
      "relative z-[5] mt-5 mr-auto ml-1 md:absolute md:top-[875px] md:left-[15%] md:mt-0 md:mx-0 md:z-auto",
    rotate: "rotate-3 md:rotate-8",
  },
];

function pathForCount(count: number) {
  return Array.from({ length: Math.max(count - 1, 0) }, (_, index) => {
    if (index === 0) return "M 290 150 C 500 150, 550 270, 710 270";
    if (index === 1) return "C 850 270, 500 350, 290 450";
    if (index === 2) return "C 290 600, 550 720, 750 720";
    if (index === 3) return "C 950 720, 500 820, 290 875";
    return "";
  }).join(" ");
}

function mobilePathForCount(count: number) {
  // Percentage viewBox 0–100: snakes between left (~22) and right (~78) columns
  if (count < 2) return "";
  const midY = (i: number) => ((i + 0.5) / count) * 100;
  let d = `M 22 ${midY(0)}`;
  for (let i = 0; i < count - 1; i++) {
    const fromLeft = i % 2 === 0;
    const x0 = fromLeft ? 22 : 78;
    const x1 = fromLeft ? 78 : 22;
    const y0 = midY(i);
    const y1 = midY(i + 1);
    const cy = (y0 + y1) / 2;
    d += ` C ${x0} ${cy}, ${x1} ${cy}, ${x1} ${y1}`;
  }
  return d;
}

export default function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Create Account",
      description:
        "Sign up in minutes. Enter your details and verify your email to get started.",
      colorTheme: "orange",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  let height = 1130;
  if (data.length === 1) height = 400;
  else if (data.length === 2) height = 450;
  else if (data.length === 3) height = 800;
  else if (data.length === 4) height = 1100;
  else height = 1320;

  const pathD = pathForCount(data.length);
  const mobilePathD = mobilePathForCount(data.length);

  return (
    <div
      className={`relative bg-white px-4 max-md:pt-10 max-md:pb-10 md:px-8 md:pt-20 md:pb-10 ${className ?? ""}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div
          className="relative mx-auto flex h-auto w-full max-w-[1000px] flex-col space-y-0 px-2 md:block md:h-[var(--md-height)] md:space-y-0 md:px-0"
          style={{ "--md-height": `${height}px` } as React.CSSProperties}
        >
          {data.length > 1 ? (
            <>
              {/* Mobile thread — same dashed “string” idea as desktop */}
              <svg
                className="pointer-events-none absolute inset-0 z-0 h-full w-full md:hidden"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={mobilePathD}
                  stroke="currentColor"
                  className="animate-how-it-works-dash text-navy-400"
                  strokeWidth="1.25"
                  strokeDasharray="4 3.5"
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Desktop ribbon */}
              <svg
                className="pointer-events-none absolute top-0 left-0 z-0 hidden h-full w-full md:block"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                <path
                  d={pathD}
                  stroke="currentColor"
                  className="animate-how-it-works-dash text-black"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </>
          ) : null}

          {data.map((step, index) => {
            const position = positions[index % positions.length];
            return (
              <Card
                key={step.title}
                number={`0${index + 1}`}
                title={step.title}
                description={step.description}
                duration={step.duration}
                note={step.note}
                rotate={position.rotate}
                className={position.className}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
