/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { ModalContext } from '@/hooks/useGlobalModal';
import ModalTypes from '@/constants/modal';
import CreateBrowserFormTemplateModal, { OverwritePrivateBrowserFormTemplateModal } from '@/components/Modal/components/Browser/CreateFormTemplate/CreateFormTemplate';
import ModalObjectFusion from '@/components/Modal/components/Graph/ObjectFusion/ModalObjectFusion';
import UndoFusionModal from '@/components/Modal/components/Graph/ObjectFusion/UndoFusionModal';
import {
  AddToListModal,
  CreateListModal,
  ModalCreateCase,
  ModalCustomizedActions,
  ModalLabelling,
  ModalLink,
  ModalLists,
  ModalRules,
  ModalTags,
  RemoveListModal,
} from './components';

const MODAL_COMPONENTS: any = {
  [ModalTypes.CUSTOMIZED_ACTIONS]: ModalCustomizedActions,
  [ModalTypes.LABELLING]: ModalLabelling,
  [ModalTypes.LINK]: ModalLink,
  [ModalTypes.RULES]: ModalRules,
  [ModalTypes.TAGS]: ModalTags,
  [ModalTypes.LISTS]: ModalLists,
  [ModalTypes.LISTS_ADD_TO_LIST]: AddToListModal,
  [ModalTypes.LISTS_CREATE_LIST]: CreateListModal,
  [ModalTypes.LISTS_REMOVE_LIST]: RemoveListModal,
  [ModalTypes.BROWSER_CREATE_FORM_TEMPLATE]: CreateBrowserFormTemplateModal,
  [ModalTypes.BROWSER_OVERWRITE_FORM_TEMPLATE]: OverwritePrivateBrowserFormTemplateModal,
  [ModalTypes.CASES_CREATE_CASE]: ModalCreateCase,
  [ModalTypes.GRAPH_OBJECT_FUSION]: ModalObjectFusion,
  [ModalTypes.GRAPH_OBJECT_FISSION]: UndoFusionModal,
};

const GlobalModal = ({ children }: { children: React.ReactElement }) => {
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<any>({});

  const showModal = (type: string, props: any = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const hideModal = () => {
    setModalType(null);
    setModalProps({});
  };

  const renderComponent = () => {
    if (!modalType) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!ModalComponent) {
      return null;
    }
    return <ModalComponent {...modalProps} />;
  };

  return (
    <ModalContext.Provider value={{ modalProps, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </ModalContext.Provider>
  );
};

export default GlobalModal;
