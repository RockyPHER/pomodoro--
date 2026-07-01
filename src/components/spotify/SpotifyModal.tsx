import { useState } from 'react';
import { X } from 'lucide-react';
import AppDialog from '../layout/AppDialog';
import SpotifyLogin from './SpotifyLogin';
import SpotifyControls from './SpotifyControls';
import SpotifyPlaylistPicker from './SpotifyPlaylistPicker';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useSpotifyPlayer } from '../../hooks/useSpotifyPlayer';

interface SpotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotifyModal({ isOpen, onClose }: SpotifyModalProps) {
  const auth = useSpotifyAuth();
  const player = useSpotifyPlayer(auth.accessToken);
  const [volume, setVolume] = useState(0.5);

  const currentTrack = player.playerState?.current_track;
  const albumArt = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || 'No track playing';
  const artistName = currentTrack?.artists?.[0]?.name || '';

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    player.setVolume(newVolume);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AppDialog open={isOpen} onClose={onClose} title="Spotify Player">
      <div className="space-y-6 p-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Spotify</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-fg-muted transition-all hover:border-fg/20 hover:bg-white/5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Login section */}
        <SpotifyLogin onClose={onClose} />

        {auth.isAuthenticated && (
          <>
            {/* Now playing */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Now Playing</h3>

              {albumArt && (
                <div className="flex justify-center">
                  <img
                    src={albumArt}
                    alt={trackName}
                    className="h-48 w-48 rounded-xl object-cover shadow-lg"
                  />
                </div>
              )}

              <div className="text-center">
                <p className="text-sm font-medium text-fg line-clamp-2">{trackName}</p>
                <p className="text-xs text-fg-soft">{artistName}</p>
              </div>
            </div>

            {/* Controls */}
            <SpotifyControls
              isPlaying={player.isPlaying}
              onPlay={player.play}
              onPause={player.pause}
              onNext={player.nextTrack}
              onPrev={player.prevTrack}
              onVolumeChange={handleVolumeChange}
              volume={volume}
              isReady={player.isReady}
            />

            {/* Playlist picker */}
            <SpotifyPlaylistPicker
              accessToken={auth.accessToken}
              deviceId={player.deviceId}
              onPlaylistSelected={onClose}
            />
          </>
        )}

        {auth.error && (
          <div className="rounded border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
            {auth.error}
          </div>
        )}
      </div>
    </AppDialog>
  );
}
