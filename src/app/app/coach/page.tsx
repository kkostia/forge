import type { Metadata } from "next";
import type { UIMessage } from "ai";
import { Container } from "@/components/ui/container";
import { CoachChat } from "@/components/coach/coach-chat";
import { requireOnboardedProfile } from "@/lib/auth";
import { getChatHistory } from "@/lib/coach";

export const metadata: Metadata = { title: "AI Coach" };

export default async function CoachPage() {
  const { user } = await requireOnboardedProfile();
  const history = await getChatHistory(user.id);

  return (
    <Container className="space-y-6">
      <div>
        <p className="text-ember-bright text-xs tracking-widest uppercase">AI Coach</p>
        <h1 className="font-display text-ash-100 mt-1 text-4xl tracking-wide uppercase">
          Forge Coach
        </h1>
        <p className="text-ash-400 mt-1">
          Ask anything about training. Answers are grounded in the exercise library and your own
          logs.
        </p>
      </div>

      <CoachChat initialMessages={history as unknown as UIMessage[]} />
    </Container>
  );
}
