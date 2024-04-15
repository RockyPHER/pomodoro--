import "./style.css";
import { ChangeEvent, useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { X } from "lucide-react";
import { ITask } from "../../models/task";

interface TaskProps {
  data: ITask;
  isRunTask: boolean;
  currentTask: ITask | undefined;
  deleteTask: (delTask: ITask) => void;
  updateTask: (updatedTask: ITask) => void;
}

export default function Task({
  data,
  isRunTask,
  currentTask,
  deleteTask,
  updateTask,
}: TaskProps) {
  const [task, setTask] = useState<ITask>({
    id: data.id,
    duration: data.duration,
    title: data.title,
    description: data.description,
    order: data.order,
  });

  const [isSelected, setIsSelected] = useState(false);
  const [editDuration, setEditDuration] = useState(false);
  const [editTitle, setEditTitle] = useState(true);
  const [openTask, setOpenTask] = useState(false);
  const formatedDuration = formatTime(task.duration);

  function handleTimeInput(e: ChangeEvent<HTMLInputElement>) {
    setTask({
      ...task,
      duration: parseInt(e.target.value),
    });
  }

  useEffect(() => {
    if (!isRunTask && task !== data) {
      updateTask(task);
    }
    if (isRunTask && currentTask) {
      if (currentTask.id === data.id) {
        setIsSelected(true);
      }
      if (currentTask.id !== data.id) {
        setIsSelected(false);
      }
    }
  }, [task, currentTask]);

  return (
    <div className="task-container">
      <div className={`${isSelected ? "task-selected" : "task-heading"}`}>
        <div className="task-heading-left">
          {editTitle && !isRunTask ? (
            <input
              autoFocus
              className="task-title-input"
              onBlur={() => setEditTitle(false)}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              value={task.title}
            ></input>
          ) : (
            <span
              className="task-title-text text"
              onClick={() => setEditTitle(true)}
            >
              {task.order} : {task.title}
            </span>
          )}
          {editDuration && !isRunTask ? (
            <input
              autoFocus
              className="task-duration-input"
              onBlur={() => setEditDuration(false)}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleTimeInput(e)}
              value={task.duration}
              type="number"
              min={0}
            ></input>
          ) : (
            <span
              onClick={() => setEditDuration(true)}
              className="task-duration-text text"
            >
              {formatedDuration[0]}:{formatedDuration[1]}
            </span>
          )}
        </div>
        {!isRunTask && (
          <div className="task-heading-right">
            <button
              className="task-button-close"
              onClick={() => deleteTask(task)}
            >
              <X className="x" />
            </button>
          </div>
        )}
      </div>
      {openTask && <div className="task-description">{task.description}</div>}
    </div>
  );
}
