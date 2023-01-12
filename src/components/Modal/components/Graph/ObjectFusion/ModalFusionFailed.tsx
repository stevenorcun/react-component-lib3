import React from "react";
import cx from "classnames";
import IconCheck from "../../../../../assets/images/icons/IconCheck";
import IconCrossCircle from "../../../../../assets/images/icons/IconCrossBlue";
import Button from "../../../../../components/Buttons/Button/Button";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "../../../../../components/Modal/components/Graph/ObjectFusion/styles.scss";

const ModalFusionFailed = ({ onClose }: { onClose: () => void }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <div className={styles.AnotherOverlayYay} onClick={handleClose} />
      <div className={styles.SecondaryModal}>
        <div className={cx(commons.Flex, styles.Modal__Header)}>
          <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
            <IconCheck />
            <div>Fusionner deux objets entre eux</div>
          </div>
          <div
            className={cx(commons.Flex, commons.FlexAlignItemsCenter)}
            onClick={handleClose}
          >
            <IconCrossCircle />
          </div>
        </div>

        <div className={styles.Modal__Body}>
          <div className={cx(commons.Flex, commons.FlexDirectionColumn)}>
            <div className={styles.Label}>
              Vous ne pouvez pas fusionner ces deux objets.
            </div>
            <div className={styles.Assistance}>
              Vous ne pouvez fusionner uniquement qu’un type d’objet identique
              et si les deux objets ont un seuil de similitude entre les
              propriétés suffisamment élevé.
            </div>
          </div>

          <div className={cx(commons.Flex, styles.Modal__Footer)}>
            <Button
              onClick={handleClose}
              type="secondary"
              className={cx(styles.Footer__Button, styles.Footer__Submit)}
            >
              J&apos;ai compris
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFusionFailed;
