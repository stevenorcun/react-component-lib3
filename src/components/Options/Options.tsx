/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cx from "classnames";
import { useCSVDownloader, useCSVReader } from "react-papaparse";
import { toast } from "react-toastify";

import { unhandle } from "../../utils/DOM";

import { SheetHeaderOptionsSummary } from "../../components/Sheet/Tabs/TabEntitySummary/Components/DetailSheetHeader";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectExplorer, addEntitiesExplorer } from "../../store/explorer";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./options.scss";

interface OptionsProps {
  list: SheetHeaderOptionsSummary[];
  className?: string;
  title?: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
  isHandleOption?: () => void;
}

const Options = ({
  className,
  title,
  list,
  setOpen,
  isOpen,
  isHandleOption,
}: OptionsProps) => {
  const navigate = useNavigate();
  const { CSVReader } = useCSVReader();
  const { CSVDownloader, Type } = useCSVDownloader();
  const explorerState = useAppSelector(selectExplorer);

  const exportFileCsv = () => {
    if (explorerState.tabs.length > 0) {
      const copyData = [
        ...explorerState.tabs[explorerState.activeExlorerTabIndex].data,
      ];
      copyData.splice(
        0,
        0,
        explorerState.tabs[explorerState.activeExlorerTabIndex].properties
      );
      return copyData;
    }
    toast.error("Vous devez ajouter des données afin de pouvoir Exporter");
  };

  const onClick = (el) => {
    if (setOpen) {
      setOpen(false);
    }
    if (el && el.onClick) {
      el.onClick();
    }
  };

  const componentsFormatCsv = (el: {
    icon: React.ReactNode;
    label: string;
  }) => (
    <CSVDownloader
      type={Type.Button}
      className={styles.button}
      filename={explorerState.tabs[explorerState.activeExlorerTabIndex]?.type}
      data={exportFileCsv}
      bom
      download
    >
      {el.icon && <div className={styles.icon}>{el.icon}</div>}
      <p className={styles.label}>{el.label}</p>
    </CSVDownloader>
  );

  const componenFileCsv = (el: { label: string; icon: React.ReactNode }) => {
    const dispatch = useAppDispatch();

    return (
      <CSVReader
        onUploadAccepted={(results: any) => {
          const id =
            explorerState.tabs.length === 0
              ? 0
              : explorerState.activeExlorerTabIndex + 1;
          dispatch(
            addEntitiesExplorer({
              id,
              data: results.data,
              source: "Import Csv",
              type: "csv",
            })
          );
          isHandleOption?.();
        }}
      >
        {({ getRootProps }: any) => (
          <button type="button" className={styles.button} {...getRootProps()}>
            {el.icon && <div className={styles.icon}>{el.icon}</div>}
            <p className={styles.label}>{el.label}</p>
          </button>
        )}
      </CSVReader>
    );
  };

  const choiceComponent = (element: {
    label: string;
    icon: React.ReactNode;
    path?: string;
  }) => {
    switch (element.label) {
      case "Au format CSV":
        return componentsFormatCsv(element);
      case "Un fichier .CSV":
        return componenFileCsv(element);
      default:
        return (
          <div
            className={cx(commons.clickable, styles.button)}
            onClick={() => {
              if (element.path) navigate(element.path);
              onClick(element);
            }}
          >
            {element.icon && <div className={styles.icon}>{element.icon}</div>}
            <p className={styles.label}>{element.label}</p>
          </div>
        );
    }
  };

  useEffect(() => {
    if (isHandleOption && isOpen) {
      document.addEventListener("click", isHandleOption);
    }
    return () => {
      if (isHandleOption) {
        document.removeEventListener("click", isHandleOption);
      }
    };
  }, [setOpen]);
  return (
    <div className={cx(className, styles.options)} onClick={unhandle}>
      {title && (
        <>
          <div className={styles.title}>{title}</div>
          <div className={styles.divider} />
        </>
      )}
      <div className={styles.options__Body}>
        {list.map((el, index) => (
          <Fragment key={index}>
            {el.isDivider ? (
              <>
                {!!el.label && <div className={styles.title}>{el.label}</div>}
                <div className={styles.divider} />
              </>
            ) : (
              // @ts-ignore
              choiceComponent(el)
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Options;
