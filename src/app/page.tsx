"use client";

import { useCallback, useEffect, useState } from "react";
import LogForm from "@/components/LogForm";
import Heatmap from "@/components/Heatmap";
import BarChart from "@/components/BarChart";
import {
  loadEntries,
  addEntry,
  deleteEntry,
  minutesByDay,
} from "@/lib/storage";
import { StudyEntry } from "@/lib/types";

export default function Home() {
  const [entries, setEntries] = useState<StudyEntry[]>([]);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const dayMap = minutesByDay(entries);

  const handleAdd = useCallback((entry: StudyEntry) => {
    setEntries(addEntry(entry));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEntries(deleteEntry(id));
  }, []);

  // Recent entries (last 10), sorted newest first
  const recent = [...entries]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 10);

  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const streakDays = calculateStreak(dayMap);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          mndrn <span className="text-zinc-400 font-normal">/ mandarin study tracker</span>
        </h1>
        <div className="mt-2 flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{totalHours} hrs total</span>
          <span>{entries.length} sessions</span>
          <span>{streakDays} day streak</span>
        </div>
      </header>

      <LogForm onAdd={handleAdd} />

      <Heatmap minutesByDay={dayMap} />

      <BarChart minutesByDay={dayMap} />

      {/* Recent entries */}
      {recent.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Recent Sessions</h2>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {recent.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400 w-24">
                    {e.date}
                  </span>
                  <span className="font-medium">{e.minutes} min</span>
                  {e.note && (
                    <span className="text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">
                      {e.note}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors text-xs"
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function calculateStreak(dayMap: Record<string, number>): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (dayMap[key] && dayMap[key] > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
