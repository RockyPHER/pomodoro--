import { useState } from "react";
import { Check, ChevronDown, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ITask } from "../../models/task";
import { cn } from "../../lib/cn";

interface CompletedPanelProps {
  completedTasks: ITask[];
  onClear: () => void;
}

export default function CompletedPanel({ completedTasks, onClear }: CompletedPanelProps) {
  const [open, setOpen] = useState(false);
  const count = completedTasks.length;

  return (
    <section className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => count > 0 && setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            "flex flex-1 items-center justify-between text-left transition-opacity duration-150",
            count > 0 ? "cursor-pointer" : "cursor-default",
          )}
        >
          <span className="text-sm font-semibold text-fg">Completed today</span>
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
            aria-label="Clear completed tasks"
            title="Clear completed"
            className="cursor-pointer ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent text-fg-muted transition-all duration-150 hover:border-danger/40 hover:bg-danger/[0.12] hover:text-danger active:scale-[0.88]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {count > 0 && !open && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {completedTasks.map((t) => (
            <span
              key={t.id}
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
            className="overflow-hidden border-t border-border"
          >
            {completedTasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 px-4 py-2 text-sm text-fg-soft"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span className="truncate">{t.title || "Untitled"}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
