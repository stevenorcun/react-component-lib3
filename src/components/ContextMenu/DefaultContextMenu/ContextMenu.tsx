import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import cx from "classnames";
import styles from "./styles.scss";

interface ContextMenuProps {
  className?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  position?: { x: number; y: number };
  children?: React.ReactNode;
}

const defaultProps: ContextMenuProps = {
  className: undefined,
  isOpen: false,
  setIsOpen: undefined,
  position: undefined,
  children: undefined,
};

const ContextMenu = ({
  className,
  isOpen,
  setIsOpen,
  position,
  children,
}: ContextMenuProps) => {
  const [opened, setOpened] = useState(isOpen);
  const contextMenu = useRef<HTMLDivElement>(null);

  const close = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
    setOpened(false);
  };

  const handleClickOut = (e) => {
    if (!contextMenu.current?.contains(e.target)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOut);
    return () => {
      document.removeEventListener("click", handleClickOut);
    };
  }, []);

  useEffect(() => {
    setOpened(isOpen);
  }, [isOpen]);
  return createPortal(
    <>
      {opened && (
        <div
          ref={contextMenu}
          className={cx(className, styles.contextMenuContainer)}
          style={{ left: position?.x, top: position?.y }}
        >
          {children}
        </div>
      )}
    </>,
    document.getElementById("root") as Element
  );
};

ContextMenu.defaultProps = defaultProps;

export default ContextMenu;
