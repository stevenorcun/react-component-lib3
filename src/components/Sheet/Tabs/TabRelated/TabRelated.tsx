import React, { useEffect, useState } from "react";
import cx from "classnames";

import {
  sortAlphabeticallyAsc,
  sortAlphabeticallyDesc,
  sortAsc,
  sortDesc,
} from "../../../../utils/general";
import {
  getEntityTypeId,
  getIdProperty,
  getLinkIdPropKey,
  getEntityTitleProperty,
} from "../../../../constants/entity-related";
import {
  EntitySummary,
  RelatedSummary,
} from "../../../../API/DataModels/Database/NovaObject";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import { selectOntologyConfig } from "../../../../store/ontology";
import { useAppSelector } from "../../../../store/hooks";

import HeaderFiltre from "../../../../pages/Entity/ComponentsEntityDetail/ComponentHeaderFiltre/ComponentHeaderFiltre";
import Subtitle from "../../../../pages/Entity/ComponentsEntityDetail/ComponentSubtitle/ComponentSubtitle";
import DraggableEntityOrSummary from "../../../../components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import HeaderArray from "./ComponentHeaderArray/HeaderArray";
import ContentArray from "./ComponentContentArray";

import styles from "./related.scss";

const TabRelated = ({ entity }: { entity: any }) => {
  const ontologyStore = useAppSelector(selectOntologyConfig);

  const [relatedOrigin, setRelatedOrigin] = useState(entity?.related?.entities);
  const [valueFilter, setValueFilter] = useState("");
  const [relatedFilter, setRelatedFilter] = useState<{
    [type in NovaEntityType]?: {
      isChecked: true;
      isOpen: true;
      relations: EntitySummary[];
    };
  }>({});
  const [isSort, setIsSort] = useState({});
  const listHeaderArray = [
    "type",
    "label",
    // 'quotation',
    "confidenceValue",
    "startDate",
    "endDate",
    // 'linkText',
  ];

  // Refaire un tableau avec les liens et les objets ppour les afficher correctement

  const [selectedSummariesById, setSelectedSummariesById] = useState<{
    [id: string]: RelatedSummary;
  }>({});

  // semi-duplicate: for dragging "all selected elements" without doing a find
  const [selectedSummaries, setSelectedSummaries] = useState<RelatedSummary[]>(
    []
  );
  useEffect(() => {
    setSelectedSummaries(Object.values(selectedSummariesById));
  }, [selectedSummariesById]);

  const sortGlobal = (
    field: string,
    isTrue: boolean,
    type: NovaEntityType,
    key: string
  ) => {
    const sortCallbackAsc =
      typeof relatedFilter[type]?.relations[0][field] === "number"
        ? sortAsc(field)
        : sortAlphabeticallyAsc(field);

    const sortCallbackDesc =
      typeof relatedFilter[type]?.relations[0][field] === "number"
        ? sortDesc(field)
        : sortAlphabeticallyDesc(field);

    const newDataRelated = relatedFilter[type]?.relations
      .slice()
      .sort(isTrue ? sortCallbackAsc : sortCallbackDesc);

    return setRelatedFilter({
      ...relatedFilter,
      [type]: {
        ...relatedFilter[type],
        relations: newDataRelated,
      },
    });
  };

  const sortFn = (field: string, type: string, keys: string) => {
    const newIsSort = {
      ...isSort,
      [type]: Object.fromEntries(
        Object.entries(isSort[type]).map(([key, value]) => [
          key,
          keys === key ? !isSort[type][keys] : false,
        ])
      ),
    };

    if (newIsSort[type].hasOwnProperty(keys)) {
      setIsSort(newIsSort);
      // @ts-ignore
      return sortGlobal(field, newIsSort[type][keys], type, keys);
    }
  };

  const filterText = (
    arr: {
      isChecked: boolean;
      isOpen: boolean;
      relation: Array<{}>;
    },
    request: string
  ) => {
    let newObj = relatedFilter;
    if (!request) {
      setValueFilter(request);
      return setRelatedFilter(relatedOrigin);
    }
    Object.entries(relatedOrigin).forEach((elements: any) => {
      const type = elements[0];
      const filteredElements = elements[1].relations.filter(
        (el: { MOTS_CLES: string }) =>
          el.MOTS_CLES.toLowerCase().indexOf(request.toLowerCase()) !== -1
      );
      newObj = {
        ...newObj,
        [type]: {
          ...newObj[type],
          relations: filteredElements,
        },
      };
    });

    setValueFilter(request);
    setRelatedFilter(newObj);
  };

  // behavior when a checkbox of a category is checked
  const checkedByCategory = (type: string) => {
    const isChecked = !relatedFilter[type].isChecked;

    const allChecked = relatedFilter[type].relations.map((element) => ({
      ...element,
      isChecked,
    }));
    const clone = { ...selectedSummariesById };
    relatedFilter[type].relations.forEach((summary) => {
      if (isChecked) {
        clone[summary.id] = summary;
      } else {
        delete clone[summary.id];
      }
    });
    setSelectedSummariesById(clone);
    setRelatedFilter({
      ...relatedFilter,
      [type]: { ...relatedFilter[type], isChecked, relations: allChecked },
    });
  };

  const onChecked = (type: string, index: number) => {
    const checkedChange = relatedFilter[type].relations.map(
      (element, indexMap: number) => {
        if (Number(index) === Number(indexMap)) {
          const clone = { ...selectedSummariesById };
          if (element.isChecked) {
            delete clone[element.id];
          } else {
            clone[element.id] = element;
          }
          setSelectedSummariesById(clone);
          return { ...element, isChecked: !element.isChecked };
        }
        return element;
      }
    );
    setRelatedFilter({
      ...relatedFilter,
      [type]: { ...relatedFilter[type], relations: checkedChange },
    });
  };

  useEffect(() => {
    if (Array.isArray(entity?.related?.entities)) {
      const result = entity.related.entities.reduce((acc, curr) => {
        const objType = getEntityTypeId(curr, ontologyStore.ont);
        const copy = { ...curr };

        copy.__links = entity.related.links.filter((link) => {
          const idDestProp = getLinkIdPropKey(
            link,
            ontologyStore.ont,
            "LINK_ID_DEST"
          );
          const linkDestId = link[idDestProp];
          const idSrcProp = getLinkIdPropKey(
            link,
            ontologyStore.ont,
            "LINK_ID_SRC"
          );
          const linkSrctId = link[idSrcProp];

          const entityIdProp = getIdProperty(curr, ontologyStore.ont);
          const entityId = curr[entityIdProp];

          return entityId === linkDestId || entityId === linkSrctId;
        });
        if (objType) {
          acc[objType] = acc[objType] ?? {
            isChecked: false,
            isOpen: true,
            relations: [],
          };
          copy.__links.forEach(
            (element: {
              id: string;
              LABEL: string;
              DATE_DEBUT: string;
              DATE_FIN: string;
              VALEUR_DE_CONFIANCE: string;
            }) =>
              acc[objType].relations.push({
                ...copy,
                id: element.id,
                typeLink: element.LABEL,
                object: getEntityTitleProperty(curr, ontologyStore),
                startDate: element.DATE_DEBUT,
                endDate: element.DATE_FIN,
                isChecked: false,
              })
          );
        }
        return acc;
      }, {});
      setRelatedFilter(result);
      setRelatedOrigin(result);

      const createIsSort = Object.keys(result).reduce((acc, curr) => {
        acc[curr] = acc[curr] ?? {};
        listHeaderArray.map((el) => {
          acc[curr][el] = false;
        });
        return acc;
      }, {});
      setIsSort(createIsSort);
    }
  }, [entity?.related?.entities]);

  const openCategory = (type: number, isOpen: boolean) => {
    setRelatedFilter({
      ...relatedFilter,
      [type]: { ...relatedFilter[type], isOpen: !isOpen },
    });
  };

  const activeFilterText = (valueFilter: string) => {
    // @ts-ignore
    filterText(relatedFilter, valueFilter);
  };

  return (
    <div className={styles.related}>
      <HeaderFiltre
        nameButton="Ajouter un lien"
        tab="related"
        placeholderFiltre="Filtrer par nom ou pas type d'objet"
        valueFilter={valueFilter}
        // @ts-ignore
        setValueFilter={setValueFilter}
        activeFilterText={activeFilterText}
      />
      <div>
        {entity.related ? (
          Object.entries(relatedFilter).map(
            (element) =>
              element[1].relations.length > 0 && (
                <div key={element[0]}>
                  <DraggableEntityOrSummary
                    data={element[1].relations || []}
                    initialObjects={entity.related.entities}
                  >
                    <Subtitle
                      title={element[0]}
                      numberLink={`(${element[1].relations.length} liens)`}
                      isOpen={relatedFilter[element[0]].isOpen}
                      setIsOpen={openCategory}
                      type={element[0]}
                      iconName={element[0]}
                    />
                  </DraggableEntityOrSummary>
                  <div
                    className={cx(styles.generalPropertyMain, {
                      [styles.generalPropertyMain__open]:
                        !relatedFilter[element[0]].isOpen,
                    })}
                  >
                    <HeaderArray
                      sortFn={sortFn}
                      isSort={isSort}
                      type={element[0]}
                      checkedByCategory={checkedByCategory}
                    />

                    <div className={styles.card}>
                      {element[1].relations.map((content, index) => (
                        <DraggableEntityOrSummary
                          data={
                            selectedSummariesById[content.id]
                              ? selectedSummaries
                              : [content]
                          }
                          initialObjects={entity.related.entities}
                          key={content.id}
                        >
                          <ContentArray
                            related={content}
                            isChecked={selectedSummariesById[content.id]}
                            oneChecked={onChecked}
                            type={element[0]}
                            index={index}
                          />
                        </DraggableEntityOrSummary>
                      ))}
                    </div>
                  </div>
                </div>
              )
          )
        ) : (
          <div className={cx(commons.Flex, commons.FlexJustifyContentCenter)}>
            Aucune données à afficher
          </div>
        )}
      </div>
    </div>
  );
};

export default TabRelated;
