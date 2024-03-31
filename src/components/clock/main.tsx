import "./style.css";
import { useEffect, useState } from "react";
import { ITask } from "../../models/task";
import ClockButtons from "./buttons/main";
import { formatTime } from "../../scripts/timeFormat";
import Pannel from "./pannel/main";

interface ClockProps {
  currentTask: ITask;
  nextTask: ITask;
  onTaskConclude: () => void;
  handleLoadTasks: () => void;
}

export default function Clock({
  currentTask,
  nextTask,
  onTaskConclude,
  handleLoadTasks,
}: ClockProps) {
  // variables
  const [currentTime, setCurrentTime] = useState(formatTime(0));
  const [isRunning, setIsRunning] = useState(false);

  const Timer = {
    time_start: 0,
    time_current: 0,
    time_passed: 0,
    start: false,
    stop: true,
    skip: false,
  };

  // Task
  function getCurrentTaskDuration() {
    return currentTask.duration;
  }
  function getNextTaskDuration() {
    onTaskConclude();
    return currentTask.duration;
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
  function setDefaultTimer() {
    setTimes(0);
    Timer.start = false;
    Timer.stop = true;
  }
  function setResetTimer() {
    setTimes(getCurrentTaskDuration());
    Timer.start = false;
    Timer.stop = true;
  }
  function setStartTimer() {
    setTimes(getNextTaskDuration());
    Timer.start = true;
    Timer.stop = false;
  }
  function setCompleteTimer() {
    setTimes(getNextTaskDuration());
    Timer.start = false;
    Timer.stop = true;
  }
  function setResumeTimer() {
    Timer.start = true;
  }
  function setPauseTimer() {
    Timer.start = false;
  }

  // Timer core
  function startTimer() {
    setIsRunning(true);
    console.log("Timer started", Timer);
    const times = setInterval(timeCycle, 1000);
    function timeCycle() {
      console.log("C: " + Timer.time_current, "P: " + Timer.time_passed);
      if (!Timer.start || Timer.stop) {
        clearInterval(times);
        console.log("Timer stoped/paused");
        setIsRunning(false);
        return;
      }
      if (Timer.time_current === 0) {
        clearInterval(times);
        setCompleteTimer();
        console.log("Timer completed", Timer);
        setIsRunning(false);
        return;
      }
      updateTime();
    }
  }

  // Timer handlers
  function handleStartTimer() {
    console.log("start");
    //if no input provided, set default timer
    if (!currentTask.duration) {
      console.error("No Task duration found.");
      setDefaultTimer();
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
    if (!currentTask.duration) {
      setDefaultTimer();
      return;
    }
    if (!nextTask.duration) {
      console.error("There is no more next tasks");
      return;
    }
    setCompleteTimer();
  }
  function handleStopTimer() {
    setResetTimer();
  }

  useEffect(() => {
    if (currentTask) {
      setCurrentTime(formatTime(currentTask.duration));
    }
  }, [currentTask]);
  return (
    <section className="clock-container">
      <div className="clock-head-container">
        <div className="clock-time-container">
          <span className="clock-time text">
            {currentTime[0]}:{currentTime[1]}
          </span>
        </div>
      </div>
      <div className="clock-body-container">
        <ClockButtons
          currentTask={currentTask}
          isRunning={isRunning}
          handleStartTimer={handleStartTimer}
          handleSkipTimer={handleSkipTimer}
          handleStopTimer={handleStopTimer}
          handleLoadTasks={handleLoadTasks}
        />
        {currentTask && (
          <Pannel currentTask={currentTask} nextTask={nextTask} />
        )}
      </div>
    </section>
  );
}
