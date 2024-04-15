import { Plus } from "lucide-react";
import { ITask } from "../../models/task";
import Task from "../task/main";

interface BackStackProps {
  backTasks: ITask[];
  createTask: () => void;
  updateTask: (updateTasks: ITask) => void;
  deleteTask: (delTask: ITask) => void;
}

export default function BackStack({
  backTasks,
  createTask,
  updateTask,
  deleteTask,
}: BackStackProps) {
  const tasks = backTasks;
  const tasksComponents =
    tasks &&
    tasks.map((task) => (
      <Task
        key={task.id}
        data={task}
        isRunTask={false}
        currentTask={undefined}
        deleteTask={deleteTask}
        updateTask={updateTask}
      />
    ));
  console.log("backtask", tasks);

  return (
    <div className="stack-body">
      {tasks.length > 0 && (
        <div className="stack-tasks-container">{tasksComponents}</div>
      )}
      <button className="button-add-task" onClick={() => createTask()}>
        <Plus className="plus" />
        <p className="text">Add new task</p>
      </button>
    </div>
  );
}
