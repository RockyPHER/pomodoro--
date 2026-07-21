import { Plus } from "lucide-react";
import { ITask } from "../../models/task";
import { SessionStatus } from "../../lib/sessionStatus";
import CurrentTask from "./CurrentTask";
import SessionTimer from "./SessionTimer";
import SessionControls from "./SessionControls";
import NextTaskPreview from "./NextTaskPreview";
import Button from "../layout/Button";
import { useI18n } from "../../i18n/context";

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
  const { t } = useI18n();

  if (status === "idle" && !hasAnyTasks) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-normal text-fg sm:text-4xl">
          {t("focus.emptyTitle")}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-fg-soft">
          {t("focus.emptySubtitle")}
        </p>
        <Button onClick={props.onAddFirstTask} className="mt-6 rounded-full px-5 py-3">
          <Plus className="h-4 w-4" />
          {t("focus.addFirstTask")}
        </Button>
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
