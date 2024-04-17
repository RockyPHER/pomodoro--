import { Plus } from "lucide-react";
import { ITask } from "../../models/task";
import Task from "../task/main";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface BackStackProps {
  backTasks: ITask[];
  setBackTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  createTask: () => void;
  updateTask: (updateTasks: ITask) => void;
  deleteTask: (delTask: ITask) => void;
}

export default function BackStack({
  backTasks,
  setBackTasks,
  createTask,
  updateTask,
  deleteTask,
}: BackStackProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 80,
        tolerance: 5,
      },
    })
  );
  const tasks = backTasks;
  const tasksComponents =
    tasks &&
    tasks.map((task) => (
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <Task
          key={task.id}
          data={task}
          isRunTask={false}
          currentTask={undefined}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />
      </SortableContext>
    ));
  console.log("backtask", tasks);

  const getTaskPos = (id: UniqueIdentifier) =>
    tasks.findIndex((task) => task.id === id);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id === over.id) return;

    setBackTasks((tasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over ? over.id : active.id);

      return arrayMove(tasks, originalPos, newPos);
    });
  };
  return (
    <div className="stack-body">
      {tasks.length > 0 && (
        <div className="stack-tasks-container">
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            {tasksComponents}
          </DndContext>
        </div>
      )}
      <button className="button-add-task" onClick={() => createTask()}>
        <Plus className="plus" />
        <p className="text">Add new task</p>
      </button>
    </div>
  );
}
