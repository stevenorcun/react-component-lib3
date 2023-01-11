import React, { useEffect } from 'react';
import cx from 'classnames';
import styles from './DropdownMenu.scss';

interface DropMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  _style: React.CSSProperties;
  handleClose: (event: MouseEvent) => void;
}

const DropdownMenu = ({
  isOpen,
  children,
  _style,
  handleClose,
}: DropMenuProps) => {
  useEffect(() => {
    if (isOpen) document.addEventListener('click', handleClose);

    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdown} style={_style}>
      <div
        className={cx(styles['dropdown-content'], { [styles.show]: isOpen })}
      >
        {children}
      </div>
    </div>
  );
};

export const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <a href="#">{children}</a>
);

export default DropdownMenu;
