import "./style.css";
import { ListEndIcon, Pause, Play, SkipForward, Square } from "lucide-react";
import { ITask } from "../../../models/task";

interface ClockButtonsProps {
  currentTask: ITask;
  isRunning: boolean;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  handleSkipTimer: () => void;
  handleLoadTasks: () => void;
}

export default function ClockButtons({
  isRunning,
  currentTask,
  handleStartTimer,
  handleStopTimer,
  handleSkipTimer,
  handleLoadTasks,
}: ClockButtonsProps) {
  return (
    <div className="clock-buttons-container">
      <div className="clock-top-buttons-container">
        <button className="clock-button skip" onClick={() => handleSkipTimer()}>
          <SkipForward className="clock-button-icon" />
        </button>
        <button
          className={`clock-button-main ${isRunning ? "pause" : "play"}`}
          onClick={() => handleStartTimer()}
        >
          {isRunning ? (
            <Pause className="clock-button-main-icon" />
          ) : (
            <Play className="clock-button-main-icon" />
          )}
        </button>
        <button className="clock-button stop" onClick={() => handleStopTimer()}>
          <Square className="clock-button-icon" />
        </button>
      </div>
      {!currentTask && (
        <div className="clock-load-container">
          <button
            className="load-task-button"
            onClick={() => handleLoadTasks()}
          >
            <ListEndIcon className="load-task-icon" />
            <span className="load-task-text text">Load tasks</span>
          </button>
        </div>
      )}
    </div>
  );
}
