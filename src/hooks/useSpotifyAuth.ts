import { useEffect, useState, useCallback } from 'react';
import {
  getStoredTokens,
  saveTokens,
  clearTokens,
  exchangeCodeForToken,
  refreshAccessToken,
  getAuthorizationUrl,
} from '../lib/spotify';

interface UseSpotifyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export function useSpotifyAuth() {
  const [state, setState] = useState<UseSpotifyAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    accessToken: null,
    refreshToken: null,
  });

  // Check for callback on mount
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
          window.history.replaceState({}, '', '/');
        } catch (err) {
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Unknown error',
            isLoading: false,
          }));
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

  const login = useCallback(() => {
    window.location.href = getAuthorizationUrl();
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

  const refreshToken = useCallback(async () => {
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

  return {
    ...state,
    login,
    logout,
    refreshToken,
  };
}
