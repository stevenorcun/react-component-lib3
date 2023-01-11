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
import { NovaEntityType } from "@/API/DataModels/Database/NovaEntityEnum";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./RechartsTimeline.scss";

export interface RechartsTimelineYAxisKeys {
  key: NovaEntityType;
  isVisible: boolean;
  label: string;
  color: string;
}

// DATA MUST BE ASC ORDERED (x-axis)
const RechartsTimeline = ({
  xKey,
  yKeysDetails,
  data,
  width,
  height,
}: {
  xKey: string;
  yKeysDetails: {
    [key in NovaEntityType]?: RechartsTimelineYAxisKeys;
  };
  data: Array<{
    timestamp: number;
    // @ts-ignore
    [key: NovaEntityType]: string[];
  }>;
  width?: number;
  height?: number;
}) => {
  const [xMin, setXMin] = useState(data.length ? data[0][xKey] : -Infinity);
  const [xMax, setXMax] = useState(
    data.length ? data[data.length - 1][xKey] : Infinity
  );

  const [yKeysAsArray, setYKeysAsArray] = useState<string[]>([]);
  const [xTicks, setXTicks] = useState<number[]>([]);
  const [dateFormatX, setDateFormatX] = useState("DD/MM");

  // could be used for inverts
  // but no guarantee thi sis the one from the graph
  // TODO remove ?
  const [, setTimeScale] = useState(null);

  const [idealBarSize, setIdealBarSize] = useState(20);

  interface ChartMouseEvent {
    activeCoordinate: {
      x: number;
      y: number;
    };
    activeLabel: number;
    activePayload: {}[];
    activeTooltipIndex: number;
    chartX: number;
    chartY: number;
  }

  const [selectionAreaLeft, setSelectionAreaLeft] =
    useState<ChartMouseEvent | null>(null);
  const [selectionAreaRight, setSelectionAreaRight] =
    useState<ChartMouseEvent | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  // TODO could be used to display a crosshair
  //  (doesn't seem possible, crosshairs are only possible where there is data)
  const [currentPosition, setCurrentPosition] = useState(0);

  const handleSelectionUpdate = (e: any) => {
    if (e.activeLabel) {
      if (selectionAreaLeft && e.activeLabel < selectionAreaLeft.activeLabel) {
        setSelectionAreaRight(selectionAreaLeft);
        setSelectionAreaLeft(e);
      } else setSelectionAreaRight(e);
    }
  };

  const barRef = useRef();
  // TODO might contain the scale function (xAxis ref) and barSize

  const barChartRef = useRef();

  const getXAxisTickFormat = () => {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 12 * MONTH;

    let xAxisFormat = "DD/MM";
    if (data.length === 1) return xAxisFormat;

    const delta = xMax - xMin;

    if (!delta) return xAxisFormat;

    if (delta >= 5 * YEAR) xAxisFormat = "YYYY";
    else if (delta >= YEAR) xAxisFormat = "DD/MM/YYYY";
    else if (delta >= 7 * DAY) xAxisFormat = "DD/MM";
    else if (delta >= 2 * DAY) xAxisFormat = "D-HH:MM";
    else if (delta >= DAY) xAxisFormat = "HH:MM";
    else if (delta >= HOUR) xAxisFormat = "HH:mm:ss";
    else if (delta >= MINUTE) xAxisFormat = "mm:ss";
    else if (delta >= SECOND) xAxisFormat = "ss.SSS";
    else xAxisFormat = "SSS[ms]";
    // TODO afficher l'unité supérieur SSI xMin et xMax sont dans la même seconde/minute ?
    //  -> si on a que 7j d'écart mais qu'ils sont sur 2 mois différents, il faut affiche le mois etc..

    return xAxisFormat;
  };

  useEffect(() => {
    setYKeysAsArray(
      Object.keys(yKeysDetails).reduce((acc: string[], curr) => {
        if (yKeysDetails[curr].isVisible) acc.push(curr);
        return acc;
      }, [])
    );
  }, [yKeysDetails]);

  useEffect(() => {
    if (barChartRef.current && data.length < 2) {
      try {
        const ref = barChartRef.current;
        // @ts-ignore
        const chartWidth = ref.state.prevWidth;
        // @ts-ignore
        const xAxisRef = ref.state.xAxisMap[0];
        const xAxisOffset = xAxisRef.x;
        setIdealBarSize((chartWidth - xAxisOffset) / 2);
      } catch (e) {
        console.error(e);
      }
    }
  }, [barChartRef.current]);

  useEffect(() => {
    if (!data || !data.length) {
      setXMin(new Date(Date.now() - 1000 * 3600 * 24));
      setXMax(new Date(Date.now() + 1000 * 3600 * 24));
      return;
    }

    if (data.length < 2) {
      const ticks: number[] = [];
      // TODO hide chart instead
      const fakeMin = new Date(
        (data.length ? data[0][xKey] : Date.now()) - 1000 * 60 * 60 * 24
      ).getTime();
      setXMin(fakeMin);
      ticks.push(fakeMin);
      if (data.length) ticks.push(data[0][xKey]);
      const fakeMax = data.length
        ? data[0][xKey] + 1000 * 60 * 60 * 24
        : Date.now();
      setXMax(fakeMax);
      ticks.push(fakeMax);
      setXTicks(ticks);
    } else {
      const scale = d3
        .scaleTime()
        .domain([
          new Date(data[0][xKey]),
          new Date(data[data.length - 1][xKey]),
        ])
        .range([0, 1])
        .nice();
      // @ts-ignore
      setTimeScale(scale);
      // @ts-ignore
      const _ticks = scale.ticks(d3.timeMinute);
      setXTicks(_ticks.map((d) => d.getTime()));
      setXMin(_ticks[0]);
      setXMax(_ticks[_ticks.length - 1]);
    }

    // setXTicks(ticks);

    setDateFormatX(getXAxisTickFormat());
  }, [data]);

  return (
    <ResponsiveContainer width={width || "100%"} height={height || "100%"}>
      <BarChart
        // @ts-ignore
        ref={barChartRef}
        data={data}
        //*
        margin={{
          top: 20,
          right: 10,
          left: -20,
          bottom: 5,
        }}
        // */
        onMouseDown={(e: any) => {
          // reset
          setSelectionAreaRight(null);
          if (e && e.activeLabel) {
            setIsDragging(true);
            setSelectionAreaLeft(e);
          }
        }}
        onMouseMove={(e: any) => {
          if (e) {
            setCurrentPosition(e.chartX);
            if (!isDragging) return;
            handleSelectionUpdate(e);
          }
        }}
        onMouseUp={(e: any) => {
          if (e) {
            setIsDragging(false);
            handleSelectionUpdate(e);
          }
        }}
      >
        <CartesianGrid vertical={false} stroke="#EDEDEE" strokeWidth="0.5px" />

        <XAxis
          tickSize={0}
          interval="preserveStartEnd"
          // interval={0} // affiche TOUS les ticks
          axisLine={false}
          tickLine={false}
          scale="time"
          type="number"
          dataKey="timestamp"
          domain={[xMin, xMax]}
          ticks={xTicks}
          // @ts-ignore
          tick={<TimelineDatetimeTickFormatter dateFormat={dateFormatX} />}
        />

        <YAxis
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
          filterNull={false}
          /*
          labelFormatter={(x) => (
            <Moment format="DD/MM/YYYY">{new Date(x)}</Moment>
          )}
          formatter={(v, yAxisKey, props) => {
            // skip empty data
            if (v === undefined) return [undefined, undefined];

            // remove ".length" to get the key
            const key = (yAxisKey as string).substring(
              0,
              (yAxisKey as string).indexOf('.')
            );
            return [v, yKeysDetails[key]?.label || yAxisKey];
          }} // */

          //*
          content={
            // @ts-ignore
            <CustomTooltip
              yKeysDetails={yKeysDetails}
              currentX={currentPosition}
            />
          }
          // */
        />

        {yKeysAsArray.map((key) => (
          <Bar
            // @ts-ignore
            ref={barRef}
            isAnimationActive={false}
            key={key}
            dataKey={`${key}.length`}
            stackId="events"
            fill={yKeysDetails[key].color}
            // if the thickness would cause data ticks to overlap
            // this value is ignored and the closest "correct" value is picked (which is good)
            // Exception: min barSize is 1px, we decided (otherwise, bars become invisible)
            barSize={idealBarSize}
            shape={BarWithMinWidth}
          />
        ))}

        {selectionAreaLeft &&
          selectionAreaRight &&
          selectionAreaRight.chartX - selectionAreaLeft.chartX >= 5 && (
            <ReferenceArea
              x1={selectionAreaLeft.activeLabel}
              x2={selectionAreaRight.activeLabel}
              isFront
              shape={
                <CustomSelectionArea
                  startTime={selectionAreaLeft.activeLabel}
                  endTime={selectionAreaRight.activeLabel}
                  // relativeX={selectionAreaLeft.chartX} // chartX is the X of the data
                  relativeX={selectionAreaLeft.activeCoordinate.x - 2} // activeCoordinate.x is the X of the mouse (relative to the chart)
                  // relativeWidth={selectionAreaRight.chartX - selectionAreaLeft.chartX}
                  relativeWidth={
                    selectionAreaRight.activeCoordinate.x -
                    selectionAreaLeft.activeCoordinate.x +
                    6
                  } // get `barSize` instead of using a magic number TODO IS IN `barChartRef.current.state.tooltipAxis.tickSize`!!!!
                />
              }
            />
          )}
      </BarChart>
    </ResponsiveContainer>
  );
};

const MIN_BAR_WIDTH = 1;
const BarWithMinWidth = ({
  fill,
  x,
  y,
  width,
  height,
  ...props
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

const TimelineTickFormatter = ({ x, y, payload, ...props }) => {
  if (!payload || !payload.value) return;

  return (
    <g transform={`translate(${x},${y})`}>
      <text className={cx(styles.AxisLabel, styles.YAxis)} x={0} y={0} dy={16}>
        {payload.value}
      </text>
    </g>
  );
};

const TimelineDatetimeTickFormatter = ({
  dateFormat,
  x,
  y,
  payload,
  ...props
}) => {
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
  ...props
}: {
  startTime: number;
  endTime: number;
  relativeX: number;
  relativeWidth: number;
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
      className="selection-area-buttons"
      x={relativeX - 30}
      y={5}
      transform={`translate(${relativeWidth - 30 - 20 - 5}, 5)`}
    >
      <rect width="22" height="22" rx="3" fill="#3083F7" />
      <path
        d="M8.91772 16.7688C8.7702 16.9172 8.56893 17 8.35986 17C8.15078 17 7.94951 16.9172 7.80199 16.7688L3.34677 12.3129C2.88441 11.8505 2.88441 11.1008 3.34677 10.6393L3.90463 10.0813C4.36713 9.61893 5.116 9.61893 5.57835 10.0813L8.35986 12.8629L15.8759 5.34677C16.3384 4.88441 17.088 4.88441 17.5496 5.34677L18.1075 5.90477C18.5698 6.36713 18.5698 7.11672 18.1075 7.57835L8.91772 16.7688Z"
        fill="white"
      />
      <rect x="26" width="22" height="22" rx="3" fill="#3083F7" />
      <path
        d="M38.98 11.0004L42.6924 7.28802C43.1025 6.87784 43.1025 6.21284 42.6924 5.80331L42.1975 5.3084C41.7872 4.8981 41.1222 4.8981 40.7126 5.3084L37.0004 9.02064L33.288 5.30763C32.8778 4.89746 32.2128 4.89746 31.8033 5.30763L31.3076 5.80254C30.8975 6.21284 30.8975 6.87784 31.3076 7.28738L35.0206 11.0004L31.3084 14.7126C30.8981 15.1229 30.8981 15.7879 31.3084 16.1975L31.8033 16.6924C32.2135 17.1025 32.8785 17.1025 33.288 16.6924L37.0004 12.98L40.7126 16.6924C41.1229 17.1025 41.7879 17.1025 42.1975 16.6924L42.6924 16.1975C43.1025 15.7872 43.1025 15.1222 42.6924 14.7126L38.98 11.0004Z"
        fill="white"
      />
    </g>
  </g>
);

// only display the tooltip when the mouse this is "close" to the target (value in pixels)
const TOOLTIP_DISPLAY_THRESHOLD = 10;
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
  ...props
}) => {
  if (
    active &&
    currentX &&
    Math.abs(currentX - coordinate.x) <= TOOLTIP_DISPLAY_THRESHOLD
  ) {
    return (
      <div className={cx(commons.UserSelectNone, styles.CustomTooltip)}>
        <p className={styles.CustomTooltip_Label}>
          <Moment format="DD/MM/YYYY HH:mm:ss.SSS">{new Date(label)}</Moment>
        </p>
        {payload?.map((data, i) => {
          if (data.value !== undefined) {
            const key = data.dataKey.slice(0, data.dataKey.indexOf("."));
            return (
              <p key={i} style={{ color: yKeysDetails[key].color }}>
                <b>{yKeysDetails[key].label}:</b>
                {data.value}
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
