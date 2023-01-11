import React, { useState, useEffect, useRef } from "react";
import BaseButton from "@/components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface DownloadButtonProps {
  options: {
    key: string;
    onClick: any;
    label: string;
    icon?: React.ReactNode;
  }[];
  icon?: React.ReactNode;
  tooltip?: string;
}

const DownloadButton = ({ options, icon, tooltip }: DownloadButtonProps) => {
  const refButton = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleClickOut = (e) => {
    if (!refButton.current?.contains(e.target)) {
      setOpen(false);
    }
  };

  const toggle = () => {
    setOpen(!open);
  };

  const handleClick = (onClick) => {
    onClick?.();
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
        <div className={styles.downloadOptionsContainer}>
          {options?.map((option) => (
            <div
              key={option.key}
              className={cx(commons.clickable, styles.downloadOption)}
              onClick={() => handleClick(option.onClick)}
            >
              <span className={styles.optionLabel}>
                {option.icon}
                <span
                  className={cx(styles.label, {
                    [styles.noIcon]: !option.icon,
                  })}
                >
                  {option.label}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
