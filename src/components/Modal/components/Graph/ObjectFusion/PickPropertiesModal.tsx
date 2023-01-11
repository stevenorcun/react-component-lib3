/* eslint-disable max-len */
import React, { useState } from "react";
import cx from "classnames";

import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import { ENTITY_PROPERTY_DETAILS } from "@/constants/entity-related";

import selectionStyles from "@/components/Drawer/Tabs/Selection/styles.scss";
import AdvancedSearchResultPropertyLine from "@/components/Browser/SearchResult/PropertyLine/PropertyLine";
import Button from "@/components/Buttons/Button/Button";

import IconCheck from "@/assets/images/icons/IconCheck";
import IconCrossCircle from "@/assets/images/icons/IconCrossBlue";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "@/components/Modal/components/Graph/ObjectFusion/styles.scss";

const PickPropertiesModal = ({
  e1,
  e2,
  diffProps,
  onClose,
  onConfirm,
}: {
  e1: EntityDto;
  e2: EntityDto;
  diffProps: string[];
  onClose: () => void;
  onConfirm: (picks: Partial<EntityDto>) => void;
}) => {
  // 0 === e1[key], 1 === e2[key]
  const [finalProps, setFinalProps] = useState(
    diffProps.reduce((acc: { [key: string]: 0 | 1 }, key) => {
      acc[key] = 0;
      return acc;
    }, {})
  );

  const pickPropsByKey = ({ key, pick }: { key: string; pick: 0 | 1 }) => {
    setFinalProps({
      ...finalProps,
      [key]: pick,
    });
  };

  const handleConfirm = () => {
    const result = diffProps.reduce((acc, key) => {
      acc[key] = finalProps[key] ? e2[key] : e1[key];
      return acc;
    }, {});
    onConfirm(result);
    onClose();
  };

  return (
    <div>
      <div className={styles.AnotherOverlayYay} onClick={onClose} />
      <div className={cx(styles.SecondaryModal, styles.PickOneModal)}>
        <div className={cx(commons.Flex, styles.Modal__Header)}>
          <div className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
            <IconCheck />
            <div>Préciser la fusion</div>
          </div>
          <div
            className={cx(commons.Flex, commons.FlexAlignItemsCenter)}
            onClick={onClose}
          >
            <IconCrossCircle />
          </div>
        </div>

        <div
          className={cx(
            commons.PrettyScroll,
            styles.Modal__Body,
            styles.Modal__Body__propertyFusion
          )}
        >
          <div
            className={cx(commons.Flex, commons.FlexDirectionColumn)}
            style={{ height: "100%" }}
          >
            <div
              className={cx(
                styles.alignItemCenter,
                styles.Section,
                styles.SelectedEntityLabel
              )}
            >
              <p className={styles.SelectedEntityLabel__Prefix}>
                Valeurs sélectionnées:{" "}
              </p>
              <button
                type="button"
                className={styles.SelectedEntityLabel__Label}
              >
                {e1.label}
              </button>
              <button
                className={styles.SelectedEntityLabel__Label}
                type="button"
              >
                {e2.label}
              </button>
            </div>
            <div className={styles.Label}>
              Les propriétés suivantes ne peuvent pas accueillir plusieurs
              valeurs. Veuillez choisir celles que vous souhaitez conserver.
            </div>

            <div
              className={cx(
                commons.Flex,
                commons.FlexDirectionColumn,
                styles.PropsToPick
              )}
            >
              {diffProps.map((key) => (
                <div
                  key={key}
                  className={cx(commons.Flex, commons.Divider, styles.Row)}
                >
                  {/* e1 */}
                  <div
                    className={cx(
                      commons.Flex,
                      commons.FlexAlignItemsCenter,
                      styles.Half
                    )}
                    onClick={() => {
                      pickPropsByKey({ key, pick: 0 });
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={finalProps[key] === 0}
                      readOnly
                    />
                    <AdvancedSearchResultPropertyLine
                      key={key}
                      propertyKey={key}
                      label={ENTITY_PROPERTY_DETAILS[key]?.label || key}
                      value={e1[key]}
                      className={cx(
                        commons.FlexAlignItemsCenter,
                        selectionStyles.Property
                      )}
                      labelClassName={selectionStyles.PropertyLabel}
                      valueClassName={selectionStyles.PropertyValue}
                    />
                  </div>
                  {/* RIGHT (e2) */}
                  <div
                    className={cx(
                      commons.Flex,
                      commons.FlexAlignItemsCenter,
                      styles.Half
                    )}
                    onClick={() => {
                      pickPropsByKey({ key, pick: 1 });
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={finalProps[key] === 1}
                      readOnly
                    />
                    <AdvancedSearchResultPropertyLine
                      key={key}
                      propertyKey={key}
                      label={ENTITY_PROPERTY_DETAILS[key]?.label || key}
                      value={e2[key]}
                      className={cx(
                        commons.FlexAlignItemsCenter,
                        selectionStyles.Property
                      )}
                      labelClassName={selectionStyles.PropertyLabel}
                      valueClassName={selectionStyles.PropertyValue}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.Assistance}>
              Cette opération est réversible via l&apos;action défusion dans le
              graphe.
            </div>
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
            Valider et fusionner les objets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickPropertiesModal;
