import React from 'react';

import cx from 'classnames';
import styles from './styles.scss';

interface AuxProps {
  children: React.ReactNode;
  className?: string;
}

const defaultProps = {
  className: '',
};

const Container = ({ children, className }: AuxProps) => {
  return <div className={cx(styles.container, className)}>{children}</div>;
};

Container.defaultProps = defaultProps;

export default Container;
