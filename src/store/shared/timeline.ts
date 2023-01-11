import { PayloadAction } from '@reduxjs/toolkit';
import { ChartMouseEvent } from '@/components/TimelineWidget/RechartsTimeline/RechartsTimeline';

export interface CanImplementTimelineState {
  timelineHighlightedIds: { [key: string]: boolean };
  isTimelineWidgetExpanded: boolean;
  timelineLeftSelectionProps: ChartMouseEvent | null;
  timelineRightSelectionProps: ChartMouseEvent | null;
  // unused?
  startDateTimeline: number;
  endDateTimeline: number;
}

export const initTimelineState: () => CanImplementTimelineState = () => ({
  timelineHighlightedIds: {},
  isTimelineWidgetExpanded: false,
  timelineLeftSelectionProps: null,
  timelineRightSelectionProps: null,
  startDateTimeline: Date.now(),
  endDateTimeline: Date.now(),
});

export const timelineReducers = {
  setIsTimelineWidgetExpanded: (
    state: CanImplementTimelineState,
    action: PayloadAction<boolean>,
  ) => {
    state.isTimelineWidgetExpanded = action.payload;
  },
  setTimelineHighlightedIds: (
    state: CanImplementTimelineState,
    action: PayloadAction<CanImplementTimelineState['timelineHighlightedIds']>,
  ) => {
    state.timelineHighlightedIds = action.payload;
  },
  setTimelineLeftSelectionProps: (
    state: CanImplementTimelineState,
    action: PayloadAction<ChartMouseEvent | null>,
  ) => {
    state.timelineLeftSelectionProps = action.payload;
  },
  setTimelineRightSelectionProps: (
    state: CanImplementTimelineState,
    action: PayloadAction<ChartMouseEvent | null>,
  ) => {
    state.timelineRightSelectionProps = action.payload;
  },
  /**
   * Raccourci pour dé-highlighter too
   * -> reset la Map d'ID et retire la zone de sélection
   */
  clearTimelineHighlight: (state: CanImplementTimelineState) => {
    state.timelineHighlightedIds = {};
    state.timelineLeftSelectionProps = null;
    state.timelineRightSelectionProps = null;
  },
  setStartDateTimeline: (state: CanImplementTimelineState, action: PayloadAction<number>) => {
    state.startDateTimeline = action.payload;
  },
  setEndDateTimeline: (state: CanImplementTimelineState, action: PayloadAction<number>) => {
    state.endDateTimeline = action.payload;
  },
};
