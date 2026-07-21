import AppDialog from "./AppDialog";
import { useI18n } from "../../i18n/context";

export default function ShortcutsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();

  const SHORTCUTS: [string, string][] = [
    ["Space", t("shortcuts.startPause")],
    ["Enter", t("shortcuts.completeTask")],
    ["N", t("shortcuts.addTask")],
    ["T", t("shortcuts.togglePlan")],
    ["Q", t("shortcuts.toggleQueue")],
    ["Esc", t("shortcuts.close")],
  ];

  return (
    <AppDialog open={open} title={t("shortcuts.title")} onClose={onClose}>
      <ul className="flex flex-col gap-3">
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
