import React from "react";
import { useNavigate } from "react-router-dom";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface BackButtonProps {
  className?: string;
  route?: string;
  children: React.ReactNode;
}

const defaultProps = {
  className: undefined,
  route: undefined,
};

const BackButton = ({ className, route, children }: BackButtonProps) => {
  const navigate = useNavigate();

  const backHistory = (path?) => {
    if (!path) {
      navigate(-1);
    }
    navigate(path);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cx(
        commons.fontSmall,
        commons.clickable,
        styles.returnButton,
        className
      )}
      onClick={() => backHistory(route)}
      onKeyPress={() => backHistory(route)}
    >
      {children}
    </div>
  );
};

BackButton.defaultProps = defaultProps;

export default BackButton;
