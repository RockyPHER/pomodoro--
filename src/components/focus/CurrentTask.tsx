import { ITask } from "../../models/task";
import { SessionStatus, STATUS_LABEL } from "../../lib/sessionStatus";

interface CurrentTaskProps {
  task: ITask | undefined;
  status: SessionStatus;
}

export default function CurrentTask({ task, status }: CurrentTaskProps) {
  if (!task) return null;
  const label = STATUS_LABEL[status];

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {label && (
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-fg-muted">
          {label}
        </span>
      )}
      <h1 className="max-w-[28rem] truncate text-2xl font-normal text-fg">
        {task.title || "Untitled task"}
      </h1>
      {task.description && (
        <p className="max-w-[26rem] text-sm text-fg-soft">{task.description}</p>
      )}
    </div>
  );
}
