import React from "react";

import Moment from "react-moment";
import {
  selectLists,
  setOriginalLists,
  setSelectObjectId,
} from "@/store/lists";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import IconEdit from "@/assets/images/icons/IconPencilEdit";
import IconRemove from "@/assets/images/icons/IconRemove";
import IconRecto from "@/assets/images/icons/IconRedo";
import IconNewTab from "@/assets/images/icons/IconNewTab";

import styles from "./layoutSelectedListHeader.scss";

const LayoutSelectedListHeader = () => {
  const listsState = useAppSelector(selectLists);
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    const resultOriginalList = listsState.originalLists.map(
      (list: { id: number }) => {
        if (list.id !== listsState.selectOneList.id) {
          return list;
        }
        const cloneList = { ...list };
        // @ts-ignore
        const filterLists = cloneList.value.listsId.filter((id) => {
          const check = !listsState.selectObjectId[id];
          return check;
        });
        const result = {
          ...cloneList,
          value: {
            // @ts-ignore
            ...cloneList.value,
            listsId: filterLists,
          },
        };
        return result;
      }
    );
    dispatch(setOriginalLists(resultOriginalList));
  };

  const handleSelectedAllObject = (e: React.BaseSyntheticEvent) => {
    const { checked } = e.target;
    if (checked) {
      const result = Object.entries(
        listsState.selectOneList.value.listsId
      ).reduce((acc, curr) => {
        // @ts-ignore
        acc[curr[1]] = true;
        return acc;
      }, {});
      dispatch(setSelectObjectId(result));
    } else {
      dispatch(setSelectObjectId({}));
    }
  };

  const listsIcon = [
    {
      id: 0,
      icon: <IconEdit />,
      function: undefined,
    },
    {
      id: 1,
      icon: <IconRemove />,
      function: handleRemove,
    },
    {
      id: 2,
      icon: <IconRecto />,
      function: undefined,
    },
    {
      id: 3,
      icon: <IconNewTab />,
      function: undefined,
    },
  ];

  return (
    <div className={styles.selectedHeader}>
      <div>
        <div className={styles.title}>
          {listsState.selectOneList?.value?.label}
        </div>
        <div className={styles.time}>
          <Moment format="DD/MM/YYYY à hh:mm">
            {listsState.selectOneList?.updatedAt}
          </Moment>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div>
          <input
            type="checkbox"
            name="selected"
            id="selected"
            onChange={handleSelectedAllObject}
          />
          <label htmlFor="selected">Tout sélectionner</label>
        </div>

        <div className={styles.listsButton}>
          {listsIcon.map((element) => (
            <button
              key={element.id}
              className={styles.buttonIcon}
              type="button"
              onClick={element.function}
            >
              {element.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutSelectedListHeader;
