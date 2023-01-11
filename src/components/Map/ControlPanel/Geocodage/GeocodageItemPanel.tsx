/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/button-has-type */
/* eslint-disable linebreak-style */
// @ts-nocheck
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import SvgIconCross from "@/assets/images/icons/IconCross";
import IconPin from "@/assets/images/icons/Map/IconPin";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addEntities,
  MapState,
  selectMap,
  setOnImportEntitiesWithoutGeo,
} from "@/store/map";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Map, MapRef } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { MAP_STYLE } from "@/constants/map";
import styles from "./styles.scss";
import { unclusteredPointLayer } from "../../Layers/Clusterlayers";

const formatMapData = (entities) => {
  if (!entities) {
    return null;
  }
  return {
    type: "FeatureCollection",
    features: entities.map((entity) => ({
      type: "Feature",
      geometry: { ...entity.geometry, type: "Point" },
    })),
  };
};

const GeocodageItemPanel = () => {
  const dispatch = useAppDispatch();
  const mapState = useAppSelector<MapState>(selectMap);
  const mapRef = useRef<MapRef | null>(null);

  const [mapData, setMapData] = useState();
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [step, setStep] = useState(0);
  let invalidLat: boolean = false;
  let invalidLong: boolean = false;

  const getLatitudeValue = (e) => {
    const latitude: number = e.target.value;
    setLat(latitude);
  };
  const getLongitudeValue = (e) => {
    const longitude: number = e.target.value;
    setLng(longitude);
  };

  const onSubmit = () => {
    (
      document.getElementById("fildsContainer") as HTMLInputElement
    ).scrollTop = 0;
    if (
      step === mapState.validTypeEntities.length - 1 &&
      invalidLong &&
      invalidLat
    ) {
      dispatch(setOnImportEntitiesWithoutGeo(false));
    }

    const regLatExp =
      /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    const regLngExp =
      /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;

    invalidLat = regLatExp.test(lat);
    invalidLong = regLngExp.test(lng);

    if (invalidLong && invalidLat) {
      const validTypeEntities = mapState.validTypeEntities[step];
      const finalValidTypeEntities: EntityDto[] = [validTypeEntities].map(
        (d) => ({ ...d, geometry: { coordinates: [lng, lat], type: "Point" } })
      );

      toast.info(
        <>
          <p>
            L'objet{" "}
            <b>
              {mapState.validTypeEntities[step].TITRE ||
                mapState.validTypeEntities[step].label}
            </b>{" "}
            a été importé en{" "}
            <b>
              [{lng},{lat}]
            </b>
            .
          </p>
        </>
      );
      dispatch(addEntities(finalValidTypeEntities));
      setLat(undefined);
      setLng(undefined);

      if (step !== mapState.validTypeEntities.length - 1) {
        (document.getElementById("Latitude") as HTMLInputElement).value = "";
        (document.getElementById("Longitude") as HTMLInputElement).value = "";
        setStep(step + 1);
      } else {
        dispatch(setOnImportEntitiesWithoutGeo(false));
      }
    }
    if (!invalidLat) {
      toast.warn(
        <>
          <p>La latitude doit être comprise entre -90 et 90 degrés inclus.</p>
        </>
      );
    }
    if (!invalidLong) {
      toast.warning(
        <>
          <p>
            La longitude doit être comprise entre -180 et 180 degrés inclus.
          </p>
        </>
      );
    }
  };

  const onCancel = () => {
    (
      document.getElementById("fildsContainer") as HTMLInputElement
    ).scrollTop = 0;
    const cancelToast = () => {
      toast.warning(
        <>
          <p>
            L'objet{" "}
            <b>
              {mapState.validTypeEntities[step].TITRE ||
                mapState.validTypeEntities[step].label}
            </b>{" "}
            n'a pas été importé.
          </p>
        </>
      );
    };

    if (step === mapState.validTypeEntities.length - 1) {
      dispatch(setOnImportEntitiesWithoutGeo(false));
      cancelToast();
    } else {
      setStep(step + 1);
      cancelToast();
    }
  };

  const onLeave = () => {
    dispatch(setOnImportEntitiesWithoutGeo(false));
  };

  const fieldGroups = [
    <div className={styles.inputs_container}>
      <div className={styles.value_preview}>
        <label className={styles.label_preview}>Valeur sélectionnée :</label>
        <label className={styles.label_preview_value}>
          <b>
            {mapState.validTypeEntities[step].TITRE ||
              mapState.validTypeEntities[step].label}
          </b>
        </label>
      </div>
      <label className={styles.sub_label}>
        Précisez les coordonnées de localisation :
      </label>

      <div className={styles.input_section}>
        <label className={styles.label_input_geometry}>Latitude</label>
        <input
          className={styles.input_geometry}
          id="Latitude"
          min="-90"
          max="90"
          placeholder="Latitude"
          name="Latitude"
          onChange={getLatitudeValue}
        />
      </div>

      <div className={styles.input2_section}>
        <label className={styles.label_input_geometry}>Longitude</label>
        <input
          className={styles.input_geometry}
          id="Longitude"
          min="-180"
          max="180"
          placeholder="Longitude"
          name="Longitude"
          onChange={getLongitudeValue}
        />
      </div>

      <div className={styles.input3_section}>
        <label className={styles.label_input_geometry}>Altitude</label>
        <input
          className={styles.input_geometry_altitude}
          id="Latitude"
          min="-90"
          max="90"
          placeholder="Altitude"
          disabled
          name="Latitude"
          onChange={getLatitudeValue}
        />
      </div>
    </div>,
  ];

  useEffect(() => {
    if (lat && lng) {
      const validTypeEntities = mapState.validTypeEntities[step];
      const finalValidTypeEntities: EntityDto[] = [validTypeEntities].map(
        (d) => ({
          ...d,
          geometry: { coordinates: [Number(lng), Number(lat)], type: "Point" },
        })
      );
      setMapData(formatMapData(finalValidTypeEntities));
    }
  }, [lat, lng]);

  useEffect(() => {
    const map = null || mapRef.current?.getMap()!;
    if (mapData) {
      const previewDataLayer = "previewData";

      if (map.getLayer(previewDataLayer)) {
        map.removeLayer(previewDataLayer);
      }
      if (map.getSource(previewDataLayer)) {
        map.removeSource(previewDataLayer);
      }
      map.addSource(previewDataLayer, { type: "geojson", data: mapData });
      map.addLayer({
        ...unclusteredPointLayer,
        id: previewDataLayer,
        source: previewDataLayer,
      });
    }
  }, [mapData]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.head_container}>
          <IconPin className={styles.worldSearchIcon} />
          <label className={styles.head_label}>
            Géocodage d’un objet &nbsp; ({step + 1}/
            {mapState.validTypeEntities.length})
          </label>
          <button className={styles.iconEditDiv} onClick={onLeave}>
            <SvgIconCross fill="#fff" className={styles.iconEditIcon} />
          </button>
        </div>
        <div id="fildsContainer" className={styles.scrollbar}>
          {fieldGroups[0]}

          <br />
          <hr className={styles.horizontalBar} />
          <label
            style={{ textAlign: "center", marginLeft: "0%" }}
            className={styles.label_input_geometry}
          >
            Aperçu
          </label>

          <div className={styles.mapPreview}>
            <Map
              initialViewState={{
                latitude: 36.263211978897246,
                longitude: 4.026266031356033,
                zoom: 0,
              }}
              mapStyle={MAP_STYLE}
              ref={mapRef}
              mapLib={maplibregl}
            />
          </div>

          <div className={styles.button_container}>
            <button onClick={onCancel} className={styles.cancel_button}>
              Annuler
            </button>
            <button onClick={onSubmit} className={styles.submit_button}>
              Enregistrer le géocodage
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeocodageItemPanel;
