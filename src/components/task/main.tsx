import "./style.css";
import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from "react";
import { formatTime } from "../../scripts/timeFormat";
import { X } from "lucide-react";
import { ITask } from "../../models/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [isSelected, setIsSelected] = useState(false);
  const [editDuration, setEditDuration] = useState(false);
  const [editTitle, setEditTitle] = useState(true);
  const formatedDuration = formatTime(task.duration);

  const durationRef = useRef<HTMLInputElement | null>(null);

  const [min, setMin] = useState<string>();
  const [sec, setSec] = useState<string>();

  function handleInputBlur(e: FocusEvent<HTMLDivElement, Element>) {
    if (
      !e.relatedTarget ||
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      durationRef.current?.blur();
      setEditDuration(false);
    }
  }
  const handleSecInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (parseInt(input) > 59) return setSec("59");
    if (input.length > 2) return setSec(input.slice(1));
    if (parseInt(input) < 10) return setSec(input.padStart(2, "0"));
  };
  const handleMinInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (parseInt(input) > 60) return setMin("60");
    if (input.length > 2) return setMin(input.slice(1));
    if (parseInt(input) < 10) return setMin(input.padStart(2, "0"));
  };

  function setTaskTime(e: ChangeEvent<HTMLInputElement>) {
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
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="task-container"
    >
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
              {task.title}
            </span>
          )}
          {editDuration && !isRunTask ? (
            <div
              ref={durationRef}
              onBlur={(e) => handleInputBlur(e)}
              className="task-duration-input-container"
            >
              <input
                autoFocus
                className="task-duration-input"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleMinInput(e)}
                value={min}
                type="number"
                min={0}
                max={60}
              ></input>
              <input
                className="task-duration-input"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleSecInput(e)}
                value={sec}
                type="number"
                min={0}
                max={59}
              ></input>
            </div>
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
      {/* {openTask && <div className="task-description">{task.description}</div>} */}
    </div>
  );
}
