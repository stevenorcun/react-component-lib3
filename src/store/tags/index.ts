import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import jsonObjects from '@/API/controllers/mock/data/objects.json';
import jsonUsers from '@/API/controllers/mock/data/auth.json';
import jsonRules from '@/API/controllers/mock/data/rules.json';

export interface TagsState {
  objects: any[];
  users: any[];
  selectedProperty: any;
  contextTags: any[];
  rules: {
    id: string;
    reference: string;
    rule: {
      isDataShown: boolean;
      controlTags: {
        label: string;
        type: number;
      }[];
      dataTags: {
        label: string;
        type: number;
      }[];
    };
  }[];
}

const initialState: TagsState = {
  objects: jsonObjects.objects,
  users: jsonUsers.users,
  selectedProperty: undefined,
  contextTags: [],
  rules: jsonRules.rules,
};

const removeTagFn = (
  state,
  payload: {
    objectId?: string;
    tag?: string;
    property?: { title: string; value: string };
  }
) => {
  if (payload.objectId && payload.tag) {
    const objectIndex = state.objects.findIndex(
      (o) => o._id === payload.objectId
    );
    if (objectIndex !== -1) {
      if (
        payload.property &&
        payload.property.title &&
        payload.property.value
      ) {
        const objectProperties = state.objects[objectIndex]._source.property
          ? state.objects[objectIndex]._source.property[0].general
          : undefined;
        if (objectProperties) {
          const objectPropertyIndex = objectProperties.findIndex(
            (p) => p.title === payload.property?.title
          );
          if (objectPropertyIndex !== -1) {
            const propertyValue = objectProperties[objectPropertyIndex].content;
            const propertyValueIndex = propertyValue.findIndex(
              (v) => v.entitled === payload.property?.value
            );
            if (propertyValueIndex !== -1) {
              const { tags } = propertyValue[propertyValueIndex];
              const tagIndex = tags.findIndex((t) => t.label === payload.tag);
              if (tagIndex !== -1) {
                tags.splice(tagIndex, 1);
                // Remove from selectedProperty
                if (
                  state.selectedProperty &&
                  state.selectedProperty.title === payload.property.title &&
                  state.selectedProperty.data.entitled ===
                  propertyValue[propertyValueIndex].entitled
                ) {
                  state.selectedProperty.data.tags.splice(tagIndex, 1);
                }
                state.objects[objectIndex]._source.property[0].general[
                  objectPropertyIndex
                  ].content[propertyValueIndex].tags = [...tags];
              }
            }
          }
        }
      } else if (!payload.property) {
        const tagIndex = state.objects[objectIndex]._source.tags.findIndex(
          (t) => t.label === payload.tag
        );
        if (tagIndex !== -1) {
          state.objects[objectIndex]._source.tags.splice(tagIndex, 1);
        }
      }
    }
  }
};

const addTagFn = (
  state,
  payload: {
    objectId?: string;
    tag?: {
      label: string;
      type: number;
    };
    property?: { title: string; value: string };
  }
) => {
  if (payload.objectId && payload.tag) {
    const objectIndex = state.objects.findIndex(
      (o) => o._id === payload.objectId
    );
    if (objectIndex !== -1) {
      if (
        payload.property &&
        payload.property.title &&
        payload.property.value
      ) {
        const objectProperties = state.objects[objectIndex]._source.property
          ? state.objects[objectIndex]._source.property[0].general
          : undefined;
        if (objectProperties) {
          const objectPropertyIndex = objectProperties.findIndex(
            (p) => p.title === payload.property?.title
          );
          if (objectPropertyIndex !== -1) {
            const propertyValue = objectProperties[objectPropertyIndex].content;
            const propertyValueIndex = propertyValue.findIndex(
              (v) => v.entitled === payload.property?.value
            );
            if (propertyValueIndex !== -1) {
              const { tags } = propertyValue[propertyValueIndex];
              const tag = tags.find((t) => t.label === payload.tag?.label);
              if (!tag) {
                tags.push(payload.tag);
                // Add to selectedProperty
                if (
                  state.selectedProperty &&
                  state.selectedProperty.title === payload.property.title &&
                  state.selectedProperty.data.entitled ===
                  propertyValue[propertyValueIndex].entitled
                ) {
                  state.selectedProperty.data.tags.push(payload.tag);
                }
                state.objects[objectIndex]._source.property[0].general[
                  objectPropertyIndex
                  ].content[propertyValueIndex].tags = [...tags];
              }
            }
          }
        }
      } else if (!payload.property) {
        const tag = state.objects[objectIndex]._source.tags.find(
          (t) => t.label === payload.tag?.label
        );
        if (!tag) {
          state.objects[objectIndex]._source.tags.push(payload.tag);
        }
      }
    }
  }
};

const tagsSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    /**
     * Set the current opened property
     */
    selectProperty: (state, action: PayloadAction<any>) => {
      state.selectedProperty = action.payload;
    },
    /**
     * Remove a tag from an object or a property's value
     */
    removeTag: (
      state,
      action: PayloadAction<{
        objectId?: string;
        tag?: string;
        property?: { title: string; value: string };
      }>
    ) => {
      removeTagFn(state, action.payload);
    },
    /**
     * Remove multpile tags from an object or a property's value
     */
    removeTags: (
      state,
      action: PayloadAction<{
        objectId?: string;
        tags?: string[];
        property?: { title: string; value: string };
      }>
    ) => {
      const { payload } = action;
      if (payload.tags) {
        payload.tags.forEach((tag) => {
          removeTagFn(state, {
            objectId: payload.objectId,
            tag,
            property: payload.property,
          });
        });
      }
    },
    /**
     * Add a tag to an object or a property's value
     */
    addTag: (
      state,
      action: PayloadAction<{
        objectId?: string;
        tag?: {
          label: string;
          type: number;
        };
        property?: { title: string; value: string };
      }>
    ) => {
      addTagFn(state, action.payload);
    },
    /**
     * Add multiple tags to an object or a property's value
     */
    addTags: (
      state,
      action: PayloadAction<{
        objectId?: string;
        tags?: {
          label: string;
          type: number;
        }[];
        property?: { title: string; value: string };
      }>
    ) => {
      const { payload } = action;
      if (payload.tags) {
        payload.tags.forEach((tag) => {
          addTagFn(state, {
            objectId: payload.objectId,
            tag,
            property: payload.property,
          });
        });
      }
    },
    editTags: (
      state,
      action: PayloadAction<{
        objectId?: string;
        property?: { title: string; value: string };
        tags?: {
          label: string;
          type: number;
        }[];
      }>
    ) => {
      const { payload } = action;
      if (payload.objectId && payload.tags) {
        const objectIndex = state.objects.findIndex(
          (o) => o._id === payload.objectId
        );
        if (objectIndex !== -1) {
          if (
            payload.property &&
            payload.property.title &&
            payload.property.value
          ) {
            const objectProperties = state.objects[objectIndex]._source.property
              ? state.objects[objectIndex]._source.property[0].general
              : undefined;
            if (objectProperties) {
              const objectPropertyIndex = objectProperties.findIndex(
                (p) => p.title === payload.property?.title
              );
              if (objectPropertyIndex !== -1) {
                const propertyValue =
                  objectProperties[objectPropertyIndex].content;
                const propertyValueIndex = propertyValue.findIndex(
                  (v) => v.entitled === payload.property?.value
                );
                if (propertyValueIndex !== -1) {
                  state.objects[objectIndex]._source.property[0].general[
                    objectPropertyIndex
                    ].content[propertyValueIndex].tags = [...payload.tags];
                  if (
                    state.selectedProperty &&
                    state.selectedProperty.title === payload.property.title &&
                    state.selectedProperty.data.entitled ===
                    propertyValue[propertyValueIndex].entitled
                  ) {
                    state.selectedProperty.data.tags = [...payload.tags];
                  }
                }
              }
            }
          } else if (!payload.property) {
            state.objects[objectIndex]._source.tags = [...payload.tags];
          }
        }
      }
    },
    /**
     * Set context tags
     */
    setContextTags: (
      state,
      action: PayloadAction<string[]>) => {
      const { payload } = action;
      if (payload) {
        state.contextTags = payload;
      }
    },
    /**
     * Add a rule
     */
    addRule: (
      state,
      action: PayloadAction<{
        reference: string;
        rule: {
          isDataShown: boolean;
          controlTags: {
            label: string;
            type: number;
          }[];
          dataTags: {
            label: string;
            type: number;
          }[];
        };
      }>
    ) => {
      const id: string = uuidv4();
      const { payload } = action;
      if (payload) {
        if (payload.rule.controlTags[0].type === 6) {
          state.rules.unshift({ id, ...payload });
        } else {
          state.rules.push({ id, ...payload });
        }
      }
    },
    /**
     * Modify a rule
     */
    editRule: (
      state,
      action: PayloadAction<{
        id: string;
        rule: {
          id: string;
          reference: string;
          rule: {
            isDataShown: boolean;
            controlTags: {
              label: string;
              type: number;
            }[];
            dataTags: {
              label: string;
              type: number;
            }[];
          };
        };
      }>
    ) => {
      const { payload } = action;
      if (payload) {
        const index = state.rules.findIndex((r) => r.id === payload.id);
        if (index !== -1) {
          state.rules[index] = payload.rule;
        }
      }
    },
    /**
     * Remove a rule
     */
    removeRule: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (id) {
        const index = state.rules.findIndex((r) => r.id === id);
        if (index !== -1) {
          state.rules.splice(index, 1);
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
  selectProperty,
  removeTag,
  removeTags,
  addTag,
  addTags,
  editTags,
  setContextTags,
  addRule,
  editRule,
  removeRule,
  // reset slice
  resetSlice: resetSliceTags,
} = tagsSlice.actions;

export const selectTags = (state) => state.tags;

export default tagsSlice.reducer;
