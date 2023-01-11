import React, { useState } from 'react';

import { ENTITY_TYPE_DETAILS } from '@/constants/entity-related';
import FeaturesMultimediaFiles from '../FeaturesMultimediaFiles';

import IconCloseCross from '@/assets/images/icons/IconCross';

import styles from './fullScreenMultimediaFile.scss';

const FullScreenMultimediaFile = ({
  setIsDisplaySelectPicture,
  isDisplaySelectPicture,
  selectPicture,
}: any) => {
  const [zoomPicture, setZoomPicture] = useState(1);
  const [transition, setTransition] = useState(false);
  const [rotationPicture, setRotationPicture] = useState(0);

  const addRotation = () => {
    setTransition(true);
    setRotationPicture(rotationPicture + 90);
  };

  const lessRotation = () => {
    setTransition(true);
    setRotationPicture(rotationPicture - 90);
  };

  const addZoom = () => {
    setZoomPicture(zoomPicture + 0.2);
  };

  const lessZoom = () => {
    if (zoomPicture >= 0.3) {
      setZoomPicture(zoomPicture - 0.2);
    }
  };
  return (
    <div className={styles.fullScreen}>
      <button
        type="button"
        style={{ position: 'absolute', right: 20, top: 20 }}
        onClick={() => setIsDisplaySelectPicture(!isDisplaySelectPicture)}
      >
        <IconCloseCross transform="scale(3)" fill="white" />
      </button>
      {ENTITY_TYPE_DETAILS[selectPicture.value.type].label === 'Photo' && (
        <img
          src={selectPicture.value.path}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            transition: `${transition ? '.5s' : 0}`,
            borderRadius: '8px',
            transform: `rotate(${rotationPicture}deg) scale(${zoomPicture})`,
          }}
          alt=""
        />
      )}
      {ENTITY_TYPE_DETAILS[selectPicture.value.type].label === 'Vidéo' && (
        <iframe
          src={selectPicture.value.path}
          width="100%"
          height="100%"
          allow="autoplay"
          frameBorder="5px"
          title={selectPicture.value.label}
        />
      )}

      <div className={styles.fullScreen__feature}>
        <FeaturesMultimediaFiles
          addRotation={addRotation}
          lessRotation={lessRotation}
          lessZoom={lessZoom}
          addZoom={addZoom}
          setIsDisplaySelectPicture={setIsDisplaySelectPicture}
          isDisplaySelectPicture={isDisplaySelectPicture}
        />
      </div>
    </div>
  );
};

export default FullScreenMultimediaFile;
