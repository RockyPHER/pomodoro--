import { ITask } from "../../models/task";
import { formatTime } from "../../scripts/timeFormat";

export default function NextTaskPreview({ next }: { next: ITask | undefined }) {
  if (!next) {
    return <p className="text-xs text-fg-muted">No task queued</p>;
  }
  const [mm, ss] = formatTime(next.duration);
  return (
    <p className="text-xs text-fg-muted">
      <span className="text-fg-soft">Next:</span> {next.title || "Untitled"} ·{" "}
      {mm}:{ss}
    </p>
  );
}
