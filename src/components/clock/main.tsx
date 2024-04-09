import "./style.css";
import { useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";

export default function Clock() {
  const [play, setPlay] = useState(false);

  function pause() {
    setPlay(false);
    console.log("pause");
  }
  function start() {
    setPlay(true);
    console.log("start");
  }

  return (
    <div className="clock-container">
      <div className="clock-head-container">
        <div className="clock-time-container">
          <Timer newTime={10} play={play} setPlay={setPlay} />
        </div>
      </div>
      <div className="clock-body-container">
        <button onClick={() => (play ? pause() : start())}>PLAY</button>
      </div>
    </div>
  );
}

interface TimerProps {
  newTime: number;
  play: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
}
function Timer({ newTime, play, setPlay }: TimerProps) {
  const [time, setTime] = useState({ current: 0, passed: 0 });
  const showTime = formatTime(time.current).join(":");

  function reset() {
    setTime({ current: newTime, passed: 0 });
    console.log("reset");
  }

  useEffect(() => {
    console.log("reload component");
    console.log("time:", time);
    if (time.current === 0 || time.current < 0) {
      setPlay(false);
      setTimeout(() => {
        reset();
      }, 500);
      return;
    }
    if (!play) {
      return;
    }
    // if play decrease timer
    setTimeout(() => {
      setTime((prev) => ({
        current: prev.current - 1,
        passed: prev.passed + 1,
      }));
    }, 1000);
  });

  return <p className="clock-time text">{showTime}</p>;
}
