/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { GeoJSONSource, Layer, Map, MapRef, Source } from "react-map-gl";

import maplibregl from "maplibre-gl";

import HeadbarMapControls from "@/pages/Map/Headbar/Headbar";

import bbox from "@turf/bbox";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  MapState,
  selectMap,
  setActiveMenu,
  setCircleCenterCoord,
  setCircleRadiusInKm,
  setOnImportEntities,
  setSelectedEntities,
  toggleSelectedEntity,
  clearAuxiliaryHistogramHighlightedProperties as mapClearAuxiliaryHistogramHighlightedProperties,
  clearAuxiliaryHistogramHighlightedTypes as mapClearAuxiliaryHistogramHighlightedTypes,
  addEntities,
  setActiveCluster,
} from "@/store/map";
import {
  CircleMode,
  DirectMode,
  DragCircleMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import SearchBar from "@/pages/Map/Sidebar/SearchBar/SearchBar";
import mapboxgl, { FitBoundsOptions, LngLatBoundsLike } from "mapbox-gl";
import { selectCase } from "@/store/case";
import { handleEntityOrSummaryDrop } from "@/utils/drag-events";
import { preventDefault } from "@/utils/DOM";
import { getEntityTypeGroup } from "@/constants/entity-related";
import { selectOntologyConfig } from "@/store/ontology";
import { toast } from "react-toastify";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import { MAP_STYLE } from "@/constants/map";
import {
  highlightUnclusterpointLayer,
  unClusterPointLayer,
  pointLayer,
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
  selectedUnclusterpoint,
} from "../Layers/Clusterlayers";

import { heatmapLayer } from "../Layers/HeatmapLayers";
import HeatmapPanel from "../ControlPanel/HeatmapPanel";
import MapControls from "../MapControls/MapControls";
import { LineStringLayers, PointLayers } from "../Layers/LineString";
import GeocodageItemPanel from "../ControlPanel/Geocodage/GeocodageItemPanel";
import fileMapStyle from "./map-styles";
import createAnimatedLineLayers from "./animations/animated-line";
import convertToPNG from "../ControlPanel/ExportAsImage/exportAsImage";
import mapGeocoderApi from "../ControlPanel/Geocodage/GeocoderAPI";

// Heatmap filtre
function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter((feature) => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return { type: "FeatureCollection", features };
}

export default function MapService() {
  const mapState = useAppSelector<MapState>(selectMap);
  const caseCurrentState = useAppSelector(selectCase);
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapRef | null>(null);
  const containerMapGeocoderRef = useRef<HTMLDivElement>(null);
  const { ont } = useAppSelector(selectOntologyConfig);

  // Permet de Drag & Drop un objet nova sur la map
  const handleDropOnMap = (e) => {
    handleEntityOrSummaryDrop(e, (entities) => {
      const typeGroupProp = getEntityTypeGroup(entities, ont);
      if (typeGroupProp === "LINK") {
        toast.info(
          <>
            <p>L&apos;objet n&apos;est pas importable sur la carte.</p>
          </>
        );
      }
      let entitiesWithGeoCoord: EntityDto[] = [];
      entities.forEach((element) => {
        if (element.COORDONNEES_GEO && typeGroupProp !== "LINK") {
          const regex = /_/i;
          const validGeoEntityFormat = element.COORDONNEES_GEO.replace(
            regex,
            ","
          );
          const coords = validGeoEntityFormat.split(",");
          entitiesWithGeoCoord = [element].map((d) => ({
            ...d,
            geometry: {
              coordinates: [parseFloat(coords[1]), parseFloat(coords[0])],
              type: "Point",
            },
          }));
          dispatch(addEntities(entitiesWithGeoCoord));
        }
      });
    });
  };

  /**
   * Format the array of EntityDto to produce an object in geoJson format
   * @param entities Entities showed in the map
   * @returns Object that match the geoJson format to use in map
   */
  const formatMapData = (entities) => {
    if (!entities) {
      return null;
    }
    return {
      type: "FeatureCollection",
      features: entities.map((entity) => ({
        ...entity,
        geometry: { ...entity.geometry, type: "Point" },
        properties: {
          geometry: entity.geometry,
          id: entity.id,
          label: entity.TITRE,
          sex: entity.GENRE,
          type: entity._DATATYPE,
          // Set the id here because only the object properties is accessible on click on a marker
        },
        type: "Feature",
      })),
    };
  };
  // mapData correspond au main datas de la map
  const [mapData, setMapData] = useState(
    formatMapData(mapState.entities.filter((a) => !!a.geometry))
  );
  const [filtredMapData, setFiltredMapData] = useState(
    formatMapData(mapState.HighlightedEntities.filter((a) => !!a.geometry))
  );

  // Lors d'un click sur une pin, envoi des datas de celle-ci au store
  const handleSelect = (event: React.MouseEvent, pinID) => {
    if (!pinID.id) {
      return;
    }
    // Unselect all unless Ctrl clicking
    if (event.ctrlKey) {
      dispatch(toggleSelectedEntity(pinID.id));
    } else {
      dispatch(setSelectedEntities([pinID.id]));
    }
  };

  // Zoom
  const onZoom = () => {
    const currentMapZoom = mapRef.current?.getZoom();
    if (currentMapZoom != null) {
      mapRef.current?.zoomTo(currentMapZoom + 1, {
        duration: 1000,
      });
    }
  };
  const onDeZoom = () => {
    const currentMapZoom = mapRef.current?.getZoom();
    if (currentMapZoom != null) {
      mapRef.current?.zoomTo(currentMapZoom - 1, {
        duration: 1000,
      });
    }
  };

  // Permet d'enregistrer un screenshot de la map
  const saveMapAsImage = () => {
    convertToPNG(caseCurrentState);
  };

  // Permet de declusteriser le layers principal
  const onActiveCluster = () => {
    mapClearActiveSelection();
    mapState.activeCluster !== false
      ? dispatch(setActiveCluster(false))
      : dispatch(setActiveCluster(true));
  };

  // Recuperation du menu actif
  const activeMenuRef = useRef(mapState.activeMenu);
  useEffect(() => {
    activeMenuRef.current = mapState.activeMenu;
  }, [mapState.activeMenu]);

  // Utilisation du mode de dessin utilisé.
  const shapes: any = [
    { key: 1, value: "SimpleSelect", mode: "simple_select" },
    { key: 2, value: "DrawCircle", mode: "drag_circle" },
    { key: 3, value: "DrawPolygone", mode: "draw_polygon" },
    { key: 4, value: "Line", mode: "draw_line_string" },
  ];

  // Propriétés du dessin circle.
  const [draw] = useState(
    new MapboxDraw({
      defaultMode: shapes[0].mode,
      displayControlsDefault: false,
      userProperties: true,
      keybindings: true,
      controls: {
        trash: true,
      },
      clickBuffer: 10,
      touchBuffer: 10,
      modes: {
        ...MapboxDraw.modes,
        draw_circle: CircleMode,
        drag_circle: DragCircleMode,
        direct_select: DirectMode,
        simple_select: SimpleSelectMode,
      },
    })
  );

  // Initialisation du dessin.
  const [isInit, setIsInit] = useState(true);
  // Circle is draw
  let isDraw = false;
  // Switch du dessin sur la selection simple.
  const onSimpleSelect = (mode: string) => {
    if (!isInit && mode !== shapes[1].value) draw.changeMode(shapes[0].mode);
  };

  // Switch sur le dessin (MapboxDraw - circle).
  const onDraw = (mode: string) => {
    if (isInit) {
      mapRef.current?.addControl(draw);
      setIsInit(false);
    } else {
      draw.changeMode(shapes[0].mode);
    }
    if (mode === shapes[1].value) {
      draw.changeMode(shapes[1].mode);
    }
    if (mode === shapes[2].value) {
      draw.changeMode(shapes[2].mode);
    }
  };

  // Lors de la suppression d'une cercle on vient reset les datas.
  const onResetFeatures = () => {
    if (activeMenuRef.current === shapes[1].value) {
      draw.changeMode(shapes[1].mode);
    }
    dispatch(setCircleRadiusInKm(0));
    dispatch(setCircleCenterCoord([0.0, 0.0]));
  };

  // Suite à un evenement sur le circle on vient mettre a jour les valeurs.
  const onFeaturesUpdated = (features) => {
    let radiusCircle = features?.[0]?.properties.user_radiusInKm;
    let centerCircle = features?.[0]?.properties.user_center;

    if (!isDraw) {
      radiusCircle = features?.[0]?.properties.radiusInKm;
      centerCircle = features?.[0]?.properties.center;
    }
    if (features.length && activeMenuRef.current === shapes[1].value) {
      dispatch(setCircleRadiusInKm(radiusCircle.toFixed(3)));
      dispatch(
        setCircleCenterCoord(centerCircle.map((coord) => coord.toFixed(3)))
      );
    } else {
      onResetFeatures();
    }
  };

  // Lorsque la map (ReactMapboxGl) est load.
  const [cursor, setCursor] = useState<string>("");

  const mapClearActiveSelection = () => {
    dispatch(setSelectedEntities([]));
    dispatch(mapClearAuxiliaryHistogramHighlightedProperties());
    dispatch(mapClearAuxiliaryHistogramHighlightedTypes());
    const emptySelection = [];
    const map = null || mapRef.current?.getMap()!;
    const selectedUnclusteredPointLayer = "selected-unclustered-point";
    if (map.getLayer(selectedUnclusteredPointLayer)) {
      map.setFilter(selectedUnclusteredPointLayer, [
        "in",
        "id",
        ...emptySelection,
      ]);
    }
  };

  const selectedUnClusterLayer = "unclustered-point";
  const selectedDeclusterLayer = "unClusterPointLayer";

  const onMapLoaded = () => {
    mapClearActiveSelection();
    const notifyParent = (features) => onFeaturesUpdated(features);
    const map = null || mapRef.current?.getMap()!;

    const geocoder = new MaplibreGeocoder(mapGeocoderApi(), {
      showResultsWhileTyping: true,
      debounceSearch: 200,
      marker: false,
      maplibregl,
    });

    containerMapGeocoderRef.current?.appendChild(geocoder.onAdd(map));

    initAnimatedLines(map);

    mapRef.current?.on("click", "gl-draw-polygon-fill-inactive.cold", () => {
      isDraw = true;
      dispatch(setActiveMenu("DrawCircle"));
      const sourceFeatures = map.getSource("mapbox-gl-draw-cold");
      // @ts-ignore
      notifyParent(sourceFeatures?._data.features);
    });

    map.on("click", (e) => {
      const bboxLayer = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5],
      ];

      // @ts-ignore
      const selectedunClusterFeatures = map.queryRenderedFeatures(bboxLayer, {
        layers: [selectedUnClusterLayer],
      });

      // @ts-ignore
      const selectedDeclusterFeatures = map.queryRenderedFeatures(bboxLayer, {
        layers: [selectedDeclusterLayer],
      });

      if (
        selectedunClusterFeatures.length === 0 &&
        selectedDeclusterFeatures.length === 0 &&
        mapState.planeFlightCoord.length === 0
      ) {
        mapClearActiveSelection();
      }
    });

    map.on("click", selectedDeclusterLayer, (e) => {
      const pinID = e.features?.[0]?.properties;
      // @ts-ignore
      handleSelect(e.originalEvent, pinID);
    });

    map.on("click", selectedUnClusterLayer, (e) => {
      const pinID = e.features?.[0]?.properties;
      // @ts-ignore
      handleSelect(e.originalEvent, pinID);
    });

    // Mouse move
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseenter", selectedUnClusterLayer, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseenter", selectedDeclusterLayer, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    // Mouse leave
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseleave", selectedUnClusterLayer, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseleave", selectedDeclusterLayer, () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("draw.create", (e) => {
      isDraw = false;
      notifyParent(e.features);
    });
    map.on("draw.update", (e) => {
      isDraw = false;
      notifyParent(e.features);
    });
    map.on("draw.delete", (e) => {
      draw.trash();
      isDraw = false;
      notifyParent(e.features);
      onResetFeatures();
    });
  };

  // Animation d'un vol sur la map
  const initAnimatedLines = (mapRefOnLoad: mapboxgl.Map) => {
    const map = null || mapRef.current?.getMap()!;
    if (mapState.planeFlightCoord.length > 0) {
      mapState.planeFlightCoord.forEach((item) => {
        const formatedPlaneFlights = formatMapData([item.entity]);
        createAnimatedLineLayers(mapRefOnLoad, item);

        const pointID = `${item.id}_point`;

        map.on("click", pointID, (e) => {
          const pinID = formatedPlaneFlights?.features?.[0]?.properties;
          // @ts-ignore
          handleSelect(e.originalEvent, pinID);
        });

        // Mouse move
        map.on("mousemove", pointID, () => {
          setCursor("pointer");
        });

        // Mouse leave
        map.on("mouseleave", pointID, () => {
          setCursor("");
        });
      });
    }
  };

  // Heatmap filtre
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);

  // Recuperation des données
  useEffect(() => {
    /* global fetch */
    fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
      .then((resp) => resp.json())
      .then((json) => {
        const { features } = json;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        setEarthQuakes(json);
        selectTime(endTime);
      })
      .catch((err) => console.error("Could not load data", err)); // eslint-disable-line
  }, []);

  const data = useMemo(
    () =>
      allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime),
    [earthquakes, allDays, selectedTime]
  );

  // Clustering
  const onClick = (event) => {
    if (!event.features[0]) {
      return;
    }
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;
    const clusterNameId = feature.layer.source;

    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      const bounds: LngLatBoundsLike = [
        [minLng, minLat],
        [maxLng, maxLat],
      ];
      const options: FitBoundsOptions = { padding: 40, duration: 1000 };
      mapRef.current?.fitBounds(bounds, options);
    }

    const mapboxSource = mapRef.current?.getSource(
      clusterNameId
    ) as GeoJSONSource;

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      mapRef.current?.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      });
    });
  };

  // Effets lors de l'activation d'un KML
  useEffect(() => {
    let varLayerID = "";
    const map = null || mapRef.current?.getMap()!;
    if (mapState.onImportEntities === true) {
      const selectedIdAsMap = mapState.selectedKMLEntities.reduce(
        (acc, { id }) => {
          // @ts-ignore
          acc[id] = true;
          return acc;
        },
        {}
      );

      const latArr = [];
      const lngArr = [];

      mapState.selectedKMLEntities.forEach((el) => {
        // @ts-ignore
        let getKmlPoints = el?.features.filter(
          (features) => features.geometry?.type === "LineString"
        );
        if (getKmlPoints.length === 0) {
          // @ts-ignore
          getKmlPoints = el?.features.filter(
            (features) => features.geometry?.type === "Point"
          );
        }
        getKmlPoints.forEach((el) => {
          el.geometry?.coordinates.forEach((coords: [], i) => {
            if (Array.isArray(coords)) {
              // multiple coordinates
              // @ts-ignore
              latArr.push(coords[0]);
              // @ts-ignore
              lngArr.push(coords[1]);
            } else {
              // single point
              if (i === 0) {
                latArr.push(coords);
              }
              if (i === 1) {
                lngArr.push(coords);
              }
            }
          });
        });

        const minLat = Math.min(...latArr);
        const maxLat = Math.max(...latArr);
        const minLng = Math.min(...lngArr);
        const maxLng = Math.max(...lngArr);

        // @ts-ignore
        if (getKmlPoints.length && selectedIdAsMap[el.id]) {
          mapRef.current?.fitBounds(
            [
              [minLat, minLng],
              [maxLat, maxLng],
            ],
            {
              duration: 2500,
            }
          );
        } else {
          mapRef.current?.fitBounds(
            [
              [-180, -90],
              [180, 90],
            ],
            {
              duration: 2500,
            }
          );
        }
      });

      mapState.kmlEntities.forEach((el) => {
        if (
          selectedIdAsMap[el.id] &&
          !map.getLayer(el.id) &&
          !map.getSource(el.id)
        ) {
          map.addSource(`${el.id}lineLayers`, { type: "geojson", data: el });
          map.addLayer({
            ...LineStringLayers,
            id: `${el.id}lineLayers`,
            // @ts-ignore
            source: `${el.id}lineLayers`,
          });
          map.addSource(el.id, { type: "geojson", data: el });
          map.addLayer({
            ...PointLayers,
            id: el.id,
            // @ts-ignore
            source: el.id,
          });
          varLayerID = el.id;
        } else if (!selectedIdAsMap[el.id]) {
          if (map.getLayer(el.id)) {
            map.removeLayer(el.id);
          }
          if (map.getSource(el.id)) {
            map.removeSource(el.id);
          }
          if (map.getLayer(`${el.id}lineLayers`)) {
            map.removeLayer(`${el.id}lineLayers`);
          }
          if (map.getSource(`${el.id}lineLayers`)) {
            map.removeSource(`${el.id}lineLayers`);
          }
        }
      });
      dispatch(setOnImportEntities(false));
    }

    mapRef.current?.on("click", varLayerID, (e) => {
      const { lat } = e.lngLat;
      const { lng } = e.lngLat;
      const coordinates: [number, number] = [lng, lat];
      const description = e.features?.[0]?.properties?.description;
      const location = e.features?.[0]?.properties?.LOCATION;
      const name = e.features?.[0]?.properties?.label;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description || location || name || "No data")
        // @ts-ignore
        .addTo(map);
    });
    // Mouse move
    mapRef.current?.on("mousemove", varLayerID, () => {
      setCursor("pointer");
    });

    // Mouse leave
    mapRef.current?.on("mouseleave", varLayerID, () => {
      setCursor("");
    });
  }, [mapState.selectedKMLEntities]);

  // Effets lors d'une selection de pin
  useEffect(() => {
    const map = null || mapRef.current?.getMap()!;

    if (mapState.selection.length > 0 && mapRef.current?.getMap()) {
      map.setFilter("selected-unclustered-point", [
        "in",
        "id",
        ...mapState.selection,
      ]);
    }
  }, [mapState.selection]);

  // Effets lors de l'ajout d'un objet / entité sur la map
  useEffect(() => {
    setMapData(formatMapData(mapState.entities.filter((a) => !!a.geometry)));
  }, [mapState.entities]);

  // Effets lors d'un highlight d'une pin
  useEffect(() => {
    if (mapState.HighlightedEntities.length > 0) {
      setFiltredMapData(
        formatMapData(mapState.HighlightedEntities.filter((a) => !!a.geometry))
      );
    }
    if (mapState.HighlightedEntities.length === 0) {
      setFiltredMapData(formatMapData(null));
    }
  }, [mapState.HighlightedEntities]);
  return (
    <>
      {!mapState.isLessMapComponent ? (
        <HeadbarMapControls
          onSimpleSelect={() => onSimpleSelect("SimpleSelect")}
          onDrawCircle={() => onDraw("DrawCircle")}
          onDrawPolygone={() => onDraw("DrawPolygone")}
          onFilter={() => onSimpleSelect("SimpleSelect")}
          onZoom={onZoom}
          onDeZoom={onDeZoom}
          onCapture={saveMapAsImage}
          onActiveCluster={onActiveCluster}
        />
      ) : (
        ""
      )}

      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "transparent",
        }}
        onDragEnter={preventDefault}
        onDragOver={preventDefault}
        onDrop={handleDropOnMap}
      >
        <Map
          mapLib={maplibregl}
          initialViewState={{
            latitude: 36.263211978897246,
            longitude: 4.026266031356033,
            zoom: 2,
          }}
          mapStyle={MAP_STYLE}
          // @ts-ignore
          interactiveLayerIds={[clusterLayer.id]}
          onClick={onClick}
          ref={mapRef}
          onLoad={onMapLoaded}
          cursor={cursor}
          preserveDrawingBuffer
        >
          {mapState.onImportEntitiesWithoutGeo ? <GeocodageItemPanel /> : ""}

          {/* heatmap Layer */}
          {mapState.activeHeatmap
            ? data && (
                // @ts-ignore
                <Source type="geojson" data={data}>
                  <Layer {...heatmapLayer} />
                </Source>
              )
            : " "}

          {/* Pin de selection bleu */}
          {mapState.selection.length > 0 ? (
            <Source
              type="geojson"
              id="unClusterDatas"
              // @ts-ignore
              data={mapData}
              cluster
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...selectedUnclusterpoint} />
            </Source>
          ) : (
            " "
          )}

          {/* Pin déclusterisé */}
          {mapState.activeCluster ? (
            // @ts-ignore
            <Source type="geojson" id="unClusterDatas" data={mapData}>
              <Layer {...unClusterPointLayer} />
            </Source>
          ) : (
            " "
          )}

          {/* Pin highlight */}
          {mapState.activeCluster && mapState.HighlightedEntities.length > 0 ? (
            // @ts-ignore
            <Source type="geojson" data={filtredMapData}>
              <Layer {...highlightUnclusterpointLayer} />
            </Source>
          ) : (
            " "
          )}

          {/* { Clustering data */}
          {mapState.activeCluster ? (
            " "
          ) : (
            <Source
              id="datas"
              type="geojson"
              // @ts-ignore
              data={mapData}
              generateId
              cluster
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>
          )}

          {!mapState.activeCluster &&
          mapState.HighlightedEntities.length > 0 ? (
            <Source
              type="geojson"
              // @ts-ignore
              data={filtredMapData}
              cluster
              clusterMaxZoom={14}
              clusterRadius={50}
            >
              <Layer {...pointLayer} />
            </Source>
          ) : (
            ""
          )}

          {!mapState.isLessMapComponent ? (
            // @ts-ignore
            <SearchBar containerMapGeocoder={containerMapGeocoderRef} />
          ) : (
            ""
          )}
          <style>{fileMapStyle()}</style>

          {!mapState.isLessMapComponent ? (
            <HeatmapPanel
              startTime={timeRange[0]}
              endTime={timeRange[1]}
              selectedTime={selectedTime}
              allDays={allDays}
              onChangeTime={selectTime}
              onChangeAllDays={useAllDays}
            />
          ) : (
            ""
          )}
        </Map>
      </div>
      {!mapState.isLessMapComponent ? (
        // @ts-ignore
        <MapControls onExportData={mapData} />
      ) : (
        ""
      )}
    </>
  );
}

export function renderToDom(container) {
  render(<MapService />, container);
}
