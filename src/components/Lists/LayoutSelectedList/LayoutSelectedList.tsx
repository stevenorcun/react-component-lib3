/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cx from "classnames";
// import ApiFactory from "../../../API/controllers/api-factory";
// import ObjectsApi from "../../../API/controllers/object-api";
// import { convertToEntityDto } from "../../../API/DataModels/DTO/entityDto";
import { selectLists, setSelectObjectId } from "../../../store/lists";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import SearchResult from "../../../components/Browser/SearchResult/SearchResult";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./layoutSelectedList.scss";
import { APP_ROUTES } from "../../../constants/routes";
// import { selectOntologyConfig } from "../../../store/ontology";

const LayoutSelectedList = ({ entityIds }: { entityIds: string[] }) => {
  if (!entityIds) {
    return;
  }
  const listsState = useAppSelector(selectLists);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [objectList] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState("");
  // const fetchData: any[] = [];
  // const { ont } = useAppSelector(selectOntologyConfig);

  // const init = async () => {
  //   // FIXME
  //   // const apiClient = ApiFactory.create<SearchApi>('SearchApi');
  //   const apiClient = ApiFactory.create<ObjectsApi>("ObjectsApi");

  //   try {
  //     // const responses = await Promise.allSettled(entityIds.map(({ id, idProp }) => apiClient.search_v2(`${idProp}:${id}`)));
  //     const responses = await Promise.allSettled(
  //       entityIds.map((e) => apiClient.getObject(e))
  //     );

  //     responses.forEach((response) => {
  //       if (response.status === "rejected") {
  //         // failures.push(response.reason);
  //         return;
  //       }
  //       if (response.value.queryId) {
  //         // apiClient.search_v2_close(response.value.queryId);
  //       }
  //       const data = response.value.events[0];
  //       const result = convertToEntityDto(data._source);
  //       // const result = convertToEntityDto2(data, ont);
  //       fetchData.push(result);
  //     });
  //     setObjectList(fetchData);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
    //  init();
    if (selectedCard) {
      setSelectedCard("");
    }
  }, [entityIds]);

  const onResultClick = (value) => {
    const selectedObjects = { ...listsState.selectObjectId };
    if (selectedObjects[value.id]) {
      delete selectedObjects[value.id];
    } else {
      selectedObjects[value.id] = true;
    }
    dispatch(setSelectObjectId(selectedObjects));
  };

  const handleOpenTab = () => {
    navigate(APP_ROUTES.browser.path);
  };

  return (
    <div className={cx(commons.PrettyScroll, styles.OverflowMeDaddy)}>
      <div className={styles.selectedListCards}>
        {objectList.map((result: any) => (
          <div key={result.id}>
            {
              // @ts-ignore
              <SearchResult
                entity={result}
                isSelected={!!listsState.selectObjectId[result.id]}
                className={styles.cardList}
                // handleSelect={handleResultSelect}
                onOpenTab={handleOpenTab}
                handleClick={onResultClick}
                // handleDragStart={onResultDragStart}
              />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelectedList;
