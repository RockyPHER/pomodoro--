import { useState } from "react";
import { ITask } from "../models/task";

interface TimerControls {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isPlay: boolean;
  isReset: boolean;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  start: () => void;
  pause: () => void;
}

export function useTimerControls(currentTask: ITask | undefined): TimerControls {
  const [time, setTime] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const start = () => {
    if (currentTask) {
      setIsReset(false);
      setIsPlay(true);
    }
  };

  const pause = () => setIsPlay(false);

  return { time, setTime, isPlay, isReset, setIsPlay, setIsReset, start, pause };
}
