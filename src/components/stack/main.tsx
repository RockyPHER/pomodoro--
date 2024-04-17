import "./style.css";
import { ITask } from "../../models/task";
import RunStack from "./run-stack";
import BackStack from "./back-stack";

interface StackProps {
  tasks: ITask[];
  runTasks: ITask[];
  isRunStack: boolean;
  currentTask: ITask | undefined;
  clearTasks: () => void;
  setBackTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  createTask: () => void;
  updateTask: (updatedTask: ITask) => void;
  deleteTask: (delTask: ITask) => void;
}

export default function Stack({
  tasks,
  runTasks,
  isRunStack,
  currentTask,
  clearTasks,
  setBackTasks,
  createTask,
  updateTask,
  deleteTask,
}: StackProps) {
  return (
    <aside className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title text">
          {isRunStack ? "runStack" : "backStack"}
        </h1>
      </div>
      {isRunStack ? (
        <RunStack
          runTasks={runTasks}
          currentTask={currentTask}
          clearTasks={clearTasks}
        />
      ) : (
        <BackStack
          backTasks={tasks}
          setBackTasks={setBackTasks}
          createTask={createTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
    </aside>
  );
}
