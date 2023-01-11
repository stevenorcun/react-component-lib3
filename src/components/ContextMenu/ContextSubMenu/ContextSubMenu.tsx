import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { IContextMenu } from "@/components/ContextMenu/ContextMenu";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface ContextSubMenuProps {
  showActiveMenu: {
    menuIndex: number;
    menu: IContextMenu;
  } | null;
  menuLength: number;
  setShowActiveMenu: (
    menu: {
      menuIndex: number;
      menu: IContextMenu;
    } | null
  ) => void;
  setShowContextMenu: (visible: boolean) => void;
}

const ContextSubMenu = ({
  showActiveMenu,
  setShowActiveMenu,
  setShowContextMenu,
  menuLength,
}: ContextSubMenuProps) => {
  const subMenu = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [position, setPosition] = useState(showActiveMenu?.menu.position);

  const navBarHeight = 120;

  // Set the dimensions of the submenu when the active menu change
  // These dimensions are used to calculate the translation for the submenu
  useEffect(() => {
    setPosition(showActiveMenu?.menu.position);
    if (subMenu.current) {
      setDimensions(subMenu.current.getBoundingClientRect());
    }
  }, [showActiveMenu]);

  useEffect(() => {
    let dim;
    let pos = position;
    if (subMenu.current) {
      dim = subMenu.current.getBoundingClientRect();
    }
    if (!pos) return;

    // If normal position for submenu is :
    // - too high, change position to bottom
    if (dim?.y - navBarHeight < 0 && position?.charAt(0) === "t") {
      pos = `b${pos.charAt(1)}`;
    }
    // - too low, change position to top
    if (dim?.bottom > window.innerHeight && position?.charAt(0) === "b") {
      pos = `t${pos.charAt(1)}`;
    }
    // - too much on the left, change position to right
    if (dim?.left < 0 && position?.charAt(1) === "l") {
      pos = `${pos.charAt(0)}r`;
    }
    // - too much on the right, change position to left
    if (dim?.right > window.innerWidth && position?.charAt(1) === "r") {
      pos = `${pos.charAt(0)}l`;
    }
    setPosition(pos);
  }, [dimensions]);

  const subMenuItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setShowActiveMenu(null);
    setShowContextMenu(false);
  };

  return (
    showActiveMenu &&
    showActiveMenu.menu?.submenu &&
    showActiveMenu.menu?.submenu?.length !== 0 && (
      <div
        ref={subMenu}
        className={cx(
          styles.subMenu,
          position?.charAt(0) === "t"
            ? styles.topSubMenu
            : styles.bottomSubMenu,
          position?.charAt(1) === "l" ? styles.leftSubMenu : styles.rightSubMenu
        )}
        style={{
          display: "flex",
          left: "150px",
          top: "150px",
          transformOrigin: "center center",
          transform: `rotate(${
            -180 / menuLength + (showActiveMenu.menuIndex * 360) / menuLength
          }deg) translate(122px, 0px) rotate(${
            180 / menuLength - (showActiveMenu.menuIndex * 360) / menuLength
          }deg) translate(${
            position?.charAt(1) === "l" ? -20 - dimensions.width : 20
          }px, ${
            position?.charAt(0) === "t" ? 20 - dimensions.height : -20
          }px)`,
        }}
      >
        {position?.charAt(0) === "b" && (
          <div className={styles.subMenuTitle}>
            {typeof showActiveMenu.menu.name === "string"
              ? showActiveMenu.menu.name
              : showActiveMenu.menu.name.join(" ")}
          </div>
        )}
        {showActiveMenu.menu.submenu &&
          showActiveMenu.menu.submenu.map((sm, i) => (
            <div
              key={i}
              className={cx(
                { [commons.Disabled]: sm.disabled },
                styles.subMenuItem
              )}
              onClick={() => {
                subMenuItemClick(sm);
              }}
            >
              {sm.icon}
              <div>{sm.name}</div>
            </div>
          ))}
        {position?.charAt(0) === "t" && (
          <div className={styles.subMenuTitle}>
            {typeof showActiveMenu.menu.name === "string"
              ? showActiveMenu.menu.name
              : showActiveMenu.menu.name.join(" ")}
          </div>
        )}
      </div>
    )
  );
};

export default ContextSubMenu;
