import React from "react";
import cx from "classnames";
import { EntityDto } from "../../../../../API/DataModels/Database/NovaObject";
import IconCheck from "../../../../../assets/images/icons/IconCheck";
import IconCrossCircle from "../../../../../assets/images/icons/IconCrossBlue";
import Button from "../../../../../components/Buttons/Button/Button";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "../../../../../components/Modal/components/Graph/ObjectFusion/styles.scss";

const ModalFusionConfirmation = ({
  e1,
  e2,
  onClose,
  onConfirm,
}: {
  e1: EntityDto;
  e2: EntityDto;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div>
      <div className={styles.AnotherOverlayYay} onClick={onClose} />
      <div className={styles.SecondaryModal}>
        <div className={cx(commons.Flex, styles.Modal__Header)}>
          <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
            <IconCheck />
            <div>Fusionner deux objets entre eux</div>
          </div>
          <div
            className={cx(commons.Flex, commons.FlexAlignItemsCenter)}
            onClick={onClose}
          >
            <IconCrossCircle />
          </div>
        </div>

        <div className={styles.Modal__Body}>
          <div className={cx(commons.Flex, commons.FlexDirectionColumn)}>
            <div className={styles.Label}>
              Êtes-vous sûr de vouloir fusionner{" "}
              <span className={styles.Blue}>{e1.label}</span> avec{" "}
              <span className={styles.Blue}>{e2.label}</span> ?
            </div>
            <div className={styles.Assistance}>
              La fusion entre deux objets, permet la création d’un objet
              comportant les propriétés des deux objets réunis. Cette fusion est
              possible, uniquement si les deux objets ont un seuil de similitude
              entre les propriétés suffisamment élevé.
            </div>
          </div>

          <div className={cx(commons.Flex, styles.Footer)}>
            <Button
              type="secondary"
              className={cx(styles.Footer__Button, styles.Footer__Cancel)}
              onClick={onClose}
            >
              Annuler la fusion
            </Button>
            <Button
              type="secondary"
              className={cx(styles.Footer__Button, styles.Footer__Submit)}
              onClick={handleConfirm}
            >
              Fusionner les objets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFusionConfirmation;
