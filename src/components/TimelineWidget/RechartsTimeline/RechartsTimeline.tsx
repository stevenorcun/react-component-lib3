import React, { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/fr";
import cx from "classnames";
import * as d3 from "d3-scale";
import lodash from "lodash";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { DAY, HOUR, MINUTE, MONTH, SECOND, YEAR } from "@/constants/date";
import IconDate from "@/assets/images/icons/Dates";
import IconArrowDown from "@/assets/images/icons/IconArrowDown";
import IconEllipsisH from "@/assets/images/icons/IconToolEllipsisH";
import { unhandle } from "@/utils/DOM";
import DateTimePicker from "@/lib/DateTimePicker/DateTimePicker";
import { NovaEntityType } from "@/API/DataModels/Database/NovaEntityEnum";
import { CanImplementTimelineState } from "@/store/shared/timeline";
import styles from "./RechartsTimeline.scss";

export interface ChartMouseEvent {
  activeCoordinate: {
    x: number;
    y: number;
  };
  activeLabel: number;
  activePayload: [unknown];
  activeTooltipIndex: number;
  chartX: number;
  chartY: number;
}

export interface RechartsTimelineYAxisKeys {
  key: NovaEntityType;
  isVisible: boolean;
  label: string;
  color: string;
}

interface DateTimeRechartsData {
  timestamp: number;
}

export type RechartsTimelineData = DateTimeRechartsData & {
  [key in NovaEntityType]: [
    {
      parentId: string;
      eventId: string;
    }
  ];
};

export interface RechartsTimelineProps {
  xKey: string;
  yKeysDetails: {
    [key in NovaEntityType]?: RechartsTimelineYAxisKeys;
  };
  data: RechartsTimelineData[];
  width?: number;
  height?: number;
  startDateTimeline?: number;
  endDateTimeline?: number;
  timelineLeftSelectionProps: CanImplementTimelineState["timelineLeftSelectionProps"];
  timelineRightSelectionProps: CanImplementTimelineState["timelineRightSelectionProps"];
  setTimelineLeftSelectionProps: (
    left: CanImplementTimelineState["timelineLeftSelectionProps"]
  ) => void;
  setTimelineRightSelectionProps: (
    left: CanImplementTimelineState["timelineRightSelectionProps"]
  ) => void;
  onDomainChange?: (extremes: [number, number]) => void;
  onDataSelect?: (data: RechartsTimelineData[]) => void;
}

const DEFAULT_BARSIZE = 20;

// DATA MUST BE ASC ORDERED (x-axis)
const RechartsTimeline = ({
  xKey,
  yKeysDetails,
  data,
  width,
  height,
  timelineLeftSelectionProps,
  timelineRightSelectionProps,
  setTimelineLeftSelectionProps,
  setTimelineRightSelectionProps,
  startDateTimeline,
  endDateTimeline,
  onDomainChange,
  onDataSelect,
}: RechartsTimelineProps) => {
  // TODO à revoir ? il faut garder l'état de la timeline dans un store (zoom, sélection, etc...)
  //  mais à changer si la Timeline du Graphe n'est pas la même que celle de la Map
  const [xMin, setXMin] = useState<number>(
    data.length ? data[0][xKey] : -Infinity
  );
  const [xMax, setXMax] = useState<number>(
    data.length ? data[data.length - 1][xKey] : Infinity
  );

  const [yKeysAsArray, setYKeysAsArray] = useState<string[]>([]);
  const [xTicks, setXTicks] = useState<number[]>([]);
  const [dateFormatX, setDateFormatX] = useState("DD/MM");

  const [idealBarSize, setIdealBarSize] = useState(DEFAULT_BARSIZE);

  const [isOpenDate, setIsOpenDate] = useState(false);

  const [formattedData, setFormattedData] = useState<RechartsTimelineData[]>(
    []
  );

  const [isDragging, setIsDragging] = useState(false);
  // TODO could be used to display a crosshair
  //  (doesn't seem possible, crosshairs are only possible where there is data)
  const [currentPosition, setCurrentPosition] = useState(0);

  const handleDataSelect = () => {
    if (
      timelineLeftSelectionProps &&
      timelineRightSelectionProps &&
      onDataSelect
    ) {
      onDataSelect(
        formattedData.slice(
          Math.min(
            timelineLeftSelectionProps.activeTooltipIndex,
            timelineRightSelectionProps.activeTooltipIndex
          ),
          Math.max(
            timelineLeftSelectionProps.activeTooltipIndex,
            timelineRightSelectionProps.activeTooltipIndex
          ) + 1
        )
      );
    }
  };

  const handleSelectionUpdate = (e: any, isMouseUp?: boolean) => {
    if (e.activeLabel) {
      if (
        isMouseUp &&
        timelineLeftSelectionProps &&
        e.activeLabel <= timelineLeftSelectionProps.activeLabel
      ) {
        const swapLeft = { ...timelineLeftSelectionProps };
        setTimelineRightSelectionProps(swapLeft);
        setTimelineLeftSelectionProps(e);
      } else setTimelineRightSelectionProps(e);

      if (isMouseUp) handleDataSelect();
    }
  };

  // contains the scale used by the graph.
  // Can be used to display a pointer/tooltip with the date no mater the mouse position
  const chartRef = useRef();
  const anyBarRef = useRef();
  const divRef = useRef();

  const computeGranularityAndXLabelFormat = (
    arr: DateTimeRechartsData[],
    min: number,
    max: number
  ) => {
    let xLabelFormat = "DD/MM";
    let granularity = 1;
    if (arr.length === 1) return { xLabelFormat, granularity };

    const delta = max - min;

    if (!delta) return { xLabelFormat, granularity };

    if (delta >= 5 * YEAR) {
      xLabelFormat = "YYYY";
      granularity = 7 * DAY;
    } else if (delta >= YEAR) {
      xLabelFormat = "DD/MM/YYYY";
      granularity = DAY;
    } else if (delta >= 6 * MONTH) {
      xLabelFormat = "DD/MM";
      granularity = HOUR;
    } else if (delta >= 7 * DAY) {
      xLabelFormat = "DD/MM"; // TODO 'DD' unless over different months
      granularity = 30 * MINUTE;
    } else if (delta >= 2 * DAY) {
      xLabelFormat = "D-HH:mm";
      granularity = 15 * MINUTE;
    } else if (delta >= DAY) {
      xLabelFormat = "HH:mm";
      granularity = 5 * MINUTE;
    } else if (delta >= HOUR) {
      xLabelFormat = "HH:mm:ss";
      granularity = MINUTE;
    } else if (delta >= MINUTE) {
      xLabelFormat = "mm:ss";
      granularity = 5 * SECOND;
    } else if (delta >= SECOND) {
      xLabelFormat = "ss.SSS";
      granularity = SECOND / 2;
    } else xLabelFormat = "SSS[ms]";

    // TODO afficher l'unité supérieur SSI xMin et xMax sont dans la même seconde/minute ?
    //  -> si on a que 7j d'écart
    //  mais qu'ils sont sur 2 mois différents, il faut affiche le mois etc..

    return { xLabelFormat, granularity };
  };

  useEffect(() => {
    setYKeysAsArray(
      Object.keys(yKeysDetails).reduce((acc: string[], curr) => {
        if (yKeysDetails[curr].isVisible) acc.push(curr);
        return acc;
      }, [])
    );
  }, [yKeysDetails]);

  const handleDomainChange = (min: number, max: number) => {
    if (max < min) return;
    setXMin(min);
    setXMax(max);
    if (onDomainChange) onDomainChange([min, max]);
  };

  const handleCalendarDatesChange = (dates: [Date, Date]) => {
    handleDomainChange(dates[0].getTime(), dates[1].getTime());
  };

  useEffect(() => {
    if (startDateTimeline !== undefined) setXMin(startDateTimeline);
  }, [startDateTimeline]);
  useEffect(() => {
    if (endDateTimeline !== undefined) setXMax(endDateTimeline);
  }, [endDateTimeline]);

  useEffect(() => {
    if (!data || !data.length) {
      handleDomainChange(
        Date.now() - 1000 * 3600 * 24,
        Date.now() + 1000 * 3600 * 24
      );
      setXTicks([]);
      return;
    }

    // compute initial granularity for grouping
    const { granularity } = computeGranularityAndXLabelFormat(
      data,
      data[0][xKey],
      data[data.length - 1][xKey]
    );
    // setDateFormatX(xLabelFormat);

    // Custom merger to concat arrays instead of overwriting them (it's normal to not always return)
    // eslint-disable-next-line consistent-return
    const customMergerToConcatArrays = (objValue, srcValue) => {
      if (lodash.isArray(objValue)) return objValue.concat(srcValue);
    };
    const groupedData = data.reduce((acc: RechartsTimelineData[], curr, n) => {
      // if (data[n-1].x + granularity > data[n].x) -> merge with previous tick
      if (n && data[acc.length - 1][xKey] + granularity >= curr[xKey]) {
        acc[acc.length - 1] = lodash.mergeWith(
          acc[acc.length - 1],
          {
            ...curr,
            [xKey]: acc[acc.length - 1][xKey],
          },
          customMergerToConcatArrays
        );
      } else acc.push(curr);

      return acc;
    }, []);

    // grouping can cause the format to require changing
    // Actually, only when grouping causes all the data to becomes 1 single column:
    //  causing us to enter the `if (length === 1)` block below.
    //  Instead, we could just for the format in said block ?
    const groupedDataConfig = computeGranularityAndXLabelFormat(
      groupedData,
      groupedData[0][xKey],
      groupedData[groupedData.length - 1][xKey]
    );
    setDateFormatX(groupedDataConfig.xLabelFormat);

    if (groupedData.length === 1) {
      // try/catch isn't needed anymore, but meh
      try {
        // @ts-ignore
        const chartWidth = divRef.current?.current?.clientWidth;
        if (!chartWidth) throw new Error("Min width must be 1px");
        setIdealBarSize(chartWidth / 3);
      } catch (e) {
        console.error(e);
      }

      const ticks: number[] = [
        groupedData[0][xKey] - DAY,
        groupedData[0][xKey],
        groupedData[0][xKey] + DAY,
      ];

      setXTicks(ticks);
      handleDomainChange(ticks[0], ticks[2]);
    } else {
      const dataMinX = groupedData[0][xKey];
      const dataMaxX = groupedData[groupedData.length - 1][xKey];
      const xExtremesOffset = Math.max(
        granularity,
        0.02 * (dataMaxX - dataMinX)
      );

      const scale = d3
        .scaleTime()
        .domain([
          new Date(dataMinX - xExtremesOffset),
          new Date(dataMaxX + xExtremesOffset),
        ])
        .range([0, 1])
        .nice();
      // @ts-ignore
      const scaleTicks = scale.ticks(d3.scaleTime);
      // const scaleTicks = scale.ticks(10);

      // ensure we have at least 1ms difference between data min/max and ticks' min/max
      // (not the case when dataset is too small)
      const ticksAsTimestamps = [...scaleTicks.map((d) => d.getTime())];

      // reset barSize. I will be adjusted by the lib
      setIdealBarSize(DEFAULT_BARSIZE);
      setXTicks(ticksAsTimestamps);
      handleDomainChange(
        ticksAsTimestamps[0],
        ticksAsTimestamps[ticksAsTimestamps.length - 1]
      );
    }

    setFormattedData(groupedData);
  }, [data]);

  const handleMouseDown = (e: any) => {
    // reset
    setTimelineRightSelectionProps(null);
    onDataSelect?.([]);
    if (e && e.activeLabel) {
      setIsDragging(true);
      setTimelineLeftSelectionProps(e);
    }
  };

  const handleMouseMove = (e: any) => {
    if (e) {
      setCurrentPosition(e.chartX);
      if (!isDragging) return;
      handleSelectionUpdate(e);
    }
  };

  const handleMouseUp = (e: any) => {
    setIsDragging(false);
    if (e && timelineRightSelectionProps) {
      handleSelectionUpdate(e, true);
    }
  };

  const handleUnselect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDataSelect?.([]);
    setTimelineLeftSelectionProps(null);
    setTimelineRightSelectionProps(null);
    setIsDragging(false);
  };

  if (!data.length)
    return (
      <div className={commons.NoDataMessage}>Pas de données à afficher</div>
    );

  return (
    <>
      <ResponsiveContainer
        ref={divRef}
        width={width || "100%"}
        height={height || "100%"}
      >
        <BarChart
          // @ts-ignore
          ref={chartRef}
          data={formattedData}
          //*
          margin={{
            top: 10,
            right: 50,
            left: -20,
            bottom: 20,
          }}
          // */
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid
            vertical={false}
            stroke="#EDEDEE"
            strokeWidth="0.5px"
          />

          <XAxis
            // interval="preserveStartEnd"
            interval={0} // affiche TOUS les ticks
            axisLine={false}
            // tickLine={false}
            // tickSize={0}
            scale="time"
            type="number"
            dataKey="timestamp"
            domain={[xMin, xMax]}
            ticks={xTicks}
            // @ts-ignore
            tick={<TimelineDatetimeTickFormatter dateFormat={dateFormatX} />}
          />

          <YAxis
            interval={0}
            tickFormatter={(y) => (y !== 0 ? y : "")}
            // @ts-ignore
            tick={TimelineTickFormatter}
            allowDecimals={false}
            tickSize={10}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            offset={0}
            // cursor={false}
            // cursor={{ stroke: 'red', strokeWidth: 2 }}
            filterNull={false}
            content={
              // @ts-ignore
              <CustomTooltip
                yKeysDetails={yKeysDetails}
                currentX={currentPosition}
                barSize={idealBarSize}
              />
            }
          />

          {yKeysAsArray.map((key) => (
            <Bar
              // @ts-ignore
              ref={anyBarRef}
              isAnimationActive={false}
              key={key}
              dataKey={`${key}.length`}
              stackId="events"
              fill={yKeysDetails[key]?.color}
              // if the thickness would cause data ticks to overlap
              // this value is ignored and the closest "correct" value is picked (which is good)
              // Exception: min barSize is 1px, we decided (otherwise, bars become invisible)
              barSize={idealBarSize}
              shape={BarWithMinWidth}
            />
          ))}

          {timelineLeftSelectionProps && timelineRightSelectionProps && (
            <ReferenceArea
              x1={timelineLeftSelectionProps.activeLabel}
              x2={timelineRightSelectionProps.activeLabel}
              isFront
              shape={
                <CustomSelectionArea
                  startTime={Math.min(
                    timelineLeftSelectionProps.activeLabel,
                    timelineRightSelectionProps.activeLabel
                  )}
                  endTime={Math.max(
                    timelineLeftSelectionProps.activeLabel,
                    timelineRightSelectionProps.activeLabel
                  )}
                  relativeX={
                    Math.min(
                      timelineLeftSelectionProps.activeCoordinate.x,
                      timelineRightSelectionProps.activeCoordinate.x
                    ) -
                    // @ts-ignore
                    (anyBarRef.current?.state?.curData[0]?.width ||
                      idealBarSize) /
                      2
                  }
                  relativeWidth={
                    Math.abs(
                      timelineRightSelectionProps.activeCoordinate.x -
                        timelineLeftSelectionProps.activeCoordinate.x
                      // @ts-ignore
                    ) + anyBarRef.current?.state?.curData[0]?.width ||
                    idealBarSize
                  }
                  onDelete={handleUnselect}
                />
              }
            />
          )}
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.bottomNavigation}>
        <div className={styles.bottomNavigationLeft}>
          <button
            type="button"
            className={styles.bottomNavigationLeftContent}
            onClick={() => setIsOpenDate(!isOpenDate)}
          >
            <IconDate fill="#3083F7" height={12} width={12} />
            <span>
              {" "}
              <Moment format="DD MMM YYYY" withTitle>
                {xMin}
              </Moment>
              &nbsp;-&nbsp;
              <Moment format="DD MMM YYYY" withTitle>
                {xMax}
              </Moment>
            </span>
            <IconArrowDown className={commons.clickable} />
          </button>
          {isOpenDate && (
            <div className={styles.bottomNavigationLeftDate}>
              <div onClick={unhandle}>
                <DateTimePicker
                  value={[new Date(xMin), new Date(xMax)]}
                  selectRange
                  onChange={handleCalendarDatesChange}
                  toggleVisibility={() => setIsOpenDate(!isOpenDate)}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.bottomNavigationRight}>
          {" "}
          <div>
            <span className={styles.bottomNavigationRightZoomNumber}>100%</span>
            <IconArrowDown className={commons.clickable} />
          </div>
          <div className={styles.dividerVertical} />
          <button
            type="button"
            className={styles.bottomNavigationRightButtonEllipsis}
          >
            <IconEllipsisH className={commons.clickable} />
          </button>
        </div>
      </div>
    </>
  );
};

const MIN_BAR_WIDTH = 1;
const BarWithMinWidth = ({
  fill,
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  props: React.SVGProps<SVGPathElement>;
}) => (
  <rect
    x={x}
    y={y}
    width={Math.max(MIN_BAR_WIDTH, width)}
    height={height}
    fill={fill}
  />
);

const TimelineTickFormatter = ({ x, y, payload }) => {
  if (!payload || !payload.value) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text className={cx(styles.AxisLabel, styles.YAxis)} x={0} y={0} dy={16}>
        {payload.value}
      </text>
    </g>
  );
};

const TimelineDatetimeTickFormatter = ({ dateFormat, x, y, payload }) => {
  if (!payload || !payload.value) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text className={cx(styles.AxisLabel, styles.XAxis)} x={0} y={0} dy={16}>
        {moment(new Date(payload.value)).format(dateFormat)}
      </text>
    </g>
  );
};

const CustomSelectionArea = ({
  startTime,
  endTime,
  relativeX,
  relativeWidth,
  onDelete,
}: {
  startTime: number;
  endTime: number;
  relativeX: number;
  relativeWidth: number;
  onDelete: (event: React.MouseEvent) => void;
}) => (
  <g transform={`translate(${relativeX}, 0)`}>
    <rect
      x={0}
      y={0}
      height="100%"
      width={relativeWidth}
      fill="#3083F7"
      opacity={0.2}
    />
    <g transform="translate(5, 5)">
      <rect
        x={0}
        y={0}
        fill="#fdfdfd"
        width={88} // mocked TODO but is actually a ref+dynamic (based on date font)
        height={22}
        rx={3}
      />
      <text
        fontSize="x-small"
        fill="#3083F7"
        fontWeight="bold"
        x={3}
        y="1.5em"
        style={{ userSelect: "none" }}
      >
        {moment(new Date(startTime)).format("DD MMM")}
        &nbsp;-&nbsp;
        {moment(new Date(endTime)).format("DD MMM")}
      </text>
    </g>

    <g
      className={cx("selection-area-buttons", commons.clickable)}
      x={relativeX - 30}
      y={5}
      transform={`translate(${relativeWidth - 30 - 20 - 5}, 5)`}
      onMouseDown={unhandle}
      onMouseUp={unhandle}
      onClick={onDelete}
    >
      <rect x="26" width="22" height="22" rx="3" fill="#3083F7" />
      <path
        d="M38.98 11.0004L42.6924 7.28802C43.1025 6.87784 43.1025 6.21284 42.6924 5.80331L42.1975 5.3084C41.7872 4.8981 41.1222 4.8981 40.7126 5.3084L37.0004 9.02064L33.288 5.30763C32.8778 4.89746 32.2128 4.89746 31.8033 5.30763L31.3076 5.80254C30.8975 6.21284 30.8975 6.87784 31.3076 7.28738L35.0206 11.0004L31.3084 14.7126C30.8981 15.1229 30.8981 15.7879 31.3084 16.1975L31.8033 16.6924C32.2135 17.1025 32.8785 17.1025 33.288 16.6924L37.0004 12.98L40.7126 16.6924C41.1229 17.1025 41.7879 17.1025 42.1975 16.6924L42.6924 16.1975C43.1025 15.7872 43.1025 15.1222 42.6924 14.7126L38.98 11.0004Z"
        fill="white"
      />
    </g>
  </g>
);

/**
 * Tooltip formattant la date (valeur X)
 * et masquant les lignes sans valeur
 * (par défaut, ReCharts ajoute une ligne pour chaque Bar dans le graphe
 *  même si elles n'ont pas de valeur à un X donné)
 */
const CustomTooltip = ({
  currentX,
  yKeysDetails,
  active,
  payload,
  label,
  coordinate,
  barSize,
}) => {
  if (
    active &&
    currentX &&
    // only display the tooltip when the mouse this is "close" to the target (value in pixels)
    Math.abs(currentX - coordinate.x) <= barSize / 2
  ) {
    return (
      <div className={cx(commons.UserSelectNone, styles.CustomTooltip)}>
        <p
          className={
            // @ts-ignore
            styles.CustomTooltip_Label
          }
        >
          <Moment format="DD/MM/YYYY HH:mm:ss.SSS">{new Date(label)}</Moment>
        </p>
        {payload.map((d, i) => {
          if (d.value !== undefined) {
            const key = d.dataKey.slice(0, d.dataKey.indexOf("."));
            return (
              <p key={i} style={{ color: yKeysDetails[key].color }}>
                <b>
                  {yKeysDetails[key].label}
                  :&nbsp;
                </b>
                {d.value}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }

  return null;
};

export default RechartsTimeline;
