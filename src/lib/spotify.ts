export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
export const SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-email',
];

export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateCodeVerifier(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let verifier = '';
  // RFC 7636 requires the code_verifier to be 43-128 characters long.
  const randomValues = new Uint8Array(64);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < randomValues.length; i++) {
    verifier += chars[randomValues[i] % chars.length];
  }
  return verifier;
}

export interface SpotifyTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  images?: Array<{ url: string }>;
  owner: { display_name: string };
  tracks: { total: number };
}

export interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  volume_percent: number | null;
}

export const SPOTIFY_TOKENS_KEY = 'pomodoro:spotify:tokens';

export function getStoredTokens(): SpotifyTokens | null {
  const stored = localStorage.getItem(SPOTIFY_TOKENS_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function saveTokens(tokens: SpotifyTokens): void {
  localStorage.setItem(SPOTIFY_TOKENS_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  localStorage.removeItem(SPOTIFY_TOKENS_KEY);
  localStorage.removeItem('pomodoro:spotify:code_verifier');
  sessionStorage.removeItem('pomodoro:spotify:code_verifier');
}

export async function exchangeCodeForToken(code: string): Promise<SpotifyTokens> {
  // Try sessionStorage first (survives redirects better), then localStorage
  let codeVerifier = sessionStorage.getItem('pomodoro:spotify:code_verifier');
  if (!codeVerifier) {
    codeVerifier = localStorage.getItem('pomodoro:spotify:code_verifier');
  }

  if (!codeVerifier) {
    console.error('Code verifier not found in storage');
    throw new Error('Code verifier not found. Please try logging in again.');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const reason = body?.error_description || body?.error || response.statusText;
    console.error('Spotify token exchange failed:', body);
    throw new Error(`Failed to exchange code: ${reason}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
}

export async function getAuthorizationUrl(): Promise<string> {
  const codeVerifier = generateCodeVerifier();
  // Store in sessionStorage (survives redirect better) and localStorage as backup
  sessionStorage.setItem('pomodoro:spotify:code_verifier', codeVerifier);
  localStorage.setItem('pomodoro:spotify:code_verifier', codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}
