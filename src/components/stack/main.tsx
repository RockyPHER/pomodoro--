import { Plus } from "lucide-react";
import "./style.css";

export default function Stack() {
  return (
    <section className="stack-container">
      <div className="stack-heading">
        <h1 className="stack-title">Title</h1>
      </div>
      <div className="stack-body">
        <button className="button-add-task">
          <Plus />
          Add new task
        </button>
      </div>
    </section>
  );
}
