import { useCallback } from 'react';
import { SPOTIFY_API_URL, SpotifyUser, SpotifyPlaylist } from '../lib/spotify';

export function useSpotifyApi(accessToken: string | null) {
  const apiCall = useCallback(
    async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      if (!accessToken) throw new Error('No access token');

      const response = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    [accessToken],
  );

  const getCurrentUser = useCallback(async (): Promise<SpotifyUser> => {
    return apiCall('/me');
  }, [apiCall]);

  const getUserPlaylists = useCallback(async (limit = 20): Promise<SpotifyPlaylist[]> => {
    const response = (await apiCall(`/me/playlists?limit=${limit}`)) as { items: SpotifyPlaylist[] };
    return response.items;
  }, [apiCall]);

  const playPlaylist = useCallback(
    async (playlistUri: string, deviceId: string): Promise<void> => {
      await apiCall('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: playlistUri,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Set device if provided
      if (deviceId) {
        await apiCall('/me/player', {
          method: 'PUT',
          body: JSON.stringify({
            device_ids: [deviceId],
            play: true,
          }),
        });
      }
    },
    [apiCall],
  );

  const getCurrentPlayback = useCallback(async () => {
    return apiCall('/me/player/currently-playing');
  }, [apiCall]);

  return {
    getCurrentUser,
    getUserPlaylists,
    playPlaylist,
    getCurrentPlayback,
  };
}
