export interface SubjectNode {
  id: string;
  label: string;
  children?: SubjectNode[];
}

export const SUBJECT_TREE: SubjectNode[] = [
  {
    id: "languages",
    label: "languages",
    children: [{ id: "languages/mandarin", label: "mandarin" }],
  },
  {
    id: "maths",
    label: "maths",
    children: [{ id: "maths/group-theory", label: "group theory" }],
  },
];

export interface FlatSubject {
  id: string;
  display: string;
}

/** Flatten the subject tree into a list of { id, display } for dropdowns */
export function flattenSubjects(
  nodes: SubjectNode[],
  parentPath: string[] = [],
): FlatSubject[] {
  const result: FlatSubject[] = [];
  for (const node of nodes) {
    const path = [...parentPath, node.label];
    result.push({
      id: node.id,
      display: path.length > 1 ? path.join(" > ") : node.label,
    });
    if (node.children) {
      result.push(...flattenSubjects(node.children, path));
    }
  }
  return result;
}

export interface StudyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  note: string;
  subject?: string; // subject node id
}

export type ConceptStatus = "new" | "learning" | "learnt";

export interface Concept {
  id: string;
  text: string;
  subjects: string[]; // subject node ids
  status: ConceptStatus;
  createdAt: string; // ISO date string
}

/** Merge custom nodes into the base subject tree */
export function mergeSubjectTree(
  base: SubjectNode[],
  custom: SubjectNode[],
): SubjectNode[] {
  const merged: SubjectNode[] = base.map((node) => ({
    ...node,
    children: node.children ? [...node.children] : [],
  }));
  for (const cNode of custom) {
    // If it's a child node (has a /), attach to existing parent
    const slashIdx = cNode.id.indexOf("/");
    if (slashIdx !== -1) {
      const parentId = cNode.id.slice(0, slashIdx);
      const parent = merged.find((n) => n.id === parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        if (!parent.children.some((c) => c.id === cNode.id)) {
          parent.children.push(cNode);
        }
        continue;
      }
    }
    // Top-level custom node
    if (!merged.some((n) => n.id === cNode.id)) {
      merged.push(cNode);
    }
  }
  return merged;
}
