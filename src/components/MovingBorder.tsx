interface Props {
  /** Path to the border strip image (stretched to full width, like BoxFit.fill). */
  assetPath?: string;
  /** Strip height in px. Mirrors the Flutter `height` argument. */
  height?: number;
  /** Seconds for one full loop. Mirrors the AnimationController duration (12s). */
  durationSeconds?: number;
  className?: string;
}

/**
 * Port of the Flutter `_MovingPromoBottomBorder` widget.
 *
 * Flutter tiled two copies of the image (each stretched to the container width)
 * and slid them left→right by `animation.value * width`, looping forever. The
 * web equivalent is a 2-tile track translated from -100% → 0 with a CSS
 * keyframe — same seamless left→right scroll, no per-frame JS.
 */
const MovingBorder = ({
  assetPath = "/menu/moving_border.png",
  height = 46,
  durationSeconds = 12,
  className = "",
}: Props) => {
  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <div
        className="flex h-full w-[200%]"
        style={{ animation: `moving-border ${durationSeconds}s linear infinite` }}
      >
        {/* Two tiles, each exactly half the track (= one container width),
            stretched to fill like Flutter's BoxFit.fill. */}
        <img
          src={assetPath}
          alt=""
          draggable={false}
          className="h-full w-1/2 shrink-0 select-none"
          style={{ objectFit: "fill" }}
        />
        <img
          src={assetPath}
          alt=""
          draggable={false}
          className="h-full w-1/2 shrink-0 select-none"
          style={{ objectFit: "fill" }}
        />
      </div>
    </div>
  );
};

export default MovingBorder;
