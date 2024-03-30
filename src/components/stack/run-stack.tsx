import Task from "../task/main";
import { ITask } from "../../models/task";

interface RunStackProps {
  runTasks: ITask[];
}
export default function RunStack({ runTasks }: RunStackProps) {
  return (
    <div className="stack-body">
      {runTasks.length > 0 && (
        <div className="stack-tasks-container">
          {runTasks.map((task, idx) => (
            <Task
              isRunTask={true}
              key={idx}
              data={task}
              updateTask={() => {}}
              deleteTask={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
