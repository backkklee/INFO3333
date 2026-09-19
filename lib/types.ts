export type Unit =
  | "INFO2222"
  | "INFO1110"
  | "COMP2017"
  | "SOFT3202"
  | "ELEC1601"
  | "DATA2001"
  | "ECON1001";

export type Review = {
  id: number;
  author: string;
  rating: number;
  unit: Unit;
  text: string;
  date: string;
};

export type Tutor = {
  id: number;
  name: string;
  initials: string;
  degree: string;
  year: string;
  units: Unit[];
  rating: number;
  reviewsCount: number;
  rate: number;
  next: string;
  topics: string[];
  focus: string;
  sessions: number;
  response: string;
  repeat: number;
  headline: string;
  about: string;
  promoted?: boolean;
  availability: string[];
  reviews: Review[];
};

export type Booking = {
  id: number;
  tutorId: number;
  unit: Unit;
  date: string;
  duration: number;
  mode: string;
  topic: string;
  status: string;
};

export type ChatMessage = {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: number;
  tutorId: number;
  preview: string;
  unit: Unit;
  session: string;
  unread: boolean;
  messages: ChatMessage[];
};

export type FilterState = {
  unit: string;
  topics: string[];
  maxPrice: number;
  rating: number;
  availability: string;
  format: string;
  verified: boolean;
};

export type View =
  | "discover"
  | "learning"
  | "messages"
  | "saved"
  | "apply"
  | "tutor"
  | "help";

export type Transaction = {
  id: string;
  student: string;
  unit: string;
  date: string;
  duration: number;
  gross: number;
  fee: number;
  status: "Paid" | "Processing";
};
