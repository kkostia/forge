"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Dumbbell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Why does my shoulder hurt when I bench?",
  "Why has my bench stopped growing?",
  "What should I train today?",
  "How do I get my first pull-up?",
];

function textOf(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function CoachChat({ initialMessages }: { initialMessages: UIMessage[] }) {
  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/coach" }),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="brushed border-edge flex h-[calc(100vh-12rem)] min-h-[28rem] flex-col overflow-hidden rounded-xl border">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="bg-ember/15 text-ember grid size-14 place-items-center rounded-full">
              <Sparkles className="size-7" />
            </span>
            <h2 className="font-display text-ash-100 mt-4 text-2xl tracking-wide uppercase">
              Ask your coach
            </h2>
            <p className="text-ash-400 mt-1 max-w-sm text-sm">
              Grounded in the exercise library and your own training history. Not medical advice —
              see a professional for pain or injury.
            </p>
            <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="border-edge-bright text-ash-300 hover:border-ember hover:text-ash-100 rounded-full border px-3 py-1.5 text-xs transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={textOf(m)} />
        ))}

        {status === "submitted" && (
          <div className="text-ash-500 flex items-center gap-2 text-sm">
            <Dumbbell className="size-4 animate-pulse" /> Coach is thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-edge bg-forge-950/60 flex items-end gap-2 border-t p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(input);
            }
          }}
          rows={1}
          placeholder="Ask about form, plateaus, recovery…"
          className="text-ash-100 placeholder:text-ash-500 max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
          <ArrowUp />
        </Button>
      </form>
    </div>
  );
}

function Bubble({ role, text }: { role: string; text: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-ember text-forge-950 rounded-br-sm"
            : "bg-forge-800 text-ash-200 rounded-bl-sm",
        )}
      >
        {text}
      </div>
    </div>
  );
}
