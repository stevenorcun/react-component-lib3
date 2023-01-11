import ModalTypes from '@/constants/modal';


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ResponseFormat = 'TEXT' | 'XML' | 'JSON';

export enum CustomizedActionsType {
  API = 1,
}

export enum CustomizedActionsCallback {
  Annotation = 1,
}

export const CUSTOMIZED_ACTION_TYPE = {
  [CustomizedActionsType.API]: 'API',
};

export const CUSTOMIZED_ACTION_CALLBACK = {
  [CustomizedActionsCallback.Annotation]: {
    label: "Ouvrir l'étiquetage",
    useCallback: (result, data, showModal) => {
      showModal(ModalTypes.LABELLING, {
        value: result,
        entity: data.entity,
      });
    },
  },
};
