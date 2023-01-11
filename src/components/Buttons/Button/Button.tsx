import React, { MouseEventHandler } from 'react';

import cx from 'classnames';
import styles from './styles.scss';

interface ButtonProps {
  className?: string;
  type?: 'primary' | 'secondary' | 'tertiary';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean
}

const defaultProps = {
  className: undefined,
  type: 'primary',
  onClick: undefined,
  disabled: false,
};

const Button = ({
  className, type, onClick, children, disabled,
}: ButtonProps) => {
  const buttonType = type || 'primary';
  return (
    <button
      className={cx(className, styles.button, styles[buttonType])}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
