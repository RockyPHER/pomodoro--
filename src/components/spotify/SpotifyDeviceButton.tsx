import { useEffect, useRef, useState } from 'react';
import { Laptop2, Smartphone, Speaker, Monitor } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';
import { SpotifyDevice } from '../../lib/spotify';
import { useI18n } from '../../i18n/context';

interface SpotifyDeviceButtonProps {
  accessToken: string | null;
  activeDeviceId: string | null;
  onDeviceSelected?: () => void;
}

function deviceIcon(type: string) {
  const t = type.toLowerCase();
  if (t === 'smartphone') return Smartphone;
  if (t === 'computer') return Laptop2;
  if (t === 'speaker') return Speaker;
  return Monitor;
}

export default function SpotifyDeviceButton({
  accessToken,
  activeDeviceId,
  onDeviceSelected,
}: SpotifyDeviceButtonProps) {
  const { t } = useI18n();
  const api = useSpotifyApi(accessToken);
  const [open, setOpen] = useState(false);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    api
      .getDevices()
      .then(setDevices)
      .catch(() => setDevices([]))
      .finally(() => setIsLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [open]);

  const selectDevice = async (deviceId: string) => {
    if (deviceId === activeDeviceId) {
      setOpen(false);
      return;
    }
    try {
      await api.transferPlayback(deviceId);
      onDeviceSelected?.();
    } catch {
      // ignore — device list will just show the previous active device
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/6 hover:text-fg"
        aria-label={t('spotify.chooseDevice')}
        title={t('spotify.devices')}
      >
        <Laptop2 className="h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl bg-[#141c28] p-1.5 shadow-2xl"
          >
            <p className="px-2.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-fg-muted">
              {t('spotify.devices')}
            </p>
            {isLoading && <div className="px-2.5 py-2 text-xs text-fg-muted">{t('spotify.loadingDevices')}</div>}
            {!isLoading && devices.length === 0 && (
              <div className="px-2.5 py-2 text-xs text-fg-muted">{t('spotify.noDevices')}</div>
            )}
            {!isLoading &&
              devices.map((device) => {
                const Icon = deviceIcon(device.type);
                const isActive = device.id === activeDeviceId;
                return (
                  <button
                    key={device.id}
                    onClick={() => selectDevice(device.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/6"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-fg-muted" />
                    <span className="min-w-0 flex-1 truncate text-fg-soft">{device.name}</span>
                    {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1DB954]" />}
                  </button>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
