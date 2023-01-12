import React, { useEffect, useState } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "../../../../components/Browser/NavBar/styles.scss";
import IconCross from "../../../../assets/images/icons/IconCross";
import IconSearch from "../../../../assets/images/icons/IconSearch";
import {
  BrowserTabType,
  IBrowserSearchTab,
} from "../../../../constants/browser-related";
import IconPhone from "../../../../assets/images/icons/IconPhone";
import Man from "../../../../assets/images/icons/entityTypes/Man";
import { getEntityStrIcon } from "../../../../constants/entity-related";
import { useAppSelector } from "../../../../store/hooks";
import { selectOntologyConfig } from "../../../../store/ontology";

interface BrowserSearchTabProps {
  tab: IBrowserSearchTab;
  tabIndex: number;
  isActive: boolean;
  onClick: Function;
  onClose: Function;
}
const BrowserNavBarTab = ({
  tab,
  tabIndex,
  isActive,
  onClick,
  onClose,
}: BrowserSearchTabProps) => {
  const [icon, setIcon] = useState<React.ReactNode | null>(null);
  const { ont } = useAppSelector(selectOntologyConfig);

  useEffect(() => {
    let Icon;
    switch (tab.type) {
      case BrowserTabType.Advanced:
        Icon = IconSearch;
        break;
      case BrowserTabType.Person:
        Icon = Man;
        break;
      case BrowserTabType.Phone:
        Icon = IconPhone;
        break;
      case BrowserTabType.EntityDetails:
        if (tab.activeEntity) {
          Icon = getEntityStrIcon(tab.activeEntity, ont);
        }
        break;
      case BrowserTabType.Simple:
      default:
        Icon = IconSearch;
    }
    if (Icon) setIcon(<Icon className={styles.SearchIcon} />);
  }, []);

  const handleTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(tabIndex);
  };

  const handleTabClosed = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(tabIndex);
  };

  return (
    <div
      key={tabIndex}
      className={cx(styles.SearchTab, commons.clickable, {
        [styles.Active]: isActive,
      })}
      onClick={handleTabClick}
    >
      {isActive && (
        <IconCross
          className={styles.CloseIcon}
          fill="#fff"
          onClick={handleTabClosed}
        />
      )}
      {icon}
      <span>{tab.label}</span>
    </div>
  );
};

export default BrowserNavBarTab;
