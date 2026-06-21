import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { ITask } from "../models/task";

interface TaskManagerReturn {
  backTasks: ITask[];
  setBackTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  runTasks: ITask[];
  currentTask: ITask | undefined;
  completedTasks: ITask[];
  hasRunTasks: boolean;
  createTask: () => number;
  deleteTask: (task: ITask) => void;
  updateTask: (task: ITask) => void;
  loadTasks: () => ITask | undefined;
  advance: (markCompleted?: boolean) => ITask | undefined;
  selectTask: (taskId: number) => ITask | undefined;
  clearTasks: () => void;
  clearCompleted: () => void;
  reorderBack: (activeId: number, overId: number) => void;
  reorderRun: (activeId: number, overId: number) => void;
  moveToRun: (taskId: number, overTaskId?: number) => void;
}

export function useTaskManager(): TaskManagerReturn {
  const [backTasks, setBackTasks] = useState<ITask[]>([]);
  const [runTasks, setRunTasks] = useState<ITask[]>([]);
  const [currentTask, setCurrentTask] = useState<ITask>();
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasRunTasks, setHasRunTasks] = useState(false);

  const createTask = (): number => {
    const id = Math.floor(Math.random() * Date.now());
    setBackTasks((prev) => [
      ...prev,
      { id, title: "", duration: 0, description: "" },
    ]);
    return id;
  };

  const deleteTask = (delTask: ITask) => {
    setBackTasks((prev) => prev.filter((t) => t.id !== delTask.id));
  };

  const updateTask = (updatedTask: ITask) => {
    setBackTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
  };

  const loadTasks = (): ITask | undefined => {
    const validTasks = backTasks.filter((t) => t.duration > 0);
    if (validTasks.length === 0) return undefined;
    const first = validTasks[0];
    setHasRunTasks(true);
    setCurrentIdx(0);
    setCurrentTask(first);
    setRunTasks(validTasks);
    setBackTasks([]);
    return first;
  };

  const advance = (markCompleted = false): ITask | undefined => {
    // Work out the next task before mutating state.
    const nextIdx = currentIdx + 1;
    const next = nextIdx < runTasks.length ? runTasks[nextIdx] : undefined;

    if (markCompleted && currentTask) {
      const finished = currentTask;
      setCompletedTasks((prev) =>
        prev.some((t) => t.id === finished.id) ? prev : [...prev, finished],
      );
      // Remove only the completed task — the rest of Up Next stays visible.
      setRunTasks((prev) => prev.filter((t) => t.id !== finished.id));
    }

    if (next) {
      // When the current task was removed (markCompleted), the next task
      // shifted down by one — its new index equals the old currentIdx.
      setCurrentIdx(markCompleted ? currentIdx : nextIdx);
      setCurrentTask(next);
      return next;
    }

    // Queue exhausted: clear session state but leave runTasks alone
    // so the (now empty or remaining) list stays visible in the panel.
    setCurrentTask(undefined);
    setCurrentIdx(0);
    setHasRunTasks(false);
    return undefined;
  };

  const selectTask = (taskId: number): ITask | undefined => {
    const idx = runTasks.findIndex((t) => t.id === taskId);
    if (idx < 0) return undefined;
    const task = runTasks[idx];
    setCurrentIdx(idx);
    setCurrentTask(task);
    return task;
  };

  const clearCompleted = () => setCompletedTasks([]);

  const clearTasks = () => {
    setHasRunTasks(false);
    setCurrentIdx(0);
    setCurrentTask(undefined);
    setRunTasks([]);
  };

  const reorderBack = (activeId: number, overId: number) => {
    setBackTasks((prev) => {
      const from = prev.findIndex((t) => t.id === activeId);
      const to = prev.findIndex((t) => t.id === overId);
      if (from < 0 || to < 0) return prev;
      return arrayMove(prev, from, to);
    });
  };

  const reorderRun = (activeId: number, overId: number) => {
    const from = runTasks.findIndex((t) => t.id === activeId);
    const to = runTasks.findIndex((t) => t.id === overId);
    if (from < 0 || to < 0) return;
    const next = arrayMove(runTasks, from, to);
    setRunTasks(next);
    if (currentTask) {
      const newIdx = next.findIndex((t) => t.id === currentTask.id);
      if (newIdx >= 0) setCurrentIdx(newIdx);
    }
  };

  const moveToRun = (taskId: number, overTaskId?: number) => {
    const task = backTasks.find((t) => t.id === taskId);
    if (!task) return;
    setBackTasks((prev) => prev.filter((t) => t.id !== taskId));
    setRunTasks((prev) => {
      if (overTaskId !== undefined) {
        const idx = prev.findIndex((t) => t.id === overTaskId);
        if (idx >= 0) {
          const next = [...prev];
          next.splice(idx, 0, task);
          return next;
        }
      }
      return [...prev, task];
    });
  };

  return {
    backTasks,
    setBackTasks,
    runTasks,
    currentTask,
    completedTasks,
    hasRunTasks,
    createTask,
    deleteTask,
    updateTask,
    loadTasks,
    advance,
    selectTask,
    clearTasks,
    clearCompleted,
    reorderBack,
    reorderRun,
    moveToRun,
  };
}
