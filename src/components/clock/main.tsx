import "./style.css";
import { useState } from "react";
import { ITask } from "../../models/task";
import ClockButtons from "./buttons/main";
import { formatTime } from "../../scripts/timeFormat";

export default function Clock() {
  // variables
  const [currentTime, setCurrentTime] = useState(formatTime(0));
  const [warn, setWarn] = useState("");

  const Timer = {
    time_start: 0,
    time_current: 0,
    time_passed: 0,
    start: false,
    stop: true,
    skip: false,
    completed: false,
  };

  const tasks: ITask[] = [];

  // Task
  function setTaskValues(task: ITask) {
    tasks.push(task);
  }
  function getNextTask() {
    const currentTask = tasks.shift();
    return currentTask ? currentTask.duration : 0;
  }

  // Handle timer props
  function setTimes(cycleTime: number) {
    Timer.time_start = cycleTime;
    Timer.time_current = Timer.time_start;
    Timer.time_passed = Timer.time_start - Timer.time_current;
  }
  function updateTime() {
    Timer.time_current--;
    Timer.time_passed = Timer.time_start - Timer.time_current;
    setCurrentTime(formatTime(Timer.time_current));
  }

  // Timer state controllers
  function setResetTimer() {
    setTimes(0);
    Timer.start = false;
    Timer.stop = true;
  }
  function setStartTimer() {
    setTimes(getNextTask());
    Timer.start = true;
    Timer.stop = false;
  }
  function setStopTimer() {
    setTimes(getNextTask());
    Timer.start = false;
    Timer.stop = true;
  }
  function setSkipTimer() {
    setTimes(getNextTask());
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
    setTimes(getNextTask());
    Timer.start = false;
    Timer.stop = true;
    Timer.completed = true;
  }

  // Timer core
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
      updateTime();
    }
  }

  // Timer handlers
  function handleStartTimer() {
    console.log("start");
    if (tasks.length <= 0) {
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
    if (tasks.length >= 0) {
      setResetTimer();
      return;
    }
    setSkipTimer();
  }
  function handleStopTimer() {
    if (tasks.length >= 0) {
      setResetTimer();
      return;
    }
    setStopTimer();
  }

  return (
    <section className="clock-timer-container">
      <div className="clock-time-container">
        <span className="clock-time-text text">
          {currentTime[0]}:{currentTime[1]}
        </span>
      </div>
      <ClockButtons />
    </section>
  );
}
