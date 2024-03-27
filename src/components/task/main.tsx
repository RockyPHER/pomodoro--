import "./style.css";
import { useEffect, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { X } from "lucide-react";
import { ITask } from "../../models/task";

interface TaskProps {
  data: ITask;
}

export default function Task({ data }: TaskProps) {
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

  return (
    <div className="task-container">
      <div className="task-heading">
        {editTitle ? (
          <input
            className="task-title-input"
            onBlur={() => setEditTitle(false)}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          ></input>
        ) : (
          <span onSelect={() => setEditTitle(true)} className="task-title text">
            {title}
          </span>
        )}
        <div className="task-heading-right">
          {editDuration ? (
            <input
              className="task-duration-input"
              onBlur={() => setEditDuration(false)}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              value={duration}
              type="number"
            ></input>
          ) : (
            <span
              onSelect={() => setEditDuration(true)}
              className="task-duration text"
            >
              {formatedDuration[0]}:{formatedDuration[1]}
            </span>
          )}
          <button className="task-button-close">
            <X className="x" />
          </button>
        </div>
      </div>
      {openTask && <div className="task-description"></div>}
    </div>
  );
}
