import { Play, Pause, ChevronUp, Music } from 'lucide-react';
import { useSpotifyAuth } from '../../contexts/SpotifyAuthContext';
import { useSpotifyPlayerContext } from '../../contexts/SpotifyPlayerContext';

interface SpotifyMiniPlayerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SpotifyMiniPlayer({ isOpen, onToggle }: SpotifyMiniPlayerProps) {
  const auth = useSpotifyAuth();
  const player = useSpotifyPlayerContext();

  if (!auth.isAuthenticated) {
    return null;
  }

  const currentTrack = player.playerState?.current_track;
  const albumArt = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || 'Not playing';
  const artistName = currentTrack?.artists?.map((a) => a.name).join(', ') || 'Spotify';
  const pct = player.duration ? Math.min((player.progress / player.duration) * 100, 100) : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-label="Open Spotify player"
      className="glass w-full shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all hover:bg-surface-hover"
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Album art or placeholder */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-accent to-accent-soft">
          {albumArt ? (
            <img src={albumArt} alt={trackName} className="h-full w-full object-cover" />
          ) : (
            <Music className="h-5 w-5 text-[#0c1020]" />
          )}
        </div>

        {/* Track info */}
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-fg">{trackName}</p>
          <p className="truncate text-xs text-fg-muted">{artistName}</p>
        </div>

        {/* Play/Pause button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            player.isPlaying ? player.pause() : player.play();
          }}
          disabled={!player.isReady}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent transition-all hover:bg-accent/30 active:scale-90 disabled:opacity-50"
          aria-label={player.isPlaying ? 'Pause' : 'Play'}
        >
          {player.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        {/* Expand indicator */}
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-fg-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-white/8">
        <div className="h-full bg-accent transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
