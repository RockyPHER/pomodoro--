import "./style.css";
import { ListEndIcon, Pause, Play, SkipForward, Square } from "lucide-react";
import { useState } from "react";
import Pannel from "../pannel/main";
import { ITask } from "../../../models/task";

interface ClockButtonsProps {
  currentTask: ITask;
  nextTask: ITask;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  handleSkipTimer: () => void;
  handleLoadTasks: () => void;
}

export default function ClockButtons({
  currentTask,
  nextTask,
  handleStartTimer,
  handleStopTimer,
  handleSkipTimer,
  handleLoadTasks,
}: ClockButtonsProps) {
  const [isPlay, setIsPlay] = useState(false);
  const [hasTasks, setHasTasks] = useState(false);

  return (
    <div className="clock-buttons-container">
      <div className="clock-top-buttons-container">
        <button className="clock-button skip" onClick={() => handleSkipTimer()}>
          <SkipForward className="clock-button-icon" />
        </button>
        <button
          className={`clock-button-main ${isPlay ? "pause" : "play"}`}
          onClick={() => handleStartTimer()}
        >
          {isPlay ? (
            <Pause className="clock-button-main-icon" />
          ) : (
            <Play className="clock-button-main-icon" />
          )}
        </button>
        <button className="clock-button stop" onClick={() => handleStopTimer()}>
          <Square className="clock-button-icon" />
        </button>
      </div>
      {!hasTasks ? (
        <div className="clock-load-container">
          <button
            className="load-task-button"
            onClick={() => handleLoadTasks()}
          >
            <ListEndIcon className="load-task-icon" />
            <span className="load-task-text text">Load tasks</span>
          </button>
        </div>
      ) : (
        <Pannel currentTask={currentTask} nextTask={nextTask} />
      )}
    </div>
  );
}
