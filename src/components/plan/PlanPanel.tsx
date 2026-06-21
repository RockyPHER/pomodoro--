import { ChevronLeft, Plus } from "lucide-react";
import { ITask } from "../../models/task";
import Task from "../task/main";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "motion/react";
import { formatTotal } from "../../lib/formatDuration";
import IconButton from "../layout/IconButton";

interface PlanPanelProps {
  backTasks: ITask[];
  newTaskId: number | null;
  onCreate: () => void;
  onConfirmNew: () => void;
  updateTask: (task: ITask) => void;
  deleteTask: (task: ITask) => void;
  onCollapse: () => void;
}

export default function PlanPanel({
  backTasks,
  newTaskId,
  onCreate,
  onConfirmNew,
  updateTask,
  deleteTask,
  onCollapse,
}: PlanPanelProps) {
  return (
    <aside className="glass flex h-full w-full flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-fg">Plan</h2>
          <p className="text-xs text-fg-muted">
            {backTasks.length} {backTasks.length === 1 ? "task" : "tasks"}
            {backTasks.length > 0 && ` · ${formatTotal(backTasks)}`}
          </p>
        </div>
        <IconButton label="Collapse plan" onClick={onCollapse} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2.5">
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

        <button
          onClick={onCreate}
          className="cursor-pointer flex w-full shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-fg-muted transition-all duration-150 ease-out hover:border-border-strong hover:bg-white/[0.05] hover:text-fg active:scale-[0.98]"
        >
          <Plus className="h-[1.1em] w-[1.1em] shrink-0" />
          <span className="text-sm font-medium">Add task</span>
        </button>
      </div>
    </aside>
  );
}
