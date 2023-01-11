import React from 'react';
import cx from 'classnames';

import { iconArrow } from '@/utils/general';
import styles from './headerArray.scss';

const HeaderArray = ({ sortFn, isSort, type, checkedByCategory }: any) => {
  return (
    <div>
      <div
        className={cx(
          styles.generalPropertyMainContentTitle,
          styles.generalPropertyMainContentDivider
        )}
      >
        <div
          className={cx(
            styles.generalPropertyMainContentType,
            styles.flexAlignCenter
          )}
        >
            {/* <input
              type="checkbox"
              id="entitled"
              onChange={() => checkedByCategory(type)}
              className={styles.generalPropertyMainCheckbox}
            />
            <label htmlFor="entitled">Type de lien</label>
          </div> */}
          Type de lien
          <button type="button" onClick={() => sortFn('typeLink', type, 'type')}>
            {iconArrow(isSort[type].type)}
          </button>
        </div>
        <span
          className={cx(
            styles.generalPropertyMainContentEmail,
            styles.flexAlignCenter,
            styles.headerTitle
          )}
        >
          Objet
          <button
            className={styles.flexAlignCenter}
            type="button"
            onClick={() => sortFn('object', type, 'label')}
          >
            {iconArrow(isSort[type].label)}
          </button>
        </span>


        <span
          className={cx(
            styles.generalPropertyMainContentQuotation,
            styles.flexAlignCenter,
            styles.headerTitle
          )}
        >
          Valeur de confiance
          <button type="button" onClick={() => sortFn('confidenceValue', type, 'confidenceValue')}>
            {iconArrow(isSort[type].confidenceValue)}
          </button>
        </span>
        <span
          className={cx(
            styles.generalPropertyMainContentStartDate,
            styles.headerTitle,
            styles.flexAlignCenter
          )}
        >
          Date de début
          <button type="button" onClick={() => sortFn('startDate', type, 'startDate')}>
            {iconArrow(isSort[type].startDate)}
          </button>
        </span>
        <span
          className={cx(
            styles.generalPropertyMainContentEndDate,
            styles.flexAlignCenter,
            styles.headerTitle
          )}
        >
          Date de fin
          <button type="button" onClick={() => sortFn('endDate', type, 'endDate')}>
            {iconArrow(isSort[type].endDate)}
          </button>
        </span>
        {/* <span
          className={cx(
            styles.generalPropertyMainContentLinkText,
            styles.headerTitle,
            styles.flexAlignCenter
          )}
        >
          Texte de lien
          <button type="button" onClick={() => sortFn('linkText', type)}>
            {iconArrow(isSort[type].linkText)}
          </button>
        </span> */}
      </div>
    </div>
  );
};

export default HeaderArray;
