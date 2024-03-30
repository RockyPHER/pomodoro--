import "./style.css";
import { ITask } from "../../../models/task";
import { useState } from "react";

interface PannelProps {
  currentTask: ITask;
  nextTask: ITask;
}

export default function Pannel({ currentTask, nextTask }: PannelProps) {
  const [isCurrentTaskOpen, setCurrentTaskOpen] = useState(false);
  const [isNextTaskOpen, setNextTaskOpen] = useState(false);
  return (
    <section className="pannel-container">
      <div className="current-task-container">
        <div className="current-task-heading">
          <span className="current-task-title text">{currentTask.title}</span>
        </div>
        {isCurrentTaskOpen && (
          <div className="current-task-body">
            <span className="current-task-description text">
              {currentTask.description}
            </span>
          </div>
        )}
      </div>
      <div className="next-task-container">
        <div className="next-task-heading">
          <span className="next-task-title text">{nextTask.title}</span>
        </div>
        {isNextTaskOpen && (
          <div className="next-task-body">
            <span className="next-task-description text">
              {nextTask.description}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
