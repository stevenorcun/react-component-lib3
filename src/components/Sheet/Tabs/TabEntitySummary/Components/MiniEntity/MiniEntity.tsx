import React from "react";
import {
  DocumentSummary,
  EntityDto,
  EntitySummary,
  EventSummary,
  FileSummary,
} from "@/API/DataModels/Database/NovaObject";
import { ENTITY_TYPE_DETAILS } from "@/constants/entity-related";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

const MiniEntity = ({
  entity,
}: {
  entity:
    | EntityDto
    | EntitySummary["value"]
    | EventSummary["value"]
    | DocumentSummary["value"]
    | FileSummary["value"];
}) => {
  const details = ENTITY_TYPE_DETAILS[entity.type];

  return (
    <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
      <span className={styles.Icon}>{details?.icon}</span>
      <span className={styles.Label}>{entity.label}</span>
    </div>
  );
};

export default MiniEntity;
