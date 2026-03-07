"use client";

import { useCallback, useEffect, useState } from "react";
import LogForm from "@/components/LogForm";
import Heatmap from "@/components/Heatmap";
import BarChart from "@/components/BarChart";
import {
  loadEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  minutesByDay,
} from "@/lib/storage";
import {
  StudyEntry,
  SUBJECT_TREE,
  flattenSubjects,
  FlatSubject,
} from "@/lib/types";

const SUBJECTS = flattenSubjects(SUBJECT_TREE);

function subjectDisplay(subjectId: string | undefined): string | null {
  if (!subjectId) return null;
  const found = SUBJECTS.find((s) => s.id === subjectId);
  return found?.display ?? subjectId;
}

export default function Home() {
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadEntries());
    setMounted(true);
  }, []);

  const dayMap = minutesByDay(entries);

  const handleAdd = useCallback((entry: StudyEntry) => {
    setEntries(addEntry(entry));
  }, []);

  const handleUpdate = useCallback((entry: StudyEntry) => {
    setEntries(updateEntry(entry));
    setEditingId(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEntries(deleteEntry(id));
    setEditingId(null);
  }, []);

  // Recent entries (last 10), sorted newest first
  const recent = [...entries]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 10);

  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const streakDays = calculateStreak(dayMap);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight">
          mndrn{" "}
          <span className="text-zinc-400 font-normal">/ study tracker</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          mndrn{" "}
          <span className="text-zinc-400 font-normal">/ study tracker</span>
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
            {recent.map((e) =>
              editingId === e.id ? (
                <EditRow
                  key={e.id}
                  entry={e}
                  subjects={SUBJECTS}
                  onSave={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <li
                  key={e.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 dark:text-zinc-400 w-24">
                      {e.date}
                    </span>
                    {subjectDisplay(e.subject) && (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        {subjectDisplay(e.subject)}
                      </span>
                    )}
                    <span className="font-medium">{e.minutes} min</span>
                    {e.note && (
                      <span className="text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">
                        {e.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingId(e.id)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-xs"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors text-xs"
                    >
                      remove
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function EditRow({
  entry,
  subjects,
  onSave,
  onCancel,
}: {
  entry: StudyEntry;
  subjects: FlatSubject[];
  onSave: (entry: StudyEntry) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(entry.date);
  const [minutes, setMinutes] = useState(String(entry.minutes));
  const [note, setNote] = useState(entry.note);
  const [subject, setSubject] = useState(entry.subject ?? subjects[0]?.id ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mins = parseInt(minutes, 10);
    if (!mins || mins <= 0) return;
    onSave({ ...entry, date, minutes: mins, note: note.trim(), subject });
  }

  return (
    <li className="py-2">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-sm">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.display}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <span className="text-zinc-400 text-xs">min</span>
        <input
          type="text"
          value={note}
          placeholder="Note"
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 min-w-[100px] rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          cancel
        </button>
      </form>
    </li>
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
