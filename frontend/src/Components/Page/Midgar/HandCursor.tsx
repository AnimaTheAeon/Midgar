import React from 'react';

interface HandCursorProps {
  className?: string;
}

// The FFVII white-glove pointer (same drawing as Lifestream and Jenova).
function HandCursor({ className }: HandCursorProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 20"
      width="30"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="2"
        y="8"
        width="22"
        height="11"
        rx="4"
        fill="#000"
        fillOpacity=".35"
      />
      <rect
        x="1"
        y="5"
        width="6"
        height="11"
        rx="2"
        fill="#c4c8d6"
        stroke="#1e1e28"
        strokeWidth="1.2"
      />
      <rect
        x="6"
        y="4"
        width="12"
        height="13"
        rx="4"
        fill="#fafafc"
        stroke="#1e1e28"
        strokeWidth="1.2"
      />
      <rect
        x="14"
        y="4"
        width="15"
        height="5"
        rx="2.5"
        fill="#fafafc"
        stroke="#1e1e28"
        strokeWidth="1.2"
      />
      <path d="M9 10h7M9 13h7" stroke="#c4c8d6" strokeWidth="1" />
    </svg>
  );
}

export default HandCursor;
