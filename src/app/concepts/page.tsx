"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ConceptForm from "@/components/ConceptForm";
import {
  loadConcepts,
  addConcept,
  updateConcept,
  deleteConcept,
  loadCustomNodes,
} from "@/lib/storage";
import {
  Concept,
  ConceptStatus,
  SubjectNode,
  SUBJECT_TREE,
  flattenSubjects,
  mergeSubjectTree,
} from "@/lib/types";

const STATUS_COLORS: Record<ConceptStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  learning: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  learnt: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
};

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [customNodes, setCustomNodes] = useState<SubjectNode[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ConceptStatus | "all">("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  useEffect(() => {
    setConcepts(loadConcepts());
    setCustomNodes(loadCustomNodes());
    setMounted(true);
  }, []);

  const tree = mergeSubjectTree(SUBJECT_TREE, customNodes);
  const subjects = flattenSubjects(tree);

  const handleAdd = useCallback((concept: Concept) => {
    setConcepts(addConcept(concept));
  }, []);

  const handleNodeCreated = useCallback(() => {
    setCustomNodes(loadCustomNodes());
  }, []);

  const handleStatusChange = useCallback((id: string, status: ConceptStatus) => {
    const concept = loadConcepts().find((c) => c.id === id);
    if (concept) {
      setConcepts(updateConcept({ ...concept, status }));
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    setConcepts(deleteConcept(id));
  }, []);

  const filtered = concepts.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterSubject !== "all" && !c.subjects.includes(filterSubject)) return false;
    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight">
          mndrn <span className="text-zinc-400 font-normal">/ concepts</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          mndrn <span className="text-zinc-400 font-normal">/ concepts</span>
        </h1>
        <div className="mt-2 flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{concepts.length} concepts</span>
          <span>
            {concepts.filter((c) => c.status === "learnt").length} learnt
          </span>
          <Link
            href="/"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            study tracker
          </Link>
          <Link
            href="/resources"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            resources
          </Link>
        </div>
      </header>

      <ConceptForm
        subjects={subjects}
        onAdd={handleAdd}
        onNodeCreated={handleNodeCreated}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Filter:</span>
        {(["all", "new", "learning", "learnt"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {s}
          </button>
        ))}
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="all">all subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.display}
            </option>
          ))}
        </select>
      </div>

      {/* Concept list */}
      {sorted.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {sorted.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm whitespace-pre-wrap flex-1">{c.text}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      handleStatusChange(c.id, e.target.value as ConceptStatus)
                    }
                    className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 ${STATUS_COLORS[c.status]}`}
                  >
                    <option value="new">new</option>
                    <option value="learning">learning</option>
                    <option value="learnt">learnt</option>
                  </select>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors text-xs"
                  >
                    remove
                  </button>
                </div>
              </div>
              {c.subjects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.subjects.map((sid) => {
                    const found = subjects.find((s) => s.id === sid);
                    return (
                      <span
                        key={sid}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {found?.display ?? sid}
                      </span>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {concepts.length === 0
            ? "No concepts yet. Add one above."
            : "No concepts match the current filters."}
        </p>
      )}
    </div>
  );
}
