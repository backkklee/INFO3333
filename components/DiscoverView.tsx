"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Award,
  X,
  Clock,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { FilterState, Tutor, Unit } from "@/lib/types";
import { units, topicOptions } from "@/lib/mockData";
import { Badge, Button, cx } from "@/components/UiPrimitives";
import { TutorCard } from "@/components/TutorCard";

interface DiscoverViewProps {
  tutors: Tutor[];
  search: string;
  setSearch: (s: string) => void;
  saved: Set<number>;
  setSaved: (s: Set<number>) => void;
  onProfile: (t: Tutor) => void;
  onBook: (t: Tutor) => void;
  toast: (s: string) => void;
}

function TutorFilters({
  filters,
  setFilters,
  resultCount,
  onClose,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  resultCount: number;
  onClose?: () => void;
}) {
  const toggleTopic = (t: string) => {
    setFilters({
      ...filters,
      topics: filters.topics.includes(t)
        ? filters.topics.filter((x) => x !== t)
        : [...filters.topics, t],
    });
  };

  const reset = () => {
    setFilters({
      unit: "",
      topics: [],
      maxPrice: 60,
      rating: 0,
      availability: "",
      format: "Either",
      verified: true,
    });
  };

  return (
    <div className="h-full overflow-y-auto p-5 text-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-tft-text">Filters</h2>
          <p className="text-xs text-tft-success">{resultCount} tutors found</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-lg p-1 text-tft-muted hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div>
        <label htmlFor="filter-unit" className="block text-xs font-semibold text-tft-muted">
          Unit Code
        </label>
        <select
          id="filter-unit"
          value={filters.unit}
          onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-surface p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
        >
          <option value="">All units</option>
          {units.map((u) => (
            <option key={u.code} value={u.code}>
              {u.code} — {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <span className="block text-xs font-semibold text-tft-muted">Topics</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {topicOptions.map((t) => {
            const isSelected = filters.topics.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTopic(t)}
                className={cx(
                  "rounded-lg border px-2 py-1 text-xs capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
                  isSelected
                    ? "border-tft-primary bg-tft-primary/15 text-tft-primary font-medium"
                    : "border-tft-border text-tft-muted hover:border-tft-primary/40 hover:text-tft-text"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs font-semibold text-tft-muted">
          <span>Max Hourly Rate</span>
          <span className="text-tft-text">${filters.maxPrice}/hr</span>
        </div>
        <input
          aria-label="Maximum hourly price"
          type="range"
          min="25"
          max="60"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-2 w-full accent-tft-primary"
        />
        <div className="flex justify-between text-[11px] text-tft-muted">
          <span>$25</span>
          <span>$60</span>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="filter-rating" className="block text-xs font-semibold text-tft-muted">
          Minimum Rating
        </label>
        <select
          id="filter-rating"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
          className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-surface p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
        >
          <option value="0">Any rating</option>
          <option value="4">4.0 and above</option>
          <option value="4.5">4.5 and above</option>
          <option value="4.8">4.8 and above</option>
        </select>
      </div>

      <div className="mt-5">
        <span className="block text-xs font-semibold text-tft-muted">Availability</span>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {["Today", "This week", "Weekends", "Evenings"].map((a) => {
            const isSelected = filters.availability === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    availability: isSelected ? "" : a,
                  })
                }
                className={cx(
                  "rounded-lg border px-2.5 py-1.5 text-xs text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
                  isSelected
                    ? "border-tft-primary bg-tft-primary/15 text-tft-primary font-medium"
                    : "border-tft-border text-tft-muted hover:border-tft-primary/40 hover:text-tft-text"
                )}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="filter-format" className="block text-xs font-semibold text-tft-muted">
          Session Format
        </label>
        <select
          id="filter-format"
          value={filters.format}
          onChange={(e) => setFilters({ ...filters, format: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-surface p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
        >
          <option value="Either">Online and on campus</option>
          <option value="Online">Online only</option>
          <option value="On campus">On campus only</option>
        </select>
      </div>

      <label className="mt-5 flex items-center justify-between text-xs text-tft-text">
        <span>
          <span className="block font-semibold">Verified High Distinction Only</span>
          <span className="text-[11px] text-tft-muted">Demo verification status</span>
        </span>
        <input
          type="checkbox"
          checked={filters.verified}
          onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
          className="h-4 w-4 accent-tft-primary"
        />
      </label>

      <Button variant="secondary" onClick={reset} className="mt-6 w-full text-xs py-2">
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Filters
      </Button>
    </div>
  );
}

export function DiscoverView({
  tutors,
  search,
  setSearch,
  saved,
  setSaved,
  onProfile,
  onBook,
  toast,
}: DiscoverViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    unit: "",
    topics: [],
    maxPrice: 60,
    rating: 0,
    availability: "",
    format: "Either",
    verified: true,
  });
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => {
    return tutors.filter((t) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.units.some((u) => u.toLowerCase().includes(q)) ||
        t.topics.some((topic) => topic.toLowerCase().includes(q));

      const matchUnit = !filters.unit || t.units.includes(filters.unit as Unit);
      const matchTopics =
        !filters.topics.length ||
        filters.topics.some((x) => t.topics.includes(x));
      const matchPrice = t.rate <= filters.maxPrice;
      const matchRating = t.rating >= filters.rating;

      return matchSearch && matchUnit && matchTopics && matchPrice && matchRating;
    });
  }, [tutors, search, filters]);

  const toggleSave = (id: number) => {
    const nextSaved = new Set(saved);
    if (nextSaved.has(id)) {
      nextSaved.delete(id);
      toast("Tutor removed from saved list");
    } else {
      nextSaved.add(id);
      toast("Tutor saved to your shortlist");
    }
    setSaved(nextSaved);
  };

  const applyUnitChip = (u: string) => {
    setFilters({ ...filters, unit: u });
    setSearch("");
  };

  return (
    <div>
      {/* Scaled Presentation Hero Section */}
      <section className="border-b border-tft-border bg-tft-surface px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Badge tone="primary" className="mb-4">
            <Award className="h-3.5 w-3.5" />
            Verified High Distinction Peer Tutoring
          </Badge>
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-tft-text sm:text-4xl lg:text-5xl">
            Learn from students who have mastered your unit.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tft-muted sm:text-base">
            Connect with verified high-achieving student tutors for targeted assessment prep and conceptual mastery.
          </p>

          {/* Enlarged Presentation Search Bar */}
          <div className="relative mt-6 max-w-3xl">
            <label htmlFor="hero-search-input" className="sr-only">
              Search tutors by unit or topic
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tft-muted stroke-[1.75]" />
            <input
              id="hero-search-input"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search unit code (INFO2222, COMP2017) or topic..."
              className="h-14 w-full rounded-2xl border border-tft-border bg-tft-bg pl-12 pr-28 text-sm text-tft-text outline-none placeholder:text-tft-muted focus:border-tft-primary focus:ring-1 focus:ring-tft-primary shadow-sm"
            />
            <Button
              onClick={() => {}}
              className="absolute right-2 top-2 h-10 px-5 text-xs font-bold"
            >
              Search
            </Button>
          </div>

          {/* Popular Units Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-tft-muted">Quick units:</span>
            {["INFO2222", "COMP2017", "DATA2001", "ECON1001"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => applyUnitChip(code)}
                className="rounded-xl border border-tft-border bg-tft-bg px-3.5 py-1.5 text-xs font-bold text-tft-text transition hover:border-tft-primary hover:bg-tft-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
              >
                {code}
              </button>
            ))}
          </div>

          {/* Monochromatic Feature Stat Strip */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { icon: GraduationCap, text: "High Distinction Peer Tutors" },
              { icon: Clock, text: "Same-Day Session Availability" },
              { icon: ShieldCheck, text: "Academic Honesty Compliance" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-xl border border-tft-border bg-tft-elevated px-3.5 py-2 text-xs font-semibold text-tft-text"
              >
                <Icon className="h-4 w-4 text-tft-primary stroke-[1.75]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-tft-border lg:block">
          <div className="sticky top-16 h-[calc(100vh-64px)]">
            <TutorFilters
              filters={filters}
              setFilters={setFilters}
              resultCount={results.length}
            />
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-tft-text">Available Tutors</h2>
                {results.length > 6 && (
                  <span className="text-xs text-tft-muted font-medium">
                    (Showing top 6 of {results.length})
                  </span>
                )}
              </div>
              <p className="text-xs text-tft-muted">
                Showing verified tutors matching your criteria.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setDrawer(true)}
              className="lg:hidden text-xs py-2"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter Tutors
            </Button>
          </div>

          {results.length ? (
            <motion.div
              layout
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {results.slice(0, 6).map((tutor) => (
                <motion.div
                  layout
                  key={tutor.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18, layout: { duration: 0.2 } }}
                >
                  <TutorCard
                    tutor={tutor}
                    saved={saved.has(tutor.id)}
                    onSave={() => toggleSave(tutor.id)}
                    onProfile={() => onProfile(tutor)}
                    onBook={() => onBook(tutor)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-tft-border bg-tft-elevated/40 p-8 text-center">
              <div>
                <Search className="mx-auto h-8 w-8 text-tft-muted" />
                <h3 className="mt-3 font-bold text-tft-text text-sm">
                  No tutors match the selected filters
                </h3>
                <p className="mt-1 text-xs text-tft-muted">
                  Try adjusting the maximum rate or clearing topic tags.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFilters({
                      unit: "",
                      topics: [],
                      maxPrice: 60,
                      rating: 0,
                      availability: "",
                      format: "Either",
                      verified: true,
                    });
                    setSearch("");
                  }}
                  className="mt-4 text-xs py-2"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          <p className="mt-6 text-[11px] text-tft-muted">
            * High Distinction results in this demonstration are simulated for academic workflow presentation.
          </p>
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <aside className="relative z-10 w-[85vw] max-w-sm border-l border-tft-border bg-tft-surface">
            <TutorFilters
              filters={filters}
              setFilters={setFilters}
              resultCount={results.length}
              onClose={() => setDrawer(false)}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
