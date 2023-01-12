/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React from "react";
import moment from "moment";
import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";

import PrimaryViews from "../../constants/general";

import IconExplorer from "../../assets/images/icons/IconExplorer";

export interface ExplorerState {
  tabs: Array<{
    properties: Array<string>;
    data: Array<GenericObject>;
    tab: string;
    type: string;
    origin: string;
    icon?: React.ReactNode;
    listDataByProperty: {
      [key: string]: Array<string>;
    };
    listDataSelectedById: Array<string>;
    currentSelected: any;
    entitiesSelected: Array<GenericObject>;
  }>;
  activeExlorerTabIndex: number | null;
  isLoading: boolean;
  beneficiaryPhone: string;
  duplicate: Array<string>;
}

const initialState: ExplorerState = {
  tabs: [],
  activeExlorerTabIndex: null,
  isLoading: true,
  beneficiaryPhone: "",
  duplicate: [],
};

interface GenericObject {
  [key: string]: any;
}

export enum ExplorerType {
  dragAndDrop = "dragAndDrop",
  csv = "csv",
}

const checkDuplicate = (
  data: Array<GenericObject>,
  listDuplicateData: Array<string>
) =>
  data.reduce((acc: Array<GenericObject>, curr: GenericObject) => {
    if (acc.find((el) => _.isEqual(el, curr))) {
      listDuplicateData.push(curr.label || "");
      return acc;
    }
    acc.push(curr);
    return acc;
  }, []);

const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    addEntitiesExplorer: (state, action) => {
      const index =
        state.activeExlorerTabIndex === null
          ? 0
          : state.activeExlorerTabIndex + 1;
      let entities = [];
      let result: Array<GenericObject> = [];
      let allproperties: Array<string> = [];

      if (action.payload.type === ExplorerType.csv) {
        const [first, ...rest] = action.payload.data;
        // Transformation des données en objet
        result = rest.reduce(
          (acc: Array<GenericObject>, curr: GenericObject, id: number) => {
            const line = curr.reduce(
              (accu: GenericObject, curru, indexou: number) => {
                accu[first[indexou]] = curru;
                return accu;
              },
              {}
            );
            acc.push({
              properties: line,
              isSelected: false,
              isOverSelected: false,
              label: `csv #${id}`,
              typeFormat: "csv",
              id: `{idCsv${Math.random().toString(16).slice(4)}}`,
            });
            return acc;
          },
          []
        );
        allproperties = first;
      } else {
        entities = Object.values(action.payload.entities);
        // Vérifier qu'il n'y a pas de doublon des propriétés, lors d'un seul D&D de plusieurs objets.
        allproperties = [
          ...new Set(
            entities
              .map((el: GenericObject) =>
                el.__properties.values.map(
                  (value: { key: string }) => value.key
                )
              )
              .flat()
          ),
        ];

        // transformation object current propre à D&D
        result = entities.reduce(
          (list: Array<GenericObject>, curr: GenericObject) => {
            const lineData = allproperties?.reduce(
              (accum: GenericObject, property) => {
                const currIndex = curr.__properties.values.findIndex(
                  (el: { key: string }) => property === el.key
                );
                if (currIndex !== -1) {
                  const key = property;
                  const { label } =
                    curr.__properties.values[currIndex].value[0];
                  accum[key] = label;
                }
                return accum;
              },
              {}
            );
            list.push({
              properties: lineData,
              id: curr.id,
              label: curr.label,
              _DATATYPE: curr._DATATYPE,
              isSelected: false,
              isOverSelected: false,
              _MARKINGS: curr._MARKINGS,
              related: curr.__related,
            });
            return list;
          },
          []
        );
      }

      // add with before object
      if (index !== 0 && state.activeExlorerTabIndex !== null) {
        const beforeProperties = Array.from(
          state.tabs[state.activeExlorerTabIndex].properties
        );
        const beforeData = _.clone(
          state.tabs[state.activeExlorerTabIndex].data
        );

        const allProperties = [...allproperties, ...beforeProperties];
        const allData = [...result];
        allData.push(...beforeData);
        const newListProperties = [
          ...new Set(allProperties.map((el) => el).flat()),
        ];
        allproperties = newListProperties;
        result = allData;
      }

      const duplicate = [];
      // @ts-ignore
      result = checkDuplicate(result, duplicate);

      // @ts-ignore
      state.tabs[index] = {
        properties: allproperties,
        data: result,
        tab: "Tableau",
        type: action.payload.type === ExplorerType.csv ? "Import Csv" : "Ajout",
        origin: `${
          PrimaryViews[action.payload.source.substr(1)]
        } - ${moment().format("DD/MM/YYYY - hh:mm")}`,
        icon: <IconExplorer />,
        listDataByProperty: {},
        currentSelected: null,
        entitiesSelected: [],
      };
      state.activeExlorerTabIndex = index;
      state.duplicate = duplicate;
      if (state.tabs[action.payload.id]) {
        state.isLoading = !state.isLoading;
      }
    },

    explorerSelectEveryEntity: (state) => {
      if (state.activeExlorerTabIndex !== null) {
        const index = state.activeExlorerTabIndex;
        const copyEntities = _.cloneDeep(state.tabs[index].data);
        const currentSelected = copyEntities[0];

        copyEntities.forEach((element: { isSelected: boolean }) => {
          element.isSelected = true;
        });

        state.tabs[index].entitiesSelected = [...state.tabs[index].data];
        state.tabs[index].data = copyEntities;
        state.tabs[index].currentSelected = currentSelected;
      }
    },

    explorerInvertSelection: (state) => {
      if (state.activeExlorerTabIndex !== null) {
        const index = state.activeExlorerTabIndex;
        const copyEntities = _.cloneDeep(state.tabs[index].data);

        copyEntities.forEach((element: { isSelected: boolean }) => {
          element.isSelected = !element.isSelected;
        });

        const resultOnlySelected = copyEntities.filter(
          (element: { isSelected: boolean }) => element.isSelected === true
        );

        state.tabs[index].entitiesSelected = resultOnlySelected;
        state.tabs[index].data = copyEntities;
        state.tabs[index].currentSelected = resultOnlySelected[0] ?? {};
      }
    },

    setIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },

    resetListDuplicate: (state) => {
      state.duplicate = [];
    },

    sortFilterEntities: (state, action) => {
      let listAllproperties = [...action.payload.properties];

      const copyData = _.clone(action.payload.data);

      listAllproperties = listAllproperties.filter((element: string) =>
        copyData.find((el: GenericObject) => el[element])
      );

      // @ts-ignore
      state.tabs.splice(action.payload.id, 0, {
        properties: listAllproperties,
        data: copyData,
        tab: action.payload.tab,
        type: action.payload.type,
        origin: "import",
        listDataByProperty: {},
        icon: action.payload.icon,
      });
      state.activeExlorerTabIndex = action.payload.id;
    },

    changeSelection: (state, action) => {
      // @ts-ignore
      state.tabs[state.activeExlorerTabIndex] = {
        // @ts-ignore
        ...state.tabs[state.activeExlorerTabIndex],
        data: action.payload,
      };
    },

    handleSelected: (state, action) => {
      // @ts-ignore
      state.tabs[state.activeExlorerTabIndex].currentSelected = action.payload;
    },

    // ajout ou suppression d'une entité sélectionné
    handleEntitiesSelected: (state, action) => {
      // @ts-ignore
      state.tabs[state.activeExlorerTabIndex].entitiesSelected = action.payload;
    },

    removeTabExplorer: (state, action) => {
      state.tabs.splice(action.payload, 1);
      state.activeExlorerTabIndex = action.payload - 1;
    },

    toggleSelectSubTab: (state, action) => {
      if (state.activeExlorerTabIndex !== null) {
        state.tabs[state.activeExlorerTabIndex] = {
          ...state.tabs[state.activeExlorerTabIndex],
          tab: action.payload,
        };
      }
    },
    setlistDataByProperty: (state, action) => {
      if (typeof state.activeExlorerTabIndex === "number") {
        state.tabs[state.activeExlorerTabIndex].listDataByProperty[
          action.payload.key
        ] = action.payload.data;
      }
    },

    toggleSelectActiveExplorerTab: (state, action) => {
      state.activeExlorerTabIndex = action.payload;
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  toggleSelectSubTab,
  setlistDataByProperty,
  setIsLoading,
  sortFilterEntities,
  changeSelection,
  handleSelected,
  handleEntitiesSelected,
  toggleSelectActiveExplorerTab,
  removeTabExplorer,
  addEntitiesExplorer,
  resetListDuplicate,
  explorerSelectEveryEntity,
  explorerInvertSelection,
  // reset slice
  resetSlice: resetSliceExplorer,
} = explorerSlice.actions;

export const selectExplorer = (state) => state.explorer;

export default explorerSlice.reducer;
