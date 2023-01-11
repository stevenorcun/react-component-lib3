import * as React from 'react';

function SvgIconArrowTopFull(props: any) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.7216 16.7493C19.5362 16.9165 19.3164 17 19.0625 17H5.93765C5.68358 17 5.46394 16.9165 5.27836 16.7493C5.09279 16.582 5.00008 16.3841 5.00008 16.1554C5.00008 15.9268 5.09279 15.7289 5.27836 15.5617L11.8408 9.65058C12.0266 9.48343 12.2462 9.39973 12.5001 9.39973C12.7539 9.39973 12.9738 9.48343 13.1592 9.65058L19.7216 15.5618C19.907 15.7289 20.0001 15.9268 20.0001 16.1555C20.0001 16.3841 19.907 16.582 19.7216 16.7493Z"
        fill={props.fill ? 'current' : '#D2D3D4'}
      />
    </svg>
  );
}

export default SvgIconArrowTopFull;
