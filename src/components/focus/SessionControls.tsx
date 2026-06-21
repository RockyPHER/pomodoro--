import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { SessionStatus } from "../../lib/sessionStatus";

interface SessionControlsProps {
  status: SessionStatus;
  canLoad: boolean;
  start: () => void;
  pause: () => void;
  complete: () => void;
  reset: () => void;
  loadTasks: () => void;
}

// Primary = gradient — center play/pause button
const primary =
  "cursor-pointer flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-[#0c1020] " +
  "bg-gradient-to-b from-accent to-accent-soft shadow-[0_6px_24px_var(--accent-glow)] " +
  "transition-all duration-150 ease-out hover:scale-[1.04] hover:shadow-[0_8px_28px_var(--accent-glow)] active:scale-[0.96]";

// Shared side-button base — fixed width, same size both sides
const side =
  "cursor-pointer w-28 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium " +
  "translate-y-2 border transition-all duration-150 ease-out active:scale-[0.96]";

// Complete — glass border
const secondary =
  side +
  " text-fg-soft border-border bg-surface " +
  "hover:border-border-strong hover:bg-surface-hover hover:text-fg";

// Reset — matching outline style
const tertiary =
  side +
  " text-fg-muted border-border bg-surface/60 " +
  "hover:border-border-strong hover:bg-surface-hover hover:text-fg-soft";

export default function SessionControls({
  status,
  canLoad,
  start,
  pause,
  complete,
  reset,
  loadTasks,
}: SessionControlsProps) {
  if (status === "idle") {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          className={primary}
          onClick={loadTasks}
          disabled={!canLoad}
          style={!canLoad ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
        >
          <Play className="h-4 w-4" />
          Start focus
        </button>
        {!canLoad && (
          <p className="text-xs text-fg-muted">
            Set a duration to include a task in the session.
          </p>
        )}
      </div>
    );
  }

  const isRunning = status === "running";

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Complete — outlined, left */}
      <button className={secondary} onClick={complete}>
        <Check className="h-4 w-4" />
        Complete
      </button>

      {/* Play / Pause — gradient, center */}
      {isRunning ? (
        <button className={primary} onClick={pause}>
          <Pause className="h-4 w-4" />
          Pause
        </button>
      ) : (
        <button className={primary} onClick={start}>
          <Play className="h-4 w-4" />
          {status === "paused" ? "Resume" : "Start"}
        </button>
      )}

      {/* Reset — outlined, right */}
      <button className={tertiary} onClick={reset}>
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>
    </div>
  );
}
