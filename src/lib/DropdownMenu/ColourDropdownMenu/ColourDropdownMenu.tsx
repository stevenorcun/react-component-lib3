/* eslint-disable import/no-cycle */
import React from 'react';
import cx from 'classnames';

import { STROKES_FILLS_COLORS } from '@/constants/graph-themes';
import { unhandle } from '@/utils/DOM';

import styles from './ColourDropdownMenu.scss';

/**
 * To avoid an inline function... maybe overkill
 *
 * @param {string} value Colour of the pellet
 * @param {Function} onClick Handler to be called on click
 */
const ColorButton = ({
  value,
  onClick,
  typeColor,
}: {
  value: string;
  onClick: (value: string) => void;
  typeColor?: string;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(value);
  };

  return (
    <div className={styles['colored-disc-area']} onMouseDown={handleClick}>
      <div
        className={cx(styles.buttonColor, {
          [styles.buttonColor__active]: typeColor === value,
        })}
      >
        {' '}
        <span
          className={styles['colored-disc']}
          style={{ backgroundColor: value }}
        >
          {value === 'transparent' && (
            <div className={styles.dividerTransparent} />
          )}
        </span>
      </div>
    </div>
  );
};

const ColourDropdownMenu = ({
  className,
  handleClick,
  typeColor,
}: {
  className?: string | {
    container?: string;
    title?: string;
    colorPicker?: string;
  };
  handleClick: (value: string) => void;
  typeColor?: string;
}) => {
  const cn = typeof className === 'string' ? { container: className } : className;
  return (
    <div
      className={cx(styles.contentColor, cn?.container)}
      onClick={unhandle}
    >
      <div className={cx(styles.title, cn?.title)}>Couleur</div>
      <div className={cx(styles['color-picker'], cn?.colorPicker)}>
        {STROKES_FILLS_COLORS.map((elem) => (
          <ColorButton
            key={elem}
            value={elem}
            onClick={handleClick}
            typeColor={typeColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColourDropdownMenu;
