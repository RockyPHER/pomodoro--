import "./style.css";
import { ChangeEvent, useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { X } from "lucide-react";
import { ITask } from "../../models/task";

interface TaskProps {
  data: ITask;
  isRunTask: boolean;
  deleteTask: (id: number) => void;
  updateTask: (updatedTask: ITask) => void;
}

export default function Task({
  data,
  isRunTask,
  deleteTask,
  updateTask,
}: TaskProps) {
  const [editDuration, setEditDuration] = useState(false);
  const [editTitle, setEditTitle] = useState(true);
  const [openTask, setOpenTask] = useState(false);

  const [duration, setDuration] = useState<number>(data.duration);
  const [formatedDuration, setFormatedDuration] = useState<string[]>(
    formatTime(data.duration)
  );
  const [title, setTitle] = useState<string>(data.title);

  useEffect(() => {
    setFormatedDuration(formatTime(duration));
  }, [duration]);

  function handleTimeInput(e: ChangeEvent<HTMLInputElement>) {
    setDuration(parseInt(e.target.value));
  }

  return (
    <div className="task-container">
      <div className="task-heading">
        <div className="task-heading-left">
          {editTitle && !isRunTask ? (
            <input
              className="task-title-input"
              autoFocus
              onBlur={() => setEditTitle(false)}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            ></input>
          ) : (
            <span
              className="task-title-text text"
              onClick={() => setEditTitle(true)}
            >
              {title}
            </span>
          )}
          {editDuration && !isRunTask ? (
            <input
              className="task-duration-input"
              autoFocus
              onBlur={() => setEditDuration(false)}
              onChange={(e) => handleTimeInput(e)}
              value={duration}
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
              onClick={() => deleteTask(data.id)}
            >
              <X className="x" />
            </button>
          </div>
        )}
      </div>
      {openTask && <div className="task-description"></div>}
    </div>
  );
}
