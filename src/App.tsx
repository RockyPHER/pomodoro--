import "./styles/globals.css";
import { useCallback, useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { formatTime } from "./scripts/timeFormat";
import { useTaskManager } from "./hooks/useTaskManager";
import { useTimerControls } from "./hooks/useTimerControls";
import { getSessionStatus } from "./lib/sessionStatus";
import { cn } from "./lib/cn";
import { parseTasks, serializeTasks } from "./lib/taskClipboard";
import { PresetTaskDraft } from "./models/planPreset";
import { useI18n } from "./i18n/context";

import AmbientBackground from "./components/layout/AmbientBackground";
import Topbar from "./components/layout/Topbar";
import ShortcutsDialog from "./components/layout/ShortcutsDialog";
import PanelEdgeHandle from "./components/layout/PanelEdgeHandle";
import PlanPanel from "./components/plan/PlanPanel";
import QueuePanel from "./components/queue/QueuePanel";
import CompletedPanel from "./components/completed/CompletedPanel";
import FocusStage from "./components/focus/FocusStage";
import SpotifyMiniPlayer from "./components/spotify/SpotifyMiniPlayer";
import SpotifyModal from "./components/spotify/SpotifyModal";

const isWide = () =>
  typeof window !== "undefined" && window.innerWidth >= 1024;

export default function App() {
  const { t } = useI18n();
  const tasks = useTaskManager();
  const timer = useTimerControls(tasks.currentTask);

  const [planOpen, setPlanOpen] = useState(isWide);
  const [queueOpen, setQueueOpen] = useState(isWide);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [newTaskId, setNewTaskId] = useState<number | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<number | null>(null);

  const totalDuration = tasks.currentTask?.duration ?? 0;
  const status = getSessionStatus({
    currentTask: tasks.currentTask,
    hasRunTasks: tasks.hasRunTasks,
    isPlay: timer.isPlay,
    time: timer.time,
    totalDuration,
  });
  const canLoad = tasks.backTasks.some((t) => t.duration > 0);
  const currentRunIdx = tasks.runTasks.findIndex(
    (t) => t.id === tasks.currentTask?.id,
  );
  const nextTask =
    currentRunIdx >= 0 ? tasks.runTasks[currentRunIdx + 1] : undefined;
  const hasAnyTasks =
    tasks.backTasks.length > 0 ||
    tasks.runTasks.length > 0 ||
    tasks.completedTasks.length > 0;

  // --- session actions ---
  const loadTasks = useCallback(() => {
    if (tasks.runTasks.length === 0 && !timer.isPlay) {
      const first = tasks.loadTasks();
      if (first) timer.setTime(first.duration);
    }
  }, [tasks, timer]);

  const concludeTask = useCallback(
    (markCompleted: boolean) => {
      const next = tasks.advance(markCompleted);
      timer.setTime(next ? next.duration : 0);
      timer.setIsReset(true);
      timer.setIsPlay(false);
    },
    [tasks, timer],
  );

  const complete = useCallback(() => concludeTask(true), [concludeTask]);

  const handleSelectTask = useCallback(
    (task: import("./models/task").ITask) => {
      const selected = tasks.selectTask(task.id);
      if (selected) {
        timer.setTime(selected.duration);
        timer.setIsReset(true);
        timer.setIsPlay(false);
      }
    },
    [tasks, timer],
  );

  const reset = useCallback(() => {
    if (tasks.currentTask) {
      timer.setTime(tasks.currentTask.duration);
      timer.setIsReset(true);
      timer.setIsPlay(false);
    }
  }, [tasks.currentTask, timer]);

  // --- task creation lifted to coordinate the plan panel ---
  const handleCreateTask = useCallback(() => {
    const id = tasks.createTask();
    setNewTaskId(id);
    setPlanOpen(true);
  }, [tasks]);

  const handleConfirmNew = useCallback(() => setNewTaskId(null), []);

  const handleDelete = useCallback(
    (task: typeof tasks.backTasks[number]) => {
      if (task.id === newTaskId) setNewTaskId(null);
      tasks.deleteTask(task);
    },
    [tasks, newTaskId],
  );

  // --- plan clipboard ---
  const handleCopyPlan = useCallback(async () => {
    if (tasks.backTasks.length === 0) return false;
    try {
      await navigator.clipboard.writeText(serializeTasks(tasks.backTasks));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [tasks.backTasks]);

  const handlePastePlan = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseTasks(text);
      if (parsed.length === 0) return false;
      tasks.setBackTasks((prev) => [
        ...prev,
        ...parsed.map((p, i) => ({
          id: Math.floor(Math.random() * Date.now()) + i,
          title: p.title,
          duration: p.duration,
          description: "",
        })),
      ]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [tasks]);

  const handleApplyPreset = useCallback(
    (draftTasks: PresetTaskDraft[]) => {
      tasks.setBackTasks(
        draftTasks.map((d, i) => ({
          id: Math.floor(Math.random() * Date.now()) + i,
          title: d.title,
          duration: d.duration,
          description: "",
        })),
      );
      setPlanOpen(true);
    },
    [tasks],
  );

  // --- DnD ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 80, tolerance: 5 },
    }),
  );

  const inBack = (id: UniqueIdentifier) =>
    tasks.backTasks.some((t) => t.id === id);
  const inRun = (id: UniqueIdentifier) =>
    tasks.runTasks.some((t) => t.id === id);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeInBack = inBack(active.id);
    const activeInRun = inRun(active.id);

    if (activeInBack && inBack(over.id)) {
      tasks.reorderBack(active.id as number, over.id as number);
      return;
    }
    if (activeInRun && inRun(over.id)) {
      tasks.reorderRun(active.id as number, over.id as number);
      return;
    }
    if (activeInBack && (inRun(over.id) || over.id === "run-container")) {
      tasks.moveToRun(
        active.id as number,
        inRun(over.id) ? (over.id as number) : undefined,
      );
    }
  };

  // --- global keyboard shortcuts ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (typing) return;

      switch (e.key) {
        case " ":
          if (tasks.currentTask) {
            e.preventDefault();
            timer.isPlay ? timer.pause() : timer.start();
          }
          break;
        case "Enter":
          if (tasks.currentTask) {
            e.preventDefault();
            complete();
          }
          break;

        case "n":
        case "N":
          e.preventDefault();
          handleCreateTask();
          break;
        case "t":
        case "T":
          setPlanOpen((o) => !o);
          break;
        case "q":
        case "Q":
          setQueueOpen((o) => !o);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tasks.currentTask, timer, complete, handleCreateTask]);

  const running = status === "running";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <AmbientBackground />
      <div className="flex h-[100dvh] flex-col">
        <Topbar
          spotifyOpen={spotifyOpen}
          onToggleSpotify={() => setSpotifyOpen((o) => !o)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          onApplyPreset={handleApplyPreset}
        />

        <main className="relative mx-auto flex w-full max-w-[1600px] flex-1 overflow-hidden lg:px-8">
          {/* Backdrop for mobile drawers */}
          {(planOpen || queueOpen) && (
            <div
              className="absolute inset-0 z-20 bg-black/40 lg:hidden"
              onClick={() => {
                setPlanOpen(false);
                setQueueOpen(false);
              }}
            />
          )}

          {/* Plan (left) — the outer anchor is a plain, non-clipping `relative
              overflow-visible` box whose intrinsic width tracks the
              collapsing box below it (desktop only; that box is
              `position:fixed` on mobile and contributes no size, which is
              fine since the handle pins to the screen edge there instead).
              It's also a flex container so its height (stretched to fill
              `main`'s row) propagates down into the collapsing box — a
              plain block child wouldn't inherit that stretch, which is
              what previously left the panel's height sized to its content
              instead of the full column. The edge handle is a sibling of
              the collapsing/overflow-hidden box, so it never gets clipped
              as the panel animates to 0 width. */}
          <div className="relative flex shrink-0 overflow-visible">
            <div
              className={cn(
                "z-30 shrink-0 overflow-hidden transition-all duration-300 ease-out",
                "fixed bottom-0 left-0 top-14 w-[86%] max-w-[340px] p-3",
                "lg:static lg:inset-auto lg:translate-x-0 lg:overflow-hidden",
                running &&
                  "lg:opacity-50 lg:hover:opacity-100 lg:focus-within:opacity-100",
                planOpen
                  ? "translate-x-0 lg:w-[340px] lg:p-4 lg:pr-2 lg:opacity-100"
                  : "-translate-x-[110%] lg:w-0 lg:p-0 lg:opacity-0",
              )}
            >
              {/* w-full (not a hardcoded px value) here on purpose: it must
                  resolve against the collapsing box's *content* width, i.e.
                  its border-box width minus its own padding — a fixed
                  340px (the collapsing box's open outer width, padding
                  included) would overflow that content box by the padding
                  amount and get clipped by its `overflow-hidden`, cutting
                  off the panel's edge. Desktop still gets a fixed px value
                  (open width minus padding) so the card doesn't reflow
                  during the width-collapse transition; mobile is safe with
                  w-full since it only translates, never resizes. */}
              <div className="h-full w-full shrink-0 lg:w-[316px]">
                <PlanPanel
                  backTasks={tasks.backTasks}
                  newTaskId={newTaskId}
                  onCreate={handleCreateTask}
                  onConfirmNew={handleConfirmNew}
                  updateTask={tasks.updateTask}
                  deleteTask={handleDelete}
                  onCopy={handleCopyPlan}
                  onPaste={handlePastePlan}
                />
              </div>
            </div>
            <PanelEdgeHandle
              side="left"
              open={planOpen}
              onToggle={() => setPlanOpen((o) => !o)}
              label={planOpen ? t("plan.collapse") : t("plan.expand")}
            />
          </div>

          {/* Focus (center) */}
          <FocusStage
            status={status}
            currentTask={tasks.currentTask}
            nextTask={nextTask}
            hasAnyTasks={hasAnyTasks}
            canLoad={canLoad}
            time={timer.time}
            totalDuration={totalDuration}
            isPlay={timer.isPlay}
            isReset={timer.isReset}
            hasRunTasks={tasks.hasRunTasks}
            setTime={timer.setTime}
            setIsPlay={timer.setIsPlay}
            setIsReset={timer.setIsReset}
            onTaskConclude={complete}
            start={timer.start}
            pause={timer.pause}
            complete={complete}
            reset={reset}
            loadTasks={loadTasks}
            onAddFirstTask={handleCreateTask}
          />

          {/* Queue + Completed + Spotify (right) — same wrapper so every
              card in this column shares one horizontal width, with the
              Spotify mini player pinned to the bottom. Mirrors the Plan
              column's anchor/handle structure on the opposite edge. */}
          <div className="relative flex shrink-0 overflow-visible">
            <div
              className={cn(
                "z-30 shrink-0 overflow-hidden transition-all duration-300 ease-out",
                "fixed bottom-0 right-0 top-14 w-[86%] max-w-[340px] p-3",
                "lg:static lg:inset-auto lg:translate-x-0 lg:overflow-hidden",
                running &&
                  "lg:opacity-50 lg:hover:opacity-100 lg:focus-within:opacity-100",
                queueOpen
                  ? "translate-x-0 lg:w-[320px] lg:p-4 lg:pl-2 lg:opacity-100"
                  : "translate-x-[110%] lg:w-0 lg:p-0 lg:opacity-0",
              )}
            >
              {/* w-full for the same reason as the Plan column: it must
                  resolve against the collapsing box's content width, not
                  its padding-included outer width. */}
              <div className="flex h-full w-full shrink-0 flex-col gap-3 lg:w-[296px]">
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                  <QueuePanel
                    runTasks={tasks.runTasks}
                    currentTask={tasks.currentTask}
                    clearTasks={tasks.clearTasks}
                    onSelectTask={handleSelectTask}
                  />
                  <CompletedPanel completedTasks={tasks.completedTasks} onClear={tasks.clearCompleted} />
                </div>

                <SpotifyMiniPlayer
                  isOpen={spotifyOpen}
                  onToggle={() => setSpotifyOpen((o) => !o)}
                />
              </div>
            </div>
            <PanelEdgeHandle
              side="right"
              open={queueOpen}
              onToggle={() => setQueueOpen((o) => !o)}
              label={queueOpen ? t("queue.collapse") : t("queue.expand")}
            />
          </div>
        </main>
      </div>

      <ShortcutsDialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <SpotifyModal
        isOpen={spotifyOpen}
        onClose={() => setSpotifyOpen(false)}
      />

      {/* DragOverlay renders in a portal at the root — never clipped by overflow containers */}
      <DragOverlay dropAnimation={{ duration: 160, easing: "ease" }}>
        {(() => {
          if (!activeDragId) return null;
          const backTask = tasks.backTasks.find((t) => t.id === activeDragId);
          if (backTask) {
            const [mm, ss] = formatTime(backTask.duration);
            return (
              // Mirror Task's exact flex structure so positions stay identical
              <div className="flex w-full cursor-grabbing items-center gap-1.5 rounded-lg border border-accent bg-surface-hover px-1.5 py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                <span className="flex h-6 w-4 shrink-0 items-center justify-center text-fg-muted">
                  <GripVertical className="h-4 w-4" />
                </span>
                {/* Same inner wrapper as Task: title + duration with justify-between */}
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate px-1.5 py-0.5 text-sm font-medium text-fg">
                    {backTask.title || <span className="italic text-fg-muted">{t("task.unnamed")}</span>}
                  </span>
                  <span className="flex shrink-0 items-center rounded-md border border-border bg-white/5 text-sm tabular-nums text-fg">
                    <span className="px-1 py-0.5">{mm}</span>
                    :
                    <span className="px-1 py-0.5">{ss}</span>
                  </span>
                </div>
                {/* Placeholder matching the delete button (h-6 w-6) so layout is identical */}
                <span className="h-6 w-6 shrink-0" />
              </div>
            );
          }
          const runTask = tasks.runTasks.find((t) => t.id === activeDragId);
          if (runTask) {
            const [mm, ss] = formatTime(runTask.duration);
            return (
              <li className="flex cursor-grabbing items-center gap-2.5 rounded-lg bg-surface-hover px-2.5 py-2 text-sm shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fg-muted" />
                <span className="min-w-0 flex-1 truncate text-fg-soft">
                  {runTask.title || t("queue.untitled")}
                </span>
                <span className="shrink-0 tabular-nums text-fg-muted">
                  {mm}:{ss}
                </span>
              </li>
            );
          }
          return null;
        })()}
      </DragOverlay>
    </DndContext>
  );
}
