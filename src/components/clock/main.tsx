import "./style.css";
import { useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";

interface Props {
  hasRunTasks: boolean;
  startTime: number;
  isPlay: boolean;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  onTaskConclude: () => void;
}

export default function Clock({
  hasRunTasks,
  startTime,
  isPlay,
  setIsPlay,
  onTaskConclude,
}: Props) {
  return (
    <div className="clock-container">
      <div className="clock-head-container">
        <Timer
          hasRunTasks={hasRunTasks}
          startTime={startTime}
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          onTaskConclude={onTaskConclude}
        />
      </div>
      <div className="clock-body-container"></div>
    </div>
  );
}

function Timer({
  hasRunTasks,
  startTime,
  isPlay,
  setIsPlay,
  onTaskConclude,
}: Props) {
  const [time, setTime] = useState(startTime);
  const [isConclude, setIsConclude] = useState(true);
  const formatedTime = formatTime(time);
  useEffect(() => {
    console.log("reload", time, isConclude);
    if (hasRunTasks) {
      if (time === 0 && isConclude) {
        console.log("task is conclude, reseting...");
        setTime(startTime);
        setIsConclude(false);
        return;
      }
      const timerID = setInterval(() => {
        if (!isPlay) {
          clearInterval(timerID);
          return;
        }
        if (time <= 0) {
          console.log("Timer conclude!");
          setIsConclude(true);
          setIsPlay(false);
          clearInterval(timerID);
          onTaskConclude();
          return;
        }
        setTime(time - 1);
        return;
      }, 1000);
      return () => clearInterval(timerID);
    }
  }, [time, isPlay]);

  return (
    <div className="clock-time-container">
      <p className="clock-time text">
        {formatedTime[0] + ":" + formatedTime[1]}
      </p>
    </div>
  );
}
