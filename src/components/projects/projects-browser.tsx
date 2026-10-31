"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Field } from "@/components/forms/field";
import { Select, TextInput } from "@/components/forms/controls";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import {
  applyFilters,
  defaultFilters,
  getFilterOptions,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
  sortKeys,
  type ProjectFilters,
} from "@/features/projects/lib/filters";
import { cn } from "@/lib/cn";
import { ProjectGrid } from "./project-grid";

const options = getFilterOptions(projects);

export function ProjectsBrowser() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const panelId = useId();
  const searchId = useId();
  const yearId = useId();
  const countryId = useId();
  const sortId = useId();

  // URL -> state once on load; afterwards state -> URL, so typing never fights the router.
  const [filters, setFilters] = useState<ProjectFilters>(() => parseFilters(searchParams, options));
  const [panelOpen, setPanelOpen] = useState(false);

  const visible = useMemo(() => applyFilters(projects, filters, locale), [filters, locale]);
  const countryNames = useMemo(() => new Intl.DisplayNames([locale], { type: "region" }), [locale]);
  const active = hasActiveFilters(filters);
  const activeCount = [filters.category, filters.year, filters.country].filter(
    (value) => value !== "all",
  ).length;

  function update(patch: Partial<ProjectFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    const query = serializeFilters(next).toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  const chip = (selected: boolean) =>
    cn(
      "inline-flex h-11 items-center border px-4 text-sm transition-colors",
      selected
        ? "border-foreground bg-foreground text-background"
        : "border-foreground/30 hover:border-foreground",
    );

  return (
    <div className="flex flex-col gap-10">
      <div
        role="search"
        aria-label={t("filtersGroup")}
        className="flex flex-col gap-6 border-y border-line py-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-56 flex-1">
            <Field id={searchId} label={t("searchLabel")}>
              <TextInput
                id={searchId}
                type="search"
                value={filters.query}
                placeholder={t("searchPlaceholder")}
                onChange={(event) => update({ query: event.target.value })}
              />
            </Field>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="md:hidden"
            aria-expanded={panelOpen}
            aria-controls={panelId}
            onClick={() => setPanelOpen((open) => !open)}
          >
            {t("filters")}
            {activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
        </div>

        <div
          id={panelId}
          className={cn(
            "gap-6 md:grid md:grid-cols-12 md:items-end",
            panelOpen ? "animate-fade-in grid" : "hidden",
          )}
        >
          <div
            role="group"
            aria-label={t("typeLabel")}
            className="flex flex-wrap gap-2 md:col-span-12"
          >
            <button
              type="button"
              aria-pressed={filters.category === "all"}
              className={chip(filters.category === "all")}
              onClick={() => update({ category: "all" })}
            >
              {t("allTypes")}
            </button>
            {options.categories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={filters.category === category}
                className={chip(filters.category === category)}
                onClick={() => update({ category })}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>

          <div className="md:col-span-4">
            <Field id={yearId} label={t("yearLabel")}>
              <Select
                id={yearId}
                value={String(filters.year)}
                onChange={(event) =>
                  update({
                    year: event.target.value === "all" ? "all" : Number(event.target.value),
                  })
                }
              >
                <option value="all">{t("allYears")}</option>
                {options.years.map((year) => (
                  <option key={year} value={year}>
                    {new Intl.NumberFormat(locale, { useGrouping: false }).format(year)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="md:col-span-4">
            <Field id={countryId} label={t("countryLabel")}>
              <Select
                id={countryId}
                value={filters.country}
                onChange={(event) => update({ country: event.target.value })}
              >
                <option value="all">{t("allCountries")}</option>
                {options.countries.map((code) => (
                  <option key={code} value={code}>
                    {countryNames.of(code)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="md:col-span-4">
            <Field id={sortId} label={t("sortLabel")}>
              <Select
                id={sortId}
                value={filters.sort}
                onChange={(event) => update({ sort: event.target.value as ProjectFilters["sort"] })}
              >
                {sortKeys.map((key) => (
                  <option key={key} value={key}>
                    {t(`sort.${key}`)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>

        <div className="flex min-h-11 items-center justify-between gap-4">
          <p role="status" className="text-sm text-muted">
            {t("resultCount", { count: visible.length })}
          </p>
          {active ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => update({ ...defaultFilters, sort: filters.sort })}
            >
              {t("clearFilters")}
            </Button>
          ) : null}
        </div>
      </div>

      {visible.length > 0 ? (
        <ProjectGrid projects={visible} headingLevel={2} priorityCount={2} />
      ) : (
        <div className="flex flex-col items-center gap-4 border border-dashed border-line px-6 py-20 text-center">
          <h2 className="text-2xl font-medium">{t("emptyTitle")}</h2>
          <p className="max-w-md text-muted">{t("emptyText")}</p>
          <Button
            variant="outline"
            onClick={() => update({ ...defaultFilters, sort: filters.sort })}
          >
            {t("clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}
