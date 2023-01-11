/* eslint-disable no-nested-ternary */
import React from 'react';
import cx from 'classnames';

import styles from './footer.scss';

interface PropsRelatedFooter {
  numberData?: number;
  isExpanded: boolean;
  setIsExpanded: (bool: boolean) => void;
}

const RelatedFooter = ({
  numberData = 0,
  isExpanded,
  setIsExpanded,
}: PropsRelatedFooter) => {
  const isAllDisabled = numberData < 6;
  return (
    <>
      <div className={styles.divider} />
      <div className={styles.relatedFooter}>
        <p>
          Voir :
          <button
            disabled={isAllDisabled ? true : !isExpanded}
            type="button"
            onClick={() => setIsExpanded(false)}
            className={cx({
              [styles.button__disable]: isAllDisabled || !isExpanded,
            })}
          >
            Moins
          </button>
          <span className={styles.relatedFooterRound} />
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            disabled={isAllDisabled ? true : isExpanded}
            className={cx({
              [styles.button__disable]: isAllDisabled || isExpanded,
            })}
          >
            Tout
          </button>
        </p>
      </div>
    </>
  );
};

export default RelatedFooter;
