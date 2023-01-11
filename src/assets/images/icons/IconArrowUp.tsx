import * as React from 'react';

function SvgIconArrowUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="lightgrey"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.71 4.79L5.71 0.79C5.53 0.61 5.28 0.5 5 0.5C4.72 0.5 4.47 0.61 4.29 0.79L0.29 4.79C0.11 4.97 0 5.22 0 5.5C0 6.05 0.45 6.5 1 6.5C1.28 6.5 1.53 6.39 1.71 6.21L5 2.91L8.29 6.2C8.47 6.39 8.72 6.5 9 6.5C9.55 6.5 10 6.05 10 5.5C10 5.22 9.89 4.97 9.71 4.79Z"
        fill={props.fill ? 'current' : '#D2D3D4'}
      />
    </svg>
  );
}

export default SvgIconArrowUp;
