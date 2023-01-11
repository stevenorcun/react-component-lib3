import * as React from 'react';
import { STYLE_BY_FILL_COLORS } from '@/constants/graph-themes';

function SvgIconBuilding(props: React.SVGProps<SVGSVGElement> = {}) {
  return (
    <svg
      fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
      width={14}
      height={15}
      viewBox="0 0 14 15"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.125 4.875H10.5V1.375C10.5 0.89375 10.1062 0.5 9.625 0.5H0.875C0.39375 0.5 0 0.89375 0 1.375V13.625C0 14.1062 0.39375 14.5 0.875 14.5H3.5V11H7V14.5H13.125C13.6062 14.5 14 14.1062 14 13.625V5.75C14 5.26875 13.6062 4.875 13.125 4.875ZM4.37513 9.25053H1.75013V6.62553H4.37513V9.25053ZM4.37513 4.875H1.75013V2.25H4.37513V4.875ZM8.75 9.25053H6.125V6.62553H8.75V9.25053ZM8.75 4.875H6.125V2.25H8.75V4.875ZM12.2501 12.7505H10.5001V11.0005H12.2501V12.7505ZM12.2501 9.25053H10.5001V6.62553H12.2501V9.25053Z"
        fill="current"
      />
    </svg>
  );
}

export default SvgIconBuilding;
