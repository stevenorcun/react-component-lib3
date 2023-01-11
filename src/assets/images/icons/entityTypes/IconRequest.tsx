import * as React from "react";

import { STYLE_BY_FILL_COLORS } from "@/constants/graph-themes";

const IconRequest = (props: { fill?: string } = {}) => {
  return (
    <g
      {...props}
      fill={props.fill || STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
      style={{ transform: "scale(3)" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1644 16.8L16.8269 13.45C17.7019 12.0875 18.2144 10.475 18.2144 8.75C18.2144 3.9125 14.3019 0 9.46436 0C4.62686 0 0.714355 3.9125 0.714355 8.75C0.714355 13.5875 4.62686 17.5 9.46436 17.5C11.2019 17.5 12.8144 16.975 14.1644 16.1125L17.5144 19.45C17.8519 19.7875 18.3269 20 18.8394 20C19.8769 20 20.7144 19.1625 20.7144 18.125C20.7144 17.6125 20.5019 17.1375 20.1644 16.8ZM9.46436 15C6.01436 15 3.21436 12.2 3.21436 8.75C3.21436 5.3 6.01436 2.5 9.46436 2.5C12.9144 2.5 15.7144 5.3 15.7144 8.75C15.7144 12.2 12.9144 15 9.46436 15Z"
        fill="current"
      />
    </g>
  );
};

export default IconRequest;
