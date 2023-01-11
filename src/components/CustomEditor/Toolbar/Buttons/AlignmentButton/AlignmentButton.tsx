import React, { useState, useEffect, useRef } from "react";
import BaseButton from "@/components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";
import IconToolTextLeft from "@/assets/images/icons/IconToolTextLeft";
import IconToolTextCenter from "@/assets/images/icons/IconToolTextCenter";
import IconToolTextRight from "@/assets/images/icons/IconToolTextRight";
import styles from "./styles.scss";

interface AlignmentButtonProps {
  onClick: any;
  icon?: React.ReactNode;
  tooltip?: string;
}

const AlignmentButton = ({ onClick, icon, tooltip }: AlignmentButtonProps) => {
  const refButton = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const BLOCK_ALIGNMENTS = [
    {
      label: "icon-align-left",
      style: "alignLeft",
      icon: <IconToolTextLeft />,
      tooltip: "Aligner à gauche",
    },
    {
      label: "icon-align-center",
      style: "alignCenter",
      icon: <IconToolTextCenter />,
      tooltip: "Aligner au centre",
    },
    {
      label: "icon-align-right",
      style: "alignRight",
      icon: <IconToolTextRight />,
      tooltip: "Aligner à droite",
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
        <div className={styles.alignmentButtonsContainer}>
          {BLOCK_ALIGNMENTS.map((type) => (
            <BaseButton
              key={type.label}
              className={styles.alignmentButtons}
              active={false}
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

export default AlignmentButton;
