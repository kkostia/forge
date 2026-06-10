"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { DayPicker } from "react-day-picker";
import { parseDateString, toDateString } from "@/lib/dates";

export function LogCalendar({
  selected,
  loggedDates,
  trainingDays,
}: {
  selected: string;
  loggedDates: string[];
  trainingDays: number[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const selectedDate = parseDateString(selected);
  const logged = loggedDates.map(parseDateString);

  return (
    <div data-pending={pending ? "" : undefined} className="forge-calendar">
      <DayPicker
        mode="single"
        required
        selected={selectedDate}
        defaultMonth={selectedDate}
        weekStartsOn={1}
        showOutsideDays
        onSelect={(date) => {
          if (!date) return;
          startTransition(() => {
            router.push(`/app/log?date=${toDateString(date)}`, { scroll: false });
          });
        }}
        modifiers={{
          logged,
          planned: (date) => trainingDays.includes(date.getDay()),
        }}
        modifiersClassNames={{ logged: "day-logged", planned: "day-planned" }}
      />
    </div>
  );
}
