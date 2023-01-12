import React, { useState } from "react";

import IconEllipsisH from "../../assets/images/icons/IconEllipsisH";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface InfoBlockProps {
  className?: string;
  classNamePrefix?: string;
  icon?: React.ReactElement;
  title: string | React.ReactElement;
  subTitle?: string | React.ReactElement;
  hasShowMore?: boolean;
  showMoreSlot?: React.ReactElement;
  showMoreCount?: number;
  children?: React.ReactNode;
}

const defaultProps = {
  className: "",
  classNamePrefix: undefined,
  icon: undefined,
  subTitle: "",
  hasShowMore: false,
  showMoreSlot: undefined,
  showMoreCount: undefined,
  children: undefined,
};

const InfoBlock = ({
  className,
  classNamePrefix,
  icon,
  title,
  subTitle,
  hasShowMore,
  showMoreSlot,
  showMoreCount,
  children,
}: InfoBlockProps) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className={cx(styles.box, className)}>
      <div
        className={cx(styles.boxHeader, {
          [`${classNamePrefix}boxHeader`]: classNamePrefix,
        })}
      >
        <div className={cx(styles.boxBlock)}>
          <div>{icon}</div>
          <div
            className={cx(styles.boxTitle, {
              [`${classNamePrefix}boxTitle`]: classNamePrefix,
            })}
          >
            <span>{title}</span>
            {subTitle && (
              <span
                className={cx(styles.boxSubtitle, {
                  [`${classNamePrefix}boxSubtitle`]: classNamePrefix,
                })}
              >
                {subTitle}
              </span>
            )}
          </div>
        </div>
        <IconEllipsisH />
      </div>
      <div
        className={cx(styles.boxContent, {
          [`${classNamePrefix}boxContent`]: classNamePrefix,
        })}
      >
        {children}
        {hasShowMore && showMore && showMoreSlot}
      </div>
      {hasShowMore && (
        <div className={styles.showMore}>
          <span>
            Voir :{" "}
            <span
              role="button"
              tabIndex={0}
              className={cx(commons.clickable, commons.underline)}
              onClick={() => setShowMore(!showMore)}
              onKeyPress={() => setShowMore(!showMore)}
            >
              {!showMore && showMoreCount && <>{showMoreCount} de plus</>}
              {!showMore && !showMoreCount && <>plus</>}
              {showMore && <>moins</>}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

InfoBlock.defaultProps = defaultProps;

export default InfoBlock;
