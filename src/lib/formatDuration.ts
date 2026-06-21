import { ITask } from "../models/task";

/** Human total like "1h 25m" / "25m" / "0m" from a list of tasks. */
export function formatTotal(tasks: ITask[]): string {
  const total = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const minutes = Math.round(total / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
