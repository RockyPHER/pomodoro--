export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = `${window.location.origin}/`;
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

export function generateCodeChallenge(codeVerifier: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  return btoa(String.fromCharCode.apply(null, Array.from(data)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateCodeVerifier(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let verifier = '';
  const randomValues = new Uint8Array(32);
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

export function getStoredTokens(): SpotifyTokens | null {
  const stored = localStorage.getItem('pomodoro:spotify:tokens');
  if (!stored) return null;
  return JSON.parse(stored);
}

export function saveTokens(tokens: SpotifyTokens): void {
  localStorage.setItem('pomodoro:spotify:tokens', JSON.stringify(tokens));
}

export function clearTokens(): void {
  localStorage.removeItem('pomodoro:spotify:tokens');
  localStorage.removeItem('pomodoro:spotify:code_verifier');
}

export async function exchangeCodeForToken(code: string): Promise<SpotifyTokens> {
  const codeVerifier = localStorage.getItem('pomodoro:spotify:code_verifier');
  if (!codeVerifier) throw new Error('Code verifier not found');

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
    throw new Error(`Failed to exchange code: ${response.statusText}`);
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

export function getAuthorizationUrl(): string {
  const codeVerifier = generateCodeVerifier();
  localStorage.setItem('pomodoro:spotify:code_verifier', codeVerifier);

  const codeChallenge = generateCodeChallenge(codeVerifier);

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
