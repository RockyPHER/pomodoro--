import { Check } from "lucide-react";
import AppDialog from "./AppDialog";
import { AppTheme, THEMES } from "../../theme/themes";
import { useTheme } from "../../theme/context";
import { useI18n } from "../../i18n/context";
import { cn } from "../../lib/cn";

const PREVIEW_COLORS: Record<AppTheme, [string, string]> = {
  "cozy-rain": ["#0b1118", "#1db954"],
  "warm-cafe": ["#1a120c", "#e0954f"],
  "minimal-light": ["#101112", "#8fa8c9"],
  "performance-sport": ["#120b0b", "#ff5a3c"],
};

interface ThemesDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ThemesDialog({ open, onClose }: ThemesDialogProps) {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <AppDialog open={open} onClose={onClose} title={t("themes.title")}>
      <div className="flex flex-col gap-1.5">
        {THEMES.map((meta) => {
          const [bg, accent] = PREVIEW_COLORS[meta.id];
          const active = theme === meta.id;
          return (
            <button
              key={meta.id}
              disabled={!meta.available}
              onClick={() => {
                setTheme(meta.id);
                onClose();
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-40",
                active ? "bg-accent-dim text-accent" : "text-fg-soft hover:bg-white/6 hover:text-fg",
              )}
            >
              <span
                className="h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10"
                style={{ background: bg }}
              >
                <span className="block h-full w-full" style={{ background: `radial-gradient(circle at 65% 35%, ${accent}, transparent 60%)` }} />
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{meta.label}</span>
              {!meta.available && (
                <span className="shrink-0 text-xs text-fg-muted">{t("themes.comingSoon")}</span>
              )}
              {active && <Check className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>
    </AppDialog>
  );
}
