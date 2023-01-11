import React, { useState } from "react";
import cx from "classnames";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeTabExplorer,
  selectExplorer,
  toggleSelectActiveExplorerTab,
} from "@/store/explorer";
import { APP_ROUTES } from "@/constants/routes";

import Options from "@/components/Options/Options";

import IconCross from "@/assets/images/icons/IconCross";
import IconArrowdown from "@/assets/images/icons/IconArrowDown";
// import IconList from '@/assets/images/icons/IconHamburgerMenu';
// import IconGraph from '@/assets/images/icons/IconGraph';
// import IconMap from '@/assets/images/icons/IconMap';
import IconFile from "@/assets/images/icons/IconFile";
import IconExportFile from "@/assets/images/icons/IconFileExport";
import IconImportFile from "@/assets/images/icons/IconExportFile";

import styles from "./tabsObjects.scss";

const Card = ({
  titleTab,
  numberObject,
  index,
  icon,
  origin,
}: {
  titleTab: string;
  numberObject: number;
  index: number;
  icon: React.ReactNode;
  origin: string;
}) => {
  const dispatch = useAppDispatch();
  const explorerState = useAppSelector(selectExplorer);

  const handleClick = () => {
    if (explorerState.activeExlorerTabIndex !== index) {
      dispatch(toggleSelectActiveExplorerTab(index));
    }
  };

  const handleRemoveTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeTabExplorer(index));
  };

  return (
    <div
      className={cx(styles.card, {
        [styles.card__active]: index === explorerState.activeExlorerTabIndex,
      })}
      onClick={handleClick}
    >
      <div className={styles.card__left}>
        <div
          className={cx({
            [styles.card__icon]: index !== explorerState.activeExlorerTabIndex,
            [styles.card__iconActive]:
              index === explorerState.activeExlorerTabIndex,
          })}
        >
          {icon}
        </div>
        <div style={{ marginLeft: ".5rem" }}>
          <p className={styles.card__title}>{titleTab}</p>
          <p className={styles.card__subtitle}>{origin}</p>
          <p className={styles.card__subtitle}>{`${numberObject} objet(s)`}</p>
        </div>
      </div>
      <button
        type="button"
        className={cx(styles.iconCross, {
          [styles.iconCross__active]:
            index === explorerState.activeExlorerTabIndex,
        })}
        onClick={handleRemoveTab}
      >
        <IconCross
          fill={
            index === explorerState.activeExlorerTabIndex ? "#3083F7" : "#fff"
          }
        />
      </button>
    </div>
  );
};

interface TabsObjectsProps {
  properties: Array<string>;
  data: Array<string>;
  tab: string;
  type: string;
  origin: string;
  icon?: React.ReactNode;
  listDataByProperty: {
    [key: string]: Array<string>;
  };
}

const TabsObjects = () => {
  const explorerState = useAppSelector(selectExplorer);
  const navigate = useNavigate();
  const [isVisibilityOption, setIsVisibilityOption] = useState(false);

  const isHandleOption = () => {
    setIsVisibilityOption(!isVisibilityOption);
  };

  const DownloadEntityToJson = () => {
    const copyData = [
      ...explorerState.tabs[explorerState.activeExlorerTabIndex].data,
    ];
    copyData.splice(
      0,
      0,
      explorerState.tabs[explorerState.activeExlorerTabIndex].properties
    );

    const blob = new Blob([JSON.stringify(copyData)], {
      type: "application/json",
    });
    const fileDownloadUrl = URL.createObjectURL(blob);
    axios({
      url: fileDownloadUrl,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${explorerState.tabs[explorerState.activeExlorerTabIndex].type}.json`
      );
      document.body.appendChild(link);
      link.click();
    });
    isHandleOption();
  };

  const addExplorerToNote = () => {
    const explorer = explorerState.tabs[explorerState.activeExlorerTabIndex];
    const content = JSON.stringify([explorer]);
    localStorage.setItem("note-insertedExplorer", content);
    navigate(APP_ROUTES.note.path);
  };

  const menuOptions = [
    {
      label: "Ouvrir dans",
      isDivider: true,
    },
    // {
    //   label: 'Liste',
    //   icon: <IconList />,
    //   // onClick: addEntityToList,
    // },
    // {
    //   label: 'Graph',
    //   icon: <IconGraph />,
    //   // onClick: addEntityToGraph,
    // },
    // {
    //   label: 'Carte',
    //   icon: <IconMap />,
    //   // onClick: addEntityToMap,
    // },
    {
      label: "Document collaboratif",
      icon: <IconFile />,
      onClick: addExplorerToNote,
    },
    {
      label: "Exporter",
      isDivider: true,
    },
    {
      label: "Au format CSV",
      icon: <IconExportFile />,
    },
    {
      label: "Au format JSON",
      icon: <IconExportFile />,
      onClick: DownloadEntityToJson,
    },
    {
      label: "Importer",
      isDivider: true,
    },
    {
      label: "Un fichier .CSV",
      icon: <IconImportFile />,
    },
  ];

  const noDataMenuOptions = [
    {
      label: "Importer",
      isDivider: true,
    },
    {
      label: "Un fichier .CSV",
      icon: <IconImportFile />,
    },
  ];

  return (
    <div className={styles.header}>
      <div className={styles.cards}>
        {explorerState.tabs.map((element: TabsObjectsProps, index: number) => (
          <Card
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            titleTab={element.type}
            origin={element.origin}
            numberObject={element?.data?.length}
            icon={element.icon}
          />
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          className={styles.buttonAction}
          onClick={isHandleOption}
        >
          Action
          <div className={styles.buttonAction__icon}>
            <IconArrowdown fill="#fff" />
          </div>
        </button>
        {isVisibilityOption && (
          <Options
            list={
              explorerState.tabs.length > 0 ? menuOptions : noDataMenuOptions
            }
            isOpen={isVisibilityOption}
            isHandleOption={isHandleOption}
          />
        )}
      </div>
    </div>
  );
};

export default TabsObjects;
