import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';

interface SpotifyLoginProps {
  onClose?: () => void;
}

export default function SpotifyLogin({ onClose }: SpotifyLoginProps) {
  const auth = useSpotifyAuth();
  const api = useSpotifyApi(auth.accessToken);
  const [user, setUser] = useState<{ display_name: string; images?: Array<{ url: string }> } | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken) {
      api.getCurrentUser().then(setUser).catch(console.error);
    }
  }, [auth.isAuthenticated, auth.accessToken]);

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-white/3 p-6">
        <div className="text-3xl">🎵</div>
        <div className="text-center">
          <h3 className="font-medium text-fg">Connect Spotify</h3>
          <p className="text-xs text-fg-muted">Play music while you focus</p>
        </div>
        <button
          onClick={auth.login}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1DB954] px-4 py-2.5 font-medium text-[#0c1020] transition-all hover:bg-[#1ed760] active:scale-95"
        >
          Login with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-white/3 p-4">
      <div className="flex items-center gap-3">
        {user?.images?.[0]?.url && (
          <img src={user.images[0].url} alt={user.display_name} className="h-10 w-10 rounded-full" />
        )}
        <div>
          <p className="text-sm font-medium text-fg">{user?.display_name || 'Spotify User'}</p>
          <p className="text-xs text-fg-muted">Premium Account</p>
        </div>
      </div>
      <button
        onClick={() => {
          auth.logout();
          onClose?.();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-fg-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
