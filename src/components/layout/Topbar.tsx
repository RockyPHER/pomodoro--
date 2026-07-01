import { Keyboard, Menu, Moon, PanelRight } from "lucide-react";
import { SiSpotify } from "react-icons/si";
import IconButton from "./IconButton";
import { useTheme } from "../../theme/context";

interface TopbarProps {
  planOpen: boolean;
  queueOpen: boolean;
  spotifyOpen: boolean;
  onTogglePlan: () => void;
  onToggleQueue: () => void;
  onToggleSpotify: () => void;
  onOpenShortcuts: () => void;
}

export default function Topbar({
  planOpen,
  queueOpen,
  spotifyOpen,
  onTogglePlan,
  onToggleQueue,
  onToggleSpotify,
  onOpenShortcuts,
}: TopbarProps) {
  const { cycleTheme } = useTheme();

  return (
    <header className="glass z-20 flex h-14 shrink-0 items-center justify-between rounded-none border-x-0 border-t-0 px-3 sm:px-4">
      <div className="flex items-center gap-1 sm:gap-2">
        <IconButton
          label={planOpen ? "Hide plan" : "Show plan"}
          active={planOpen}
          onClick={onTogglePlan}
        >
          <Menu className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <span className="select-none px-1 text-sm font-semibold tracking-[0.18em] text-fg">
          POMODORO<span className="text-accent">++</span>
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <IconButton label="Change theme" onClick={cycleTheme}>
          <Moon className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <IconButton label="Keyboard shortcuts" onClick={onOpenShortcuts}>
          <Keyboard className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <IconButton
          label={spotifyOpen ? "Hide Spotify" : "Show Spotify"}
          active={spotifyOpen}
          onClick={onToggleSpotify}
        >
          <SiSpotify className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <IconButton
          label={queueOpen ? "Hide queue" : "Show queue"}
          active={queueOpen}
          onClick={onToggleQueue}
        >
          <PanelRight className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
      </div>
    </header>
  );
}
