import React from 'react';
import styles from './styles.scss';

interface AuxProps {
  children: React.ReactNode;
}

const Layout = ({ children }: AuxProps) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Layout;
