import { Plus } from "lucide-react";
import "./style.css";

function Stack() {
  return (
    <section className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title">Title</h1>
      </div>
      <div className="stack-body">
        <button className="button-add-task">
          <Plus className="button-add-task-icon" />
          Add new task
        </button>
      </div>
    </section>
  );
}

export default Stack;
