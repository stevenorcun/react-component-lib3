import * as React from 'react';

interface IconFavorisProps extends React.SVGProps<SVGSVGElement> {
  isFilled?: boolean,
}

function IconFavoris({
  isFilled = false,
  ...props
}: IconFavorisProps = {}) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="#EDEDEE"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7.40134 3.79689L8.11927 5.49179L8.46713 6.31334L9.35529 6.38735L11.1834 6.54278L9.79197 7.7492L9.11845 8.33391L9.31829 9.20726L9.73276 10.991L8.16368 10.0436L7.40134 9.56993L6.639 10.0288L5.06992 10.9762L5.48439 9.19246L5.68423 8.3191L5.01071 7.7344L3.61925 6.52798L5.44739 6.37255L6.33555 6.29854L6.68341 5.47699L7.40134 3.79689ZM7.40134 0L5.32156 4.90709L0 5.35857L4.04113 8.8594L2.82731 14.0625L7.40134 11.3018L11.9754 14.0625L10.7615 8.8594L14.8027 5.35857L9.48112 4.90709L7.40134 0Z" />
      {
        isFilled
        && (
        <path
          d="M5.32156 4.90709L7.40134 0L9.48112 4.90709L14.8027 5.35857L10.7615 8.8594L11.9754 14.0625L7.40134 11.3018L2.82731 14.0625L4.04113 8.8594L0 5.35857L5.32156 4.90709Z"
        />
        )
      }

    </svg>
  );
}

export default IconFavoris;
