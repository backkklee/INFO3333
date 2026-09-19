"use client";

import React from "react";
import { Bookmark, ShieldCheck } from "lucide-react";
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
        "relative flex h-full flex-col rounded-2xl border bg-tft-surface p-5 transition-colors",
        tutor.promoted
          ? "border-tft-primary/40 bg-tft-surface"
          : "border-tft-border"
      )}
    >
      {tutor.promoted && (
        <div className="absolute -top-3 left-5 rounded-md border border-tft-primary/30 bg-tft-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
          Top Match for INFO2222
        </div>
      )}

      <div className="flex items-start gap-3">
        <Avatar tutor={tutor} />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-tft-text text-base leading-tight">
            {tutor.name}
          </h3>
          <p className="mt-1 text-xs text-tft-muted">
            {tutor.year} · {tutor.degree}
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          aria-label={saved ? `Remove ${tutor.name} from saved` : `Save ${tutor.name}`}
          className="rounded-lg p-1.5 text-tft-muted transition hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
        >
          <Bookmark
            className={cx(
              "h-4 w-4",
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

      <div className="mt-3 flex items-center gap-2 text-xs">
        <Stars rating={tutor.rating} />
        <span className="text-tft-muted">({tutor.reviewsCount} reviews)</span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-tft-muted line-clamp-2">
        {tutor.focus}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-tft-border bg-tft-elevated p-3 text-xs">
        <div>
          <div className="text-[11px] text-tft-muted">Hourly Rate</div>
          <div className="font-bold text-tft-text">${tutor.rate}/hr</div>
        </div>
        <div>
          <div className="text-[11px] text-tft-muted">Next Available</div>
          <div className="truncate font-medium text-tft-success">
            {tutor.next}
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <Button variant="secondary" onClick={onProfile} className="text-xs py-2">
          View Profile
        </Button>
        <Button onClick={onBook} className="text-xs py-2">
          Book Session
        </Button>
      </div>
    </article>
  );
}
