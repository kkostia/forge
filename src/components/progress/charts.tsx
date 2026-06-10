"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MUSCLE_GROUPS, MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import type { ProgressPoint, WeeklyVolumeRow } from "@/lib/progress";

const AXIS = "#7c776e";
const GRID = "#26262f";

const tooltipStyle = {
  backgroundColor: "#16161c",
  border: "1px solid #34343f",
  borderRadius: 8,
  color: "#f5f2ec",
  fontSize: 13,
};

export function WeeklyVolumeChart({ data }: { data: WeeklyVolumeRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          formatter={(value, name) => [
            `${Math.round(Number(value)).toLocaleString()} kg`,
            MUSCLE_GROUP_LABELS[name as keyof typeof MUSCLE_GROUP_LABELS] ?? name,
          ]}
        />
        {MUSCLE_GROUPS.map((g, i) => (
          <Bar
            key={g}
            dataKey={g}
            stackId="vol"
            fill={MUSCLE_GROUP_COLORS[g]}
            radius={i === MUSCLE_GROUPS.length - 1 ? [4, 4, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ExerciseProgressChart({
  options,
  series,
}: {
  options: { slug: string; name: string }[];
  series: Record<string, ProgressPoint[]>;
}) {
  const [slug, setSlug] = useState(options[0]?.slug ?? "");
  const data = series[slug] ?? [];

  return (
    <div className="space-y-4">
      <select
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border-edge-bright bg-forge-950/60 text-ash-100 focus-visible:border-ember h-10 rounded-md border px-3 text-sm focus-visible:outline-none"
        aria-label="Choose an exercise to chart"
      >
        {options.map((o) => (
          <option key={o.slug} value={o.slug} className="bg-forge-900">
            {o.name}
          </option>
        ))}
      </select>

      {data.length < 2 ? (
        <p className="text-ash-500 py-16 text-center text-sm">
          Log this lift on at least two different days to see a trend line.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="label" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={AXIS}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="kg"
              width={48}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value} kg`, "Top set"]}
            />
            <Line
              type="monotone"
              dataKey="bestWeight"
              stroke="#FF7A1A"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#FF7A1A" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
