import "./style.css";
import { ITask } from "../../../models/task";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface PannelProps {
  currentTask: ITask;
  nextTask: ITask | null;
}

export default function Pannel({ currentTask, nextTask }: PannelProps) {
  const [isCurrentTaskOpen, setCurrentTaskOpen] = useState(false);
  const [isNextTaskOpen, setNextTaskOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  function handleHide() {
    setIsOpen(!isOpen);
  }
  return (
    <section className="pannel-container">
      <div className="pannel-heading">
        <button className="pannel-hide-button" onClick={() => handleHide()}>
          {isOpen ? (
            <Minus className="hide-icon" />
          ) : (
            <Plus className="hide-icon" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="pannel-body">
          <div className="current-task-container">
            <div className="current-task-heading">
              <span className="current-task-title text">
                {currentTask.order} : {currentTask.title}
              </span>
            </div>
            {isCurrentTaskOpen && (
              <div className="current-task-body">
                <span className="current-task-description text">
                  {currentTask.description}
                </span>
              </div>
            )}
          </div>
          {nextTask && (
            <div className="next-task-container">
              <div className="next-task-heading">
                <span className="next-task-title text">
                  {nextTask.order} : {nextTask.title}
                </span>
              </div>
              {isNextTaskOpen && (
                <div className="next-task-body">
                  <span className="next-task-description text">
                    {nextTask.description}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
