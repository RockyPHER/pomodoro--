import "./style.css";
import { useEffect, useState } from "react";
import { ITask } from "../../models/task";
import ClockButtons from "./buttons/main";
import { formatTime } from "../../scripts/timeFormat";
import Pannel from "./pannel/main";

interface ClockProps {
  nextTask: ITask | null;
  currentTask: ITask;
  loadTasks: () => void;
  onTaskConclude: () => void;
}

export default function Clock({
  nextTask,
  currentTask,
  loadTasks,
  onTaskConclude,
}: ClockProps) {
  // variables
  const [times, setTimes] = useState({
    start_time: 0,
    current_time: 0,
    passed_time: 0,
  });
  const [state, setState] = useState({ is_running: false, stop: true });
  const [currentTime, setCurrentTime] = useState(
    formatTime(times.current_time)
  );
  // Task
  function getTime() {
    return currentTask.duration;
  }
  function getNextTime() {
    onTaskConclude();
    return currentTask.duration;
  }

  function pause() {
    setState({ ...state, is_running: false });
  }
  function start() {
    setState({ is_running: true, stop: false });
  }
  function resume() {
    setState({ ...state, is_running: true });
  }
  function reset() {
    setState({ is_running: false, stop: true });
  }

  // Timer state controllers
  function setTimerDefault() {
    setTimes({ start_time: 0, current_time: 0, passed_time: 0 });
    reset();
  }
  function setTimerReset() {
    setTimes((prev) => ({
      ...prev,
      current_time: prev.start_time,
      passed_time: 0,
    }));
    reset();
  }
  function setTimerStart() {
    setTimes({
      start_time: getTime(),
      current_time: getTime(),
      passed_time: 0,
    });
    start();
    startTimer();
  }
  function setTimerComplete() {
    setTimes({
      start_time: getNextTime(),
      current_time: getNextTime(),
      passed_time: 0,
    });
    reset();
  }

  // Timer core
  function startTimer() {
    console.log("Timer started", state);
    const timer = setInterval(timeCycle, 1000);
    function timeCycle() {
      console.log("Time: ", times);
      if (!state.is_running) {
        console.log("Timer pause");
        return;
      }
      if (times.current_time === 0) {
        clearInterval(timer);
        setTimerComplete();
        console.log("Timer completed", state);
        return;
      }
      setTimes((prev) => ({
        ...prev,
        current_time: prev.current_time--,
        passed_time: prev.passed_time++,
      }));
    }
  }

  // Timer handlers
  function handleStartTimer() {
    console.log(state);
    //if no input provided, set default timer
    if (!currentTask) {
      console.error("No Task found.");
      setTimerDefault();
      return;
    }
    //if playing, pause
    if (state.is_running && !state.stop) {
      console.log("pause timer");
      pause();
      console.log(state);
      return;
    }
    //if paused and stoped, start new timer
    if (!state.is_running && state.stop) {
      console.log("start timer");
      setTimerStart();
      console.log(state);
      return;
    }
    //if paused and not stoped, resume
    if (!state.is_running && !state.stop) {
      console.log("resume timer");
      resume();
      console.log(state);
      return;
    }
  }
  function handleSkipTimer() {
    if (!currentTask) {
      setTimerDefault();
      return;
    }
    if (!nextTask) {
      console.error("There is no more next tasks");
      return;
    }
    setTimerComplete();
  }
  function handleStopTimer() {
    setTimerReset();
  }

  useEffect(() => {
    setCurrentTime(formatTime(times.current_time));
  }, [times]);
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
          isRunning={state.is_running}
          loadTasks={loadTasks}
          handleStartTimer={handleStartTimer}
          handleSkipTimer={handleSkipTimer}
          handleStopTimer={handleStopTimer}
        />
        {currentTask && (
          <Pannel currentTask={currentTask} nextTask={nextTask} />
        )}
      </div>
    </section>
  );
}
