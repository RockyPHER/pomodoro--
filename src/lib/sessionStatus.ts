import { ITask } from "../models/task";

/**
 * A single explicit session state for the UI to derive its appearance
 * from. This is computed from the existing timer booleans rather than
 * replacing them — the timer's control flow is left untouched to avoid
 * regressions, while the visuals read from one reliable value.
 */
export type SessionStatus =
  | "idle" // no session loaded
  | "ready" // task loaded, full time, not started
  | "running" // counting down
  | "paused" // started, stopped, time remaining
  | "completed"; // current task reached 0

interface StatusInput {
  currentTask: ITask | undefined;
  hasRunTasks: boolean;
  isPlay: boolean;
  time: number;
  totalDuration: number;
}

export function getSessionStatus({
  currentTask,
  hasRunTasks,
  isPlay,
  time,
  totalDuration,
}: StatusInput): SessionStatus {
  if (!currentTask || !hasRunTasks) return "idle";
  if (isPlay) return "running";
  if (time <= 0 && totalDuration > 0) return "completed";
  if (time < totalDuration) return "paused";
  return "ready";
}

export const STATUS_LABEL: Record<SessionStatus, string> = {
  idle: "",
  ready: "Ready",
  running: "Focusing",
  paused: "Paused",
  completed: "Done",
};
