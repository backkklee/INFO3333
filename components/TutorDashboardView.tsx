"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  Clock,
  Star,
  Users,
  Calendar,
  Landmark,
  X,
  Download,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Transaction } from "@/lib/types";
import { Badge, Button, Stars } from "@/components/UiPrimitives";

interface TutorDashboardViewProps {
  transactions: Transaction[];
  toast: (msg: string) => void;
}

export function TutorDashboardView({
  transactions,
  toast,
}: TutorDashboardViewProps) {
  const [showPayout, setShowPayout] = useState(false);
  const [payoutProcessing, setPayoutProcessing] = useState(false);
  const [payoutDone, setPayoutDone] = useState(false);

  const grossEarnings = useMemo(
    () => transactions.reduce((sum, item) => sum + item.gross, 0),
    [transactions]
  );
  const totalFees = useMemo(
    () => transactions.reduce((sum, item) => sum + item.fee, 0),
    [transactions]
  );
  const netEarnings = grossEarnings - totalFees;

  const handleRequestPayout = () => {
    setPayoutProcessing(true);
    // 800ms bank simulation
    setTimeout(() => {
      setPayoutProcessing(false);
      setPayoutDone(true);
      toast("Demo payout scheduled for transfer");
    }, 900);
  };

  const closePayoutModal = () => {
    setShowPayout(false);
    setPayoutProcessing(false);
    setPayoutDone(false);
  };

  const bars = [38, 55, 45, 76, 61, 88, 70];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="primary">Tutor Finances & Performance</Badge>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-tft-text">
            Tutor Dashboard
          </h1>
          <p className="mt-1 text-xs text-tft-muted">
            Track student bookings, session earnings, reviews, and demo payouts.
          </p>
        </div>
        <Button onClick={() => setShowPayout(true)} className="h-11 px-5 text-xs font-bold">
          <Banknote className="h-4 w-4" />
          Withdraw Available Balance
        </Button>
      </header>

      {/* Enlarged Presentation Metric Tiles */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-tft-primary/40 bg-tft-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-tft-primary/30 bg-tft-primary/10 text-tft-primary">
              <Banknote className="h-6 w-6 stroke-[1.75]" />
            </div>
            <Badge tone="success">+12.4% this week</Badge>
          </div>
          <div className="mt-5 text-3xl sm:text-4xl font-black text-tft-text tracking-tight">
            ${netEarnings.toFixed(2)}
          </div>
          <div className="mt-1 text-xs font-bold text-tft-text">
            Available Net Balance
          </div>
          <div className="text-[11px] text-tft-muted">After platform service fee</div>
        </div>

        <div className="rounded-2xl border border-tft-border bg-tft-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-tft-border bg-tft-elevated text-tft-primary">
              <Clock className="h-6 w-6 stroke-[1.75]" />
            </div>
            <span className="text-[11px] font-semibold text-tft-muted">This Month</span>
          </div>
          <div className="mt-5 text-3xl sm:text-4xl font-black text-tft-text tracking-tight">
            14.5 hrs
          </div>
          <div className="mt-1 text-xs font-bold text-tft-text">
            Tutoring Hours
          </div>
          <div className="text-[11px] text-tft-muted">8 completed sessions</div>
        </div>

        <div className="rounded-2xl border border-tft-border bg-tft-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-tft-border bg-tft-elevated text-tft-primary">
              <Star className="h-6 w-6 stroke-[1.75]" />
            </div>
            <Badge tone="primary">Verified</Badge>
          </div>
          <div className="mt-5 text-3xl sm:text-4xl font-black text-tft-text tracking-tight">
            4.9 / 5.0
          </div>
          <div className="mt-1 text-xs font-bold text-tft-text">
            Average Peer Rating
          </div>
          <div className="text-[11px] text-tft-muted">Based on 38 student reviews</div>
        </div>

        <div className="rounded-2xl border border-tft-border bg-tft-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-tft-border bg-tft-elevated text-tft-primary">
              <Users className="h-6 w-6 stroke-[1.75]" />
            </div>
            <span className="text-[11px] font-semibold text-tft-success">High Retention</span>
          </div>
          <div className="mt-5 text-3xl sm:text-4xl font-black text-tft-text tracking-tight">
            78%
          </div>
          <div className="mt-1 text-xs font-bold text-tft-text">
            Repeat Students
          </div>
          <div className="text-[11px] text-tft-muted">7 students rebooked follow-ups</div>
        </div>
      </section>

      {/* Analytics & Reviews Breakdown */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-2xl border border-tft-border bg-tft-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-tft-text">Earnings Overview</h2>
              <p className="mt-0.5 text-xs text-tft-muted">
                Gross peer tutoring earnings over the last 7 weeks
              </p>
            </div>
            <span className="text-xs font-semibold text-tft-muted">Last 7 weeks</span>
          </div>

          <div
            className="mt-6 flex h-44 items-end gap-3"
            aria-label="Weekly earnings chart"
          >
            {bars.map((height, idx) => (
              <div
                key={idx}
                className="flex h-full flex-1 flex-col justify-end gap-2"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="w-full rounded-t bg-tft-primary transition-colors hover:bg-tft-primary-hover"
                />
                <span className="text-center text-[11px] text-tft-muted font-semibold">
                  W{idx + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-tft-border pt-4 text-xs">
            <div>
              <span className="text-tft-muted text-[11px] font-medium block">
                Gross Total
              </span>
              <p className="text-base font-bold text-tft-text">
                ${grossEarnings.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-tft-muted text-[11px] font-medium block">
                Service Fees
              </span>
              <p className="text-base font-bold text-tft-muted">
                -${totalFees.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-tft-muted text-[11px] font-medium block">
                Net Income
              </span>
              <p className="text-base font-bold text-tft-success">
                ${netEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-tft-border bg-tft-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-tft-text">Rating Summary</h2>
              <p className="mt-0.5 text-xs text-tft-muted">
                Student evaluations across completed sessions
              </p>
            </div>
            <Stars rating={4.9} />
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-5xl font-black text-tft-text">4.9</span>
            <div className="pb-1 text-xs text-tft-muted">
              38 verified student reviews
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-xs">
            {[
              [5, 89],
              [4, 8],
              [3, 3],
              [2, 0],
              [1, 0],
            ].map(([stars, width]) => (
              <div
                key={stars}
                className="grid grid-cols-[14px_1fr_28px] items-center gap-2.5"
              >
                <span className="text-tft-muted font-bold">{stars}</span>
                <div className="h-2.5 overflow-hidden rounded bg-tft-elevated">
                  <div
                    className="h-full bg-tft-primary rounded"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-right text-[11px] text-tft-muted">
                  {width}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-tft-border bg-tft-elevated p-3.5 text-xs">
            <div className="flex justify-between font-semibold text-tft-text">
              <span>Jamie L. · INFO2222</span>
              <Badge tone="success">5.0</Badge>
            </div>
            <p className="mt-1 text-tft-muted leading-relaxed">
              &ldquo;Clear explanations and practical examples without completing the assessable tasks for me.&rdquo;
            </p>
          </div>
        </section>
      </div>

      {/* Availability & Booking Requests */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-tft-border bg-tft-surface p-6">
          <h2 className="text-base font-bold text-tft-text">Upcoming Sessions</h2>
          <div className="mt-3 space-y-2 text-xs">
            {[
              "Jamie · INFO2222 · Thu 4:00 pm",
              "Morgan · COMP2017 · Sat 10:00 am",
            ].map((sess) => (
              <div
                key={sess}
                className="flex items-center gap-3 rounded-xl border border-tft-border bg-tft-elevated p-3.5"
              >
                <Calendar className="h-4 w-4 text-tft-primary shrink-0 stroke-[1.75]" />
                <span className="text-tft-text font-semibold">{sess}</span>
                <Button variant="secondary" className="ml-auto text-xs py-1.5 px-3">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-tft-border bg-tft-surface p-6">
          <h2 className="text-base font-bold text-tft-text">New Booking Requests</h2>
          <div className="mt-3 rounded-xl border border-tft-border bg-tft-elevated p-4 text-xs">
            <div className="font-bold text-tft-text text-sm">Taylor · INFO2222</div>
            <div className="mt-0.5 text-[11px] text-tft-muted">
              Friday 5:30 pm · 60 min · Online session
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={() => toast("Booking accepted")}
                className="text-xs py-2 px-3.5 font-bold"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast("Alternative time suggested")}
                className="text-xs py-2 px-3.5"
              >
                Suggest Alternative
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Transaction Ledger Table */}
      <section className="overflow-hidden rounded-2xl border border-tft-border bg-tft-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tft-border p-5">
          <div>
            <h2 className="text-base font-bold text-tft-text">
              Recent Session Ledger
            </h2>
            <p className="mt-0.5 text-xs text-tft-muted">
              Synchronized earnings ledger updated upon student booking
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => toast("Exporting simulated statement...")}
            className="text-xs py-2 px-4"
          >
            <Download className="h-3.5 w-3.5" />
            Export Statement
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-tft-elevated text-[11px] text-tft-muted uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Session</th>
                <th className="px-5 py-3.5">Unit</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Gross</th>
                <th className="px-5 py-3.5">Service Fee</th>
                <th className="px-5 py-3.5">Net Payout</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tft-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-tft-elevated/50">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-tft-text">{tx.student}</div>
                    <div className="text-[10px] text-tft-muted">
                      {tx.date} · {tx.id}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-tft-text">{tx.unit}</td>
                  <td className="px-5 py-3.5 text-tft-muted">{tx.duration} min</td>
                  <td className="px-5 py-3.5 text-tft-text">${tx.gross.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-tft-muted">-${tx.fee.toFixed(2)}</td>
                  <td className="px-5 py-3.5 font-black text-tft-success">
                    ${(tx.gross - tx.fee).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={tx.status === "Paid" ? "success" : "warning"}>
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payout Withdrawal Modal with Bank Transfer Animation */}
      <AnimatePresence>
        {showPayout && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payout-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md rounded-2xl border border-tft-border bg-tft-surface p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-tft-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-tft-border bg-tft-elevated text-tft-primary">
                    <Landmark className="h-5 w-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 id="payout-modal-title" className="text-sm font-bold text-tft-text">
                      Withdraw Earnings
                    </h3>
                    <p className="text-[11px] text-tft-muted">Simulated Bank Transfer</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close payout dialog"
                  onClick={closePayoutModal}
                  className="rounded-lg p-1.5 text-tft-muted hover:bg-tft-elevated hover:text-tft-text"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {payoutProcessing ? (
                <div className="py-10 text-center space-y-4">
                  <div className="relative mx-auto h-16 w-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-full w-full rounded-full border-3 border-tft-border border-t-tft-primary"
                    />
                    <Landmark className="absolute inset-0 m-auto h-6 w-6 text-tft-primary stroke-[1.75]" />
                  </div>
                  <p className="text-sm font-bold text-tft-text">
                    Initiating clearing transfer...
                  </p>
                  <p className="text-xs text-tft-muted">
                    Routing ${netEarnings.toFixed(2)} AUD to Demo CBA Account ···· 4821
                  </p>
                </div>
              ) : payoutDone ? (
                <div className="py-8 text-center text-xs space-y-4">
                  {/* SVG Checkmark */}
                  <div className="relative mx-auto grid h-16 w-16 place-items-center">
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: [0.8, 1.4, 1.6], opacity: [0.8, 0.4, 0] }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-tft-success/25"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      className="relative grid h-14 w-14 place-items-center rounded-full bg-tft-success text-white shadow-lg"
                    >
                      <svg
                        className="h-8 w-8 stroke-white"
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
                          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-tft-text">
                      Payout Scheduled
                    </h3>
                    <p className="mt-1 text-tft-muted">
                      ${netEarnings.toFixed(2)} AUD transfer initiated.
                    </p>
                  </div>

                  <div className="rounded-xl border border-tft-border bg-tft-elevated p-3 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-tft-muted">Destination:</span>
                      <span className="font-bold text-tft-text">CBA Student Saver · 4821</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tft-muted">Estimated Settlement:</span>
                      <span className="font-bold text-tft-success">Tomorrow · 9:00 AM</span>
                    </div>
                  </div>

                  <Button onClick={closePayoutModal} className="w-full h-10 text-xs font-bold">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="mt-4 text-xs space-y-4">
                  <div className="rounded-xl border border-tft-border bg-tft-elevated p-4 space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-tft-muted font-medium">Available Net Balance:</span>
                      <span className="text-xl font-black text-tft-text">
                        ${netEarnings.toFixed(2)} AUD
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-tft-muted">Linked Destination:</span>
                      <span className="text-tft-text font-semibold">Demo CBA Account · 4821</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-tft-muted">Estimated Arrival:</span>
                      <span className="text-tft-text font-semibold">1–2 Business Days</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-tft-primary/30 bg-tft-primary/10 p-3 text-[11px] text-tft-muted flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-tft-primary shrink-0 stroke-[1.75]" />
                    <span>No real bank transfer is processed. Simulated demo settlement.</span>
                  </div>

                  <Button
                    onClick={handleRequestPayout}
                    className="w-full h-11 text-xs font-bold"
                  >
                    Confirm Payout Transfer (${netEarnings.toFixed(2)} AUD)
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
