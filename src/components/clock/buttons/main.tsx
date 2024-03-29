import {
  ListEndIcon,
  Pause,
  Play,
  SaveAll,
  SkipForward,
  Square,
} from "lucide-react";
import { useState } from "react";
import "./style.css";
import OngoingTask from "../ongoing-task/main";

export default function ClockButtons() {
  const [isPlay, setIsPlay] = useState(false);
  const [hasTasks, setHasTasks] = useState(false);

  return (
    <div className="clock-buttons-container">
      <div className="clock-top-buttons-container">
        <button className="clock-button skip">
          <SkipForward className="clock-button-icon" />
        </button>
        <button className={`clock-button-main ${isPlay ? "pause" : "play"}`}>
          {isPlay ? (
            <Pause className="clock-button-main-icon" />
          ) : (
            <Play className="clock-button-main-icon" />
          )}
        </button>
        <button className="clock-button stop">
          <Square className="clock-button-icon" />
        </button>
      </div>
      {!hasTasks ? (
        <div className="clock-load-container">
          <button className="load-task-button">
            <ListEndIcon className="load-task-icon" />
            <span className="load-task-text text">Load tasks</span>
          </button>
        </div>
      ) : (
        <OngoingTask />
      )}
    </div>
  );
}
