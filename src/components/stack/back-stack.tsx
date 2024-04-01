import { Plus } from "lucide-react";
import { ITask } from "../../models/task";
import Task from "../task/main";

interface BackStackProps {
  tasks: ITask[];
  createTask: () => void;
  updateTask: (updateTasks: ITask) => void;
  deleteTask: (id: number) => void;
}

export default function BackStack({
  tasks,
  createTask,
  updateTask,
  deleteTask,
}: BackStackProps) {
  return (
    <div className="stack-body">
      {tasks.length > 0 && (
        <div className="stack-tasks-container">
          {tasks.map((task, idx) => (
            <Task
              isRunTask={false}
              key={idx}
              data={task}
              order={idx}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      )}
      <button className="button-add-task" onClick={() => createTask()}>
        <Plus className="plus" />
        <p className="text">Add new task</p>
      </button>
    </div>
  );
}
