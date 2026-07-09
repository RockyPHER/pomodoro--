import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { motion } from 'motion/react';
import SpotifySlider from './SpotifySlider';
import SpotifyDeviceButton from './SpotifyDeviceButton';

type RepeatMode = 'off' | 'context' | 'track';

interface SpotifyControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  isReady: boolean;
  progress?: number;
  duration?: number;
  onSeek?: (positionMs: number) => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onCycleRepeat: () => void;
  accessToken: string | null;
  deviceId: string | null;
  onDeviceSelected?: () => void;
}

function formatMs(ms: number): string {
  if (!ms || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const springy = { type: 'spring' as const, stiffness: 400, damping: 20 };

export default function SpotifyControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onVolumeChange,
  volume = 0.5,
  isReady,
  progress = 0,
  duration = 0,
  onSeek,
  shuffle,
  onToggleShuffle,
  repeatMode,
  onCycleRepeat,
  accessToken,
  deviceId,
  onDeviceSelected,
}: SpotifyControlsProps) {
  const RepeatIcon = repeatMode === 'track' ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== 'off';

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1">
        <SpotifySlider
          value={Math.min(progress, duration || 0)}
          max={duration || 1}
          onChange={isReady ? onSeek : undefined}
          ariaLabel="Seek"
        />
        <div className="flex justify-between text-[0.7rem] tabular-nums text-fg-muted">
          <span>{formatMs(progress)}</span>
          <span>{formatMs(duration)}</span>
        </div>
      </div>

      {/* Main transport row */}
      <div className="flex items-center justify-center gap-3">
        <motion.button
          onClick={onToggleShuffle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springy}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ color: shuffle ? '#1DB954' : 'var(--fg-muted)' }}
          aria-label="Toggle shuffle"
          aria-pressed={shuffle}
        >
          <Shuffle className="h-4 w-4" />
        </motion.button>

        <motion.button
          onClick={onPrev}
          disabled={!isReady}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springy}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/4 text-fg transition-colors hover:bg-white/8 disabled:opacity-40"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" />
        </motion.button>

        <motion.button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!isReady}
          whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(29,185,84,0.45)' }}
          whileTap={{ scale: 0.93 }}
          transition={springy}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] text-[#04150a] shadow-[0_8px_24px_rgba(29,185,84,0.35)] disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </motion.button>

        <motion.button
          onClick={onNext}
          disabled={!isReady}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springy}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/4 text-fg transition-colors hover:bg-white/8 disabled:opacity-40"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" />
        </motion.button>

        <motion.button
          onClick={onCycleRepeat}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={springy}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ color: repeatActive ? '#1DB954' : 'var(--fg-muted)' }}
          aria-label="Toggle repeat"
          aria-pressed={repeatActive}
        >
          <RepeatIcon className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Volume + device */}
      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 shrink-0 text-fg-muted" />
        <SpotifySlider
          value={volume}
          max={1}
          onChange={onVolumeChange}
          disabled={!isReady}
          ariaLabel="Volume"
        />
        <SpotifyDeviceButton
          accessToken={accessToken}
          activeDeviceId={deviceId}
          onDeviceSelected={onDeviceSelected}
        />
      </div>
    </div>
  );
}
