/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */

import * as turf from "@turf/turf";
import { Position } from "@turf/turf";

const createAnimatedLineLayers = (
  map: mapboxgl.Map,
  el
): Function | undefined => {
  const pointID = `${el.id}_point`;
  const pathID = `${el.id}_path`;

  const steps = 350;

  if (!map.getLayer(el.id) && !map.getSource(el.id)) {
    const [origin, destination] = el.coordinates;

    const planePath: GeoJSON.Feature = turf.greatCircle(origin, destination);
    const arc: Position[] = [];

    const planePoint: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: origin,
      },
    };

    const lineDistance = turf.length(planePath);
    // @ts-ignore
    const line = turf.lineString(planePath.geometry.coordinates);
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(line, i, { units: "miles" });
      arc.push(segment.geometry.coordinates);
    }

    map.addSource(pathID, { type: "geojson", data: planePath });
    map.addSource(pointID, { type: "geojson", data: planePoint });

    map.addLayer({
      id: pathID,
      source: pathID,
      type: "line",
      paint: {
        "line-width": 2,
        "line-color": "#007cbf",
        "line-dasharray": [2, 1],
      },
    });

    map.addLayer({
      id: pointID,
      source: pointID,
      type: "symbol",
      layout: {
        "icon-image": "airport_15",
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });

    const animate = (counter) => {
      // @ts-ignore
      planePoint.geometry.coordinates = planePath.geometry.coordinates[counter];

      // Calcule le bearing pour s'assurer que l'icône est tournée pour correspondre à l'arc de la route
      // Le bearing est calculé entre le point courant et le point suivant, sauf
      // à la fin de l'arc, qui utilise le point précédent et le point courant
      // @ts-ignore
      if (planePoint.properties && planePath.geometry.coordinates) {
        // @ts-ignore
        const p1 = planePath.geometry.coordinates[
          counter >= steps ? counter - 1 : counter
        ] as Position;
        // @ts-ignore
        const p2 = planePath.geometry.coordinates[
          counter >= steps ? counter : counter + 1
        ] as Position;
        if (!p1 || !p2) {
          return;
        }
        planePoint.properties.bearing = turf.bearing(
          turf.point(p1),
          turf.point(p2)
        );
      }

      // Mettre à jour la source avec ces nouvelles données
      const source = map.getSource(pointID) as mapboxgl.GeoJSONSource;
      source.setData(planePoint);

      // Demander la prochaine image d'animation tant que la fin n'a pas été atteinte
      if (counter < steps) {
        requestAnimationFrame(() => {
          animate(counter + 1);
        });
      }
    };

    map.on("click", pointID, () => {
      animate(0);
    });

    return animate;
  }
};

export default createAnimatedLineLayers;
