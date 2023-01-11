import * as React from 'react';

function IconCamera(props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* <rect
        x="0.285156"
        width="40.5424"
        height="40.5424"
        rx="8.8456"
        fill={isSelected ? '#D6E6FD' : 'white'}
      /> */}

      <path
        d="M3.6 6.66016C3.366 6.66016 3.132 6.75916 2.961 6.92206C2.7981 7.09486 2.7 7.32976 2.7 7.56556C2.7 7.80136 2.7981 8.03536 2.961 8.20906C3.303 8.54386 3.897 8.54386 4.239 8.20906C4.401 8.03536 4.5 7.80136 4.5 7.56556C4.5 7.32976 4.401 7.09486 4.239 6.92206C4.068 6.75916 3.834 6.66016 3.6 6.66016Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={props.fill ? 'current' : '#94969A'}
      />
      <path
        d="M15.3 3.96016H13.1562L12.5046 2.65786C12.3525 2.35276 12.0411 2.16016 11.7 2.16016H6.3C5.9589 2.16016 5.6475 2.35276 5.4945 2.65786L4.8438 3.96016H2.7C1.2114 3.96016 0 5.17156 0 6.66016V13.8602C0 15.3488 1.2114 16.5602 2.7 16.5602H15.3C16.7886 16.5602 18 15.3488 18 13.8602V6.66016C18 5.17156 16.7886 3.96016 15.3 3.96016ZM16.2 13.8602C16.2 14.357 15.7959 14.7602 15.3 14.7602H2.7C2.2041 14.7602 1.8 14.357 1.8 13.8602V6.66016C1.8 6.16336 2.2041 5.76016 2.7 5.76016H5.4C5.7411 5.76016 6.0525 5.56756 6.2055 5.26246L6.8562 3.96016H11.1438L11.7954 5.26246C11.9475 5.56756 12.2589 5.76016 12.6 5.76016H15.3C15.7959 5.76016 16.2 6.16336 16.2 6.66016V13.8602Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={props.fill ? 'current' : '#94969A'}
      />
      <path
        d="M9 6.66016C7.0146 6.66016 5.4 8.27476 5.4 10.2602C5.4 12.2456 7.0146 13.8602 9 13.8602C10.9854 13.8602 12.6 12.2456 12.6 10.2602C12.6 8.27476 10.9854 6.66016 9 6.66016ZM9 12.0602C8.0073 12.0602 7.2 11.2529 7.2 10.2602C7.2 9.26746 8.0073 8.46016 9 8.46016C9.9927 8.46016 10.8 9.26746 10.8 10.2602C10.8 11.2529 9.9927 12.0602 9 12.0602Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={props.fill ? 'current' : '#94969A'}
      />
    </svg>
  );
}

export default IconCamera;
