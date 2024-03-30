import ".style.css";
import { ITask } from "../../../models/task";

interface PannelProps {
  currentTask: ITask;
  nextTask: ITask;
}

export default function Pannel({ currentTask, nextTask }: PannelProps) {
  return (
    <section className="pannel-container">
      <div></div>
    </section>
  );
}
