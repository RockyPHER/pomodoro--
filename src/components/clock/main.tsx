import "./style.css";
import { useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";

export default function Clock() {
  const [play, setPlay] = useState(true);
  const [time, setTime] = useState(10);
  const formatedTime = formatTime(time);

  useEffect(() => {
    console.log("reload", time);
    const timerID = setInterval(() => {
      if (play) {
        if (time <= 0) {
          console.log("Timer conclude!");
          setPlay(false);
          clearInterval(timerID);
          return;
        }
        setTime(time - 1);
        return;
      }
    }, 1000);
    return () => clearInterval(timerID);
  }, [time]);

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
          <p className="clock-time text">
            {formatedTime[0] + ":" + formatedTime[1]}
          </p>
        </div>
      </div>
      <div className="clock-body-container">
        <button onClick={() => (play ? pause() : start())}>PLAY</button>
      </div>
    </div>
  );
}
