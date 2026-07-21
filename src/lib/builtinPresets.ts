import { PresetTaskDraft } from "../models/planPreset";

type TFn = (key: string, vars?: Record<string, string | number>) => string;

export interface BuiltinPreset {
  id: "traditional" | "example";
  labelKey: string;
  getTasks: (t: TFn) => PresetTaskDraft[];
}

export const BUILTIN_PRESETS: BuiltinPreset[] = [
  {
    id: "traditional",
    labelKey: "settings.presets.traditional",
    getTasks: (t) => [
      { id: -1, title: t("preset.traditional.focus", { n: 1 }), duration: 25 * 60 },
      { id: -2, title: t("preset.traditional.shortBreak"), duration: 5 * 60 },
      { id: -3, title: t("preset.traditional.focus", { n: 2 }), duration: 25 * 60 },
      { id: -4, title: t("preset.traditional.shortBreak"), duration: 5 * 60 },
      { id: -5, title: t("preset.traditional.focus", { n: 3 }), duration: 25 * 60 },
      { id: -6, title: t("preset.traditional.shortBreak"), duration: 5 * 60 },
      { id: -7, title: t("preset.traditional.focus", { n: 4 }), duration: 25 * 60 },
      { id: -8, title: t("preset.traditional.longBreak"), duration: 15 * 60 },
    ],
  },
  {
    id: "example",
    labelKey: "settings.presets.example",
    getTasks: (t) => [
      { id: -1, title: t("preset.example.plan"), duration: 10 * 60 },
      { id: -2, title: t("preset.example.deepWork"), duration: 50 * 60 },
      { id: -3, title: t("preset.example.review"), duration: 10 * 60 },
    ],
  },
];
