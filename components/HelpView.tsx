"use client";

import React from "react";
import { ShieldCheck, BookOpen, CreditCard, Award } from "lucide-react";

export function HelpView() {
  const policies = [
    {
      title: "Academic Integrity Policy",
      desc: "Peer tutors provide conceptual explanations, rubric guidance, and debugging strategies. Tutors must never author, solve, or complete assessable student work.",
      icon: ShieldCheck,
    },
    {
      title: "Verification Standards",
      desc: "Tutors must achieve High Distinction (85%+) in the specific unit and complete transcript review before receiving their verified badge.",
      icon: Award,
    },
    {
      title: "Demo Economics & Payments",
      desc: "All financial figures, transactions, and withdrawal requests in this prototype are client-side simulations. No real money or card details are processed.",
      icon: CreditCard,
    },
    {
      title: "Session Quality & Feedback",
      desc: "Students evaluate tutors after each completed session. Persistent low ratings or policy breaches result in immediate credential suspension.",
      icon: BookOpen,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <div>
        <ShieldCheck className="h-8 w-8 text-tft-primary" />
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-tft-text">
          Help & Academic Safety
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-tft-muted leading-relaxed">
          Tutor For Test operates strictly within university academic honesty guidelines.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 text-xs">
        {policies.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-tft-border bg-tft-surface p-5"
            >
              <Icon className="h-5 w-5 text-tft-primary" />
              <h2 className="mt-2 font-bold text-tft-text text-sm">{p.title}</h2>
              <p className="mt-1.5 leading-relaxed text-tft-muted">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
