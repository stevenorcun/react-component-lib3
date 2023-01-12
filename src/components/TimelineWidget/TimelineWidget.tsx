import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import cx from "classnames";
import deepmerge from "deepmerge";

import "moment/locale/fr";
import { EntityDto } from "../../API/DataModels/Database/NovaObject";
import { ENTITY_TYPE_DETAILS } from "../../constants/entity-related";
import { NovaEntityType } from "../../API/DataModels/Database/NovaEntityEnum";
import { GraphState } from "../../store/graph";
import { CanImplementTimelineState } from "../../store/shared/timeline";

import RechartsTimeline, {
  RechartsTimelineData,
  RechartsTimelineYAxisKeys,
} from "../../components/TimelineWidget/RechartsTimeline/RechartsTimeline";
import { ModelLabelEvent } from "../../components/TimelineWidget/ModelLabelEvent/ModelLabelEvent";
import ControlsBar from "./ControlsBar/ControlsBar";

import IconTime from "../../assets/images/icons/IconTime";
import IconCirclePlus from "../../assets/images/icons/IconCirclePlus";
import IconArrowDown from "../../assets/images/icons/IconArrowDown";
import IconOpenArrow from "../../assets/images/icons/IconOpenArrow";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

const TimelineWidget = ({
  entities = [],
  currentFont,
  isExpanded,
  startDateTimeline,
  endDateTimeline,
  timelineLeftSelectionProps,
  timelineRightSelectionProps,
  setTimelineLeftSelectionProps,
  setTimelineRightSelectionProps,
  setIsTimelineWidgetExpanded,
  setTimelineHighlightedIds,
  setStartDateTimeline,
  setEndDateTimeline,
}: {
  entities: EntityDto[];
  currentFont: GraphState["currentFont"];
  isExpanded: GraphState["isTimelineWidgetExpanded"];
  startDateTimeline: GraphState["startDateTimeline"];
  endDateTimeline: GraphState["endDateTimeline"];
  timelineLeftSelectionProps: CanImplementTimelineState["timelineLeftSelectionProps"];
  timelineRightSelectionProps: CanImplementTimelineState["timelineRightSelectionProps"];
  setTimelineLeftSelectionProps: (
    left: CanImplementTimelineState["timelineLeftSelectionProps"]
  ) => void;
  setTimelineRightSelectionProps: (
    left: CanImplementTimelineState["timelineRightSelectionProps"]
  ) => void;
  setIsTimelineWidgetExpanded: (
    bool: GraphState["isTimelineWidgetExpanded"]
  ) => void;
  setTimelineHighlightedIds: (
    highlightedIds: CanImplementTimelineState["timelineHighlightedIds"]
  ) => void;
  setStartDateTimeline: (timestamp: GraphState["startDateTimeline"]) => void;
  setEndDateTimeline: (timestamp: GraphState["startDateTimeline"]) => void;
}) => {
  const [timelineData, setTimelineData] = useState<RechartsTimelineData[]>([]);

  const [yKeys, setYKeys] = useState<{
    [key in NovaEntityType]?: RechartsTimelineYAxisKeys;
  }>({});

  const X_KEY = "timestamp";

  useEffect(() => {
    // TODO compute xMin and xMax to compute ideal granularity
    const _yKeys: { [key in NovaEntityType]?: RechartsTimelineYAxisKeys } = {};

    // Objects automatically sort number keys in ASC order
    // ATTENTION, les clefs ne restent dans l'ordre d'insertion que pour les strings/symboles.
    // Pour les number c'est rangé par ordre ASC
    // (ce qui ne nous arrange, mais on sort après quand même)
    const dataAsObj = entities.reduce(
      (
        acc: {
          [timestamp: number]: {
            [key in NovaEntityType]?: string[];
          };
        },
        curr
      ) => {
        if (curr.related && curr.related.events) {
          curr.related.events.values.forEach((event) => {
            // skip related events without a valid timestamp
            if (typeof event.value.startsAt !== "number") return;

            // [QUICK FIX] As decided, for now,
            // we round data by seconds to "increase" the odds of data stacking
            // TODO In a later ticket, this rounding should be dynamic based on xMax - xMin
            //  (and done INSIDE RechartsTimeline,
            //   because we don't want the initial data to be a lie)
            const timestamp = event.value.startsAt;

            if (!acc[timestamp]) {
              acc[timestamp] = {
                [event.value.type]: [{ eventId: event.id, parentId: curr.id }],
              };
            } else {
              acc[timestamp] = deepmerge(acc[timestamp], {
                [event.value.type]: [{ eventId: event.id, parentId: curr.id }],
              });
            }
            // TODO only "true" on init, afterwards, we don't want to reset it
            if (!_yKeys[event.value.type]) {
              _yKeys[event.value.type] = {
                key: event.value.type,
                label: ENTITY_TYPE_DETAILS[event.value.type].label,
                color: ENTITY_TYPE_DETAILS[event.value.type].color,
                isVisible: yKeys[event.value.type]?.isVisible || true,
              };
            }
          });
        }
        return acc;
      },
      {}
    );

    const flattenedData = Object.keys(dataAsObj)
      .map((key) => ({
        [X_KEY]: +key,
        ...dataAsObj[key],
      }))
      .sort((a, b) => (a.timestamp <= b.timestamp ? -1 : 1));

    setTimelineData(flattenedData);

    // store distinct keys
    setYKeys(_yKeys);
  }, [entities]);

  const widgetRef = useRef<HTMLDivElement>(null);

  const [activeMenu, setActiveMenu] = useState("Chronologie");
  const [isPinned, setPinned] = useState(false);

  const toggleOpen = () => {
    setIsTimelineWidgetExpanded(!isExpanded);
    if (isExpanded) setPinned(false);
  };

  const togglePin = () => {
    setPinned(!isPinned);
  };

  useEffect(() => {
    if (!isPinned && widgetRef) widgetRef.current!.style.transform = "none";
  }, [isPinned]);

  const toggleLegendCheckByKey = (key: string) => {
    if (yKeys[key]) {
      setYKeys({
        ...yKeys,
        [key]: { ...yKeys[key], isVisible: !yKeys[key].isVisible },
      });
    }
  };

  const handleDataExtremesChange = (extremes: [number, number]) => {
    setStartDateTimeline(extremes[0]);
    setEndDateTimeline(extremes[1]);
  };

  const handleDataSelect = (data: RechartsTimelineData[]) => {
    // get distinct parent IDs and highlight
    const highlightedIds = data.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (key !== X_KEY) {
          curr[key].forEach(({ parentId }) => {
            acc[parentId] = true;
          });
        }
      });
      return acc;
    }, {});
    setTimelineHighlightedIds(highlightedIds);
  };

  const renderTimeline = () => (
    <div className={styles.panelContainer}>
      <div className={styles.leftNavigation}>
        <div className={styles.filtersContainer}>
          <div className={styles.filters}>
            <div className={styles.filterGroupName}>
              <IconArrowDown fill="#3083F7" />
              &nbsp;ÉVÈNEMENTS
            </div>
            {Object.keys(yKeys).map((yKey) => (
              <ModelLabelEvent
                key={yKey}
                name={ENTITY_TYPE_DETAILS[yKey].label}
                idName={yKey}
                isChecked={!!yKeys[yKey]?.isVisible}
                iconColor={ENTITY_TYPE_DETAILS[yKey].color}
                onChecked={() => toggleLegendCheckByKey(yKey)}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={cx(
          styles.rightNavigation,
          commons.Flex,
          commons.FlexDirectionColumn
        )}
      >
        <RechartsTimeline
          // width={TIMELINE_WIDTH}
          // height={168}
          // width={timelineMaxWidth}
          xKey={X_KEY}
          yKeysDetails={yKeys}
          data={timelineData}
          startDateTimeline={startDateTimeline}
          endDateTimeline={endDateTimeline}
          timelineLeftSelectionProps={timelineLeftSelectionProps}
          timelineRightSelectionProps={timelineRightSelectionProps}
          setTimelineLeftSelectionProps={setTimelineLeftSelectionProps}
          setTimelineRightSelectionProps={setTimelineRightSelectionProps}
          onDomainChange={handleDataExtremesChange}
          onDataSelect={handleDataSelect}
        />
      </div>
    </div>
  );

  const renderHistory = () => <p>History tab</p>;
  const renderTable = () => <p>Table tab</p>;

  const fontStyle = {
    fontFamily: `${currentFont}`,
  };

  return (
    <Draggable disabled={!isPinned}>
      <div
        ref={widgetRef}
        className={cx(styles.timeline, {
          [styles.opened]: isExpanded,
          [styles.floating]: isPinned,
        })}
        style={fontStyle}
      >
        {!isExpanded ? (
          <div className={styles.panelTitle}>
            <IconTime fill="#3083F7" /> Timeline & Filtres
            <div className={styles.alignRight}>
              <IconOpenArrow
                fill={isPinned ? "#94969A" : "#3083F7"}
                onClick={togglePin}
                className={cx(commons.clickable)}
              />
              <IconCirclePlus
                fill="#3083F7"
                onClick={toggleOpen}
                className={cx(commons.clickable)}
              />
            </div>
          </div>
        ) : (
          <>
            {/* fixme: the menus (and keys) should be passed from here (TimelineWidget.tsx)... */}
            <ControlsBar
              isPinned={isPinned}
              isOpened={isExpanded}
              toggleOpen={toggleOpen}
              togglePin={togglePin}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
            {activeMenu === "Chronologie" && renderTimeline()}
            {activeMenu === "Historique" && renderHistory()}
            {activeMenu === "Table" && renderTable()}
          </>
        )}
      </div>
    </Draggable>
  );
};

export default TimelineWidget;
