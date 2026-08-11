"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { searchSite, type SearchItem } from "@/lib/search";
import { cn } from "./ui";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteSearch({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(variant === "mobile");
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();
  const results = searchSite(query);
  const showResults = open && query.trim().length >= 1;

  const close = () => {
    setQuery("");
    setOpen(false);
    if (variant === "desktop") setExpanded(false);
  };

  const goTo = (href: string) => {
    close();
    onNavigate?.();
    router.push(href);
  };

  useLayoutEffect(() => {
    if (!showResults || variant !== "desktop" || !rootRef.current) {
      setPanelStyle(undefined);
      return;
    }

    const update = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPanelStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 288),
        zIndex: 200,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [showResults, variant, expanded, query]);

  useEffect(() => {
    if (expanded && variant === "desktop") {
      inputRef.current?.focus();
    }
  }, [expanded, variant]);

  useEffect(() => {
    if (!open && !(variant === "desktop" && expanded)) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setQuery("");
      setOpen(false);
      if (variant === "desktop") setExpanded(false);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuery("");
        setOpen(false);
        if (variant === "desktop") setExpanded(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, expanded, variant]);

  if (variant === "mobile") {
    return (
      <div className="relative mb-6" ref={rootRef}>
        <label className="sr-only" htmlFor="mobile-site-search">
          جستجو در سایت
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-brand-white/15 bg-brand-white/5 px-4 py-3">
          <SearchIcon className="text-brand-yellow" />
          <input
            id="mobile-site-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="جستجو در خدمات، شهرها و مقالات..."
            className="w-full bg-transparent text-brand-white outline-none placeholder:text-brand-white/40"
            autoComplete="off"
            maxLength={200}
            enterKeyHint="search"
          />
        </div>
        {showResults ? (
          <div ref={panelRef} className="relative z-50 mt-2">
            <ResultsPanel
              id={listId}
              results={results}
              query={query}
              onSelect={goTo}
              tone="dark"
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div
        ref={rootRef}
        className="relative hidden h-[2.625rem] w-[12.5rem] shrink-0 sm:block"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          if (!query && !showResults) {
            setExpanded(false);
            setOpen(false);
          }
        }}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex items-center overflow-hidden rounded-full bg-brand-yellow text-navy-900 transition-[width,box-shadow] duration-300 ease-out",
            expanded
              ? "w-full gap-2 px-4 shadow-md shadow-navy-900/10"
              : "w-11 justify-center",
          )}
        >
          <button
            type="button"
            aria-label="جستجو در سایت"
            aria-expanded={expanded}
            className="grid size-8 shrink-0 place-items-center"
            onClick={() => {
              setExpanded(true);
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            <SearchIcon className="text-navy-900" />
          </button>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setExpanded(true);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && results[0]) {
                event.preventDefault();
                goTo(results[0].href);
              }
            }}
            placeholder="جستجو..."
            className={cn(
              "min-w-0 bg-transparent text-sm font-bold text-navy-900 outline-none placeholder:font-medium placeholder:text-navy-700/55",
              expanded ? "w-full opacity-100" : "w-0 opacity-0",
            )}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            maxLength={200}
            tabIndex={expanded ? 0 : -1}
          />
        </div>
      </div>

      {showResults && panelStyle ? (
        <div ref={panelRef} style={panelStyle}>
          <ResultsPanel
            id={listId}
            results={results}
            query={query}
            onSelect={goTo}
            tone="light"
          />
        </div>
      ) : null}
    </>
  );
}

function ResultsPanel({
  id,
  results,
  query,
  onSelect,
  tone,
}: {
  id: string;
  results: SearchItem[];
  query: string;
  onSelect: (href: string) => void;
  tone: "light" | "dark";
}) {
  return (
    <ul
      id={id}
      role="listbox"
      className={cn(
        "max-h-80 w-full overflow-y-auto rounded-2xl border p-2 shadow-2xl",
        tone === "light"
          ? "border-navy-100 bg-brand-white shadow-navy-900/15"
          : "border-brand-white/10 bg-navy-900 shadow-black/40",
      )}
    >
      {results.length === 0 ? (
        <li
          className={cn(
            "px-4 py-3 text-sm",
            tone === "light" ? "text-navy-600" : "text-brand-white/70",
          )}
        >
          نتیجه‌ای برای «{query}» پیدا نشد.
        </li>
      ) : (
        results.map((item) => (
          <li key={item.href} role="option">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(item.href)}
              className={cn(
                "block w-full rounded-xl px-4 py-3 text-start transition-colors",
                tone === "light"
                  ? "hover:bg-navy-50"
                  : "hover:bg-brand-white/10",
              )}
            >
              <span
                className={cn(
                  "block font-bold",
                  tone === "light" ? "text-navy-900" : "text-brand-white",
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-sm line-clamp-1",
                  tone === "light" ? "text-navy-600" : "text-brand-white/60",
                )}
              >
                {item.description}
              </span>
            </button>
          </li>
        ))
      )}
    </ul>
  );
}
