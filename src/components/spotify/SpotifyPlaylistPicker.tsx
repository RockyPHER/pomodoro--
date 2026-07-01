import { useEffect, useState } from 'react';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';
import { SpotifyPlaylist } from '../../lib/spotify';
import { Music } from 'lucide-react';

interface SpotifyPlaylistPickerProps {
  accessToken: string | null;
  deviceId: string | null;
  onPlaylistSelected?: () => void;
}

export default function SpotifyPlaylistPicker({
  accessToken,
  deviceId,
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
        const data = await api.getUserPlaylists(20);
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
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-fg">Your Playlists</h3>

      {error && (
        <div className="rounded border border-danger/30 bg-danger/10 p-2 text-xs text-danger">{error}</div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-white/5" />
          ))}
        </div>
      )}

      {!isLoading && playlists.length === 0 && (
        <div className="rounded border border-border bg-white/2 p-4 text-center">
          <Music className="mx-auto h-6 w-6 text-fg-muted" />
          <p className="mt-2 text-xs text-fg-muted">No playlists found</p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handlePlayPlaylist(playlist)}
            disabled={!deviceId}
            className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-white/3 p-2 transition-all hover:border-accent/50 hover:bg-white/5 active:scale-95 disabled:opacity-50"
          >
            {playlist.images?.[0]?.url && (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="h-10 w-10 rounded object-cover"
              />
            )}
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-fg">{playlist.name}</p>
              <p className="text-xs text-fg-muted">
                {playlist.tracks.total} {playlist.tracks.total === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
