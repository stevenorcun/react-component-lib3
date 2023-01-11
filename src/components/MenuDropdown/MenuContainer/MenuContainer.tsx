import React, { Fragment } from "react";
import IconArrow from "@/assets/images/icons/IconArrow";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { MenuOptions } from "@/constants/editor";
import styles from "../styles.scss";

interface MenuContainerProps {
  depth: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  options: MenuOptions[][];
}

const MenuContainer = ({ depth, setOpen, options }: MenuContainerProps) => {
  const handleClick = (e, onClick) => {
    e.preventDefault();
    onClick?.();
    setOpen(false);
  };

  return (
    <div
      className={cx(
        styles.optionsContainer,
        "nova-menuDropdown-optionsContainer",
        `nova-menuDropdown-depth${depth}`
      )}
    >
      {options?.map((optionContainer, index) => (
        <Fragment key={index}>
          {optionContainer.map((option, i) => (
            <div
              key={option.key || i}
              className={cx(
                commons.clickable,
                styles.option,
                "nova-menuDropdown-option"
              )}
              onMouseDown={(e: React.MouseEvent) =>
                handleClick(e, option.onClick)
              }
            >
              <span
                className={cx(
                  styles.optionContent,
                  "nova-menuDropdown-optionLabel"
                )}
              >
                {option.icon}
                <div className={styles.optionLabel}>
                  <span className={cx(styles.label, "nova-menuDropdown-label")}>
                    {option.label}
                  </span>
                  {option.options && <IconArrow />}
                </div>
              </span>
              {option.options && (
                <MenuContainer
                  depth={depth + 1}
                  setOpen={setOpen}
                  options={option.options}
                />
              )}
            </div>
          ))}
          <div className={cx(styles.divider, "nova-menuDropdown-divider")} />
        </Fragment>
      ))}
    </div>
  );
};

export default MenuContainer;
