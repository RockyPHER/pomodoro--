import Task from "../task/main";
import { ITask } from "../../models/task";

interface RunStackProps {
  runTasks: ITask[];
  currentTask: ITask | undefined;
  clearTasks: () => void;
}
export default function RunStack({
  runTasks,
  currentTask,
  clearTasks,
}: RunStackProps) {
  const tasks = runTasks.map((task, idx) => (
    <Task
      key={idx}
      data={task}
      isRunTask={true}
      currentTask={currentTask}
      updateTask={() => {}}
      deleteTask={() => {}}
    />
  ));
  return (
    <div className="stack-body run-stack">
      {runTasks.length > 0 && (
        <>
          <div className="stack-tasks-container">{tasks}</div>
          <button onClick={() => clearTasks()} className="clear-run-tasks text">
            clear tasks
          </button>
        </>
      )}
    </div>
  );
}
