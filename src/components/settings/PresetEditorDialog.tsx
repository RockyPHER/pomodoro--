import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import AppDialog from "../layout/AppDialog";
import Button from "../layout/Button";
import { PlanPreset, PresetTaskDraft } from "../../models/planPreset";
import { formatTime } from "../../scripts/timeFormat";
import { useI18n } from "../../i18n/context";

interface DraftRow {
  id: number;
  title: string;
  min: string;
  sec: string;
}

let rowIdSeq = 0;
const nextRowId = () => Date.now() * 1000 + rowIdSeq++;

function toRows(tasks: PresetTaskDraft[]): DraftRow[] {
  return tasks.map((task) => {
    const [mm, ss] = formatTime(task.duration);
    return { id: nextRowId(), title: task.title, min: mm, sec: ss };
  });
}

interface PresetEditorDialogProps {
  open: boolean;
  onClose: () => void;
  preset?: PlanPreset;
  onSave: (name: string, tasks: PresetTaskDraft[]) => void;
  onDelete?: (id: string) => void;
}

export default function PresetEditorDialog({
  open,
  onClose,
  preset,
  onSave,
  onDelete,
}: PresetEditorDialogProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [rows, setRows] = useState<DraftRow[]>([]);

  useEffect(() => {
    if (!open) return;
    setName(preset?.name ?? "");
    setRows(preset ? toRows(preset.tasks) : [{ id: nextRowId(), title: "", min: "00", sec: "00" }]);
  }, [open, preset]);

  const updateRow = (id: number, patch: Partial<DraftRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((prev) => [...prev, { id: nextRowId(), title: "", min: "00", sec: "00" }]);

  const removeRow = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSave = () => {
    const tasks: PresetTaskDraft[] = rows
      .map((r) => ({
        id: r.id,
        title: r.title.trim(),
        duration: (parseInt(r.min, 10) || 0) * 60 + (parseInt(r.sec, 10) || 0),
      }))
      .filter((t) => t.title && t.duration > 0);
    if (!name.trim() || tasks.length === 0) return;
    onSave(name.trim(), tasks);
    onClose();
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={preset ? t("presetEditor.titleEdit") : t("presetEditor.titleNew")}
      maxWidthClassName="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-fg-muted">{t("presetEditor.name")}</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("presetEditor.namePlaceholder")}
            maxLength={40}
            className="rounded-md border border-border bg-white/6 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-fg-muted">{t("presetEditor.tasks")}</span>
          <div className="flex flex-col gap-1.5">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center gap-1.5">
                <input
                  value={row.title}
                  onChange={(e) => updateRow(row.id, { title: e.target.value })}
                  placeholder={t("presetEditor.taskNamePlaceholder")}
                  maxLength={40}
                  className="min-w-0 flex-1 rounded-md border border-transparent bg-white/6 px-2.5 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
                <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-transparent bg-white/6">
                  <input
                    value={row.min}
                    onChange={(e) => updateRow(row.id, { min: e.target.value.replace(/\D/g, "").slice(-2) })}
                    onFocus={(e) => e.target.select()}
                    type="text"
                    inputMode="numeric"
                    aria-label={t("task.minutes")}
                    className="w-7 bg-transparent py-1.5 text-center text-sm tabular-nums text-fg outline-none"
                  />
                  <span className="text-fg-muted">:</span>
                  <input
                    value={row.sec}
                    onChange={(e) => updateRow(row.id, { sec: e.target.value.replace(/\D/g, "").slice(-2) })}
                    onFocus={(e) => e.target.select()}
                    type="text"
                    inputMode="numeric"
                    aria-label={t("task.seconds")}
                    className="w-7 bg-transparent py-1.5 text-center text-sm tabular-nums text-fg outline-none"
                  />
                </div>
                <button
                  onClick={() => removeRow(row.id)}
                  aria-label={t("task.deleteDefault")}
                  className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-danger/12 hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addRow}
            className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-white/6 hover:text-fg"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("presetEditor.addTask")}
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          {preset && onDelete ? (
            <button
              onClick={() => {
                onDelete(preset.id);
                onClose();
              }}
              className="cursor-pointer text-xs font-medium text-danger/80 transition-colors hover:text-danger"
            >
              {t("presetEditor.delete")}
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} className="rounded-md px-4 py-2 text-xs">
              {t("presetEditor.cancel")}
            </Button>
            <Button onClick={handleSave} className="rounded-md px-4 py-2 text-xs">
              {t("presetEditor.save")}
            </Button>
          </div>
        </div>
      </div>
    </AppDialog>
  );
}
