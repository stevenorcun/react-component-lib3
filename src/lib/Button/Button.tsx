import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./Button.scss";

interface ButtonProps {
  className?: string | string[];
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick: React.MouseEventHandler;
}

const Button = (props: ButtonProps) => (
  <div
    style={props.style}
    className={cx(
      commons.Flex,
      commons.FlexAlignItemsCenter,
      styles.Button,
      props.className
    )}
    onClick={props.onClick}
  >
    {props.children}
  </div>
);

export default Button;
