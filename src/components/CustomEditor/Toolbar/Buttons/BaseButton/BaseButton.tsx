import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

interface BaseButtonProps {
  className?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: any;
  icon?: React.ReactNode;
  tooltip?: string;
}

const BaseButton = ({
  className,
  active = false,
  disabled = false,
  onClick,
  icon,
  tooltip,
}: BaseButtonProps) => {
  const click = (e) => {
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      type="button"
      className={cx(styles.styleButton, className, {
        [styles.activeButton]: active,
        [styles.disabledButton]: disabled,
      })}
      onMouseDown={click}
      title={tooltip}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default BaseButton;
