import "./style.css";
import { Play } from "lucide-react";
import { changeTime, handleStartTimer, onTimeChange } from "./script";
import { useEffect, useState } from "react";

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const { currentTime, passedTime } = onTimeChange();
    setCurrentTime(currentTime);
  }, [changeTime]);

  return (
    <section>
      <span></span>
      <button onClick={() => handleStartTimer()}>
        <Play />
      </button>
      <button>SetCountdown</button>
      <input type="number"></input>
    </section>
  );
}
