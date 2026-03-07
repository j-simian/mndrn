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
