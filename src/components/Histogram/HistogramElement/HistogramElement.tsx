// @ts-nocheck
import React from "react";
import cx from "classnames";
import { unhandle } from "@/utils/DOM";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { IHistogramElementData } from "@/components/Histogram/HistogramGroups/HistogramGroups";
import {
  ENTITY_PROPERTY_DETAILS,
  EntityPropertyMappedDetails,
} from "@/constants/entity-related";
import { CanImplementHistogramState } from "@/store/shared/histogram";
import styles from "./styles.scss";

interface HistogramElementProps {
  propKey: string;
  className?: string;
  label?: string; // repetitive if data.label exists, but used for "total" rows...
  count?: number;
  percent?: number;
  isToggled: boolean;
  data?: IHistogramElementData;
  icon?: string | null;
  histogramHighlights: CanImplementHistogramState["histogramHighlights"];
  onClick?: (data: IHistogramElementData) => void;
  onDoubleClick?: (e: React.MouseEvent, d: IHistogramElementData) => void;
  onContextMenu?: (e: React.MouseEvent, d: IHistogramElementData) => void;
  renderer?: EntityPropertyMappedDetails["customPropertyRenderer"];
}

const HistogramElement = ({
  propKey,
  label = "",
  data,
  className,
  count = 0,
  percent = 0,
  isToggled = false,
  icon,
  onClick,
  onDoubleClick,
  onContextMenu,
  renderer,
}: HistogramElementProps) => {
  const handleClick = (_: React.MouseEvent) => {
    onClick?.(data);
  };
  const handleDoubleClick = (e: React.MouseEvent) => {
    onDoubleClick?.(e, data);
  };
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isToggled && onClick && data) onClick(data);
    onContextMenu?.(e, data);
  };

  // TODO: verifier si c'est normal qu'il n'y ait pas d'icone ici dans le figma.
  // https://www.figma.com/file/3DvB8mxulwe3HS9Tb4aei0/%F0%9F%8E%A8-~-Design-System~?node-id=3143%3A61401
  const Icon = null; //ICON_STORE[data?.icon];

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={cx(styles.attribute, className, {
        [commons.clickable]: !!onClick,
        [styles.isToggled]: isToggled,
      })}
    >
      <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
        {renderer ? (
          renderer(label)
        ) : (
          <>
            {Icon && <Icon />}
            &nbsp;
            {label}
          </>
        )}
      </div>
      <div className={styles.attributeValue}>
        {count}
        <div className={styles.BarContainer}>
          <div
            className={styles.bar}
            onClick={unhandle}
            onDoubleClick={handleDoubleClick}
          >
            <div className={styles.loadBar} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HistogramNovaEntityType = ({
  propKey,
  className,
  label = "",
  count = 0,
  percent = 0,
  isToggled,
  data,
  onClick,
  onDoubleClick,
  onContextMenu,
  histogramHighlights,
}: HistogramElementProps) => {
  if (!data) return null;

  const handleClick = (d: IHistogramElementData) => {
    onClick?.(d);
    // dispatch(
    //  toggleAuxiliaryHistogramHighlightedTypes(data.value as NovaEntityType),
    // );
  };

  const handleDoubleClick = (e: React.MouseEvent, d: IHistogramElementData) => {
    onDoubleClick?.(e, d);
  };
  const handleContextMenu = (e: React.MouseEvent, d: IHistogramElementData) => {
    onContextMenu?.(e, d);
  };

  return (
    <HistogramElement
      propKey={propKey}
      className={className}
      label={label}
      percent={percent}
      count={count}
      isToggled={histogramHighlights.types[data.value]}
      data={data}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    />
  );
};

export const HistogramNovaEntityProperty = ({
  propKey,
  className,
  label = "",
  count = 0,
  percent = 0,
  data,
  icon = null,
  histogramHighlights,
  onClick,
  onDoubleClick,
  onContextMenu,
}: HistogramElementProps) => {
  // const graphState: GraphState = useAppSelector(selectGraph);
  // const dispatch = useAppDispatch();

  if (!data) return null;

  const handleClick = (d: IHistogramElementData) => {
    onClick?.(d);
    // dispatch(
    //   toggleAuxiliaryHistogramHighlightedProperty({
    //     histogramElementId: data.id,
    //     entities: data.entities,
    //   }),
    // );
  };

  const handleDoubleClick = (e: React.MouseEvent, d: IHistogramElementData) => {
    onDoubleClick?.(e, d);
  };
  const handleContextMenu = (e: React.MouseEvent, d: IHistogramElementData) => {
    onContextMenu?.(e, d);
  };

  return (
    <HistogramElement
      className={className}
      label={label}
      percent={percent}
      onClick={handleClick}
      count={count}
      isToggled={!!histogramHighlights.properties.rowIds[data.id]?.length}
      data={data}
      icon={icon}
      renderer={ENTITY_PROPERTY_DETAILS[propKey]?.customPropertyRenderer}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    />
  );
};

export default HistogramElement;
