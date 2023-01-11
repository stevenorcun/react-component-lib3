import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import { convertToEntityDto } from "@/API/DataModels/DTO/entityDto";
import { GraphState } from "@/store/graph";
import {
  CanImplementHistogramState,
  highlightReducers,
  initialHistogramState,
} from "@/store/shared/histogram";
import {
  CanImplementTimelineState,
  initTimelineState,
  timelineReducers,
} from "@/store/shared/timeline";
import { toast } from "react-toastify";
import React from "react";
import { getEntityTypeId, getIdProperty } from "@/constants/entity-related";
import { OntologyConfigState } from "../ontology";

export interface MapState
  extends CanImplementHistogramState,
    CanImplementTimelineState {
  styleView: string;
  activeMenu: string;
  filterActiveMenu: string;
  isLessMapComponent: boolean;

  // Draw
  circleRadiusInKm: number;
  circleCenterCoord: [number, number] | [];

  // Active layers
  activeHeatmap: boolean;
  activeKmlMap: boolean;
  activeMETRO: boolean;
  activeRER: boolean;
  activeHistogramID: string;
  activeCluster: boolean;

  // Nova entities
  onImportEntities: boolean;
  onImportEntitiesWithoutGeo: boolean;
  entities: EntityDto[];
  selection: EntityDto["id"][];
  newEntity: EntityDto[];
  kmlEntity: object | null;
  kmlEntities: any;
  selectedKMLEntities: [];
  kmlObjs: [];
  // todo : change it
  kmlObj: object | null;
  HighlightedEntities: EntityDto[];
  focusedEntityId: string | null;

  // Geocodage new item
  geocodageItemCoord: [number, number] | null;
  validTypeEntities: EntityDto[];
  planeFlightCoord: any;

  // Heatmap part
  timeRange: [number, number] | [];
  earthQuakes: any;
  selectTime: any;
  allDays: boolean;

  // Left Drawer
  isCollapsedLeftDrawer: Boolean;

  // Histogram
  histogramHighlights: GraphState["histogramHighlights"];
  isCollapsedRightDrawer: Boolean;
  ApplyKML: string;
  selectedEntities: any;
}

const initialState: MapState = {
  geocodageItemCoord: null,
  ApplyKML: "",
  styleView: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  activeMenu: "SimpleSelect",
  filterActiveMenu: "Light",
  isLessMapComponent: false,

  // Active layers
  activeHeatmap: false,
  activeKmlMap: false,
  activeMETRO: false,
  activeRER: false,
  activeHistogramID: "",
  activeCluster: false,

  // Draw
  circleRadiusInKm: 0.0,
  circleCenterCoord: [0.0, 0.0],

  // Geocodage
  validTypeEntities: [],
  planeFlightCoord: [],

  // Nova entities
  onImportEntities: false,
  onImportEntitiesWithoutGeo: false,
  entities: [].map(convertToEntityDto),
  newEntity: [],
  selectedEntities: [],
  selection: [],
  kmlEntity: null,
  kmlEntities: [],
  selectedKMLEntities: [],
  kmlObjs: [],
  kmlObj: null,
  HighlightedEntities: [],
  focusedEntityId: null,

  // Heatmap part
  timeRange: [0, 0],
  earthQuakes: null,
  selectTime: 0,
  allDays: true,

  // Left Drawer
  isCollapsedLeftDrawer: false,
  isCollapsedRightDrawer: false,

  // Timeline
  ...initTimelineState(),
  // Histogram
  ...initialHistogramState(),
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setStyleView: (state: MapState, action) => {
      state.styleView = action.payload;
    },
    setIsLessMapComponent: (state: MapState, action) => {
      state.isLessMapComponent = action.payload;
    },
    // Draw
    setCircleRadiusInKm: (state: MapState, action) => {
      state.circleRadiusInKm = action.payload;
    },
    setCircleCenterCoord: (state: MapState, action) => {
      state.circleCenterCoord = action.payload;
    },

    // Active layers
    setActiveHeatmap: (state: MapState, action) => {
      state.activeHeatmap = action.payload;
    },
    setActiveCluster: (state: MapState, action) => {
      state.activeCluster = action.payload;
    },
    setActiveKmlMap: (state: MapState, action) => {
      state.activeKmlMap = action.payload;
    },
    setKmlEntity: (state: MapState, action) => {
      state.kmlEntity = action.payload;
      const { payload } = action;
      if (!payload) {
        return;
      }
      const entity = state.kmlEntity;
      if (entity) {
        state.kmlEntities.push({
          ...entity,
          id: `-kml-${Math.random()}${Date.now()}`,
        });
      }
    },
    setKmlEntities: (state: MapState, action) => {
      state.kmlEntities = action.payload;
    },
    setSelectedKMLEntities: (state, action) => {
      state.selectedKMLEntities = action.payload;
    },
    setKmlObjs: (state, action) => {
      state.kmlObjs = action.payload;
    },
    setKmlObj: (state: MapState, action) => {
      state.kmlObj = action.payload;
    },
    setActiveMETROMap: (state: MapState, action) => {
      state.activeMETRO = action.payload;
    },
    setActiveRERMap: (state: MapState, action) => {
      state.activeRER = action.payload;
    },
    setApplyKML: (state, action) => {
      state.ApplyKML = action.payload;
    },

    // Toolbar
    setActiveMenu: (state: MapState, action) => {
      state.activeMenu = action.payload;
    },
    setFilterActiveMenu: (state: MapState, action) => {
      state.filterActiveMenu = action.payload;
    },
    setActiveHistogramID: (state: MapState, action) => {
      state.activeHistogramID = action.payload;
    },

    // Nova entities
    setOnImportEntities: (state: MapState, action) => {
      state.onImportEntities = action.payload;
    },
    setMapEntity: (state: MapState, action) => {
      state.newEntity = action.payload;
    },
    setEntities: (state, action: PayloadAction<MapState["entities"]>) => {
      state.entities = action.payload;
    },
    setSelectedEntities: (state: MapState, action: PayloadAction<string[]>) => {
      state.selection = action.payload;
    },
    addToSelectedEntities: (state: MapState, action: PayloadAction<string>) => {
      const { payload } = action;
      if (!payload) {
        return;
      }
      const alreadySelected = state.selection.find((id) => id === payload);
      if (!alreadySelected) {
        state.selection.push(payload);
      }
    },
    removeFromSelectedEntities: (
      state: MapState,
      action: PayloadAction<string>
    ) => {
      const { payload } = action;
      if (!payload) {
        return;
      }
      const index = state.selection.findIndex((id) => id === payload);
      if (index !== -1) {
        state.selection.splice(index, 1);
      }
    },
    toggleSelectedEntity: (state: MapState, action: PayloadAction<string>) => {
      const { payload } = action;
      if (!payload) {
        return;
      }
      const index = state.selection.findIndex((id) => id === payload);

      if (index !== -1) {
        state.selection.splice(index, 1);
      } else {
        state.selection.push(payload);
      }
    },
    setHighlightedEntities: (
      state: MapState,
      action: PayloadAction<EntityDto[]>
    ) => {
      state.HighlightedEntities = action.payload;
    },

    setMapFocus: (
      state,
      action: PayloadAction<MapState["focusedEntityId"]>
    ) => {
      state.focusedEntityId = action.payload;
    },

    // Left Drawer
    setCollapsedLeftDrawer: (state: MapState, action) => {
      state.isCollapsedLeftDrawer = action.payload;
    },

    setCollapsedRightDrawer: (state: MapState, action) => {
      state.isCollapsedRightDrawer = action.payload;
    },

    // Heatmap part
    setTimeRange: (state: MapState, action) => {
      state.timeRange = action.payload;
    },
    setSelectTime: (state: MapState, action) => {
      state.selectTime = action.payload;
    },
    setEarthQuakes: (state: MapState, action) => {
      state.earthQuakes = action.payload;
    },
    setuseAllDays: (state: MapState, action) => {
      state.allDays = action.payload;
    },
    selectEveryEntity: (state) => {
      state.selection = state.entities.map(({ id }) => id);
    },

    // Geocodage new item
    setValidTypeEntities: (state, action) => {
      state.validTypeEntities = action.payload;
    },
    setOnImportEntitiesWithoutGeo: (state, action) => {
      state.onImportEntitiesWithoutGeo = action.payload;
    },

    addPlaneFlightCoord: (
      state,
      action: PayloadAction<{
        entity: EntityDto;
        ont: OntologyConfigState["ont"];
        coordinates: [number, number][];
      }>
    ) => {
      const { entity, coordinates, ont } = action.payload;
      const idProp = getIdProperty(entity, ont);
      if (entity) {
        state.planeFlightCoord.push({
          entity,
          id: entity[idProp],
          type: getEntityTypeId(entity, ont),
          coordinates,
        });
      }
    },

    ...timelineReducers,
    ...highlightReducers,
    addEntities: (state, action: PayloadAction<MapState["entities"]>) => {
      state.focusedEntityId = null;

      const l = action.payload.length;

      for (let i = 0; i < l; ++i) {
        const entity = action.payload[i];
        if (entity.id) {
          const { id } = entity;
          state.selection.push(id);
          state.focusedEntityId = id;
        }
      }

      const entityIdsAsMap = state.entities.reduce(
        (acc: { [entityId: string]: boolean }, e) => {
          acc[e.id] = true;
          return acc;
        },
        {}
      );
      const alreadyInMap: EntityDto[] = [];
      // avoid duplication
      state.entities = [
        ...state.entities,
        ...action.payload.filter((e) => {
          // prevent override, same as in Graph
          if (!entityIdsAsMap[e.id]) {
            entityIdsAsMap[e.id] = true;
            return true;
          }
          alreadyInMap.push(e);
          return false;
        }),
      ];

      if (alreadyInMap.length) {
        toast.info(
          <>
            <p>Les objets suivant importés sont déjà présent sur la carte:</p>
            <ul>
              {alreadyInMap
                .filter((a) => a.geometry)
                .map((e) => (
                  <li key={e.id}>{e.TITRE}</li>
                ))}
            </ul>
          </>,
          {
            style: {
              width: "50vw",
              transform: "translate(-50%, 0)",
            },
          }
        );
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setStyleView,
  setIsLessMapComponent,
  setCircleRadiusInKm,
  setCircleCenterCoord,
  setActiveMenu,
  setFilterActiveMenu,
  setActiveHeatmap,
  setActiveCluster,
  setActiveKmlMap,
  setActiveHistogramID,
  setOnImportEntities,
  setEntities,
  setKmlEntity,
  setSelectedKMLEntities,
  setKmlObj,
  setKmlObjs,
  setKmlEntities,
  setSelectedEntities,
  addToSelectedEntities,
  removeFromSelectedEntities,
  toggleSelectedEntity,
  setActiveMETROMap,
  setActiveRERMap,
  selectEveryEntity,
  setApplyKML,
  addEntities,
  setValidTypeEntities,
  setOnImportEntitiesWithoutGeo,
  addPlaneFlightCoord,
  // Heatmap part
  setTimeRange,
  setSelectTime,
  setEarthQuakes,
  setuseAllDays,
  // DRAWERS
  setCollapsedLeftDrawer,
  setCollapsedRightDrawer,
  // TIMELINE
  setIsTimelineWidgetExpanded,
  setTimelineHighlightedIds,
  setTimelineLeftSelectionProps,
  setTimelineRightSelectionProps,
  clearTimelineHighlight,
  setStartDateTimeline,
  setEndDateTimeline,
  // HISTOGRAM / HIGHLIGHT
  setHighlightedEntities,
  toggleAuxiliaryHistogramHighlightedTypes,
  clearAuxiliaryHistogramHighlightedTypes,
  clearAuxiliaryHistogramHighlightedProperties,
  toggleAuxiliaryHistogramHighlightedProperty,
  //  SELECTION
  setMapFocus,
  // reset slice
  resetSlice: resetSliceMap,
} = mapSlice.actions;

export const selectMap = (state) => state.map;

export default mapSlice.reducer;
