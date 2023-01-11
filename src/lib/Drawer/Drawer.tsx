import React, { Fragment, useEffect, useRef, useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconArrow from "@/assets/images/icons/IconArrow";
import DrawerNavigation from "@/lib/Drawer/Navigation/Navigation";
import styles from "./Drawer.scss";

// can be useful to have have an `activeMenu` props
// to forcefully change it "from the outside"
interface DrawerProps {
  isCollapsed: boolean;
  menus: Array<{ key: string; label?: string; component: React.ReactNode }>;
  className?: string | string[];
  onToggle: React.MouseEventHandler;
  isResizable?: boolean;
  position?: "left" | "right";
}

const Drawer = ({
  isCollapsed,
  menus = [],
  className = "",
  onToggle,
  isResizable = true,
  position = "right",
}: DrawerProps) => {
  const borderRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(
    menus.length ? menus[0].key : null
  );
  const [mouseDown, setMouseDown] = useState(false);
  const [isResizing, setResizing] = useState(false);
  const [fullWidth, setFullWidth] = useState(364);

  useEffect(() => {
    if (drawerRef.current?.style) {
      drawerRef.current.style[position] = isCollapsed
        ? `${-fullWidth - 1}px`
        : "0";
    }
  }, [isCollapsed]);

  /**
   * Updates the board state to allow window movement on mouse press.
   */
  const onMouseDown = (e) => {
    // Only drag on middle mouse, or when not over a box
    if (
      isResizable &&
      e.button === 0 &&
      borderRef.current?.contains(e.target)
    ) {
      setResizing(true);
      setMouseDown(true);
    }
  };

  const onMouseMove = (e) => {
    if (isResizable && isResizing && mouseDown) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 364 && drawerRef.current) {
        drawerRef.current.style.width = `${window.innerWidth - e.clientX}px`;
        drawerRef.current.style.maxWidth = `${window.innerWidth - e.clientX}px`;
        setFullWidth(newWidth);
      }
    }
  };

  /**
   * Stops movement of the board window.
   */
  const onMouseUp = () => {
    if (isResizable) {
      setResizing(false);
      setMouseDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [mouseDown]);

  return (
    <div
      ref={drawerRef}
      className={cx(
        styles.drawer,
        {
          [styles.opened]: !isCollapsed,
          [styles.resizing]: isResizing,
          [styles.leftDrawer]: position === "left",
        },
        className
      )}
    >
      <div
        ref={borderRef}
        className={cx("drawer-drawerBorder", styles.drawerBorder, {
          [styles.resizable]: isResizable,
        })}
      />
      <div className={styles.toggleVisibilityBtn} onClick={onToggle}>
        <IconArrow />
      </div>
      <div className={cx(styles.Drawer__Body, "drawer-drawerBody")}>
        <DrawerNavigation
          menus={menus}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <div
          className={cx(
            commons.PrettyScroll,
            styles.Drawer__Tab,
            "drawer-drawerTab"
          )}
        >
          {menus.map((menu) =>
            activeMenu === menu.key ? (
              <Fragment key={menu.key}>{menu.component}</Fragment>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
