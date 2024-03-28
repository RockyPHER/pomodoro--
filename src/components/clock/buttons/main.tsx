import { Pause, Play, SaveAll, SkipForward, Square } from "lucide-react";
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
          <SkipForward />
        </button>
        <button className={`clock-button ${isPlay ? "pause" : "play"}`}>
          {isPlay ? <Pause /> : <Play />}
        </button>
        <button className="clock-button stop">
          <Square />
        </button>
      </div>
      {!hasTasks ? (
        <div className="clock-load-container">
          <button className="load-task-button">
            <SaveAll className="load-task-icon" />
          </button>
        </div>
      ) : (
        <OngoingTask />
      )}
    </div>
  );
}
