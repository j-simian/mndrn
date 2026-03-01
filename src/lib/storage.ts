import { StudyEntry } from "./types";

const STORAGE_KEY = "mndrn-study-entries";

export function loadEntries(): StudyEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StudyEntry[];
  } catch {
    return [];
  }
}

export function saveEntries(entries: StudyEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: StudyEntry) {
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id: string) {
  const entries = loadEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}

/** Returns a map of YYYY-MM-DD -> total minutes for that day */
export function minutesByDay(entries: StudyEntry[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of entries) {
    map[e.date] = (map[e.date] || 0) + e.minutes;
  }
  return map;
}
