"use client";

import React from "react";
import { Search, GraduationCap, Sun, Moon, Bell } from "lucide-react";
import { View } from "@/lib/types";
import { TftLogo } from "@/components/TftLogo";
import { Button } from "@/components/UiPrimitives";

interface HeaderProps {
  setView: (v: View) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
}

export function Header({
  setView,
  dark,
  setDark,
  search,
  setSearch,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-tft-border bg-tft-surface/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={() => setView("discover")}
        className="flex items-center rounded-lg lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
      >
        <TftLogo dark={dark} compact />
      </button>

      <div className="relative mx-auto max-w-xl flex-1">
        <label htmlFor="global-tutor-search" className="sr-only">
          Search tutors by unit or topic
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tft-muted" />
        <input
          id="global-tutor-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by unit code, topic, or tutor name..."
          className="w-full rounded-xl border border-tft-border bg-tft-bg py-2 pl-9 pr-4 text-xs text-tft-text outline-none placeholder:text-tft-muted focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
        />
      </div>

      <Button
        variant="secondary"
        onClick={() => setView("apply")}
        className="hidden sm:inline-flex text-xs py-2"
      >
        <GraduationCap className="h-3.5 w-3.5" />
        Become a Tutor
      </Button>

      <button
        type="button"
        onClick={() => setDark(!dark)}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="grid h-9 w-9 place-items-center rounded-xl border border-tft-border bg-tft-surface text-tft-muted transition hover:text-tft-text hover:bg-tft-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <button
        type="button"
        aria-label="View notifications"
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-tft-border bg-tft-surface text-tft-muted transition hover:text-tft-text hover:bg-tft-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-primary"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-tft-primary" />
      </button>
    </header>
  );
}
