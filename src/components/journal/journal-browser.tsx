"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Field } from "@/components/forms/field";
import { TextInput } from "@/components/forms/controls";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";
import {
  defaultJournalFilters,
  filterArticles,
  getArticleCategories,
  hasActiveJournalFilters,
  parseJournalFilters,
  serializeJournalFilters,
  type JournalFilters,
} from "@/features/journal/lib/filters";
import { cn } from "@/lib/cn";
import { ArticleGrid } from "./article-grid";

const categories = getArticleCategories(articles);

export function JournalBrowser() {
  const t = useTranslations("Journal");
  const searchParams = useSearchParams();
  const searchId = useId();
  const [filters, setFilters] = useState<JournalFilters>(() =>
    parseJournalFilters(searchParams, categories),
  );

  const visible = useMemo(() => filterArticles(articles, filters), [filters]);
  const active = hasActiveJournalFilters(filters);

  // State -> URL only after the first read, so typing never fights the router.
  function update(patch: Partial<JournalFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    const query = serializeJournalFilters(next).toString();
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
      <div role="search" className="flex flex-col gap-6 border-y border-line py-6">
        <Field id={searchId} label={t("searchLabel")}>
          <TextInput
            id={searchId}
            type="search"
            value={filters.query}
            placeholder={t("searchPlaceholder")}
            onChange={(event) => update({ query: event.target.value })}
          />
        </Field>
        <div role="group" aria-label={t("categoryLabel")} className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filters.category === "all"}
            className={chip(filters.category === "all")}
            onClick={() => update({ category: "all" })}
          >
            {t("allCategories")}
          </button>
          {categories.map((category) => (
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
        <div className="flex min-h-11 items-center justify-between gap-4">
          <p role="status" className="text-sm text-muted">
            {t("resultCount", { count: visible.length })}
          </p>
          {active ? (
            <Button variant="ghost" size="sm" onClick={() => update(defaultJournalFilters)}>
              {t("clearFilters")}
            </Button>
          ) : null}
        </div>
      </div>

      {visible.length > 0 ? (
        <ArticleGrid articles={visible} />
      ) : (
        <div className="flex flex-col items-center gap-4 border border-dashed border-line px-6 py-20 text-center">
          <h2 className="text-2xl font-medium">{t("emptyTitle")}</h2>
          <p className="max-w-md text-muted">{t("emptyText")}</p>
          <Button variant="outline" onClick={() => update(defaultJournalFilters)}>
            {t("clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}
