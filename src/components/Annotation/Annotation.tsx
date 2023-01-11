/* eslint-disable import/no-cycle */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import throttle from "lodash.throttle";
import cx from "classnames";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectGraph,
  setGraphFocus,
  setGraphSelection,
  setSelectedAnnotations,
  toggleAnnotationSelectionById,
  updateAnnotationById,
} from "@/store/graph";
import { AnnotationDto } from "@/API/DataModels/Entities/AnnotationEntity";
import { unhandle } from "@/utils/DOM";
import { Key } from "@/constants/DOM";
import styles from "./Annotation.scss";

const Annotation = ({ id, ...props }: AnnotationDto) => {
  const graphState = useAppSelector(selectGraph);
  const dispatch = useAppDispatch();

  const {
    x,
    y,
    width,
    height,
    fill,
    stroke,
    borderWidth,
    fontSizeInPx,
    font,
    bold,
    isItalic,
    isUnderline,
    textAlign,
    textColor,
    thikness,
  } = props;

  const [editableContent, setEditableContent] = useState(props.label);
  const [isEditable, setIsEditable] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [innerWidth, setInnerWidth] = useState(width);
  const [innerHeight, setInnerHeight] = useState(height);
  const [mousedownTimestamp, setMousedownTimestamp] = useState(0);
  const [inputFontSize, setInputFontSize] = useState(fontSizeInPx);

  const dragRef = useRef<HTMLSpanElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const ghostInputRef = useRef<HTMLTextAreaElement>(null);
  const isResizingRef = useRef(isResizing);
  const graphStateRef = useRef(graphState);
  const isSelected = !!graphState.selectedAnnotations[id];

  const toggleIsEditable = (e: any) => {
    e.stopPropagation();

    // Ignore if dbclick during editing (select a word),
    // only Enter (submitting the form) is allowed
    if (e.type === "dblclick" && isEditable) return false;

    setIsEditable(!isEditable);
    // reset value
    setEditableContent(props.label);
    return false;
  };

  /** Select/Highlight the whole text on focus */
  const handleInputFocus = () => {
    if (contentInputRef.current) {
      contentInputRef.current.setSelectionRange(
        0,
        contentInputRef.current.value.length
      );
    }
  };

  /** Disable resizing */
  const handleMouseUpOnResizeWidget = (): void => setIsResizing(false);

  /** Trim and submit the new value to display */
  const handleSubmit = (e: React.FormEvent) => {
    if (editableContent) {
      dispatch(updateAnnotationById({ id, label: editableContent.trim() }));
    }
    toggleIsEditable(e);
  };

  /** Compute new width and height (and apply scaling) */
  const resize = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isResizingRef.current) return;

    /**
     * Convertir en coordonnées relatives au graphe la position de la souris
     *
     * Le "nombre magique" 60 est la hauteur de la Toolbar/Menubar
     *
     * TODO Généraliser en un fonction réutilisable !
     */
    const scaledX =
      (e.pageX + graphStateRef.current.graphOrigin.x) /
      graphStateRef.current.graphScale;
    const scaledY =
      (e.pageY - 60 + graphStateRef.current.graphOrigin.y) /
      graphStateRef.current.graphScale;

    // Interdire les dimensions minuscules / négatives
    // (nombre magique "50px", voir à rendre ça dynamique genre X % de la taille du viewport client)
    const newWidth = scaledX <= x ? 50 : Math.abs(x - scaledX);
    const newHeight = scaledY <= y ? 50 : Math.abs(y - scaledY);

    if (newWidth >= 50) setInnerWidth(newWidth);
    if (newHeight >= 50) setInnerHeight(newHeight);

    if (newWidth >= 50 && newHeight >= 50) {
      dispatch(
        updateAnnotationById({ id, width: newWidth, height: newHeight })
      );
    }
  };

  /**
   * Fonction "throttlée" avec un délai de 50ms pour réduire le spam/pertes de perf
   * le useCallback(f, []) sert à ce que la fonction ne se recrée pas à chaque rendu
   */
  const throttledResizeDOS = useCallback(throttle(resize, 50), [x, y]);

  /**
   * Update the position of the entity by an increment
   * and dispatches to the store
   *
   * TODO:
   *  - separate and only dispatch on the last call (perf) ?
   *  - Remove the MAGIC NUMBER (10) corresponding to the Graph's grid
   *    (Draggable "snaps" to a grid, if we want, and Tiles snap to 10, so I did the same)
   */
  const updatePos = (event: DraggableEvent, data: DraggableData) => {
    event.stopPropagation();

    // Round how much the entity was moved (by increments of 10, the value used in `grid` de `<Draggable>`)
    const delta = {
      x: 10 * Math.round(data.deltaX / 10),
      y: 10 * Math.round(data.deltaY / 10),
    };

    dispatch(
      updateAnnotationById({
        id,
        x: x + delta.x,
        y: y + delta.y,
      })
    );
  };

  /**
   * Propagation must be stopped while editing
   * (for instance if the user wants to select some text)
   * or the graph will start "selecting"
   */
  const handleMouseMoveWhileEditing = (e: React.MouseEvent) => {
    if (isEditable) e.stopPropagation();
  };

  /** Enables editing of the text */
  const handleMouseDownOnResizeArrow = (
    e: React.MouseEvent<HTMLSpanElement>
  ) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  /** Toggles selection state on short clicks (less than 300ms) */
  const handleClickOnAnnotation = (e: React.MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    if (e.timeStamp < mousedownTimestamp + 300) {
      // unselect all unless Ctrl clicking
      // TODO: Refactor. This is duplicated in Tile. The selection logic should be in the parent component (Graph)
      if (!e.ctrlKey) {
        dispatch(setSelectedAnnotations({}));
        dispatch(setGraphSelection([]));
        dispatch(setGraphFocus(null));
      }
      dispatch(toggleAnnotationSelectionById(id));
    }
  };

  const handleMouseDownOnAnnotation = (event: DraggableEvent) => {
    event.stopPropagation();
    setMousedownTimestamp(event.timeStamp);
  };

  /** Submit changes on Enter */
  const handleKeypressOnHiddenInput = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === Key.Enter) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputValueChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setEditableContent(e.currentTarget.value);
  };

  /* Update ref for usage inside throttled function */
  useEffect(() => {
    graphStateRef.current = graphState;
  }, [
    graphState.graphOrigin.x,
    graphState.graphOrigin.y,
    graphState.graphScale,
  ]);

  /* Focus input on isEditable toggle */
  useEffect(() => {
    if (isEditable && contentInputRef.current) contentInputRef.current.focus();
  }, [isEditable]);

  /*
   *  Update ref when resizing
   *  and add/remove document listeners, used for resizing
   */
  useEffect(() => {
    // update ref for usage inside throttle function
    isResizingRef.current = isResizing;

    if (isResizing) {
      document.addEventListener("mousemove", throttledResizeDOS);
      document.addEventListener("mouseup", handleMouseUpOnResizeWidget);
    }

    // Remove listeners when un-mounting
    return () => {
      document.removeEventListener("mousemove", throttledResizeDOS);
      document.removeEventListener("mouseup", handleMouseUpOnResizeWidget);
    };
  }, [isResizing]);

  /* Keep size updated base on the store's truth */
  useEffect(() => {
    setInnerWidth(width);
    setInnerHeight(height);
  }, [width, height]);

  /* Recompute the font-size for input everytime the value changes or the user resized the component */
  useEffect(() => {
    // constants TODO: Set globally or in the store (these should be the extremes allowed in the Graph's UI/TopBar)
    const MIN_FONT_SIZE = 8;
    const MAX_FONT_SIZE = fontSizeInPx;

    const ghost = ghostInputRef.current;
    const input = contentInputRef.current;
    let currentFontSize = MIN_FONT_SIZE;
    let isOverflow = false;

    while (!isOverflow && currentFontSize < MAX_FONT_SIZE && ghost && input) {
      ghost.style.fontSize = `${currentFontSize}px`;
      isOverflow = ghost.scrollHeight > input.clientHeight;
      if (!isOverflow) currentFontSize++;
    }

    setInputFontSize(currentFontSize - 1);
  }, [editableContent, isEditable]);

  return (
    <Draggable
      grid={[10 * graphState.graphScale, 10 * graphState.graphScale]}
      bounds={{
        left: -2147483648,
        top: -2147483648,
        right: 2147483647,
        bottom: 2147483647,
      }}
      handle=".handle"
      position={{ x, y }}
      scale={graphState.graphScale}
      onStart={handleMouseDownOnAnnotation}
      onDrag={updatePos}
      onStop={updatePos}
      disabled={isEditable || isResizing}
    >
      <foreignObject
        style={{
          backgroundColor: fill,
          outlineStyle: "solid",
          outlineColor: isSelected ? stroke : fill,
          outlineWidth: `${thikness}px`,
        }}
        className={cx({
          [styles.AnnotationContainer]: true,
          [styles.focused]: isEditable,
        })}
        width={innerWidth}
        height={innerHeight}
      >
        <g
          className="handle"
          onClick={handleClickOnAnnotation}
          onMouseMove={handleMouseMoveWhileEditing}
          onDoubleClick={toggleIsEditable}
        >
          {}
          <foreignObject
            className={cx({
              [styles.AnnotationContainer]: true,
              [styles.focused]: isEditable,
            })}
            width={innerWidth}
            height={100}
            style={{
              // outlineStyle: 'solid',
              // outlineColor: isSelected ? stroke : fill,
              // outlineWidth: `${thikness}px`,
              backgroundColor: fill,
              display: "flex",
              alignItems: "center",
            }}
          >
            <p
              className={cx({
                [styles.AnnotationContent]: true,
                [styles.focused]: isEditable,
              })}
              style={{
                height: `${innerHeight - 2 * borderWidth}px`,
                width: `${innerWidth - 2 * borderWidth}px`,
                maxWidth: `calc(${innerWidth - 2 * borderWidth}px - 1em)`,
                fontFamily: font,
                fontSize: `${fontSizeInPx}px`,
                fontWeight: `${bold ? "bold" : "normal"}`,
                fontStyle: `${isItalic ? "italic" : "normal"}`,
                textDecoration: `${isUnderline ? "underline" : "none"}`,
                // @ts-ignore
                textAlign,
                color: textColor,
              }}
            >
              {props.label}
            </p>

            <span
              ref={dragRef}
              data-visible={isEditable || isSelected || isResizing}
              className={styles.ResizeTriangle}
              onMouseDown={handleMouseDownOnResizeArrow}
            />

            <form
              onSubmit={handleSubmit}
              style={{ height: `${innerHeight - 2 * borderWidth}px` }}
            >
              <span
                className={styles.GhostInput}
                style={{ fontSize: fontSizeInPx }}
                ref={ghostInputRef}
              >
                {editableContent}
              </span>
              <textarea
                className={styles.HiddenInput}
                value={editableContent}
                ref={contentInputRef}
                style={{ fontSize: `${inputFontSize}px`, height: "100%" }}
                onKeyPress={handleKeypressOnHiddenInput}
                onClick={unhandle}
                // @ts-ignore
                onChange={handleInputValueChange}
                onBlur={() => setIsEditable(false)}
                onFocus={handleInputFocus}
              />
            </form>
          </foreignObject>
        </g>
      </foreignObject>
    </Draggable>
  );
};

export default Annotation;
