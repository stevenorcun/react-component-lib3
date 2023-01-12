import React from "react";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import cx from "classnames";
import styles from "./styles.scss";

interface SidebarProps {
  className?: string;
  children?: JSX.Element[] | JSX.Element;
}

const defaultProps: SidebarProps = {
  className: "",
  children: undefined,
};

const Sidebar = ({ className, children }: SidebarProps) => {
  return (
    <aside className={cx(commons.PrettyScroll, styles.sidebar, className)}>
      {children}
    </aside>
  );
};

Sidebar.defaultProps = defaultProps;

export default Sidebar;
