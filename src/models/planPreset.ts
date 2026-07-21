export interface PresetTaskDraft {
  id: number;
  title: string;
  duration: number;
}

export interface PlanPreset {
  id: string;
  name: string;
  tasks: PresetTaskDraft[];
}
