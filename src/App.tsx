import "./styles/app.css";
import { useState } from "react";
import { ITask } from "./models/task";
import Clock from "./components/clock/main";
import Stack from "./components/stack/main";
import ClockButtons from "./components/clock/buttons/main";

export default function App() {
  // Clock controllers
  const [isPlay, setIsPlay] = useState(false);

  // Task states
  const [backTasks, setBackTasks] = useState<ITask[]>([]);
  const [runTasks, setRunTasks] = useState<ITask[]>([]);
  const [currentTask, setCurrentTask] = useState<ITask>();

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
    setCurrentTask(filteredTasks[0]);
    setRunTasks(filteredTasks.slice(1));
    setBackTasks([]);
    console.log("tasks loaded");
  };
  function handleLoadTasks() {
    if (runTasks.length <= 0 && !isPlay) {
      loadTasks();
    }
  }
  function onTaskConclude() {
    if (runTasks.length > 0) {
      setCurrentTask(runTasks[0]);
      setRunTasks(runTasks.slice(1));
      return;
    }
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
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
      <div className="main-clock">
        <Clock
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
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </main>
  );
}
