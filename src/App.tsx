import "./styles/app.css";
import { useState } from "react";
import { ITask } from "./models/task";
import Clock from "./components/clock/main";
import Stack from "./components/stack/main";
import ClockButtons from "./components/clock/buttons/main";

export default function App() {
  // Clock controllers
  const [isPlay, setIsPlay] = useState(false);
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
    setIsPlay(true);
  };
  const pause = () => {
    console.log("pause");
    setIsPlay(false);
  };
  const reset = () => {
    console.log("reset");
    setIsPlay(false);
  };

  // RunTask handling
  const loadTasks = () => {
    const filteredTasks = backTasks.filter((task) => task.duration !== 0);
    setHasRunTasks(true);
    setCurrentTask(filteredTasks[currentIdx]);
    setRunTasks(filteredTasks);
    setBackTasks([]);
    console.log("tasks loaded");
  };
  function handleLoadTasks() {
    if (runTasks.length <= 0 && !isPlay) {
      loadTasks();
    }
  }
  function onTaskConclude() {
    const nextIdx = currentIdx + 1;
    const maxIdx = runTasks.length - 1;
    console.log("task conclude:", nextIdx, maxIdx);
    if (nextIdx <= maxIdx) {
      console.log("setting next idx");
      setCurrentIdx(currentIdx + 1);
      setCurrentTask(runTasks[currentIdx + 1]);
      return;
    }
    console.log("nextIdx dont exist");
    clearRunTasks();
  }
  function clearRunTasks() {
    console.log("clearing runTasks");
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
  function deleteTask(id: number) {
    setBackTasks(backTasks.filter((task) => task.id !== id));
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
          startTime={currentTask ? currentTask.duration : 0}
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          onTaskConclude={onTaskConclude}
        />
        <ClockButtons
          isPlay={isPlay}
          currentTask={currentTask}
          start={start}
          pause={pause}
          reset={reset}
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
