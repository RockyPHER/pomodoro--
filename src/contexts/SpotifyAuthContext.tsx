import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  getStoredTokens,
  saveTokens,
  clearTokens,
  exchangeCodeForToken,
  refreshAccessToken,
  getAuthorizationUrl,
  SPOTIFY_TOKENS_KEY,
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

const POPUP_FEATURES = (() => {
  const width = 480;
  const height = 720;
  if (typeof window === 'undefined') return `width=${width},height=${height}`;
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  return `width=${width},height=${height},left=${left},top=${top}`;
})();

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
  //
  // Login opens Spotify's consent screen in a popup rather than navigating
  // the whole app away. The popup is just another instance of this same
  // app, so it runs this exact effect too: it exchanges the code, saves
  // the tokens, and — since `window.opener` is only set on windows opened
  // via `window.open` — closes itself. The original window picks up the
  // new tokens via the `storage` listener below, which fires there because
  // *another* window wrote to localStorage.
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
          if (window.opener) {
            window.close();
            return;
          }
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

  // Picks up tokens written by the popup once it closes — `storage` only
  // fires in *other* same-origin windows, never the one that wrote the key.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== SPOTIFY_TOKENS_KEY) return;
      const stored = getStoredTokens();
      if (stored) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken || null,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        }));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async () => {
    const url = await getAuthorizationUrl();
    const popup = window.open(url, 'spotify-login', POPUP_FEATURES);
    if (!popup) {
      setState((prev) => ({ ...prev, error: 'popup-blocked' }));
    }
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
