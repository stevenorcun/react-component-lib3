/* eslint-disable max-len */
import React from "react";
import cx from "classnames";

import {
  EntityDto,
  RelatedSummary,
} from "@/API/DataModels/Database/NovaObject";
import DRAG_EVENT_TYPES from "@/constants/drag-events-types";

import styles from "./styles.scss";

interface DraggableRelatedSummaryProps {
  data: EntityDto | EntityDto[] | RelatedSummary | RelatedSummary[];
  children: React.ReactNode;
  initialObjects?: EntityDto | EntityDto[];
  className?: string;
  isEntity?: boolean;
}

const DraggableEntityOrSummary = ({
  data,
  children,
  className,
  initialObjects,
}: DraggableRelatedSummaryProps) => {
  const handleSummaryDragStart = async (e: React.DragEvent) => {
    e.stopPropagation();
    const dataArray = Array.isArray(data) ? data : [data];
    // @ts-ignore
    const result = initialObjects
      ? dataArray
          .map((element) =>
            // @ts-ignore
            initialObjects?.filter((el) => el.MOTS_CLES === element.MOTS_CLES)
          )
          .flat()
      : dataArray;
    e.dataTransfer.setData(
      DRAG_EVENT_TYPES.searchResultEntity,
      JSON.stringify(result)
    );
  };

  return (
    <div
      draggable
      className={cx(styles.DraggableSummary, className)}
      onDragStart={handleSummaryDragStart}
    >
      {children}
    </div>
  );
};

export default DraggableEntityOrSummary;
