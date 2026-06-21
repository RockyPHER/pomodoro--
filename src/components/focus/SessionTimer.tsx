import { useEffect, useRef, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { SessionStatus } from "../../lib/sessionStatus";
import SessionProgress from "./SessionProgress";

interface SessionTimerProps {
  time: number;
  totalDuration: number;
  isPlay: boolean;
  isReset: boolean;
  hasRunTasks: boolean;
  status: SessionStatus;
  currentTitle: string | undefined;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  onTaskConclude: () => void;
}

export default function SessionTimer({
  time,
  totalDuration,
  isPlay,
  isReset,
  hasRunTasks,
  status,
  currentTitle,
  setTime,
  setIsPlay,
  setIsReset,
  onTaskConclude,
}: SessionTimerProps) {
  const [mm, ss] = formatTime(time);
  const [announcement, setAnnouncement] = useState("");

  // --- Countdown (preserved verbatim from the original Clock) ---
  useEffect(() => {
    if (!hasRunTasks || (isReset && !isPlay)) return;

    const id = setInterval(() => {
      if (!isPlay && !isReset) {
        clearInterval(id);
        return;
      }
      if (time <= 0) {
        setIsPlay(false);
        setIsReset(true);
        onTaskConclude();
        clearInterval(id);
        return;
      }
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(id);
    // Interval is intentionally re-created each tick; setters are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, isPlay, isReset]);

  // --- Screen-reader announcements: milestones only, never per-second ---
  const announced = useRef<string | null>(null);
  useEffect(() => {
    let msg = "";
    if (status === "running" && time === 60) msg = "One minute remaining";
    else if (status === "running") msg = `Focusing on ${currentTitle ?? "task"}`;
    else if (status === "paused") msg = "Paused";
    else if (status === "completed") msg = "Task complete";

    const key = `${status}:${msg}`;
    if (msg && announced.current !== key) {
      announced.current = key;
      setAnnouncement(msg);
    }
  }, [status, time, currentTitle]);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <p className="select-none text-center font-light leading-none tracking-[-0.04em] text-fg [font-size:clamp(3.75rem,13vw,8.5rem)]">
        {mm + ":" + ss}
      </p>

      <SessionProgress
        time={time}
        totalDuration={totalDuration}
        status={status}
      />

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
