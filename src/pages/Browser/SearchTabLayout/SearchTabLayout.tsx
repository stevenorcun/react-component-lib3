import React from "react";
import { toast } from "react-toastify";
import moment from "moment";
import ApiFactory from "@/API/controllers/api-factory";
import SearchApi from "@/API/controllers/search-api";
import { formToSearchQuery } from "@/utils/browser";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import { convertToEntityDto2 } from "@/API/DataModels/DTO/entityDto";
import {
  BrowserState,
  incrActiveTabRequestCount,
  selectBrowser,
  setActiveEntity,
  setActiveTabResults,
  setActiveTabSearchFilters,
  toggleResultSelection,
} from "@/store/browser";
import DRAG_EVENT_TYPES from "@/constants/drag-events-types";
import {
  BrowserTabType,
  IBrowserSearchForm,
  IBrowserSearchTab,
} from "@/constants/browser-related";
import ComplexSearchLayout from "@/pages/Browser/ComplexSearchLayout/ComplexSearchLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import SimpleSearchLayout from "@/pages/Browser/SimpleSearchLayout/SimpleSearchLayout";
import {
  getEntityStrIcon,
  getEntityTitleProperty,
  getEntityTypeGroup,
  getEntityTypeId,
  getEntityTypeLabel,
  getIdProperty,
} from "@/constants/entity-related";
import { OntologyConfigState, selectOntologyConfig } from "@/store/ontology";

export interface SearchTabLayoutProps {
  tab: IBrowserSearchTab;
  onResultClick: (entity: EntityDto, e: React.MouseEvent) => void;
  onResultSelect: (entity: EntityDto, e: React.MouseEvent) => void;
  onResultDragStart: (entity: EntityDto, e: React.DragEvent) => void;
  onSubmit: (
    form: IBrowserSearchForm,
    formKeysToApiMap: { [key: string]: string }
  ) => void;
}

const SearchTabLayout = ({ tab }: { tab: IBrowserSearchTab }) => {
  const dispatch = useAppDispatch();
  const browserState: BrowserState = useAppSelector(selectBrowser);
  const ontologyState: OntologyConfigState =
    useAppSelector(selectOntologyConfig);

  // TODO Should be done in async store (Middleware)
  const handleSearchFormSubmit = async (
    form: IBrowserSearchForm,
    formKeysToApiMap
  ) => {
    const limit = 100;
    const apiClient = ApiFactory.create<SearchApi>("SearchApi");
    const failures: string[] = [];
    try {
      const searchQuery = formToSearchQuery(form, formKeysToApiMap);
      // Ignore empty requests
      if (!searchQuery) {
        toast.error(
          'Veuillez saisir au moins une valeur et la confirmer en appuyant sur la touche "Entrée".'
        );
        return;
      }

      // This counter is used to not redo a request when a Simple Search Tab becomes active
      dispatch(incrActiveTabRequestCount());

      // fixme duplicated from src/components/Drawer/Drawer.tsx
      const begin = form?.createdAt?.values?.[0]?.[0]
        ? moment(form?.createdAt?.values?.[0]?.[0]).format("YYYYMMDD")
        : undefined;

      const end = form?.createdAt?.values?.[0]?.[1]
        ? moment(form?.createdAt?.values?.[0]?.[1]).format("YYYYMMDD")
        : undefined;

      // /!\ the order is important (search > searchStats) for the rest of the function (map)
      const response = await apiClient.search_v2(
        searchQuery,
        limit,
        undefined,
        undefined,
        undefined,
        begin,
        end
      );
      // handle search results
      const { queryId } = response;
      if (queryId) {
        apiClient.search_v2_close(queryId);
      }
      const searchResultsByTypeGroup = {};
      const searchResultsByTypeAndGroups = {};
      const searchResultsDto = response.events.reduce(
        (acc: EntityDto[], result, index) => {
          // filter invalid data => useless in prod ?
          const idProp = getIdProperty(result, ontologyState.ont);
          if (!idProp) {
            console.warn("id prop not found", result, ontologyState.ont);
            return acc;
          }
          result.id = result[idProp];
          result.label = getEntityTitleProperty(result, ontologyState.ont);

          const dto = convertToEntityDto2(result, ontologyState.ont);
          const typeGroup = getEntityTypeGroup(dto, ontologyState.ont);
          const typeId = getEntityTypeId(dto, ontologyState.ont);

          // @ts-ignore
          if (searchResultsByTypeGroup?.[typeGroup]) {
            // @ts-ignore
            searchResultsByTypeGroup[typeGroup].push(dto);
          } else {
            // @ts-ignore
            searchResultsByTypeGroup[typeGroup] = [dto];
            // @ts-ignore
            searchResultsByTypeAndGroups[typeGroup] = {
              checked: true,
              total: 1,
            };
          }

          // @ts-ignore
          if (typeGroup in searchResultsByTypeAndGroups) {
            // @ts-ignore
            if (typeId in searchResultsByTypeAndGroups[typeGroup]) {
              // @ts-ignore
              searchResultsByTypeAndGroups[typeGroup][typeId].count++;
              // @ts-ignore
              searchResultsByTypeAndGroups[typeGroup].total++;
            } else {
              const Icon = getEntityStrIcon(dto, ontologyState.ont);
              // @ts-ignore
              searchResultsByTypeAndGroups[typeGroup][typeId] = {
                label: getEntityTypeLabel(dto, ontologyState.ont),
                icon: Icon ? <Icon /> : null,
                count: 1,
                key: typeId,
                checked: true,
              };
            }
          }
          acc.push(dto);
          return acc;
        },
        []
      );
      dispatch(
        setActiveTabResults({
          results: searchResultsDto,
          resultsByTypeGroup: searchResultsByTypeGroup,
        })
      );
      dispatch(setActiveTabSearchFilters(searchResultsByTypeAndGroups));
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

  const handleDragStart = (entity: EntityDto, e: React.DragEvent) => {
    let entitiesToDrag: EntityDto[];
    if (!tab.selectedResults[entity.id]) entitiesToDrag = [entity];
    else entitiesToDrag = Object.values(tab.selectedResults);
    e.dataTransfer.setData(
      DRAG_EVENT_TYPES.searchResultEntity,
      JSON.stringify(entitiesToDrag)
    );
  };

  const handleResultClick = (entity: EntityDto, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      setActiveEntity({ entity, index: browserState.activeBrowserTabIndex })
    );
  };

  const handleResultSelection = (entity: EntityDto, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleResultSelection(entity));
  };

  return (
    <>
      {(tab.type === BrowserTabType.Advanced ||
        tab.type === BrowserTabType.Person ||
        tab.type === BrowserTabType.Phone) && (
        <ComplexSearchLayout
          tab={tab}
          onResultClick={handleResultClick}
          onResultSelect={handleResultSelection}
          onResultDragStart={handleDragStart}
          onSubmit={handleSearchFormSubmit}
        />
      )}
      {tab.type === BrowserTabType.Simple && (
        <SimpleSearchLayout
          tab={tab}
          onResultClick={handleResultClick}
          onResultSelect={handleResultSelection}
          onResultDragStart={handleDragStart}
          onSubmit={handleSearchFormSubmit}
        />
      )}
    </>
  );
};

export default SearchTabLayout;
