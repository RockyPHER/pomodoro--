import { ITask } from "../../models/task";
import { formatTime } from "../../scripts/timeFormat";
import { useI18n } from "../../i18n/context";

export default function NextTaskPreview({ next }: { next: ITask | undefined }) {
  const { t } = useI18n();
  if (!next) {
    return <p className="text-xs text-fg-muted">{t("next.none")}</p>;
  }
  const [mm, ss] = formatTime(next.duration);
  return (
    <p className="text-xs text-fg-muted">
      <span className="text-fg-soft">{t("next.label")}</span> {next.title || t("next.untitled")} ·{" "}
      {mm}:{ss}
    </p>
  );
}
