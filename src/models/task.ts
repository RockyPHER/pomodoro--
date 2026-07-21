export type TaskKind = "standard" | "checklist";

export interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

export interface ITask {
    id: number;
    title: string;
    duration: number;
    description?: string;
    kind?: TaskKind;
    checklist?: ChecklistItem[];
}
