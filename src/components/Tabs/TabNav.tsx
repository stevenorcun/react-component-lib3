import React from 'react';

import cx from 'classnames';
import styles from './styles.scss';

interface TabNavProps {
  className?: string;
  classNamePrefix?: string;
  tabs: {
    key: string;
    title: string | React.ReactElement;
  }[];
  navigation: string | undefined;
  setNavigation: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const defaultProps = {
  className: undefined,
  classNamePrefix: undefined,
};

const TabNav = ({
  navigation,
  setNavigation,
  tabs,
  className,
  classNamePrefix,
}: TabNavProps) => {
  return (
    <div
      className={cx(styles.tabs, className, {
        [`${classNamePrefix}tabs`]: classNamePrefix,
      })}
    >
      <nav>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setNavigation(tab.key)}
            className={cx({
              [styles.active]: navigation === tab.key,
              [`${classNamePrefix}active`]:
                classNamePrefix && navigation === tab.key,
            })}
          >
            {tab.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

TabNav.defaultProps = defaultProps;

export default TabNav;
