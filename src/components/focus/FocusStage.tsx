import { Plus } from "lucide-react";
import { ITask } from "../../models/task";
import { SessionStatus } from "../../lib/sessionStatus";
import CurrentTask from "./CurrentTask";
import SessionTimer from "./SessionTimer";
import SessionControls from "./SessionControls";
import NextTaskPreview from "./NextTaskPreview";

interface FocusStageProps {
  status: SessionStatus;
  currentTask: ITask | undefined;
  nextTask: ITask | undefined;
  hasAnyTasks: boolean;
  canLoad: boolean;

  // timer
  time: number;
  totalDuration: number;
  isPlay: boolean;
  isReset: boolean;
  hasRunTasks: boolean;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;

  // actions
  onTaskConclude: () => void;
  start: () => void;
  pause: () => void;
  complete: () => void;
  reset: () => void;
  loadTasks: () => void;
  onAddFirstTask: () => void;
}

export default function FocusStage(props: FocusStageProps) {
  const { status, currentTask, nextTask, hasAnyTasks } = props;

  if (status === "idle" && !hasAnyTasks) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-normal text-fg">
          Plan your first focus session
        </h1>
        <p className="mt-2 max-w-sm text-sm text-fg-soft">
          Add a task, choose a duration and begin when you are ready.
        </p>
        <button
          onClick={props.onAddFirstTask}
          className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-b from-accent to-accent-soft px-5 py-3 text-sm font-medium text-[#0c1020] shadow-[0_6px_24px_var(--accent-glow)] transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          Add your first task
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
      <CurrentTask task={currentTask} status={status} />

      <SessionTimer
        time={props.time}
        totalDuration={props.totalDuration}
        isPlay={props.isPlay}
        isReset={props.isReset}
        hasRunTasks={props.hasRunTasks}
        status={status}
        currentTitle={currentTask?.title}
        setTime={props.setTime}
        setIsPlay={props.setIsPlay}
        setIsReset={props.setIsReset}
        onTaskConclude={props.onTaskConclude}
      />

      <div className="flex flex-col items-center gap-4">
        <SessionControls
          status={status}
          canLoad={props.canLoad}
          start={props.start}
          pause={props.pause}
          complete={props.complete}
          reset={props.reset}
          loadTasks={props.loadTasks}
        />
        {status !== "idle" && <NextTaskPreview next={nextTask} />}
      </div>
    </section>
  );
}
