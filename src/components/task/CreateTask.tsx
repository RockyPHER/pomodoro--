import { ITask } from "../models/task";
import "./style.css";

interface CreateTaskProps {
  setTaskValues: (task: ITask) => void;
}

export default function CreateTask({ setTaskValues }: CreateTaskProps) {
  function handleAddTask() {
    const taskName = (
      document.getElementById("task-name") as HTMLInputElement & {
        value: string;
      }
    ).value;
    const taskTime = (
      document.getElementById("task-time") as HTMLInputElement & {
        value: number;
      }
    ).value;
    if (taskName && taskTime) {
      const Task: ITask = {
        name: taskName,
        time: taskTime,
      };
      setTaskValues(Task);
    }
  }
  return (
    <div className="create-waifu-container">
      <div className="input-container">
        <label htmlFor="task-name">Name</label>
        <input id="task-name" type="text"></input>
        <label htmlFor="task-time">Time</label>
        <input id="task-time" type="number" min={0}></input>
      </div>
      <button onClick={() => handleAddTask()} className="add-task">
        +
      </button>
    </div>
  );
}
