import "./style.css";
import { ListEndIcon, Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { ITask } from "../../../models/task";
import { Pannel } from "../pannel/main";

interface ClockButtonsProps {
  currentTask: ITask | undefined;
  isPlay: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  loadTasks: () => void;
}

export default function ClockButtons({
  isPlay,
  currentTask,
  start,
  pause,
  reset,
  skip,
  loadTasks,
}: ClockButtonsProps) {
  const handlePlay = () => {
    if (!currentTask) {
      return;
    }
    isPlay ? pause() : start();
  };
  return (
    <div className="clock-buttons-container">
      <div className="clock-top-buttons-container">
        <button className="clock-button skip" onClick={() => skip()}>
          <SkipForward className="clock-button-icon" />
        </button>
        <button
          className={`clock-button-main ${
            !currentTask ? "button-no-task" : "button-has-task"
          }`}
          onClick={() => handlePlay()}
        >
          {isPlay ? (
            <Pause className="clock-button-main-icon pause-icon" />
          ) : (
            <Play
              className={`clock-button-main-icon ${
                !currentTask ? "play-icon-no-task" : "play-icon"
              }`}
            />
          )}
        </button>
        <button className="clock-button stop" onClick={() => reset()}>
          <RotateCcw className="clock-button-icon" />
        </button>
      </div>
      {!currentTask ? (
        <div className="clock-load-container">
          <button className="load-task-button" onClick={() => loadTasks()}>
            <ListEndIcon className="load-task-icon" />
            <span className="load-task-text text">Load tasks</span>
          </button>
        </div>
      ) : (
        <Pannel
          title={currentTask.title}
          description={currentTask.description}
        />
      )}
    </div>
  );
}
