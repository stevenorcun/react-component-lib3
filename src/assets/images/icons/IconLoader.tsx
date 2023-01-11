import React from 'react';

const IconLoader = ({ ...props }: React.SVGProps<SVGSVGElement> = {}) => (
  <svg
    width="60"
    height="60"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 60 60"
    fill="#7e7e7e"
    {...props}
  >
    <path d="M 53 30 c 0 -12.7 -10.3 -23 -23 -23 S 7 17.3 7 30 M 10.9 30 c 0 -10.5 8.5 -19.1 19.1 -19.1 S 49.1 19.5 49.1 30">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="1s"
        from="0 30 30"
        to="360 30 30"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

export default IconLoader;
