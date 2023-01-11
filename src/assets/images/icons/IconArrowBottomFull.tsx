import * as React from 'react';

function SvgIconArrowBottomFull(props: any) {
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
        d="M19.7216 9.25067C19.5361 9.08351 19.3163 9 19.0624 9H5.93757C5.6835 9 5.46386 9.08351 5.27829 9.25067C5.09271 9.41801 5 9.61585 5 9.84457C5 10.0732 5.09271 10.2711 5.27829 10.4383L11.8407 16.3494C12.0265 16.5166 12.2461 16.6003 12.5 16.6003C12.7539 16.6003 12.9737 16.5166 13.1591 16.3494L19.7216 10.4382C19.9069 10.2711 20 10.0732 20 9.84452C20 9.61585 19.9069 9.41801 19.7216 9.25067Z"
        fill={props.fill ? 'current' : '#D2D3D4'}
      />
    </svg>
  );
}

export default SvgIconArrowBottomFull;
