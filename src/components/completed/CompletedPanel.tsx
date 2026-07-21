import { useState } from "react";
import { Check, ChevronDown, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ITask } from "../../models/task";
import { cn } from "../../lib/cn";
import { useI18n } from "../../i18n/context";

interface CompletedPanelProps {
  completedTasks: ITask[];
  onClear: () => void;
}

export default function CompletedPanel({ completedTasks, onClear }: CompletedPanelProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const count = completedTasks.length;

  return (
    <section className="glass w-full overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => count > 0 && setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            "flex flex-1 items-center justify-between text-left transition-opacity duration-150",
            count > 0 ? "cursor-pointer" : "cursor-default",
          )}
        >
          <span className="text-sm font-semibold text-fg">{t("completed.title")}</span>
          <span className="flex items-center gap-2">
            <span className="text-sm tabular-nums text-fg-soft">{count}</span>
            {count > 0 && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-fg-muted transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            )}
          </span>
        </button>
        {count > 0 && (
          <button
            onClick={onClear}
            aria-label={t("completed.clearAria")}
            title={t("completed.clear")}
            className="cursor-pointer ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent text-fg-muted transition-all duration-150 hover:border-danger/40 hover:bg-danger/[0.12] hover:text-danger active:scale-[0.88]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {count > 0 && !open && (
        <div className="flex flex-wrap gap-1.5 px-5 pb-4">
          {completedTasks.map((task) => (
            <span
              key={task.id}
              className="h-1.5 w-1.5 rounded-full bg-success"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      <AnimatePresence initial={false}>
        {open && count > 0 && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden pt-1"
          >
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-2 px-5 py-2 text-sm text-fg-soft"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span className="truncate">{task.title || t("completed.untitled")}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
