import React, { useEffect, useState } from "react";
import cx from "classnames";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  removeFromSelection,
  selectGraph,
  setGraphFocus,
} from "../../../store/graph";
import { EntityDto } from "../../../API/DataModels/Database/NovaObject";
import {
  getEntityStrIcon,
  getEntityTitleProperty,
} from "../../../constants/entity-related";
import { selectOntologyConfig } from "../../../store/ontology";
import {
  removeFromSelectedEntities,
  selectMap,
  setMapFocus,
} from "../../../store/map";

import RemoveButton from "../../../components/Buttons/RemoveButton/RemoveButton";

import SvgIconSelect from "../../../assets/images/icons/IconSelect";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

const SelectionWidget = ({ isOpened, currentTabSelectionWidget }) => {
  const graphState = useAppSelector(selectGraph);
  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();
  const { ont } = useAppSelector(selectOntologyConfig);

  const handleDelete = (id: string) => {
    if (currentTabSelectionWidget === "graph") {
      dispatch(removeFromSelection(id));
      if (graphState.focusedEntityId === id) dispatch(setGraphFocus(null));
    }
    if (currentTabSelectionWidget === "map") {
      dispatch(removeFromSelectedEntities(id));
      if (mapState.focusedEntityId === id) dispatch(setMapFocus(null));
    }
  };

  const handleFocusEntity = (selectedEntity: EntityDto) => {
    if (!selectedEntity) return; // fails silently

    if (currentTabSelectionWidget === "graph") {
      dispatch(setGraphFocus(selectedEntity.id));
    }
    if (currentTabSelectionWidget === "map") {
      dispatch(setMapFocus(selectedEntity.id));
    }
  };

  const fontStyle = {
    width: isOpened ? "364px" : "0",
  };

  const [selectedEntities, setSelectedEntities] = useState([]);

  useEffect(() => {
    if (currentTabSelectionWidget === "graph") {
      const selectedEntitiesIdsAsMap = graphState.selection.reduce(
        (acc, id) => {
          acc[id] = true;
          return acc;
        },
        {}
      );
      setSelectedEntities(
        graphState.entities.reduce((acc, entity) => {
          if (selectedEntitiesIdsAsMap[entity.id]) acc.push(entity);
          return acc;
        }, [])
      );
    }
    if (currentTabSelectionWidget === "map") {
      const selectedEntitiesIdsAsMap = mapState.selection.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});
      setSelectedEntities(
        mapState.entities.reduce((acc, entity) => {
          if (selectedEntitiesIdsAsMap[entity.id]) acc.push(entity);
          return acc;
        }, [])
      );
    }
  }, [mapState.selection, graphState.selection]);

  return (
    <div className={styles.wrapper} style={fontStyle}>
      <div className={styles.title}>
        <SvgIconSelect />
        <b>Sélection actuelle</b>
      </div>
      <div className={styles.selectionType}>
        Entités
        <span>
          ({graphState.selection.length || mapState.selection.length})
        </span>
      </div>
      <ul className={cx(styles.selectionList, commons.PrettyScroll)}>
        {selectedEntities.map((entity, index) => {
          const Icon = getEntityStrIcon(entity, ont);
          return (
            <div
              key={index}
              className={cx(commons.clickable, styles.wrapperSelectedEntities, {
                [styles.wrapperSelectedEntitiesContentSelect]:
                  // @ts-ignore
                  mapState.focusedEntityId === entity.id ||
                  // @ts-ignore
                  graphState.focusedEntityId === entity.id,
              })}
              onClick={(e) => {
                e.stopPropagation();
                handleFocusEntity(entity);
              }}
            >
              <div className={styles.wrapperSelectedEntitiesContent}>
                {Icon && <Icon />}
                &nbsp;
                <label>{getEntityTitleProperty(entity, ont)}</label>
              </div>
              <RemoveButton
                handleDelete={() =>
                  handleDelete(
                    // @ts-ignore
                    entity.id
                  )
                }
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectionWidget;
