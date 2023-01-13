import React, { useCallback } from "react";
import DRAG_EVENT_TYPES from "../../constants/drag-events-types";
import { unhandle } from "../../utils/DOM";
import throttle from "lodash.throttle";
import { setIsDraggingPin, setMousePos } from "../../store/graph";
import { useAppDispatch } from "../../store/hooks";
import styles from "./styles.scss";

interface PinProps {
  parentId: string;
  parentPos: { x: number; y: number };
  className?: string;
  x: number;
  y: number;
  color: string;
  draggable?: boolean;
}

// TODO revert to SVG and use mouse down/up and the store
//  instead of foreignObject+draggable ?
const Pin = ({
  parentId,
  parentPos,
  className,
  x,
  y,
  color,
  draggable = true,
}: PinProps) => {
  const dispatch = useAppDispatch();

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      DRAG_EVENT_TYPES.createGraphConnection,
      JSON.stringify(parentId)
    );
    const startPos = {
      x: parentPos.x + x,
      y: parentPos.y + y,
    };
    // avoid initial blinking
    dispatch(setMousePos({ x: e.clientX, y: e.clientY }));
    dispatch(setIsDraggingPin(startPos));
  };

  const handleDragging = (e: React.DragEvent) => {
    e.stopPropagation();
    // prevent dispatch of { x: 0, y: 0 } on dragEnd
    // if (e.clientX && e.clientY)
    dispatch(setMousePos({ x: e.clientX, y: e.clientY }));
  };
  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    dispatch(setIsDraggingPin(null));
  };

  const throttledHandleDragging = useCallback(throttle(handleDragging, 50), []);

  return (
    <g x={x} y={y} transform="translate(-5.5, -5.5)">
      <foreignObject width={11} height={11} x={x} y={y}>
        <div
          className={styles.Pin}
          style={{
            backgroundColor: color,
          }}
          draggable={draggable}
          onDragStart={handleDragStart}
          onDrag={throttledHandleDragging}
          onDragEnd={handleDragEnd}
          onMouseDown={unhandle}
        />
      </foreignObject>
    </g>
  );
};

export default Pin;
