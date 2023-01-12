import * as React from "react";
/* eslint-disable global-require */
import { useAppDispatch } from "../../../../store/hooks";
import { setKmlEntity } from "../../../../store/map";
import cx from "classnames";
import IconOpenFile from "../../../../assets/images/icons/Map/IconOpenFile";
import IconImportFile from "../../../../assets/images/icons/Map/IconImportFile";
import IconLayersColor from "../../../../assets/images/icons/Map/IconLayersColor";
import SvgIconSelect from "../../../../assets/images/icons/Map/IconSelect";
import IconFX from "../../../../assets/images/icons/Map/IconFX";

import { toast } from "react-toastify";
import styles from "./styles.scss";

function LayersToolbar() {
  const dispatch = useAppDispatch();

  const OnInputChange = (e) => {
    e.preventDefault();

    const { files } = e.target;
    if (!files?.length) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;

      // Convert KML to GeoJSON
      const converter = require("@tmcw/togeojson");
      const { DOMParser } = require("xmldom");

      // read in our KML file and then parse it
      const parsedKML = new DOMParser().parseFromString(text);
      // convert our kml to geojson and store the results
      const result = converter.kml(parsedKML);
      const filename = e.target.files[0].name;
      const updatedFeatures = result?.features.map((feature) => {
        const f = feature;
        if (feature.properties?.jsonString) {
          try {
            f.properties = {
              ...f.properties,
              ...JSON.parse(feature.properties?.jsonString),
            };
          } catch (e) {
            console.error(e);
          }
        }
        return f;
      });

      dispatch(
        setKmlEntity({ ...result, features: updatedFeatures, filename })
      );
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div className={styles.containers}>
      <div className={styles.layers_icon_container_select}>
        <label htmlFor="openFile">
          <div className={cx(styles.btnStyle)}>
            <IconOpenFile />
          </div>
          <input
            type="file"
            onChange={OnInputChange}
            id="openFile"
            accept=".kml"
          />
        </label>
        <span className={styles.layers_icon_text} style={{ marginLeft: "20%" }}>
          Ouvrir
        </span>
      </div>

      <div className={styles.layers_icon_container_select}>
        <button
          type="button"
          className={cx(styles.btnStyle)}
          onClick={(e) => {
            toast.info("En cours de développement.");
          }}
        >
          <IconImportFile />
        </button>
        <span className={styles.layers_icon_text}>Sources</span>
      </div>

      <div className={styles.layers_icon_container_select}>
        <button
          type="button"
          className={cx(styles.btnStyle)}
          onClick={(e) => {
            toast.info("En cours de développement.");
          }}
        >
          <IconLayersColor />
        </button>
        <span className={styles.layers_icon_text}>Couleur</span>
      </div>

      <div className={styles.layers_icon_container_select}>
        <button
          type="button"
          className={cx(styles.btnStyle)}
          onClick={(e) => {
            toast.info("En cours de développement.");
          }}
        >
          <SvgIconSelect />
        </button>
        <span className={styles.layers_icon_text} style={{ marginLeft: "0%" }}>
          Selectionner
        </span>
      </div>

      <div className={styles.layers_icon_container_select}>
        <button
          type="button"
          className={cx(styles.btnStyle)}
          onClick={(e) => {
            toast.info("En cours de développement.");
          }}
        >
          <IconFX />
        </button>
        <span className={styles.layers_icon_text}>Deriver</span>
      </div>

      <hr style={{ marginTop: "10%" }} />
    </div>
  );
}

export default React.memo(LayersToolbar);
