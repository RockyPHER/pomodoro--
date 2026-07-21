import { SessionStatus } from "../../lib/sessionStatus";
import { cn } from "../../lib/cn";
import { useI18n } from "../../i18n/context";

interface SessionProgressProps {
  time: number;
  totalDuration: number;
  status: SessionStatus;
}

/** Thin, quiet linear progress under the timer. */
export default function SessionProgress({
  time,
  totalDuration,
  status,
}: SessionProgressProps) {
  const { t } = useI18n();
  const elapsed = totalDuration > 0 ? totalDuration - time : 0;
  const fraction = totalDuration > 0 ? elapsed / totalDuration : 0;

  return (
    <div
      role="progressbar"
      aria-label={t("progress.aria")}
      aria-valuemin={0}
      aria-valuemax={totalDuration}
      aria-valuenow={Math.round(elapsed)}
      className="h-1 w-full max-w-104 overflow-hidden rounded-full bg-white/7"
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width,background-color] duration-700 ease-out",
          status === "paused" ? "bg-pause" : "bg-accent",
        )}
        style={{ width: `${Math.min(100, Math.max(0, fraction * 100))}%` }}
      />
    </div>
  );
}
