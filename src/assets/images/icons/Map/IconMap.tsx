import * as React from 'react';

function SvgIconMap({
  isSelected,
}: {
  isSelected: boolean | undefined;
}) {
  return (
    <svg width="20"
      height="20"
      viewBox="0 0 25 26"
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
        d="M1.27223 25.5954C1.66082 25.8354 2.10433 25.9721 2.56061 25.9924C3.0169 26.0127 3.4708 25.916 3.87918 25.7114L9.73589 22.7831L14.7311 25.6445C15.1138 25.8634 15.5447 25.9845 15.9854 25.997C16.4262 26.0094 16.8632 25.9129 17.2577 25.7159L24.4 22.1447C24.8471 21.9236 25.2235 21.5821 25.4869 21.1585C25.7503 20.735 25.8903 20.2463 25.891 19.7476V3.67734C25.8911 3.22086 25.7746 2.77193 25.5524 2.37315C25.3303 1.97437 25.0099 1.63898 24.6217 1.39882C24.2335 1.15866 23.7904 1.0217 23.3344 1.00093C22.8784 0.980173 22.4247 1.0763 22.0162 1.28019L16.1551 4.21302L11.1599 1.35162C10.7772 1.13266 10.3463 1.01158 9.90555 0.999117C9.46479 0.986657 9.02778 1.08321 8.6333 1.28019L1.49096 4.85136C1.04389 5.07248 0.667448 5.41404 0.404028 5.83756C0.140607 6.26108 0.000676958 6.74975 0 7.24851V23.3188C0.000503268 23.7752 0.117644 24.2239 0.340303 24.6224C0.562963 25.0208 0.883754 25.3557 1.27223 25.5954ZM23.2126 3.67734V19.7476L18.3022 22.2028V6.13252L23.2126 3.67734ZM15.6239 6.99406V23.0643L10.2671 20.002V3.93179L15.6239 6.99406ZM2.67837 7.24851L7.58873 4.79333V20.8636L2.67837 23.3188V7.24851Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isSelected ? '#3083F7' : '#4D5056'}
      />
    </svg>
  );
}

export default SvgIconMap;