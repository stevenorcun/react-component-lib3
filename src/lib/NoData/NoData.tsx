import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const NoData = ({
  children,
  className,
}: {
  children: React.ReactNode,
  className?: string,
}) => (
  <div className={cx(styles.NoData, className)}>
    {children}
  </div>
);

export default NoData;
