import * as React from 'react';

function IconChevron(props: React.SVGProps<SVGSVGElement> = {}) {
  return (
    <svg
      width="15"
      height="9"
      fill="#4D5056"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 9"
      {...props}
    >
      <path d="M1.762 0L7.5 5.567 13.238 0 15 1.722 7.5 9 0 1.722 1.762 0z" />
    </svg>
  );
}

export default IconChevron;
