"use client";

import React from "react";
import { Bookmark, ShieldCheck, Code2, FileCheck } from "lucide-react";
import { Tutor } from "@/lib/types";
import { Avatar, Badge, Button, Stars, cx } from "@/components/UiPrimitives";

interface TutorCardProps {
  tutor: Tutor;
  saved: boolean;
  onSave: () => void;
  onProfile: () => void;
  onBook: () => void;
}

export function TutorCard({
  tutor,
  saved,
  onSave,
  onProfile,
  onBook,
}: TutorCardProps) {
  return (
    <article
      className={cx(
        "relative flex h-full flex-col rounded-2xl border bg-tft-surface p-6 transition-colors hover:border-tft-primary/60",
        tutor.promoted
          ? "border-tft-primary/40 bg-tft-surface"
          : "border-tft-border"
      )}
    >
      {tutor.promoted && (
        <div className="absolute -top-3 left-6 rounded-md border border-tft-primary/30 bg-tft-primary px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
          Top Match for INFO2222
        </div>
      )}

      <div className="flex items-center gap-4">
        <Avatar tutor={tutor} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-tft-text text-lg leading-tight truncate">
              {tutor.name}
            </h3>
            <ShieldCheck className="h-4 w-4 text-tft-primary stroke-[1.75] shrink-0" />
          </div>
          <p className="mt-0.5 text-xs text-tft-muted truncate">
            {tutor.year} · {tutor.degree}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-tft-text">
            <Stars rating={tutor.rating} />
            <span className="text-tft-muted">({tutor.reviewsCount})</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onSave}
          aria-label={saved ? `Remove ${tutor.name} from saved` : `Save ${tutor.name}`}
          className="rounded-xl p-2 text-tft-muted transition hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
        >
          <Bookmark
            className={cx(
              "h-5 w-5 transition-transform active:scale-90",
              saved ? "fill-tft-primary text-tft-primary" : "text-tft-muted"
            )}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge
          tone="success"
          title="High Distinction — verified unit result."
        >
          <ShieldCheck className="h-3 w-3" />
          Verified HD*
        </Badge>
        {tutor.units.map((u) => (
          <Badge key={u}>{u}</Badge>
        ))}
      </div>

      {/* Monochromatic Capability Tag Strip (replaces dense bio paragraph) */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 rounded-xl border border-tft-border bg-tft-elevated px-3 py-2 text-tft-text">
          <Code2 className="h-4 w-4 text-tft-primary stroke-[1.75] shrink-0" />
          <span className="truncate font-medium">Code Review</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-tft-border bg-tft-elevated px-3 py-2 text-tft-text">
          <FileCheck className="h-4 w-4 text-tft-primary stroke-[1.75] shrink-0" />
          <span className="truncate font-medium">Rubric Feedback</span>
        </div>
      </div>

      {/* Presentation Metric Strip */}
      <div className="mt-5 flex items-baseline justify-between border-t border-tft-border pt-4">
        <div>
          <span className="text-[11px] font-semibold text-tft-muted block">
            Session Rate
          </span>
          <span className="text-2xl sm:text-3xl font-black text-tft-text">
            ${tutor.rate}
          </span>
          <span className="text-xs text-tft-muted"> / hour</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-tft-muted block">
            Next Available
          </span>
          <span className="text-xs font-bold text-tft-success">
            {tutor.next}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <Button
          variant="secondary"
          onClick={onProfile}
          className="h-11 text-xs font-bold"
        >
          View Profile
        </Button>
        <Button
          onClick={onBook}
          className="h-11 text-xs font-bold"
        >
          Book Session
        </Button>
      </div>
    </article>
  );
}
