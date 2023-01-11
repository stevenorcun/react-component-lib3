import * as React from 'react';

function IconChevronDroite({
    isSelected,
}: {
    isSelected: boolean | undefined;
}) {
    return (
        <svg width="20"
            height="20"
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
                d="M8.4519 15.652L13.2519 10.852C13.4679 10.636 13.5999 10.336 13.5999 10C13.5999 9.664 13.4679 9.364 13.2519 9.148L8.4519 4.348C8.2359 4.132 7.9359 4 7.5999 4C6.9399 4 6.3999 4.54 6.3999 5.2C6.3999 5.536 6.5319 5.836 6.7479 6.052L10.7079 10L6.7599 13.948C6.5319 14.164 6.3999 14.464 6.3999 14.8C6.3999 15.46 6.9399 16 7.5999 16C7.9359 16 8.2359 15.868 8.4519 15.652Z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={isSelected ? '#3083F7' : '#4D5056'}
            />
        </svg>
    );
}

export default IconChevronDroite;
