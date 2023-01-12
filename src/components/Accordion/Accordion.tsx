import React, { useState } from "react";

import IconArrow from "../../assets/images/icons/IconArrow";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import cx from "classnames";
import styles from "./styles.scss";

interface AccordionProps {
  className?: string;
  classNameHead?: string;
  title?: string | React.ReactElement;
  subtitle?: string | React.ReactElement;
  isOpened?: boolean;
  children?: JSX.Element[] | JSX.Element | React.ReactElement;
}

const defaultProps: AccordionProps = {
  className: "",
  classNameHead: "",
  title: "",
  subtitle: undefined,
  isOpened: false,
  children: undefined,
};

const Accordion = ({
  className,
  classNameHead,
  title,
  subtitle,
  isOpened,
  children,
}: AccordionProps) => {
  const [isActive, setActive] = useState(isOpened);
  return (
    <div className={className}>
      <div className={styles.accordion}>
        <div
          className={cx(
            classNameHead,
            commons.clickable,
            styles.accordionTitle
          )}
          onClick={() => setActive(!isActive)}
        >
          {title}
          <IconArrow
            style={{
              transform: isActive ? "rotate(-90deg)" : "rotate(90deg)",
              fill: "#4D5056",
            }}
          />
        </div>
        {subtitle}
      </div>
      {isActive && children}
    </div>
  );
};

Accordion.defaultProps = defaultProps;

export default Accordion;
