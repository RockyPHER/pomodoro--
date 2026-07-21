import { useCallback, useEffect, useState } from "react";
import { PlanPreset, PresetTaskDraft } from "../models/planPreset";

const STORAGE_KEY = "pomodoro:plan-presets";

function loadPresets(): PlanPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let presetIdSeq = 0;
const nextPresetId = () => `preset-${Date.now()}-${presetIdSeq++}`;

interface UsePlanPresetsReturn {
  presets: PlanPreset[];
  createPreset: (name: string, tasks: PresetTaskDraft[]) => void;
  updatePreset: (id: string, name: string, tasks: PresetTaskDraft[]) => void;
  deletePreset: (id: string) => void;
}

export function usePlanPresets(): UsePlanPresetsReturn {
  const [presets, setPresets] = useState<PlanPreset[]>(loadPresets);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const createPreset = useCallback((name: string, tasks: PresetTaskDraft[]) => {
    setPresets((prev) => [...prev, { id: nextPresetId(), name, tasks }]);
  }, []);

  const updatePreset = useCallback((id: string, name: string, tasks: PresetTaskDraft[]) => {
    setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name, tasks } : p)));
  }, []);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { presets, createPreset, updatePreset, deletePreset };
}
