import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "../../models/task";
import { formatTime } from "../../scripts/timeFormat";
import { cn } from "../../lib/cn";

interface QueueItemProps {
  task: ITask;
  isCurrent: boolean;
  onSelect: (task: ITask) => void;
}

export default function QueueItem({ task, isCurrent, onSelect }: QueueItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });
  const [mm, ss] = formatTime(task.duration);

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      {...attributes}
      {...listeners}
      onClick={() => !isCurrent && onSelect(task)}
      className={cn(
        "flex touch-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 ease-out",
        isDragging
          ? "opacity-0"
          : isCurrent
            ? "bg-accent-dim cursor-default"
            : "cursor-pointer hover:bg-white/[0.07] active:bg-white/[0.10]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-150",
          isCurrent ? "bg-accent" : "bg-fg-muted",
        )}
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          isCurrent ? "text-fg" : "text-fg-soft",
        )}
      >
        {task.title || "Untitled"}
      </span>
      <span className="shrink-0 tabular-nums text-fg-muted">
        {mm}:{ss}
      </span>
    </div>
  );
}
