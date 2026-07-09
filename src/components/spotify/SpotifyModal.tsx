import { useState } from 'react';
import { Music, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import AppDialog from '../layout/AppDialog';
import SpotifyLogin from './SpotifyLogin';
import SpotifyControls from './SpotifyControls';
import SpotifyPlaylistPicker from './SpotifyPlaylistPicker';
import { useSpotifyAuth } from '../../contexts/SpotifyAuthContext';
import { useSpotifyPlayerContext } from '../../contexts/SpotifyPlayerContext';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';

interface SpotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPEAT_SEQUENCE: Array<'off' | 'context' | 'track'> = ['off', 'context', 'track'];

export default function SpotifyModal({ isOpen, onClose }: SpotifyModalProps) {
  const auth = useSpotifyAuth();
  const player = useSpotifyPlayerContext();
  const api = useSpotifyApi(auth.accessToken);
  const [volume, setVolume] = useState(0.5);

  const currentTrack = player.playerState?.current_track;
  const albumArt = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || 'Nothing playing';
  const artistName = currentTrack?.artists?.map((a) => a.name).join(', ') || '';

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    player.setVolume(newVolume);
  };

  const handleToggleShuffle = () => {
    api.setShuffle(!player.shuffle, player.deviceId).catch(() => {});
  };

  const handleCycleRepeat = () => {
    const next = REPEAT_SEQUENCE[(REPEAT_SEQUENCE.indexOf(player.repeatMode) + 1) % REPEAT_SEQUENCE.length];
    api.setRepeatMode(next, player.deviceId).catch(() => {});
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AppDialog
      open={isOpen}
      onClose={onClose}
      title="Spotify"
      hideHeader
      disableGlass
      maxWidthClassName="max-w-5xl"
      panelClassName="rounded-[28px] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
    >
      <div
        className="relative flex flex-col overflow-hidden tall-row:h-[min(640px,85vh)] tall-row:flex-row"
        style={{ background: 'radial-gradient(120% 100% at 100% 0%, #101a26 0%, #0B1118 55%)' }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/8 hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>

        {!auth.isAuthenticated ? (
          <div className="flex w-full items-center justify-center p-12">
            <div className="w-full max-w-sm">
              <SpotifyLogin onClose={onClose} />
            </div>
          </div>
        ) : (
          <>
            {/* Left ~40%: now playing + controls */}
            <div className="flex min-h-0 flex-col gap-6 p-7 tall-row:w-[40%] md:p-9">
              <div className="relative flex flex-1 flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTrack?.id ?? 'empty'}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-[20px]"
                  >
                    {albumArt ? (
                      <motion.img
                        src={albumArt}
                        alt={trackName}
                        className="h-full w-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                        animate={
                          player.isPlaying
                            ? { scale: [1, 1.015, 1] }
                            : { scale: 1 }
                        }
                        transition={
                          player.isPlaying
                            ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: 0.4 }
                        }
                      />
                    ) : (
                      <div
                        className="relative flex h-full w-full items-center justify-center"
                        style={{
                          background:
                            'radial-gradient(60% 60% at 50% 40%, rgba(29,185,84,0.16) 0%, rgba(255,255,255,0.03) 70%)',
                        }}
                      >
                        <motion.div
                          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.06, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Music className="h-12 w-12 text-fg-muted" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentTrack?.id ?? 'empty'}-text`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="mt-5 text-center"
                  >
                    <p className="truncate text-[22px] font-semibold leading-tight text-fg" title={trackName}>
                      {trackName}
                    </p>
                    {artistName && (
                      <p className="mt-1 truncate text-sm text-fg-muted">{artistName}</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <SpotifyControls
                isPlaying={player.isPlaying}
                onPlay={player.play}
                onPause={player.pause}
                onNext={player.nextTrack}
                onPrev={player.prevTrack}
                onVolumeChange={handleVolumeChange}
                volume={volume}
                isReady={player.isReady}
                progress={player.progress}
                duration={player.duration}
                onSeek={player.seek}
                shuffle={player.shuffle}
                onToggleShuffle={handleToggleShuffle}
                repeatMode={player.repeatMode}
                onCycleRepeat={handleCycleRepeat}
                accessToken={auth.accessToken}
                deviceId={player.deviceId}
              />
            </div>

            {/* Right ~60%: profile + playlists */}
            <div className="flex min-h-0 flex-col gap-4 p-7 pt-16 tall-row:w-[60%] md:p-9 md:pl-5 md:pt-16">
              <SpotifyLogin onClose={onClose} />

              <div className="flex min-h-0 flex-1 flex-col md:h-full">
                <SpotifyPlaylistPicker
                  accessToken={auth.accessToken}
                  deviceId={player.deviceId}
                  activeContextUri={player.contextUri}
                  onPlaylistSelected={undefined}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </AppDialog>
  );
}
