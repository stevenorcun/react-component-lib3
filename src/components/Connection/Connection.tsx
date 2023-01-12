import React, { useCallback, useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import { PINS_OFFSETS } from "../../store/graph";
import { distanceFormula } from "../../utils/trigonometry";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { DEFAULT_TILE_PIN_RADIUS } from "../../constants/graph";

export interface ConnectionProps {
  from: string;
  to: string;
  label?: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  isBidirectionnal?: boolean;
  isHypothesis?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

const Connection = ({
  from,
  to,
  label,
  fromPos,
  toPos,
  isBidirectionnal,
  isHypothesis,
  isSelected = false,
  isHighlighted = false,
}: ConnectionProps) => {
  const [isInit, setIsInit] = useState(false);
  const [fromPin, setFromPin] = useState(0);
  const [toPin, setToPin] = useState(0);

  const [fromPinPos, setFromPinPos] = useState({
    x: fromPos.x + PINS_OFFSETS[toPin].x,
    y: fromPos.y + PINS_OFFSETS[toPin].y,
  });
  const [toPinPos, setToPinPos] = useState({
    x: toPos.x + PINS_OFFSETS[toPin].x,
    y: toPos.y + PINS_OFFSETS[toPin].y,
  });

  const fromPosRef = useRef(fromPos);
  const toPosRef = useRef(toPos);

  const choosePins = () => {
    let _fromPin = fromPin;
    let _toPin = toPin;
    let shortestDistance = Infinity;

    PINS_OFFSETS.forEach(
      (fromPinOffset: { x: number; y: number }, i: number) => {
        const fromPinX = fromPosRef.current.x + fromPinOffset.x;
        const fromPinY = fromPosRef.current.y + fromPinOffset.y;

        PINS_OFFSETS.forEach(
          (toPinOffset: { x: number; y: number }, j: number) => {
            const toPinX = toPosRef.current.x + toPinOffset.x;
            const toPinY = toPosRef.current.y + toPinOffset.y;
            const distance = Math.floor(
              distanceFormula(
                { x: fromPinX, y: fromPinY },
                { x: toPinX, y: toPinY }
              )
            );

            if (distance < shortestDistance) {
              shortestDistance = distance;
              _fromPin = i;
              _toPin = j;
            }
          }
        );
      }
    );

    setFromPin(_fromPin);
    setToPin(_toPin);
    setFromPinPos({
      x:
        fromPosRef.current.x +
        PINS_OFFSETS[_fromPin].x +
        // pin radius offset
        (fromPosRef.current.x < toPosRef.current.x ? 1 : -1) *
          DEFAULT_TILE_PIN_RADIUS,
      y:
        fromPosRef.current.y +
        PINS_OFFSETS[_fromPin].y +
        // pin radius offset
        (fromPosRef.current.y < toPosRef.current.y ? 1 : -1) *
          DEFAULT_TILE_PIN_RADIUS,
    });
    setToPinPos({
      x:
        toPosRef.current.x +
        PINS_OFFSETS[_toPin].x +
        // pin radius offset
        (fromPosRef.current.x < toPosRef.current.x ? -1 : 1) *
          DEFAULT_TILE_PIN_RADIUS,
      y:
        toPosRef.current.y +
        PINS_OFFSETS[_toPin].y +
        // pin radius offset
        (fromPosRef.current.y < toPosRef.current.y ? -1 : 1) *
          DEFAULT_TILE_PIN_RADIUS,
    });

    setIsInit(true);
  };

  const throttledChoosePins = useCallback(throttle(choosePins, 20), []);

  useEffect(() => {
    choosePins();
  }, []);

  useEffect(() => {
    fromPosRef.current = fromPos;
    toPosRef.current = toPos;
    throttledChoosePins();
  }, [fromPos, toPos]);

  // quick flag for mitigating blinking on Tile select
  // Since we now (T870) "select" Connections too
  // and display them on top of Tiles,
  // we have to redraw them (SVG doesn't have a z-index),
  // which would cause a blinking
  if (!isInit) return null;

  return (
    <ConnectionByCoordinates
      fromPos={fromPinPos}
      toPos={toPinPos}
      label={label}
      isSelected={isSelected}
      isBidirectionnal={isBidirectionnal}
      isHypothesis={isHypothesis}
      isHighlighted={isHighlighted}
    />
  );
};

interface ConnectionByCoordinatesProps {
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  label?: string;
  isSelected?: boolean;
  isInteractive?: boolean;
  isBidirectionnal?: boolean;
  isHypothesis?: boolean;
  isHighlighted?: boolean;
}

export const ConnectionByCoordinates = ({
  fromPos,
  toPos,
  label,
  isSelected = false,
  isHighlighted = false,
  // disables pointer events when dragging, otherwise a dragenter is triggered on the line
  isInteractive = true,
  isBidirectionnal = false,
  isHypothesis = false,
}: ConnectionByCoordinatesProps) => {
  const textRef = useRef<SVGTextElement>(null);

  const alpha =
    toPos.x === fromPos.x
      ? toPos.y > fromPos.y
        ? Math.PI / 2
        : -Math.PI / 2
      : Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);

  const beta =
    toPos.x === fromPos.x
      ? fromPos.y > toPos.y
        ? Math.PI / 2
        : -Math.PI / 2
      : Math.atan2(fromPos.y - toPos.y, fromPos.x - toPos.x);

  const length2 = Math.sqrt(
    (toPos.x - fromPos.x) ** 2 + (toPos.y - fromPos.y) ** 2
  );

  const maskBox = {
    width: 40 + (textRef?.current?.getBBox().width || 0),
    height: 20 + (textRef?.current?.getBBox().height || 0),
  };

  const uuid = uuidv4();

  return (
    <g className={cx({ [commons.PointerEventsNone]: !isInteractive })}>
      <mask id={`mask-${uuid}`}>
        <line
          strokeLinejoin="round"
          x1={fromPos.x}
          y1={fromPos.y}
          x2={toPos.x}
          y2={toPos.y}
          stroke="#fff"
          strokeWidth={4}
        />
        <rect
          x={(toPos.x + fromPos.x - maskBox.width) / 2}
          y={(toPos.y + fromPos.y - maskBox.height) / 2}
          width={maskBox.width}
          height={maskBox.height}
          fill="#000"
        />
      </mask>
      <line
        strokeLinejoin="round"
        x1={fromPos.x}
        y1={fromPos.y}
        x2={toPos.x}
        y2={toPos.y}
        stroke={isHighlighted ? "orange" : isSelected ? "#3083f7" : "#113E9f"}
        strokeDasharray={isHypothesis ? "5,5" : ""}
        strokeWidth={isSelected ? "4" : "1"}
        filter={
          isSelected
            ? `drop-shadow(0px 0px 10px ${
                isHighlighted ? "orange" : "#3083f7"
              })`
            : "none"
        }
        mask={label ? `url(#mask-${uuid})` : ""}
      />
      <g
        transform={`translate(${fromPos.x} ${fromPos.y})rotate(${
          (180 / Math.PI) * alpha
        })translate(${length2 + 1.5} 6.5)scale(-0.013)`}
      >
        <path
          d="M140.6,517.4l712.6,466.4c14.2,11.4,20.7,6.8,14.4-10.4L574.5,527.7c-6.2-17.1-6.2-44.8,0.1-61.9L867.5,26.6c6.3-17.1-0.2-21.8-14.4-10.5L140.7,476.3C126.5,487.6,126.4,506,140.6,517.4z"
          fill="#113E9f"
        />
      </g>
      {isBidirectionnal && (
        <g
          transform={`translate(${toPos.x} ${toPos.y})rotate(${
            (180 / Math.PI) * beta
          })translate(${length2 + 1.5} 6.5)scale(-0.013)`}
        >
          <path
            d="M140.6,517.4l712.6,466.4c14.2,11.4,20.7,6.8,14.4-10.4L574.5,527.7c-6.2-17.1-6.2-44.8,0.1-61.9L867.5,26.6c6.3-17.1-0.2-21.8-14.4-10.5L140.7,476.3C126.5,487.6,126.4,506,140.6,517.4z"
            fill="#113E9f"
          />
        </g>
      )}
      {label && (
        <g
          transform={`translate(${(fromPos.x + toPos.x) / 2}, ${
            (fromPos.y + toPos.y) / 2
          })`}
        >
          <text
            fill={isHighlighted ? "orange" : "#113E9f"}
            fontFamily="Noto Sans"
            fontSize="11"
            textAnchor="middle"
            className={commons.UserSelectNone}
            ref={textRef}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

export default Connection;
