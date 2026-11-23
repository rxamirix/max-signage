import React from "react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration?: string;
  note?: string;
  className?: string;
  rotate?: string;
  index: number;
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

function Pictogram({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="mx-auto h-12 w-12 object-contain md:h-16 md:w-16"
    />
  );
}

const STEP_ICONS = [
  <Pictogram key="phone" src="/process/step-phone.png" alt="" />,
  <Pictogram key="design" src="/process/step-3d.png" alt="" />,
  <Pictogram key="contract" src="/process/step-contract.svg" alt="" />,
  <Pictogram key="build" src="/process/step-gears.png" alt="" />,
  <Pictogram key="install" src="/process/step-install.svg" alt="" />,
];

function iconForStep(title: string, index: number) {
  if (title.includes("قرارداد")) return STEP_ICONS[2];
  if (title.includes("تحویل") || title.includes("نصب")) return STEP_ICONS[4];
  return STEP_ICONS[index % STEP_ICONS.length];
}

const Card = ({
  icon,
  title,
  description,
  duration,
  note,
  className,
  rotate,
  index,
}: CardProps) => {
  return (
    <div
      className={`process-step-wrap relative w-[78%] max-w-[17rem] md:w-[300px] md:max-w-none ${rotate ?? ""} ${className ?? ""}`}
    >
      <div className="process-step-card relative rounded-[24px] border border-white/90 bg-white/95 p-4 md:rounded-[30px] md:p-5">
        <span className="process-step-number absolute top-4 right-4 text-xs font-bold tabular-nums text-navy-500">{String(index + 1).padStart(2, '0')}</span>
        <div className="process-step-icon mb-3 flex justify-center md:mb-4"><div className={index === 4 ? "grid size-20 place-items-center rounded-[22px] bg-[#fff9dc] md:size-24" : "grid size-20 place-items-center rounded-[22px] bg-navy-50 md:size-24"}>{icon}</div></div>
        <div className="process-step-copy flex flex-col antialiased">
          <h3 className="mb-1 text-base leading-snug font-extrabold text-[#25252c] md:mb-[10px] md:text-xl">
            {title}
          </h3>
          <p className="process-step-description text-xs leading-6 text-[#5d5c66] md:text-sm md:leading-7">
            {description}
          </p>
          {note ? (
            <p className="process-step-note mt-3 border-t border-[#ecebe5] pt-3 text-[10px] font-bold leading-5 text-navy-700 md:mt-4 md:text-xs md:leading-normal">
              {note}
            </p>
          ) : null}
        </div>
      </div>
      {duration ? (
        <div className="process-step-duration mt-2 flex justify-center md:mt-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-navy-100 bg-white px-2.5 py-1 text-[10px] font-bold leading-tight text-navy-700 shadow-sm md:px-3 md:text-xs">
            <ClockIcon className="size-3 shrink-0 text-navy-600 md:size-3.5" />
            <span>{duration}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
};

export interface Step {
  image?: string;
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

  const data = features ?? defaultFeatures;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;
  if (data.length === 0) return null;
  if (data.length > positions.length) {
    return <div className="container-page grid grid-cols-2 gap-4 py-8 lg:grid-cols-3">
      {data.map((step, index) => <Card key={`${step.title}-${index}`} index={index} icon={step.image ? <Pictogram src={step.image} alt="" /> : iconForStep(step.title, index)} title={step.title} description={step.description} duration={step.duration} note={step.note} className="!w-full !max-w-none" />)}
    </div>;
  }

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
      className={`process-layout relative px-4 max-md:pt-10 max-md:pb-10 md:px-8 md:pt-20 md:pb-10 ${className ?? ""}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div
          className="process-timeline relative mx-auto flex h-auto w-full max-w-[1000px] flex-col space-y-0 px-2 md:block md:h-[var(--md-height)] md:space-y-0 md:px-0"
          style={{ "--md-height": `${height}px` } as React.CSSProperties}
        >
          {data.length > 1 ? (
            <>
              {/* Mobile thread — same dashed “string” idea as desktop */}
              <svg
                className="process-mobile-path pointer-events-none absolute inset-0 z-0 h-full w-full md:hidden"
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
                  className="animate-how-it-works-dash text-navy-400"
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
                index={index}
                icon={step.image ? <Pictogram src={step.image} alt="" /> : iconForStep(step.title, index)}
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
