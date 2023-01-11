import * as React from 'react';

function IconDiagonalArrow({
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
                d="M2.59485 2.59497C2.86351 2.32631 3.23459 2.16019 3.64457 2.16019L11.083 2.16016C11.9029 2.16016 12.5675 2.8248 12.5675 3.64469C12.5675 4.46459 11.9029 5.12923 11.083 5.12923H7.22856L15.3228 13.2234C15.9025 13.8032 15.9025 14.7432 15.3228 15.3229C14.743 15.9026 13.8031 15.9026 13.2233 15.3229L5.12911 7.22868V11.0831C5.12911 11.903 4.46447 12.5677 3.64457 12.5677C2.82467 12.5677 2.16003 11.903 2.16003 11.0831L2.16007 3.64469C2.16003 3.23481 2.32625 2.86357 2.59485 2.59497Z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={isSelected ? '#3083F7' : '#4D5056'}
            />
        </svg>
    );
}

export default IconDiagonalArrow;
