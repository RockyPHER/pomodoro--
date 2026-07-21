import { ITask } from "../models/task";
import { formatTime } from "../scripts/timeFormat";

/** One task per line: "Title - MM:SS". */
export function serializeTasks(tasks: ITask[]): string {
  return tasks
    .map((t) => {
      const [mm, ss] = formatTime(t.duration);
      return `${t.title || "Unnamed"} - ${mm}:${ss}`;
    })
    .join("\n");
}

const LINE_RE = /^(.+?)\s*-\s*(\d{1,3}):([0-5]?\d)\s*$/;

export interface ParsedTask {
  title: string;
  duration: number;
}

export function parseTasks(text: string): ParsedTask[] {
  const parsed: ParsedTask[] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(LINE_RE);
    if (!match) continue;
    const [, title, mm, ss] = match;
    const duration = Number(mm) * 60 + Number(ss);
    if (duration <= 0) continue;
    parsed.push({ title: title.trim().slice(0, 40), duration });
  }
  return parsed;
}
