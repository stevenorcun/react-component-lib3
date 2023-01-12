import React, { useState } from "react";
import IconSortDown from "../../../assets/images/icons/IconSortDown";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import cx from "classnames";
import { IHistogramElementData } from "../../../components/Histogram/HistogramGroups/HistogramGroups";
import { CanImplementHistogramState } from "../../../store/shared/histogram";
import HistogramElement from "../HistogramElement/HistogramElement";
import styles from "./styles.scss";
import histogramElementStyles from "../HistogramElement/styles.scss";

interface HistogramGroupProps {
  propKey: string;
  className?: string;
  label?: string;
  isExpanded?: boolean;
  elements?: IHistogramElementData[];
  total?: number;
  totalLabel?: string;
  histogramHighlights: CanImplementHistogramState["histogramHighlights"];
  RowComponent?: React.ReactNode;
  onRowClick: (data: IHistogramElementData) => void;
  onDoubleClick: (
    e: React.MouseEvent,
    d: IHistogramElementData["entities"]
  ) => void;
  onContextMenu: (
    e: React.MouseEvent,
    d: IHistogramElementData["entities"]
  ) => void;
  onTotalClick?: (elements: IHistogramElementData[]) => void;
  onTotalDoubleClick?: (elements: IHistogramElementData[]) => void;
  onTotalContextMenu?: (
    event: React.MouseEvent,
    elements: IHistogramElementData[]
  ) => void;
}

const HistogramGroup = ({
  propKey,
  className = "",
  label,
  isExpanded = true,
  elements,
  total = 0,
  totalLabel = "",
  histogramHighlights,
  // @ts-ignore
  RowComponent = HistogramElement,
  onRowClick,
  onDoubleClick,
  onContextMenu,
  onTotalClick,
  onTotalDoubleClick,
  onTotalContextMenu,
}: HistogramGroupProps) => {
  const [isActive, setActive] = useState(isExpanded);

  const handleDoubleClick = (e: React.MouseEvent, d: IHistogramElementData) => {
    onDoubleClick(e, d.entities);
  };

  const handleContextMenu = (e: React.MouseEvent, d: IHistogramElementData) => {
    onContextMenu(e, d.entities);
  };

  const handleTotalClick = () => {
    if (elements) onTotalClick?.(elements);
  };

  const handleTotalDoubleClick = () => {
    if (elements) onTotalDoubleClick?.(elements);
  };
  const handleTotalContextMenu = (e: React.MouseEvent) => {
    if (elements) {
      handleTotalClick();
      onTotalContextMenu?.(e, elements);
    }
  };

  return (
    <div className={cx(styles.attributes, className)}>
      <div
        className={cx(commons.clickable, styles.attributeName)}
        onClick={() => setActive(!isActive)}
      >
        {label}
        &nbsp;
        <IconSortDown
          fill="#4D5056"
          className={cx({ [commons.RotateMinus90]: !isActive })}
        />
      </div>
      {isActive &&
        elements &&
        elements.map((data) => (
          // @ts-ignore
          <RowComponent
            key={`active-attr-${propKey}-${data.label}`}
            propKey={propKey}
            label={data.label}
            data={data}
            count={data.entities.length}
            percent={(data.entities.length * 100) / total}
            icon={data.icon}
            value={data.value}
            histogramHighlights={histogramHighlights}
            onClick={onRowClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
          />
        ))}
      {totalLabel && (
        // @ts-ignore
        <HistogramElement
          propKey="__totalLabel"
          className={histogramElementStyles.totalLabel}
          label={totalLabel}
          count={total}
          percent={100}
          onClick={handleTotalClick}
          onDoubleClick={handleTotalDoubleClick}
          onContextMenu={handleTotalContextMenu}
          isToggled={false}
        />
      )}
    </div>
  );
};

export default HistogramGroup;
