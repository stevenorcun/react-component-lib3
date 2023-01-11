import * as React from 'react';

function SvgIconArrowGridGraph({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      x={x}
      y={y}
    >
      <path
        d="M22.5671 22.2385H0.119385L22.5671 0.492188V22.2385Z"
        fill="#3083F7"
      />
    </svg>
  );
}

export default SvgIconArrowGridGraph;
