import { useState } from "react";
import { Keyboard, Languages, Palette } from "lucide-react";
import { SiSpotify } from "react-icons/si";
import IconButton from "./IconButton";
import ThemesDialog from "./ThemesDialog";
import SettingsMenu from "../settings/SettingsMenu";
import { PresetTaskDraft } from "../../models/planPreset";
import { useI18n } from "../../i18n/context";
import { LOCALES } from "../../i18n/translations";

interface TopbarProps {
  spotifyOpen: boolean;
  onToggleSpotify: () => void;
  onOpenShortcuts: () => void;
  onApplyPreset: (tasks: PresetTaskDraft[]) => void;
}

export default function Topbar({
  spotifyOpen,
  onToggleSpotify,
  onOpenShortcuts,
  onApplyPreset,
}: TopbarProps) {
  const { t, locale, setLocale } = useI18n();
  const [themesOpen, setThemesOpen] = useState(false);

  const cycleLocale = () => {
    const idx = LOCALES.findIndex((l) => l.id === locale);
    setLocale(LOCALES[(idx + 1) % LOCALES.length].id);
  };

  return (
    <header className="glass relative z-40 flex h-14 shrink-0 items-center justify-between rounded-none px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <SettingsMenu onApplyPreset={onApplyPreset} />
        <span className="select-none px-1 text-sm font-semibold tracking-[0.18em] text-fg">
          {t("topbar.title")}
          <span className="text-accent">++</span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <IconButton label={t("topbar.language")} onClick={cycleLocale}>
          <Languages className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <IconButton label={t("topbar.themes")} onClick={() => setThemesOpen(true)}>
          <Palette className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <IconButton label={t("topbar.shortcuts")} onClick={onOpenShortcuts}>
          <Keyboard className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
        <IconButton
          label={spotifyOpen ? t("topbar.spotify.hide") : t("topbar.spotify.show")}
          active={spotifyOpen}
          onClick={onToggleSpotify}
        >
          <SiSpotify className="h-[1.15rem] w-[1.15rem]" />
        </IconButton>
      </div>

      <ThemesDialog open={themesOpen} onClose={() => setThemesOpen(false)} />
    </header>
  );
}
