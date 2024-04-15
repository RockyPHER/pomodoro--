import "./style.css";
import React, { useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";

interface Props {
  hasRunTasks: boolean;
  startTime: number;
  isReset: boolean;
  isPlay: boolean;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  onTaskConclude: () => void;
}

export default function Clock({
  hasRunTasks,
  startTime,
  isReset,
  isPlay,
  setIsPlay,
  setIsReset,
  onTaskConclude,
}: Props) {
  return (
    <div className="clock-container">
      <div className="clock-head-container">
        <Timer
          hasRunTasks={hasRunTasks}
          startTime={startTime}
          isReset={isReset}
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          setIsReset={setIsReset}
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
  isReset,
  isPlay,
  setIsPlay,
  setIsReset,
  onTaskConclude,
}: Props) {
  const [time, setTime] = useState(startTime);
  const [isZero, setIsZero] = useState(true);
  const formatedTime = formatTime(time);
  useEffect(() => {
    console.log("reload", time, isZero);
    if (hasRunTasks) {
      if (time === 0 && isZero) {
        console.log("time is zero, reseting...");
        setTime(startTime);
        setIsZero(false);
        return;
      }
      // reset
      if (isReset && !isPlay) {
        setTime(startTime);
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
          setIsZero(true);
          setIsPlay(false);
          clearInterval(timerID);
          onTaskConclude();
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
