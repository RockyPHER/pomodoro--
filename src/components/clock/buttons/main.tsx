import { Pause, Play, SkipForward, Square } from "lucide-react";
import { useState } from "react";
import "./style.css";

export default function ClockButtons() {
  const [isPlay, setIsPlay] = useState(false);

  return (
    <div className="clock-buttons-container">
      <button className="clock-buttons skip">
        <SkipForward className="icon" />
      </button>
      <button className="clock-buttons play-pause">
        {isPlay ? <Pause className="icon" /> : <Play className="icon" />}
      </button>
      <button className="clock-buttons stop">
        <Square className="icon" />
      </button>
    </div>
  );
}
