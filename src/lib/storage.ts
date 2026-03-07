import { StudyEntry, Concept, SubjectNode } from "./types";

const STORAGE_KEY = "mndrn-study-entries";
const CONCEPTS_KEY = "mndrn-concepts";
const CUSTOM_NODES_KEY = "mndrn-custom-subject-nodes";

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

export function updateEntry(updated: StudyEntry) {
  const entries = loadEntries().map((e) => (e.id === updated.id ? updated : e));
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

// --- Concepts ---

export function loadConcepts(): Concept[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONCEPTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Concept[];
  } catch {
    return [];
  }
}

export function saveConcepts(concepts: Concept[]) {
  localStorage.setItem(CONCEPTS_KEY, JSON.stringify(concepts));
}

export function addConcept(concept: Concept) {
  const concepts = loadConcepts();
  concepts.push(concept);
  saveConcepts(concepts);
  return concepts;
}

export function updateConcept(updated: Concept) {
  const concepts = loadConcepts().map((c) => (c.id === updated.id ? updated : c));
  saveConcepts(concepts);
  return concepts;
}

export function deleteConcept(id: string) {
  const concepts = loadConcepts().filter((c) => c.id !== id);
  saveConcepts(concepts);
  return concepts;
}

// --- Custom subject nodes ---

export function loadCustomNodes(): SubjectNode[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CUSTOM_NODES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SubjectNode[];
  } catch {
    return [];
  }
}

export function saveCustomNodes(nodes: SubjectNode[]) {
  localStorage.setItem(CUSTOM_NODES_KEY, JSON.stringify(nodes));
}

export function addCustomNode(node: SubjectNode) {
  const nodes = loadCustomNodes();
  if (!nodes.some((n) => n.id === node.id)) {
    nodes.push(node);
    saveCustomNodes(nodes);
  }
  return nodes;
}
