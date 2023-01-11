import React, { useEffect, useState } from 'react';

import CustomActions from '@/components/CustomActions/CustomActions';

import IconDownload from '@/assets/images/icons/IconToolDownload';
import IconLeftRotation from '@/assets/images/icons/IconLeftRotation';
import IconRightRotation from '@/assets/images/icons/IconRightRotation';
import IconMiniature from '@/assets/images/icons/IconMiniature';
import IconLoupePlus from '@/assets/images/icons/IconZoom';
import IconLoupeMinus from '@/assets/images/icons/IconDezoom';
import IconFullScreen from '@/assets/images/icons/IconFullScreen';

import IconMedia from '@/assets/images/icons/IconMedia';

import styles from './multimediaFile.scss';

const FeaturesMultimediaFiles = ({
  addRotation,
  lessRotation,
  lessZoom,
  addZoom,
  setIsDisplaySelectPicture,
  isDisplaySelectPicture,
  entity,
  file,
}: any) => {
  const [isOpenedActionsMenu, setIsOpenedActionsMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpenedActionsMenu(!isOpenedActionsMenu);
  };

  useEffect(() => {
    if (isOpenedActionsMenu) {
      document.addEventListener('click', toggleMenu);
    }
    return () => {
      document.removeEventListener('click', toggleMenu);
    };
  }, [isOpenedActionsMenu]);

  return (
    <div className={styles.multimediaFileFooter}>
      <div className={styles.multimediaFileFooterLeft}>
        <span className={styles.openIn}>Ouvrir dans : </span>
        <button
          className={styles.multimediaFileFooterLeftButtonMedia}
          type="button"
        >
          <IconMedia className={styles.iconMedia} />
          Média
        </button>
        <button
          className={styles.multimediaFileFooterLeftButtonDownload}
          type="button"
        >
          <IconDownload fill="white" stroke="#3083F7" transform="scale(0.9)" />
          Télécharger
        </button>
        <CustomActions actionsKey="multimedia" entity={entity} file={file} />
      </div>
      <div className={styles.multimediaFileFooterRight}>
        <button type="button" onClick={() => lessRotation()}>
          <IconLeftRotation className={styles.icon} transform="scale(0.9)" />
        </button>
        <button type="button" onClick={() => addRotation()}>
          <IconRightRotation className={styles.icon} transform="scale(0.9)" />
        </button>
        <div className={styles.multimediaFileFooterRightDivider} />
        <IconMiniature className={styles.icon} transform="scale(0.7)" />
        <button type="button" onClick={() => lessZoom()}>
          <IconLoupeMinus
            className={styles.icon}
            fill="#94969A"
            transform="scale(0.8)"
          />
        </button>
        <button type="button" onClick={() => addZoom()}>
          <IconLoupePlus
            className={styles.icon}
            fill="#94969A"
            transform="scale(0.8)"
          />
        </button>
        <IconFullScreen
          className={styles.icon}
          transform="scale(0.7)"
          onClick={() => setIsDisplaySelectPicture(!isDisplaySelectPicture)}
        />
      </div>
    </div>
  );
};

export default FeaturesMultimediaFiles;
