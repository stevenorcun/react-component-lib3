import React from "react";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import cx from "classnames";
import { EntityDto } from "../../../API/DataModels/Database/NovaObject";
import { NovaEntityType } from "../../../API/DataModels/Database/NovaEntityEnum";
import { unhandle } from "../../../utils/DOM";
import IconClean from "../../../assets/images/icons/IconClean";
import styles from "./styles.scss";

export interface IHistogramElementData {
  id: string; // used for store toggles
  label: string;
  value: NovaEntityType | string; // use T
  icon?: React.ReactNode;
  entities: Partial<EntityDto>[];
}

export interface IHistogramGroupData {
  label: string;
  totalLabel?: string;
  total: number;
  isExpanded?: boolean;
  values: IHistogramElementData[];
  propKey: string;
}

interface HistogramGroupsProps {
  className?: string;
  label?: string;
  children?: React.ReactNode;
  onClear?: React.MouseEventHandler;
}

const HistogramGroups = ({
  className,
  label = "",
  children,
  onClear = unhandle,
}: HistogramGroupsProps) => (
  <div className={cx(className)}>
    <div className={cx(commons.clickable, styles.groupName)}>
      {label}
      <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
        <div
          className={cx(commons.Flex, styles.ClearHighlights)}
          onClick={onClear}
        >
          <IconClean />
          <span>Nettoyer la sélection</span>
        </div>
      </div>
    </div>
    {children}
  </div>
);

export default HistogramGroups;
