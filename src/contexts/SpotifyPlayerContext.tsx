import { createContext, useContext, ReactNode } from 'react';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';
import { useSpotifyAuth } from './SpotifyAuthContext';

type SpotifyPlayerValue = ReturnType<typeof useSpotifyPlayer>;

const SpotifyPlayerContext = createContext<SpotifyPlayerValue | null>(null);

export function SpotifyPlayerProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useSpotifyAuth();
  // Called once for the whole app so a single Web Playback SDK device is
  // registered and every consumer shares the same playback state. Previously
  // each component ran its own copy, registering duplicate "pomodoro++"
  // devices whose states never matched.
  const player = useSpotifyPlayer(accessToken);

  return (
    <SpotifyPlayerContext.Provider value={player}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
}

export function useSpotifyPlayerContext() {
  const ctx = useContext(SpotifyPlayerContext);
  if (!ctx) {
    throw new Error('useSpotifyPlayerContext must be used within a SpotifyPlayerProvider');
  }
  return ctx;
}
