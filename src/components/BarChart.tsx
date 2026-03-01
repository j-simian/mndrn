"use client";

import { useMemo } from "react";

/** Simple bar chart showing hours per day for the last 30 days */
export default function BarChart({
  minutesByDay,
}: {
  minutesByDay: Record<string, number>;
}) {
  const days = useMemo(() => {
    const result: { date: string; label: string; hours: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      result.push({
        date: dateStr,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        hours: (minutesByDay[dateStr] || 0) / 60,
      });
    }
    return result;
  }, [minutesByDay]);

  const maxHours = Math.max(...days.map((d) => d.hours), 0.5);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Hours per Day (last 30 days)</h2>
      <div className="overflow-x-auto">
        <div className="flex items-end gap-[3px] min-w-[500px]" style={{ height: 180 }}>
          {days.map((d) => {
            const pct = d.hours > 0 ? (d.hours / maxHours) * 100 : 0;
            return (
              <div
                key={d.date}
                className="group relative flex flex-1 flex-col items-center justify-end h-full"
              >
                {/* Tooltip */}
                <div className="absolute -top-7 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-xs text-white whitespace-nowrap dark:bg-zinc-200 dark:text-zinc-900">
                  {d.hours.toFixed(1)}h
                </div>
                {/* Bar */}
                <div
                  className="w-full rounded-t bg-emerald-500 transition-all min-h-[2px]"
                  style={{ height: `${Math.max(pct, d.hours > 0 ? 4 : 0)}%` }}
                />
              </div>
            );
          })}
        </div>
        {/* X-axis labels: show every 5th day */}
        <div className="flex gap-[3px] min-w-[500px] mt-1">
          {days.map((d, i) => (
            <div
              key={d.date}
              className="flex-1 text-center text-[10px] text-zinc-400"
            >
              {i % 5 === 0 ? d.label : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
