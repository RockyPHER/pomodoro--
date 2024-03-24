import "./style.css";
import { Play } from "lucide-react";
import { useState } from "react";

export default function Clock() {
  const Timer = {
    time_start: 0,
    time_current: 0,
    time_passed: 0,
    start: false,
    stop: true,
    skip: false,
    completed: false,
  };

  const [currentTime, setCurrentTime] = useState(0);

  const cycle: number[] = [];

  function setNextCycle(countdown: number) {
    console.log(cycle, countdown);
    cycle.push(countdown);
    console.log(cycle, countdown);
    return;
  }

  function getCountdown() {
    if (cycle.length <= 0) {
      throw new Error("No cycles found");
    }
    return cycle[0];
  }

  function getNextCountdown() {
    if (cycle.length <= 0) {
      throw new Error("No cycles found");
    }
    cycle.shift();
    return cycle[0];
  }

  function setTimes(countdown: number) {
    Timer.time_start = countdown;
    Timer.time_current = Timer.time_start;
    Timer.time_passed = Timer.time_start - Timer.time_current;
  }

  function changeTime() {
    Timer.time_current--;
    Timer.time_passed = Timer.time_start - Timer.time_current;
    setCurrentTime(Timer.time_current);
  }

  function setResetTimer() {
    setTimes(0);
    Timer.start = false;
    Timer.stop = true;
  }

  function setStartTimer() {
    setTimes(getCountdown());
    Timer.start = true;
    Timer.stop = false;
  }

  function setStopTimer() {
    setTimes(getCountdown());
    Timer.start = false;
    Timer.stop = true;
  }

  function setSkipTimer() {
    setTimes(getNextCountdown());
    Timer.start = false;
    Timer.stop = false;
  }

  function setResumeTimer() {
    Timer.start = true;
  }

  function setPauseTimer() {
    Timer.start = false;
  }

  function setCompleteTimer() {
    setTimes(getNextCountdown());
    Timer.start = false;
    Timer.stop = true;
    Timer.completed = true;
  }

  function startTimer() {
    console.log("Timer started", Timer);
    const times = setInterval(timeCycle, 1000);
    function timeCycle() {
      console.log("C: " + Timer.time_current, "P: " + Timer.time_passed);
      if (!Timer.start || Timer.stop) {
        clearInterval(times);
        console.log("Timer stoped/paused");
        return;
      }
      if (Timer.time_current === 0) {
        clearInterval(times);
        setCompleteTimer();
        console.log("Timer completed", Timer);
        return;
      }
      changeTime();
    }
  }

  function handleStartTimer() {
    console.log("start");
    if (cycle.length <= 0) {
      console.log("invalid cycle");
      setResetTimer();
      return;
    }
    //if paused and stoped, start new timer
    if (!Timer.start && Timer.stop) {
      console.log("start timer");
      setStartTimer();
      startTimer();
      return;
    }
    //if paused and not stoped, resume timer
    if (!Timer.start && !Timer.stop) {
      setResumeTimer();
      startTimer();
      return;
    }
    setPauseTimer();
  }

  function handleSkipTimer() {
    if (cycle.length >= 0) {
      setResetTimer();
      return;
    }
    setSkipTimer();
  }

  function handleStopTimer() {
    if (cycle.length >= 0) {
      setResetTimer();
      return;
    }
    setStopTimer();
  }
  const [warn, setWarn] = useState("");

  function handlePlay() {
    if (cycle.length <= 0) {
      setWarn("Please add at least one cycle.");
      setTimeout(() => {
        setWarn("");
      }, 2000);
      return;
    }
    handleStartTimer();
  }

  function handleAddCycle() {
    const value = (
      document.getElementById("cycle") as HTMLInputElement & { value: number }
    ).value;
    value && setNextCycle(parseInt(value));
  }

  return (
    <section>
      <span>{currentTime}</span>
      <button onClick={() => handlePlay()}>
        <Play />
      </button>
      <button onClick={() => handleAddCycle()}>SetCountdown</button>
      <input id="cycle" min={0} type="number"></input>
      {warn && <p>{warn}</p>}
    </section>
  );
}
