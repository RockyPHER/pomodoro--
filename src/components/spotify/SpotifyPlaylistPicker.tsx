import { useEffect, useState } from 'react';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';
import { SpotifyPlaylist } from '../../lib/spotify';
import { Music, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface SpotifyPlaylistPickerProps {
  accessToken: string | null;
  deviceId: string | null;
  activeContextUri: string | null;
  onPlaylistSelected?: () => void;
}

export default function SpotifyPlaylistPicker({
  accessToken,
  deviceId,
  activeContextUri,
  onPlaylistSelected,
}: SpotifyPlaylistPickerProps) {
  const api = useSpotifyApi(accessToken);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const loadPlaylists = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getUserPlaylists(30);
        setPlaylists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load playlists');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, [accessToken]);

  const handlePlayPlaylist = async (playlist: SpotifyPlaylist) => {
    if (!deviceId || !accessToken) return;

    try {
      await api.playPlaylist(playlist.uri, deviceId);
      onPlaylistSelected?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play playlist');
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-fg">Your Playlists</h3>
        {!isLoading && playlists.length > 0 && (
          <span className="text-xs text-fg-muted">{playlists.length}</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/4" />
          ))}
        </div>
      )}

      {!isLoading && playlists.length === 0 && (
        <div className="rounded-2xl bg-white/4 p-6 text-center">
          <Music className="mx-auto h-6 w-6 text-fg-muted" />
          <p className="mt-2 text-xs text-fg-muted">No playlists found</p>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {playlists.map((playlist) => {
          const isActive = !!activeContextUri && playlist.uri === activeContextUri;
          return (
            <motion.button
              key={playlist.id}
              onClick={() => handlePlayPlaylist(playlist)}
              disabled={!deviceId}
              title={`${playlist.name} · ${playlist.owner.display_name}`}
              whileHover={deviceId ? { y: -2 } : undefined}
              whileTap={deviceId ? { scale: 0.99 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="group relative flex h-16 shrink-0 items-center gap-3 overflow-hidden rounded-2xl pl-3 pr-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: isActive ? 'rgba(29,185,84,0.09)' : 'rgba(255,255,255,0.04)',
                boxShadow: isActive ? '0 0 0 1px rgba(29,185,84,0.25), 0 0 24px rgba(29,185,84,0.12)' : undefined,
              }}
            >
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#1DB954]" />
              )}
              <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[14px] bg-white/6">
                {playlist.images?.[0]?.url ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music className="h-5 w-5 text-fg-muted" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-4 w-4 text-fg" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium"
                  style={{ color: isActive ? '#1DB954' : 'var(--fg)' }}
                >
                  {playlist.name}
                </p>
                <p className="truncate text-xs text-fg-muted">
                  {playlist.tracks.total} {playlist.tracks.total === 1 ? 'song' : 'songs'} · {playlist.owner.display_name}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
