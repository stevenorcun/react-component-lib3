import React, { useEffect, useState, useRef } from "react";

import BaseButton from "../../../../../components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";
import ColourDropdownMenu from "../../../../../lib/DropdownMenu/ColourDropdownMenu/ColourDropdownMenu";

import styles from "./styles.scss";

interface ColorButtonProps {
  onClick: any;
  icon?: React.ReactNode;
  color?: string;
  tooltip?: string;
}

const ColorButton = ({ onClick, icon, color, tooltip }: ColorButtonProps) => {
  const refButton = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  const handleClickOut = (e: any) => {
    if (!refButton.current?.contains(e.target)) {
      setOpen(false);
    }
  };

  const colorClick = (c: string) => {
    onClick(c);
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOut);
    return () => {
      document.removeEventListener("click", handleClickOut);
    };
  }, []);

  return (
    <div ref={refButton} className={styles.colorButtonContainer}>
      <BaseButton
        active={false}
        icon={icon}
        onClick={toggle}
        tooltip={tooltip}
      />
      {open && (
        <ColourDropdownMenu handleClick={colorClick} typeColor={color} />
      )}
    </div>
  );
};

export default ColorButton;
