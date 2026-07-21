import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";
import { ITask } from "../../models/task";
import { formatTotal } from "../../lib/formatDuration";
import Button from "../layout/Button";
import QueueItem from "./QueueItem";
import { useI18n } from "../../i18n/context";

interface QueuePanelProps {
  runTasks: ITask[];
  currentTask: ITask | undefined;
  clearTasks: () => void;
  onSelectTask: (task: ITask) => void;
}

export default function QueuePanel({
  runTasks,
  currentTask,
  clearTasks,
  onSelectTask,
}: QueuePanelProps) {
  const { t, tc } = useI18n();
  const { setNodeRef } = useDroppable({ id: "run-container" });

  return (
    <section className="glass flex w-full flex-col overflow-hidden rounded-lg border border-border">
      <header className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-fg">{t("queue.title")}</h2>
          <p className="text-xs text-fg-muted">
            {tc("queue.count", runTasks.length)}
            {runTasks.length > 0 && ` · ${formatTotal(runTasks)}`}
          </p>
        </div>
      </header>

      <div
        ref={setNodeRef}
        className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto overflow-x-hidden p-3"
      >
        <AnimatePresence mode="wait" initial={false}>
          {runTasks.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="flex flex-col gap-2"
            >
              <div role="list" className="flex flex-col gap-1">
                <SortableContext
                  items={runTasks}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence initial={false}>
                    {runTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        role="listitem"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.26,
                            ease: [0.22, 1, 0.36, 1],
                            delay: Math.min(i * 0.05, 0.2),
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: -6,
                          scale: 0.95,
                          transition: { duration: 0.18, ease: "easeIn" },
                        }}
                      >
                        <QueueItem
                          task={task}
                          isCurrent={task.id === currentTask?.id}
                          onSelect={onSelectTask}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </div>
              <Button
                variant="secondary"
                onClick={clearTasks}
                className="mt-1 w-full shrink-0 rounded-md py-2 text-xs uppercase tracking-[0.14em]"
              >
                {t("queue.clear")}
              </Button>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="px-1 py-3 text-center text-xs text-fg-muted"
            >
              {t("queue.empty")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
