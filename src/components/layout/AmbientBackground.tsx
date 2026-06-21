/**
 * Ambient environment behind the whole app.
 *
 * A local environment photo sits at the base (no external hotlink),
 * with CSS gradients layered on top for depth, atmosphere and text
 * legibility. The gradients also act as the fallback while the image
 * loads or if it is ever unavailable.
 */
const ENV_IMAGE: string | null = "/background.png";

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Optional environment photo, when provided */}
      {ENV_IMAGE && (
        <img
          src={ENV_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      )}

      {/* Soft cool light pooling from the top, like a rainy night sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(40, 56, 92, 0.55), transparent 60%)",
        }}
      />
      {/* Faint lavender glow toward the focus center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 42%, rgba(120, 110, 190, 0.16), transparent 70%)",
        }}
      />
      {/* Depth: lateral + bottom darkening so panels and text stay legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,10,18,0.55), rgba(4,10,18,0.12) 40%, rgba(4,10,18,0.12) 60%, rgba(4,10,18,0.45)), linear-gradient(180deg, rgba(4,10,18,0.10), rgba(4,10,18,0.55))",
        }}
      />
      {/* Very subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 130% at 50% 50%, transparent 62%, rgba(2,6,14,0.5))",
        }}
      />
    </div>
  );
}
