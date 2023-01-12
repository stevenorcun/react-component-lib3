import React, { useState, useEffect, useRef } from "react";

import MenuContainer from "../../components/MenuDropdown/MenuContainer/MenuContainer";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { MenuOptions } from "../../constants/editor";
import styles from "./styles.scss";

interface MenuDropdownProps {
  className?: string;
  defaultIsOpened?: boolean;
  buttonComponent?: React.ReactNode;
  label?: string;
  options: MenuOptions[][];
}

const MenuDropdown = ({
  className,
  defaultIsOpened,
  buttonComponent,
  label,
  options,
}: MenuDropdownProps) => {
  const refButton = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(defaultIsOpened);

  const handleClickOut = (e) => {
    if (!refButton.current?.contains(e.target)) {
      setOpen(false);
    }
  };

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!open);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOut);
    return () => {
      document.removeEventListener("click", handleClickOut);
    };
  }, []);

  return (
    <div
      ref={refButton}
      className={cx(styles.menuDropdownContainer, className)}
    >
      {buttonComponent || (
        <>
          {label && (
            <div
              className={cx(commons.clickable, "nova-menuDropdown-button", {
                [styles.active]: open,
              })}
              onMouseDown={toggle}
            >
              {label}
            </div>
          )}
        </>
      )}
      {open && <MenuContainer depth={0} setOpen={setOpen} options={options} />}
    </div>
  );
};

export default MenuDropdown;
