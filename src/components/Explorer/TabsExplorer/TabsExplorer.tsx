/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import cx from "classnames";

import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  sortFilterEntities,
  selectExplorer,
  toggleSelectSubTab,
} from "@/store/explorer";

import IconExplorer from "@/assets/images/icons/IconExplorer";
import IconExplorerTabGraph from "@/assets/images/icons/IconExplorerTabGraph";
import IconArrow from "@/assets/images/icons/IconArrowDown";
import IconPhone from "@/assets/images/icons/IconPhone";

import styles from "./tabsExplorer.scss";

const DropdownTab = ({
  list,
  handleSelect,
  onClose,
}: {
  list: {
    value: Array<string>;
    isOpen: boolean;
  };

  onClose: () => void;
  handleSelect?: (element: string) => void;
}) => {
  useEffect(() => {
    if (list?.isOpen) {
      document.addEventListener("click", onClose);
    }
    return () => {
      document.removeEventListener("click", onClose);
    };
  }, [list.isOpen]);

  return (
    <div className={styles.dropdownTab}>
      {list.value.map((element) => (
        <button
          type="button"
          // @ts-ignore
          onClick={() => handleSelect(element)}
          className={styles.element}
        >
          {`Par "${element}"`}
        </button>
      ))}
    </div>
  );
};

const Tab = ({
  label,
  icon,
  arrow,
  handleSelectTab,
  index,
}: {
  label: string;
  icon: React.ReactNode;
  arrow: boolean | undefined;
  handleSelectTab: (index: number) => void;
  index: number;
}) => {
  const explorerState = useAppSelector(selectExplorer);

  const labelStore =
    explorerState.tabs[explorerState.activeExlorerTabIndex]?.tab;

  return (
    <div
      className={cx(styles.tab, {
        [styles.tab__selected]: labelStore === label,
      })}
      onClick={() => handleSelectTab(index)}
    >
      <div
        className={cx(styles.icon, {
          [styles.iconSelected]: labelStore === label,
        })}
      >
        {icon}
      </div>
      <p className={styles.label}>{label}</p>
      {arrow && <IconArrow />}
    </div>
  );
};

interface DataProps {
  id: number;
  icon?: React.ReactNode;
  label: string;
  arrow?: boolean;
  onClick?: () => void;
  list?: {
    isOpen: boolean;
    value: Array<string>;
  };
}

const TabsExplorer = () => {
  const dispatch = useAppDispatch();
  const explorerState = useAppSelector(selectExplorer);

  const handleInProgress = () => {
    toast.warning("En cours de développement");
  };

  const handleSelectbyFadet = (label: string) => {
    if (label === "Fréquence") {
      const indexType = explorerState.tabs[
        explorerState.activeExlorerTabIndex
      ].properties.findIndex((el: string) => el === "type");

      const indexRemote = explorerState.tabs[
        explorerState.activeExlorerTabIndex
      ].properties.findIndex((el: string) => el === "remote");

      const indexDuration = explorerState.tabs[
        explorerState.activeExlorerTabIndex
      ].properties.findIndex((el: string) => el === "duration");

      const indexTimestamp = explorerState.tabs[
        explorerState.activeExlorerTabIndex
      ].properties.findIndex((el: string) => el === "timestamp");

      const result = explorerState.tabs[
        explorerState.activeExlorerTabIndex
      ].data.reduce((acc, curr: Array<string>) => {
        acc[curr[indexRemote]] = acc[curr[indexRemote]]
          ? {
              ...acc[curr[indexRemote]],
              "fréquence de communication":
                acc[curr[indexRemote]]["fréquence de communication"] + 1,
              sms:
                curr[indexType] === "SMS"
                  ? acc[curr[indexRemote]].sms + 1
                  : acc[curr[indexRemote]].sms,
              "durée totale": curr[indexDuration]
                ? acc[curr[indexRemote]]["durée totale"] +
                  Number(curr[indexDuration])
                : acc[curr[indexRemote]]["durée totale"],
              "durée moyenne": curr[indexDuration]
                ? Math.round(
                    (acc[curr[indexRemote]]["durée totale"] +
                      Number(curr[indexDuration])) /
                      acc[curr[indexRemote]]["fréquence de communication"] +
                      1
                  )
                : Math.round(
                    acc[curr[indexRemote]]["durée totale"] /
                      acc[curr[indexRemote]]["fréquence de communication"] +
                      1
                  ),
              "date début":
                acc[curr[indexRemote]]["date début"] < curr[indexTimestamp]
                  ? acc[curr[indexRemote]]["date début"]
                  : curr[indexTimestamp],
              "date fin":
                acc[curr[indexRemote]]["date fin"] > curr[indexTimestamp]
                  ? acc[curr[indexRemote]]["date fin"]
                  : curr[indexTimestamp],
            }
          : {
              "fréquence de communication": 1,
              sms: curr[indexType] === "SMS" ? 1 : null,
              "durée totale": Number(curr[indexDuration]) ?? null,
              "durée moyenne": Number(curr[indexDuration]) ?? null,
              "date début": curr[indexTimestamp],
              "date fin": curr[indexTimestamp],
            };
        return acc;
      }, {});

      const transformObject = [];

      Object.entries(result).forEach((el) => {
        if (el[0] !== "undefined") {
          // @ts-ignore
          transformObject.push([
            `${el[0]
              ?.replace(/^33(.*)/, "0$1")
              ?.match(/(\d{2})/g)
              ?.join(" ")}`,
            // @ts-ignore
            ...Object.values(el[1]).map((value: string) => value || ""),
          ]);
        }
      });

      dispatch(
        sortFilterEntities({
          id: explorerState.activeExlorerTabIndex + 1,
          // @ts-ignore
          properties: ["Téléphone", ...Object.keys(Object.values(result)[0])],
          data: transformObject,
          tab: "Fadet",
          type: "Fadet par Fréquence",
          icon: <IconPhone />,
        })
      );
    } else {
      handleInProgress();
    }
  };

  const [data, setData] = useState<Array<DataProps>>([
    {
      id: 0,
      icon: <IconExplorer />,
      label: "Tableau",
    },
    {
      id: 1,
      icon: <IconExplorerTabGraph />,
      label: "Graphique",
      // arrow: true,
      onClick: handleInProgress,
    },
    {
      id: 2,
      label: "Histogramme des propriétés",
      // arrow: true,
      onClick: handleInProgress,
    },
    {
      id: 3,
      label: "Grouper par :",
      onClick: handleInProgress,
    },
    {
      id: 4,
      label: "Histogramme des liens",
      onClick: handleInProgress,
    },
    {
      id: 5,
      label: "Diagramme circulaire",
      // arrow: true,
      onClick: handleInProgress,
      // list: {
      //   isOpen: false,
      //   value: ['Numéro de téléphone', 'Opérateur', 'Durée', 'Téléphone', 'Fréquence'],
      // },
    },
    {
      id: 6,
      label: "Chronologie",
      onClick: handleInProgress,
    },
    {
      id: 7,
      label: "Fadet",
      arrow: true,
      // @ts-ignore
      onClick: handleSelectbyFadet,
      list: {
        isOpen: false,
        value: [
          "Fréquence",
          "Dernière position",
          "Correspondants communs",
          "Proximité",
        ],
      },
    },
  ]);

  const handleSelectTab = (index: number) => {
    if (data[index].arrow) {
      const copyData = [...data];
      // @ts-ignore
      copyData[index].list.isOpen = !copyData[index].list?.isOpen;
      setData(copyData);
    } else if (
      data[index].label === "Tableau" ||
      data[index].label === "Fadet"
    ) {
      dispatch(toggleSelectSubTab(data[index].label));
    } else {
      toast.warning("En cours de développement");
    }
  };

  const onClose = () => {
    const result = data.map((element) => {
      if (element.list) {
        return {
          ...element,
          list: {
            ...element.list,
            isOpen: false,
          },
        };
      }
      return element;
    });
    setData(result);
  };

  return (
    <div className={styles.tabs}>
      {data.map((element, index) => (
        <div key={element.id} className={styles.contained}>
          <Tab
            label={element.label}
            icon={element.icon}
            arrow={element.arrow}
            handleSelectTab={handleSelectTab}
            index={index}
          />
          {element.list?.isOpen && (
            <DropdownTab
              list={element.list}
              handleSelect={element.onClick}
              onClose={onClose}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TabsExplorer;
