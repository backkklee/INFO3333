"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { Tutor } from "@/lib/types";
import { TutorCard } from "@/components/TutorCard";

interface SavedViewProps {
  tutors: Tutor[];
  saved: Set<number>;
  setSaved: (s: Set<number>) => void;
  onProfile: (t: Tutor) => void;
  onBook: (t: Tutor) => void;
}

export function SavedView({
  tutors,
  saved,
  setSaved,
  onProfile,
  onBook,
}: SavedViewProps) {
  const savedList = tutors.filter((t) => saved.has(t.id));

  const toggleSave = (id: number) => {
    const next = new Set(saved);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSaved(next);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-tft-text">
          Saved Tutors
        </h1>
        <p className="mt-1 text-xs text-tft-muted">
          Your shortlisted peer tutors for fast session scheduling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {savedList.length ? (
          savedList.slice(0, 6).map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              saved
              onSave={() => toggleSave(tutor.id)}
              onProfile={() => onProfile(tutor)}
              onBook={() => onBook(tutor)}
            />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-tft-border p-10 text-center text-xs text-tft-muted">
            <Bookmark className="mx-auto h-8 w-8 text-tft-muted" />
            <h2 className="mt-3 text-sm font-bold text-tft-text">
              No Saved Tutors Yet
            </h2>
            <p className="mt-1 text-tft-muted">
              Use the bookmark icon on any tutor profile to save them to your list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
