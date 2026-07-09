import { useState } from 'react';
import { motion } from 'motion/react';

interface SpotifySliderProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  ariaLabel: string;
  /** Track height in px while idle. Expands slightly on hover. */
  trackHeight?: number;
}

export default function SpotifySlider({
  value,
  max,
  onChange,
  disabled,
  ariaLabel,
  trackHeight = 3,
}: SpotifySliderProps) {
  const [hover, setHover] = useState(false);
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const interactive = !disabled && !!onChange;

  return (
    <div
      className="group/slider relative flex w-full items-center py-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="relative w-full overflow-visible rounded-full bg-white/10"
        animate={{ height: hover && interactive ? trackHeight + 2 : trackHeight }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: interactive || pct > 0 ? '#1DB954' : 'rgba(255,255,255,0.3)',
          }}
        />
        <motion.div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.4)]"
          style={{ left: `calc(${pct}% - 6px)` }}
          initial={false}
          animate={{ scale: hover && interactive ? 1 : 0, opacity: hover && interactive ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
      <input
        type="range"
        min={0}
        max={max || 1}
        step={max > 1000 ? 1000 : 0.01}
        value={value}
        disabled={!interactive}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
      />
    </div>
  );
}
