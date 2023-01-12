import React, { useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconDoubleArrow from "../../../assets/images/icons/IconDoubleArrow";
import styles from "./Navigation.scss";

interface DrawerNavigationProps {
  activeMenu: string | null;
  menus?: Array<{ key: string; label?: string }>;
  className?: string;
  setActiveMenu: (key: string) => void;
}

const DrawerNavigation = ({
  activeMenu,
  menus = [],
  className = "",
  setActiveMenu,
}: DrawerNavigationProps) => {
  const [fullMenu, setFullMenu] = useState(false);
  return (
    <>
      <div
        className={cx(
          styles.navigation,
          commons.PrettyScroll,
          className,
          "drawer-navigation"
        )}
      >
        {menus.map(
          (menu, index) =>
            ((index < 2 && !fullMenu) || fullMenu) && (
              <div
                key={`${menu.key}-tab`}
                className={cx(commons.clickable, "drawer-navigationButton", {
                  [styles.active]: activeMenu === menu.key,
                })}
                onClick={() => setActiveMenu(menu.key)}
              >
                {menu.label || menu.key}
              </div>
            )
        )}
        {!fullMenu && menus.length > 3 && (
          <div
            className={cx(styles.showMore, commons.clickable)}
            onClick={() => setFullMenu(true)}
          >
            {menus.length - 2} <IconDoubleArrow style={{ marginLeft: 5 }} />
          </div>
        )}
      </div>
    </>
  );
};

export default DrawerNavigation;
