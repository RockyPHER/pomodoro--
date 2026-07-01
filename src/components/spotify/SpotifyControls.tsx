import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface SpotifyControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  isReady: boolean;
}

export default function SpotifyControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onVolumeChange,
  volume = 0.5,
  isReady,
}: SpotifyControlsProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-white/3 p-4">
      {/* Main controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrev}
          disabled={!isReady}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-fg transition-all hover:border-accent hover:text-accent disabled:opacity-50"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!isReady}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-soft text-[#0c1020] shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <button
          onClick={onNext}
          disabled={!isReady}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-fg transition-all hover:border-accent hover:text-accent disabled:opacity-50"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* Volume control */}
      {onVolumeChange && (
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-fg-muted" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="h-1 flex-1 cursor-pointer rounded-lg bg-border accent-accent"
            disabled={!isReady}
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}
