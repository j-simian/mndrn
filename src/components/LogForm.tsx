"use client";

import { useState } from "react";
import { StudyEntry } from "@/lib/types";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function LogForm({
  onAdd,
}: {
  onAdd: (entry: StudyEntry) => void;
}) {
  const [date, setDate] = useState(todayStr);
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mins = parseInt(minutes, 10);
    if (!mins || mins <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      date,
      minutes: mins,
      note: note.trim(),
    });
    setMinutes("");
    setNote("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Log Study Time</h2>
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="number"
          min={1}
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-28 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 min-w-[140px] rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Log
        </button>
      </div>
    </form>
  );
}
