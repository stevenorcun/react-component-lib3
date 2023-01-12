// @ts-nocheck
import React, { useEffect, useState } from "react";
import cx from "classnames";
import { toast } from "react-toastify";

import {
  EntityDto,
  NovaObject,
} from "../../../../API/DataModels/Database/NovaObject";
import { getEntityTypeLabel } from "../../../../constants/entity-related";
import {
  autoMergeEntityDTOs,
  MINIMUM_EQUAL_PROPERTIES_REQUIRED_FOR_FUSION,
} from "../../../../utils/general";
import ApiFactory from "../../../../API/controllers/api-factory";
import ObjectsApi from "../../../../API/controllers/object-api";
import {
  createConnectionFromTo,
  createEntities,
  deleteEntity,
  GraphState,
  selectGraph,
  setGraphSelection,
  updateRect,
} from "../../../../store/graph";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { convertToEntityDto } from "../../../../API/DataModels/DTO/entityDto";

import ModalFusionConfirmation from "../../../../components/Modal/components/Graph/ObjectFusion/ModalFusionConfirmation";
import PickPropertiesModal from "../../../../components/Modal/components/Graph/ObjectFusion/PickPropertiesModal";
import Modal from "../../../../components/Modal/Modal";
import Tile from "../../../../components/Tiles/Tile";
import Button from "../../../../components/Buttons/Button/Button";

import IconObjectFusion from "../../../../assets/images/icons/IconObjectFusion";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import SearchEntities from "../../SearchEntities/SearchEntities";
import styles from "./styles.scss";
import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";
import { selectOntologyConfig } from "../../../../store/ontology";

export enum NovaDataTrustLevel {
  Viable = 1,
  Weak,
  Unknown,
}

export const NOVA_TRUST_LEVEL_DETAILS = {
  [NovaDataTrustLevel.Viable]: {
    label: "Fiable",
  },
  [NovaDataTrustLevel.Weak]: {
    label: "Faible",
  },
  [NovaDataTrustLevel.Unknown]: {
    label: "Non renseigné",
  },
};

const FuseObjectTab = ({
  entity,
  entities,
  selectedIds,
  onClose,
  onSubmit,
}: {
  entity: EntityDto;
  entities: EntityDto[];
  selectedIds: string[];
  onClose: () => void;
  onSubmit: ({
    e1,
    e2,
    result,
  }: {
    e1: EntityDto;
    e2: EntityDto;
    result: Partial<NovaObject["_source"]>;
  }) => void;
}) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const [search, setSearch] = useState("");
  const [dropdownEntities, setDropdownEntities] = useState(
    entities.filter(({ type }) => type === entity.type)
  );
  // automatiquement sélectionner
  const [selectedEntity, setSelectedEntity] = useState<EntityDto | null>(null);

  const filterByLabelAndType = (searchValue) => {
    const regex = new RegExp(searchValue, "gi");
    return entities.filter(
      ({ id, label, type }) =>
        id !== entity.id &&
        type === entity.type &&
        (searchValue ? label.match(regex) : true)
    );
  };

  const handleInputValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setDropdownEntities(filterByLabelAndType(e.currentTarget.value));
  };

  const handleSummaryClicked = (e: EntityDto) => {
    setSelectedEntity(selectedEntity?.id !== e.id ? e : null);
  };

  const [displayImpossibleFusion, setDisplayImpossibleFusion] = useState(false);
  const [displayConfirmFusion, setDisplayConfirmFusion] = useState(false);
  const [
    displayPickPropertiesBeforeFusion,
    setDisplayPickPropertiesBeforeFusion,
  ] = useState(false);

  const [tmpFusionResult, setTmpFusionResult] = useState<null | {
    failures: { [p: string]: boolean };
    result: Partial<NovaObject["_source"]>;
  }>(null);

  const closeModal = () => {
    setDisplayImpossibleFusion(false);
    setDisplayConfirmFusion(false);
    setDisplayPickPropertiesBeforeFusion(false);
    setTmpFusionResult(null);
  };

  const attemptFusion = () => {
    if (selectedEntity) {
      try {
        const { result, failures } = autoMergeEntityDTOs(
          entity,
          selectedEntity
        );
        (result as EntityDto).__fusedEntities = [
          {
            id: entity.id,
            label: entity.label,
            _DATATYPE: entity._DATATYPE,
          },
          {
            id: selectedEntity.id,
            label: selectedEntity.label,
            _DATATYPE: entity._DATATYPE,
          },
        ];

        setTmpFusionResult({ result, failures });

        // OK if:
        //  -> success count > MINIMUM_EQUAL_PROPERTIES_REQUIRED_FOR_FUSION
        //  -> failures count < 0
        const successesCount = Object.keys(result).length - 1; // - 1 because `type`
        const failuresCount = Object.keys(failures).length;
        if (
          successesCount < MINIMUM_EQUAL_PROPERTIES_REQUIRED_FOR_FUSION &&
          failuresCount
        ) {
          setDisplayImpossibleFusion(true);
        } else if (failuresCount) {
          // TODO display "pick the properties you want" Modal
          setDisplayPickPropertiesBeforeFusion(true);
        } else {
          // TODO display "are you sure" Modal
          setDisplayConfirmFusion(true);
        }
      } catch (e) {
        console.error("err", e);
      }
    }
  };

  const handleFusionConfirm = () => {
    if (!tmpFusionResult || !selectedEntity) return;

    onSubmit({
      e1: entity,
      e2: selectedEntity,
      result: tmpFusionResult.result,
    });
  };

  const handlePickPropsConfirm = (picks: Partial<EntityDto>) => {
    if (!tmpFusionResult || !selectedEntity) return;

    onSubmit({
      e1: entity,
      e2: selectedEntity,
      result: {
        ...tmpFusionResult.result,
        ...picks,
      },
    });
  };

  useEffect(() => {
    // Risks matching the ID of an entity with a different type
    const obj2Id =
      selectedIds.length === 2
        ? selectedIds.find((id) => id !== entity.id)
        : null;
    const tmpSelectedEntity = obj2Id
      ? entities.find(({ id, type, label }) => {
          if (obj2Id === id && entity.type === type) {
            setSearch(label);
            return true;
          }
          return false;
        }) || null
      : null;
    setSearch(tmpSelectedEntity?.label || "");
    setSelectedEntity(tmpSelectedEntity);
    setDropdownEntities(filterByLabelAndType(tmpSelectedEntity?.label || ""));
  }, [entity]);

  return (
    <>
      <div
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          commons.PrettyScroll,
          styles.SelectedEntity
        )}
      >
        <div
          className={cx(
            commons.Flex,
            commons.FlexAlignItemsCenter,
            styles.Section,
            styles.SelectedEntityLabel
          )}
        >
          <div className={cx(styles.SelectedEntityLabel__Prefix)}>
            Valeur sélectionnée :
          </div>
          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              commons.FlexJustifyContentCenter,
              styles.SelectedEntityLabel__Label
            )}
          >
            {entity.label}
          </div>
        </div>

        <div className={cx(commons.Flex, styles.Section, styles.TargetSummary)}>
          <div className={cx(styles.TargetSummary__Left)}>
            <svg>
              <Tile
                className={cx(styles.TileSvg)}
                entity={entity}
                selected={false}
                isDraggable={false}
                selectionTogglable={false}
                isLinkCreatable={false}
                position={{ x: 0, y: 0 }}
                scale={0.5}
              />
            </svg>
          </div>

          <div
            className={cx(
              commons.Flex,
              commons.FlexDirectionColumn,
              styles.TargetSummary__Right
            )}
          >
            <div>
              <div className={styles.Label}>Type de l&apos;objet</div>
              <div className={styles.Value}>
                {getEntityTypeLabel(entity, ont)}
              </div>
            </div>

            <div>
              <div className={styles.Label}>Nom de l&apos;objet</div>
              <div className={styles.Value}>{entity?.label}</div>
            </div>

            <div>
              <div className={styles.Label}>Valeur de confiance</div>
              <div className={styles.Value}>
                {
                  NOVA_TRUST_LEVEL_DETAILS[
                    entity.trustValue || NovaDataTrustLevel.Unknown
                  ]?.label
                }
              </div>
            </div>
          </div>
        </div>
        <SearchEntities
          title="Objet de fusion"
          subtitle="Objet à fusionner"
          search={search}
          handleInputValueChange={handleInputValueChange}
          dropdownEntities={dropdownEntities}
          selectedEntity={selectedEntity}
          handleSummaryClicked={handleSummaryClicked}
        />

        <div className={cx(commons.Flex, styles.Footer)}>
          <Button
            type="secondary"
            className={cx(styles.Footer__Button, styles.Footer__Cancel)}
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="secondary"
            className={cx(styles.Footer__Button, styles.Footer__Submit)}
            disabled={!selectedEntity}
            onClick={attemptFusion}
          >
            Fusionner les objets
          </Button>
        </div>
      </div>

      {displayImpossibleFusion && selectedEntity && (
        <ModalFusionFailed onClose={closeModal} />
      )}

      {displayConfirmFusion && selectedEntity && (
        <ModalFusionConfirmation
          e1={entity}
          e2={selectedEntity}
          onConfirm={handleFusionConfirm}
          onClose={closeModal}
        />
      )}

      {displayPickPropertiesBeforeFusion &&
        selectedEntity &&
        tmpFusionResult && (
          <PickPropertiesModal
            e1={entity}
            e2={selectedEntity}
            diffProps={Object.keys(tmpFusionResult.failures)}
            onClose={closeModal}
            onConfirm={handlePickPropsConfirm}
          />
        )}
    </>
  );
};

const ModalObjectFusion = ({
  entity,
  selectedIds,
  entities,
}: // onClose,
{
  entity: EntityDto;
  selectedIds: string[];
  entities: EntityDto[];
  // onClose: () => void;
  // onSubmit: () => void;
}) => {
  const graphState = useAppSelector<GraphState>(selectGraph);
  const dispatch = useAppDispatch();
  const { hideModal } = useGlobalModalContext();
  const onSubmit = ({
    e1,
    e2,
    result,
  }: {
    e1: EntityDto;
    e2: EntityDto;
    result: Partial<NovaObject["_source"]>;
  }) => {
    // TODO
    //  - push to API
    //    if OK =>
    //    - delete e1 and e2 from Graph
    //    - add new entity to Graph
    //    - What to do with the connections ?????

    const apiClient = ApiFactory.create<ObjectsApi>("ObjectsApi");
    const inProgress = toast("Requête en cours...", {
      autoClose: false,
      closeOnClick: false,
    });
    apiClient
      .createObject(result)
      .then((response) => {
        const dto = convertToEntityDto(response);
        // TODO refactor deleteEntity to allow it to receive an array if IDS
        dispatch(deleteEntity(e1.id));
        dispatch(deleteEntity(e2.id));
        // TODO use "onSubmit" from props to avoid being hardcoded with GraphState
        // convertToDto isn't capable of accepting a DTO as a props (will reset data.related) <- NOT ANYMORE
        dispatch(createEntities([dto]));

        // TODO fuse connections from both
        // retire les liens potentiellement entre ces deux entités !!!!
        graphState.connections
          .reduce((acc: GraphState["connections"], con) => {
            if (con.from === e1.id || con.from === e2.id) {
              acc.push({
                ...con,
                from: dto.id,
              });
            } else if (con.to === e1.id || con.to === e2.id) {
              acc.push({
                ...con,
                to: dto.id,
              });
            }
            return acc;
          }, [])
          .forEach((con) => dispatch(createConnectionFromTo(con)));

        // /!\ MUST CLOSE MODAL BEFORE DELETING OR IT WILL CRASH /!\
        // onClose();

        dispatch(updateRect());
        // deletion causes everything to be unselected
        dispatch(setGraphSelection([dto.id]));
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.toString());
      })
      .finally(() => {
        toast.dismiss(inProgress);
      });
  };

  return (
    <Modal
      className={styles.Modal}
      icon={<IconObjectFusion fill="#FFFFFF" />}
      title="Fusionner deux objets"
      isOpen
      hasOverlay
      position={{ top: "5%", right: "30%", left: "unset" }}
      setIsOpen={hideModal}
      showFooter={false}
    >
      <FuseObjectTab
        entity={entity}
        selectedIds={selectedIds}
        entities={entities}
        onClose={hideModal}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default ModalObjectFusion;
