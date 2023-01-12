import * as React from "react";
import { STYLE_BY_FILL_COLORS } from "../../../constants/graph-themes";

function SvgIconNote(props: any) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.1059 14.7859L16.1059 14.7859L14.6462 16.2456C13.9978 16.894 13.1383 17.25 12.2213 17.25H4.21704C2.22329 17.25 0.610352 15.6369 0.610352 13.6433V4.35669C0.610352 2.36294 2.22346 0.75 4.21704 0.75H13.5037C15.4974 0.75 17.1104 2.36311 17.1104 4.35669V12.361C17.1104 13.278 16.7543 14.1375 16.1059 14.7859ZM16.6336 13.1772L16.8075 12.5446H16.1515H14.2721C13.2421 12.5446 12.4049 13.3818 12.4049 14.4118V16.2911V16.9472L13.0375 16.7732C13.5441 16.6339 14.0073 16.3651 14.3865 15.986L14.3866 15.9859L15.8463 14.5262C16.2255 14.147 16.4942 13.6837 16.6336 13.1772ZM11.5377 16.8828H12.0377V16.3828V14.4118C12.0377 13.1802 13.0405 12.1774 14.2721 12.1774H16.2432H16.7432V11.6774V4.35669C16.7432 2.56634 15.2939 1.11719 13.5037 1.11719H4.21704C2.4267 1.11719 0.977539 2.56643 0.977539 4.35669V13.6433C0.977539 15.4337 2.42678 16.8828 4.21704 16.8828H11.5377ZM9.04395 13.0332C9.04395 13.1346 8.96176 13.2168 8.86035 13.2168H4.82715C4.72574 13.2168 4.64355 13.1346 4.64355 13.0332C4.64355 12.9318 4.72574 12.8496 4.82715 12.8496H8.86035C8.96176 12.8496 9.04395 12.9318 9.04395 13.0332ZM4.82715 8.81641H12.8936C12.995 8.81641 13.0771 8.89859 13.0771 9C13.0771 9.10141 12.995 9.18359 12.8936 9.18359H4.82715C4.72574 9.18359 4.64355 9.10141 4.64355 9C4.64355 8.89859 4.72574 8.81641 4.82715 8.81641ZM4.82715 4.7832H12.8936C12.995 4.7832 13.0771 4.86539 13.0771 4.9668C13.0771 5.0682 12.995 5.15039 12.8936 5.15039H4.82715C4.72574 5.15039 4.64355 5.0682 4.64355 4.9668C4.64355 4.86539 4.72574 4.7832 4.82715 4.7832Z"
        fill="current"
        stroke="white"
      />
    </svg>
  );
}

export default SvgIconNote;
