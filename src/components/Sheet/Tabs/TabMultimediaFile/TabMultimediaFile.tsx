import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";

import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import { ENTITY_TYPE_DETAILS } from "../../../../constants/entity-related";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import OPTIONS_SUMMARY from "../../../../constants/options";

import IconMedia from "../../../../assets/images/icons/IconMedia";
import IconPlus from "../../../../assets/images/icons/IconPlus";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import DraggableEntityOrSummary from "../../../../components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import FullScreenMultimediaFile from "./FullScreenMultimediaFile/FullScreenMultimediaFile";
import FeaturesMultimediaFiles from "./FeaturesMultimediaFiles";

import styles from "./multimediaFile.scss";
import HeaderComponent from "../TabEntitySummary/Components/Header/HeaderComponent";

const TabMultimediaFile = ({ entity }: { entity: EntityDto }) => {
  const refBackground = useRef(null);
  const multimediaOrigin = entity?.related?.multimediaFiles?.values;

  const [valueFilter, setValueFilter] = useState("");
  const [resultMultimedia, setResultMultimedia] = useState(
    entity?.related?.multimediaFiles?.values
  );
  const [selectPicture, setSelectPicture] = useState(
    entity?.related?.multimediaFiles?.values?.[0]
  );
  const [rotationPicture, setRotationPicture] = useState(0);
  const [isDisplaySelectPicture, setIsDisplaySelectPicture] = useState(false);
  const [zoomPicture, setZoomPicture] = useState(1);
  const [transition, setTransition] = useState(false);

  const selectPictureId = (id: number | string) => {
    setTransition(false);
    setRotationPicture(0);
    setZoomPicture(1);
    // @ts-ignore
    setSelectPicture(resultMultimedia.find((element) => element.id === id));
  };

  const filterText = (request: string) => {
    setValueFilter(request);
    const resultFilter = multimediaOrigin?.length
      ? multimediaOrigin.filter(
          (el) =>
            el.value.label.toLowerCase().indexOf(request.toLowerCase()) !== -1
        )
      : [];
    setResultMultimedia([...resultFilter]);
    setSelectPicture(resultMultimedia[0]);
  };

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

  const numberMultimediaByType = (type) => {
    const numberMultimedia =
      entity?.related?.multimediaFiles?.values?.filter(
        (el) => el.value.type === type
      ) || [];
    return numberMultimedia.length;
  };

  useEffect(() => {
    setResultMultimedia(entity?.related?.multimediaFiles?.values);
    setSelectPicture(
      // @ts-ignore
      entity?.related?.multimediaFiles?.values?.length &&
        entity?.related?.multimediaFiles.values[0]
    );
  }, [entity?.related?.multimediaFiles]);

  const activeFilterText = (valueFilter: string) => {
    filterText(valueFilter);
  };

  return (
    <div className={cx(styles.multimediaFile, commons.PrettyScroll)}>
      {isDisplaySelectPicture && (
        <FullScreenMultimediaFile
          setIsDisplaySelectPicture={setIsDisplaySelectPicture}
          isDisplaySelectPicture={isDisplaySelectPicture}
          selectPicture={selectPicture}
        />
      )}
      <div className={styles.multimediaFileLeft}>
        <div className={styles.component}>
          <DraggableEntityOrSummary data={multimediaOrigin || []}>
            <HeaderComponent
              icon={<IconMedia />}
              title="Fichiers multimédias"
              subtitle={`${numberMultimediaByType(
                NovaEntityType.Picture
              )} photos, ${numberMultimediaByType(
                NovaEntityType.Video
              )} vidéos`}
              options={OPTIONS_SUMMARY}
              // @ts-ignore
              entities={entity?.related?.multimediaFiles?.values || []}
            />
            <div className={styles.multimediaFileLeftSearch}>
              <div className={styles.multimediaFileLeftSearchContent}>
                <input
                  placeholder="Rechercher"
                  type="text"
                  value={valueFilter}
                  onChange={(e) => activeFilterText(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.multimediaFileLeftListPicture}>
              {resultMultimedia &&
                !!resultMultimedia.length &&
                resultMultimedia.map((picture) => (
                  <DraggableEntityOrSummary data={picture}>
                    <div
                      key={picture.id}
                      className={styles.multimediaFileLeftListPictureSet}
                    >
                      <button
                        type="button"
                        onClick={() => selectPictureId(picture.id)}
                      >
                        {ENTITY_TYPE_DETAILS[picture.value.type].label ===
                          "Photo" && (
                          <div
                            style={{
                              flex: "1 1 auto",
                              position: "relative",
                              width: "100%",
                            }}
                          >
                            <img
                              className={cx(styles.multimediaFileLeftPicture, {
                                [styles.activePicture]:
                                  picture.id === selectPicture?.id,
                              })}
                              src={picture.value.path}
                              alt={picture.value.label}
                            />
                          </div>
                        )}
                        {ENTITY_TYPE_DETAILS[picture.value.type].label ===
                          "Vidéo" &&
                          picture.value.thumbnail && (
                            <>
                              <img
                                className={cx(
                                  styles.multimediaFileLeftPicture,
                                  {
                                    [styles.activePicture]:
                                      picture.id === selectPicture?.id,
                                  }
                                )}
                                src={picture.value.thumbnail.value.path}
                                alt={picture.value.label}
                                title={picture.value.label}
                              />
                            </>
                          )}
                      </button>
                      <p>{picture.value.label}</p>
                    </div>
                  </DraggableEntityOrSummary>
                ))}
              <button type="button" className={styles.addMultimediaFile}>
                <IconPlus fill="#D2D3D4" />
              </button>
            </div>
          </DraggableEntityOrSummary>
        </div>
      </div>
      <div className={styles.multimediaFileRight}>
        <div className={styles.component}>
          {selectPicture ? (
            <>
              <div
                className={styles.multimediaFileRightContent}
                ref={refBackground}
              >
                {selectPicture && refBackground && (
                  <div
                    style={{
                      overflow: "hidden",
                      borderRadius: "5px",
                      height: "83%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className={styles.multimediaFileRightPicture} />
                    {ENTITY_TYPE_DETAILS[selectPicture.value.type].label ===
                      "Photo" && (
                      <img
                        src={`${selectPicture?.value.path}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          transition: `${transition ? ".5s" : "none"}`,
                          borderRadius: "8px",
                          transform: `rotate(${rotationPicture}deg) scale(${zoomPicture})`,
                        }}
                        alt={selectPicture.value.label}
                      />
                    )}
                    {ENTITY_TYPE_DETAILS[selectPicture.value.type].label ===
                      "Vidéo" && (
                      <>
                        <iframe
                          src={selectPicture.value.path}
                          width="100%"
                          height="100%"
                          allow="autoplay"
                          frameBorder="5px"
                          title={selectPicture.value.label}
                        />
                      </>
                    )}
                  </div>
                )}
                <div className={styles.multimediaFileRightContentDescription}>
                  <p
                    className={
                      styles.multimediaFileRightContentDescriptionTitle
                    }
                  >
                    {/* Photo surveillancee cam-1 vol 12/12/2021{' '} */}
                    {selectPicture?.value.label}
                  </p>
                  <p
                    className={
                      styles.multimediaFileRightContentDescriptionCreation
                    }
                  >
                    Date de création:{" "}
                    <span>
                      <Moment format="DD/MM/YYYY hh:mm">
                        {selectPicture?.value.timestamp}
                      </Moment>
                    </span>
                  </p>
                </div>
              </div>
              {selectPicture && (
                <>
                  <div className={styles.divider} />
                  <FeaturesMultimediaFiles
                    addRotation={addRotation}
                    lessRotation={lessRotation}
                    addZoom={addZoom}
                    lessZoom={lessZoom}
                    setIsDisplaySelectPicture={setIsDisplaySelectPicture}
                    isDisplaySelectPicture={isDisplaySelectPicture}
                    entity={entity}
                    file={selectPicture}
                  />
                </>
              )}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              Pas de données à afficher
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabMultimediaFile;
