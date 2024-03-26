import { Plus } from "lucide-react";
import "./style.css";

export default function Stack() {
  return (
    <section className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title text">Title</h1>
      </div>
      <div className="stack-body">
        <button className="button-add-task">
          <Plus className="plus" />
          <p className="text">Add new task</p>
        </button>
      </div>
    </section>
  );
}
