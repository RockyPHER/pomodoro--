import "./style.css";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ITask } from "../../models/task";
import Task from "../task/main";

export default function Stack() {
  const [tasks, setTasks] = useState<ITask[]>([]);

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

  return (
    <section className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title text">Title</h1>
      </div>
      <div className="stack-body">
        <div className="stack-tasks-container">
          {tasks && tasks.map((task, idx) => <Task key={idx} data={task} />)}
        </div>
        <button className="button-add-task" onClick={() => createTask()}>
          <Plus className="plus" />
          <p className="text">Add new task</p>
        </button>
      </div>
    </section>
  );
}
