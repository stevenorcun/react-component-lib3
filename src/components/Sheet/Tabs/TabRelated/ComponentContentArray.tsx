import React from "react";

import styles from "./related.scss";

const ContentArray = ({ related, isChecked, oneChecked, type, index }: any) => (
  <div className={styles.generalPropertyMainContent}>
    {related && (
      <div key={related.id} className={styles.generalPropertyMainContentLigne}>
        <div className={styles.generalPropertyMainContentType}>
          <div className={styles.generalPropertyMainContentType__label}>
            {/* <input
                type="checkbox"
                id="type"
                checked={isChecked}
                onChange={() => oneChecked(type, index)}
                className={styles.generalPropertyMainCheckbox}
              />
              <label
                htmlFor="type"
                className={styles.generalPropertyMainContentType__label}
              >
              </label> */}
            {related.typeLink}
          </div>
        </div>
        <div className={styles.generalPropertyMainContentEmail}>
          <span className={styles.generalPropertyMainContentEmail__text}>
            {related.object}
          </span>
        </div>
        <div className={styles.generalPropertyMainContentConfidenceValue}>
          <span className={styles.generalPropertyMainContentEmail__text}>
            {related.confidenceValue}
          </span>
        </div>
        <span className={styles.generalPropertyMainContentStartDate}>
          {related.startDate}
        </span>
        <span className={styles.generalPropertyMainContentEndDate}>
          {related.endDate}
        </span>
      </div>
    )}
  </div>
);

export default ContentArray;
