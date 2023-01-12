import React from "react";

import Modal from "../../../../components/Modal/Modal";
import Button from "../../../../components/Buttons/Button/Button";
import styles from "./styles.scss";
import IconPersonOutline from "../../../../assets/images/icons/IconPersonOutline";
import useResetStore from "../../../../hooks/useResetStore";

interface ModalProfileProps {
  className?: string;
  openModalProfile: () => void;
}

const ModalProfile = ({ className, openModalProfile }: ModalProfileProps) => {
  const { resetStore: logout } = useResetStore();

  return (
    <Modal
      isOpen
      icon={<IconPersonOutline fill="#fff" width={18} height={18} />}
      title="Profil"
      hasOverlay={false}
      className={styles.modalteste}
      footerClassName={styles.footerModal}
      footer={
        <Button
          onClick={logout}
          type="tertiary"
          className={styles.boutonAllLists}
        >
          Déconnexion
        </Button>
      }
    >
      <div className={styles.modalContent}></div>
    </Modal>
  );
};

export default ModalProfile;
