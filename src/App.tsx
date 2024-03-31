import { useState } from "react";
import Clock from "./components/clock/main";
import { ITask } from "./models/task";
import Stack from "./components/stack/main";

export default function App() {
  const [backTasks, setBackTasks] = useState<ITask[]>([]);
  const [runTasks, setRunTasks] = useState<ITask[]>([]);

  function handleLoadTasks() {
    if (runTasks.length <= 0) {
      setRunTasks(backTasks);
      setBackTasks([]);
    }
  }

  // RunTask handling
  function onTaskConclude() {
    setRunTasks((currentTasks) => currentTasks.slice(1));
  }

  // BackTask handling
  function createTask() {
    const newTask: ITask = {
      id: Math.floor(Math.random() * Date.now()),
      title: "title",
      duration: 0,
      description: "",
      order: undefined,
    };

    setBackTasks([...backTasks, newTask]);
  }
  function deleteTask(id: number) {
    setBackTasks(() => backTasks.filter((task) => task.id !== id));
  }
  function updateTask(updatedTask: ITask) {
    setBackTasks(() =>
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
      <Clock
        currentTask={runTasks[0]}
        nextTask={runTasks[1]}
        onTaskConclude={onTaskConclude}
        handleLoadTasks={handleLoadTasks}
      />
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
