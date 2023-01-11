import * as React from 'react';

function SvgIconToolShape({ isSelected }: { isSelected: boolean | undefined }) {
  return (
    <svg
      width="58"
      height="41"
      viewBox="0 0 58 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.213623"
        y="0.00195312"
        width="57.5536"
        height="40.54"
        rx="8.8456"
        fill={isSelected ? '#D6E6FD' : 'white'}
      />
      <rect
        x="10.2136"
        y="19.7715"
        width="21"
        height="3"
        rx="1.5"
        fill={isSelected ? '#3083F7' : '#94969A'}
      />
      <path
        d="M41.3093 17.001L44.9783 20.662L48.6473 17.001L49.7744 18.1281L44.9783 22.9242L40.1822 18.1281L41.3093 17.001Z"
        fill={isSelected ? '#3083F7' : '#D2D3D4'}
      />
    </svg>
  );
}

export default SvgIconToolShape;
