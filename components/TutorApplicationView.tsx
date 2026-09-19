"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Upload,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Badge, Button } from "@/components/UiPrimitives";

interface TutorApplicationViewProps {
  toast: (msg: string) => void;
}

export function TutorApplicationView({ toast }: TutorApplicationViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("3rd Year");
  const [unitCodes, setUnitCodes] = useState("");
  const [bio, setBio] = useState("");
  const [rate, setRate] = useState(40);
  const [format, setFormat] = useState("Online and on campus");
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast("Please agree to the academic integrity policy to continue");
      return;
    }
    setSubmitted(true);
    toast("Tutor application submitted for review");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <section className="rounded-2xl border border-tft-border bg-tft-surface p-6 sm:p-8">
        <Badge tone="primary">
          <GraduationCap className="h-3.5 w-3.5" />
          For High-Achieving Senior Students
        </Badge>
        <h1 className="mt-3 max-w-2xl text-2xl sm:text-3xl font-black text-tft-text">
          Turn your HD results into structured peer support.
        </h1>
        <p className="mt-2 max-w-xl text-xs sm:text-sm text-tft-muted leading-relaxed">
          Set your schedule, help students master concepts you have completed, and earn competitive peer rates.
        </p>
      </section>

      {submitted ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-tft-border bg-tft-surface p-8 text-center text-xs">
          <CheckCircle2 className="mx-auto h-12 w-12 text-tft-success" />
          <h2 className="mt-4 text-xl font-black text-tft-text">
            Demo Application Submitted
          </h2>
          <p className="mt-2 text-tft-muted leading-relaxed max-w-md mx-auto">
            In production, Tutor For Test verifies student identity and official university transcript evidence before badges are activated.
          </p>
          <Button
            variant="secondary"
            onClick={() => setSubmitted(false)}
            className="mt-5 text-xs py-2"
          >
            Edit Application
          </Button>
        </div>
      ) : (
        <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px] text-xs">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-tft-border bg-tft-surface p-5 sm:p-7"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="font-semibold text-tft-text">
                Degree
                <input
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Computer Science"
                  className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                />
              </label>

              <label className="font-semibold text-tft-text">
                Year of Study
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                >
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>Honours</option>
                  <option>Postgraduate</option>
                </select>
              </label>
            </div>

            <label className="block font-semibold text-tft-text">
              Units Available to Tutor
              <input
                required
                value={unitCodes}
                onChange={(e) => setUnitCodes(e.target.value)}
                placeholder="e.g. INFO2222, COMP2017, DATA2001"
                className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
              />
            </label>

            <div className="rounded-xl border border-dashed border-tft-border bg-tft-elevated/50 p-5 text-center">
              <Upload className="mx-auto h-5 w-5 text-tft-primary" />
              <span className="mt-2 block font-semibold text-tft-text">
                Academic Transcript Verification Upload
              </span>
              <span className="text-[11px] text-tft-muted">
                File upload is simulated for this frontend demonstration
              </span>
            </div>

            <div className="rounded-xl border border-tft-border bg-tft-elevated p-3 space-y-2">
              <span className="font-semibold text-tft-text block">
                Verification Requirements Checklist
              </span>
              {[
                "Official unit result is displayed on transcript",
                "Name matches university enrolment records",
                "Final grade meets High Distinction benchmark",
                "Document is reviewed before profile goes public",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2 text-tft-muted">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-tft-primary"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <label className="block font-semibold text-tft-text">
              Tutoring Approach & Bio
              <textarea
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="How do you structure sessions to help students master unit concepts?"
                className="mt-1.5 w-full resize-none rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="font-semibold text-tft-text">
                Hourly Rate (AUD)
                <input
                  type="number"
                  min="25"
                  max="60"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                />
              </label>

              <label className="font-semibold text-tft-text">
                Delivery Mode
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-tft-border bg-tft-elevated p-2.5 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
                >
                  <option>Online and on campus</option>
                  <option>Online only</option>
                  <option>On campus only</option>
                </select>
              </label>
            </div>

            <label className="flex items-start gap-2 text-tft-muted pt-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 accent-tft-primary"
              />
              <span>
                I agree to the peer tutoring safety and academic integrity guidelines, including never completing assessable tasks for students.
              </span>
            </label>

            <Button type="submit" className="w-full text-xs py-2.5">
              Submit Tutor Application
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-tft-border bg-tft-surface p-4">
              <TrendingUp className="h-5 w-5 text-tft-primary" />
              <h3 className="mt-2 font-bold text-tft-text">Estimated Monthly Earnings</h3>
              <p className="mt-1 text-2xl font-black text-tft-text">
                ~${rate * 4 * 4} AUD
              </p>
              <p className="mt-1 text-tft-muted text-[11px] leading-relaxed">
                Estimated at ${rate}/hr with 4 sessions per week before service fees.
              </p>
            </div>

            <div className="rounded-2xl border border-tft-border bg-tft-surface p-4">
              <ShieldCheck className="h-5 w-5 text-tft-primary" />
              <h3 className="mt-2 font-bold text-tft-text">
                Verified Tutor Status
              </h3>
              <p className="mt-1 text-tft-muted text-[11px] leading-relaxed">
                All approved tutors display verified unit codes matching their demonstrated High Distinction performance.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
