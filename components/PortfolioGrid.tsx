"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { locations } from "@/lib/locations";
import {
  projectFilterFields,
  type Project,
  type ProjectFilterKey,
} from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { cn } from "./ui";

const emptyFilters = Object.fromEntries(
  projectFilterFields.map((field) => [field.key, ""]),
) as Record<ProjectFilterKey, string>;

const colorSwatches: Record<string, string[]> = {
  زرد: ["#eaea35"],
  طلایی: ["#d4af37"],
  برنزی: ["#b87333"],
  نقره‌ای: ["#c5c8d0"],
  سفید: ["#fefff9"],
  مشکی: ["#0b0c26"],
  قرمز: ["#dc2626"],
  سبز: ["#16a34a"],
  آبی: ["#2563eb"],
  نارنجی: ["#f97316"],
  بنفش: ["#7c3aed"],
  "خاکستری و سفید": ["#8a8f99", "#fefff9"],
  "صورتی و آبی یخی": ["#f472b6", "#7dd3fc"],
  فول‌کالر: ["#ef4444", "#eaea35", "#3b82f6", "#22c55e"],
};

const extraOptions: Partial<Record<ProjectFilterKey, string[]>> = {
  color: Object.keys(colorSwatches),
  city: locations.map((location) => location.city),
  province: ["مازندران"],
  clientType: [
    "هایپرمارکت",
    "سوپرمارکت",
    "گالری طلا و جواهر",
    "طلا فروشی",
    "داروخانه",
    "کافه",
    "رستوران",
    "مجتمع تجاری",
    "صرافی",
    "کلینیک",
    "دندانپزشکی",
    "پوشاک",
    "آرایشگاه",
    "املاک",
    "نمایشگاه خودرو",
    "نانوایی",
    "هتل",
    "آموزشگاه",
    "بانک",
    "فروشگاه موبایل",
  ],
};

function normalize(value: string) {
  return value
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");
}

function uniqueOptions(projects: Project[], key: ProjectFilterKey) {
  return [
    ...new Set(
      [...projects.map((project) => project[key]), ...(extraOptions[key] ?? [])].filter(
        Boolean,
      ),
    ),
  ].sort((a, b) => a.localeCompare(b, "fa"));
}

function matchesFilter(project: Project, key: ProjectFilterKey, query: string) {
  const needle = normalize(query);
  if (!needle) return true;

  const haystack = [project[key]];
  if (key === "color") haystack.push(project.material, project.title, project.summary);
  if (key === "city" || key === "province") {
    haystack.push(project.city, project.province, project.title);
  }
  if (key === "clientType") haystack.push(project.title, project.summary);
  if (key === "material") haystack.push(project.color, project.summary, project.title);
  if (key === "category") haystack.push(project.title, project.summary);

  return haystack.some((item) => normalize(item).includes(needle));
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors",
        selected
          ? "bg-navy-600 text-brand-white"
          : "border border-navy-200 bg-brand-white text-navy-700 hover:border-navy-400",
      )}
    >
      {label}
    </button>
  );
}

function FieldSearch({
  label,
  value,
  onChange,
  onSubmit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="relative mb-3">
      <Search
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-navy-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder={`جستجوی ${label}...`}
        className="w-full rounded-xl border border-navy-200 bg-navy-50 py-2.5 pr-10 pl-3 text-sm text-navy-900 outline-none placeholder:text-navy-400 focus:border-navy-600 focus:bg-brand-white focus:ring-2 focus:ring-navy-600/20"
      />
    </div>
  );
}

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filters, setFilters] =
    useState<Record<ProjectFilterKey, string>>(emptyFilters);
  const [drafts, setDrafts] =
    useState<Record<ProjectFilterKey, string>>(emptyFilters);
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    return projectFilterFields.reduce(
      (result, field) => {
        result[field.key] = uniqueOptions(projects, field.key);
        return result;
      },
      {} as Record<ProjectFilterKey, string[]>,
    );
  }, [projects]);

  const activeCount = projectFilterFields.filter((field) => filters[field.key]).length;

  const filtered = useMemo(
    () =>
      projects.filter((project) =>
        projectFilterFields.every((field) =>
          matchesFilter(project, field.key, filters[field.key]),
        ),
      ),
    [projects, filters],
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const apply = (key: ProjectFilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: normalize(value) }));
    setDrafts((current) => ({ ...current, [key]: normalize(value) }));
  };

  const toggle = (key: ProjectFilterKey, value: string) => {
    const next = filters[key] === value ? "" : value;
    apply(key, next);
  };

  const visibleOptions = (key: ProjectFilterKey) => {
    const query = normalize(drafts[key]);
    if (!query) return options[key];
    return options[key].filter((option) => normalize(option).includes(query));
  };

  const clearAll = () => {
    setFilters(emptyFilters);
    setDrafts(emptyFilters);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-3">
        <p className="text-sm text-navy-700">
          {filtered.length.toLocaleString("fa-IR")} پروژه
        </p>
        <div className="flex items-center gap-3">
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-bold text-navy-600 hover:text-navy-800"
            >
              پاک کردن
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-navy-600 px-5 py-2.5 text-sm font-bold text-brand-white shadow-lg shadow-navy-600/20 transition-colors hover:bg-navy-700"
          >
            <Filter className="size-4" aria-hidden="true" />
            فیلتر
            {activeCount > 0 ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand-yellow px-1.5 text-xs text-navy-900">
                {activeCount.toLocaleString("fa-IR")}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center md:items-center">
          <button
            type="button"
            aria-label="بستن فیلتر"
            className="absolute inset-0 bg-navy-950/55"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-filter-title"
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col rounded-t-3xl bg-brand-white shadow-2xl md:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
              <h2
                id="portfolio-filter-title"
                className="text-lg font-bold text-navy-900"
              >
                فیلتر پروژه‌ها
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="grid size-10 place-items-center rounded-full text-navy-700 hover:bg-navy-50"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
              {projectFilterFields.map((field) => {
                const query = normalize(drafts[field.key]);
                const shown = visibleOptions(field.key);
                const canApplyCustom =
                  query.length > 0 &&
                  !options[field.key].some((option) => normalize(option) === query);

                return (
                  <div key={field.key}>
                    <p className="mb-2 text-xs font-bold text-navy-500">
                      {field.label}
                    </p>
                    <FieldSearch
                      label={field.label}
                      value={drafts[field.key]}
                      onChange={(value) =>
                        setDrafts((current) => ({ ...current, [field.key]: value }))
                      }
                      onSubmit={() => apply(field.key, drafts[field.key])}
                    />

                    {field.key === "color" ? (
                      <div className="flex flex-wrap gap-4">
                        <button
                          type="button"
                          onClick={() => apply("color", "")}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span
                            className={cn(
                              "flex size-9 overflow-hidden rounded-full border-2",
                              filters.color ? "border-navy-200" : "border-navy-900",
                            )}
                          >
                            <span className="h-full flex-1 bg-navy-600" />
                            <span className="h-full flex-1 bg-brand-yellow" />
                            <span className="h-full flex-1 bg-brand-white" />
                          </span>
                          <span className="text-[0.7rem] font-bold text-navy-700">
                            همه
                          </span>
                        </button>
                        {shown.map((option) => {
                          const tones = colorSwatches[option] ?? ["#2d3192"];
                          const selected = filters.color === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggle("color", option)}
                              className="flex flex-col items-center gap-1.5"
                            >
                              <span
                                className={cn(
                                  "flex size-9 overflow-hidden rounded-full border-2",
                                  selected ? "border-navy-900" : "border-navy-200",
                                )}
                              >
                                {tones.map((tone) => (
                                  <span
                                    key={tone}
                                    className="h-full flex-1"
                                    style={{ backgroundColor: tone }}
                                  />
                                ))}
                              </span>
                              <span className="max-w-16 text-center text-[0.7rem] font-bold text-navy-700">
                                {option}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Chip
                          label="همه"
                          selected={!filters[field.key]}
                          onClick={() => apply(field.key, "")}
                        />
                        {shown.map((option) => (
                          <Chip
                            key={option}
                            label={option}
                            selected={filters[field.key] === option}
                            onClick={() => toggle(field.key, option)}
                          />
                        ))}
                      </div>
                    )}

                    {shown.length === 0 && !canApplyCustom ? (
                      <p className="mt-2 text-sm text-navy-500">
                        موردی پیدا نشد. Enter بزنید تا همین عبارت جستجو شود.
                      </p>
                    ) : null}

                    {canApplyCustom ? (
                      <button
                        type="button"
                        onClick={() => apply(field.key, query)}
                        className="mt-3 rounded-full bg-navy-50 px-4 py-2 text-sm font-bold text-navy-700 hover:bg-navy-100"
                      >
                        جستجو برای «{query}»
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 border-t border-navy-100 px-5 py-4">
              <button
                type="button"
                onClick={clearAll}
                className="rounded-full border border-navy-200 px-5 py-3 text-sm font-bold text-navy-700"
              >
                پاک کردن
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-navy-600 py-3 text-sm font-bold text-brand-white"
              >
                نمایش {filtered.length.toLocaleString("fa-IR")} پروژه
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-7 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-navy-700/70">
          با این فیلترها پروژه‌ای پیدا نشد. فیلتر را عوض کنید یا پاک کنید.
        </p>
      )}
    </div>
  );
}
