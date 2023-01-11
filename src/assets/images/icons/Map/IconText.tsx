import * as React from 'react';

function IconText({
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
                d="M16.5789 0H1.42105C0.636253 0 0 0.636253 0 1.42105V5.11484C0 5.89964 0.636253 6.53589 1.42105 6.53589C2.20585 6.53589 2.84211 5.89964 2.84211 5.11484V2.84211H7.57895V15.1579H5.38446C4.59966 15.1579 3.96341 15.7941 3.96341 16.5789C3.96341 17.3637 4.59966 18 5.38446 18H12.6155C13.4003 18 14.0366 17.3637 14.0366 16.5789C14.0366 15.7941 13.4003 15.1579 12.6155 15.1579H10.4211V2.84211H15.1579V5.11484C15.1579 5.89964 15.7941 6.53589 16.5789 6.53589C17.3637 6.53589 18 5.89964 18 5.11484V1.42105C18 0.636253 17.3637 0 16.5789 0Z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={isSelected ? '#3083F7' : '#4D5056'}
            />
        </svg>
    );
}

export default IconText;
