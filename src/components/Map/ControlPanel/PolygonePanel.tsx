import * as React from 'react';
import area from '@turf/area';
import styles from '../MapServices/clustering_styles.scss';

function PolygonePanel(props) {
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
  }

  return (
    <div className={styles['control-panel-polygone']}>
      <div className={styles.head_container}>
        <h3 style={{ color: 'white', marginLeft: '40%' }}>Surface</h3>
      </div>
      {polygonArea > 0 && (
        <p style={{ textAlign: 'center' }}>
          {Math.round(polygonArea * 100) / 100}
          {' '}
          <br />
          mètres carrés
        </p>
      )}

    </div>
  );
}

export default React.memo(PolygonePanel);
