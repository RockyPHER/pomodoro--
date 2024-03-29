import { useState } from "react";
import "./style.css";
import { ITask } from "../../models/task";
import RunStack from "./run-stack";
import BackStack from "./back-stack";

interface StackProps {
  isRunStack: boolean;
}

export default function Stack({ isRunStack }: StackProps) {
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

  function updateTask(updateTasks: ITask[]) {
    const newTasks = tasks.map((task) => {
      const newTask = updateTasks.find(
        (updateTask) => updateTask.id === task.id
      );
      return !newTask ? task : newTask;
    });
    setTasks(newTasks);
  }

  return (
    <section className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title text">
          {isRunStack ? "isRunStack" : "backStack"}
        </h1>
      </div>
      {isRunStack ? (
        <RunStack runTasks={runTasks} onTaskConclude={onTaskConclude} />
      ) : (
        <BackStack
          tasks={tasks}
          createTask={createTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
    </section>
  );
}
