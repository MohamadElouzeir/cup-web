import { FC } from "react";

interface Props {
  size?: number;
  className?: string;
  tagline?: boolean;
  animated?: boolean;
  color?: string;
}

/**
 * Cup S wordmark: "cup" letters + stylized robotic-arm "S".
 */
const CupSLogo: FC<Props> = ({
  size = 200,
  className = "",
  tagline = false,
  animated = false,
  color = "currentColor",
}) => {
  const tagH = tagline ? 24 : 0;
  const vbH = 80 + tagH;
  return (
    <svg
      width={size}
      height={size * (vbH / 200)}
      viewBox={`0 0 200 ${vbH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cup S logo"
    >
      <style>{`
        .cl { fill: ${color}; }
        .ra-seg { fill: none; stroke: ${color}; stroke-linecap: round; stroke-width: 6; }
        .ra-jt { fill: ${color}; }
        ${
          animated
            ? `@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
              .arm-grp { transform-origin: 145px 38px; animation: bob 4s ease-in-out infinite; }`
            : ""
        }
      `}</style>
      {/* c */}
      <text x="10" y="58" className="cl" fontSize="58" fontFamily="Playfair Display, serif" fontWeight="800">
        c
      </text>
      {/* u */}
      <text x="50" y="58" className="cl" fontSize="58" fontFamily="Playfair Display, serif" fontWeight="800">
        u
      </text>
      {/* p */}
      <text x="92" y="58" className="cl" fontSize="58" fontFamily="Playfair Display, serif" fontWeight="800">
        p
      </text>
      {/* robotic S */}
      <g className="arm-grp">
        <path
          d="M155 18 C 168 18, 172 30, 162 38 C 152 46, 138 44, 138 56 C 138 66, 152 68, 162 62"
          className="ra-seg"
        />
        <circle cx="155" cy="18" r="4" className="ra-jt" />
        <circle cx="138" cy="56" r="4" className="ra-jt" />
        <circle cx="162" cy="62" r="3.5" className="ra-jt" />
        <line x1="162" y1="62" x2="170" y2="66" className="ra-seg" />
        <line x1="170" y1="66" x2="172" y2="58" className="ra-seg" />
      </g>
      {tagline && (
        <text
          x="100"
          y="96"
          textAnchor="middle"
          className="cl"
          fontSize="9"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          letterSpacing="3"
          opacity="0.7"
        >
          BREWED FOR TASTE
        </text>
      )}
    </svg>
  );
};

export default CupSLogo;
