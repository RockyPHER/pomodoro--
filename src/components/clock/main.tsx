import "./style.css";
import React, { useEffect } from "react";
import { formatTime } from "../../scripts/timeFormat";

interface Props {
  hasRunTasks: boolean;
  stackIsDone: boolean;
  taskIsDone: boolean;
  isReset: boolean;
  isPlay: boolean;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskIsDone: React.Dispatch<React.SetStateAction<boolean>>;
  setStackIsDone: React.Dispatch<React.SetStateAction<boolean>>;
  onTaskConclude: () => void;
}

export default function Clock({
  hasRunTasks,
  stackIsDone,
  taskIsDone,
  isReset,
  isPlay,
  time,
  setTime,
  setIsPlay,
  setIsReset,
  setTaskIsDone,
  setStackIsDone,
  onTaskConclude,
}: Props) {
  return (
    <div className="clock-container">
      <div className="clock-head-container">
        <Timer
          hasRunTasks={hasRunTasks}
          stackIsDone={stackIsDone}
          taskIsDone={taskIsDone}
          isReset={isReset}
          isPlay={isPlay}
          time={time}
          setTime={setTime}
          setIsPlay={setIsPlay}
          setIsReset={setIsReset}
          setTaskIsDone={setTaskIsDone}
          setStackIsDone={setStackIsDone}
          onTaskConclude={onTaskConclude}
        />
      </div>
      <div className="clock-body-container"></div>
    </div>
  );
}

function Timer({
  hasRunTasks,
  isReset,
  isPlay,
  time,
  setTime,
  setIsPlay,
  setIsReset,
  onTaskConclude,
}: Props) {
  const formatedTime = formatTime(time);
  useEffect(() => {
    console.log("reload", time);
    if (hasRunTasks) {
      // reset
      if (isReset && !isPlay) {
        return;
      }
      const timerID = setInterval(() => {
        // pause
        if (!isPlay && !isReset) {
          clearInterval(timerID);
          return;
        }
        // conclude
        if (time <= 0) {
          console.log("Timer conclude!");
          setIsPlay(false);
          setIsReset(true);
          onTaskConclude();
          clearInterval(timerID);
          return;
        }
        // resume
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(timerID);
    }
  }, [time, isPlay, isReset]);

  return (
    <div className="clock-time-container">
      <p className="clock-time text">
        {formatedTime[0] + ":" + formatedTime[1]}
      </p>
    </div>
  );
}
