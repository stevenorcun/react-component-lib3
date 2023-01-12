import React from "react";
import { useLocation } from "react-router-dom";
import cx from "classnames";

import IconDots from "../../assets/images/icons/IconDots";
import { APP_ROUTES } from "../../constants/routes";
import Navigation from "./Navigation/Navigation";
import styles from "./styles.scss";

interface AuxProps {
  children?: React.ReactNode;
}

const Header = ({ children }: AuxProps) => {
  const params = useLocation();
  return (
    <>
      <div
        className={
          params.pathname === APP_ROUTES.login.path
            ? cx(styles.headerLogin, styles.header)
            : cx(styles.header, styles.headerUser)
        }
      >
        <div className={styles.menuIcon}>
          <IconDots />
        </div>
        {children}
        {params.pathname === APP_ROUTES.login.path ? "" : <Navigation />}
      </div>
    </>
  );
};

export default Header;
