import Task from "../task/main";
import { ITask } from "../../models/task";

interface RunStackProps {
  runTasks: ITask[];
  currentTask: ITask;
}
export default function RunStack({ runTasks, currentTask }: RunStackProps) {
  return (
    <div className="stack-body">
      {runTasks.length > 0 && (
        <div className="stack-tasks-container">
          {runTasks.map((task, idx) => (
            <Task
              key={idx}
              data={task}
              isRunTask={true}
              currentTask={currentTask}
              updateTask={() => {}}
              deleteTask={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
