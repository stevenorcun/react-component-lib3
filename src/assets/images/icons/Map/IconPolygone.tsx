import * as React from 'react';

function SvgIconPolygone({
  isSelected,
}: {
  isSelected: boolean | undefined;
}) {
  return (
    <svg width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">

      {/* <rect
        x="0.285156"
        width="40.5424"
        height="40.5424"
        rx="8.8456"
        fill={isSelected ? '#D6E6FD' : 'white'}
      /> */}

      <path
        d="M6.25 2L0 12.8252L6.25 23.65H18.75L25 12.8252L18.75 2H6.25ZM17.3735 21.2664H7.62649L2.75294 12.8252L7.62649 4.38358H17.3735L22.2471 12.8252L17.3735 21.2664Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isSelected ? '#3083F7' : '#4D5056'}
      />
    </svg>
  );
}

export default SvgIconPolygone;
