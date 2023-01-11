import React from "react";

import { EntityDto } from "@/API/DataModels/Database/NovaObject";

import CaseBlockDescription from "@/pages/Case/CaseBlocks/CaseBlockDescription/CaseBlockDescription";
import CaseBlockTarget from "@/pages/Case/CaseBlocks/CaseBlockTarget/CaseBlockTarget";
import CaseBlockTeam from "@/pages/Case/CaseBlocks/CaseBlockTeam/CaseBlockTeam";
import CaseBlockLists from "@/pages/Case/CaseBlocks/CaseBlockLists/CaseBlockLists";
import CaseBlockCheckList from "@/pages/Case/CaseBlocks/CaseBlockCheckList/CaseBlockCheckList";

import cx from "classnames";
import styles from "./styles.scss";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

const TabCaseSummary = ({ entity }: EntityDto) => {
  return (
    <div className={cx(styles.mainContent, commons.PrettyScroll)}>
      <div
        className={cx(
          styles.flex_66,
          styles.principalColumnContainer,
          styles.blockContainer
        )}
      >
        <div className={styles.flex_50}>
          <CaseBlockDescription
            value={
              entity && entity.description
                ? entity?.description.value
                : undefined
            }
            createdAt={
              entity && entity.description
                ? entity?.description.createdAt
                : undefined
            }
          />
        </div>
        <div className={styles.flex_50}>
          <CaseBlockTarget targets={entity?.targets} />
        </div>
        {/* <div className={styles.flex_100}>
          <CaseBlockSummaryActivity />
        </div> */}
      </div>
      <div className={styles.flex_33}>
        <div
          className={cx(
            // @ts-ignore
            styles.sideColumnContainer,
            styles.blockContainer
          )}
        >
          <CaseBlockTeam agents={entity?.employeesInvolved} />
          <CaseBlockCheckList checkList={entity?.checkList} />
          <CaseBlockLists lists={entity?.lists} />
        </div>
      </div>
    </div>
  );
};

export default TabCaseSummary;
