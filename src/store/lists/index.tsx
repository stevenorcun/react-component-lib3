import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { ListProps } from "../../constants/ListProps";
import filterOriginList from "../../components/Lists/utils";

export interface ListState {
  originalLists: ListProps[];
  originalListsFilter: any;
  selectOneList?: ListProps;
  valueFilter: string;
  selectObjectId: {
    [id: string]: boolean;
  };
}

const initialState: ListState = {
  originalLists: [],
  originalListsFilter: [],
  selectOneList: {
    id: "",
    createdAt: 0,
    updatedAt: 0,
    value: {
      label: "",
      favorite: false,
      case: "",
      status: true,
      listsId: [],
    },
  },
  valueFilter: "",
  selectObjectId: {},
};

const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setOriginalLists: (state, action) => {
      state.originalLists = action.payload;
      state.originalListsFilter = action.payload;
    },
    setAllOriginalLists: (state, action) => {
      state.originalLists = action.payload;
    },
    setOriginalListsFilter: (state, action) => {
      state.originalListsFilter = action.payload;
    },

    setSelectOneList: (state, action) => {
      state.selectOneList = action.payload;
    },
    setValueFilter: (state, action) => {
      state.valueFilter = action.payload;
      const resultFilter = filterOriginList(
        state.originalLists,
        action.payload
      );
      state.originalListsFilter = resultFilter;
    },
    setSelectObjectId: (state, action) => {
      state.selectObjectId = action.payload;
    },
    createList: (
      state: ListState,
      action: PayloadAction<Partial<ListProps["value"]>>
    ) => {
      // create new list
      const list = {
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        value: {
          label: "Liste",
          favorite: false,
          case: action.payload.case,
          status: true,
          listsId: [],
          ...(action.payload || {}),
        },
      };
      // state.originalLists.push(list);
      // @ts-ignore
      state.originalLists = [...state.originalLists, { ...list }];
      state.originalListsFilter = state.originalLists;
    },
    addIdsToListById: (
      state: ListState,
      action: PayloadAction<{
        listId: string;
        newEntityIds: string[];
      }>
    ) => {
      const foundIndex = state.originalLists.findIndex(
        (list) => list.id === action.payload.listId
      );

      if (foundIndex >= 0) {
        const newIds = Array.from(
          new Set([
            ...state.originalLists[foundIndex].value.listsId,
            ...(action.payload.newEntityIds || []),
          ])
        );
        state.originalLists[foundIndex].value.listsId = newIds;
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setOriginalLists,
  setAllOriginalLists,
  setOriginalListsFilter,
  setSelectOneList,
  setValueFilter,
  setSelectObjectId,
  createList,
  addIdsToListById,
  // reset slice
  resetSlice: resetSliceLists,
} = listSlice.actions;

export const selectLists = (state) => state.lists;

export default listSlice.reducer;
