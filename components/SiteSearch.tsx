"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
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
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(variant === "mobile");
  const results = searchSite(query);

  useEffect(() => {
    if (expanded && variant === "desktop") {
      inputRef.current?.focus();
    }
  }, [expanded, variant]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        if (variant === "desktop") setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, variant]);

  const showResults = open && query.trim().length >= 2;

  const handleSelect = () => {
    setQuery("");
    setOpen(false);
    if (variant === "desktop") setExpanded(false);
    onNavigate?.();
  };

  if (variant === "mobile") {
    return (
      <div className="relative mb-6">
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
          <ResultsPanel
            id={listId}
            results={results}
            query={query}
            onSelect={handleSelect}
            tone="dark"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="relative hidden sm:block"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        if (!query && document.activeElement !== inputRef.current) {
          setExpanded(false);
          setOpen(false);
        }
      }}
    >
      <div
        className={cn(
          "flex h-11 items-center overflow-hidden rounded-full border border-navy-200 bg-brand-white transition-all duration-300 ease-out",
          expanded ? "w-64 gap-2 px-3 shadow-lg shadow-navy-900/10" : "w-11 justify-center",
        )}
      >
        <button
          type="button"
          aria-label="جستجو در سایت"
          aria-expanded={expanded}
          className="grid size-8 shrink-0 place-items-center text-navy-700 transition-colors hover:text-navy-900"
          onClick={() => {
            setExpanded(true);
            setOpen(true);
            inputRef.current?.focus();
          }}
        >
          <SearchIcon />
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
          onBlur={() => {
            if (!query) {
              window.setTimeout(() => {
                setExpanded(false);
                setOpen(false);
              }, 150);
            }
          }}
          placeholder="جستجو..."
          className={cn(
            "bg-transparent text-sm text-navy-900 outline-none transition-all duration-300 placeholder:text-navy-400",
            expanded ? "w-full opacity-100" : "w-0 opacity-0",
          )}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          maxLength={200}
        />
      </div>
      {showResults ? (
        <ResultsPanel
          id={listId}
          results={results}
          query={query}
          onSelect={handleSelect}
          tone="light"
        />
      ) : null}
    </div>
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
  onSelect: () => void;
  tone: "light" | "dark";
}) {
  return (
    <ul
      id={id}
      role="listbox"
      className={cn(
        "absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border p-2 shadow-2xl",
        tone === "light"
          ? "border-navy-100 bg-brand-white shadow-navy-900/10"
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
            <Link
              href={item.href}
              onClick={onSelect}
              className={cn(
                "block rounded-xl px-4 py-3 transition-colors",
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
            </Link>
          </li>
        ))
      )}
    </ul>
  );
}
