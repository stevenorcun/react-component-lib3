import * as React from 'react';

function SvgIconSelect({
  isSelected,
}: {
  isSelected?: boolean | undefined;
}) {
  return (
    <svg
      width="20"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {/* <rect
        x="0.285156"
        width="40.5424"
        height="40.5424"
        rx="8.8456"
        fill={isSelected ? '#D6E6FD' : 'white'}
      /> */}

      <path
        d="M12.5 0.333252C5.59644 0.333252 0 5.9297 0 12.8333C0 19.7368 5.59644 25.3333 12.5 25.3333C19.4036 25.3333 25 19.7368 25 12.8333C24.9927 5.93278 19.4005 0.340628 12.5 0.333252ZM12.5 23.5476C6.58265 23.5476 1.7857 18.7506 1.7857 12.8333C1.7857 6.9159 6.58265 2.11895 12.5 2.11895C18.4173 2.11895 23.2143 6.9159 23.2143 12.8333C23.2079 18.748 18.4147 23.5412 12.5 23.5476Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isSelected ? '#3083F7' : '#4D5056'}
      />
      <path
        d="M12.5001 19.9756C16.445 19.9756 19.643 16.7777 19.643 12.8328C19.643 8.8879 16.445 5.68994 12.5001 5.68994C8.55523 5.68994 5.35727 8.8879 5.35727 12.8328C5.35727 16.7777 8.55523 19.9756 12.5001 19.9756Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isSelected ? '#3083F7' : '#4D5056'}
      />
    </svg>
  );
}

export default SvgIconSelect;
