import { useCallback } from 'react';
import { SPOTIFY_API_URL, SpotifyUser, SpotifyPlaylist, SpotifyDevice } from '../lib/spotify';

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

      // Several endpoints (e.g. PUT /me/player/play) return 204 No Content
      // on success — there's no body to parse.
      if (response.status === 204) {
        return undefined as T;
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
      // Target the SDK device explicitly. Without device_id Spotify plays on
      // the account's "active" device, which our just-created Web Playback SDK
      // device is not yet — that returns 404 (no active device). Passing
      // device_id activates and plays on it in a single call.
      const query = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : '';
      await apiCall(`/me/player/play${query}`, {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: playlistUri,
        }),
      });
    },
    [apiCall],
  );

  const getCurrentPlayback = useCallback(async () => {
    return apiCall('/me/player/currently-playing');
  }, [apiCall]);

  const setShuffle = useCallback(
    async (shuffle: boolean, deviceId?: string | null): Promise<void> => {
      const query = new URLSearchParams({ state: String(shuffle) });
      if (deviceId) query.set('device_id', deviceId);
      await apiCall(`/me/player/shuffle?${query}`, { method: 'PUT' });
    },
    [apiCall],
  );

  const setRepeatMode = useCallback(
    async (mode: 'off' | 'context' | 'track', deviceId?: string | null): Promise<void> => {
      const query = new URLSearchParams({ state: mode });
      if (deviceId) query.set('device_id', deviceId);
      await apiCall(`/me/player/repeat?${query}`, { method: 'PUT' });
    },
    [apiCall],
  );

  const getDevices = useCallback(async (): Promise<SpotifyDevice[]> => {
    const res = await apiCall<{ devices: SpotifyDevice[] }>('/me/player/devices');
    return res.devices;
  }, [apiCall]);

  const transferPlayback = useCallback(
    async (deviceId: string, play = true): Promise<void> => {
      await apiCall('/me/player', {
        method: 'PUT',
        body: JSON.stringify({ device_ids: [deviceId], play }),
      });
    },
    [apiCall],
  );

  return {
    getCurrentUser,
    getUserPlaylists,
    playPlaylist,
    getCurrentPlayback,
    setShuffle,
    setRepeatMode,
    getDevices,
    transferPlayback,
  };
}
