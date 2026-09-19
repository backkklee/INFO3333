"use client";

import React from "react";
import {
  Compass,
  Calendar,
  MessageCircle,
  Bookmark,
  GraduationCap,
  HelpCircle,
  Users,
  ChevronRight,
} from "lucide-react";
import { View } from "@/lib/types";
import { TftLogo } from "@/components/TftLogo";
import { cx } from "@/components/UiPrimitives";

interface NavRailProps {
  view: View;
  setView: (v: View) => void;
  dark: boolean;
  hasUnreadMessages?: boolean;
}

export function NavRail({
  view,
  setView,
  dark,
  hasUnreadMessages = true,
}: NavRailProps) {
  const navItems = [
    { id: "discover" as View, label: "Discover Tutors", icon: Compass },
    { id: "learning" as View, label: "My Learning", icon: Calendar },
    { id: "messages" as View, label: "Messages", icon: MessageCircle },
    { id: "saved" as View, label: "Saved Tutors", icon: Bookmark },
    { id: "apply" as View, label: "Become a Tutor", icon: GraduationCap },
    { id: "tutor" as View, label: "Tutor View", icon: Users },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-tft-border bg-tft-surface p-5 lg:flex">
      <button
        onClick={() => setView("discover")}
        className="mb-8 flex items-center px-1 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
      >
        <TftLogo dark={dark} showTagline />
      </button>

      <nav className="space-y-1.5" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cx(
                "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
                isActive
                  ? "bg-tft-primary/10 text-tft-primary font-semibold"
                  : "text-tft-muted hover:bg-tft-elevated hover:text-tft-text"
              )}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-tft-primary"
                  aria-hidden="true"
                />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
              {id === "messages" && hasUnreadMessages && (
                <span
                  className="ml-auto h-2 w-2 rounded-full bg-tft-primary"
                  aria-label="Unread messages"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="my-4 border-t border-tft-border" />

      <button
        onClick={() => setView("help")}
        className={cx(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary",
          view === "help"
            ? "bg-tft-primary/10 text-tft-primary font-semibold"
            : "text-tft-muted hover:bg-tft-elevated hover:text-tft-text"
        )}
      >
        <HelpCircle className="h-4 w-4" />
        <span>Help & Safety</span>
      </button>

      <div className="mt-auto rounded-xl border border-tft-border bg-tft-elevated p-3">
        <button
          onClick={() => setView(view === "tutor" ? "discover" : "tutor")}
          className="flex w-full items-center gap-3 text-left rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-tft-primary text-xs font-bold text-white">
            JN
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-tft-text">Jamie Nguyen</div>
            <div className="truncate text-[11px] text-tft-muted">
              {view === "tutor" ? "Switch to Student View" : "Switch to Tutor View"}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-tft-muted" />
        </button>
      </div>
    </aside>
  );
}
