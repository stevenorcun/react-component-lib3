import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import Modal from "@/components/Modal/Modal";
import styles from "@/components/Modal/components/Graph/ObjectFusion/styles.scss";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconCheck from "@/assets/images/icons/IconCheck";
import IconCrossCircle from "@/assets/images/icons/IconCrossBlue";
import Button from "@/components/Buttons/Button/Button";
import React, { Fragment } from "react";

const UndoFusionModal = ({
  entity,
  onConfirm,
  onClose,
}: {
  entity: EntityDto;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  if (!entity.__fusedEntities) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      className={styles.Modal}
      isOpen
      hasOverlay
      position={{ top: "5%", right: "30%", left: "unset" }}
      setIsOpen={onClose}
      showFooter={false}
      showTitle={false}
    >
      <div className={styles.AnotherOverlayYay} onClick={onClose} />
      <div
        className={cx(
          styles.SecondaryModal,
          styles.SecondaryModal__UndoFusion,
          styles.PickOneModal
        )}
      >
        <div className={cx(commons.Flex, styles.Modal__Header)}>
          <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
            <IconCheck />
            <div>Défusionner l&apos;objet</div>
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
              Êtes-vous sûr de vouloir défusionner&nbsp;
              <span className={styles.Blue}>{entity.label}</span>
              &nbsp;et restaurer&nbsp;
              {entity.__fusedEntities.map(({ id, label }, index, arr) => (
                <Fragment key={id}>
                  <span className={styles.Blue}>{label}</span>
                  {index + 1 !== arr.length ? " et " : ""}
                </Fragment>
              ))}
              &nbsp;?
            </div>

            <div
              className={cx(
                commons.Flex,
                commons.FlexDirectionColumn,
                styles.PropsToPick
              )}
            >
              <div className={styles.Assistance}>
                La défusion va restaurer les objets précédemment fusionnés. Les
                propriétés et les liens de chaque objet seront réatribués
                respectivement.
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
                Défusionner l&apos;objet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UndoFusionModal;
