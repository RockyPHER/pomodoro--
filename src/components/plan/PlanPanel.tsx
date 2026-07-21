import { Check, ClipboardPaste, Copy, Plus } from "lucide-react";
import { useState } from "react";
import { ITask } from "../../models/task";
import Task from "../task/main";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "motion/react";
import { formatTotal } from "../../lib/formatDuration";
import IconButton from "../layout/IconButton";
import Button from "../layout/Button";
import { useI18n } from "../../i18n/context";

interface PlanPanelProps {
  backTasks: ITask[];
  newTaskId: number | null;
  onCreate: () => void;
  onConfirmNew: () => void;
  updateTask: (task: ITask) => void;
  deleteTask: (task: ITask) => void;
  onCopy: () => Promise<boolean>;
  onPaste: () => Promise<boolean>;
}

export default function PlanPanel({
  backTasks,
  newTaskId,
  onCreate,
  onConfirmNew,
  updateTask,
  deleteTask,
  onCopy,
  onPaste,
}: PlanPanelProps) {
  const { t, tc } = useI18n();
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await onCopy();
    if (!ok) return;
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1200);
  };

  return (
    <aside className="glass flex h-full w-full flex-col overflow-hidden rounded-lg border border-border">
      <header className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-fg">{t("plan.title")}</h2>
          <p className="text-xs text-fg-muted">
            {tc("plan.count", backTasks.length)}
            {backTasks.length > 0 && ` · ${formatTotal(backTasks)}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            label={justCopied ? t("plan.copied") : t("plan.copy")}
            onClick={handleCopy}
            className="h-8 w-8 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={backTasks.length === 0}
          >
            {justCopied ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </IconButton>
          <IconButton label={t("plan.paste")} onClick={onPaste} className="h-8 w-8">
            <ClipboardPaste className="h-4 w-4" />
          </IconButton>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-3">
        {backTasks.length > 0 && (
          <div className="flex flex-col gap-1.5 pr-0.5">
            <SortableContext
              items={backTasks}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence initial={false}>
                {backTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14 } }}
                    transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Task
                      data={task}
                      isNew={task.id === newTaskId}
                      onConfirm={onConfirmNew}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>
          </div>
        )}

        <Button variant="secondary" onClick={onCreate} className="w-full shrink-0 rounded-md py-2.5">
          <Plus className="h-[1.1em] w-[1.1em] shrink-0" />
          <span className="text-sm font-medium">{t("plan.addTask")}</span>
        </Button>
      </div>
    </aside>
  );
}
