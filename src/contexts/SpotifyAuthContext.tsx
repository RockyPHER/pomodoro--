import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  getStoredTokens,
  saveTokens,
  clearTokens,
  exchangeCodeForToken,
  refreshAccessToken,
  getAuthorizationUrl,
} from '../lib/spotify';

interface SpotifyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

type SpotifyAuthContextValue = Omit<SpotifyAuthState, 'refreshToken'> & {
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<string>;
};

const SpotifyAuthContext = createContext<SpotifyAuthContextValue | null>(null);

export function SpotifyAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpotifyAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    accessToken: null,
    refreshToken: null,
  });

  // Check for callback on mount. This provider is mounted once for the
  // whole app, so the auth code (single-use) only ever gets exchanged once
  // — previously every component calling this hook ran its own copy of
  // this effect and raced to exchange the same code, causing a 400 from
  // Spotify on all but the first request.
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setState((prev) => ({
          ...prev,
          error: `Authentication failed: ${error}`,
          isLoading: false,
        }));
        window.history.replaceState({}, '', '/');
        return;
      }

      if (code) {
        try {
          const tokens = await exchangeCodeForToken(code);
          saveTokens(tokens);
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || null,
            error: null,
            isLoading: false,
          }));
        } catch (err) {
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Unknown error',
            isLoading: false,
          }));
        } finally {
          window.history.replaceState({}, '', '/');
        }
        return;
      }

      // No callback, check stored tokens
      const storedTokens = getStoredTokens();
      if (storedTokens) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: storedTokens.accessToken,
          refreshToken: storedTokens.refreshToken || null,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    handleCallback();
  }, []);

  const login = useCallback(async () => {
    window.location.href = await getAuthorizationUrl();
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
    });
  }, []);

  const refreshTokenFn = useCallback(async () => {
    if (!state.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const tokens = await refreshAccessToken(state.refreshToken);
      saveTokens(tokens);
      setState((prev) => ({
        ...prev,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || prev.refreshToken,
        error: null,
      }));
      return tokens.accessToken;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
      throw err;
    }
  }, [state.refreshToken]);

  return (
    <SpotifyAuthContext.Provider value={{ ...state, login, logout, refreshToken: refreshTokenFn }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
}

export function useSpotifyAuth() {
  const ctx = useContext(SpotifyAuthContext);
  if (!ctx) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return ctx;
}
