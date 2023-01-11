import * as React from 'react';

function SvgIconFilter(props: React.SVGProps<SVGSVGElement> = {}) {
  return (
    <svg
      width={22}
      height={23}
      fill="#3083F7"
      viewBox="0 0 22 23"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.915 12.356a.848.848 0 001.174-.234l6.769-10.154a.846.846 0 00-.704-1.316H.846a.846.846 0 00-.704 1.316l6.627 9.94v9.898a.847.847 0 001.051.821l6.77-1.692a.846.846 0 00.64-.821v-5.077a.846.846 0 10-1.692 0v4.416l-5.077 1.27v-9.07c0-.168-.049-.331-.142-.47L2.427 2.345h17.146l-5.892 8.838a.845.845 0 00.234 1.173z" />
    </svg>
  );
}

export default SvgIconFilter;
