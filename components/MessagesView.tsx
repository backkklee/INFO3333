"use client";

import React, { useState } from "react";
import { Send, Paperclip, Video, ShieldCheck } from "lucide-react";
import { Conversation, Tutor } from "@/lib/types";
import { Avatar, Button, Stars, cx } from "@/components/UiPrimitives";

interface MessagesViewProps {
  conversations: Conversation[];
  tutors: Tutor[];
  toast: (msg: string) => void;
}

export function MessagesView({
  conversations: initialList,
  tutors,
  toast,
}: MessagesViewProps) {
  const [convos, setConvos] = useState(initialList);
  const [activeId, setActiveId] = useState(1);
  const [text, setText] = useState("");

  const activeConvo = convos.find((c) => c.id === activeId) || convos[0];
  const tutor = tutors.find((t) => t.id === activeConvo.tutorId) || tutors[0];

  const handleSend = () => {
    if (!text.trim()) return;
    setConvos(
      convos.map((c) =>
        c.id === activeId
          ? {
              ...c,
              preview: text,
              messages: [
                ...c.messages,
                { id: Date.now(), sender: "me", text, time: "Just now" },
              ],
            }
          : c
      )
    );
    setText("");
    toast("Demo message sent to tutor");
  };

  return (
    <div className="grid h-[calc(100vh-64px)] bg-tft-bg md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_280px]">
      <aside className="hidden border-r border-tft-border bg-tft-surface md:block">
        <div className="p-4 border-b border-tft-border">
          <h2 className="text-sm font-bold text-tft-text">Conversations</h2>
          <p className="text-[11px] text-tft-muted">Active peer tutoring threads</p>
        </div>
        <div className="divide-y divide-tft-border">
          {convos.map((item) => {
            const itemTutor = tutors.find((t) => t.id === item.tutorId);
            if (!itemTutor) return null;
            const isSelected = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cx(
                  "flex w-full gap-3 p-3.5 text-left transition focus:outline-none focus-visible:ring-1 focus-visible:ring-tft-primary",
                  isSelected
                    ? "bg-tft-elevated border-l-2 border-tft-primary"
                    : "hover:bg-tft-elevated/40"
                )}
              >
                <Avatar tutor={itemTutor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-tft-text truncate">
                      {itemTutor.name}
                    </span>
                    {item.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-tft-primary" />
                    )}
                  </div>
                  <p className="truncate text-[11px] text-tft-muted">{item.preview}</p>
                  <p className="mt-1 text-[10px] text-tft-primary font-medium">
                    {item.session}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex min-w-0 flex-col bg-tft-bg">
        <header className="flex items-center gap-3 border-b border-tft-border bg-tft-surface p-3.5">
          <Avatar tutor={tutor} size="sm" />
          <div>
            <h2 className="text-xs font-bold text-tft-text">{tutor.name}</h2>
            <p className="text-[11px] text-tft-muted">
              {activeConvo.unit} · Next: {activeConvo.session}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => toast("Starting demo video room...")}
            className="ml-auto hidden sm:inline-flex text-xs py-1.5 px-3"
          >
            <Video className="h-3.5 w-3.5 text-tft-primary" />
            Join Demo Video Room
          </Button>
        </header>

        <div className="border-b border-tft-border bg-tft-surface/60 px-4 py-2 text-[11px] text-tft-muted flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-tft-primary shrink-0" />
          <span>
            Academic Integrity Policy: Chat history is recorded for student safety and policy compliance.
          </span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
          {activeConvo.messages.map((m) => (
            <div
              key={m.id}
              className={cx(
                "flex",
                m.sender === "me" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cx(
                  "max-w-[80%] rounded-xl px-3.5 py-2.5",
                  m.sender === "me"
                    ? "bg-tft-primary text-white"
                    : "border border-tft-border bg-tft-surface text-tft-text"
                )}
              >
                <p>{m.text}</p>
                <div className="mt-1 text-[10px] opacity-70 text-right">
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-tft-border bg-tft-surface p-3">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Attach file"
              onClick={() => toast("File attachment is simulated in demo")}
              className="grid h-9 w-9 place-items-center rounded-xl border border-tft-border text-tft-muted hover:text-tft-text focus:outline-none focus-visible:ring-1 focus-visible:ring-tft-primary"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question or discuss session focus..."
              className="min-w-0 flex-1 rounded-xl border border-tft-border bg-tft-bg px-3 text-xs text-tft-text outline-none focus:border-tft-primary focus:ring-1 focus:ring-tft-primary"
            />
            <Button
              onClick={handleSend}
              aria-label="Send message"
              className="text-xs py-1.5 px-3"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </main>

      <aside className="hidden border-l border-tft-border bg-tft-surface p-4 text-xs xl:block">
        <Avatar tutor={tutor} size="lg" />
        <h3 className="mt-3 text-sm font-bold text-tft-text">{tutor.name}</h3>
        <p className="text-[11px] text-tft-muted">{tutor.degree}</p>

        <div className="mt-4 space-y-2 rounded-xl border border-tft-border bg-tft-elevated p-3">
          <div className="flex justify-between items-center">
            <span className="text-tft-muted">Rating:</span>
            <Stars rating={tutor.rating} />
          </div>
          <div className="flex justify-between">
            <span className="text-tft-muted">Hourly Rate:</span>
            <span className="font-semibold text-tft-text">${tutor.rate}/hr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tft-muted">Unit Support:</span>
            <span className="font-semibold text-tft-text">{activeConvo.unit}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
