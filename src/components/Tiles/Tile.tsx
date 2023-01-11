import React, { useState } from "react";
import cx from "classnames";
import { toast } from "react-toastify";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  PINS_OFFSETS,
  selectGraph,
  setGraphFocus,
  setGraphSelection,
  setSelectedAnnotations,
  toggleGraphSelection,
  translateSelectedElements,
} from "@/store/graph";
import { selectOntologyConfig } from "@/store/ontology";
import { preventDefault } from "@/utils/DOM";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import { NovaEntityType } from "@/API/DataModels/Database/NovaEntityEnum";
import DRAG_EVENT_TYPES from "@/constants/drag-events-types";
import { getEntityStrIcon } from "@/constants/entity-related";
import ModalTypes from "@/constants/modal";
import { useGlobalModalContext } from "@/hooks/useGlobalModal";

import flagsIcon from "@/assets/images/icons/flags";
import IconIdCard from "@/assets/images/icons/IconIdCard";
import IconGeoSlim from "@/assets/images/icons/IconGeoSlim";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import Pin from "./Pin";
import styles from "./styles.scss";

interface TileProps {
  entity: EntityDto;
  isContextMenuOpen: boolean;
  children?: React.ReactNode;
  className?: string;
  pinsColor?: string;
  position?: {
    x: number;
    y: number;
  };
  scale?: number;
  isSelected?: boolean;
  isDraggable?: boolean;
  selectionTogglable?: boolean;
  isLinkCreatable?: boolean;
  isHighlighting?: boolean;
  isHighlighted?: boolean;
  onMove?: () => void;
  onContextMenu?: (x, y, width, height, idx: string) => void;
  setIsContextMenuOpen?: (bool: boolean) => void;
}

const Tile = ({
  entity,
  pinsColor = "white",
  children,
  className,
  isContextMenuOpen,
  position,
  scale,
  isSelected,
  isDraggable = true,
  selectionTogglable = true,
  isLinkCreatable = true,
  isHighlighting = false,
  isHighlighted = false,
  onMove,
  onContextMenu,
  setIsContextMenuOpen,
}: TileProps) => {
  const graphState = useAppSelector(selectGraph);
  const { ont } = useAppSelector(selectOntologyConfig);
  const dispatch = useAppDispatch();

  const [isDragging, setIsDragging] = useState(false);

  const { showModal } = useGlobalModalContext();

  const Nationality =
    entity.nationalities && flagsIcon[entity.nationalities[0]] ? (
      <foreignObject width={650} height={500}>
        <img
          draggable={false}
          className={commons.UserSelectNone}
          alt={flagsIcon[entity.nationalities[0]].label}
          src={flagsIcon[entity.nationalities[0]].icon}
        />
      </foreignObject>
    ) : null;

  const Location =
    entity.location && flagsIcon[entity.location] ? (
      <foreignObject width={650} height={500}>
        <img
          draggable={false}
          className={commons.UserSelectNone}
          alt={flagsIcon[entity.location].label}
          src={flagsIcon[entity.location].icon}
        />
      </foreignObject>
    ) : null;

  const moveBy = (xUp: number, yUp: number) => {
    dispatch(translateSelectedElements({ x: xUp, y: yUp }));
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (!selectionTogglable) {
      return;
    }
    if (setIsContextMenuOpen) {
      setIsContextMenuOpen(false);
    }

    if (isDragging) return;

    // Unselect all unless Ctrl clicking
    if (event.ctrlKey) {
      dispatch(setGraphFocus(entity.id));
      dispatch(toggleGraphSelection(entity.id));
    } else {
      dispatch(setGraphFocus(entity.id));
      dispatch(setGraphSelection([entity.id]));
      dispatch(setSelectedAnnotations({}));
    }
  };

  const updatePos = (event: DraggableEvent, data: DraggableData) => {
    event.stopPropagation();
    // semi-useless:
    // If Draggable isn't disabled, the div can still be dragged
    // (but will reset on dragEnd because of this condition here)
    if (!isDragging) return;

    const delta = {
      x: 10 * Math.round(data.deltaX / 10),
      y: 10 * Math.round(data.deltaY / 10),
    };
    if (isSelected) moveBy(delta.x, delta.y);
  };

  const handleDrag = (event: DraggableEvent, data: DraggableData) => {
    if (isContextMenuOpen && setIsContextMenuOpen) setIsContextMenuOpen(false);
    if (!isDraggable) return;
    // @ts-ignore
    if (!isSelected) handleSelection(event);
    // @ts-ignore
    else if (isSelected && event.ctrlKey) handleSelection(event);
    setIsDragging(true);
    updatePos(event, data);
  };

  const handleDragEnd = (event: DraggableEvent, data: DraggableData) => {
    if (!isDraggable) return;
    updatePos(event, data);
    // @ts-ignore
    if (!isDragging) handleSelection(event);
    setIsDragging(false);
    onMove?.();
  };

  const splitName = () => {
    const name = entity.label.split(" ");
    if (name.length === 2) return name;
    const halfLength = entity.label.length / 2;
    const split: string[] = [];
    let i = 0;
    for (
      let len = 0;
      i < name.length - 1 && len < halfLength;
      // @ts-ignore
      i++, len += !i + name[i].length
    );
    split.push(name.slice(0, i).join(" "));
    split.push(name.slice(i).join(" "));
    return split;
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (onContextMenu) {
      onContextMenu(
        graphState.entityGraphPropertiesMap[entity.id].x,
        graphState.entityGraphPropertiesMap[entity.id].y,
        134,
        193,
        entity.id
      );
    }
  };

  const openModal = (entityFrom: string, entityTo: string) => {
    showModal(ModalTypes.LINK, {
      entityFrom,
      entityTo,
      type: "link",
    });
  };

  const handleDropOnTile = (e: React.DragEvent) => {
    if (!isLinkCreatable) {
      return;
    }
    // Allow drop
    e.preventDefault();

    e.stopPropagation();
    const rawData = e.dataTransfer.getData(
      DRAG_EVENT_TYPES.createGraphConnection
    );
    if (rawData) {
      try {
        const fromId = JSON.parse(rawData);

        if (fromId === entity.id)
          toast.error("Impossible de lier une entité à elle-même");
        else if (graphState.selection.length > 1) {
          toast.warning("Veuillez sélectionner une seule entité");
        } else {
          openModal(fromId, entity.id);
        }
      } catch (err: unknown) {
        console.error(
          "Error while attempting to create a Graph connection (by drop)."
        );
      }
    }
  };

  const Icon = getEntityStrIcon(entity, ont);

  return (
    <Draggable
      grid={
        isSelected
          ? [10 * graphState.graphScale, 10 * graphState.graphScale]
          : [0, 0]
      }
      bounds={{
        left: -2147483648,
        top: -2147483648,
        right: 2147483647,
        bottom: 2147483647,
      }}
      handle=".handle"
      position={position || graphState.entityGraphPropertiesMap[entity.id]}
      scale={scale || graphState.graphScale}
      onStart={handleDrag}
      onDrag={handleDrag}
      onStop={handleDragEnd}
    >
      <g
        className={cx("handle", className, {
          [styles.tileTransition]: graphState.isPlayingTransition,
        })}
      >
        <g>
          <g className={commons.UserSelectNone}>
            <g className={cx(commons.PointerEventsNone, styles.tile)}>
              <rect
                x="0"
                y="0"
                width="134"
                height="193"
                rx="5"
                fill={graphState.entityGraphPropertiesMap[entity.id]?.fill}
                strokeWidth="5"
                onMouseUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <title>{entity.label}</title>
              </rect>
            </g>
            {entity.avatar ? (
              <image
                x="14"
                y="32"
                width="106"
                mask="url(#imagemask)"
                xlinkHref={entity.avatar?.value?.path}
                className={commons.PointerEventsNone}
              />
            ) : (
              <foreignObject
                className={cx(commons.PointerEventsNone, styles.Avatar)}
                transform="translate(30, 50)"
              >
                <g
                  style={{
                    fill: graphState.entityGraphPropertiesMap[entity.id]
                      ?.iconColor,
                  }}
                >
                  {Icon && <Icon />}
                </g>
              </foreignObject>
            )}
            {entity.status === "prison" && (
              <g transform="translate(14, 32)">
                <rect x="2" y="82" width="102" height="22" fill="#3083F7" />
                <path
                  d="M42.511 98H37.847V90.146H42.511V91.851H39.97V93.083H42.324V94.788H39.97V96.273H42.511V98ZM47.5691 91.807C48.1998 91.807 48.7131 91.983 49.1091 92.335C49.5051 92.687 49.7031 93.2553 49.7031 94.04V98H47.6021V94.678C47.6021 94.2747 47.5434 93.9703 47.4261 93.765C47.3088 93.5597 47.1218 93.457 46.8651 93.457C46.4691 93.457 46.2014 93.6183 46.0621 93.941C45.9301 94.2637 45.8641 94.7293 45.8641 95.338V98H43.7631V91.917H45.3471L45.6331 92.72H45.7101C45.9008 92.434 46.1501 92.2103 46.4581 92.049C46.7734 91.8877 47.1438 91.807 47.5691 91.807ZM57.7077 91.807C58.3823 91.807 58.9103 92.0783 59.2917 92.621C59.673 93.1563 59.8637 93.93 59.8637 94.942C59.8637 95.6313 59.7647 96.2143 59.5667 96.691C59.376 97.1603 59.112 97.516 58.7747 97.758C58.4447 97.9927 58.067 98.11 57.6417 98.11C57.2163 98.11 56.8827 98.033 56.6407 97.879C56.406 97.725 56.2227 97.5673 56.0907 97.406H56.0247C56.0393 97.5453 56.054 97.6957 56.0687 97.857C56.0833 98.0183 56.0907 98.2053 56.0907 98.418V100.64H53.9897V91.917H55.6947L55.9917 92.687H56.0907C56.2373 92.4523 56.4353 92.247 56.6847 92.071C56.9413 91.895 57.2823 91.807 57.7077 91.807ZM56.9157 93.457C56.6077 93.457 56.395 93.567 56.2777 93.787C56.1677 94.007 56.1053 94.3333 56.0907 94.766V94.931C56.0907 95.415 56.1493 95.7853 56.2667 96.042C56.384 96.2913 56.604 96.416 56.9267 96.416C57.1907 96.416 57.3887 96.3023 57.5207 96.075C57.66 95.8403 57.7297 95.4553 57.7297 94.92C57.7297 94.3847 57.66 94.007 57.5207 93.787C57.3813 93.567 57.1797 93.457 56.9157 93.457ZM64.732 91.807C64.8494 91.807 64.9704 91.8143 65.095 91.829C65.2197 91.8437 65.3114 91.8583 65.37 91.873L65.183 93.853C65.1097 93.8383 65.018 93.8237 64.908 93.809C64.8054 93.7943 64.6587 93.787 64.468 93.787C64.292 93.787 64.1014 93.8127 63.896 93.864C63.698 93.9153 63.5257 94.029 63.379 94.205C63.2324 94.3737 63.159 94.6413 63.159 95.008V98H61.058V91.917H62.62L62.95 92.885H63.049C63.2177 92.5843 63.4524 92.3313 63.753 92.126C64.061 91.9133 64.3874 91.807 64.732 91.807ZM67.2813 89.464C67.5819 89.464 67.8423 89.5263 68.0623 89.651C68.2896 89.7757 68.4033 90.025 68.4033 90.399C68.4033 90.7583 68.2896 91.004 68.0623 91.136C67.8423 91.2607 67.5819 91.323 67.2813 91.323C66.9733 91.323 66.7093 91.2607 66.4893 91.136C66.2766 91.004 66.1703 90.7583 66.1703 90.399C66.1703 90.025 66.2766 89.7757 66.4893 89.651C66.7093 89.5263 66.9733 89.464 67.2813 89.464ZM68.3263 91.917V98H66.2253V91.917H68.3263ZM74.3124 96.13C74.3124 96.5113 74.2244 96.8523 74.0484 97.153C73.8798 97.4537 73.6048 97.6883 73.2234 97.857C72.8494 98.0257 72.3544 98.11 71.7384 98.11C71.3058 98.11 70.9171 98.0843 70.5724 98.033C70.2351 97.989 69.8904 97.901 69.5384 97.769V96.086C69.9271 96.262 70.3194 96.3903 70.7154 96.471C71.1114 96.5443 71.4231 96.581 71.6504 96.581C72.1051 96.581 72.3324 96.4783 72.3324 96.273C72.3324 96.185 72.2958 96.108 72.2224 96.042C72.1491 95.976 72.0171 95.9027 71.8264 95.822C71.6431 95.7413 71.3791 95.6313 71.0344 95.492C70.5284 95.2793 70.1508 95.0373 69.9014 94.766C69.6521 94.4873 69.5274 94.0987 69.5274 93.6C69.5274 93.006 69.7548 92.5587 70.2094 92.258C70.6714 91.9573 71.2801 91.807 72.0354 91.807C72.4388 91.807 72.8164 91.851 73.1684 91.939C73.5204 92.027 73.8871 92.1553 74.2684 92.324L73.6964 93.677C73.3958 93.5377 73.0914 93.4277 72.7834 93.347C72.4754 93.2663 72.2298 93.226 72.0464 93.226C71.7018 93.226 71.5294 93.3103 71.5294 93.479C71.5294 93.5523 71.5588 93.6183 71.6174 93.677C71.6834 93.7357 71.8044 93.8017 71.9804 93.875C72.1564 93.9483 72.4131 94.0547 72.7504 94.194C73.1024 94.3333 73.3921 94.4873 73.6194 94.656C73.8541 94.8173 74.0264 95.0153 74.1364 95.25C74.2538 95.4773 74.3124 95.7707 74.3124 96.13ZM81.282 94.942C81.282 95.9613 81.0107 96.746 80.468 97.296C79.9254 97.8387 79.181 98.11 78.235 98.11C77.6484 98.11 77.1277 97.989 76.673 97.747C76.2184 97.4977 75.859 97.1383 75.595 96.669C75.3384 96.1923 75.21 95.6167 75.21 94.942C75.21 93.9373 75.4814 93.1637 76.024 92.621C76.5667 92.0783 77.3147 91.807 78.268 91.807C78.8547 91.807 79.3717 91.928 79.819 92.17C80.2737 92.412 80.6294 92.7677 80.886 93.237C81.15 93.699 81.282 94.2673 81.282 94.942ZM77.344 94.942C77.344 95.4627 77.4137 95.8623 77.553 96.141C77.6924 96.4123 77.927 96.548 78.257 96.548C78.5797 96.548 78.807 96.4123 78.939 96.141C79.0784 95.8623 79.148 95.4627 79.148 94.942C79.148 94.4213 79.0784 94.029 78.939 93.765C78.807 93.501 78.576 93.369 78.246 93.369C77.9307 93.369 77.6997 93.501 77.553 93.765C77.4137 94.029 77.344 94.4213 77.344 94.942ZM86.284 91.807C86.9146 91.807 87.428 91.983 87.824 92.335C88.22 92.687 88.418 93.2553 88.418 94.04V98H86.317V94.678C86.317 94.2747 86.2583 93.9703 86.141 93.765C86.0236 93.5597 85.8366 93.457 85.58 93.457C85.184 93.457 84.9163 93.6183 84.777 93.941C84.645 94.2637 84.579 94.7293 84.579 95.338V98H82.478V91.917H84.062L84.348 92.72H84.425C84.6156 92.434 84.865 92.2103 85.173 92.049C85.4883 91.8877 85.8586 91.807 86.284 91.807Z"
                  fill="#fff"
                />
                <path
                  d="M16.9455 100.067V97.2666C16.6844 97.2666 16.4728 97.0576 16.4728 96.7999V91.2C16.4728 90.9422 16.6844 90.7333 16.9455 90.7333V87.9333H16.2364C16.1058 87.9333 16 87.8289 16 87.7V87.2333C16 87.1045 16.1058 87 16.2364 87H31.8376C31.9681 87 32.0739 87.1045 32.0739 87.2333V87.7C32.0739 87.8289 31.9681 87.9333 31.8376 87.9333H31.1284V100.067H31.8376C31.9681 100.067 32.0739 100.171 32.0739 100.3V100.767C32.0739 100.895 31.9681 101 31.8376 101H16.2364C16.1058 101 16 100.895 16 100.767V100.3C16 100.171 16.1058 100.067 16.2364 100.067H16.9455ZM19.3093 95.3999C19.4399 95.3999 19.5457 95.2955 19.5457 95.1666V94.1084C19.8283 93.947 20.0185 93.6454 20.0185 93.2999C20.0185 92.7845 19.5952 92.3666 19.073 92.3666C18.5508 92.3666 18.1274 92.7845 18.1274 93.2999C18.1274 93.6454 18.3176 93.947 18.6002 94.1084V95.1666C18.6002 95.2955 18.706 95.3999 18.8366 95.3999H19.3093ZM20.2549 97.2666H17.8911V100.067H20.2549V97.2666ZM17.8911 90.7333H20.2549V87.9333H17.8911V90.7333ZM21.2004 97.2666V100.067H23.5642V87.9333H21.2004V90.7333C21.4615 90.7333 21.6732 90.9422 21.6732 91.2V96.7999C21.6732 97.0576 21.4615 97.2666 21.2004 97.2666ZM24.5097 87.9333V100.067H26.8735V87.9333H24.5097ZM27.8191 87.9333V100.067H30.1829V87.9333H27.8191Z"
                  fill="#fff"
                />
                <rect
                  x="2.5"
                  y="2.5"
                  width="101"
                  height="101"
                  fill="none"
                  stroke="#3083F7"
                  strokeWidth="5"
                />
              </g>
            )}
            <g>
              {(entity.location || entity.nationalities?.length) && (
                <rect
                  clipPath="url(#headerClip)"
                  width="134"
                  fill="white"
                  height="31"
                  y="-1"
                />
              )}
              {entity.type === NovaEntityType.PhysicalPerson && (
                <IconIdCard transform="translate(10 10)" />
              )}
              {Nationality && (
                <g
                  transform="translate(37 10)scale(0.0296875)"
                  mask="url(#flagmask)"
                >
                  {Nationality}
                </g>
              )}
              {entity.nationalities?.length && entity.nationalities[0] && (
                <>
                  <rect
                    x="60"
                    y="10"
                    width="18"
                    height="13"
                    rx="3.21429"
                    fill="#EAF3FE"
                  />
                  <text
                    className={cx(commons.UserSelectNone)}
                    fill="#3083F7"
                    textAnchor="middle"
                    x="68.5"
                    y="20"
                    fontFamily="Noto Sans"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {entity.nationalities.length}
                  </text>
                </>
              )}
              {entity.location && <IconGeoSlim x={85} y={10} />}
              {Location && (
                <g
                  transform="translate(100 10)scale(0.0296875)"
                  mask="url(#flagmask)"
                >
                  {Location}
                </g>
              )}
            </g>
            <text
              // @ts-ignore
              className={cx(commons.UserSelectNone, styles.Label)}
              x="67"
              y="143"
              textAnchor="middle"
              fontFamily="Noto Sans"
              fontSize="11"
              fontWeight="bold"
              fill={graphState.entityGraphPropertiesMap[entity.id]?.textColor}
            >
              {splitName().map((txt: string, i: number) => (
                <tspan key={i} x="67" dy={11 * (i ? 1.2 : 1)}>
                  {txt}
                </tspan>
              ))}
            </text>
            {entity.subLabel && (
              <>
                <rect
                  x="12"
                  y="179"
                  width="109"
                  height="26"
                  rx="5"
                  fill={
                    graphState.entityGraphPropertiesMap[entity.id].strokeLabel
                  }
                />
                <text
                  className={cx(commons.UserSelectNone)}
                  x="67"
                  y="196"
                  textAnchor="middle"
                  fontFamily="Noto Sans"
                  fontSize="10"
                  fontWeight="bold"
                  fill={
                    graphState.entityGraphPropertiesMap[entity.id]
                      .textLabelColor
                  }
                >
                  {entity.subLabel}
                </text>
              </>
            )}
          </g>

          {children}
        </g>

        {/* HitBox, independent from UI for easier future changes
            (could be bigger than the Tile, or visible etc.) */}
        <rect
          x="-15"
          y="-15"
          stroke={
            (isSelected && !isHighlighting) || isHighlighted
              ? isHighlighted
                ? "orange"
                : "#3083F7"
              : "none"
          }
          className={cx(commons.clickable, styles.HitBox)}
          onDragOver={preventDefault}
          onDrop={handleDropOnTile}
          onContextMenu={handleContextMenu}
        />

        {((isSelected && !isHighlighting) || isHighlighted) &&
          PINS_OFFSETS.map((xy, i) => (
            <Pin
              key={i}
              parentPos={graphState.entityGraphPropertiesMap[entity.id]}
              parentId={entity.id}
              x={xy.x}
              y={xy.y}
              color={pinsColor}
              draggable={isLinkCreatable}
            />
          ))}
      </g>
    </Draggable>
  );
};

export default Tile;
