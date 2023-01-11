import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import cx from 'classnames';

import { useGlobalModalContext } from '@/hooks/useGlobalModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectLists, setOriginalLists } from '@/store/lists';

import Modal from '@/components/Modal/Modal';
import Button from '@/components/Buttons/Button/Button';

import IconDelete from '@/assets/images/icons/IconRemove';

import stylesGobal from '../_listModal.scss';
import styles from './removeListModal.scss';

const RemoveListModal = ({ id, label } : {
  id: string,
  label: string,
}) => {
  const { hideModal } = useGlobalModalContext();
  const dispatch = useAppDispatch();
  const listState = useAppSelector(selectLists);

  useEffect(() => {
    document.addEventListener('click', hideModal);
    return () => {
      document.removeEventListener('click', hideModal);
    };
  }, []);

  const handleRemove = () => {
    const result = listState.originalLists.filter((el) => el.id !== id);
    dispatch(setOriginalLists(result));
    hideModal();
    toast.success('La liste à bien été supprimée');
  };

  return (
    <Modal
      isOpen
      icon={<IconDelete fill="#fff" width={18} height={18} />}
      title="Supprimer"
      hasOverlay={false}
      onClose={hideModal}
      className={cx(stylesGobal.globalModal, styles.removeModal)}
      footerClassName={cx(stylesGobal.globalModal__footer, styles.footer)}
      footer={(
        <div className={styles.buttonFooter}>
          <Button
            onClick={hideModal}
            type="secondary"
            className={cx(stylesGobal.boutonAllLists, styles.button)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleRemove}
            type="tertiary"
            className={cx(stylesGobal.boutonAllLists, styles.button)}
          >
            Supprimer
          </Button>
        </div>
    )}
    >
      <div className={cx(stylesGobal.intro, styles.content)}>
        <p className={styles.text}>
          Êtes-vous sûr de vouloir supprimer la liste:
          <span className={styles.nameList}>{label}</span>
          ?
        </p>
      </div>
    </Modal>
  );
};

export default RemoveListModal;
