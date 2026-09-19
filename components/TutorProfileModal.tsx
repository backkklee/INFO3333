"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  Award,
  AlertTriangle,
  Clock,
  Calendar,
  Bookmark,
} from "lucide-react";
import { Tutor } from "@/lib/types";
import { Avatar, Badge, Button, Stars, cx } from "@/components/UiPrimitives";

interface TutorProfileModalProps {
  tutor: Tutor;
  onClose: () => void;
  onBook: () => void;
  saved: boolean;
  onSave: () => void;
}

export function TutorProfileModal({
  tutor,
  onClose,
  onBook,
  saved,
  onSave,
}: TutorProfileModalProps) {
  const statItems = [
    { label: `${tutor.reviewsCount} Reviews`, value: <Stars rating={tutor.rating} /> },
    { label: "Completed Sessions", value: tutor.sessions },
    { label: "Typical Response", value: tutor.response },
    { label: "Repeat Students", value: `${tutor.repeat}%` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-profile-title"
    >
      <div className="mx-auto min-h-full max-w-4xl border-tft-border bg-tft-surface sm:min-h-0 sm:rounded-2xl sm:border">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-tft-border bg-tft-surface/95 px-5 py-3 backdrop-blur">
          <span className="text-xs font-semibold text-tft-muted">
            Tutor Profile
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile modal"
            className="rounded-lg p-1.5 text-tft-muted hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_300px]">
          <main>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Avatar tutor={tutor} size="lg" />
              <div>
                <Badge tone="success">
                  <ShieldCheck className="h-3 w-3" />
                  Verified HD Result
                </Badge>
                <h2
                  id="tutor-profile-title"
                  className="mt-2 text-2xl font-black text-tft-text"
                >
                  {tutor.name}
                </h2>
                <p className="text-xs text-tft-muted">
                  {tutor.year} · {tutor.degree}
                </p>
                <p className="mt-2 text-sm font-medium text-tft-primary">
                  {tutor.headline}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-tft-border bg-tft-elevated p-3 text-center sm:text-left"
                >
                  <div className="text-sm font-bold text-tft-text">{item.value}</div>
                  <div className="mt-0.5 text-[11px] text-tft-muted">{item.label}</div>
                </div>
              ))}
            </div>

            <section className="mt-6">
              <h3 className="text-sm font-bold text-tft-text">
                Verified Unit Achievements
              </h3>
              <div className="mt-2 space-y-2">
                {tutor.units.map((u) => (
                  <div
                    key={u}
                    className="flex items-center gap-3 rounded-xl border border-tft-border bg-tft-elevated p-3 text-xs"
                  >
                    <Award className="h-4 w-4 text-tft-primary shrink-0" />
                    <span className="font-semibold text-tft-text">
                      {u} · High Distinction
                    </span>
                    <Badge tone="success" className="ml-auto text-[10px]">
                      Verified Demo
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-sm font-bold text-tft-text">About the Tutor</h3>
              <p className="mt-2 text-xs leading-relaxed text-tft-muted">
                {tutor.about}
              </p>
            </section>

            <section className="mt-6">
              <h3 className="text-sm font-bold text-tft-text">Session Capabilities</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Concept Explanation",
                  "Weekly Study Planning",
                  "Practice Questions",
                  "Code Review",
                  "Assignment Feedback",
                  "Exam Preparation",
                ].map((cap) => (
                  <Badge key={cap}>{cap}</Badge>
                ))}
              </div>
            </section>

            <div className="mt-6 flex gap-3 rounded-xl border border-tft-warning/30 bg-tft-warning/10 p-3 text-xs text-tft-text">
              <AlertTriangle className="h-4 w-4 shrink-0 text-tft-warning" />
              <p>
                <strong>Academic Integrity:</strong> Peer tutors provide conceptual guidance and constructive feedback. Tutors must never author or complete assessable student work.
              </p>
            </div>

            <section className="mt-6">
              <div className="flex items-end justify-between">
                <h3 className="text-sm font-bold text-tft-text">Student Reviews</h3>
                <span className="text-[11px] text-tft-muted">Sample reviews</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {tutor.reviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="rounded-xl border border-tft-border bg-tft-elevated p-3 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-tft-text">
                        {rev.author} · {rev.unit}
                      </span>
                      <Stars rating={rev.rating} />
                    </div>
                    <p className="mt-1.5 text-tft-muted">&ldquo;{rev.text}&rdquo;</p>
                    <p className="mt-1 text-[10px] text-tft-muted/80">{rev.date}</p>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside>
            <div className="sticky top-20 rounded-xl border border-tft-border bg-tft-elevated p-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-tft-muted">Hourly Rate</div>
                  <div className="text-xl font-black text-tft-text">
                    ${tutor.rate}
                    <span className="text-xs font-normal text-tft-muted">/hr</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-tft-success">
                  Replies {tutor.response.toLowerCase()}
                </span>
              </div>

              <h4 className="mt-4 text-xs font-bold text-tft-text">
                Upcoming Availability
              </h4>
              <div className="mt-2 space-y-1.5">
                {tutor.availability.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center gap-2 rounded-lg bg-tft-surface p-2 text-xs text-tft-text"
                  >
                    <Clock className="h-3.5 w-3.5 text-tft-primary" />
                    <span>{slot}</span>
                  </div>
                ))}
              </div>

              <Button onClick={onBook} className="mt-5 w-full text-xs py-2.5">
                <Calendar className="h-3.5 w-3.5" />
                Book a Session
              </Button>

              <Button
                variant="secondary"
                onClick={onSave}
                className="mt-2 w-full text-xs py-2"
              >
                <Bookmark
                  className={cx(
                    "h-3.5 w-3.5",
                    saved && "fill-tft-primary text-tft-primary"
                  )}
                />
                {saved ? "Saved in Shortlist" : "Save Tutor"}
              </Button>

              <p className="mt-3 text-[11px] text-tft-muted leading-relaxed">
                Free cancellation up to 12 hours prior to scheduled start.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
