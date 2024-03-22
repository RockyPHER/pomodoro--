import "./style.css";
import { Play } from "lucide-react";
import { handleStartTimer } from "./scripts";

export default function Clock() {
  return (
    <section>
      <span></span>
      <button onClick={() => handleStartTimer()}>
        <Play />
      </button>
    </section>
  );
}
