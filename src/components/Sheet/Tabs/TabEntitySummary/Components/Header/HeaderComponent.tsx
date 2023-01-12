import React, { useEffect, useState } from "react";

import Options from "../../../../../../components/Options/Options";
import Settings from "../../../../../../pages/Dashboard/SettingsComponent/Settings";

import IconEllipsisH from "../../../../../../assets/images/icons/IconEllipsisH";
import IconSetting from "../../../../../../assets/images/icons/IconSettings";

import { SheetHeaderOptionsSummary } from "../../../../../../components/Sheet/Tabs/TabEntitySummary/Components/DetailSheetHeader";
import styles from "./header.scss";

export interface HeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string | undefined;
  options?: SheetHeaderOptionsSummary[];
  listProperties?: any;
  isVisibleOption?: any;
  customizable?: boolean;
  layout?: any[];
  handleDrop?: (e: { key: string; y: number }[]) => void;
}

const HeaderComponent = ({
  icon,
  title,
  subtitle,
  options,
  listProperties,
  isVisibleOption,
  handleDrop,
  layout,
  customizable = false,
}: HeaderProps) => {
  const [isOptions, setIsOptions] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const toggleOptions = () => {
    if (options) {
      setIsOptions(!isOptions);
    }
  };

  const toggleSettings = (e) => {
    e.stopPropagation();
    setIsOpenSettings(!isOpenSettings);
  };

  useEffect(() => {
    if (isOptions) document.addEventListener("click", toggleOptions);
    if (isOpenSettings) document.addEventListener("click", toggleSettings);
    return () => {
      document.removeEventListener("click", toggleOptions);
      document.removeEventListener("click", toggleSettings);
    };
  }, [isOptions, toggleSettings]);

  return (
    <>
      <div className={styles.HeaderComponent}>
        <div className={styles.HeaderComponentLeft}>
          {icon}
          <div className={styles.HeaderComponentContent}>
            <span className={styles.componentHeaderTitle}>{title}</span>
            <span className={styles.componentHeaderSubtitle}>{subtitle}</span>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          {customizable && (
            <>
              <button
                type="button"
                onClick={toggleSettings}
                className={styles.buttonSettings}
              >
                <IconSetting />
              </button>
              {isOpenSettings && (
                <Settings
                  list={listProperties}
                  isVisible={isVisibleOption}
                  top="-20px"
                  right="-350px"
                  handleDrop={handleDrop}
                  layout={layout}
                />
              )}
            </>
          )}
          {!!options && (
            <button type="button" onClick={toggleOptions}>
              <IconEllipsisH />
            </button>
          )}
        </div>
      </div>
      <div className={styles.divider} />
      {isOptions && options && <Options list={options} />}
    </>
  );
};

export default HeaderComponent;
