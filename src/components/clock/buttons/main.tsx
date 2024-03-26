import { Pause, Play, SkipForward, Square } from "lucide-react";
import { useState } from "react";
import "./style.css";

export default function ClockButtons() {
  const [isPlay, setIsPlay] = useState(false);

  return (
    <div className="clock-buttons-container">
      <button className="clock-buttons-skip">
        <SkipForward />
      </button>
      <button className="clock-buttons-play">
        {isPlay ? <Pause /> : <Play />}
      </button>
      <button className="clock-buttons-stop">
        <Square />
      </button>
    </div>
  );
}
