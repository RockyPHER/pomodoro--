function playTone(
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  gainPeak: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startAt);

  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  osc.start(startAt);
  osc.stop(startAt + duration);
}

export function playTimerEndSound() {
  const ctx = new AudioContext();

  // Three ascending tones: a simple "done" chime
  playTone(ctx, 523.25, ctx.currentTime + 0.0, 0.4, 0.4); // C5
  playTone(ctx, 659.25, ctx.currentTime + 0.25, 0.4, 0.4); // E5
  playTone(ctx, 783.99, ctx.currentTime + 0.5, 0.6, 0.4); // G5

  // Auto-close the context after the sound finishes
  setTimeout(() => ctx.close(), 1500);
}
