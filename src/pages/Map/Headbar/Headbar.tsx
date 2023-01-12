import React from "react";

import cx from "classnames";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import SvgIconMap from "../../../assets/images/icons/Map/IconMap";
import SvgIconRayon from "../../../assets/images/icons/Map/IconRayon";
import SvgIconPolygone from "../../../assets/images/icons/Map/IconPolygone";
import SvgIconSelect from "../../../assets/images/icons/Map/IconSelect";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectMap, setActiveMenu } from "../../../store/map";
import IconZoom from "../../../assets/images/icons/IconZoom";
import SvgIconDezoom from "../../../assets/images/icons/IconDezoom";
import IconChevronGauche from "../../../assets/images/icons/Map/IconChevronGauche";
import IconChevronDroite from "../../../assets/images/icons/Map/IconChevronDroite";
import IconItineraire from "../../../assets/images/icons/Map/IconItineraire";
import IconHistorique from "../../../assets/images/icons/Map/IconHistorique";
import IconDiagonalArrow from "../../../assets/images/icons/Map/IconDiagonalArrow";
import IconLigne from "../../../assets/images/icons/Map/IconLigne";
import IconLayer from "../../../assets/images/icons/Map/IconLayer";
import IconMedia from "../../../assets/images/icons/Map/IconMedia";
import IconCamera from "../../../assets/images/icons/Map/IconCamera";
import IconText from "../../../assets/images/icons/Map/IconText";
import IconCluster from "../../../assets/images/icons/Map/IconCluster";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import Filters from "../Sidebar/Filters/Filters";
import styles from "./styles.scss";

interface ControlsProps {
  onDrawCircle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDrawPolygone: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSimpleSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFilter: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onZoom: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDeZoom: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCapture: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onActiveCluster: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Headbar = (Props: ControlsProps) => {
  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const onActiveMenuEdit = () => {
    dispatch(setActiveMenu("DrawCircle"));
  };
  const onActiveMenuFilter = () => {
    mapState.activeMenu !== "Filters"
      ? dispatch(setActiveMenu("Filters"))
      : dispatch(setActiveMenu(""));
  };
  const onActiveMenuPolygone = () => {
    dispatch(setActiveMenu("DrawPolygone"));
  };
  const onActiveMenuSelect = () => {
    dispatch(setActiveMenu("SimpleSelect"));
  };

  return (
    <>
      <div className={styles.headbar}>
        <div
          className={styles.headbar_icon_container_select}
          style={{ marginLeft: "2%" }}
        >
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Precedent",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconChevronGauche
              isSelected={mapState.activeMenu === "Precedent"}
            />
          </button>
          <span className={styles.headbar_icon_text}>Précédent</span>
        </div>

        <div className={styles.headbar_icon_container_select}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Suivant",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconChevronDroite isSelected={mapState.activeMenu === "Suivant"} />
          </button>
          <span className={styles.headbar_icon_text}>Suivant</span>
        </div>

        <div
          className={styles.headbar_icon_container_select}
          style={{ marginLeft: "5%" }}
        >
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "SimpleSelect",
            })}
            onClick={(e) => {
              onActiveMenuSelect();
              Props.onSimpleSelect(e);
            }}
          >
            <SvgIconSelect
              isSelected={mapState.activeMenu === "SimpleSelect"}
            />
          </button>
          <span className={styles.headbar_icon_text}>Sélectionner</span>
        </div>

        <div className={styles.headbar_icon_container_select}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "zomm+",
            })}
            onClick={(e) => {
              Props.onZoom(e);
            }}
          >
            <IconZoom fill="#4D5056" width="25px" />
          </button>
          <span className={styles.headbar_icon_text}>Zoom +</span>
        </div>

        <div className={styles.headbar_icon_container_select}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "zoom-",
            })}
            onClick={(e) => {
              Props.onDeZoom(e);
            }}
          >
            <SvgIconDezoom fill="#4D5056" width="25px" />
          </button>
          <span className={styles.headbar_icon_text}>Zoom -</span>
        </div>

        <div className={styles.headbar_icon_container_select}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "cluster",
            })}
            onClick={(e) => {
              Props.onActiveCluster(e);
            }}
          >
            <IconCluster isSelected={mapState.activeCluster === false} />
          </button>
          <span className={styles.headbar_icon_text}>Cluster</span>
        </div>

        <div
          className={styles.headbar_icon_container_draw}
          style={{ marginLeft: "5%" }}
        >
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "DrawPolygone",
            })}
            onClick={(e) => {
              onActiveMenuPolygone();
              Props.onDrawPolygone(e);
              toast.info("En cours de développement, Dessin uniquement.");
            }}
          >
            <SvgIconPolygone
              isSelected={mapState.activeMenu === "DrawPolygone"}
            />
          </button>
          <span className={styles.headbar_icon_text}>Polygone</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "DrawCircle",
            })}
            onClick={(e) => {
              onActiveMenuEdit();
              Props.onDrawCircle(e);
              toast.info("En cours de développement, Dessin uniquement.");
            }}
          >
            <SvgIconRayon isSelected={mapState.activeMenu === "DrawCircle"} />
          </button>
          <span className={styles.headbar_icon_text}>Rayon</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Itineraite",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconItineraire isSelected={mapState.activeMenu === "Itineraite"} />
          </button>
          <span className={styles.headbar_icon_text}>Itinéraire</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Recent",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconHistorique isSelected={mapState.activeMenu === "Recent"} />
          </button>
          <span className={styles.headbar_icon_text}>Récent</span>
        </div>

        <div
          className={styles.headbar_icon_container_draw}
          style={{ marginLeft: "5%" }}
        >
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Fleche",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconDiagonalArrow isSelected={mapState.activeMenu === "Fleche"} />
          </button>
          <span className={styles.headbar_icon_text}>Flèche</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Chemin",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconLigne isSelected={mapState.activeMenu === "Chemin"} />
          </button>
          <span className={styles.headbar_icon_text}>Chemin</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Forme",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconLayer isSelected={mapState.activeMenu === "Forme"} />
          </button>
          <span className={styles.headbar_icon_text}>Forme</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Text",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconText isSelected={mapState.activeMenu === "Text"} />
          </button>
          <span className={styles.headbar_icon_text}>Texte</span>
        </div>

        <div className={styles.headbar_icon_container_draw}>
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Image",
            })}
            onClick={(e) => {
              toast.info("En cours de développement.");
            }}
          >
            <IconMedia isSelected={mapState.activeMenu === "Image"} />
          </button>
          <span className={styles.headbar_icon_text}>Image</span>
        </div>

        <div
          className={styles.headbar_icon_container_draw}
          style={{ marginLeft: "5%" }}
        >
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Capture",
            })}
            onClick={(e) => {
              Props.onCapture(e);
            }}
          >
            <IconCamera
              fill="#4D5056"
              isSelected={mapState.activeMenu === "Capture"}
            />
          </button>
          <span className={styles.headbar_icon_text}>Capture</span>
        </div>

        <div
          className={styles.headbar_icon_container_draw}
          style={{ marginLeft: "5%" }}
        >
          <button
            type="button"
            className={cx(styles.sideItem, commons.clickable, {
              [styles.active]: mapState.activeMenu === "Filters",
            })}
            onClick={(e) => {
              onActiveMenuFilter();
              Props.onFilter(e);
            }}
          >
            <SvgIconMap isSelected={mapState.activeMenu === "Filters"} />
          </button>
          <span className={styles.headbar_icon_text}>Filtre</span>
        </div>
      </div>

      {mapState.activeMenu === "Filters" && <Filters />}
      {mapState.activeMenu === "DrawCircle" && <Sidebar />}
    </>
  );
};

export default Headbar;
