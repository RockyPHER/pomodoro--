import { useState } from "react";
import Clock from "./components/clock/main";
import { ITask } from "./models/task";
import Stack from "./components/stack/main";

export default function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [runTasks, setRunTasks] = useState<ITask[]>([]);

  function onTaskConclude(id: number) {
    setRunTasks(() => runTasks.filter((task) => task.id !== id));
  }

  function createTask() {
    const newTask: ITask = {
      id: Math.floor(Math.random() * Date.now()),
      title: "title",
      duration: 0,
      description: "",
      order: undefined,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: number) {
    setTasks(() => tasks.filter((task) => task.id !== id));
  }

  function updateTask(updatedTask: ITask) {
    setTasks(() =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  return (
    <main>
      <Stack
        isRunStack={false}
        tasks={tasks}
        runTasks={runTasks}
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
        onTaskConclude={onTaskConclude}
      />
      <Clock />
      <Stack
        isRunStack={true}
        tasks={tasks}
        runTasks={runTasks}
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
        onTaskConclude={onTaskConclude}
      />
    </main>
  );
}
