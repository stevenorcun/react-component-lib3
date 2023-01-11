import React, { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectBoard,
  setCursor,
  setMouseMove,
  setPrevWindowPosition,
  setWindowDrag,
  setWindowPos,
} from "@/store/board/window";

import styles from "./BoardWindow.scss";

const BoardWindow = () => {
  const boardState = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();
  const view = useRef(null);

  /**
   * Returns the background grid style based on window position
   */
  const getBGStyle = () => {
    return {
      // Set the position for the grid background
      // eslint-disable-next-line
      backgroundPosition:
        String(boardState.windowPos.xVal % 50) +
        "px " +
        String(boardState.windowPos.yVal % 50) +
        "px",
    };
  };

  /**
   * Handles the movement of the board view window.
   */
  const dragWindow = (e) => {
    if (boardState.windowDrag) {
      // Only drag if mouse is currently down
      dispatch(
        setWindowPos({
          xVal:
            boardState.windowPos.xVal +
            (e.clientX - boardState.prevWindowPos.prevX),
          yVal:
            boardState.windowPos.yVal +
            (e.clientY - boardState.prevWindowPos.prevY),
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        })
      );
      // Set prev window position in order to determine amount of window movement
      dispatch(
        setPrevWindowPosition({
          prevX: e.clientX,
          prevY: e.clientY,
        })
      );
    }
  };

  /**
   * Updates the board state to allow window movement on mouse press.
   */
  const mouseDown = (e) => {
    // Only drag on middle mouse, or when not over a box
    // @ts-ignore
    if (e.button === 1 || view.current.contains(e.target)) {
      dispatch(setCursor("move"));
      dispatch(setWindowDrag(true));
      dispatch(setPrevWindowPosition({ prevX: e.clientX, prevY: e.clientY }));
    }
  };

  const mouseMove = (e) => {
    dispatch(setMouseMove(true));
  };

  useEffect(() => {
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mousedown", mouseDown);
    };
  }, [mouseDown]);

  /**
   * Stops movement of the board window.
   */
  const mouseUp = () => {
    dispatch(setWindowDrag(false));
    dispatch(setCursor("default"));
  };

  return (
    // eslint-disable-next-line
    <div
      className={styles.boardWindow}
      onMouseMove={dragWindow}
      onMouseUp={mouseUp}
      style={{ cursor: boardState.cursor }}
    >
      {/* <div>
        {props.children}
      </div> */}
      <div className={styles.boardBackground} style={getBGStyle()} ref={view} />
    </div>
  );
};

export default BoardWindow;
