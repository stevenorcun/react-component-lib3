import { Draft, PayloadAction } from "@reduxjs/toolkit";

import {
  STROKES_FILLS_COLORS,
  STYLES_BY_FILL_COLORS_OBJECT,
} from "../../constants/graph-themes";

import { AnnotationDto } from "../../API/DataModels/Entities/AnnotationEntity";
import { GraphState } from "../../store/graph/index";
import { ObjectDto } from "../../API/DataModels/Entities/ObjectEntity";

export interface ToolbarState {
  currentFill: string;
  currentStroke: string;
  currentFont: string;
  currentSizeFont: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: string;
  textColorAnnotation: string;
  thicknessAnnotation: string;
  currenColorObject: number;
  listFonts: Array<string> | {};
  selectedAnnotations: any;
  annotations: any;
}

function setSelectedAnnotationStyle(
  state: Draft<ToolbarState>,
  style: Partial<AnnotationDto>
) {
  Object.keys(state.selectedAnnotations).forEach((annotationId) => {
    state.annotations[annotationId] = {
      ...state.annotations[annotationId],
      ...style,
    };
  });
}

function setSelectedEntitiesStyle(
  state: Draft<GraphState>,
  style: Partial<ObjectDto>
) {
  // Update selected entities
  state.selection.forEach((id) => {
    state.entityGraphPropertiesMap[id] = {
      ...state.entityGraphPropertiesMap[id],
      ...style,
    };
  });

  // Update selected annotations
}

export const initialStateToolbar: ToolbarState = {
  annotations: {},
  selectedAnnotations: {},
  currentFill: STROKES_FILLS_COLORS[8],
  currentStroke: STROKES_FILLS_COLORS[9],
  currentFont: "Noto Sans",
  currentSizeFont: "12",
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textAlign: "left",
  textColorAnnotation: STROKES_FILLS_COLORS[15],
  thicknessAnnotation: "3",
  currenColorObject: 0,
  listFonts: new Set(),
};

export const toolbarReducer = {
  setListFonts: (state, action) => {
    state.listFonts = action.payload;
  },

  setCurrentStrokeColour: (state, action) => {
    state.currentStroke = action.payload;
  },

  applyStrokeColor: (state, action) => {
    setSelectedAnnotationStyle(state, { stroke: action.payload });
  },
  /** Sets background colour in the store */
  setCurrentFillColour: (state, action) => {
    state.currentFill = action.payload;
    setSelectedAnnotationStyle(state, { fill: action.payload });
  },
  // Sets fonts in the store
  setCurrentFont: (state, action) => {
    state.currentFont = action.payload;
  },

  applyFontStyle: (state, action) => {
    setSelectedAnnotationStyle(state, { font: action.payload });
  },

  setCurrentSizeFont: (state, action) => {
    state.currentSizeFont = action.payload;
  },

  applySizeFont: (state, action) => {
    setSelectedAnnotationStyle(state, { fontSizeInPx: action.payload });
  },
  // Sets fonts in the store

  setIsBold: (state, action) => {
    state.isBold = action.payload;
  },

  applyBoldStyle: (state, action: PayloadAction<boolean>) => {
    setSelectedAnnotationStyle(state, { bold: action.payload });
  },

  setIsItalic: (state, action) => {
    state.isItalic = action.payload;
  },

  applyItalicStyle: (state, action: PayloadAction<boolean>) => {
    setSelectedAnnotationStyle(state, { isItalic: action.payload });
  },

  setIsUnderline: (state, action) => {
    state.isUnderline = action.payload;
  },

  applyUnderlineStyle: (state, action: PayloadAction<boolean>) => {
    setSelectedAnnotationStyle(state, { isUnderline: action.payload });
  },

  setTextAlign: (state, action) => {
    state.textAlign = action.payload;
    setSelectedAnnotationStyle(state, { textAlign: action.payload });
  },

  setTextColorAnnotation: (state, action) => {
    state.textColorAnnotation = action.payload;
  },

  applyTextColorAnnotation: (state, action) => {
    setSelectedAnnotationStyle(state, { textColor: action.payload });
  },

  setCurrentThiknessAnnotation: (state, action) => {
    state.thicknessAnnotation = action.payload;
  },

  applyThiknessAnnotation: (state, action) => {
    setSelectedAnnotationStyle(state, { thikness: action.payload });
  },

  setCurrentColorObject: (state, action) => {
    state.currenColorObject = action.payload;
    setSelectedAnnotationStyle(state, { fill: action.payload });
    setSelectedEntitiesStyle(state, {
      fill: STYLES_BY_FILL_COLORS_OBJECT[action.payload].fontByDefault,
      textColor: STYLES_BY_FILL_COLORS_OBJECT[action.payload].textByDefault,
      iconColor: STYLES_BY_FILL_COLORS_OBJECT[action.payload].iconByDefault,
      strokeLabel:
        STYLES_BY_FILL_COLORS_OBJECT[action.payload].strokeLabelByDefault,
      textLabelColor:
        STYLES_BY_FILL_COLORS_OBJECT[action.payload].textLabelByDefault,
    });
  },
};
