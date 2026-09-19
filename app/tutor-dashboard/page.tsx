"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, CheckCircle2 } from "lucide-react";
import { initialTransactions } from "@/lib/mockData";
import { Transaction } from "@/lib/types";
import { TutorDashboardView } from "@/components/TutorDashboardView";
import { Footer } from "@/components/Footer";
import { TftLogo } from "@/components/TftLogo";
import { cx } from "@/components/UiPrimitives";

export default function StandaloneTutorDashboard() {
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState("");
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast("");
    }, 2800);
  };

  return (
    <div
      className={cx(
        "min-h-screen bg-tft-bg text-tft-text selection:bg-tft-primary/20",
        dark && "dark"
      )}
    >
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-tft-border bg-tft-surface/90 px-4 sm:px-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-tft-border bg-tft-elevated px-3 py-1.5 text-xs font-semibold text-tft-text transition hover:border-tft-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-tft-primary" />
            <span>Student Platform</span>
          </Link>
          <TftLogo dark={dark} compact />
        </div>

        <button
          type="button"
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="grid h-9 w-9 place-items-center rounded-xl border border-tft-border bg-tft-surface text-tft-muted transition hover:text-tft-text hover:bg-tft-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <main className="max-w-7xl mx-auto py-4">
        <TutorDashboardView
          transactions={transactions}
          toast={notify}
        />
      </main>

      <Footer />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-tft-border bg-tft-surface px-4 py-3 text-xs font-semibold text-tft-text shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-tft-success" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}