"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Banknote, CalendarDays, Check, CheckCircle2,
  ChevronRight, Clock3, CreditCard, Download, GraduationCap, HelpCircle,
  Info, Landmark, MessageCircle, ReceiptText, ShieldCheck, Star, TrendingUp,
  Users, WalletCards, X
} from "lucide-react";

const BRAND = {
  bg: "#0A0D12",
  surface: "#111620",
  elevated: "#1E293B",
  primary: "#0EA5E9",
  primaryDark: "#0284C7",
  accent: "#38BDF8",
  text: "#F8FAFC",
  muted: "#94A3B8",
  success: "#4ADE80",
  warning: "#FBBF24",
};

type PaymentStatus = "pending" | "authorised" | "completed";
type Tab = "tutor" | "student";

type Transaction = {
  id: string;
  student: string;
  unit: string;
  date: string;
  duration: number;
  gross: number;
  fee: number;
  status: "Paid" | "Processing";
};

const transactions: Transaction[] = [
  { id: "TFT-1048", student: "Jamie N.", unit: "INFO2222", date: "18 Sep 2026", duration: 60, gross: 42, fee: 4.2, status: "Paid" },
  { id: "TFT-1041", student: "Morgan K.", unit: "COMP2017", date: "15 Sep 2026", duration: 60, gross: 42, fee: 4.2, status: "Paid" },
  { id: "TFT-1032", student: "Taylor S.", unit: "INFO2222", date: "11 Sep 2026", duration: 45, gross: 31.5, fee: 3.15, status: "Paid" },
  { id: "TFT-1027", student: "Casey R.", unit: "COMP2017", date: "8 Sep 2026", duration: 60, gross: 42, fee: 4.2, status: "Processing" },
];

const cx = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(" ");

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0284C7] shadow-lg shadow-sky-950/30">
        <GraduationCap className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="font-black tracking-tight text-white">Tutor For Test</div>
        <div className="text-[11px] text-[#94A3B8]">Secure demo payments</div>
      </div>
    </div>
  );
}

function Button({ children, secondary = false, className = "", ...props }: any) {
  return (
    <button
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:ring-offset-2 focus:ring-offset-[#0A0D12] disabled:cursor-not-allowed disabled:opacity-50",
        secondary
          ? "border border-[#1E293B] bg-[#111620] text-[#F8FAFC] hover:border-[#38BDF8] hover:bg-[#1E293B]"
          : "bg-[#0284C7] text-white shadow-lg shadow-sky-950/25 hover:bg-[#0EA5E9]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "yellow" }) {
  const color = tone === "green"
    ? "border-green-400/20 bg-green-400/10 text-[#4ADE80]"
    : tone === "yellow"
      ? "border-amber-400/20 bg-amber-400/10 text-[#FBBF24]"
      : "border-sky-400/20 bg-sky-400/10 text-[#38BDF8]";
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", color)}>{children}</span>;
}

function MetricCard({ icon: Icon, label, value, note, accent = false }: any) {
  return (
    <motion.article whileHover={{ y: -2 }} className={cx("rounded-[20px] border p-5 shadow-xl shadow-black/10", accent ? "border-sky-400/25 bg-gradient-to-br from-[#0284C7]/20 to-[#111620]" : "border-[#1E293B] bg-[#111620]")}>
      <div className="flex items-start justify-between">
        <div className={cx("grid h-10 w-10 place-items-center rounded-xl", accent ? "bg-[#0EA5E9] text-white" : "bg-[#1E293B] text-[#38BDF8]")}><Icon className="h-5 w-5" /></div>
        {accent && <Badge tone="green"><TrendingUp className="h-3 w-3" />12.4%</Badge>}
      </div>
      <div className="mt-5 text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm font-semibold text-[#F8FAFC]">{label}</div>
      <div className="mt-1 text-xs text-[#94A3B8]">{note}</div>
    </motion.article>
  );
}

function EarningsChart() {
  const bars = [38, 55, 45, 76, 61, 88, 70];
  return (
    <div className="mt-6 flex h-48 items-end gap-3" aria-label="Seven-week earnings chart">
      {bars.map((height, index) => (
        <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2">
          <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * 0.05 }} className={cx("min-h-2 rounded-t-lg", index === 5 ? "bg-[#38BDF8]" : "bg-[#0284C7]/40 hover:bg-[#0284C7]/70")} />
          <span className="text-center text-[10px] text-[#64748B]">W{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function TutorPayoutUI({ notify }: { notify: (message: string) => void }) {
  const [showPayout, setShowPayout] = useState(false);
  const [paid, setPaid] = useState(false);
  const gross = useMemo(() => transactions.reduce((sum, item) => sum + item.gross, 0), []);
  const fees = useMemo(() => transactions.reduce((sum, item) => sum + item.fee, 0), []);

  function requestPayout() {
    setPaid(true);
    notify("Demo payout requested");
    setTimeout(() => setShowPayout(false), 1300);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge><WalletCards className="h-3.5 w-3.5" />Tutor finances</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Earnings & performance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">Track completed tutoring, student feedback, fees and demo payouts from one place.</p>
        </div>
        <Button onClick={() => setShowPayout(true)}><Banknote className="h-4 w-4" />Withdraw available balance</Button>
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Banknote} label="Available balance" value="$184.95" note="After service fees" accent />
        <MetricCard icon={Clock3} label="Tutoring hours" value="14.5 hrs" note="8 completed sessions this month" />
        <MetricCard icon={Star} label="Tutor rating" value="4.9 / 5" note="Based on 38 sample reviews" />
        <MetricCard icon={Users} label="Repeat students" value="78%" note="7 students booked again" />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-[20px] border border-[#1E293B] bg-[#111620] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-lg font-bold text-white">Earnings overview</h2><p className="mt-1 text-xs text-[#94A3B8]">Gross tutoring income over seven weeks</p></div>
            <select aria-label="Earnings period" className="rounded-xl border border-[#1E293B] bg-[#0A0D12] px-3 py-2 text-xs text-white outline-none focus:border-[#38BDF8]"><option>Last 7 weeks</option><option>This semester</option></select>
          </div>
          <EarningsChart />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#1E293B] pt-5">
            <div><p className="text-xs text-[#94A3B8]">Gross earnings</p><p className="mt-1 font-bold text-white">${gross.toFixed(2)}</p></div>
            <div><p className="text-xs text-[#94A3B8]">Service fees</p><p className="mt-1 font-bold text-white">-${fees.toFixed(2)}</p></div>
            <div><p className="text-xs text-[#94A3B8]">Net earnings</p><p className="mt-1 font-bold text-[#4ADE80]">${(gross - fees).toFixed(2)}</p></div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#1E293B] bg-[#111620] p-5 sm:p-6">
          <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-white">Rating summary</h2><p className="mt-1 text-xs text-[#94A3B8]">Fictional feedback for this demo</p></div><Star className="h-6 w-6 fill-[#FBBF24] text-[#FBBF24]" /></div>
          <div className="mt-5 flex items-end gap-4"><span className="text-5xl font-black text-white">4.9</span><div className="pb-1"><div className="flex gap-1">{[1,2,3,4,5].map(x => <Star key={x} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />)}</div><p className="mt-1 text-xs text-[#94A3B8]">38 reviews</p></div></div>
          <div className="mt-6 space-y-3">{[[5,89],[4,8],[3,3],[2,0],[1,0]].map(([stars, width]) => <div key={stars} className="grid grid-cols-[16px_1fr_32px] items-center gap-3 text-xs"><span className="text-[#94A3B8]">{stars}</span><div className="h-2 overflow-hidden rounded-full bg-[#0A0D12]"><div className="h-full rounded-full bg-[#0EA5E9]" style={{width:`${width}%`}} /></div><span className="text-right text-[#64748B]">{width}%</span></div>)}</div>
          <div className="mt-5 rounded-2xl border border-[#1E293B] bg-[#0A0D12] p-4"><div className="flex items-center justify-between"><span className="text-sm font-bold text-white">Jamie L. · INFO2222</span><Badge tone="green">5.0</Badge></div><p className="mt-2 text-sm leading-6 text-[#CBD5E1]">“Clear explanations and practical examples. The session helped me understand the concept without doing the assessed work for me.”</p></div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-[20px] border border-[#1E293B] bg-[#111620]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] p-5"><div><h2 className="font-bold text-white">Recent session earnings</h2><p className="mt-1 text-xs text-[#94A3B8]">Sample transactions only</p></div><Button secondary><Download className="h-4 w-4" />Export statement</Button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#0A0D12] text-xs uppercase tracking-wide text-[#64748B]"><tr><th className="px-5 py-3">Session</th><th className="px-5 py-3">Unit</th><th className="px-5 py-3">Duration</th><th className="px-5 py-3">Gross</th><th className="px-5 py-3">Fee</th><th className="px-5 py-3">You receive</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{transactions.map(row => <tr key={row.id} className="border-t border-[#1E293B] text-[#CBD5E1] hover:bg-[#1E293B]/45"><td className="px-5 py-4"><div className="font-semibold text-white">{row.student}</div><div className="text-xs text-[#64748B]">{row.date} · {row.id}</div></td><td className="px-5 py-4">{row.unit}</td><td className="px-5 py-4">{row.duration} min</td><td className="px-5 py-4">${row.gross.toFixed(2)}</td><td className="px-5 py-4 text-[#94A3B8]">-${row.fee.toFixed(2)}</td><td className="px-5 py-4 font-bold text-white">${(row.gross-row.fee).toFixed(2)}</td><td className="px-5 py-4"><Badge tone={row.status === "Paid" ? "green" : "yellow"}>{row.status}</Badge></td></tr>)}</tbody></table></div>
      </section>

      <AnimatePresence>{showPayout && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.97}} className="w-full max-w-md rounded-[24px] border border-[#1E293B] bg-[#111620] p-6 shadow-2xl"><div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400/10 text-[#38BDF8]"><Landmark className="h-6 w-6" /></div><button aria-label="Close payout dialog" onClick={() => setShowPayout(false)} className="rounded-xl p-2 text-[#94A3B8] hover:bg-[#1E293B]"><X className="h-5 w-5" /></button></div>{paid ? <div className="py-7 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-[#4ADE80]" /><h3 className="mt-4 text-xl font-black text-white">Payout requested</h3><p className="mt-2 text-sm text-[#94A3B8]">$184.95 will be sent to the demo bank account.</p></div> : <><h3 className="mt-5 text-xl font-black text-white">Withdraw earnings</h3><p className="mt-2 text-sm text-[#94A3B8]">This panel is a visual demo and will not transfer real money.</p><div className="mt-5 rounded-2xl bg-[#0A0D12] p-4"><div className="flex justify-between text-sm"><span className="text-[#94A3B8]">Available</span><span className="font-bold text-white">$184.95 AUD</span></div><div className="mt-3 flex justify-between text-sm"><span className="text-[#94A3B8]">Destination</span><span className="text-white">Demo account · 4821</span></div><div className="mt-3 flex justify-between text-sm"><span className="text-[#94A3B8]">Estimated arrival</span><span className="text-white">1–2 business days</span></div></div><Button onClick={requestPayout} className="mt-5 w-full">Request demo payout<ArrowRight className="h-4 w-4" /></Button></>}</motion.div></div>}</AnimatePresence>
    </div>
  );
}

function ProgressStep({ number, title, subtitle, state, last = false }: { number: number; title: string; subtitle: string; state: "done" | "current" | "future"; last?: boolean }) {
  return <div className="relative flex gap-4">{!last && <div className={cx("absolute left-[19px] top-10 h-[calc(100%-8px)] w-0.5", state === "done" ? "bg-[#4ADE80]" : "bg-[#1E293B]")} />}<div className={cx("relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-sm font-black", state === "done" ? "border-[#4ADE80] bg-[#4ADE80] text-[#0A0D12]" : state === "current" ? "border-[#38BDF8] bg-sky-400/10 text-[#38BDF8]" : "border-[#1E293B] bg-[#111620] text-[#64748B]")}>{state === "done" ? <Check className="h-5 w-5" /> : number}</div><div className="pb-7"><div className={cx("font-bold", state === "future" ? "text-[#64748B]" : "text-white")}>{title}</div><div className="mt-1 text-xs leading-5 text-[#94A3B8]">{subtitle}</div></div></div>;
}

function StudentPaymentUI({ notify }: { notify: (message: string) => void }) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [method, setMethod] = useState("card");
  const subtotal = 42;
  const fee = 3.36;
  const total = subtotal + fee;

  function pay() {
    setStatus("authorised");
    notify("Demo payment authorised");
    setTimeout(() => {
      setStatus("completed");
      notify("Session payment completed");
    }, 1500);
  }

  const reset = () => setStatus("pending");

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
      <button className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-[#38BDF8]"><ArrowLeft className="h-4 w-4" />Back to booking</button>
      <header className="mt-6"><Badge><ShieldCheck className="h-3.5 w-3.5" />Demo checkout</Badge><h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Complete your session payment</h1><p className="mt-2 text-sm text-[#94A3B8]">Review the booking details and follow the demo payment status.</p></header>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <section className="rounded-[20px] border border-[#1E293B] bg-[#111620] p-5 sm:p-6">
            <div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0369A1] font-black text-white">AC</div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-white">Session with Alex Chen</h2><Badge tone="green"><ShieldCheck className="h-3 w-3" />Verified HD*</Badge></div><p className="mt-1 text-sm text-[#94A3B8]">3rd-year Software Engineering · INFO2222</p></div></div>
            <div className="mt-5 grid gap-3 border-t border-[#1E293B] pt-5 sm:grid-cols-3"><div className="flex gap-3"><CalendarDays className="h-5 w-5 text-[#38BDF8]" /><div><p className="text-xs text-[#94A3B8]">Date</p><p className="mt-1 text-sm font-semibold text-white">24 Sep 2026</p></div></div><div className="flex gap-3"><Clock3 className="h-5 w-5 text-[#38BDF8]" /><div><p className="text-xs text-[#94A3B8]">Time</p><p className="mt-1 text-sm font-semibold text-white">4:00 pm · 60 min</p></div></div><div className="flex gap-3"><MessageCircle className="h-5 w-5 text-[#38BDF8]" /><div><p className="text-xs text-[#94A3B8]">Format</p><p className="mt-1 text-sm font-semibold text-white">Online session</p></div></div></div>
          </section>

          {status === "pending" ? <section className="rounded-[20px] border border-[#1E293B] bg-[#111620] p-5 sm:p-6"><h2 className="text-lg font-bold text-white">Choose payment method</h2><p className="mt-1 text-xs text-[#94A3B8]">No payment details are collected in this prototype.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["card","Demo card",CreditCard],["apple","Apple Pay",WalletCards],["google","Google Pay",WalletCards]].map(([id,label,I]: any) => { const Icon=I; return <button key={id} onClick={() => setMethod(id)} className={cx("rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#38BDF8]", method === id ? "border-[#38BDF8] bg-sky-400/10" : "border-[#1E293B] bg-[#0A0D12] hover:border-[#64748B]")}><Icon className={cx("h-5 w-5", method === id ? "text-[#38BDF8]" : "text-[#94A3B8]")} /><div className="mt-3 text-sm font-bold text-white">{label}</div><div className="mt-1 text-[11px] text-[#64748B]">Visual placeholder</div></button>})}</div><div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4"><div className="flex gap-3"><Info className="mt-0.5 h-5 w-5 shrink-0 text-[#38BDF8]" /><p className="text-sm leading-6 text-[#BAE6FD]">This is a frontend demonstration. Clicking pay updates local UI state only. No card data is entered, stored or transmitted.</p></div></div></section> : <section className="rounded-[20px] border border-[#1E293B] bg-[#111620] p-6"><div className="flex flex-col items-center py-5 text-center">{status === "authorised" ? <><motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:"linear"}} className="h-14 w-14 rounded-full border-4 border-[#1E293B] border-t-[#38BDF8]" /><h2 className="mt-5 text-xl font-black text-white">Authorising demo payment</h2><p className="mt-2 text-sm text-[#94A3B8]">Please keep this page open while the local status updates.</p></> : <><div className="grid h-16 w-16 place-items-center rounded-full bg-green-400/10 text-[#4ADE80]"><CheckCircle2 className="h-9 w-9" /></div><h2 className="mt-5 text-2xl font-black text-white">Payment complete</h2><p className="mt-2 text-sm text-[#94A3B8]">Your session with Alex Chen is confirmed.</p><Badge tone="green"><ReceiptText className="h-3.5 w-3.5" />Receipt TFT-2054</Badge><div className="mt-6 flex flex-wrap justify-center gap-3"><Button secondary><Download className="h-4 w-4" />Download receipt</Button><Button><MessageCircle className="h-4 w-4" />Message tutor</Button></div><button onClick={reset} className="mt-5 text-xs text-[#64748B] underline hover:text-[#38BDF8]">Reset demo</button></>}</div></section>}

          <section className="rounded-[20px] border border-amber-400/20 bg-amber-400/10 p-4"><div className="flex gap-3"><GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[#FBBF24]" /><div><h3 className="text-sm font-bold text-[#FEF3C7]">Academic integrity reminder</h3><p className="mt-1 text-xs leading-5 text-[#FDE68A]">Tutors provide explanation, guidance and feedback. Tutors must not complete assessed work for students.</p></div></div></section>
        </main>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-[20px] border border-[#1E293B] bg-[#111620] p-5 shadow-2xl shadow-black/20"><h2 className="font-bold text-white">Payment summary</h2><div className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><span className="text-[#94A3B8]">60-minute session</span><span className="text-white">${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-[#94A3B8]">Platform fee</span><span className="text-white">${fee.toFixed(2)}</span></div><div className="flex justify-between border-t border-[#1E293B] pt-4 text-lg font-black"><span className="text-white">Total</span><span className="text-white">${total.toFixed(2)} AUD</span></div></div>{status === "pending" && <Button onClick={pay} className="mt-5 w-full"><CreditCard className="h-4 w-4" />Pay ${total.toFixed(2)} demo</Button>}<div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#64748B]"><ShieldCheck className="h-3.5 w-3.5" />No real payment is processed</div></section>

          <section className="mt-5 rounded-[20px] border border-[#1E293B] bg-[#111620] p-5"><h2 className="font-bold text-white">Completion status</h2><div className="mt-5"><ProgressStep number={1} title="Booking details confirmed" subtitle="Unit, time and tutor selected." state="done" /><ProgressStep number={2} title="Demo payment authorised" subtitle={status === "pending" ? "Waiting for payment action." : "Payment method accepted locally."} state={status === "pending" ? "current" : "done"} /><ProgressStep number={3} title="Session confirmed" subtitle={status === "completed" ? "Booking added to My Learning." : "Completes after authorisation."} state={status === "completed" ? "done" : status === "authorised" ? "current" : "future"} last /></div></section>
        </aside>
      </div>
    </div>
  );
}

export default function TftPaymentDemo() {
  const [tab, setTab] = useState<Tab>("tutor");
  const [toast, setToast] = useState("");
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-[#1E293B] bg-[#0A0D12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex rounded-2xl border border-[#1E293B] bg-[#111620] p-1" role="tablist" aria-label="Payment demo view">
            <button role="tab" aria-selected={tab === "tutor"} onClick={() => setTab("tutor")} className={cx("rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#38BDF8]", tab === "tutor" ? "bg-[#0284C7] text-white" : "text-[#94A3B8] hover:text-white")}>Tutor receives money</button>
            <button role="tab" aria-selected={tab === "student"} onClick={() => setTab("student")} className={cx("rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#38BDF8]", tab === "student" ? "bg-[#0284C7] text-white" : "text-[#94A3B8] hover:text-white")}>Student sends money</button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .18 }}>
          {tab === "tutor" ? <TutorPayoutUI notify={notify} /> : <StudentPaymentUI notify={notify} />}
        </motion.div>
      </AnimatePresence>

      <footer className="mt-10 border-t border-[#1E293B] px-4 py-7 text-center text-xs leading-5 text-[#64748B]">Tutor For Test frontend demonstration. Earnings, reviews, verification, payment methods and transfers are simulated. No real financial transaction occurs.</footer>

      <AnimatePresence>{toast && <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-green-400/20 bg-[#111620] px-4 py-3 text-sm font-bold text-[#4ADE80] shadow-2xl"><CheckCircle2 className="h-4 w-4" />{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}