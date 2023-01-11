import styles from '@/components/TimelineWidget/styles.scss';
import IconSmallDots from '@/assets/images/icons/IconSmallDots';
import cx from 'classnames';
import React from 'react';

interface ModelLabelEventProps {
  name: string;
  idName: string;
  nameClass?: string;
  onChecked: React.ChangeEventHandler;
  isChecked: boolean;
  iconColor: string;
}

export const ModelLabelEvent = ({
  name,
  idName,
  nameClass,
  onChecked,
  isChecked,
  iconColor,
}: ModelLabelEventProps) => (
  <div className={styles.filter}>
    <IconSmallDots fill="#D2D3D4" />
    <input
      type="checkbox"
      checked={isChecked}
      id={idName}
      onChange={onChecked}
    />
    <label htmlFor={idName} aria-describedby="label">
      <span
        style={{ backgroundColor: iconColor }}
        className={cx(styles.filterCircle, nameClass)}
      />
      <div className={styles.filterName}>{name}</div>
    </label>
  </div>
);
