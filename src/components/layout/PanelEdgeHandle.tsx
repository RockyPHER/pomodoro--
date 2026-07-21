import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "./IconButton";
import { cn } from "../../lib/cn";

interface PanelEdgeHandleProps {
  side: "left" | "right";
  open: boolean;
  onToggle: () => void;
  label: string;
}

/**
 * The same square IconButton used everywhere else in the app (transparent
 * until hover, rounded-lg, 32px) — not a custom tab shape — docked to the
 * panel's own edge (the one facing the center stage) near its header. It
 * lives just outside the panel's collapsing/overflow-hidden box (a sibling
 * in the same relative anchor) so it keeps tracking that edge as the
 * panel's width animates to 0, ending up flush against the content when
 * closed.
 *
 * On mobile the panel is a full off-canvas drawer (slides via transform,
 * doesn't resize), so the handle stays pinned to the true screen edge
 * there instead of tracking the drawer.
 */
export default function PanelEdgeHandle({ side, open, onToggle, label }: PanelEdgeHandleProps) {
  const pointsIn = side === "left" ? open : !open;
  const Icon = pointsIn ? ChevronLeft : ChevronRight;

  return (
    <IconButton
      label={label}
      active={open}
      onClick={onToggle}
      className={cn(
        "fixed z-40 h-8 w-8",
        "top-12 lg:top-14 lg:absolute",
        side === "left" ? "left-1 lg:left-full lg:right-auto" : "right-1 lg:right-full lg:left-auto",
      )}
    >
      <Icon className="h-4 w-4" />
    </IconButton>
  );
}
