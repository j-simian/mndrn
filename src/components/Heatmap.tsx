"use client";

import { useMemo } from "react";

/** GitHub-style contribution heatmap for the last ~52 weeks */
export default function Heatmap({
  minutesByDay,
}: {
  minutesByDay: Record<string, number>;
}) {
  const { weeks, monthLabels } = useMemo(() => buildGrid(minutesByDay), [minutesByDay]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Study Heatmap</h2>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${weeks.length * 15 + 30} 120`}
          className="w-full max-w-3xl"
        >
          {/* Month labels */}
          {monthLabels.map((m) => (
            <text
              key={m.label + m.x}
              x={m.x}
              y={10}
              className="fill-zinc-500 dark:fill-zinc-400"
              fontSize={9}
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {["Mon", "Wed", "Fri"].map((d, i) => (
            <text
              key={d}
              x={0}
              y={28 + i * 28}
              className="fill-zinc-500 dark:fill-zinc-400"
              fontSize={9}
              dominantBaseline="middle"
            >
              {d}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.map((day) =>
              day ? (
                <rect
                  key={day.date}
                  x={wi * 15 + 28}
                  y={day.dow * 15 + 16}
                  width={12}
                  height={12}
                  rx={2}
                  className={cellColor(day.level)}
                >
                  <title>{`${day.date}: ${day.minutes} min`}</title>
                </rect>
              ) : null
            )
          )}
        </svg>
      </div>
      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className={`inline-block h-3 w-3 rounded-sm ${cellColor(l)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function cellColor(level: number) {
  switch (level) {
    case 0:
      return "fill-zinc-200 dark:fill-zinc-800 bg-zinc-200 dark:bg-zinc-800";
    case 1:
      return "fill-emerald-300 dark:fill-emerald-900 bg-emerald-300 dark:bg-emerald-900";
    case 2:
      return "fill-emerald-400 dark:fill-emerald-700 bg-emerald-400 dark:bg-emerald-700";
    case 3:
      return "fill-emerald-500 dark:fill-emerald-500 bg-emerald-500 dark:bg-emerald-500";
    case 4:
      return "fill-emerald-600 dark:fill-emerald-400 bg-emerald-600 dark:bg-emerald-400";
    default:
      return "fill-zinc-200 dark:fill-zinc-800 bg-zinc-200 dark:bg-zinc-800";
  }
}

interface DayCell {
  date: string;
  dow: number;
  minutes: number;
  level: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildGrid(data: Record<string, number>) {
  const today = new Date();
  // Go back ~52 weeks (364 days)
  const start = new Date(today);
  start.setDate(start.getDate() - 363);
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  const allMinutes = Object.values(data);
  const maxMin = Math.max(...allMinutes, 1);
  const thresholds = [0, maxMin * 0.15, maxMin * 0.4, maxMin * 0.65];

  function level(mins: number) {
    if (mins <= 0) return 0;
    if (mins < thresholds[1]) return 1;
    if (mins < thresholds[2]) return 2;
    if (mins < thresholds[3]) return 3;
    return 4;
  }

  const weeks: (DayCell | null)[][] = [];
  const monthLabels: { label: string; x: number }[] = [];
  let currentWeek: (DayCell | null)[] = [];
  let lastMonth = -1;

  const cursor = new Date(start);
  while (cursor <= today) {
    const dow = cursor.getDay();
    const dateStr = cursor.toISOString().slice(0, 10);
    const mins = data[dateStr] || 0;

    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    const m = cursor.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: MONTHS[m], x: weeks.length * 15 + 28 });
      lastMonth = m;
    }

    currentWeek.push({ date: dateStr, dow, minutes: mins, level: level(mins) });
    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return { weeks, monthLabels };
}
