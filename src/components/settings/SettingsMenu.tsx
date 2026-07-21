import { useEffect, useRef, useState } from "react";
import { Menu, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import IconButton from "../layout/IconButton";
import PresetEditorDialog from "./PresetEditorDialog";
import { usePlanPresets } from "../../hooks/usePlanPresets";
import { BUILTIN_PRESETS } from "../../lib/builtinPresets";
import { PlanPreset, PresetTaskDraft } from "../../models/planPreset";
import { useI18n } from "../../i18n/context";
import { cn } from "../../lib/cn";

interface SettingsMenuProps {
  onApplyPreset: (tasks: PresetTaskDraft[]) => void;
}

export default function SettingsMenu({ onApplyPreset }: SettingsMenuProps) {
  const { t } = useI18n();
  const { presets, createPreset, updatePreset, deletePreset } = usePlanPresets();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlanPreset | "new" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const applyBuiltin = (id: (typeof BUILTIN_PRESETS)[number]) => {
    onApplyPreset(id.getTasks(t));
    setOpen(false);
  };

  const applyCustom = (preset: PlanPreset) => {
    onApplyPreset(preset.tasks);
    setOpen(false);
  };

  const handleSave = (name: string, tasks: PresetTaskDraft[]) => {
    if (editing && editing !== "new") updatePreset(editing.id, name, tasks);
    else createPreset(name, tasks);
    setEditing(null);
  };

  return (
    <div className="relative" ref={rootRef}>
      <IconButton
        label={t("topbar.settings")}
        active={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Menu className="h-[1.15rem] w-[1.15rem]" />
      </IconButton>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="glass absolute left-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-xl p-1.5"
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-fg-muted">
              {t("settings.presets")}
            </p>
            {BUILTIN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyBuiltin(preset)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-fg-soft transition-colors hover:bg-white/6 hover:text-fg"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
                <span className="min-w-0 flex-1 truncate">{t(preset.labelKey)}</span>
              </button>
            ))}

            <div className="my-1 h-px bg-border" />

            <p className="px-2.5 pb-1 pt-1 text-[0.65rem] font-medium uppercase tracking-wider text-fg-muted">
              {t("settings.presets.custom")}
            </p>
            {presets.length === 0 && (
              <p className="px-2.5 py-1.5 text-xs text-fg-muted">{t("settings.presets.empty")}</p>
            )}
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="group/preset flex w-full items-center gap-1 rounded-lg px-1 py-0.5"
              >
                <button
                  onClick={() => applyCustom(preset)}
                  className="min-w-0 flex-1 cursor-pointer truncate rounded-lg px-1.5 py-1.5 text-left text-sm text-fg-soft transition-colors hover:bg-white/6 hover:text-fg"
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => setEditing(preset)}
                  aria-label={t("settings.presets.edit")}
                  className={cn(
                    "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-muted opacity-0 transition-all hover:bg-white/8 hover:text-fg group-hover/preset:opacity-100",
                  )}
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => deletePreset(preset.id)}
                  aria-label={t("settings.presets.delete")}
                  className={cn(
                    "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-muted opacity-0 transition-all hover:bg-danger/12 hover:text-danger group-hover/preset:opacity-100",
                  )}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}

            <div className="my-1 h-px bg-border" />

            <button
              onClick={() => setEditing("new")}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-accent-dim"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              {t("settings.presets.new")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PresetEditorDialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        preset={editing && editing !== "new" ? editing : undefined}
        onSave={handleSave}
        onDelete={(id) => deletePreset(id)}
      />
    </div>
  );
}
