import { EntityDto } from '@/API/DataModels/Database/NovaObject';
import { NovaEntityType } from '@/API/DataModels/Database/NovaEntityEnum';
import { PayloadAction } from '@reduxjs/toolkit';
import { CanImplementTimelineState, initTimelineState } from '@/store/shared/timeline';

export interface CanImplementHistogramState {
  // necessary in histogram
  timelineHighlightedIds: CanImplementTimelineState['timelineHighlightedIds'];
  histogramHighlights: {
    types: {
      [type in NovaEntityType]?: boolean;
    };
    properties: {
      // <id>: number, >0 means highlighted
      entityIds: { [id: string]: number };
      // HistogramElement's id (for css blue background)
      // and for update on Entity deletion (is array of entity IDs)
      rowIds: { [id: string]: string[] };
    };
  };
}

export const initialHistogramState: () => CanImplementHistogramState = () => (
  {
    timelineHighlightedIds: initTimelineState().timelineHighlightedIds,
    histogramHighlights: {
      types: {},
      properties: {
        entityIds: {},
        rowIds: {},
      },
    },
  }
);

export const highlightReducers = {
  toggleAuxiliaryHistogramHighlightedTypes: (
    state,
    action: PayloadAction<NovaEntityType>,
  ) => {
    const type = action.payload;
    if (state.histogramHighlights.types[type]) {
      delete state.histogramHighlights.types[type];
    } else state.histogramHighlights.types[type] = true;
  },
  clearAuxiliaryHistogramHighlightedTypes: (state) => {
    state.histogramHighlights.types = {};
  },
  clearAuxiliaryHistogramHighlightedProperties: (state) => {
    state.histogramHighlights.properties = {
      entityIds: {},
      rowIds: {},
    };
  },
  /**
   * On utilise un "compteur" et pas juste un booleen
   * car une même entité peut être highlightée par plusieurs propriétés en même temps
   */
  toggleAuxiliaryHistogramHighlightedProperty: (
    state,
    action: PayloadAction<{
      histogramElementId: string;
      entities: Partial<EntityDto>[];
    }>,
  ) => {
    const { histogramElementId, entities } = action.payload;
    // toggle OFF
    if (state.histogramHighlights.properties.rowIds[histogramElementId]) {
      delete state.histogramHighlights.properties.rowIds[histogramElementId];
      entities.forEach(({ id }) => {
        if (id && state.histogramHighlights.properties.entityIds[id]) {
          if (state.histogramHighlights.properties.entityIds[id] - 1 <= 0) {
            delete state.histogramHighlights.properties.entityIds[id];
          } else state.histogramHighlights.properties.entityIds[id] -= 1;
        }
      });
    } else {
      // toggle ON
      state.histogramHighlights
        .properties
        .rowIds[histogramElementId] = entities
          .reduce((acc: string[], e) => {
            if (e.id) acc.push(e.id);
            return acc;
          }, []);
      entities.forEach(({ id }) => {
        if (id) {
          state.histogramHighlights
            .properties
            .entityIds[id] = state.histogramHighlights
              .properties
              .entityIds[id] + 1 || 1;
        }
      });
    }
  },
};
