import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearAuxiliaryHistogramHighlightedProperties as graphClearAuxiliaryHistogramHighlightedProperties,
  clearAuxiliaryHistogramHighlightedTypes as graphClearAuxiliaryHistogramHighlightedTypes,
  clearTimelineHighlight as graphClearTimelineHighlight,
  GraphState,
  selectGraph,
  setGraphSelection as graphSetSelectedEntityIds,
  toggleAuxiliaryHistogramHighlightedProperty as graphToggleAuxiliaryHistogramHighlightedProperty,
  toggleAuxiliaryHistogramHighlightedTypes as graphToggleAuxiliaryHistogramHighlightedTypes,
} from "../../store/graph";
import {
  clearAuxiliaryHistogramHighlightedProperties as mapClearAuxiliaryHistogramHighlightedProperties,
  clearAuxiliaryHistogramHighlightedTypes as mapClearAuxiliaryHistogramHighlightedTypes,
  clearTimelineHighlight as mapClearTimelineHighlight,
  MapState,
  selectMap,
  setSelectedEntities as mapSetSelectedEntityIds,
  toggleAuxiliaryHistogramHighlightedProperty as mapToggleAuxiliaryHistogramHighlightedProperty,
  toggleAuxiliaryHistogramHighlightedTypes as mapToggleAuxiliaryHistogramHighlightedTypes,
} from "../../store/map";
import {
  DrawerState,
  SearchResultFilterBy,
  selectDrawer,
  setAdvSearchResultFilterByStoreKey,
  setLoadedTemplateByStoreKey,
  setResultsByGroupedByTypeByStoreKey,
  setTabByKey,
  setTemplateSearchValueByStoreKey,
} from "../../store/drawer";
import {
  BrowserState,
  selectBrowser,
  updateTemplate,
} from "../../store/browser";

import Drawer from "../../lib/Drawer/Drawer";
import HistogramDrawer from "../../components/Drawer/Tabs/Histogram/Histogram";
import SelectionDrawer from "../../components/Drawer/Tabs/Selection/Selection";
import TagsDrawer from "../../components/Drawer/Tabs/Tags/Tags";
import { EntityDto } from "../../API/DataModels/Database/NovaObject";
import DrawerTabAdvancedSearch from "../../components/Drawer/Tabs/AdvancedSearch/AdvancedSearch";
import {
  BROWSER_FORM_MAPPING_BY_TYPE_DETAILS,
  BrowserSearchTemplate,
  BrowserTabType,
  IBrowserAdvancedSearchForm,
} from "../../constants/browser-related";
import ApiFactory from "../../API/controllers/api-factory";
import SearchApi from "../../API/controllers/search-api";
import { formToSearchQuery } from "../../utils/browser";
import SearchQueriesApi from "../../API/controllers/search-queries-api";
import { useGlobalModalContext } from "../../hooks/useGlobalModal";
import { NovaEntityType } from "../../API/DataModels/Database/NovaEntityEnum";
import { initialHistogramState } from "../../store/shared/histogram";
import { initTimelineState } from "../../store/shared/timeline";
import moment from "moment";

interface AuxiliariesDrawerProps {
  className?: string;
  onToggle: React.MouseEventHandler;
  isCollapsed?: boolean;
  storeKey: keyof DrawerState; // Store used to get the data
  entity?: EntityDto | null;
  entities?: EntityDto[];
}

const AuxiliariesDrawer = ({
  className,
  onToggle,
  storeKey,
  isCollapsed = false,
  entity = null,
  entities,
}: AuxiliariesDrawerProps) => {
  const browserState = useAppSelector<BrowserState>(selectBrowser);
  const drawerState = useAppSelector<DrawerState>(selectDrawer);
  const graphState = useAppSelector<GraphState>(selectGraph);
  const mapState = useAppSelector<MapState>(selectMap);
  const dispatch = useAppDispatch();
  const { hideModal } = useGlobalModalContext();

  const [currentEntity, setCurrentEntity] = useState<EntityDto | null>(entity);
  const [currentEntities, setCurrentEntities] = useState<EntityDto[]>([]);
  const [selectedEntitiesIds, setSelectedEntitiesIds] = useState<string[]>([]);
  const [entityIdsAsMap, setEntityIdsAsMap] = useState<{
    [eId: EntityDto["id"]]: boolean;
  }>({});

  const [histogramHighlights, setHistogramHighlights] = useState(
    initialHistogramState().histogramHighlights
  );
  const [timelineHighlightedIds, setTimelineHighlightedIds] = useState(
    initTimelineState().timelineHighlightedIds
  );

  const setGraph = () => {
    setSelectedEntitiesIds(graphState.selection);
    setHistogramHighlights(graphState.histogramHighlights);
    setTimelineHighlightedIds(graphState.timelineHighlightedIds);

    if (!graphState.selection.length) {
      setCurrentEntities([]);
    } else {
      const selectedEntitiesIdsAsMap = graphState.selection.reduce(
        (acc: { [eId: EntityDto["id"]]: boolean }, id) => {
          acc[id] = true;
          return acc;
        },
        {}
      );

      setCurrentEntities(
        graphState.entities.reduce((acc, e) => {
          if (e.id === graphState.focusedEntityId) setCurrentEntity(e);
          // @ts-ignore
          if (selectedEntitiesIdsAsMap[e.id]) acc.push(e);
          return acc;
        }, [])
      );
    }

    setEntityIdsAsMap(
      graphState.entities.reduce((acc, { id }) => {
        acc[id] = true;
        return acc;
      }, {})
    );
  };

  const setMap = () => {
    // cause une boucle infinie à cause des useEffect sur [selectedEntitiesIds] dans l'histograme
    // car selectedEntities est un EntityDto[]
    setHistogramHighlights(mapState.histogramHighlights);
    setTimelineHighlightedIds(mapState.timelineHighlightedIds);

    const currE = mapState.selection.length
      ? mapState.entities.find(
          (e) => e.id === mapState.selection[mapState.selection.length - 1]
        )
      : null;
    setCurrentEntity(currE || null);

    const eIdsAsMap = mapState.selection.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});

    const geometryEntities = mapState.entities.filter((a) => !!a.geometry);
    setCurrentEntities(geometryEntities.filter(({ id }) => eIdsAsMap[id]));

    setEntityIdsAsMap(
      geometryEntities.reduce((acc, { id }) => {
        acc[id] = true;
        return acc;
      }, {})
    );
  };

  const init = () => {
    if (storeKey) {
      switch (storeKey) {
        case "graph":
          setGraph();
          break;
        case "map":
          setMap();
          break;
        default:
          setCurrentEntity(entity);
          break;
      }
    }
  };

  // ADVANCED SEARCH TAB
  const handleAdvSearchFormChange = (
    partialForm: Partial<IBrowserAdvancedSearchForm>,
    isForced = false
  ) => {
    dispatch(
      setTabByKey({
        storeKey,
        update: {
          advancedSearch: {
            ...drawerState[storeKey].advancedSearch,
            // @ts-ignore
            form: {
              ...(isForced ? {} : drawerState[storeKey].advancedSearch.form),
              ...partialForm,
            },
          },
        },
      })
    );
  };
  // same as ComplexeSearch but without the searchStats query
  const handleAdvSearchFormSubmit = () => {
    const limit = 150;
    const apiClient = ApiFactory.create<SearchApi>("SearchApi");

    const failures: string[] = [];

    const { form } = drawerState[storeKey].advancedSearch;

    try {
      const searchQuery = formToSearchQuery(
        form,
        BROWSER_FORM_MAPPING_BY_TYPE_DETAILS[BrowserTabType.Advanced]
      );
      // Ignore empty requests
      if (!searchQuery) {
        toast.error(
          'Veuillez saisir au moins une valeur et la confirmer en appuyant sur la touche "Entrée".'
        );
        return;
      }

      const begin = form?.createdAt?.values?.[0]?.[0]
        ? moment(form?.createdAt?.values?.[0]?.[0]).format("YYYYMMDD")
        : undefined;

      const end = form?.createdAt?.values?.[0]?.[1]
        ? moment(form?.createdAt?.values?.[0]?.[1]).format("YYYYMMDD")
        : undefined;

      apiClient
        .search_v2(
          searchQuery,
          limit,
          undefined,
          undefined,
          undefined,
          begin,
          end
        )
        .then((response) => {
          if (response.queryId) {
            apiClient.search_v2_close(response.queryId);
          }

          const searchResultsByType = {};
          // const searchResultsDto = response.events.reduce(
          //   (acc: EntityDto[], result) => {
          //     // filter invalid data => useless in prod ?

          //     const idProp = getIdProperty(result, ontologyState.ont);
          //     if (!idProp) {
          //       console.warn('id prop not found', result, ontologyState.ont);
          //       return acc;
          //     }
          //     result.id = result[idProp];
          //     result.label = getEntityTitleProperty(result, ontologyState.ont);

          //     const dto = convertToEntityDto2(result, ontologyState.ont);
          //     const typeGroup = getEntityTypeGroup(dto, ontologyState.ont);
          //     const typeId = getEntityTypeId(dto, ontologyState.ont);

          //     if (searchResultsByType[typeId]) {
          //       searchResultsByType[typeId].push(dto);
          //     } else {
          //       searchResultsByType[typeId] = [dto];
          //     }

          //     acc.push(dto);
          //     return acc;
          //   }, [],
          // );

          dispatch(
            setResultsByGroupedByTypeByStoreKey({
              storeKey,
              resultsGroupedByNovaType: searchResultsByType,
            })
          );
        });
    } catch (err: any) {
      console.error(err);
      toast.error(err.toString());
    } finally {
      if (failures.length) {
        failures.forEach((f) => console.error(f.toString()));
        toast.error(
          `${failures.length} requests failed. Details are available in the console.`
        );
      }
    }
  };

  const advSearchTabHandleTemplateLoaded = (
    template: BrowserSearchTemplate
  ) => {
    dispatch(
      setLoadedTemplateByStoreKey({
        storeKey,
        template,
      })
    );
  };

  // dispatch dans BrowserState
  const advSearchTabHandleTemplateUpdated = (
    template: BrowserSearchTemplate
  ) => {
    const apiClient = ApiFactory.create<SearchQueriesApi>("SearchQueriesApi");
    apiClient
      .updateTemplate(template.id, template)
      .then((updatedTemplate) => {
        dispatch(updateTemplate(updatedTemplate));
        toast.success("Mise à jour terminée");
      })
      .catch((err) => {
        console.error(err);
        toast.error(`La mise à jour a échoué: ${err.toString()}`);
      })
      .finally(() => {
        hideModal();
      });
  };

  const advSearchHandleTemplateSearchValueInputChange = (str: string) => {
    dispatch(
      setTemplateSearchValueByStoreKey({
        storeKey,
        str,
      })
    );
  };

  const handleAdvSearchFilterChange = (filter: SearchResultFilterBy) => {
    dispatch(
      setAdvSearchResultFilterByStoreKey({
        storeKey,
        filter,
      })
    );
  };

  // HISTOGRAM
  const clearAuxiliaryHistogramHighlightedProperties = () => {
    switch (storeKey) {
      case "graph":
        dispatch(graphClearAuxiliaryHistogramHighlightedProperties());
        break;
      case "map":
        dispatch(mapClearAuxiliaryHistogramHighlightedProperties());
        break;
      default:
        console.error("Action not available in", storeKey);
        break;
    }
  };

  const clearAuxiliaryHistogramHighlightedTypes = () => {
    switch (storeKey) {
      case "graph":
        dispatch(graphClearAuxiliaryHistogramHighlightedTypes());
        break;
      case "map":
        dispatch(mapClearAuxiliaryHistogramHighlightedTypes());
        break;
      default:
        console.error("Action not available in", storeKey);
        break;
    }
  };

  const clearTimelineHighlight = () => {
    switch (storeKey) {
      case "graph":
        dispatch(graphClearTimelineHighlight());
        break;
      case "map":
        dispatch(mapClearTimelineHighlight());
        break;
      default:
        console.error("Action not available in", storeKey);
        break;
    }
  };

  const setSelectedEntityIds = (ids: string[]) => {
    switch (storeKey) {
      case "graph":
        dispatch(graphSetSelectedEntityIds(ids));
        break;
      case "map":
        dispatch(mapSetSelectedEntityIds(ids));
        break;
      default:
        console.error("Action not available in", storeKey);
        break;
    }
  };

  const toggleAuxiliaryHistogramHighlightedTypes = (type: NovaEntityType) => {
    switch (storeKey) {
      case "graph":
        dispatch(graphToggleAuxiliaryHistogramHighlightedTypes(type));
        break;
      case "map":
        dispatch(mapToggleAuxiliaryHistogramHighlightedTypes(type));
        break;
      default:
        console.error("Action not available in", storeKey);
        break;
    }
  };

  const toggleAuxiliaryHistogramHighlightedProperty = ({
    histogramElementId,
    entities: entitiesToHighlight,
  }: {
    histogramElementId: string;
    entities: Partial<EntityDto>[];
  }) => {
    switch (storeKey) {
      case "graph":
        dispatch(
          graphToggleAuxiliaryHistogramHighlightedProperty({
            histogramElementId,
            entities: entitiesToHighlight,
          })
        );
        break;
      case "map":
        dispatch(
          mapToggleAuxiliaryHistogramHighlightedProperty({
            histogramElementId,
            entities: entitiesToHighlight,
          })
        );
        break;
      default:
        console.error("Action not available in", storeKey);
        break;
    }
  };

  useEffect(() => {
    init();
  }, [storeKey, entity, entities]);

  useEffect(() => {
    if (storeKey === "graph") {
      setGraph();
    }
  }, [graphState]);

  useEffect(() => {
    if (storeKey === "map") {
      setMap();
    }
  }, [mapState]);

  const browserMenus = [
    {
      key: "Marquants",
      component: <TagsDrawer entity={currentEntity} />,
    },
    {
      key: "Histogramme",
      component: (
        <HistogramDrawer
          entities={currentEntities}
          selectedEntityIds={selectedEntitiesIds}
          histogramHighlights={histogramHighlights}
          timelineHighlightedIds={timelineHighlightedIds}
          clearAuxiliaryHistogramHighlightedProperties={
            clearAuxiliaryHistogramHighlightedProperties
          }
          clearAuxiliaryHistogramHighlightedTypes={
            clearAuxiliaryHistogramHighlightedTypes
          }
          clearTimelineHighlight={clearTimelineHighlight}
          setSelectedEntityIds={setSelectedEntityIds}
          toggleAuxiliaryHistogramHighlightedTypes={
            toggleAuxiliaryHistogramHighlightedTypes
          }
          toggleAuxiliaryHistogramHighlightedProperty={
            toggleAuxiliaryHistogramHighlightedProperty
          }
        />
      ),
    },
    {
      key: "Recherche",
      component: (
        <DrawerTabAdvancedSearch
          form={drawerState[storeKey]?.advancedSearch.form}
          entitiesGroupedByNovaType={
            drawerState[storeKey]?.advancedSearch.resultsByType
          }
          templateSearchValue={
            drawerState[storeKey]?.advancedSearch.templateSearchValue
          }
          searchTemplates={browserState.searchTemplates}
          loadedTemplate={drawerState[storeKey]?.advancedSearch.loadedTemplate}
          filterBy={drawerState[storeKey]?.advancedSearch.filter}
          entitiesAlreadyPresent={entityIdsAsMap}
          onFilterChange={handleAdvSearchFilterChange}
          onFormChange={handleAdvSearchFormChange}
          onSubmit={handleAdvSearchFormSubmit}
          onTemplateLoaded={advSearchTabHandleTemplateLoaded}
          onTemplateSearchInputValueChange={
            advSearchHandleTemplateSearchValueInputChange
          }
          onTemplateUpdated={advSearchTabHandleTemplateUpdated}
        />
      ),
    },
    {
      key: "Sélection",
      component: (
        <SelectionDrawer
          // @ts-ignore
          entity={currentEntity}
          currentTabSelectionWidget={storeKey}
          // displayCurrentSelectionWidget={storeKey === 'graph'}
        />
      ),
    },
  ];

  return (
    <Drawer
      className={className}
      isCollapsed={isCollapsed}
      menus={browserMenus}
      onToggle={onToggle}
    />
  );
};
export default AuxiliariesDrawer;
