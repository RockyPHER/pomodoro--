import "./style.css";
import { useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";

interface Props {
  startTime: number;
  isPlay: boolean;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  onTaskConclude: () => void;
}

export default function Clock({
  startTime,
  isPlay,
  setIsPlay,
  onTaskConclude,
}: Props) {
  return (
    <div className="clock-container">
      <div className="clock-head-container">
        <Timer
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

function Timer({ startTime, isPlay, setIsPlay, onTaskConclude }: Props) {
  const [time, setTime] = useState(startTime);
  const [isConclude, setIsConclude] = useState(true);
  const formatedTime = formatTime(time);
  useEffect(() => {
    console.log("reload", time);
    if (time <= 0 && isConclude) {
      setTime(startTime);
      setIsConclude(false);
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
  }, [time, isPlay]);

  return (
    <div className="clock-time-container">
      <p className="clock-time text">
        {formatedTime[0] + ":" + formatedTime[1]}
      </p>
    </div>
  );
}
