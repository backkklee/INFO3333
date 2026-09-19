"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  Calendar,
  MessageCircle,
  Video,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Tutor, Unit, Booking, Transaction } from "@/lib/types";
import { Avatar, Button, cx } from "@/components/UiPrimitives";

interface BookingModalProps {
  tutor: Tutor;
  onClose: () => void;
  onConfirm: (booking: Booking, transaction: Transaction) => void;
}

export function BookingModal({ tutor, onClose, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState<Unit>(tutor.units[0]);
  const [topic, setTopic] = useState("Concept explanation");
  const [mode, setMode] = useState("Online");
  const [duration, setDuration] = useState(60);
  const [slot, setSlot] = useState(tutor.availability[0]);
  const [goal, setGoal] = useState("");
  const [done, setDone] = useState(false);

  const subtotal = tutor.rate * (duration / 60);
  const fee = Number((subtotal * 0.08).toFixed(2));
  const total = subtotal + fee;

  const handleConfirm = () => {
    const bookingId = Date.now();
    const newBooking: Booking = {
      id: bookingId,
      tutorId: tutor.id,
      unit,
      date: slot,
      duration,
      mode,
      topic,
      status: "Confirmed",
    };

    const newTransaction: Transaction = {
      id: `TFT-${Math.floor(1000 + Math.random() * 9000)}`,
      student: "Jamie N.",
      unit,
      date: "Today",
      duration,
      gross: subtotal,
      fee,
      status: "Paid",
    };

    onConfirm(newBooking, newTransaction);
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-tft-border bg-tft-surface">
        <header className="flex items-center justify-between border-b border-tft-border p-4">
          <div>
            <div className="text-xs font-semibold text-tft-primary">
              {done ? "Booking Confirmed" : `Step ${step} of 3`}
            </div>
            <h2 id="booking-modal-title" className="text-base font-bold text-tft-text">
              {done
                ? "Session Reserved"
                : step === 1
                ? "Choose Session Details"
                : step === 2
                ? "Define Learning Goals"
                : "Confirm and Authorize"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="rounded-lg p-1.5 text-tft-muted hover:bg-tft-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {!done && (
          <div
            className="h-1 w-full bg-tft-elevated"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
          >
            <div
              className="h-full bg-tft-primary transition-all duration-200"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        <div className="p-5 text-xs">
          {done ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-tft-success/15 text-tft-success">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-lg font-black text-tft-text">
                Session Confirmed with {tutor.name}
              </h3>
              <p className="mt-1 text-tft-muted">
                {unit} · {slot} · {duration} minutes ({mode})
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <Button variant="secondary" onClick={onClose} className="text-xs py-2">
                  <Calendar className="h-3.5 w-3.5" />
                  View in My Learning
                </Button>
                <Button onClick={onClose} className="text-xs py-2">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Return to Discover
                </Button>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="font-semibold text-tft-text">
                  Target Unit
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="mt-1 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                  >
                    {tutor.units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="font-semibold text-tft-text">
                  Session Topic
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                  >
                    {[
                      "Concept explanation",
                      "Code review",
                      "Exam preparation",
                      "Assignment planning",
                    ].map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <span className="font-semibold text-tft-text block mb-1">
                  Format
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {["Online", "On campus"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cx(
                        "rounded-xl border p-2.5 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
                        mode === m
                          ? "border-tft-primary bg-tft-primary/10 text-tft-text font-semibold"
                          : "border-tft-border text-tft-muted hover:border-tft-primary/40"
                      )}
                    >
                      {m === "Online" ? (
                        <Video className="mx-auto mb-1 h-4 w-4" />
                      ) : (
                        <MapPin className="mx-auto mb-1 h-4 w-4" />
                      )}
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-tft-text block mb-1">
                  Duration
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={cx(
                        "rounded-xl border p-2 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
                        duration === d
                          ? "border-tft-primary bg-tft-primary/10 text-tft-text font-semibold"
                          : "border-tft-border text-tft-muted hover:border-tft-primary/40"
                      )}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-tft-text block mb-1">
                  Available Slots
                </span>
                <div className="space-y-1.5">
                  {tutor.availability.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cx(
                        "flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
                        slot === s
                          ? "border-tft-primary bg-tft-primary/10 text-tft-text font-semibold"
                          : "border-tft-border text-tft-muted hover:border-tft-primary/40"
                      )}
                    >
                      <Clock className="h-3.5 w-3.5 text-tft-primary" />
                      <span>{s}</span>
                      {slot === s && (
                        <Check className="ml-auto h-3.5 w-3.5 text-tft-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-3">
              <label className="font-semibold text-tft-text block">
                What would you like to focus on in this session?
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={4}
                  placeholder="Share the concepts, exercises, or assignment rubric areas you would like to review..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                />
              </label>

              <div>
                <span className="text-[11px] text-tft-muted block mb-1">
                  Quick focus suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Understand lecture concepts",
                    "Prepare for exam",
                    "Review code logic",
                    "Assignment approach",
                    "Debug an error",
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setGoal(sug)}
                      className="rounded-lg border border-tft-border px-2 py-1 text-[11px] text-tft-muted hover:border-tft-primary/50 hover:text-tft-text"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-tft-warning/30 bg-tft-warning/10 p-3 text-xs text-tft-text flex gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-tft-warning" />
                <p>
                  <strong>Academic Integrity Reminder:</strong> Tutors assist with guidance and constructive feedback. Assessed work must remain solely your own.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-tft-border bg-tft-elevated p-4">
                <div className="flex items-center gap-3">
                  <Avatar tutor={tutor} size="sm" />
                  <div>
                    <div className="font-bold text-tft-text text-sm">
                      {tutor.name}
                    </div>
                    <div className="text-[11px] text-tft-muted">
                      {unit} · {slot} · {mode}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-tft-border pt-3">
                  {[
                    ["Duration", `${duration} minutes`],
                    ["Session Format", mode],
                    ["Hourly Rate", `$${tutor.rate.toFixed(2)} AUD`],
                    ["Subtotal", `$${subtotal.toFixed(2)} AUD`],
                    ["Platform Service Fee", `$${fee.toFixed(2)} AUD`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-tft-muted">{k}</span>
                      <span className="text-tft-text font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-tft-border pt-2 text-sm font-bold text-tft-text">
                    <span>Total</span>
                    <span>${total.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-tft-primary/30 bg-tft-primary/10 p-3">
                <div className="flex items-center gap-2 font-semibold text-tft-text">
                  <CreditCard className="h-4 w-4 text-tft-primary" />
                  Simulated Demo Checkout
                </div>
                <p className="mt-1 text-[11px] text-tft-muted leading-relaxed">
                  No payment method is charged. Confirming updates local state and synchronizes with the Tutor View ledger.
                </p>
              </div>
            </div>
          )}

          {!done && (
            <footer className="mt-5 flex justify-between pt-3 border-t border-tft-border">
              <Button
                variant="secondary"
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="text-xs py-2"
              >
                Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} className="text-xs py-2">
                  Continue
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button onClick={handleConfirm} className="text-xs py-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  Confirm and Reserve (${total.toFixed(2)})
                </Button>
              )}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
