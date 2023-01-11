import React from "react";
import cx from "classnames";
import Moment from "react-moment";

import { ENTITY_GENDER_DETAILS } from "@/constants/entity-related";

import IconTag from "@/assets/images/icons/IconTag";
import COUNTRY_DETAILS from "@/assets/images/icons/flags";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface BodyPropertyProps {
  data: any;
  category: string;
  index: number;
  oneChecked: any;
  isChecked: boolean;
}

const ComponentBodyProperty = ({
  data,
  category,
  index,
  oneChecked,
  isChecked,
}: BodyPropertyProps) => {
  // const dispatch = useAppDispatch();
  // const browserState = useAppSelector(selectBrowser);
  // const setSelectedProperty = (data) => {

  //   dispatch(selectProperty(data));
  //   if (
  //     browserState.activeBrowserTabIndex &&
  //     browserState?.tabs[browserState.activeBrowserTabIndex].isDrawerCollapsed
  //   ) {
  //     dispatch(toggleActiveTabDrawer());
  //   }
  // };

  return (
    <div key={data.entitled} className={styles.generalPropertyMainContentLigne}>
      <div className={styles.generalPropertyMainContentEntitled}>
        <div>
          <input
            type="checkbox"
            id="entitled"
            checked={isChecked}
            className={styles.generalPropertyMainCheckbox}
            onChange={() => oneChecked(category, index, isChecked)}
          />
          <label
            htmlFor="entitled"
            title={data.value}
            className={cx(styles.entitled, {
              [styles.descriptionKeyWord]: data.title === "Mots-clés",
            })}
          >
            {category === "sex"
              ? ENTITY_GENDER_DETAILS[data.label].label
              : category === "nationalities"
              ? COUNTRY_DETAILS[data.label]?.label
              : data.label}
          </label>
        </div>
      </div>
      <p className={styles.generalPropertyMainContentDescription}>
        {data.description ? data.description : "-"}
      </p>
      <div>{data.source}</div>
      <span className={styles.generalPropertyMainContentTimestamp}>
        {data.timestamp && (
          <Moment format="DD/MM/YYYY">{new Date(data.timestamp)}</Moment>
        )}
      </span>
      <span className={styles.generalPropertyMainContentGeocoding}>
        {data.geocoding}
      </span>
      <span className={styles.generalPropertyMainContentTags}>
        {data.tags && data.tags.length > 0 ? (
          <div
            className={cx(commons.clickable, styles.tag)}
            // onClick={() =>
            //   setSelectedProperty({
            //     title: category,
            //     data,
            //   })
            // }
          >
            <IconTag fill="#3083F7" />
            {data.tags.length}
          </div>
        ) : (
          <div
            className={cx(commons.clickable, styles.tag)}
            // onClick={() =>
            //   setSelectedProperty({
            //     title: category,
            //     data,
            //   })
            // }
          >
            <IconTag fill="#3083F7" />
          </div>
        )}
      </span>
    </div>
  );
};

export default ComponentBodyProperty;
