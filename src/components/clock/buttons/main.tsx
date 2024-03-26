import { Pause, Play, SkipForward, Square } from "lucide-react";
import { useState } from "react";
import "./style.css";

export default function ClockButtons() {
  const [isPlay, setIsPlay] = useState(false);

  return (
    <div className="clock-button-container">
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
  );
}
