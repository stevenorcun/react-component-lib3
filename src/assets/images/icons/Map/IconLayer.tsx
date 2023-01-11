import * as React from 'react';

function IconLayer({
    isSelected,
}: {
    isSelected: boolean | undefined;
}) {
    return (
        <svg width="20"
            height="20"
            viewBox="0 0 20 20"
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
                d="M18 9.22461C18 8.80836 17.7638 8.45961 17.4263 8.26836L17.4375 8.25711L9.5625 3.75711L9.55125 3.76836C9.3825 3.66711 9.2025 3.59961 9 3.59961C8.7975 3.59961 8.6175 3.66711 8.44875 3.76836L8.4375 3.74586L0.5625 8.24586L0.57375 8.25711C0.23625 8.45961 0 8.80836 0 9.22461C0 9.64086 0.23625 9.98961 0.57375 10.1809L0.5625 10.1921L8.4375 14.6921L8.44875 14.6809C8.6175 14.7821 8.7975 14.8496 9 14.8496C9.2025 14.8496 9.3825 14.7821 9.55125 14.6809L9.5625 14.6921L17.4375 10.1921L17.4263 10.1809C17.7638 9.98961 18 9.64086 18 9.22461Z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={isSelected ? '#3083F7' : '#4D5056'}
            />
        </svg>
    );
}

export default IconLayer;
