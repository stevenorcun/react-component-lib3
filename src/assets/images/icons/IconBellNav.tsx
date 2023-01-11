import * as React from "react";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

interface AuxProps {
  withBadge: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function SvgIconBellNav({ withBadge, className, onClick }: AuxProps) {
  const renderBadge = () => {
    return <div className={commons.badge} style={{ top: -2, right: -1 }} />;
  };

  return (
    <div
      style={{ position: "relative" }}
      className={className ?? ""}
      // @ts-ignore
      onClick={onClick}
    >
      <svg
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8.8034 18.0664C9.23739 18.0664 9.65361 17.894 9.96049 17.5871C10.2674 17.2802 10.4398 16.864 10.4398 16.43H7.16704C7.16704 16.864 7.33944 17.2802 7.64632 17.5871C7.9532 17.894 8.36941 18.0664 8.8034 18.0664Z" />
        <path d="M16.1049 14.2889C16.1668 14.1393 16.183 13.9748 16.1514 13.816C16.1198 13.6573 16.0418 13.5115 15.9273 13.397L14.5307 12.0004V7.43004C14.5291 6.05399 14.0321 4.72451 13.1306 3.68484C12.2292 2.64516 10.9835 1.9648 9.62159 1.76822V0.884588C9.62159 0.667593 9.53539 0.459485 9.38195 0.306046C9.22851 0.152607 9.0204 0.0664063 8.8034 0.0664062C8.58641 0.0664063 8.3783 0.152607 8.22486 0.306046C8.07142 0.459485 7.98522 0.667593 7.98522 0.884588V1.76822C6.62328 1.9648 5.37764 2.64516 4.47619 3.68484C3.57474 4.72451 3.07774 6.05399 3.07613 7.43004V12.0004L1.67949 13.397C1.5651 13.5115 1.48721 13.6572 1.45565 13.8159C1.4241 13.9746 1.4403 14.1391 1.50221 14.2886C1.56412 14.4381 1.66897 14.5658 1.80348 14.6557C1.938 14.7456 2.09615 14.7936 2.25795 14.7937H15.3489C15.5107 14.7937 15.6689 14.7458 15.8034 14.6559C15.938 14.5661 16.0429 14.4383 16.1049 14.2889ZM4.23304 13.1573L4.47277 12.9176C4.62622 12.7642 4.71245 12.5561 4.71249 12.3391V7.43004C4.71249 6.34507 5.1435 5.30453 5.91069 4.53733C6.67789 3.77014 7.71843 3.33913 8.8034 3.33913C9.88838 3.33913 10.9289 3.77014 11.6961 4.53733C12.4633 5.30453 12.8943 6.34507 12.8943 7.43004V12.3391C12.8944 12.5561 12.9806 12.7642 13.134 12.9176L13.3738 13.1573H4.23304Z" />
      </svg>
      {withBadge && renderBadge()}
    </div>
  );
}

export default SvgIconBellNav;
