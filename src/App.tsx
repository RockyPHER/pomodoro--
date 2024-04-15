import "./styles/app.css";
import { useState } from "react";
import { ITask } from "./models/task";
import Clock from "./components/clock/main";
import Stack from "./components/stack/main";
import ClockButtons from "./components/clock/buttons/main";

export default function App() {
  // Clock controllers
  const [time, setTime] = useState(0);

  const [isPlay, setIsPlay] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [taskIsDone, setTaskIsDone] = useState(true);
  const [stackIsDone, setStackIsDone] = useState(true);
  const [hasRunTasks, setHasRunTasks] = useState(false);

  // Task states
  const [backTasks, setBackTasks] = useState<ITask[]>([]);
  const [runTasks, setRunTasks] = useState<ITask[]>([]);
  const [currentTask, setCurrentTask] = useState<ITask>();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  console.log("tasks", backTasks, runTasks, currentTask);

  // Clock Timer handling
  const start = () => {
    console.log("start");
    if (currentTask) {
      setIsReset(false);
      setIsPlay(true);
    }
  };
  const pause = () => {
    console.log("pause");
    setIsPlay(false);
  };
  const reset = () => {
    console.log("reset");
    if (currentTask) {
      setTime(currentTask.duration);
      setIsReset(true);
      setIsPlay(false);
    }
  };
  const skip = () => {
    console.log("skip");
    getNextTask();
    setIsReset(true);
    setIsPlay(false);
  };

  // RunTask handling
  const loadTasks = () => {
    const filteredTasks = backTasks.filter((task) => task.duration !== 0);
    setHasRunTasks(true);
    setCurrentTask(filteredTasks[currentIdx]);
    setTime(filteredTasks[currentIdx].duration);
    setRunTasks(filteredTasks);
    setBackTasks([]);
    console.log("tasks loaded");
  };
  function handleLoadTasks() {
    if (runTasks.length <= 0 && !isPlay) {
      loadTasks();
    }
  }
  function getNextTask() {
    const nextIdx = currentIdx + 1;
    const maxIdx = runTasks.length - 1;
    setTaskIsDone(true);
    console.log("task conclude:", nextIdx, maxIdx);
    if (nextIdx <= maxIdx) {
      console.log("setting next idx");
      const nextTask = runTasks[nextIdx];
      setCurrentIdx(nextIdx);
      setCurrentTask(nextTask);
      setTime(nextTask.duration);
      return;
    }
    console.log("nextIdx dont exist");
    clearRunTasks();
    return;
  }
  function clearRunTasks() {
    console.log("clearing runTasks");
    setTime(0);
    setStackIsDone(true);
    setHasRunTasks(false);
    setCurrentIdx(0);
    setCurrentTask(undefined);
    setRunTasks([]);
  }
  // BackTask handling
  function createTask() {
    const newTask: ITask = {
      id: Math.floor(Math.random() * Date.now()),
      title: "title",
      duration: 0,
      description: "",
      order: backTasks.length + 1,
    };
    setBackTasks([...backTasks, newTask]);
  }
  function deleteTask(delTask: ITask) {
    const newBackTasks = backTasks.filter((task) => task.id !== delTask.id);
    console.log("Delete task", delTask);
    setBackTasks(newBackTasks);
  }
  function updateTask(updatedTask: ITask) {
    setBackTasks(
      backTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  return (
    <main>
      <Stack
        isRunStack={false}
        tasks={backTasks}
        runTasks={runTasks}
        currentTask={currentTask}
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
      <div className="main-clock">
        <Clock
          hasRunTasks={hasRunTasks}
          stackIsDone={stackIsDone}
          taskIsDone={taskIsDone}
          isReset={isReset}
          isPlay={isPlay}
          time={time}
          setTime={setTime}
          setIsPlay={setIsPlay}
          setIsReset={setIsReset}
          setTaskIsDone={setTaskIsDone}
          setStackIsDone={setStackIsDone}
          onTaskConclude={getNextTask}
        />
        <ClockButtons
          isPlay={isPlay}
          currentTask={currentTask}
          start={start}
          pause={pause}
          reset={reset}
          skip={skip}
          loadTasks={handleLoadTasks}
        />
      </div>
      <Stack
        isRunStack={true}
        tasks={backTasks}
        runTasks={runTasks}
        currentTask={currentTask}
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </main>
  );
}
