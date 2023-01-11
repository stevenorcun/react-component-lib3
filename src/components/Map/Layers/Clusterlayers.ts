import type { LayerProps } from 'react-map-gl';

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'datas',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'datas',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'datas',
  interactive: true,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      '#3083F7',
      '#DE876C',
    ],
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': 'black',
  },
};

export const unClusterPointLayer: LayerProps = {
  id: 'unClusterPointLayer',
  source: 'unClusterDatas',
  type: 'circle',
  paint: {
    'circle-stroke-color': 'black',
    'circle-stroke-width': 1,
    'circle-radius': 8,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      '#3083F7',
      '#DE876C',
    ],
  },
};

export const pointLayer: LayerProps = {
  id: 'highlight-unclustered-point',
  source: 'datas',
  type: 'circle',
  interactive: true,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-stroke-color': 'black',
    'circle-stroke-width': 1,
    'circle-radius': 8,
    'circle-color': '#FFFF33',
  },
};

export const highlightUnclusterpointLayer: LayerProps = {
  id: 'highlightUnclusterpointLayer',
  source: 'unClusterDatas',
  type: 'circle',
  interactive: true,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-stroke-color': 'black',
    'circle-stroke-width': 1,
    'circle-radius': 8,
    'circle-color': '#FFFF33',
  },
};

export const selectedUnclusterpoint : LayerProps = {
  id: 'selected-unclustered-point',
  type: 'circle',
  source: 'datas',
  interactive: true,
  filter: ['in', 'FIPS', ''],
  paint: {
    'circle-color': '#3083F7',
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': 'black',
  },
};
