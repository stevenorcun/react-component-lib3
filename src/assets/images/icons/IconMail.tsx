import React from "react";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { STYLE_BY_FILL_COLORS } from "../../../constants/graph-themes";

interface AuxProps extends React.SVGProps<SVGSVGElement> {
  withBadge?: boolean;
}

function IconMail({ withBadge, ...props }: AuxProps) {
  return (
    <>
      <svg
        width="18"
        height="15"
        fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
        viewBox="0 0 18 15"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M14.4779 0.75H3.15535C2.54285 0.75 2.01785 0.925831 1.58035 1.18958C0.635351 1.80499 0.110352 2.77206 0.110352 3.82705V11.4405C0.110352 13.1109 1.51035 14.5 3.15535 14.5H14.5654C16.2279 14.5 17.6104 13.0934 17.6104 11.4405V3.82705C17.5229 2.15665 16.2104 0.75 14.4779 0.75ZM3.15535 2.50831H14.5654H14.6529L9.85785 6.62276C9.24535 7.15026 8.45785 7.15026 7.86285 6.62276L2.98035 2.50831H3.15535ZM15.7904 11.5109C15.7904 12.2142 15.1779 12.8296 14.4779 12.8296H3.15535C2.45535 12.8296 1.84285 12.2142 1.84285 11.5109V3.82705L6.72535 7.9415C7.33785 8.46899 8.12535 8.73274 8.80785 8.73274C9.49035 8.73274 10.2954 8.46899 10.8904 7.9415L15.7729 3.82705V11.5109H15.7904Z" />
      </svg>
      {withBadge && <div className={commons.badge} />}
    </>
  );
}

export default IconMail;
