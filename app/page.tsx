"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Calendar,
  MessageCircle,
  Users,
  CheckCircle2,
} from "lucide-react";
import { View, Tutor, Booking, Transaction } from "@/lib/types";
import {
  initialTutors,
  initialConversations,
  initialTransactions,
} from "@/lib/mockData";
import { cx } from "@/components/UiPrimitives";
import { NavRail } from "@/components/NavRail";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DiscoverView } from "@/components/DiscoverView";
import { StudentDashboard } from "@/components/StudentDashboard";
import { MessagesView } from "@/components/MessagesView";
import { SavedView } from "@/components/SavedView";
import { TutorApplicationView } from "@/components/TutorApplicationView";
import { TutorDashboardView } from "@/components/TutorDashboardView";
import { HelpView } from "@/components/HelpView";
import { TutorProfileModal } from "@/components/TutorProfileModal";
import { BookingModal } from "@/components/BookingModal";

export default function TftApp() {
  const [view, setView] = useState<View>("discover");
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Set<number>>(new Set([1, 2]));
  const [profile, setProfile] = useState<Tutor | null>(null);
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);
  const [toast, setToast] = useState("");

  const [tutors] = useState<Tutor[]>(initialTutors);
  const [conversations] = useState(initialConversations);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 100,
      tutorId: 1,
      unit: "INFO2222",
      date: "Thu 17 Sep · 4:00 pm",
      duration: 60,
      mode: "Online",
      topic: "SQL queries and authorization",
      status: "Confirmed",
    },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast("");
    }, 2800);
  };

  const handleBookingConfirm = (
    newBooking: Booking,
    newTransaction: Transaction
  ) => {
    setBookings((prev) => [newBooking, ...prev]);
    setTransactions((prev) => [newTransaction, ...prev]);
    notify(`Session reserved with ${bookingTutor?.name || "tutor"}`);
  };

  const toggleSaveCurrent = () => {
    if (!profile) return;
    const nextSaved = new Set(saved);
    if (nextSaved.has(profile.id)) {
      nextSaved.delete(profile.id);
      notify("Tutor removed from saved shortlist");
    } else {
      nextSaved.add(profile.id);
      notify("Tutor saved to your shortlist");
    }
    setSaved(nextSaved);
  };

  const mobileNavItems: Array<{ id: View; label: string; icon: React.ElementType }> = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "learning", label: "Learning", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "tutor", label: "Tutor View", icon: Users },
  ];

  return (
    <div
      className={cx(
        "min-h-screen bg-tft-bg text-tft-text selection:bg-tft-primary/20",
        dark && "dark"
      )}
    >
      <NavRail
        view={view}
        setView={setView}
        dark={dark}
        hasUnreadMessages={conversations.some((c) => c.unread)}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header
          setView={setView}
          dark={dark}
          setDark={setDark}
          search={search}
          setSearch={setSearch}
        />

        <div className="flex-1 pb-16 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.25, 1, 0.5, 1] }}
              className="flex-1"
            >
              {view === "discover" && (
                <DiscoverView
                  tutors={tutors}
                  search={search}
                  setSearch={setSearch}
                  saved={saved}
                  setSaved={setSaved}
                  onProfile={setProfile}
                  onBook={setBookingTutor}
                  toast={notify}
                />
              )}

              {view === "learning" && (
                <StudentDashboard
                  bookings={bookings}
                  tutors={tutors}
                  saved={saved}
                  setSaved={setSaved}
                  onDiscover={() => setView("discover")}
                  onProfile={setProfile}
                  onBook={setBookingTutor}
                />
              )}

              {view === "messages" && (
                <MessagesView
                  conversations={conversations}
                  tutors={tutors}
                  toast={notify}
                />
              )}

              {view === "saved" && (
                <SavedView
                  tutors={tutors}
                  saved={saved}
                  setSaved={setSaved}
                  onProfile={setProfile}
                  onBook={setBookingTutor}
                />
              )}

              {view === "apply" && <TutorApplicationView toast={notify} />}

              {view === "tutor" && (
                <TutorDashboardView
                  transactions={transactions}
                  toast={notify}
                />
              )}

              {view === "help" && <HelpView />}
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-tft-border bg-tft-surface/95 p-1.5 backdrop-blur lg:hidden"
        aria-label="Mobile navigation"
      >
        {mobileNavItems.map(({ id, label, icon: Icon }) => {
          const isActive = view === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={cx(
                "flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition focus:outline-none focus-visible:ring-1 focus-visible:ring-tft-primary",
                isActive
                  ? "bg-tft-primary/10 text-tft-primary font-bold"
                  : "text-tft-muted hover:text-tft-text"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      {profile && (
        <TutorProfileModal
          tutor={profile}
          onClose={() => setProfile(null)}
          onBook={() => {
            setBookingTutor(profile);
            setProfile(null);
          }}
          saved={saved.has(profile.id)}
          onSave={toggleSaveCurrent}
        />
      )}

      {bookingTutor && (
        <BookingModal
          tutor={bookingTutor}
          onClose={() => setBookingTutor(null)}
          onConfirm={handleBookingConfirm}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl border border-tft-border bg-tft-surface px-4 py-3 text-xs font-semibold text-tft-text shadow-lg lg:bottom-6"
        >
          <CheckCircle2 className="h-4 w-4 text-tft-success" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
