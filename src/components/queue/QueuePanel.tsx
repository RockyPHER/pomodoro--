import { ChevronRight } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";
import { ITask } from "../../models/task";
import { formatTotal } from "../../lib/formatDuration";
import IconButton from "../layout/IconButton";
import QueueItem from "./QueueItem";

interface QueuePanelProps {
  runTasks: ITask[];
  currentTask: ITask | undefined;
  clearTasks: () => void;
  onCollapse: () => void;
  onSelectTask: (task: ITask) => void;
}

export default function QueuePanel({
  runTasks,
  currentTask,
  clearTasks,
  onCollapse,
  onSelectTask,
}: QueuePanelProps) {
  const { setNodeRef } = useDroppable({ id: "run-container" });

  return (
    <section className="glass flex flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-fg">Up next</h2>
          <p className="text-xs text-fg-muted">
            {runTasks.length} {runTasks.length === 1 ? "task" : "tasks"}
            {runTasks.length > 0 && ` · ${formatTotal(runTasks)}`}
          </p>
        </div>
        <IconButton label="Collapse queue" onClick={onCollapse} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </header>

      <div
        ref={setNodeRef}
        className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto overflow-x-hidden p-2.5"
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
              <button
                onClick={clearTasks}
                className="cursor-pointer mt-1 shrink-0 rounded-lg border border-border py-2 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted transition-all duration-150 ease-out hover:border-border-strong hover:bg-white/5 hover:text-fg active:scale-[0.97]"
              >
                Clear queue
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="px-1 py-3 text-center text-xs text-fg-muted"
            >
              Drag tasks here, or start a session to fill the queue.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
