"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Search, Calendar, MessageCircle, Bookmark, GraduationCap,
  ShieldCheck, Star, SlidersHorizontal, CreditCard, Bell, Settings,
  HelpCircle, X, Check, ChevronRight, Clock, MapPin, Video, Paperclip,
  Send, DollarSign, Users, TrendingUp, Upload, Moon, Sun,
  AlertTriangle, BookOpen, Award, RotateCcw, CheckCircle2
} from "lucide-react";
import { TftLogo } from "@/components/TftLogo";
import { Footer } from "@/components/Footer";

// Tutor For Test (TFT) single-file UI prototype. In a production Next.js app, move mock data to lib/mock-data.ts
// and split the named sections below into components under components/.

type Unit = "INFO2222" | "INFO1110" | "COMP2017" | "SOFT3202" | "ELEC1601" | "DATA2001" | "ECON1001";
type Review = { id: number; author: string; rating: number; unit: Unit; text: string; date: string };
type Tutor = {
  id: number; name: string; initials: string; degree: string; year: string; units: Unit[];
  rating: number; reviewsCount: number; rate: number; next: string; topics: string[];
  focus: string; color: string; sessions: number; response: string; repeat: number;
  headline: string; about: string; promoted?: boolean; availability: string[]; reviews: Review[];
};
type Booking = { id: number; tutorId: number; unit: Unit; date: string; duration: number; mode: string; topic: string; status: string };
type ChatMessage = { id: number; sender: "me" | "them"; text: string; time: string };
type Conversation = { id: number; tutorId: number; preview: string; unit: Unit; session: string; unread: boolean; messages: ChatMessage[] };
type FilterState = { unit: string; topics: string[]; maxPrice: number; rating: number; availability: string; format: string; verified: boolean };
type View = "discover" | "learning" | "messages" | "saved" | "apply" | "tutor" | "help";

const units: { code: Unit; name: string }[] = [
  { code: "INFO2222", name: "Computing 2" }, { code: "INFO1110", name: "Introduction to Programming" },
  { code: "COMP2017", name: "Systems Programming" }, { code: "SOFT3202", name: "Software Construction and Design 2" },
  { code: "ELEC1601", name: "Foundations of Computer Systems" }, { code: "DATA2001", name: "Data Science" },
  { code: "ECON1001", name: "Introductory Microeconomics" },
];
const topicOptions = ["programming", "web security", "databases", "algorithms", "statistics", "exam preparation", "assignment feedback"];
const tutors: Tutor[] = [
  { id:1,name:"Alex Chen",initials:"AC",degree:"Software Engineering",year:"3rd-year",units:["INFO2222","COMP2017"],rating:4.9,reviewsCount:38,rate:42,next:"Today, 6:30 pm",topics:["programming","web security","databases","assignment feedback"],focus:"SQL, React, security concepts, assignment feedback",color:"from-sky-500 to-cyan-400",sessions:112,response:"Under 1 hour",repeat:78,headline:"Making INFO2222 concepts practical and less stressful.",about:"I break complex system and security concepts into visual, testable examples. Sessions are collaborative and focused on helping you build independent problem-solving skills.",promoted:true,availability:["Today · 6:30 pm","Thu · 4:00 pm","Sat · 10:00 am"],reviews:[{id:1,author:"Jamie L.",rating:5,unit:"INFO2222",text:"Alex made SQL injection and access control click for me. Clear, patient and practical.",date:"2 weeks ago"},{id:2,author:"Morgan K.",rating:5,unit:"COMP2017",text:"Great debugging approach without giving away answers.",date:"1 month ago"}]},
  { id:2,name:"Priya Nair",initials:"PN",degree:"Data Science",year:"4th-year",units:["DATA2001","INFO1110"],rating:5.0,reviewsCount:27,rate:38,next:"Tomorrow, 11:00 am",topics:["statistics","programming","exam preparation"],focus:"Python, statistics, data wrangling, exam preparation",color:"from-cyan-500 to-sky-400",sessions:84,response:"About 2 hours",repeat:82,headline:"Friendly, structured support for data and programming.",about:"I love helping students move from uncertainty to a clear study plan using simple explanations and worked examples.",availability:["Tue · 11:00 am","Wed · 5:30 pm","Sun · 2:00 pm"],reviews:[{id:1,author:"Casey R.",rating:5,unit:"DATA2001",text:"Fantastic explanations and a really useful practice worksheet.",date:"1 week ago"}]},
  { id:3,name:"Minh Tran",initials:"MT",degree:"Computer Science",year:"4th-year",units:["SOFT3202","INFO2222"],rating:4.8,reviewsCount:19,rate:40,next:"Wednesday, 5:00 pm",topics:["programming","web security","algorithms"],focus:"Design patterns, testing, React, code review",color:"from-emerald-500 to-teal-300",sessions:61,response:"Under 3 hours",repeat:71,headline:"Build stronger software thinking, one pattern at a time.",about:"My sessions emphasise reasoning, testing and maintainable design. We can review your approach while keeping your submitted work your own.",availability:["Wed · 5:00 pm","Fri · 3:00 pm","Sat · 1:00 pm"],reviews:[{id:1,author:"Taylor S.",rating:5,unit:"SOFT3202",text:"Really useful code review and testing advice.",date:"3 weeks ago"}]},
  { id:4,name:"Sophie Williams",initials:"SW",degree:"Economics",year:"Honours",units:["ECON1001"],rating:4.9,reviewsCount:45,rate:35,next:"Today, 7:00 pm",topics:["exam preparation","statistics","assignment feedback"],focus:"Microeconomics, diagrams, exam technique",color:"from-amber-400 to-orange-400",sessions:138,response:"Under 1 hour",repeat:86,headline:"Economics explained with intuition before equations.",about:"I help students understand the story behind models, then apply them confidently to practice questions.",availability:["Today · 7:00 pm","Thu · 6:00 pm","Sun · 4:00 pm"],reviews:[{id:1,author:"Ari P.",rating:5,unit:"ECON1001",text:"Clear diagrams and very practical exam tips.",date:"5 days ago"}]},
  { id:5,name:"Daniel Kim",initials:"DK",degree:"Mechatronic Engineering",year:"4th-year",units:["ELEC1601","COMP2017"],rating:4.7,reviewsCount:21,rate:45,next:"Friday, 3:30 pm",topics:["programming","algorithms","exam preparation"],focus:"C, memory, digital systems, debugging",color:"from-blue-500 to-sky-400",sessions:73,response:"About 3 hours",repeat:69,headline:"Understand the system, not just the syntax.",about:"We will trace programs, inspect memory and develop repeatable debugging habits through guided practice.",availability:["Fri · 3:30 pm","Sat · 9:00 am","Sun · 11:00 am"],reviews:[{id:1,author:"Noah J.",rating:5,unit:"COMP2017",text:"The memory diagrams were a game changer.",date:"2 months ago"}]},
  { id:6,name:"Olivia Brown",initials:"OB",degree:"Advanced Computing",year:"3rd-year",units:["INFO1110","DATA2001"],rating:4.9,reviewsCount:31,rate:36,next:"Thursday, 1:00 pm",topics:["programming","statistics","assignment feedback"],focus:"Python fundamentals, pandas, study planning",color:"from-rose-400 to-pink-500",sessions:96,response:"Under 2 hours",repeat:80,headline:"Patient support for confident coding foundations.",about:"I create a calm space to practise programming and learn how to diagnose errors independently.",availability:["Thu · 1:00 pm","Fri · 5:00 pm","Sun · 10:30 am"],reviews:[{id:1,author:"Sam D.",rating:5,unit:"INFO1110",text:"Patient and encouraging. I finally understand loops.",date:"1 week ago"}]}
];

const initialConversations: Conversation[] = [
  {id:1,tutorId:1,preview:"See you Thursday! Bring your SQL query draft.",unit:"INFO2222",session:"Thu 17 Sep · 4:00 pm",unread:true,messages:[{id:1,sender:"them",text:"Hi Jamie! I reviewed your learning goals. We can focus on SQL joins and input validation.",time:"10:24 am"},{id:2,sender:"me",text:"Perfect. I have a query draft that keeps returning duplicate rows.",time:"10:27 am"},{id:3,sender:"them",text:"See you Thursday! Bring your SQL query draft.",time:"10:29 am"}]},
  {id:2,tutorId:2,preview:"I have shared the practice worksheet.",unit:"DATA2001",session:"Sun 20 Sep · 2:00 pm",unread:true,messages:[{id:1,sender:"them",text:"I have shared the practice worksheet. Try questions 1 to 4 before Sunday.",time:"Yesterday"}]},
  {id:3,tutorId:3,preview:"Your session is confirmed.",unit:"SOFT3202",session:"Wed 23 Sep · 5:00 pm",unread:false,messages:[{id:1,sender:"them",text:"Your session is confirmed. We will look at testing strategy and dependency injection.",time:"Monday"}]}
];

const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

const Button = ({children, variant="primary", className="", ...props}: React.ComponentProps<"button"> & {variant?: "primary"|"secondary"|"ghost"}) => (
  <button
    className={cx(
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent focus-visible:ring-offset-2 focus-visible:ring-offset-tft-bg disabled:cursor-not-allowed disabled:opacity-50",
      variant==="primary" && "bg-[#0284C7] text-white shadow-lg shadow-sky-500/20 hover:bg-[#0EA5E9]",
      variant==="secondary" && "border border-tft-border bg-tft-surface text-tft-text hover:bg-tft-elevated",
      variant==="ghost" && "text-tft-muted hover:bg-tft-elevated hover:text-tft-text",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Badge = ({children, className="", ...props}: React.ComponentProps<"span">) => (
  <span className={cx("inline-flex items-center gap-1 rounded-full border border-tft-border bg-tft-elevated px-2.5 py-1 text-xs text-tft-muted", className)} {...props}>{children}</span>
);

const Avatar = ({tutor,size="md"}:{tutor:Tutor;size?:"sm"|"md"|"lg"}) => (
  <div aria-label={`${tutor.name} demo avatar`} className={cx("grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-bold text-white shadow-inner", tutor.color, size==="sm"?"h-10 w-10 text-xs":size==="lg"?"h-28 w-28 text-2xl":"h-14 w-14 text-base")}>{tutor.initials}</div>
);

const Stars = ({rating}:{rating:number}) => (
  <span className="inline-flex items-center gap-1 font-semibold text-tft-text"><Star className="h-4 w-4 fill-amber-400 text-amber-400"/>{rating.toFixed(1)}</span>
);

function NavRail({view,setView,onTutorView,dark}:{view:View;setView:(v:View)=>void;onTutorView:()=>void;dark:boolean}){
 const nav=[{v:"discover" as View,l:"Discover",i:Compass},{v:"learning" as View,l:"My Learning",i:Calendar},{v:"messages" as View,l:"Messages",i:MessageCircle},{v:"saved" as View,l:"Saved Tutors",i:Bookmark},{v:"apply" as View,l:"Become a Tutor",i:GraduationCap}];
 return (
  <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-tft-border bg-tft-surface/95 p-5 backdrop-blur lg:flex">
   <button onClick={()=>setView("discover")} className="mb-8 flex items-center px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent rounded-xl">
    <TftLogo dark={dark} showTagline />
   </button>
   <nav className="space-y-1" aria-label="Main navigation">
    {nav.map(({v,l,i:I})=>(
     <button key={v} onClick={()=>setView(v)} className={cx("relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent", view===v?"bg-sky-500/10 text-sky-400":"text-tft-muted hover:bg-tft-elevated hover:text-tft-text")}>
      {view===v&&<span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-tft-primary" aria-hidden="true"/>}
      <I className="h-5 w-5"/>{l}
      {v==="messages"&&<span className="ml-auto h-2 w-2 rounded-full bg-tft-primary" aria-label="Unread messages"/>}
     </button>
    ))}
   </nav>
   <div className="my-4 border-t border-tft-border"/>
   <button onClick={()=>setView("help")} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-tft-muted transition hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><HelpCircle className="h-5 w-5"/>Help & Safety</button>
   <div className="mt-auto rounded-2xl border border-tft-border bg-tft-elevated p-3 shadow-sm">
    <button onClick={onTutorView} className="flex w-full items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent rounded-xl p-1">
     <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 font-bold text-white">JN</div>
     <div className="min-w-0"><div className="text-sm font-semibold text-tft-text">Jamie Nguyen</div><div className="truncate text-xs text-tft-muted">Switch to Tutor View</div></div>
     <ChevronRight className="ml-auto h-4 w-4 text-tft-muted"/>
    </button>
   </div>
  </aside>
 );
}

function Header({setView,dark,setDark,search,setSearch}:{setView:(v:View)=>void;dark:boolean;setDark:(v:boolean)=>void;search:string;setSearch:(v:string)=>void}){
 return (
  <header className="sticky top-0 z-20 flex h-18 items-center gap-3 border-b border-tft-border bg-tft-bg/85 px-4 py-3 backdrop-blur-xl sm:px-6">
   <button onClick={()=>setView("discover")} className="flex items-center lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent rounded-xl">
    <TftLogo dark={dark} compact />
   </button>
   <label className="relative mx-auto max-w-2xl flex-1">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tft-muted"/>
    <input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Global tutor search" placeholder="Search a unit, topic, or tutor" className="w-full rounded-xl border border-tft-border bg-tft-surface py-2.5 pl-10 pr-4 text-sm text-tft-text outline-none placeholder:text-tft-muted focus:border-tft-primary focus:ring-2 focus:ring-sky-500/20"/>
   </label>
   <Button onClick={()=>setView("apply")} className="hidden sm:inline-flex"><GraduationCap className="h-4 w-4"/>Become a tutor</Button>
   <button onClick={()=>setDark(!dark)} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-xl border border-tft-border bg-tft-surface text-tft-muted transition hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent">{dark?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}</button>
   <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-tft-border bg-tft-surface text-tft-muted transition hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><Bell className="h-4 w-4"/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tft-primary"/></button>
  </header>
 );
}

function TutorCard({tutor,saved,onSave,onProfile,onBook}:{tutor:Tutor;saved:boolean;onSave:()=>void;onProfile:()=>void;onBook:()=>void}){
 return (
  <motion.article layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} whileHover={{y:-2}} transition={{duration:.2}} className={cx("group relative flex h-full flex-col rounded-[20px] border bg-tft-surface p-5 shadow-lg transition-shadow hover:shadow-xl", tutor.promoted?"border-sky-500/40 shadow-sky-500/5":"border-tft-border")}>
   {tutor.promoted&&<div className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] px-3 py-1 text-[11px] font-bold text-white shadow-md shadow-sky-500/25">Top Match for INFO2222</div>}
   <div className="flex items-start gap-3">
    <Avatar tutor={tutor}/>
    <div className="min-w-0 flex-1"><h3 className="font-bold text-tft-text">{tutor.name}</h3><p className="text-xs leading-5 text-tft-muted">{tutor.year} · {tutor.degree}</p></div>
    <button onClick={onSave} aria-label={saved?"Unsave tutor":"Save tutor"} className="rounded-lg p-2 text-tft-muted transition hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><Bookmark className={cx("h-5 w-5 transition", saved&&"fill-sky-400 text-sky-400")}/></button>
   </div>
   <div className="mt-4 flex flex-wrap gap-2"><Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400" title="High Distinction — verified unit result."><ShieldCheck className="h-3.5 w-3.5"/>Verified HD*</Badge>{tutor.units.map(u=><Badge key={u}>{u}</Badge>)}</div>
   <div className="mt-4 flex items-center gap-2 text-sm"><Stars rating={tutor.rating}/><span className="text-tft-muted">({tutor.reviewsCount} sample reviews)</span></div>
   <p className="mt-3 min-h-10 text-sm leading-5 text-tft-muted">{tutor.focus}</p>
   <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-tft-elevated p-3"><div><div className="text-xs text-tft-muted">Rate</div><div className="font-bold text-tft-text">${tutor.rate}/hr</div></div><div><div className="text-xs text-tft-muted">Next available</div><div className="truncate text-sm font-medium text-tft-success">{tutor.next}</div></div></div>
   <div className="mt-auto grid grid-cols-2 gap-2 pt-5"><Button variant="secondary" onClick={onProfile}>View profile</Button><Button onClick={onBook}>Book session</Button></div>
  </motion.article>
 );
}

function TutorFilters({filters,setFilters,resultCount,onClose}:{filters:FilterState;setFilters:(f:FilterState)=>void;resultCount:number;onClose?:()=>void}){
 const toggleTopic=(t:string)=>setFilters({...filters,topics:filters.topics.includes(t)?filters.topics.filter(x=>x!==t):[...filters.topics,t]});
 const reset=()=>setFilters({unit:"",topics:[],maxPrice:60,rating:0,availability:"",format:"Either",verified:true});
 return (
  <div className="h-full overflow-y-auto p-5">
   <div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-tft-text">Filters</h2><p className="text-xs text-tft-success">{resultCount} tutors found</p></div>{onClose&&<button onClick={onClose} aria-label="Close filters" className="rounded-lg p-1 text-tft-muted hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><X/></button>}</div>
   <label className="block text-xs font-semibold text-tft-muted">UNIT<select value={filters.unit} onChange={e=>setFilters({...filters,unit:e.target.value})} className="mt-2 w-full rounded-xl border border-tft-border bg-tft-surface p-3 text-sm text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"><option value="">All units</option>{units.map(u=><option key={u.code}>{u.code}</option>)}</select></label>
   <div className="mt-5"><div className="text-xs font-semibold text-tft-muted">TOPICS</div><div className="mt-2 flex flex-wrap gap-2">{topicOptions.map(t=><button key={t} onClick={()=>toggleTopic(t)} className={cx("rounded-full border px-2.5 py-1.5 text-xs capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",filters.topics.includes(t)?"border-sky-400 bg-sky-500/15 text-sky-300":"border-tft-border text-tft-muted hover:border-sky-400/50")}>{t}</button>)}</div></div>
   <div className="mt-5"><div className="flex justify-between text-xs font-semibold text-tft-muted"><span>MAX PRICE</span><span>${filters.maxPrice}/hr</span></div><input aria-label="Maximum hourly price" type="range" min="25" max="60" value={filters.maxPrice} onChange={e=>setFilters({...filters,maxPrice:+e.target.value})} className="mt-3 w-full accent-sky-500"/><div className="flex justify-between text-[10px] text-tft-muted"><span>$25</span><span>$60</span></div></div>
   <label className="mt-5 block text-xs font-semibold text-tft-muted">RATING<select value={filters.rating} onChange={e=>setFilters({...filters,rating:+e.target.value})} className="mt-2 w-full rounded-xl border border-tft-border bg-tft-surface p-3 text-sm text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"><option value="0">Any rating</option><option value="4">4.0+</option><option value="4.5">4.5+</option><option value="4.8">4.8+</option></select></label>
   <div className="mt-5"><div className="text-xs font-semibold text-tft-muted">AVAILABILITY</div><div className="mt-2 grid grid-cols-2 gap-2">{["Today","This week","Weekends","Evenings"].map(a=><button key={a} onClick={()=>setFilters({...filters,availability:filters.availability===a?"":a})} className={cx("rounded-lg border px-2 py-2 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",filters.availability===a?"border-sky-400 bg-sky-500/15 text-sky-300":"border-tft-border text-tft-muted")}>{a}</button>)}</div></div>
   <label className="mt-5 block text-xs font-semibold text-tft-muted">SESSION FORMAT<select value={filters.format} onChange={e=>setFilters({...filters,format:e.target.value})} className="mt-2 w-full rounded-xl border border-tft-border bg-tft-surface p-3 text-sm text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"><option>Either</option><option>Online</option><option>On campus</option></select></label>
   <label className="mt-5 flex items-center justify-between text-sm text-tft-text"><span><span className="block font-medium">Verified HD only</span><span className="text-xs text-tft-muted">Demo verification status</span></span><input type="checkbox" checked={filters.verified} onChange={e=>setFilters({...filters,verified:e.target.checked})} className="h-5 w-5 accent-sky-500"/></label>
   <Button variant="secondary" onClick={reset} className="mt-6 w-full"><RotateCcw className="h-4 w-4"/>Reset filters</Button>
  </div>
 );
}

function Discover({search,setSearch,saved,setSaved,onProfile,onBook,toast}:{search:string;setSearch:(s:string)=>void;saved:Set<number>;setSaved:(s:Set<number>)=>void;onProfile:(t:Tutor)=>void;onBook:(t:Tutor)=>void;toast:(s:string)=>void}){
 const [filters,setFilters]=useState<FilterState>({unit:"",topics:[],maxPrice:60,rating:0,availability:"",format:"Either",verified:true});
 const [drawer,setDrawer]=useState(false); const [loading,setLoading]=useState(false);
 const results=useMemo(()=>tutors.filter(t=>{const q=search.toLowerCase();return (!q||t.name.toLowerCase().includes(q)||t.units.some(u=>u.toLowerCase().includes(q))||t.topics.some(x=>x.includes(q)))&&(!filters.unit||t.units.includes(filters.unit as Unit))&&(!filters.topics.length||filters.topics.some(x=>t.topics.includes(x)))&&t.rate<=filters.maxPrice&&t.rating>=filters.rating}),[search,filters]);
 const save=(id:number)=>{const n=new Set(saved);const was=n.has(id);was?n.delete(id):n.add(id);setSaved(n);toast(was?"Tutor removed from saved":"Tutor saved")};
 const chip=(u:string)=>{setFilters({...filters,unit:u});setSearch("");setLoading(true);setTimeout(()=>setLoading(false),450)};
 return (
  <div>
   <section className="relative overflow-hidden border-b border-tft-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/20 via-cyan-400/10 to-transparent blur-3xl"/>
    <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl"/>
    <div className="relative mx-auto max-w-4xl">
     <Badge className="mb-5 border-sky-500/30 bg-sky-500/10 text-sky-300"><Award className="h-3.5 w-3.5"/>TFT · Verified HD tutors. Unit-specific support.</Badge>
     <h1 className="max-w-3xl text-3xl font-black tracking-tight text-tft-text sm:text-4xl lg:text-5xl lg:leading-tight">Learn from students who have already mastered your unit.</h1>
     <p className="mt-5 max-w-2xl text-base leading-relaxed text-tft-muted sm:text-lg">Connect with verified HD tutors who understand your assessments, unit content, exam expectations, and teaching style.</p>
     <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:gap-2">
      <label className="relative flex-1">
       <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tft-muted"/>
       <input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search tutors by unit or topic" placeholder="Try INFO2222 or databases" className="w-full rounded-2xl border border-tft-border bg-tft-surface p-4 pl-12 text-tft-text shadow-sm outline-none placeholder:text-tft-muted focus:border-tft-primary focus:ring-2 focus:ring-sky-500/20"/>
      </label>
      <Button onClick={()=>{setLoading(true);setTimeout(()=>setLoading(false),450)}} className="px-8 py-4 sm:py-2.5">Search</Button>
     </div>
     <div className="mt-5 flex flex-wrap gap-2">{["INFO2222","COMP2017","DATA2001","ECON1001"].map(u=><button key={u} onClick={()=>chip(u)} className="rounded-full border border-tft-border bg-tft-surface/80 px-3 py-1.5 text-xs text-tft-muted transition hover:border-sky-400 hover:text-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent">{u}</button>)}</div>
     <div className="mt-8 flex flex-wrap gap-5 text-xs text-tft-muted">{["Verified HD results","Transparent ratings","Secure demo booking"].map(x=><span key={x} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-tft-success"/>{x}</span>)}</div>
    </div>
   </section>
   <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
    <aside className="hidden border-r border-tft-border lg:block"><div className="sticky top-16 h-[calc(100vh-64px)]"><TutorFilters filters={filters} setFilters={setFilters} resultCount={results.length}/></div></aside>
    <main className="p-4 sm:p-6 lg:p-8">
     <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-tft-text">Tutors for you</h2><p className="text-sm text-tft-muted">Sample profiles and review data for this demo.</p></div><Button variant="secondary" onClick={()=>setDrawer(true)} className="lg:hidden"><SlidersHorizontal className="h-4 w-4"/>Filters</Button></div>
     {loading?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3,4,5,6].map(x=><div key={x} className="h-80 animate-pulse rounded-[20px] border border-tft-border bg-tft-elevated"/>)}</div>:results.length?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map(t=><TutorCard key={t.id} tutor={t} saved={saved.has(t.id)} onSave={()=>save(t.id)} onProfile={()=>onProfile(t)} onBook={()=>onBook(t)}/>)}</div>:<div className="grid min-h-80 place-items-center rounded-[20px] border border-dashed border-tft-border bg-tft-elevated/50 p-8 text-center"><div><Search className="mx-auto h-10 w-10 text-tft-muted"/><h3 className="mt-4 font-bold text-tft-text">No tutors match those filters</h3><p className="mt-2 text-sm text-tft-muted">Try increasing your price range or clearing a topic.</p><Button onClick={()=>{setFilters({unit:"",topics:[],maxPrice:60,rating:0,availability:"",format:"Either",verified:true});setSearch("")}} className="mt-4">Clear filters</Button></div></div>}
     <p className="mt-6 text-xs text-tft-muted">* “Verified HD” is a demo status. Production verification would require transcript review and identity checks.</p>
    </main>
   </div>
   <AnimatePresence>{drawer&&<><motion.div className="fixed inset-0 z-40 bg-black/60" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setDrawer(false)}/><motion.aside className="fixed inset-y-0 right-0 z-50 w-[88vw] max-w-sm bg-tft-surface" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}}><TutorFilters filters={filters} setFilters={setFilters} resultCount={results.length} onClose={()=>setDrawer(false)}/></motion.aside></>}</AnimatePresence>
  </div>
 );
}

function TutorProfileModal({tutor,onClose,onBook,saved,onSave}:{tutor:Tutor;onClose:()=>void;onBook:()=>void;saved:boolean;onSave:()=>void}){
 return (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-0 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="tutor-profile-title">
   <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mx-auto min-h-full max-w-5xl border-tft-border bg-tft-surface sm:min-h-0 sm:rounded-[24px] sm:border sm:shadow-2xl">
    <div className="sticky top-0 z-10 flex justify-end border-b border-tft-border bg-tft-surface/90 p-3 backdrop-blur"><button onClick={onClose} aria-label="Close profile" className="rounded-xl p-2 text-tft-muted hover:bg-tft-elevated hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><X/></button></div>
    <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
     <main>
      <div className="flex flex-col gap-5 sm:flex-row"><Avatar tutor={tutor} size="lg"/><div><div className="flex flex-wrap gap-2"><Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400" title="High Distinction — verified unit result."><ShieldCheck className="h-3.5 w-3.5"/>Verified HD*</Badge></div><h2 id="tutor-profile-title" className="mt-3 text-3xl font-black text-tft-text">{tutor.name}</h2><p className="text-tft-muted">{tutor.year} {tutor.degree}</p><p className="mt-3 text-lg text-sky-300">{tutor.headline}</p></div></div>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[<Stars rating={tutor.rating}/>,`${tutor.reviewsCount} reviews`],[tutor.sessions,"sessions"],[tutor.response,"response"],[`${tutor.repeat}%`,`repeat students`]].map((x,i)=><div key={i} className="rounded-2xl border border-tft-border bg-tft-elevated p-4"><div className="font-bold text-tft-text">{x[0]}</div><div className="mt-1 text-xs text-tft-muted">{x[1]}</div></div>)}</div>
      <section className="mt-8"><h3 className="text-lg font-bold text-tft-text">Verified unit achievements</h3><div className="mt-3 space-y-2">{tutor.units.map(u=><div key={u} className="flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3"><Award className="h-5 w-5 text-emerald-400"/><span className="font-semibold text-tft-text">{u} · High Distinction</span><Badge className="ml-auto text-emerald-400">Verified demo</Badge></div>)}</div></section>
      <section className="mt-8"><h3 className="text-lg font-bold text-tft-text">About</h3><p className="mt-3 leading-7 text-tft-muted">{tutor.about}</p></section>
      <section className="mt-8"><h3 className="text-lg font-bold text-tft-text">Expertise & session types</h3><div className="mt-3 flex flex-wrap gap-2">{["Concept explanation","Weekly study planning","Practice questions","Code review","Assignment feedback","Exam preparation"].map(x=><Badge key={x}>{x}</Badge>)}</div></section>
      <div className="mt-8 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100"><AlertTriangle className="h-5 w-5 shrink-0 text-amber-400"/><p><strong>Academic integrity:</strong> Tutors provide learning support and feedback. They must not complete assessed work for students.</p></div>
      <section className="mt-8"><div className="flex items-end justify-between"><h3 className="text-lg font-bold text-tft-text">Student reviews</h3><span className="text-xs text-tft-muted">Sample review data</span></div><div className="mt-3 space-y-3">{tutor.reviews.map(r=><article key={r.id} className="rounded-2xl border border-tft-border bg-tft-elevated p-4"><div className="flex justify-between"><div className="font-semibold text-tft-text">{r.author} · {r.unit}</div><Stars rating={r.rating}/></div><p className="mt-2 text-sm text-tft-muted">{r.text}</p><p className="mt-2 text-xs text-tft-muted/70">{r.date}</p></article>)}</div></section>
     </main>
     <aside><div className="sticky top-20 rounded-[20px] border border-tft-border bg-tft-elevated p-5 shadow-xl"><div className="flex items-end justify-between"><div><div className="text-xs text-tft-muted">Tutoring rate</div><div className="text-2xl font-black text-tft-text">${tutor.rate}<span className="text-sm font-normal text-tft-muted">/hr</span></div></div><span className="text-xs text-tft-success">Usually replies {tutor.response.toLowerCase()}</span></div><h4 className="mt-5 font-bold text-tft-text">Next availability</h4><div className="mt-2 space-y-2">{tutor.availability.map(a=><div key={a} className="flex items-center gap-2 rounded-xl bg-tft-surface p-3 text-sm text-tft-text"><Clock className="h-4 w-4 text-sky-400"/>{a}</div>)}</div><Button onClick={onBook} className="mt-5 w-full"><Calendar className="h-4 w-4"/>Book a session</Button><Button variant="secondary" onClick={onSave} className="mt-2 w-full"><Bookmark className={cx("h-4 w-4",saved&&"fill-sky-400 text-sky-400")}/>{saved?"Saved":"Save tutor"}</Button><p className="mt-4 text-xs leading-5 text-tft-muted">Free cancellation up to 12 hours before a session. Demo policy only.</p><button className="mt-5 text-xs text-tft-muted underline hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent rounded">Report or safety concern</button></div></aside>
    </div>
   </motion.div>
  </div>
 );
}

function BookingModal({tutor,onClose,onConfirm}:{tutor:Tutor;onClose:()=>void;onConfirm:(b:Booking)=>void}){
 const [step,setStep]=useState(1); const [unit,setUnit]=useState<Unit>(tutor.units[0]);const [topic,setTopic]=useState("Concept explanation");const [mode,setMode]=useState("Online");const [duration,setDuration]=useState(60);const [slot,setSlot]=useState(tutor.availability[0]);const [goal,setGoal]=useState("");const [done,setDone]=useState(false);
 const subtotal=tutor.rate*(duration/60),fee=Number((subtotal*.08).toFixed(2)),total=subtotal+fee;
 const confirm=()=>{onConfirm({id:Date.now(),tutorId:tutor.id,unit,date:slot,duration,mode,topic,status:"Confirmed"});setDone(true)};
 return (
  <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
   <motion.div initial={{scale:.98,opacity:0}} animate={{scale:1,opacity:1}} className="w-full max-w-2xl rounded-[24px] border border-tft-border bg-tft-surface shadow-2xl">
    <header className="flex items-center justify-between border-b border-tft-border p-5"><div><div className="text-xs font-semibold text-sky-400">{done?"BOOKED":`STEP ${step} OF 3`}</div><h2 id="booking-modal-title" className="text-xl font-bold text-tft-text">{done?"You're all set":step===1?"Choose session details":step===2?"Add learning goals":"Confirm and pay"}</h2></div><button onClick={onClose} aria-label="Close booking" className="rounded-xl p-2 text-tft-muted hover:bg-tft-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><X/></button></header>
    {!done&&<div className="h-1 bg-tft-elevated" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}><div className="h-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] transition-all" style={{width:`${step/3*100}%`}}/></div>}
    <div className="p-5 sm:p-6">
     {done?<div className="py-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400"><Check className="h-8 w-8"/></div><h3 className="mt-5 text-2xl font-black text-tft-text">Session booked with {tutor.name}</h3><p className="mt-2 text-tft-muted">{unit} · {slot} · {duration} minutes</p><div className="mt-6 flex justify-center gap-3"><Button variant="secondary"><Calendar className="h-4 w-4"/>Add to calendar</Button><Button><MessageCircle className="h-4 w-4"/>Message tutor</Button></div></div>
     :step===1?<div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-tft-text">Unit<select value={unit} onChange={e=>setUnit(e.target.value as Unit)} className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20">{tutor.units.map(u=><option key={u}>{u}</option>)}</select></label><label className="text-sm font-semibold text-tft-text">Topic<select value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20">{["Concept explanation","Code review","Exam preparation","Assignment planning"].map(x=><option key={x}>{x}</option>)}</select></label></div><div><div className="text-sm font-semibold text-tft-text">Session format</div><div className="mt-2 grid grid-cols-2 gap-2">{["Online","On campus"].map(x=><button key={x} onClick={()=>setMode(x)} className={cx("rounded-xl border p-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",mode===x?"border-sky-400 bg-sky-500/15 text-tft-text":"border-tft-border text-tft-muted")}>{x==="Online"?<Video className="mx-auto mb-1 h-4 w-4"/>:<MapPin className="mx-auto mb-1 h-4 w-4"/>}{x}</button>)}</div></div><div><div className="text-sm font-semibold text-tft-text">Duration</div><div className="mt-2 grid grid-cols-3 gap-2">{[30,45,60].map(x=><button key={x} onClick={()=>setDuration(x)} className={cx("rounded-xl border p-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",duration===x?"border-sky-400 bg-sky-500/15 text-tft-text":"border-tft-border text-tft-muted")}>{x} min</button>)}</div></div><div><div className="text-sm font-semibold text-tft-text">Available time</div><div className="mt-2 space-y-2">{tutor.availability.map(x=><button key={x} onClick={()=>setSlot(x)} className={cx("flex w-full items-center gap-2 rounded-xl border p-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",slot===x?"border-sky-400 bg-sky-500/15 text-tft-text":"border-tft-border text-tft-muted")}><Clock className="h-4 w-4"/>{x}{slot===x&&<Check className="ml-auto h-4 w-4 text-sky-400"/>}</button>)}</div></div></div>
     :step===2?<div><label className="text-sm font-semibold text-tft-text">What would you like help with?<textarea value={goal} onChange={e=>setGoal(e.target.value)} rows={5} placeholder="Share what you understand so far and what feels unclear..." className="mt-2 w-full resize-none rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text outline-none focus:border-tft-primary focus:ring-2 focus:ring-sky-500/20"/></label><div className="mt-4 flex flex-wrap gap-2">{["Understand lecture concepts","Prepare for an exam","Review my code","Plan an assignment","Debug an error"].map(x=><button key={x} onClick={()=>setGoal(x)} className="rounded-full border border-tft-border px-3 py-1.5 text-xs text-tft-muted transition hover:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent">{x}</button>)}</div><div className="mt-5 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100"><ShieldCheck className="h-5 w-5 shrink-0"/>Tutors can explain, guide and give feedback, but cannot complete assessed work.</div></div>
     :<div><div className="rounded-2xl border border-tft-border bg-tft-elevated p-5"><div className="flex items-center gap-3"><Avatar tutor={tutor} size="sm"/><div><div className="font-bold text-tft-text">{tutor.name}</div><div className="text-xs text-tft-muted">{unit} · {slot}</div></div></div><div className="mt-5 space-y-3 text-sm">{[["Duration",`${duration} minutes`],["Format",mode],["Hourly rate",`$${tutor.rate.toFixed(2)}`],["Session subtotal",`$${subtotal.toFixed(2)}`],["Platform fee (demo)",`$${fee.toFixed(2)}`]].map(x=><div key={x[0]} className="flex justify-between"><span className="text-tft-muted">{x[0]}</span><span className="text-tft-text">{x[1]}</span></div>)}<div className="flex justify-between border-t border-tft-border pt-3 text-lg font-bold text-tft-text"><span>Total</span><span>${total.toFixed(2)} AUD</span></div></div></div><div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4"><div className="flex items-center gap-2 font-semibold text-tft-text"><CreditCard className="h-4 w-4 text-sky-400"/>Demo payment</div><p className="mt-1 text-xs text-tft-muted">No real payment will be processed and no credentials are stored.</p><div className="mt-3 grid grid-cols-3 gap-2">{["Demo card","Apple Pay","Google Pay"].map((x,i)=><button key={x} className={cx("rounded-xl border p-3 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",i===0?"border-sky-400 bg-tft-surface text-tft-text":"border-tft-border text-tft-muted")}>{x}</button>)}</div></div></div>}
     {!done&&<footer className="mt-6 flex justify-between"><Button variant="secondary" disabled={step===1} onClick={()=>setStep(step-1)}>Back</Button>{step<3?<Button onClick={()=>setStep(step+1)}>Continue<ChevronRight className="h-4 w-4"/></Button>:<Button onClick={confirm}><CreditCard className="h-4 w-4"/>Confirm booking</Button>}</footer>}
    </div>
   </motion.div>
  </div>
 );
}

function Messages({toast}:{toast:(s:string)=>void}){
 const [convos,setConvos]=useState(initialConversations);const [active,setActive]=useState(1);const [text,setText]=useState("");const c=convos.find(x=>x.id===active)!;const tutor=tutors.find(x=>x.id===c.tutorId)!;
 const send=()=>{if(!text.trim())return;setConvos(convos.map(x=>x.id===active?{...x,preview:text,messages:[...x.messages,{id:Date.now(),sender:"me",text,time:"Now"}]}:x));setText("");toast("Demo message sent")};
 return (
  <div className="grid h-[calc(100vh-70px)] bg-tft-bg md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_280px]">
   <aside className="hidden border-r border-tft-border bg-tft-surface md:block">
    <div className="p-4"><h2 className="text-lg font-bold text-tft-text">Messages</h2><p className="text-xs text-tft-muted">Tutor conversations</p></div>
    {convos.map(x=>{const t=tutors.find(z=>z.id===x.tutorId)!;return (
     <button key={x.id} onClick={()=>setActive(x.id)} className={cx("flex w-full gap-3 border-l-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tft-accent",active===x.id?"border-sky-400 bg-tft-elevated":"border-transparent hover:bg-tft-elevated/50")}>
      <Avatar tutor={t} size="sm"/>
      <div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-tft-text">{t.name}</span>{x.unread&&<span className="h-2 w-2 rounded-full bg-sky-400" aria-label="Unread"/>}</div><p className="truncate text-xs text-tft-muted">{x.preview}</p><p className="mt-1 text-[10px] text-sky-400">{x.session}</p></div>
     </button>
    )})}
   </aside>
   <main className="flex min-w-0 flex-col bg-tft-bg">
    <header className="flex items-center gap-3 border-b border-tft-border bg-tft-surface p-4"><Avatar tutor={tutor} size="sm"/><div><h2 className="font-bold text-tft-text">{tutor.name}</h2><p className="text-xs text-tft-muted">{c.unit} · Next session {c.session}</p></div><Button className="ml-auto hidden sm:inline-flex"><Video className="h-4 w-4"/>Join demo video session</Button></header>
    <div className="border-b border-tft-border bg-tft-surface p-3"><div className="flex gap-2 overflow-x-auto">{["Share availability","View booking","Reschedule"].map(x=><Button key={x} variant="secondary" className="whitespace-nowrap py-2 text-xs">{x}</Button>)}</div></div>
    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">{c.messages.map(m=><div key={m.id} className={cx("flex",m.sender==="me"?"justify-end":"justify-start")}><div className={cx("max-w-[80%] rounded-2xl px-4 py-3 text-sm",m.sender==="me"?"rounded-br-md bg-gradient-to-br from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-sky-500/20":"rounded-bl-md border border-tft-border bg-tft-elevated text-tft-text")}><p>{m.text}</p><div className="mt-1 text-[10px] opacity-60">{m.time}</div></div></div>)}</div>
    <div className="border-t border-tft-border bg-tft-surface p-3"><p className="mb-2 text-center text-[10px] text-tft-muted">Messages may be monitored for safety and academic-integrity policy compliance.</p><div className="flex gap-2"><button aria-label="Attach file" className="grid h-11 w-11 place-items-center rounded-xl border border-tft-border text-tft-muted hover:text-tft-text focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent"><Paperclip className="h-4 w-4"/></button><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} aria-label="Message input" placeholder="Message your tutor..." className="min-w-0 flex-1 rounded-xl border border-tft-border bg-tft-elevated px-4 text-tft-text outline-none focus:border-tft-primary focus:ring-2 focus:ring-sky-500/20"/><Button onClick={send} aria-label="Send message"><Send className="h-4 w-4"/></Button></div></div>
   </main>
   <aside className="hidden border-l border-tft-border bg-tft-surface p-5 xl:block"><Avatar tutor={tutor} size="lg"/><h3 className="mt-4 text-xl font-bold text-tft-text">{tutor.name}</h3><p className="text-sm text-tft-muted">{tutor.degree}</p><div className="mt-5 space-y-3 rounded-2xl bg-tft-elevated p-4 text-sm"><div className="flex justify-between"><span className="text-tft-muted">Rating</span><Stars rating={tutor.rating}/></div><div className="flex justify-between"><span className="text-tft-muted">Rate</span><span className="text-tft-text">${tutor.rate}/hr</span></div><div className="flex justify-between"><span className="text-tft-muted">Unit</span><span className="text-tft-text">{c.unit}</span></div></div></aside>
  </div>
 );
}

function StudentDashboard({bookings,saved,onDiscover,onBook}:{bookings:Booking[];saved:Set<number>;onDiscover:()=>void;onBook:(t:Tutor)=>void}){
 return (
  <div className="p-4 sm:p-6 lg:p-8">
   <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wider text-sky-400">My Learning</p><h1 className="text-3xl font-black text-tft-text">Good evening, Jamie</h1><p className="mt-2 text-tft-muted">Keep your momentum going across every unit.</p></div><Button onClick={onDiscover}><Search className="h-4 w-4"/>Find another tutor</Button></div>
   <div className="mt-7 grid gap-4 sm:grid-cols-3">{[[bookings.length,"Sessions this month",Calendar],[bookings.reduce((a,b)=>a+b.duration,0)/60,"Hours learned",Clock],[new Set(bookings.map(b=>b.unit)).size,"Units receiving support",BookOpen]].map(([v,l,I]:any)=><div key={l} className="rounded-[20px] border border-tft-border bg-tft-surface p-5 shadow-sm"><I className="h-5 w-5 text-sky-400"/><div className="mt-3 text-3xl font-black text-tft-text">{v}</div><div className="text-sm text-tft-muted">{l}</div></div>)}</div>
   <section className="mt-8"><h2 className="text-xl font-bold text-tft-text">Upcoming sessions</h2><div className="mt-3 grid gap-3">{bookings.length?bookings.map(b=>{const t=tutors.find(x=>x.id===b.tutorId)!;return <article key={b.id} className="flex flex-wrap items-center gap-4 rounded-[20px] border border-tft-border bg-tft-surface p-4 shadow-sm"><Avatar tutor={t} size="sm"/><div><div className="font-bold text-tft-text">{b.unit} with {t.name}</div><div className="text-sm text-tft-muted">{b.date} · {b.duration} min · {b.mode}</div></div><Badge className="ml-auto text-tft-success">Confirmed</Badge><Button variant="secondary">View booking</Button></article>}):<div className="rounded-[20px] border border-dashed border-tft-border p-8 text-center text-tft-muted">No upcoming sessions. Book a tutor to get started.</div>}</div></section>
   <section className="mt-8"><h2 className="text-xl font-bold text-tft-text">Saved tutors</h2><div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tutors.filter(t=>saved.has(t.id)).map(t=><TutorCard key={t.id} tutor={t} saved onSave={()=>{}} onProfile={()=>{}} onBook={()=>onBook(t)}/>)}{!saved.size&&<p className="text-sm text-tft-muted">Tutors you save will appear here.</p>}</div></section>
   <section className="mt-8"><h2 className="text-xl font-bold text-tft-text">Suggested for your units</h2><div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tutors.slice(0,3).map(t=><TutorCard key={t.id} tutor={t} saved={saved.has(t.id)} onSave={()=>{}} onProfile={()=>{}} onBook={()=>onBook(t)}/>)}</div></section>
  </div>
 );
}

function TutorApplication({toast}:{toast:(s:string)=>void}){
 const [submitted,setSubmitted]=useState(false);
 return (
  <div className="p-4 sm:p-6 lg:p-8">
   <section className="rounded-[24px] border border-sky-500/20 bg-gradient-to-br from-sky-500/15 via-tft-surface to-cyan-500/10 p-6 sm:p-10">
    <Badge><GraduationCap className="h-4 w-4"/>For high-achieving senior students</Badge>
    <h1 className="mt-5 max-w-3xl text-3xl font-black text-tft-text sm:text-4xl">Turn your HD results into meaningful support for other students.</h1>
    <p className="mt-3 text-tft-muted">Set your availability, build your reputation, and earn for your time.</p>
   </section>
   {submitted?<div className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 p-10 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400"/><h2 className="mt-4 text-2xl font-black text-tft-text">Demo application submitted</h2><p className="mt-2 text-tft-muted">In production, Tutor For Test would review identity, transcript evidence and unit results before approval.</p><Button variant="secondary" onClick={()=>setSubmitted(false)} className="mt-5">Edit application</Button></div>
   :<div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px]">
    <form onSubmit={e=>{e.preventDefault();setSubmitted(true);toast("Tutor application submitted")}} className="space-y-5 rounded-[24px] border border-tft-border bg-tft-surface p-5 sm:p-7">
     <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-tft-text">Degree<input required placeholder="e.g. Software Engineering" className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"/></label><label className="text-sm font-semibold text-tft-text">Year of study<select className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"><option>3rd year</option><option>4th year</option><option>Honours</option><option>Postgraduate</option></select></label></div>
     <label className="block text-sm font-semibold text-tft-text">Units available to tutor<input required placeholder="e.g. INFO2222, COMP2017" className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"/></label>
     <label className="block rounded-2xl border border-dashed border-tft-border p-6 text-center"><Upload className="mx-auto h-6 w-6 text-sky-400"/><span className="mt-2 block text-sm font-semibold text-tft-text">Academic transcript placeholder</span><span className="text-xs text-tft-muted">No file is uploaded in this demo</span></label>
     <div className="rounded-xl bg-tft-elevated p-4"><div className="font-semibold text-tft-text">HD verification checklist</div>{["Official unit result is visible","Name matches verified identity","Result is High Distinction","Document is reviewed before profile goes live"].map(x=><label key={x} className="mt-3 flex gap-2 text-sm text-tft-muted"><input type="checkbox" className="accent-sky-500"/>{x}</label>)}</div>
     <label className="block text-sm font-semibold text-tft-text">Tutoring bio<textarea required rows={4} placeholder="How do you help students learn?" className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"/></label>
     <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-tft-text">Rate per hour<input type="number" defaultValue="40" min="25" max="60" className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"/></label><label className="text-sm font-semibold text-tft-text">Format<select className="mt-2 w-full rounded-xl border border-tft-border bg-tft-elevated p-3 text-tft-text focus:border-tft-primary focus:outline-none focus:ring-2 focus:ring-sky-500/20"><option>Online and on campus</option><option>Online</option><option>On campus</option></select></label></div>
     <label className="flex gap-3 text-sm text-tft-muted"><input required type="checkbox" className="mt-1 accent-sky-500"/>I agree to the tutoring, safety and academic-integrity policy, including never completing assessed work for a student.</label>
     <Button type="submit" className="w-full">Submit application</Button>
    </form>
    <aside className="space-y-4">
     <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-5"><TrendingUp className="h-6 w-6 text-emerald-400"/><h3 className="mt-3 font-bold text-tft-text">Estimated earnings</h3><p className="mt-2 text-2xl font-black text-tft-text">~$640/month</p><p className="mt-2 text-sm text-tft-muted">At $40/hr, 4 sessions/week, before platform fees.</p><Badge className="mt-3">Estimate only</Badge></div>
     <div className="rounded-[20px] border border-tft-border bg-tft-surface p-5"><ShieldCheck className="h-6 w-6 text-sky-400"/><h3 className="mt-3 font-bold text-tft-text">Production verification required</h3><p className="mt-2 text-sm leading-6 text-tft-muted">All tutors would need identity and transcript review before receiving a verified badge.</p></div>
    </aside>
   </div>}
  </div>
 );
}

function TutorDashboard(){
 return (
  <div className="p-4 sm:p-6 lg:p-8">
   <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wider text-sky-400">Tutor View</p><h1 className="text-3xl font-black text-tft-text">Tutor dashboard</h1><p className="mt-2 text-tft-muted">Manage sessions, availability and your sample earnings.</p></div><Button><Settings className="h-4 w-4"/>Edit tutor profile</Button></div>
   <div className="mt-7 grid gap-4 sm:grid-cols-3">{[["$168","This week",DollarSign],["$612","This month",TrendingUp],["$126","Pending payout",Clock]].map(([v,l,I]:any)=><div key={l} className="rounded-[20px] border border-tft-border bg-tft-surface p-5 shadow-sm"><I className="h-5 w-5 text-sky-400"/><div className="mt-3 text-3xl font-black text-tft-text">{v}</div><div className="text-sm text-tft-muted">{l}</div></div>)}</div>
   <div className="mt-7 grid gap-5 xl:grid-cols-2">
    <section className="rounded-[20px] border border-tft-border bg-tft-surface p-5"><h2 className="font-bold text-tft-text">Upcoming sessions</h2>{["Jamie · INFO2222 · Thu 4:00 pm","Morgan · COMP2017 · Sat 10:00 am"].map(x=><div key={x} className="mt-3 flex items-center gap-3 rounded-xl bg-tft-elevated p-4"><Calendar className="h-5 w-5 text-sky-400"/><span className="text-sm text-tft-text">{x}</span><Button variant="secondary" className="ml-auto py-2">Details</Button></div>)}</section>
    <section className="rounded-[20px] border border-tft-border bg-tft-surface p-5"><h2 className="font-bold text-tft-text">New booking requests</h2><div className="mt-3 rounded-xl bg-tft-elevated p-4"><div className="font-semibold text-tft-text">Taylor · INFO2222</div><div className="text-sm text-tft-muted">Friday 5:30 pm · 60 min · Online</div><div className="mt-3 flex gap-2"><Button className="py-2">Accept</Button><Button variant="secondary" className="py-2">Suggest another time</Button></div></div></section>
    <section className="rounded-[20px] border border-tft-border bg-tft-surface p-5"><div className="flex justify-between"><h2 className="font-bold text-tft-text">Availability manager</h2><Badge>This week</Badge></div><div className="mt-4 grid grid-cols-5 gap-2">{["Mon","Tue","Wed","Thu","Fri"].map((d,i)=><div key={d}><div className="text-center text-xs text-tft-muted">{d}</div>{[1,2,3,4].map(s=><button key={s} className={cx("mt-2 h-12 w-full rounded-lg border text-[10px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",(i+s)%3===0?"border-sky-400 bg-sky-500/15 text-sky-300":"border-tft-border bg-tft-elevated text-tft-muted")}>{(i+s)%3===0?"Open":""}</button>)}</div>)}</div></section>
    <section className="rounded-[20px] border border-tft-border bg-tft-surface p-5"><h2 className="font-bold text-tft-text">Rating & recent reviews</h2><div className="mt-3 flex items-end gap-3"><span className="text-4xl font-black text-tft-text">4.9</span><div><Stars rating={4.9}/><p className="text-xs text-tft-muted">38 sample reviews</p></div></div><div className="mt-4 rounded-xl bg-tft-elevated p-4 text-sm text-tft-muted">"Clear, practical explanations and a calm approach."</div></section>
   </div>
   <p className="mt-5 text-xs text-tft-muted">Tutor For Test retains a service fee per completed booking. Figures shown are fictional demo data.</p>
  </div>
 );
}

function Saved({saved,onBook}:{saved:Set<number>;onBook:(t:Tutor)=>void}){
 const list=tutors.filter(t=>saved.has(t.id));
 return (
  <div className="p-4 sm:p-6 lg:p-8"><h1 className="text-3xl font-black text-tft-text">Saved tutors</h1><p className="mt-2 text-tft-muted">Your shortlist for future sessions.</p><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(t=><TutorCard key={t.id} tutor={t} saved onSave={()=>{}} onProfile={()=>{}} onBook={()=>onBook(t)}/>)}{!list.length&&<div className="col-span-full rounded-[20px] border border-dashed border-tft-border p-10 text-center"><Bookmark className="mx-auto h-10 w-10 text-tft-muted"/><h2 className="mt-3 font-bold text-tft-text">No saved tutors yet</h2><p className="text-sm text-tft-muted">Use the bookmark button on a tutor card to build your shortlist.</p></div>}</div></div>
 );
}

function Help(){
 return (
  <div className="mx-auto max-w-4xl p-4 sm:p-8"><ShieldCheck className="h-10 w-10 text-sky-400"/><h1 className="mt-4 text-3xl font-black text-tft-text">Help & Safety</h1><p className="mt-3 leading-7 text-tft-muted">Tutor For Test is a frontend-only demo. No identity checks, transcript uploads, payments, messages or personal records are processed.</p><div className="mt-7 grid gap-4 sm:grid-cols-2">{[["Academic integrity","Tutors may explain concepts and give feedback, but must never complete assessed work."],["Verification","Production tutor profiles would require identity and official transcript review."],["Payments","All payment panels are clearly marked as demo-only and process no money."],["Reviews","Ratings and testimonials shown are fictional sample data."]].map(([h,p])=><div key={h} className="rounded-[20px] border border-tft-border bg-tft-surface p-5"><h2 className="font-bold text-tft-text">{h}</h2><p className="mt-2 text-sm leading-6 text-tft-muted">{p}</p></div>)}</div></div>
 );
}

export default function TftApp(){
 const [view,setView]=useState<View>("discover"),[dark,setDark]=useState(true),[search,setSearch]=useState(""),[saved,setSaved]=useState(new Set<number>([1,2])),[profile,setProfile]=useState<Tutor|null>(null),[bookingTutor,setBookingTutor]=useState<Tutor|null>(null),[toast,setToast]=useState(""),[bookings,setBookings]=useState<Booking[]>([{id:100,tutorId:1,unit:"INFO2222",date:"Thu 17 Sep · 4:00 pm",duration:60,mode:"Online",topic:"SQL and security",status:"Confirmed"}]);
 const notify=(s:string)=>{setToast(s);setTimeout(()=>setToast(""),2600)}; const saveCurrent=()=>{if(!profile)return;const n=new Set(saved);const was=n.has(profile.id);was?n.delete(profile.id):n.add(profile.id);setSaved(n);notify(was?"Tutor removed from saved":"Tutor saved")};
 return (
  <div className={cx("min-h-screen overflow-x-hidden bg-tft-bg text-tft-text", dark && "dark")}>
   <NavRail view={view} setView={setView} onTutorView={()=>setView("tutor")} dark={dark}/>
   <div className="flex min-h-screen flex-col lg:pl-64">
    <Header setView={setView} dark={dark} setDark={setDark} search={search} setSearch={setSearch}/>
    <AnimatePresence mode="wait">
     <motion.div key={view} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.15}} className="flex-1">
      {view==="discover"&&<Discover search={search} setSearch={setSearch} saved={saved} setSaved={setSaved} onProfile={setProfile} onBook={setBookingTutor} toast={notify}/>}
      {view==="learning"&&<StudentDashboard bookings={bookings} saved={saved} onDiscover={()=>setView("discover")} onBook={setBookingTutor}/>}
      {view==="messages"&&<Messages toast={notify}/>}
      {view==="saved"&&<Saved saved={saved} onBook={setBookingTutor}/>}
      {view==="apply"&&<TutorApplication toast={notify}/>}
      {view==="tutor"&&<TutorDashboard/>}
      {view==="help"&&<Help/>}
     </motion.div>
    </AnimatePresence>
    <Footer/>
   </div>
   <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-tft-border bg-tft-surface/95 p-2 backdrop-blur lg:hidden" aria-label="Mobile navigation">
    {[["discover","Discover",Compass],["learning","Learning",Calendar],["messages","Messages",MessageCircle],["tutor","Profile",Users]].map(([v,l,I]:any)=><button key={v} onClick={()=>setView(v as View)} className={cx("flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tft-accent",view===v?"bg-sky-500/15 text-sky-400":"text-tft-muted")}><I className="h-5 w-5"/>{l}</button>)}
   </nav>
   {profile&&<TutorProfileModal tutor={profile} onClose={()=>setProfile(null)} onBook={()=>{setBookingTutor(profile);setProfile(null)}} saved={saved.has(profile.id)} onSave={saveCurrent}/>}
   {bookingTutor&&<BookingModal tutor={bookingTutor} onClose={()=>setBookingTutor(null)} onConfirm={b=>{setBookings(x=>[...x,b]);notify(`Session booked with ${bookingTutor.name}`)}}/>}
   <AnimatePresence>{toast&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="fixed bottom-24 right-4 z-[80] flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-tft-surface px-4 py-3 text-sm font-semibold text-tft-success shadow-2xl lg:bottom-5"><CheckCircle2 className="h-4 w-4"/>{toast}</motion.div>}</AnimatePresence>
  </div>
 );
}
