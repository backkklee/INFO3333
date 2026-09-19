"use client";

import React, { useMemo, useState } from "react";
import {
  Banknote,
  Clock,
  Star,
  Users,
  Calendar,
  Landmark,
  X,
  CheckCircle2,
  Download,
  Check,
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
  const [payoutRequested, setPayoutRequested] = useState(false);

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
    setPayoutRequested(true);
    toast("Demo payout requested successfully");
    setTimeout(() => {
      setShowPayout(false);
      setPayoutRequested(false);
    }, 1500);
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
        <Button onClick={() => setShowPayout(true)} className="text-xs py-2">
          <Banknote className="h-3.5 w-3.5" />
          Withdraw Available Balance
        </Button>
      </header>

      {/* Metric Tiles */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-tft-primary/40 bg-tft-surface p-4">
          <div className="flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-tft-primary/15 text-tft-primary">
              <Banknote className="h-4 w-4" />
            </div>
            <Badge tone="success">+12.4% this week</Badge>
          </div>
          <div className="mt-4 text-2xl font-black text-tft-text">
            ${netEarnings.toFixed(2)} AUD
          </div>
          <div className="text-xs font-semibold text-tft-text">
            Available Balance
          </div>
          <div className="text-[11px] text-tft-muted">After platform service fee</div>
        </div>

        <div className="rounded-2xl border border-tft-border bg-tft-surface p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-tft-elevated text-tft-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-4 text-2xl font-black text-tft-text">14.5 hrs</div>
          <div className="text-xs font-semibold text-tft-text">Tutoring Hours</div>
          <div className="text-[11px] text-tft-muted">8 completed sessions this month</div>
        </div>

        <div className="rounded-2xl border border-tft-border bg-tft-surface p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-tft-elevated text-tft-primary">
            <Star className="h-4 w-4" />
          </div>
          <div className="mt-4 text-2xl font-black text-tft-text">4.9 / 5.0</div>
          <div className="text-xs font-semibold text-tft-text">Average Rating</div>
          <div className="text-[11px] text-tft-muted">Based on 38 verified student reviews</div>
        </div>

        <div className="rounded-2xl border border-tft-border bg-tft-surface p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-tft-elevated text-tft-primary">
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-4 text-2xl font-black text-tft-text">78%</div>
          <div className="text-xs font-semibold text-tft-text">Repeat Students</div>
          <div className="text-[11px] text-tft-muted">7 students rebooked for follow-up</div>
        </div>
      </section>

      {/* Analytics & Reviews Breakdown */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-2xl border border-tft-border bg-tft-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-tft-text">Earnings Overview</h2>
              <p className="mt-0.5 text-xs text-tft-muted">
                Gross peer tutoring earnings over the last 7 weeks
              </p>
            </div>
            <span className="text-xs font-medium text-tft-muted">Last 7 weeks</span>
          </div>

          <div
            className="mt-6 flex h-40 items-end gap-2.5"
            aria-label="Weekly earnings chart"
          >
            {bars.map((height, idx) => (
              <div
                key={idx}
                className="flex h-full flex-1 flex-col justify-end gap-1.5"
              >
                <div
                  className="w-full rounded-t bg-tft-primary transition-all duration-200"
                  style={{ height: `${height}%` }}
                />
                <span className="text-center text-[10px] text-tft-muted">
                  W{idx + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-tft-border pt-4 text-xs">
            <div>
              <span className="text-tft-muted text-[11px]">Gross Total</span>
              <p className="font-bold text-tft-text">${grossEarnings.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-tft-muted text-[11px]">Service Fees</span>
              <p className="font-bold text-tft-muted">-${totalFees.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-tft-muted text-[11px]">Net Income</span>
              <p className="font-bold text-tft-success">${netEarnings.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-tft-border bg-tft-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-tft-text">Rating Summary</h2>
              <p className="mt-0.5 text-xs text-tft-muted">
                Student evaluations across completed sessions
              </p>
            </div>
            <Stars rating={4.9} />
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-black text-tft-text">4.9</span>
            <div className="pb-1 text-xs text-tft-muted">
              38 verified student reviews
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            {[
              [5, 89],
              [4, 8],
              [3, 3],
              [2, 0],
              [1, 0],
            ].map(([stars, width]) => (
              <div
                key={stars}
                className="grid grid-cols-[14px_1fr_28px] items-center gap-2"
              >
                <span className="text-tft-muted">{stars}</span>
                <div className="h-2 overflow-hidden rounded bg-tft-elevated">
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

          <div className="mt-4 rounded-xl border border-tft-border bg-tft-elevated p-3 text-xs">
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
        <section className="rounded-2xl border border-tft-border bg-tft-surface p-5">
          <h2 className="text-sm font-bold text-tft-text">Upcoming Sessions</h2>
          <div className="mt-3 space-y-2 text-xs">
            {[
              "Jamie · INFO2222 · Thu 4:00 pm",
              "Morgan · COMP2017 · Sat 10:00 am",
            ].map((sess) => (
              <div
                key={sess}
                className="flex items-center gap-3 rounded-xl border border-tft-border bg-tft-elevated p-3"
              >
                <Calendar className="h-4 w-4 text-tft-primary shrink-0" />
                <span className="text-tft-text font-medium">{sess}</span>
                <Button variant="secondary" className="ml-auto text-xs py-1 px-2.5">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-tft-border bg-tft-surface p-5">
          <h2 className="text-sm font-bold text-tft-text">New Booking Requests</h2>
          <div className="mt-3 rounded-xl border border-tft-border bg-tft-elevated p-3 text-xs">
            <div className="font-semibold text-tft-text">Taylor · INFO2222</div>
            <div className="mt-0.5 text-[11px] text-tft-muted">
              Friday 5:30 pm · 60 min · Online session
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={() => toast("Booking accepted")}
                className="text-xs py-1.5 px-3"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast("Alternative time suggested")}
                className="text-xs py-1.5 px-3"
              >
                Suggest Alternative
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Transaction Ledger Table */}
      <section className="overflow-hidden rounded-2xl border border-tft-border bg-tft-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tft-border p-4">
          <div>
            <h2 className="text-sm font-bold text-tft-text">
              Recent Session Ledger
            </h2>
            <p className="mt-0.5 text-xs text-tft-muted">
              Synchronized earnings ledger updated upon student booking
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => toast("Exporting simulated statement...")}
            className="text-xs py-1.5 px-3"
          >
            <Download className="h-3.5 w-3.5" />
            Export Statement
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-tft-elevated text-[11px] text-tft-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Gross</th>
                <th className="px-4 py-3">Service Fee</th>
                <th className="px-4 py-3">Net Payout</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tft-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-tft-elevated/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-tft-text">{tx.student}</div>
                    <div className="text-[10px] text-tft-muted">
                      {tx.date} · {tx.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-tft-text">{tx.unit}</td>
                  <td className="px-4 py-3 text-tft-muted">{tx.duration} min</td>
                  <td className="px-4 py-3 text-tft-text">${tx.gross.toFixed(2)}</td>
                  <td className="px-4 py-3 text-tft-muted">-${tx.fee.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-tft-success">
                    ${(tx.gross - tx.fee).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
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

      {/* Payout Withdrawal Modal */}
      {showPayout && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payout-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-tft-border bg-tft-surface p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-tft-primary/15 text-tft-primary">
                <Landmark className="h-5 w-5" />
              </div>
              <button
                type="button"
                aria-label="Close payout dialog"
                onClick={() => setShowPayout(false)}
                className="rounded-lg p-1 text-tft-muted hover:bg-tft-elevated"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {payoutRequested ? (
              <div className="py-6 text-center text-xs">
                <CheckCircle2 className="mx-auto h-10 w-10 text-tft-success" />
                <h3 className="mt-3 text-base font-black text-tft-text">
                  Payout Requested
                </h3>
                <p className="mt-1 text-tft-muted">
                  ${netEarnings.toFixed(2)} AUD initiated for transfer to demo account.
                </p>
              </div>
            ) : (
              <div className="mt-4 text-xs">
                <h3 id="payout-modal-title" className="text-base font-black text-tft-text">
                  Withdraw Tutoring Earnings
                </h3>
                <p className="mt-1 text-tft-muted leading-relaxed">
                  This panel initiates a simulated payout transfer to your linked student bank account.
                </p>

                <div className="mt-4 rounded-xl border border-tft-border bg-tft-elevated p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-tft-muted">Available Net Balance:</span>
                    <span className="font-bold text-tft-text">
                      ${netEarnings.toFixed(2)} AUD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tft-muted">Linked Account:</span>
                    <span className="text-tft-text font-medium">Demo CBA Account · 4821</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tft-muted">Estimated Settlement:</span>
                    <span className="text-tft-text font-medium">1–2 Business Days</span>
                  </div>
                </div>

                <Button onClick={handleRequestPayout} className="mt-5 w-full text-xs py-2.5">
                  Confirm Demo Payout (${netEarnings.toFixed(2)} AUD)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
