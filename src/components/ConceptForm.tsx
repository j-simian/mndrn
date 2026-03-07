"use client";

import { useState } from "react";
import { Concept, ConceptStatus, FlatSubject, SubjectNode } from "@/lib/types";
import { addCustomNode } from "@/lib/storage";

export default function ConceptForm({
  subjects,
  onAdd,
  onNodeCreated,
}: {
  subjects: FlatSubject[];
  onAdd: (concept: Concept) => void;
  onNodeCreated: (node: SubjectNode) => void;
}) {
  const [text, setText] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [status, setStatus] = useState<ConceptStatus>("new");
  const [showNewNode, setShowNewNode] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeParent, setNewNodeParent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      text: text.trim(),
      subjects: selectedSubjects,
      status,
      createdAt: new Date().toISOString(),
    });
    setText("");
    setSelectedSubjects([]);
    setStatus("new");
  }

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleAddNode(e: React.FormEvent) {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;
    const slug = newNodeLabel.trim().toLowerCase().replace(/\s+/g, "-");
    const id = newNodeParent ? `${newNodeParent}/${slug}` : slug;
    const node: SubjectNode = { id, label: newNodeLabel.trim() };
    addCustomNode(node);
    onNodeCreated(node);
    setNewNodeLabel("");
    setNewNodeParent("");
    setShowNewNode(false);
  }

  // Get top-level subjects for the parent dropdown
  const topLevel = subjects.filter((s) => !s.id.includes("/"));

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Add Concept</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Lagrange's theorem, 你好 (nǐ hǎo) — hello"
          rows={3}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Subjects:</span>
            <button
              type="button"
              onClick={() => setShowNewNode(!showNewNode)}
              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
            >
              + new node
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSubject(s.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedSubjects.includes(s.id)
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {s.display}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Status:</span>
          {(["new", "learning", "learnt"] as ConceptStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                status === s
                  ? s === "new"
                    ? "bg-blue-600 text-white"
                    : s === "learning"
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="self-start rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Add
        </button>
      </form>

      {showNewNode && (
        <form
          onSubmit={handleAddNode}
          className="flex flex-wrap items-end gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">Parent (optional)</label>
            <select
              value={newNodeParent}
              onChange={(e) => setNewNodeParent(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">(top level)</option>
              {topLevel.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.display}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">Node name</label>
            <input
              type="text"
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="e.g. topology"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-700 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-600 transition-colors"
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
}
