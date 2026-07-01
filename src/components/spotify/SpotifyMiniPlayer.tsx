import { Play, Pause, ChevronUp } from 'lucide-react';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useSpotifyPlayer } from '../../hooks/useSpotifyPlayer';

interface SpotifyMiniPlayerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SpotifyMiniPlayer({ isOpen, onToggle }: SpotifyMiniPlayerProps) {
  const auth = useSpotifyAuth();
  const player = useSpotifyPlayer(auth.accessToken);

  if (!auth.isAuthenticated) {
    return null;
  }

  const currentTrack = player.playerState?.current_track;
  const albumArt = currentTrack?.album?.images?.[0]?.url;

  return (
    <button
      onClick={onToggle}
      className="glass fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5 shadow-lg transition-all hover:border-border-strong hover:bg-surface-hover active:scale-95"
    >
      {/* Album art or placeholder */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-soft">
        {albumArt ? (
          <img src={albumArt} alt={currentTrack?.name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <span className="text-lg">🎵</span>
        )}
      </div>

      {/* Track info */}
      <div className="hidden flex-1 min-w-0 text-left sm:block">
        <p className="truncate text-xs font-medium text-fg">{currentTrack?.name || 'Not playing'}</p>
        <p className="truncate text-[0.7rem] text-fg-muted">
          {currentTrack?.artists?.[0]?.name || 'Spotify'}
        </p>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          player.isPlaying ? player.pause() : player.play();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent transition-all hover:bg-accent/30 active:scale-90"
        aria-label={player.isPlaying ? 'Pause' : 'Play'}
      >
        {player.isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
      </button>

      {/* Expand indicator */}
      <ChevronUp className={`h-4 w-4 text-fg-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}
