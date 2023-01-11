import * as React from 'react';

function IconChevronGauche({
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
                d="M11.5479 4.348L6.7479 9.148C6.5319 9.364 6.3999 9.664 6.3999 10C6.3999 10.336 6.5319 10.636 6.7479 10.852L11.5479 15.652C11.7639 15.868 12.0639 16 12.3999 16C13.0599 16 13.5999 15.46 13.5999 14.8C13.5999 14.464 13.4679 14.164 13.2519 13.948L9.2919 10L13.2399 6.052C13.4679 5.836 13.5999 5.536 13.5999 5.2C13.5999 4.54 13.0599 4 12.3999 4C12.0639 4 11.7639 4.132 11.5479 4.348Z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={isSelected ? '#3083F7' : '#4D5056'}
            />
        </svg>
    );
}

export default IconChevronGauche;
