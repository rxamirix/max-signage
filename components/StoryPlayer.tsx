"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryVideo } from "@/lib/story-video";
import { cn } from "@/components/ui";

const IMAGE_STORY_MS = 4500;

export type StoryItem =
  | { kind: "video"; src: string; poster?: string; alt?: string }
  | { kind: "image"; src: string; alt?: string };

export function videosToStoryItems(videos: StoryVideo[]): StoryItem[] {
  return videos.map((video) => ({
    kind: "video" as const,
    src: video.src,
    poster: video.poster,
    alt: video.alt,
  }));
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M8.2 5.9v12.2c0 .9 1 1.4 1.7.9l9.6-6.1c.7-.4.7-1.4 0-1.8l-9.6-6.1c-.7-.5-1.7 0-1.7.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Instagram story ring + play — only rendered by callers when videos exist */
export function StoryPlayButton({
  onClick,
  className,
  label = "پخش ویدیو",
  poster,
}: {
  onClick: () => void;
  className?: string;
  label?: string;
  poster?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative shrink-0 rounded-full p-[2.5px]",
        "bg-[conic-gradient(from_210deg,#f58529,#dd2a7b,#8134af,#515bd4,#eaea35,#f58529)]",
        "transition-transform hover:scale-105 active:scale-95",
        className,
      )}
    >
      <span className="grid size-12 place-items-center overflow-hidden rounded-full bg-navy-950 p-[2px] md:size-[3.25rem]">
        <span className="relative grid size-full place-items-center overflow-hidden rounded-full bg-navy-900">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
          ) : null}
          <span
            className={cn(
              "relative z-10 grid size-7 place-items-center rounded-full md:size-8",
              poster ? "bg-black/45 text-white" : "bg-navy-950 text-brand-yellow",
            )}
          >
            <PlayGlyph className="size-3.5 translate-x-px md:size-4" />
          </span>
        </span>
      </span>
    </button>
  );
}

export function StoryPlayer({
  items,
  open,
  startIndex = 0,
  onClose,
  title,
}: {
  items: StoryItem[];
  open: boolean;
  startIndex?: number;
  onClose: () => void;
  title?: string;
}) {
  const [index, setIndex] = useState(startIndex);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const holdingRef = useRef(false);
  const progressRef = useRef(0);

  const goNext = useCallback(() => {
    setIndex((current) => {
      if (current >= items.length - 1) {
        onClose();
        return current;
      }
      return current + 1;
    });
  }, [onClose, items.length]);

  const goPrev = useCallback(() => {
    setIndex((current) => Math.max(0, current - 1));
  }, []);

  useEffect(() => {
    if (!open) return;
    setIndex(startIndex);
    setProgress(0);
    setPaused(false);
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goNext();
      if (event.key === "ArrowRight") goPrev();
      if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goNext, goPrev]);

  const current = items[index] ?? items[0];
  const isVideo = current?.kind === "video";

  useEffect(() => {
    if (!open || !isVideo) return;
    const el = videoRef.current;
    if (!el) return;
    setProgress(0);
    progressRef.current = 0;
    el.currentTime = 0;
    if (paused) {
      el.pause();
    } else {
      void el.play().catch(() => undefined);
    }
  }, [open, index, items, paused, isVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isVideo) return;
    el.muted = muted;
  }, [muted, index, open, isVideo]);

  useEffect(() => {
    if (!open || isVideo || !current) return;

    let start = performance.now() - progressRef.current * IMAGE_STORY_MS;
    let frame = 0;

    const tick = (now: number) => {
      if (holdingRef.current || paused) {
        start = now - progressRef.current * IMAGE_STORY_MS;
        frame = requestAnimationFrame(tick);
        return;
      }
      const ratio = Math.min(1, (now - start) / IMAGE_STORY_MS);
      progressRef.current = ratio;
      setProgress(ratio);
      if (ratio >= 1) {
        goNext();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [open, index, isVideo, current, paused, goNext]);

  useEffect(() => {
    if (!open) return;
    progressRef.current = 0;
    setProgress(0);
  }, [open, index]);

  if (!open || !items.length || !current) return null;

  const hold = (down: boolean) => {
    holdingRef.current = down;
    setPaused(down);
  };

  const thumb =
    current.kind === "video" ? current.poster || undefined : current.src;

  return (
    <div
      className="fixed inset-0 z-[220] bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `استوری ${title}` : "استوری"}
    >
      <div className="mx-auto flex h-full w-full max-w-[430px] flex-col bg-black md:max-w-[420px] md:border-x md:border-white/10">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {current.kind === "video" ? (
            <video
              key={current.src}
              ref={videoRef}
              src={current.src}
              poster={current.poster}
              playsInline
              autoPlay
              muted={muted}
              className="absolute inset-0 size-full object-cover"
              onTimeUpdate={(event) => {
                const el = event.currentTarget;
                if (!el.duration || Number.isNaN(el.duration)) return;
                setProgress(el.currentTime / el.duration);
              }}
              onEnded={goNext}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current.src}
              src={current.src}
              alt={current.alt || title || ""}
              className="absolute inset-0 size-full object-contain bg-black"
            />
          )}

          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-black/70 via-black/25 to-transparent"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 top-0 z-20 px-2 pt-[max(0.65rem,env(safe-area-inset-top))]">
            <div className="flex gap-[3px]">
              {items.map((item, i) => (
                <div
                  key={`${item.kind}-${item.src}-${i}`}
                  className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/35"
                >
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width:
                        i < index
                          ? "100%"
                          : i === index
                            ? `${Math.min(100, Math.max(0, progress * 100))}%`
                            : "0%",
                      transition: paused ? "none" : "width 80ms linear",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[conic-gradient(from_210deg,#f58529,#dd2a7b,#8134af,#515bd4,#eaea35,#f58529)] p-[1.5px]">
                <span className="size-full overflow-hidden rounded-full bg-black">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-[10px] font-bold text-white">
                      م
                    </span>
                  )}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-white drop-shadow">
                  {title || current.alt || "مکث"}
                </p>
              </div>
              {isVideo ? (
                <button
                  type="button"
                  aria-label={muted ? "با صدا" : "بی‌صدا"}
                  className="grid size-9 place-items-center rounded-full text-white"
                  onClick={() => setMuted((value) => !value)}
                >
                  {muted ? (
                    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                      <path
                        d="M11 5 6 9H3v6h3l5 4V5Zm10.5 3.5-2 2-2-2M17.5 15.5l2 2 2-2M15.5 12l4.5-4.5M15.5 12 20 16.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                      <path
                        d="M11 5 6 9H3v6h3l5 4V5Zm4.5 2.5a5.5 5.5 0 0 1 0 9M18 5a9 9 0 0 1 0 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ) : null}
              <button
                type="button"
                aria-label="بستن"
                className="grid size-9 place-items-center rounded-full text-white"
                onClick={onClose}
              >
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="absolute inset-0 z-10 flex"
            onPointerDown={() => hold(true)}
            onPointerUp={() => hold(false)}
            onPointerCancel={() => hold(false)}
            onPointerLeave={() => {
              if (holdingRef.current) hold(false);
            }}
          >
            <button
              type="button"
              aria-label="قبلی"
              className="h-full w-[32%]"
              onClick={(event) => {
                event.stopPropagation();
                if (!holdingRef.current) goPrev();
              }}
            />
            <div className="h-full flex-1" />
            <button
              type="button"
              aria-label="بعدی"
              className="h-full w-[32%]"
              onClick={(event) => {
                event.stopPropagation();
                if (!holdingRef.current) goNext();
              }}
            />
          </div>

          {paused ? (
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                <PlayGlyph className="size-7 translate-x-0.5" />
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Secondary gallery — small thumbs; tap opens photo/video stories */
export function MediaGallery({
  images,
  videos,
  title,
}: {
  images: { src: string; alt: string }[];
  videos: StoryVideo[];
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const items: StoryItem[] = [
    ...images.map((image) => ({
      kind: "image" as const,
      src: image.src,
      alt: image.alt,
    })),
    ...videosToStoryItems(videos),
  ];

  if (!items.length) return null;

  return (
    <>
      <div className="mt-10">
        <p className="mb-3 text-sm font-bold text-navy-500">گالری</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5 md:grid-cols-5">
          {items.map((item, index) => {
            const thumb =
              item.kind === "image" ? item.src : item.poster || undefined;
            return (
              <button
                key={`${item.kind}-${item.src}-${index}`}
                type="button"
                onClick={() => {
                  setStartIndex(index);
                  setOpen(true);
                }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-navy-100 bg-navy-50 text-start"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={item.alt || title || ""}
                    className="size-full object-cover transition-transform duration-400 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : item.kind === "video" ? (
                  <video
                    src={item.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="size-full object-cover"
                  />
                ) : null}
                {item.kind === "video" ? (
                  <span className="absolute inset-0 grid place-items-center bg-navy-950/20">
                    <span className="grid size-7 place-items-center rounded-full bg-black/55 text-white">
                      <PlayGlyph className="size-3 translate-x-px" />
                    </span>
                  </span>
                ) : null}
                <span className="sr-only">
                  {item.kind === "video" ? "پخش ویدیو در استوری" : "مشاهده در استوری"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <StoryPlayer
        items={items}
        open={open}
        startIndex={startIndex}
        onClose={() => setOpen(false)}
        title={title}
      />
    </>
  );
}

/** Hero title row — circle only when videos exist; plays videos only */
export function HeroTitleWithStories({
  title,
  videos,
  headingClassName,
}: {
  title: string;
  videos: StoryVideo[];
  headingClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasVideos = videos.length > 0;
  const items = videosToStoryItems(videos);

  return (
    <>
      <div className="flex items-center gap-3 md:gap-4">
        {hasVideos ? (
          <StoryPlayButton
            onClick={() => setOpen(true)}
            label={`پخش ویدیوهای ${title}`}
            poster={videos[0]?.poster}
          />
        ) : null}
        <h1
          className={
            headingClassName ?? "text-3xl leading-tight text-brand-white md:text-5xl"
          }
        >
          {title}
        </h1>
      </div>
      {hasVideos ? (
        <StoryPlayer
          items={items}
          open={open}
          onClose={() => setOpen(false)}
          title={title}
        />
      ) : null}
    </>
  );
}
