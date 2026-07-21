import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { SessionStatus } from "../../lib/sessionStatus";
import Button from "../layout/Button";
import { useI18n } from "../../i18n/context";

interface SessionControlsProps {
  status: SessionStatus;
  canLoad: boolean;
  start: () => void;
  pause: () => void;
  complete: () => void;
  reset: () => void;
  loadTasks: () => void;
}

// Side buttons sit a touch lower so the primary play/pause button in the
// middle visually pops up above them.
const sideButton = "w-28 rounded-full py-2 text-xs translate-y-2";

export default function SessionControls({
  status,
  canLoad,
  start,
  pause,
  complete,
  reset,
  loadTasks,
}: SessionControlsProps) {
  const { t } = useI18n();

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button onClick={loadTasks} disabled={!canLoad} className="rounded-full px-7 py-3.5">
          <Play className="h-4 w-4" />
          {t("controls.startFocus")}
        </Button>
        {!canLoad && (
          <p className="text-xs text-fg-muted">{t("controls.setDuration")}</p>
        )}
      </div>
    );
  }

  const isRunning = status === "running";

  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant="secondary" onClick={complete} className={sideButton}>
        <Check className="h-4 w-4" />
        {t("controls.complete")}
      </Button>

      {isRunning ? (
        <Button onClick={pause} className="rounded-full px-7 py-3.5">
          <Pause className="h-4 w-4" />
          {t("controls.pause")}
        </Button>
      ) : (
        <Button onClick={start} className="rounded-full px-7 py-3.5">
          <Play className="h-4 w-4" />
          {status === "paused" ? t("controls.resume") : t("controls.start")}
        </Button>
      )}

      <Button variant="secondary" onClick={reset} className={sideButton}>
        <RotateCcw className="h-4 w-4" />
        {t("controls.reset")}
      </Button>
    </div>
  );
}
