import React, { useEffect } from "react";
import cx from "classnames";
import { toast } from "react-toastify";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import { selectBrowser, setActiveEntity } from "../../store/browser";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProperty } from "../../store/tags";
import { selectOntologyConfig } from "../../store/ontology";
import { EntityDto } from "../../API/DataModels/Database/NovaObject";
import { convertToEntityDto2 } from "../../API/DataModels/DTO/entityDto";
import ObjectsApi from "../../API/controllers/object-api";
import ApiFactory from "../../API/controllers/api-factory";

import {
  getEntityTitleProperty,
  getIdProperty,
} from "../../constants/entity-related";
import SearchApi from "../../API/controllers/search-api";

import Sheet from "../../components/Sheet/Sheet";

import { relatedWithIds } from "../../utils/graph";
import styles from "./styles.scss";

const EntityPage = ({ entity }: { entity: EntityDto }) => {
  const dispatch = useAppDispatch();
  const { ont } = useAppSelector(selectOntologyConfig);

  useEffect(() => {
    const init = async () => {
      const apiClient = ApiFactory.create<SearchApi>("SearchApi");
      try {
        const idProp = getIdProperty(entity, ont);
        if (!idProp) {
          toast.error("Cannot find id property for object");
          return;
        }
        const objectId = entity[idProp];
        const q = `${idProp}:${objectId}`;
        const res = await apiClient.search_v2(q);
        if (res.queryId) {
          apiClient.search_v2_close(res.queryId);
        }
        if (!res.events?.length) {
          toast.error(`Object not found : ${q}`);
        }

        const relatedClient = ApiFactory.create<ObjectsApi>("ObjectsApi");
        const related = await relatedClient.getObjectRelations(objectId);
        const data = {
          id: objectId,
          label: getEntityTitleProperty(res.events[0], ont),
          ...res.events[0],
        };
        // TODO use reduce and warn if ID is missing
        // Ajouter ID et Label aux OBJETS liés et ID aux Connections
        const resultRelatedWithIds = relatedWithIds(
          related,
          related.links,
          related.relations,
          ont
        );

        if (entity.id === res.events?.[0]?.[idProp]) {
          const dto = convertToEntityDto2(data, ont, resultRelatedWithIds);
          dispatch(
            setActiveEntity({
              entity: dto,
              index: browserState.activeBrowserTabIndex,
            })
          );
          dispatch(selectProperty(null));
        } else {
          console.error("ID missmatch:", entity.id, res.events[0][idProp]);
        }
      } catch (err) {
        console.error("related err", err);
      }
    };
    init();
  }, [entity.id]);

  // Reload activeEntity when tag is modified
  /* useEffect(() => {
    const objectId = props.id;
    const res = tagsState.objects.find((o) => o._id === objectId);
    dispatch(setOnlyActiveEntity(res._source));
  }, [tagsState]); */

  const browserState = useAppSelector(selectBrowser);
  const { activeEntity } =
    browserState.tabs[browserState.activeBrowserTabIndex];

  return (
    <div className={cx(styles.EntityDetail, commons.PrettyScroll)}>
      <div className={styles.EntityDetailContent}>
        {
          //@ts-ignore
          <Sheet type={activeEntity.type} entity={activeEntity} />
        }
      </div>
    </div>
  );
};

export default EntityPage;
