"use client";

import React from "react";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
}

// Glass Effect Wrapper Component
export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden text-black cursor-pointer transition-all duration-700 ${className}`}
      style={glassStyle}
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit rounded-3xl"
        style={{
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-inherit"
        style={{ background: "rgba(255, 255, 255, 0.25)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-inherit rounded-3xl overflow-hidden"
        style={{
          boxShadow:
            "inset 0 0 0 0.5px rgba(255, 255, 255, 0.55), inset 1px 1px 0 0 rgba(255, 255, 255, 0.35), inset -1px -1px 0 0 rgba(255, 255, 255, 0.2)",
        }}
      />

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl p-3 hover:p-4 hover:rounded-4xl"
  >
    <div className="flex items-center justify-center gap-2 rounded-3xl p-3 py-0 px-0.5 overflow-hidden">
      {icons.map((icon, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={icon.src}
          alt={icon.alt}
          className="w-16 h-16 transition-all duration-700 hover:scale-110 cursor-pointer"
          style={{
            transformOrigin: "center center",
            transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          }}
          onClick={icon.onClick}
        />
      ))}
    </div>
  </GlassEffect>
);

// Button Component
export const GlassButton: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl px-10 py-6 hover:px-11 hover:py-7 hover:rounded-4xl overflow-hidden"
  >
    <div
      className="transition-all duration-700 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      {children}
    </div>
  </GlassEffect>
);

// SVG Filter Component
export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }} aria-hidden="true">
    <filter
      id="glass-distortion"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
      filterUnits="objectBoundingBox"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.008 0.008"
        numOctaves="2"
        seed="17"
        result="turbulence"
      />
      <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="28"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />
      <feGaussianBlur in="displaced" stdDeviation="0.4" />
    </filter>
  </svg>
);

// Main Component
export const Component = () => {
  const dockIcons: DockIcon[] = [
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&h=128&q=80",
      alt: "Claude",
    },
    {
      src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=128&h=128&q=80",
      alt: "Finder",
    },
    {
      src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=128&h=128&q=80",
      alt: "Chatgpt",
    },
    {
      src: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=128&h=128&q=80",
      alt: "Maps",
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=128&h=128&q=80",
      alt: "Safari",
    },
    {
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=128&h=128&q=80",
      alt: "Steam",
    },
  ];

  return (
    <div
      className="min-h-screen h-full flex items-center justify-center font-light relative overflow-hidden w-full"
      style={{
        background: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80") center center / cover`,
        animation: "moveBackground 60s linear infinite",
      }}
    >
      <style>{`
        @keyframes moveBackground {
          0% { background-position: 0 0; }
          to { background-position: 0 -1000%; }
        }
      `}</style>
      <GlassFilter />

      <div className="flex flex-col gap-6 items-center justify-center w-full">
        <GlassDock icons={dockIcons} />

        <GlassButton>
          <div className="text-xl text-white">
            <p>How can i help you today?</p>
          </div>
        </GlassButton>
      </div>
    </div>
  );
};

export default Component;
