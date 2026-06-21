import AppDialog from "./AppDialog";

const SHORTCUTS: [string, string][] = [
  ["Space", "Start / Pause"],
  ["Enter", "Complete current task"],
  ["N", "Add task"],
  ["T", "Toggle plan"],
  ["Q", "Toggle queue"],
  ["Esc", "Close panel or dialog"],
];

export default function ShortcutsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AppDialog open={open} title="Keyboard shortcuts" onClose={onClose}>
      <ul className="flex flex-col gap-2.5">
        {SHORTCUTS.map(([key, action]) => (
          <li
            key={key}
            className="flex items-center justify-between text-sm text-fg-soft"
          >
            <span>{action}</span>
            <kbd>{key}</kbd>
          </li>
        ))}
      </ul>
    </AppDialog>
  );
}
