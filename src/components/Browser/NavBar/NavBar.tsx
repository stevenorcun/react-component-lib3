import React from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconPlus from "../../../assets/images/icons/IconPlus";
import BrowserNavBarTab from "../../../components/Browser/NavBar/Tab/Tab";
import { IBrowserSearchTab } from "../../../constants/browser-related";
import styles from "./styles.scss";

interface AuxProps {
  handleTabClosed: (index: number) => void;
  handleTabClicked: (index: number | null) => void;
  activeTabIndex: number | null;
  tabs: IBrowserSearchTab[];
}

const BrowserNavBar = ({
  handleTabClosed,
  handleTabClicked,
  activeTabIndex,
  tabs,
}: AuxProps) => {
  const openNewTab = (): void => handleTabClicked(null);

  return (
    <div className={cx(styles.SearchNavigation, commons.PrettyScroll)}>
      {tabs.map((tab, i) => (
        <BrowserNavBarTab
          key={i}
          tab={tab}
          tabIndex={i}
          isActive={activeTabIndex === i}
          onClick={handleTabClicked}
          onClose={handleTabClosed}
        />
      ))}

      <div
        className={cx(commons.clickable, styles.NewTabButton)}
        onClick={openNewTab}
      >
        <IconPlus width={12} height={12} />
      </div>
    </div>
  );
};

export default BrowserNavBar;
