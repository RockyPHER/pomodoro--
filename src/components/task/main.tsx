import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { GripVertical, ListChecks, NotebookText, Plus, X } from "lucide-react";
import { ChecklistItem, ITask, TaskKind } from "../../models/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDurationInput } from "../../hooks/useDurationInput";
import { cn } from "../../lib/cn";
import { useI18n } from "../../i18n/context";

interface TaskProps {
  data: ITask;
  deleteTask: (delTask: ITask) => void;
  updateTask: (updatedTask: ITask) => void;
  isNew?: boolean;
  onConfirm?: () => void;
}

const durationBadge =
  "flex items-center shrink-0 text-sm leading-none tabular-nums rounded-md overflow-hidden";

let checklistItemSeq = 0;
const nextChecklistId = () => Date.now() * 1000 + checklistItemSeq++;

export default function Task({
  data,
  deleteTask,
  updateTask,
  isNew = false,
  onConfirm,
}: TaskProps) {
  const { t } = useI18n();
  const [task, setTask] = useState<ITask>(data);
  const [editDuration, setEditDuration] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [focusField, setFocusField] = useState<"min" | "sec" | null>(null);

  const { min, sec, duration, handleMinInput, handleSecInput } =
    useDurationInput(data.duration);

  const [mm, ss] = formatTime(task.duration);
  const kind: TaskKind = task.kind ?? "standard";
  const checklist = task.checklist ?? [];
  const checklistDone = checklist.filter((i) => i.done).length;
  const containerRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement | null>(null);
  const minRef = useRef<HTMLInputElement | null>(null);
  const secRef = useRef<HTMLInputElement | null>(null);
  const mounted = useRef(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: data.id });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!isNew) updateTask(task);
    // Only react to local edits of `task`; not to identity of updateTask/isNew.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  useEffect(() => {
    setTask((prev) => ({ ...prev, duration }));
  }, [duration]);

  useEffect(() => {
    if (!editDuration) return;
    if (focusField === "min") minRef.current?.focus();
    else if (focusField === "sec") secRef.current?.focus();
  }, [editDuration, focusField]);

  const handleDurationBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setEditDuration(false);
    }
  };

  // --- Creation mode ---
  const confirmNew = () => {
    if (!task.title.trim()) deleteTask(task);
    else {
      updateTask(task);
      onConfirm?.();
    }
  };

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      !e.relatedTarget ||
      !containerRef.current?.contains(e.relatedTarget as Node)
    ) {
      confirmNew();
    }
  };

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      minRef.current?.focus();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      deleteTask(task);
    }
  };

  const handleMinKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      secRef.current?.focus();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      deleteTask(task);
    }
  };

  const handleSecKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmNew();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      deleteTask(task);
    }
  };

  const setKind = (next: TaskKind) => setTask((prev) => ({ ...prev, kind: next }));

  const addChecklistItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    const item: ChecklistItem = { id: nextChecklistId(), text, done: false };
    setTask((prev) => ({ ...prev, checklist: [...(prev.checklist ?? []), item] }));
    setNewItemText("");
  };

  const toggleChecklistItem = (id: number) =>
    setTask((prev) => ({
      ...prev,
      checklist: (prev.checklist ?? []).map((i) =>
        i.id === id ? { ...i, done: !i.done } : i,
      ),
    }));

  const removeChecklistItem = (id: number) =>
    setTask((prev) => ({
      ...prev,
      checklist: (prev.checklist ?? []).filter((i) => i.id !== id),
    }));

  const kindToggle = (
    <div className="flex gap-1 rounded-md bg-white/5 p-0.5">
      <button
        type="button"
        onClick={() => setKind("standard")}
        className={cn(
          "cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors",
          kind === "standard" ? "bg-accent-dim text-accent" : "text-fg-muted hover:text-fg",
        )}
      >
        {t("task.kind.standard")}
      </button>
      <button
        type="button"
        onClick={() => setKind("checklist")}
        className={cn(
          "cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors",
          kind === "checklist" ? "bg-accent-dim text-accent" : "text-fg-muted hover:text-fg",
        )}
      >
        {t("task.kind.checklist")}
      </button>
    </div>
  );

  const durationInputs = (
    <div
      ref={durationRef}
      onBlur={handleDurationBlur}
      className={cn(durationBadge, "border border-accent bg-white/6")}
    >
      <input
        ref={minRef}
        className="w-8 bg-transparent py-0.5 text-center text-sm tabular-nums text-fg outline-none"
        onFocus={(e) => e.target.select()}
        onChange={handleMinInput}
        onKeyDown={isNew ? handleMinKeyDown : undefined}
        value={min}
        type="number"
        min={0}
        max={60}
        aria-label={t("task.minutes")}
      />
      <span className="text-fg-muted">:</span>
      <input
        ref={secRef}
        className="w-8 bg-transparent py-0.5 text-center text-sm tabular-nums text-fg outline-none"
        onFocus={(e) => e.target.select()}
        onChange={handleSecInput}
        onKeyDown={isNew ? handleSecKeyDown : undefined}
        value={sec}
        type="number"
        min={0}
        max={59}
        aria-label={t("task.seconds")}
      />
    </div>
  );

  // --- Creation form ---
  if (isNew) {
    return (
      <div ref={containerRef} className="w-full" onBlur={handleContainerBlur}>
        <div className="flex w-full flex-col gap-2 rounded-md border border-accent bg-accent-dim px-2.5 py-2">
          <div className="flex w-full items-center gap-2">
            <input
              autoFocus
              className="min-w-0 flex-1 rounded border border-accent bg-white/6 px-2 py-1 text-sm font-medium text-fg outline-none placeholder:italic placeholder:text-fg-muted"
              placeholder={t("task.namePlaceholder")}
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              onKeyDown={handleTitleKeyDown}
              maxLength={40}
            />
            {durationInputs}
          </div>
          {kindToggle}
        </div>
        <p className="flex items-center gap-1 px-1.5 pt-1 text-xs text-fg-muted">
          <kbd>↵</kbd> {t("task.confirmHint")} · <kbd>⎋</kbd> {t("task.cancelHint")}
        </p>
      </div>
    );
  }

  const DetailsIcon = kind === "checklist" ? ListChecks : NotebookText;
  const hasDetails =
    kind === "checklist" ? checklist.length > 0 : !!task.description?.trim();

  // --- Normal plan card ---
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(isDragging && "opacity-0")}
    >
      <div
        className={cn(
          "group/task flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 transition-colors duration-150 ease-out",
          "bg-white/3 hover:bg-white/6",
        )}
      >
        <button
          {...listeners}
          aria-label={t("task.dragToReorder")}
          className="flex h-6 w-4 shrink-0 cursor-grab touch-none items-center justify-center text-fg-muted opacity-50 transition-opacity duration-150 hover:opacity-100 active:cursor-grabbing group-hover/task:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          {editTitle ? (
            <input
              autoFocus
              className="min-w-0 flex-1 rounded border border-accent bg-white/7 px-1.5 py-0.5 text-sm font-medium text-fg outline-none"
              onBlur={() => setEditTitle(false)}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              value={task.title}
              maxLength={40}
            />
          ) : (
            <span
              className="min-w-0 flex-1 cursor-text truncate rounded px-1.5 py-0.5 text-sm font-medium text-fg transition-colors duration-150 hover:bg-white/6"
              onClick={() => setEditTitle(true)}
            >
              {task.title || <span className="italic text-fg-muted">{t("task.unnamed")}</span>}
            </span>
          )}

          {kind === "checklist" && checklist.length > 0 && (
            <span className="shrink-0 text-xs tabular-nums text-fg-muted">
              {t("task.checklist.progress", { done: checklistDone, total: checklist.length })}
            </span>
          )}

          {editDuration ? (
            durationInputs
          ) : (
            <span
              className={cn(durationBadge, "cursor-pointer bg-white/5 text-fg transition-colors duration-150")}
            >
              <span
                onClick={() => {
                  setEditDuration(true);
                  setFocusField("min");
                }}
                className="px-1 py-0.5 transition-colors hover:bg-white/9"
              >
                {mm}
              </span>
              :
              <span
                onClick={() => {
                  setEditDuration(true);
                  setFocusField("sec");
                }}
                className="px-1 py-0.5 transition-colors hover:bg-white/9"
              >
                {ss}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={() => setDetailsOpen((o) => !o)}
          aria-label={t(`task.kind.${kind}`)}
          aria-expanded={detailsOpen}
          className={cn(
            "cursor-pointer flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-fg-muted transition-all duration-150 hover:bg-white/8 hover:text-fg active:scale-[0.88]",
            (detailsOpen || hasDetails) && "text-accent opacity-100",
            !detailsOpen && !hasDetails && "opacity-0 group-hover/task:opacity-100 focus-visible:opacity-100",
          )}
        >
          <DetailsIcon className="h-3.5 w-3.5" />
        </button>

        <button
          className="cursor-pointer group/close flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-fg-muted opacity-0 transition-all duration-150 hover:bg-danger/14 active:scale-[0.88] focus-visible:opacity-100 group-hover/task:opacity-100"
          onClick={() => deleteTask(task)}
          aria-label={task.title ? t("task.delete", { title: task.title }) : t("task.deleteDefault")}
        >
          <X className="h-3.5 w-3.5 transition-colors group-hover/close:text-danger" />
        </button>
      </div>

      {detailsOpen && (
        <div className="ml-4 mt-1 flex flex-col gap-2 rounded-md bg-white/3 p-2.5">
          {kindToggle}

          {kind === "standard" ? (
            <textarea
              value={task.description ?? ""}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder={t("task.descriptionPlaceholder")}
              rows={2}
              className="w-full resize-none rounded border border-transparent bg-white/6 px-2 py-1.5 text-sm text-fg outline-none placeholder:text-fg-muted focus:border-accent"
            />
          ) : (
            <div className="flex flex-col gap-1">
              {checklist.map((item) => (
                <div key={item.id} className="group/item flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="h-3.5 w-3.5 shrink-0 accent-accent"
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm",
                      item.done ? "text-fg-muted line-through" : "text-fg-soft",
                    )}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => removeChecklistItem(item.id)}
                    aria-label={t("task.deleteDefault")}
                    className="cursor-pointer flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-fg-muted opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-danger"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
                <input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                  onBlur={addChecklistItem}
                  placeholder={t("task.checklist.addPlaceholder")}
                  className="min-w-0 flex-1 bg-transparent py-0.5 text-sm text-fg outline-none placeholder:text-fg-muted"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
