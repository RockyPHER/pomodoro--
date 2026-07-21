import { ITask } from "../../models/task";
import { SessionStatus } from "../../lib/sessionStatus";
import { useI18n } from "../../i18n/context";

interface CurrentTaskProps {
  task: ITask | undefined;
  status: SessionStatus;
}

export default function CurrentTask({ task, status }: CurrentTaskProps) {
  const { t } = useI18n();
  if (!task) return null;
  const label = status === "idle" ? "" : t(`status.${status}`);
  const checklist = task.checklist ?? [];

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {label && (
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-fg-muted">
          {label}
        </span>
      )}
      <h1 className="max-w-md truncate text-3xl font-normal text-fg sm:text-4xl">
        {task.title || t("focus.untitledTask")}
      </h1>
      {task.kind === "checklist" && checklist.length > 0 ? (
        <ul className="mt-1 flex w-full max-w-[22rem] flex-col gap-1 text-left">
          {checklist.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 text-sm text-fg-soft"
            >
              <span
                className={
                  item.done
                    ? "h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                    : "h-1.5 w-1.5 shrink-0 rounded-full bg-fg-muted"
                }
              />
              <span className={item.done ? "truncate text-fg-muted line-through" : "truncate"}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        task.description && (
          <p className="max-w-[26rem] text-sm text-fg-soft">{task.description}</p>
        )
      )}
    </div>
  );
}
