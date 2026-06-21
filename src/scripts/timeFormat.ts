export function formatTime(time: number | undefined): [string, string] {
  const t = time || 0;
  if (t < 0) throw new Error("invalid input. time is negative!");
  const pad = (n: number) => (n > 9 ? String(n) : "0" + n);
  return [pad(Math.floor(t / 60)), pad(t % 60)];
}
