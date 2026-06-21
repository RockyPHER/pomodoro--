import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { GripVertical, X } from "lucide-react";
import { ITask } from "../../models/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDurationInput } from "../../hooks/useDurationInput";
import { cn } from "../../lib/cn";

interface TaskProps {
  data: ITask;
  deleteTask: (delTask: ITask) => void;
  updateTask: (updatedTask: ITask) => void;
  isNew?: boolean;
  onConfirm?: () => void;
}

const durationBadge =
  "flex items-center shrink-0 text-sm leading-none tabular-nums rounded-md overflow-hidden";

export default function Task({
  data,
  deleteTask,
  updateTask,
  isNew = false,
  onConfirm,
}: TaskProps) {
  const [task, setTask] = useState<ITask>(data);
  const [editDuration, setEditDuration] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [focusField, setFocusField] = useState<"min" | "sec" | null>(null);

  const { min, sec, duration, handleMinInput, handleSecInput } =
    useDurationInput(data.duration);

  const [mm, ss] = formatTime(task.duration);
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

  const durationInputs = (
    <div
      ref={durationRef}
      onBlur={handleDurationBlur}
      className={cn(durationBadge, "border border-accent bg-white/[0.06]")}
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
        aria-label="Minutes"
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
        aria-label="Seconds"
      />
    </div>
  );

  // --- Creation form ---
  if (isNew) {
    return (
      <div ref={containerRef} className="w-full" onBlur={handleContainerBlur}>
        <div className="flex w-full items-center gap-2 rounded-lg border border-accent bg-accent-dim px-2.5 py-2">
          <input
            autoFocus
            className="min-w-0 flex-1 rounded border border-accent bg-white/[0.06] px-2 py-1 text-sm font-medium text-fg outline-none placeholder:italic placeholder:text-fg-muted"
            placeholder="Task name"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            onKeyDown={handleTitleKeyDown}
            maxLength={40}
          />
          {durationInputs}
        </div>
        <p className="flex items-center gap-1 px-1.5 pt-1 text-xs text-fg-muted">
          <kbd>↵</kbd> confirm · <kbd>⎋</kbd> cancel
        </p>
      </div>
    );
  }

  // --- Normal plan card ---
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group/task flex w-full items-center gap-1.5 rounded-lg border px-1.5 py-1.5 transition-colors duration-150 ease-out",
        isDragging
          ? "border-border bg-white/[0.03] opacity-0"
          : "border-border bg-white/[0.03] hover:border-border-strong hover:bg-white/[0.055]",
      )}
    >
      <button
        {...listeners}
        aria-label="Drag to reorder"
        className="flex h-6 w-4 shrink-0 cursor-grab touch-none items-center justify-center text-fg-muted opacity-50 transition-opacity duration-150 hover:opacity-100 active:cursor-grabbing group-hover/task:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        {editTitle ? (
          <input
            autoFocus
            className="min-w-0 flex-1 rounded border border-accent bg-white/[0.07] px-1.5 py-0.5 text-sm font-medium text-fg outline-none"
            onBlur={() => setEditTitle(false)}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            value={task.title}
            maxLength={40}
          />
        ) : (
          <span
            className="min-w-0 flex-1 cursor-text truncate rounded border border-transparent px-1.5 py-0.5 text-sm font-medium text-fg transition-colors duration-150 hover:bg-white/[0.06]"
            onClick={() => setEditTitle(true)}
          >
            {task.title || <span className="italic text-fg-muted">Unnamed</span>}
          </span>
        )}

        {editDuration ? (
          durationInputs
        ) : (
          <span
            className={cn(
              durationBadge,
              "cursor-pointer border border-border bg-white/[0.05] text-fg transition-colors duration-150 hover:border-border-strong",
            )}
          >
            <span
              onClick={() => {
                setEditDuration(true);
                setFocusField("min");
              }}
              className="px-1 py-0.5 transition-colors hover:bg-white/[0.09]"
            >
              {mm}
            </span>
            :
            <span
              onClick={() => {
                setEditDuration(true);
                setFocusField("sec");
              }}
              className="px-1 py-0.5 transition-colors hover:bg-white/[0.09]"
            >
              {ss}
            </span>
          </span>
        )}
      </div>

      <button
        className="cursor-pointer group/close flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-transparent text-fg-muted opacity-0 transition-all duration-150 hover:border-danger/40 hover:bg-danger/[0.14] active:scale-[0.88] focus-visible:opacity-100 group-hover/task:opacity-100"
        onClick={() => deleteTask(task)}
        aria-label={`Delete ${task.title || "task"}`}
      >
        <X className="h-3.5 w-3.5 transition-colors group-hover/close:text-danger" />
      </button>
    </div>
  );
}
