import "./style.css";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import CreateTask from "../task/CreateTask";
import { ITask } from "../models/task";

export default function Clock() {
  // variables
  const [currentTime, setCurrentTime] = useState(0);
  const [warn, setWarn] = useState("");
  const cycle: number[] = [];

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
    return currentTask ? currentTask.time : 0;
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
    setCurrentTime(Timer.time_current);
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

  return (
    <section>
      <span>{currentTime}</span>
      <button onClick={() => handleStartTimer()}>
        {Timer.start ? <Pause /> : <Play />}
      </button>
      <CreateTask setTaskValues={setTaskValues} />
    </section>
  );
}
