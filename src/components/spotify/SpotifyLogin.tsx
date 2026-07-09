import { useSpotifyAuth } from '../../contexts/SpotifyAuthContext';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import SpotifyLogo from './SpotifyLogo';

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
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/4 px-6 py-8 text-center">
        <SpotifyLogo className="h-8 w-8" />
        <div>
          <h3 className="text-base font-semibold text-fg">Connect Spotify</h3>
          <p className="mt-1 text-xs text-fg-muted">Play music while you focus</p>
        </div>
        <motion.button
          onClick={auth.login}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="rounded-full bg-[#1DB954] px-5 py-2.5 text-sm font-medium text-[#04150a] shadow-[0_8px_20px_rgba(29,185,84,0.3)]"
        >
          Login with Spotify
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/4 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {user?.images?.[0]?.url ? (
          <img src={user.images[0].url} alt={user.display_name} className="h-10 w-10 shrink-0 rounded-full" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/6 text-sm font-medium text-fg-soft">
            {user?.display_name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg">{user?.display_name || 'Spotify User'}</p>
          <span className="mt-0.5 inline-flex items-center rounded-full bg-[#1DB954]/15 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-[#1DB954]">
            Premium
          </span>
        </div>
      </div>
      <motion.button
        onClick={() => {
          auth.logout();
          onClose?.();
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-danger/10 hover:text-danger"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
