"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BookOpen,
  Compass,
  Code2,
  Award,
  FileCheck,
} from "lucide-react";
import { Tutor, Unit, Booking, Transaction } from "@/lib/types";
import { Avatar, Button, cx } from "@/components/UiPrimitives";

interface BookingModalProps {
  tutor: Tutor;
  onClose: () => void;
  onConfirm: (booking: Booking, transaction: Transaction) => void;
}

type VerificationStage = "authorizing" | "policy" | "confirmed";

export function BookingModal({ tutor, onClose, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [unit, setUnit] = useState<Unit>(tutor.units[0]);
  const [mode, setMode] = useState("Online");
  const [duration, setDuration] = useState(60);
  const [slot, setSlot] = useState(tutor.availability[0]);
  const [goal, setGoal] = useState("Understand lecture concepts");
  const [notes, setNotes] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationStage, setVerificationStage] =
    useState<VerificationStage>("authorizing");
  const [done, setDone] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const subtotal = tutor.rate * (duration / 60);
  const fee = Number((subtotal * 0.08).toFixed(2));
  const total = subtotal + fee;

  const handleNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleConfirm = () => {
    setVerifying(true);
    setVerificationStage("authorizing");
    const refCode = `TFT-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);

    // Beat 1: Authorizing payment
    setTimeout(() => {
      setVerificationStage("policy");
    }, 600);

    // Beat 2: Validating academic policy and confirming
    setTimeout(() => {
      setVerificationStage("confirmed");
      setVerifying(false);
      setDone(true);

      const bookingId = Date.now();
      const newBooking: Booking = {
        id: bookingId,
        tutorId: tutor.id,
        unit,
        date: slot,
        duration,
        mode,
        topic: goal,
        status: "Confirmed",
      };

      const newTransaction: Transaction = {
        id: refCode,
        student: "Jamie N.",
        unit,
        date: "Today",
        duration,
        gross: subtotal,
        fee,
        status: "Paid",
      };

      onConfirm(newBooking, newTransaction);
    }, 1200);
  };

  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -24 : 24,
      opacity: 0,
    }),
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/65 p-3 sm:p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-tft-border bg-tft-surface shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between border-b border-tft-border px-5 py-4">
          <div>
            <div className="text-xs font-bold text-tft-primary uppercase tracking-wider">
              {done ? "Booking Reserved" : `Step ${step} of 3`}
            </div>
            <h2 id="booking-modal-title" className="text-base font-bold text-tft-text">
              {done
                ? "Session Confirmed"
                : step === 1
                ? "Choose Session Format"
                : step === 2
                ? "Select Learning Focus"
                : "Review and Authorize"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="rounded-xl p-1.5 text-tft-muted hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {!done && !verifying && (
          <div
            className="h-1.5 w-full bg-tft-elevated"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
          >
            <div
              className="h-full bg-tft-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        <div className="p-5 sm:p-6 text-xs min-h-[380px] flex flex-col justify-between">
          {/* Verification Stepper Animation */}
          {verifying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="my-auto py-12 text-center space-y-5"
            >
              <div className="relative mx-auto h-20 w-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-full w-full rounded-full border-3 border-tft-border border-t-tft-primary"
                />
                <ShieldCheck className="absolute inset-0 m-auto h-8 w-8 text-tft-primary stroke-[1.75]" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={verificationStage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-1"
                >
                  <p className="text-sm font-bold text-tft-text">
                    {verificationStage === "authorizing"
                      ? "Authorizing simulated session checkout..."
                      : "Verifying unit prerequisites and academic safety..."}
                  </p>
                  <p className="text-xs text-tft-muted">
                    {verificationStage === "authorizing"
                      ? `$${total.toFixed(2)} AUD via demo student account`
                      : "Ensuring peer tutoring compliance guidelines"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Confirmation Screen Animation */}
          {done && !verifying && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.09, delayChildren: 0.1 },
                },
              }}
              className="py-3 text-center space-y-4"
            >
              {/* SVG Self-Drawing Checkmark with Radiant Pulse */}
              <div className="relative mx-auto grid h-20 w-20 place-items-center">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: [0.8, 1.5, 1.7], opacity: [0.8, 0.35, 0] }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-tft-success/25"
                />

                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 20 }}
                  className="relative grid h-16 w-16 place-items-center rounded-full bg-tft-success text-white shadow-lg"
                >
                  <svg
                    className="h-9 w-9 stroke-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.38, delay: 0.15, ease: "easeOut" }}
                    />
                  </svg>
                </motion.div>
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="inline-flex items-center gap-1.5 rounded-full border border-tft-success/30 bg-tft-success/10 px-3.5 py-1 text-xs font-bold text-tft-success">
                  {bookingRef} · Confirmed Reservation
                </div>
                <h3 className="mt-2 text-xl font-black text-tft-text">
                  Session Booked with {tutor.name}
                </h3>
                <p className="mt-0.5 text-xs text-tft-muted">
                  Calendar invite and room link have been generated.
                </p>
              </motion.div>

              {/* Digital Session Pass Card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mx-auto max-w-md rounded-xl border border-tft-border bg-tft-elevated p-4 text-left text-xs space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center border-b border-tft-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-tft-primary stroke-[1.75]" />
                    <span className="font-bold text-tft-text text-sm">
                      {unit} Peer Tutoring
                    </span>
                  </div>
                  <span className="font-bold text-tft-primary">{mode}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-tft-muted block font-medium">
                      Scheduled Time:
                    </span>
                    <span className="font-bold text-tft-text">{slot}</span>
                  </div>
                  <div>
                    <span className="text-tft-muted block font-medium">
                      Session Duration:
                    </span>
                    <span className="font-bold text-tft-text">
                      {duration} Minutes
                    </span>
                  </div>
                </div>

                <div className="border-t border-tft-border pt-2 text-[11px] flex justify-between text-tft-muted">
                  <span>Payment Status:</span>
                  <span className="font-bold text-tft-success">
                    Authorised (${total.toFixed(2)} AUD)
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-wrap justify-center gap-2 pt-2"
              >
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="h-11 px-4 text-xs font-bold transition-transform active:scale-95"
                >
                  <Calendar className="h-4 w-4 text-tft-primary" />
                  Sync with Google Calendar
                </Button>
                <Button
                  onClick={onClose}
                  className="h-11 px-4 text-xs font-bold transition-transform active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message {tutor.name}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 1: Tile Selectors */}
          {!done && !verifying && step === 1 && (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key="step-1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-4"
              >
                <div>
                  <span className="font-bold text-tft-text text-xs block mb-2">
                    Select Target Unit
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {tutor.units.map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={cx(
                          "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                          unit === u
                            ? "border-tft-primary bg-tft-primary/10 ring-1 ring-tft-primary"
                            : "border-tft-border bg-tft-elevated hover:border-tft-primary/50"
                        )}
                      >
                        <BookOpen className="h-4 w-4 text-tft-primary shrink-0 stroke-[1.75]" />
                        <div>
                          <div className="font-black text-xs text-tft-text">{u}</div>
                          <div className="text-[10px] text-tft-muted">
                            Verified HD Result
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-tft-text text-xs block mb-2">
                    Session Format
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: "Online",
                        label: "Online Video Room",
                        sub: "Screen share & audio",
                        icon: Video,
                      },
                      {
                        id: "On campus",
                        label: "Campus Library",
                        sub: "Collaborative study desk",
                        icon: MapPin,
                      },
                    ].map(({ id, label, sub, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setMode(id)}
                        className={cx(
                          "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                          mode === id
                            ? "border-tft-primary bg-tft-primary/10 ring-1 ring-tft-primary"
                            : "border-tft-border bg-tft-elevated hover:border-tft-primary/50"
                        )}
                      >
                        <Icon className="h-4 w-4 text-tft-primary stroke-[1.75] mb-1.5" />
                        <span className="font-bold text-xs text-tft-text">
                          {label}
                        </span>
                        <span className="text-[10px] text-tft-muted">{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-tft-text text-xs block mb-2">
                    Session Duration
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 45, 60].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={cx(
                          "rounded-xl border p-2.5 text-center font-bold text-xs transition-all",
                          duration === d
                            ? "border-tft-primary bg-tft-primary/10 text-tft-primary ring-1 ring-tft-primary"
                            : "border-tft-border bg-tft-elevated text-tft-muted hover:text-tft-text"
                        )}
                      >
                        {d} Minutes
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-tft-text text-xs block mb-2">
                    Available Time Slot
                  </span>
                  <div className="space-y-1.5">
                    {tutor.availability.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlot(s)}
                        className={cx(
                          "flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition-all",
                          slot === s
                            ? "border-tft-primary bg-tft-primary/10 text-tft-text font-semibold ring-1 ring-tft-primary"
                            : "border-tft-border bg-tft-elevated text-tft-muted hover:border-tft-primary/50"
                        )}
                      >
                        <Clock className="h-3.5 w-3.5 text-tft-primary" />
                        <span>{s}</span>
                        {slot === s && (
                          <Check className="ml-auto h-4 w-4 text-tft-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Step 2: Goal Tiles */}
          {!done && !verifying && step === 2 && (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key="step-2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-4"
              >
                <div>
                  <span className="font-bold text-tft-text text-xs block mb-2">
                    Choose Primary Learning Priority
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        title: "Lecture Concepts",
                        desc: "Break down weekly core theory",
                        icon: Compass,
                      },
                      {
                        title: "Code Architecture",
                        desc: "Review design patterns & syntax",
                        icon: Code2,
                      },
                      {
                        title: "Exam Strategy",
                        desc: "Practice questions & test technique",
                        icon: Award,
                      },
                      {
                        title: "Rubric Review",
                        desc: "Ensure approach aligns with marking",
                        icon: FileCheck,
                      },
                    ].map(({ title, desc, icon: Icon }) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => setGoal(title)}
                        className={cx(
                          "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                          goal === title
                            ? "border-tft-primary bg-tft-primary/10 ring-1 ring-tft-primary"
                            : "border-tft-border bg-tft-elevated hover:border-tft-primary/50"
                        )}
                      >
                        <Icon className="h-4 w-4 text-tft-primary stroke-[1.75] mb-1.5" />
                        <span className="font-bold text-xs text-tft-text">
                          {title}
                        </span>
                        <span className="text-[10px] text-tft-muted">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-tft-text text-xs block mb-1">
                    Specific Questions or Blockers (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Need clarification on SQL joins and query optimization..."
                    className="w-full resize-none rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                  />
                </div>

                <div className="rounded-xl border border-tft-warning/30 bg-tft-warning/10 p-3 text-xs text-tft-text flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-tft-warning stroke-[1.75]" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Academic Integrity Notice:</strong> Tutors support your independent understanding. They must never solve or author assessable tasks for you.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Step 3: Confirmation Summary */}
          {!done && !verifying && step === 3 && (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key="step-3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-tft-border bg-tft-elevated p-4 space-y-3">
                  <div className="flex items-center gap-3 border-b border-tft-border pb-3">
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

                  <div className="space-y-2 text-xs">
                    {[
                      ["Priority Focus", goal],
                      ["Duration", `${duration} Minutes`],
                      ["Hourly Rate", `$${tutor.rate.toFixed(2)} AUD`],
                      ["Session Subtotal", `$${subtotal.toFixed(2)} AUD`],
                      ["Platform Service Fee", `$${fee.toFixed(2)} AUD`],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-tft-muted">{label}</span>
                        <span className="font-semibold text-tft-text">{val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-tft-border pt-2 text-base font-black text-tft-text">
                      <span>Total</span>
                      <span className="text-tft-primary">${total.toFixed(2)} AUD</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-tft-primary/30 bg-tft-primary/10 p-3 flex items-center gap-2.5">
                  <CreditCard className="h-5 w-5 text-tft-primary shrink-0 stroke-[1.75]" />
                  <p className="text-[11px] text-tft-muted leading-relaxed">
                    Demo Checkout: No card details are charged. Clicking reserve triggers simulated authorization and records to the live ledger.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Modal Footer Controls */}
          {!done && !verifying && (
            <footer className="mt-5 flex justify-between pt-3 border-t border-tft-border">
              <Button
                variant="secondary"
                disabled={step === 1}
                onClick={handleBack}
                className="h-10 text-xs px-4"
              >
                Back
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext} className="h-10 text-xs px-5">
                  Continue
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button onClick={handleConfirm} className="h-10 text-xs px-5 font-bold">
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
