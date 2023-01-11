import { createContext, useContext } from 'react';
import ModalTypes from '@/constants/modal';

type GlobalModalContext = {
  showModal: (modalType: ModalTypes, modalProps?: any) => void;
  hideModal: () => void;
  modalProps: any;
};

const initalState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
  modalProps: {},
};

export const ModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(ModalContext);
