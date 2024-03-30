import "./style.css";
import { ITask } from "../../models/task";
import RunStack from "./run-stack";
import BackStack from "./back-stack";

interface StackProps {
  isRunStack: boolean;
  tasks: ITask[];
  runTasks: ITask[];
  createTask: () => void;
  updateTask: (updatedTask: ITask) => void;
  deleteTask: (id: number) => void;
  onTaskConclude: (id: number) => void;
}

export default function Stack({
  isRunStack,
  tasks,
  runTasks,
  createTask,
  updateTask,
  deleteTask,
  onTaskConclude,
}: StackProps) {
  return (
    <aside className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title text">
          {isRunStack ? "runStack" : "backStack"}
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
    </aside>
  );
}
