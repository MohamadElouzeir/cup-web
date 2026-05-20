import { FC } from "react";

const CedarMark: FC<{ size?: number; className?: string }> = ({ size = 28, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M32 6 L42 18 L36 18 L46 30 L38 30 L50 44 L36 44 L36 52 L28 52 L28 44 L14 44 L26 30 L18 30 L28 18 L22 18 Z"
      fill="currentColor"
    />
  </svg>
);

export default CedarMark;
