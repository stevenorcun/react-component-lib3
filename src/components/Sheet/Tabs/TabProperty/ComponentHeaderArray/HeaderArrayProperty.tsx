import React from 'react';
import cx from 'classnames';

import { iconArrow } from '@/utils/general';

import styles from './headerArrayProperty.scss';

const HeaderArrayProperty = ({
  isAllChecked,
  sortFn,
  isSort,
  checkedByCategory,
}: any) => {
  return (
    <div className={cx(styles.headerMain, styles.divider)}>
      <div className={cx(styles.entitled, styles.flexAlignCenter)}>
        <div className={styles.entitled__content}>
          <input
            type="checkbox"
            id="entitled"
            className={styles.checkbox}
            checked={isAllChecked}
            onClick={() => checkedByCategory()}
          />
          <label htmlFor="entitled">Intitulé</label>
        </div>
        <button type="button" onClick={() => sortFn('label')}>
          {iconArrow(isSort.label)}
        </button>
      </div>
      <span className={cx(styles.description, styles.flexAlignCenter)}>
        Valeur de confiance
        <button type="button" onClick={() => sortFn('description')}>
          {iconArrow(isSort.confidenceValue)}
        </button>
      </span>
      <span className={cx(styles.description, styles.flexAlignCenter)}>
        Source
        <button type="button" onClick={() => sortFn('description')}>
          {iconArrow(isSort.confidenceValue)}
        </button>
      </span>
      <span className={cx(styles.timestamp, styles.flexAlignCenter)}>
        Horodatage
        <button type="button" onClick={() => sortFn('timestamp')}>
          {iconArrow(isSort.timestamp)}
        </button>
      </span>
      <span className={cx(styles.geocoding, styles.flexAlignCenter)}>
        Nouveauté
        <button type="button" onClick={() => sortFn('geocoding')}>
          {iconArrow(isSort.geocoding)}
        </button>
      </span>
      <span className={cx(styles.tags, styles.flexAlignCenter)}>
        ###
        <button type="button" onClick={() => sortFn('tags')}>
          {iconArrow(isSort.tags)}
        </button>
      </span>
    </div>
  );
};

export default HeaderArrayProperty;
