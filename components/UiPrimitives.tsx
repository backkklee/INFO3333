"use client";

import React from "react";
import { Star } from "lucide-react";
import { Tutor } from "@/lib/types";

export const cx = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary focus-visible:ring-offset-2 focus-visible:ring-offset-tft-bg disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-tft-primary text-white hover:bg-tft-primary-hover",
        variant === "secondary" &&
          "border border-tft-border bg-tft-surface text-tft-text hover:bg-tft-elevated",
        variant === "ghost" &&
          "text-tft-muted hover:bg-tft-elevated hover:text-tft-text",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "default",
  className = "",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "default" | "success" | "warning" | "primary";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "default" &&
          "border-tft-border bg-tft-elevated text-tft-muted",
        tone === "success" &&
          "border-tft-success/30 bg-tft-success/10 text-tft-success",
        tone === "warning" &&
          "border-tft-warning/30 bg-tft-warning/10 text-tft-warning",
        tone === "primary" &&
          "border-tft-primary/30 bg-tft-primary/10 text-tft-primary",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Avatar({
  tutor,
  size = "md",
}: {
  tutor: Tutor;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      aria-label={`${tutor.name} avatar`}
      className={cx(
        "grid shrink-0 place-items-center rounded-xl border border-tft-border bg-tft-elevated font-bold text-tft-text",
        size === "sm" && "h-10 w-10 text-xs",
        size === "md" && "h-14 w-14 text-base",
        size === "lg" && "h-24 w-24 text-2xl"
      )}
    >
      {tutor.initials}
    </div>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-tft-text">
      <Star className="h-4 w-4 fill-tft-warning text-tft-warning" />
      {rating.toFixed(1)}
    </span>
  );
}
