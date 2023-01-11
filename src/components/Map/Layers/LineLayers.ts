import type { LayerProps } from 'react-map-gl';

export const LineLayers: LayerProps = {
  id: 'line-animation',
  type: 'line',
  source: 'kml',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#888',
    'line-width': 3,
  },
};

export const CircleLayers: LayerProps = {
  id: 'point-kml',
  type: 'circle',
  source: 'kml',
  paint: {
    'circle-radius': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      [
        'interpolate',
        ['linear'],
        ['get', 'var'],
        1,
        8,
      ],
      6,
    ],
    'circle-stroke-color': '#888',
    'circle-stroke-width': 1,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      [
        'interpolate',
        ['linear'],
        ['get', 'var'],
        1,
        '#fff7ec',
      ],
      '#00ff62',
    ],
  },
  filter: ['==', '$type', 'Point'],
};
