"use client";

import React from "react";
import { Calendar, Clock, BookOpen, Search } from "lucide-react";
import { Booking, Tutor } from "@/lib/types";
import { Avatar, Badge, Button } from "@/components/UiPrimitives";
import { TutorCard } from "@/components/TutorCard";

interface StudentDashboardProps {
  bookings: Booking[];
  tutors: Tutor[];
  saved: Set<number>;
  setSaved: (s: Set<number>) => void;
  onDiscover: () => void;
  onProfile: (t: Tutor) => void;
  onBook: (t: Tutor) => void;
}

export function StudentDashboard({
  bookings,
  tutors,
  saved,
  setSaved,
  onDiscover,
  onProfile,
  onBook,
}: StudentDashboardProps) {
  const totalHours = bookings.reduce((sum, b) => sum + b.duration, 0) / 60;
  const uniqueUnits = new Set(bookings.map((b) => b.unit)).size;

  const statCards = [
    {
      label: "Upcoming Sessions",
      value: bookings.length,
      icon: Calendar,
    },
    {
      label: "Hours Learned",
      value: totalHours.toFixed(1),
      icon: Clock,
    },
    {
      label: "Supported Units",
      value: uniqueUnits,
      icon: BookOpen,
    },
  ];

  const savedTutorsList = tutors.filter((t) => saved.has(t.id));

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-tft-primary uppercase tracking-wider">
            Student Overview
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-tft-text">
            My Learning
          </h1>
          <p className="mt-0.5 text-xs text-tft-muted">
            Track your scheduled sessions, study hours, and shortlisted tutors.
          </p>
        </div>
        <Button onClick={onDiscover} className="h-10 text-xs px-4 font-bold">
          <Search className="h-4 w-4" />
          Find Another Tutor
        </Button>
      </div>

      {/* Metric Cards — single line on mobile with icon on same level as big text */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl sm:rounded-2xl border border-tft-border bg-tft-surface p-3 sm:p-5 lg:p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="grid h-8 w-8 sm:h-11 sm:w-11 place-items-center rounded-lg sm:rounded-xl border border-tft-border bg-tft-elevated text-tft-primary shrink-0">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[1.75]" />
              </div>
              <div className="text-lg sm:text-3xl lg:text-4xl font-black text-tft-text tracking-tight leading-none truncate">
                {value}
              </div>
            </div>
            <div
              className="mt-2 text-[10px] sm:text-xs font-bold text-tft-muted truncate"
              title={label}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-base font-bold text-tft-text">Upcoming Sessions</h2>
        <div className="mt-3 space-y-3">
          {bookings.length ? (
            bookings.map((booking) => {
              const tutor = tutors.find((t) => t.id === booking.tutorId);
              if (!tutor) return null;
              return (
                <article
                  key={booking.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-tft-border bg-tft-surface p-4 text-xs shadow-sm"
                >
                  <Avatar tutor={tutor} size="sm" />
                  <div>
                    <div className="font-bold text-tft-text text-sm">
                      {booking.unit} with {tutor.name}
                    </div>
                    <div className="text-xs text-tft-muted mt-0.5">
                      {booking.date} · {booking.duration} min · {booking.mode} · Topic: {booking.topic}
                    </div>
                  </div>
                  <Badge tone="success" className="ml-auto font-bold">
                    {booking.status}
                  </Badge>
                  <Button variant="secondary" className="h-9 text-xs px-3.5">
                    Session Details
                  </Button>
                </article>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-tft-border p-8 text-center text-xs text-tft-muted">
              No sessions currently scheduled. Explore tutors to reserve a slot.
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-tft-text">Saved Tutors Shortlist</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedTutorsList.length ? (
            savedTutorsList.map((t) => (
              <TutorCard
                key={t.id}
                tutor={t}
                saved
                onSave={() => toggleSave(t.id)}
                onProfile={() => onProfile(t)}
                onBook={() => onBook(t)}
              />
            ))
          ) : (
            <p className="text-xs text-tft-muted col-span-full">
              You haven&apos;t saved any tutors yet. Use the bookmark icon on any tutor card to build your shortlist.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-tft-text">Suggested For Your Units</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tutors.slice(0, 3).map((t) => (
            <TutorCard
              key={t.id}
              tutor={t}
              saved={saved.has(t.id)}
              onSave={() => toggleSave(t.id)}
              onProfile={() => onProfile(t)}
              onBook={() => onBook(t)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
