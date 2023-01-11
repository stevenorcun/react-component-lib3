import * as React from 'react';

function SvgIconUnknow3({ isSelected }: { isSelected: boolean | undefined }) {
  return (
    <svg
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.167969"
        width="40.5424"
        height="40.5424"
        rx="8.8456"
        fill={isSelected ? '#D6E6FD' : 'white'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.668 23C23.458 23 22.448 23.86 22.218 25H15.118C14.888 23.86 13.878 23 12.668 23C11.288 23 10.168 24.12 10.168 25.5C10.168 26.88 11.288 28 12.668 28C13.878 28 14.888 27.14 15.118 26H22.218C22.448 27.14 23.458 28 24.668 28C26.048 28 27.168 26.88 27.168 25.5C27.168 24.12 26.048 23 24.668 23ZM29.168 16H27.168V14C27.168 13.45 26.718 13 26.168 13C25.618 13 25.168 13.45 25.168 14V16H23.168C22.618 16 22.168 16.45 22.168 17C22.168 17.55 22.618 18 23.168 18H25.168V20C25.168 20.55 25.618 21 26.168 21C26.718 21 27.168 20.55 27.168 20V18H29.168C29.718 18 30.168 17.55 30.168 17C30.168 16.45 29.718 16 29.168 16Z"
        fill={isSelected ? '#3083F7' : '#94969A'}
      />
    </svg>
  );
}

export default SvgIconUnknow3;
