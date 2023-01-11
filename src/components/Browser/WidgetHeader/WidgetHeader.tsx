import React, { useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconArrow from "@/assets/images/icons/IconArrow";
import styles from "./WidgetHeader.scss";

interface WidgetHeaderProps {
  title: string;
  description: string;
  isDescriptionLight?: boolean;
  className?: string | string[];
  children?: React.ReactNode;
  onToggle: React.MouseEventHandler;
}

const WidgetHeader = ({
  title,
  description,
  className = "",
  isDescriptionLight = false,
  onToggle,
  children = null,
}: WidgetHeaderProps) => {
  const [isFullWidth, setIsFullWidth] = useState(true);

  const handleVisibilityButtonClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullWidth(!isFullWidth);
    onToggle(e);
  };

  return (
    <>
      <div className={cx(commons.Flex, styles.Widget__Header, className)}>
        <div className={styles.Widget__Header__Main}>
          <span>{title}</span>
          {description && (
            <span
              className={cx({
                [styles.Widget__Header__light]: isDescriptionLight,
              })}
            >
              {description}
            </span>
          )}
        </div>
        {children}
      </div>

      <div
        className={cx(styles.ToggleVisibilityButton, {
          [styles.IsFullWidth]: isFullWidth,
        })}
        onClick={handleVisibilityButtonClicked}
      >
        <IconArrow fill="#3083F7" />
      </div>
    </>
  );
};

export default WidgetHeader;
