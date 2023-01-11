/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { saveAs } from "file-saver";

import IconFileExport from "@/assets/images/icons/IconFileExport";
import tokml from "tokml";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import cx from "classnames";
import { selectMap } from "@/store/map";
import { useAppSelector } from "@/store/hooks";
import Options from "@/components/Options/Options";
import IconToolDownload from "@/assets/images/icons/IconToolDownload";
import { selectCase } from "@/store/case";
import styles from "./styles.scss";

interface ControlsProps {
  onExportData: { features: [] };
}

const MapControls = (Props: ControlsProps) => {
  const mapState = useAppSelector(selectMap);
  const caseCurrentState = useAppSelector(selectCase);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const toggleActionMenu = () => {
    setIsActionMenuOpen(!isActionMenuOpen);
  };

  const download = (format: string) => {
    const caseName = caseCurrentState.currentCase?.label.replace(/ /g, "_");
    let blob: Blob;
    if (format === "kml") {
      const newProperties = Props.onExportData?.features
        // @ts-ignore
        ?.filter((a) => a.geometry)
        .map((d) => ({
          properties: { jsonString: JSON.stringify(d) },
          geometry: {
            // @ts-ignore
            ...d?.properties?.geometry,
            // @ts-ignore
            type: d?.properties?.geometry?.type || "Point",
          },
        }));

      const kml = tokml({ type: "FeatureCollection", features: newProperties });
      blob = new Blob([kml], { type: "application/kml" });
    } else {
      blob = new Blob([JSON.stringify(Props.onExportData)], {
        type: "application/json",
      });
    }

    saveAs(blob, `${caseName}.${format}`);
  };

  const downloadAsJson = () => {
    download("json");
  };
  const downloadAsKml = () => {
    download("kml");
  };

  const menuOptions = [
    {
      label: "GeoJSON",
      icon: <IconToolDownload />,
      isDivider: false,
      onClick: downloadAsJson,
    },
    {
      label: "KML",
      icon: <IconToolDownload />,
      isDivider: false,
      onClick: downloadAsKml,
    },
  ];

  return (
    <>
      <div
        className={cx(styles.mapControls, {
          [styles.opened]: !mapState.isCollapsedRightDrawer,
        })}
      >
        <IconFileExport
          className={cx(styles.control, commons.clickable)}
          style={{ height: 30, width: 31 }}
          onClick={toggleActionMenu}
        />

        {isActionMenuOpen && (
          <Options
            className={styles.MenuOptions}
            title="Export"
            setOpen={toggleActionMenu}
            list={menuOptions}
          />
        )}
      </div>
    </>
  );
};

export default MapControls;
