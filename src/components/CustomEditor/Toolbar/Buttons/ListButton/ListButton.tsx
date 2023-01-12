import React, { useState, useEffect, useRef } from "react";
import BaseButton from "../../../../../components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";
import IconNumList from "../../../../../assets/images/icons/IconNumList";
import IconPointList from "../../../../../assets/images/icons/IconPointList";
import styles from "./styles.scss";

interface ListButtonProps {
  onClick: any;
  icon?: React.ReactNode;
  tooltip?: string;
  activeStyle?: string;
}

const ListButton = ({
  onClick,
  icon,
  tooltip,
  activeStyle,
}: ListButtonProps) => {
  const refButton = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const BLOCK_TYPES = [
    {
      label: "icon-list-ul",
      style: "unordered-list-item",
      icon: <IconPointList />,
      tooltip: "Liste à puces",
    },
    {
      label: "icon-list-ol",
      style: "ordered-list-item",
      icon: <IconNumList />,
      tooltip: "Liste numérotée",
    },
  ];

  const handleClickOut = (e) => {
    if (!refButton.current?.contains(e.target)) {
      setOpen(false);
    }
  };

  const toggle = () => {
    setOpen(!open);
  };

  const handleClick = (value) => {
    onClick(value);
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOut);
    return () => {
      document.removeEventListener("click", handleClickOut);
    };
  }, []);

  return (
    <div ref={refButton}>
      <BaseButton
        active={false}
        icon={icon}
        onClick={toggle}
        tooltip={tooltip}
      />
      {open && (
        <div className={styles.listOptionsContainer}>
          {BLOCK_TYPES.map((type) => (
            <BaseButton
              key={type.label}
              className={styles.listButton}
              active={activeStyle === type.style}
              onClick={() => handleClick(type.style)}
              icon={type.icon}
              tooltip={type.tooltip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListButton;
