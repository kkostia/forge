import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { getUser, getProfile } from "@/lib/auth";
import { buildCoachContext, fallbackCoachReply, COACH_SYSTEM_PROMPT } from "@/lib/coach";

export const maxDuration = 30;

/** Concatenate the text parts of a UIMessage. */
function textOf(message: UIMessage | undefined): string {
  if (!message) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
    .trim();
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const profile = await getProfile(user.id);
  if (!profile) {
    return new Response("No profile", { status: 400 });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const messages = (body.messages ?? []).slice(-12);
  const lastUserText = textOf(messages[messages.length - 1]);

  const supabase = await createClient();
  if (lastUserText) {
    await supabase
      .from("chat_messages")
      .insert({ user_id: user.id, role: "user", content: lastUserText });
  }

  const context = await buildCoachContext(profile);

  // --- Graceful fallback when no API key is configured ---
  if (!process.env.OPENAI_API_KEY) {
    const reply = await fallbackCoachReply(profile, lastUserText);
    await supabase
      .from("chat_messages")
      .insert({ user_id: user.id, role: "assistant", content: reply });

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const id = "fallback";
        writer.write({ type: "text-start", id });
        // Emit in small chunks for a typed-out feel.
        for (let i = 0; i < reply.length; i += 24) {
          writer.write({ type: "text-delta", id, delta: reply.slice(i, i + 24) });
          await new Promise((r) => setTimeout(r, 12));
        }
        writer.write({ type: "text-end", id });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }

  // --- Live coach ---
  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `${COACH_SYSTEM_PROMPT}\n\n${context}`,
    messages: modelMessages,
    temperature: 0.6,
    onFinish: async ({ text }) => {
      if (text.trim()) {
        await supabase
          .from("chat_messages")
          .insert({ user_id: user.id, role: "assistant", content: text });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
