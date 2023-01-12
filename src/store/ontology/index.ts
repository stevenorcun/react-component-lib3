import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OntologySettings } from "../../API/controllers/ontology-settings-api";

export interface OntologyConfigState {
  ontology: OntologySettings[];
  ont: any[];
  tagsConf: any[];
}

const initialState: OntologyConfigState = {
  ontology: [],
  ont: [],
  tagsConf: [],
};

const ontologyConfigSlice = createSlice({
  name: "ontologyConfig",
  initialState: initialState,
  reducers: {
    setTagsConf: (state, action: PayloadAction<any[]>) => {
      state.tagsConf = action.payload;
    },
    setOntology: (state, action: PayloadAction<any[]>) => {
      state.ont = action.payload;
    },
    setOntologySettings: (state, action: PayloadAction<OntologySettings[]>) => {
      state.ontology = [...action.payload];
    },
    saveOntologyPropSettings: (
      state,
      action: PayloadAction<{
        oId: string;
        pId: string;
        key: string;
        value: string;
      }>
    ) => {
      const { payload } = action;
      if (payload?.oId) {
        const oIndex = state.ontology.findIndex(
          (o) => o.objectId === payload.oId
        );
        if (oIndex >= 0) {
          const newOntologySetting = { ...state.ontology[oIndex] };

          const pIndex = newOntologySetting.properties.findIndex(
            (p) => p.id === payload.pId
          );
          if (pIndex >= 0) {
            const newProp = { ...newOntologySetting.properties[pIndex] };
            newProp[payload.key] = payload.value;
            newProp["propertyId"] = newProp["id"];
            newOntologySetting.properties[pIndex] = newProp;
            state.ontology[oIndex] = newOntologySetting;
          }
        }
      }
    },
    saveOntologySettings: (
      state,
      action: PayloadAction<{ id: string; key: string; value: string }>
    ) => {
      const { payload } = action;
      if (payload?.id) {
        const oIndex = state.ontology.findIndex(
          (o) => o.objectId === payload.id
        );
        if (oIndex >= 0) {
          const newOntologySetting = { ...state.ontology[oIndex] };
          newOntologySetting[payload.key] = payload.value;
          state.ontology[oIndex] = newOntologySetting;
        }
      }
    },
    /** ************
     * RESET SLICE *
     ************** */
    resetSlice: () => ({ ...initialState }),
  },
});

export const {
  setTagsConf,
  setOntology,
  setOntologySettings,
  saveOntologySettings,
  saveOntologyPropSettings,
  // reset slice
  resetSlice: resetSliceOntology,
} = ontologyConfigSlice.actions;

export const selectOntologyConfig = (state) => state.ontologyConfig;

export default ontologyConfigSlice.reducer;
