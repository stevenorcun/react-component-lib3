/* eslint-disable import/prefer-default-export */
import type { LayerProps } from 'react-map-gl';

export const LineStringLayers : LayerProps = {
  id: 'lineString',
  type: 'line',
  source: 'route',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#E76447',
    'line-width': 3,
  },
};

export const PointLayers : LayerProps = {
  id: 'point',
  type: 'circle',
  source: 'point',
  paint: {
    'circle-stroke-color': 'black',
    'circle-stroke-width': 1,
    'circle-radius': 6,
    'circle-color': '#3083F7',
  },
};
