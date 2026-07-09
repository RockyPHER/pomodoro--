import { useEffect, useState, useCallback } from 'react';

interface SpotifyTrack {
  id: string;
  album: { images: Array<{ url: string }> };
  name: string;
  artists: Array<{ name: string }>;
}

// Shape of the object the Web Playback SDK actually passes to the
// 'player_state_changed' listener (Spotify.PlaybackState). Note the track
// lives under track_window.current_track, and playback state uses
// paused/position/duration — not is_playing/progress_ms/duration_ms.
interface SpotifyPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat_mode: 0 | 1 | 2;
  context: { uri: string | null };
  track_window: {
    current_track: SpotifyTrack;
  };
}

interface SpotifyPlayerState {
  current_track?: SpotifyTrack;
  is_playing: boolean;
  progress_ms: number;
  duration_ms: number;
}

type RepeatMode = 'off' | 'context' | 'track';

interface UseSpotifyPlayerState {
  playerState: SpotifyPlayerState | null;
  deviceId: string | null;
  isReady: boolean;
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  contextUri: string | null;
}

const REPEAT_MODES: RepeatMode[] = ['off', 'context', 'track'];

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: {
      Player: new (config: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume: number;
      }) => {
        addListener: (event: string, callback: (state: unknown) => void) => void;
        connect: () => Promise<boolean>;
        disconnect: () => void;
        getCurrentState: () => Promise<SpotifyPlaybackState | null>;
        setVolume: (volume: number) => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        nextTrack: () => Promise<void>;
        previousTrack: () => Promise<void>;
        seek: (positionMs: number) => Promise<void>;
      };
    };
  }
}

export function useSpotifyPlayer(accessToken: string | null) {
  const [state, setState] = useState<UseSpotifyPlayerState>({
    playerState: null,
    deviceId: null,
    isReady: false,
    isPlaying: false,
    shuffle: false,
    repeatMode: 'off',
    contextUri: null,
  });

  const [player, setPlayer] = useState<any>(null);

  // Load SDK script if not already loaded
  useEffect(() => {
    if (!accessToken) return;

    const scriptId = 'spotify-player-sdk';
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Don't remove script, keep it loaded for performance
    };
  }, [accessToken]);

  // Initialize player when SDK is ready
  useEffect(() => {
    if (!accessToken) return;

    const initPlayer = () => {
      if (!window.Spotify) return;

      const player = new window.Spotify.Player({
        name: 'pomodoro++',
        getOAuthToken: (callback) => {
          callback(accessToken);
        },
        volume: 0.5,
      });

      let deviceId = '';

      player.addListener('player_state_changed', (state: unknown) => {
        const raw = state as SpotifyPlaybackState | null;
        if (raw) {
          setState({
            playerState: {
              current_track: raw.track_window.current_track,
              is_playing: !raw.paused,
              progress_ms: raw.position,
              duration_ms: raw.duration,
            },
            deviceId,
            isReady: true,
            isPlaying: !raw.paused,
            shuffle: raw.shuffle,
            repeatMode: REPEAT_MODES[raw.repeat_mode] ?? 'off',
            contextUri: raw.context?.uri ?? null,
          });
        }
      });

      player.addListener('ready', (data: unknown) => {
        const { device_id } = data as { device_id: string };
        deviceId = device_id;
        setState((prev) => ({
          ...prev,
          deviceId,
          isReady: true,
        }));
      });

      player.addListener('not_ready', (data: unknown) => {
        const { device_id } = data as { device_id: string };
        setState((prev) => ({
          ...prev,
          deviceId: device_id,
          isReady: false,
        }));
      });

      player.addListener('initialization_error', (data: unknown) => {
        const { message } = data as { message: string };
        console.error('Initialization error:', message);
      });

      player.addListener('authentication_error', (data: unknown) => {
        const { message } = data as { message: string };
        console.error('Authentication error:', message);
      });

      player.addListener('account_error', (data: unknown) => {
        const { message } = data as { message: string };
        console.error('Account error:', message);
      });

      player.connect();
      setPlayer(player);
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const play = useCallback(async () => {
    if (player) {
      await player.resume();
    }
  }, [player]);

  const pause = useCallback(async () => {
    if (player) {
      await player.pause();
    }
  }, [player]);

  const nextTrack = useCallback(async () => {
    if (player) {
      await player.nextTrack();
    }
  }, [player]);

  const prevTrack = useCallback(async () => {
    if (player) {
      await player.previousTrack();
    }
  }, [player]);

  const setVolume = useCallback(async (volume: number) => {
    if (player) {
      await player.setVolume(volume);
    }
  }, [player]);

  const seek = useCallback(async (positionMs: number) => {
    if (player) {
      await player.seek(positionMs);
    }
  }, [player]);

  // Smoothly advance the reported progress between the SDK's state events,
  // which only fire on play/pause/seek/track changes — not every second.
  const [progress, setProgress] = useState(0);
  const duration = state.playerState?.duration_ms ?? 0;

  useEffect(() => {
    setProgress(state.playerState?.progress_ms ?? 0);
  }, [state.playerState?.progress_ms, state.playerState?.current_track?.name]);

  useEffect(() => {
    if (!state.isPlaying || !duration) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 1000, duration));
    }, 1000);
    return () => clearInterval(id);
  }, [state.isPlaying, duration]);

  return {
    ...state,
    player,
    progress,
    duration,
    play,
    pause,
    nextTrack,
    prevTrack,
    setVolume,
    seek,
  };
}
