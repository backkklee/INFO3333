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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-tft-primary">
            Student Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-tft-text">
            My Learning
          </h1>
          <p className="mt-1 text-xs text-tft-muted">
            Track your scheduled sessions, hours, and saved tutors.
          </p>
        </div>
        <Button onClick={onDiscover} className="text-xs py-2">
          <Search className="h-3.5 w-3.5" />
          Find Another Tutor
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-tft-border bg-tft-surface p-4"
          >
            <Icon className="h-5 w-5 text-tft-primary" />
            <div className="mt-2 text-2xl font-black text-tft-text">{value}</div>
            <div className="text-xs text-tft-muted">{label}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-base font-bold text-tft-text">Upcoming Sessions</h2>
        <div className="mt-3 space-y-2.5">
          {bookings.length ? (
            bookings.map((booking) => {
              const tutor = tutors.find((t) => t.id === booking.tutorId);
              if (!tutor) return null;
              return (
                <article
                  key={booking.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-tft-border bg-tft-surface p-3 text-xs"
                >
                  <Avatar tutor={tutor} size="sm" />
                  <div>
                    <div className="font-bold text-tft-text">
                      {booking.unit} with {tutor.name}
                    </div>
                    <div className="text-[11px] text-tft-muted">
                      {booking.date} · {booking.duration} min · {booking.mode} · Topic: {booking.topic}
                    </div>
                  </div>
                  <Badge tone="success" className="ml-auto">
                    {booking.status}
                  </Badge>
                  <Button variant="secondary" className="text-xs py-1.5 px-3">
                    Session Details
                  </Button>
                </article>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-tft-border p-6 text-center text-xs text-tft-muted">
              No sessions currently scheduled. Explore tutors to schedule one.
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
              You haven&apos;t saved any tutors yet. Use the bookmark icon on any tutor profile to save them.
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
