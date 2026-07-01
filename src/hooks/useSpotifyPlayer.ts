import { useEffect, useState, useCallback } from 'react';

interface SpotifyPlayerState {
  current_track?: {
    album: { images: Array<{ url: string }> };
    name: string;
    artists: Array<{ name: string }>;
  };
  is_playing: boolean;
  progress_ms: number;
  duration_ms: number;
}

interface UseSpotifyPlayerState {
  playerState: SpotifyPlayerState | null;
  deviceId: string | null;
  isReady: boolean;
  isPlaying: boolean;
}

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
        getCurrentState: () => Promise<SpotifyPlayerState | null>;
        setVolume: (volume: number) => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        nextTrack: () => Promise<void>;
        previousTrack: () => Promise<void>;
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
        const playerState = state as SpotifyPlayerState | null;
        if (playerState) {
          setState({
            playerState,
            deviceId,
            isReady: true,
            isPlaying: playerState.is_playing,
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

  return {
    ...state,
    player,
    play,
    pause,
    nextTrack,
    prevTrack,
    setVolume,
  };
}
