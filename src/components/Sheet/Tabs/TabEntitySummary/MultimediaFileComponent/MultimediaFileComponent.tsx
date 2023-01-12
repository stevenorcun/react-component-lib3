import React from "react";
import cx from "classnames";
import { ENTITY_TYPE_DETAILS } from "../../../../../constants/entity-related";
import OPTIONS_SUMMARY from "../../../../../constants/options";
import IconMedia from "../../../../../assets/images/icons/IconMedia";
import { NovaEntityType } from "../../../../../API/DataModels/Database/NovaEntityEnum";
import { RelatedSummariesProps } from "../../../../../components/Sheet/Tabs/TabEntitySummary/Related/Related";
import DraggableEntityOrSummary from "../../../../../components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import DetailSheetHeader from "../../../../../components/Sheet/Tabs/TabEntitySummary/Components/DetailSheetHeader";
import RelatedFooter from "../Components/Footer/RelatedFooterComponent";
import styles from "./multimediaFileComponent.scss";

const MultimediaFileComponent = ({
  setIsExpanded,
  isExpanded,
  entitySummaries = [],
}: RelatedSummariesProps) => {
  const numberMultimediaByType = (type) => {
    const numberMultimedia =
      entitySummaries?.filter((el) => el.value.type === type) || [];
    return numberMultimedia.length;
  };

  return (
    <div className={styles.component}>
      <DetailSheetHeader
        icon={<IconMedia />}
        title="Fichiers multimédias"
        subtitle={`${numberMultimediaByType(
          NovaEntityType.Picture
        )} photos, ${numberMultimediaByType(NovaEntityType.Video)} vidéos`}
        options={OPTIONS_SUMMARY}
        entities={entitySummaries}
      />
      <div
        className={cx(commons.PrettyScroll, styles.component__multimediaAll, {
          [styles.component__multimediaMinus]: !isExpanded,
        })}
      >
        {entitySummaries?.map((media) => (
          <DraggableEntityOrSummary data={media} className={styles.Thumbnail}>
            {ENTITY_TYPE_DETAILS[media.value.type].label === "Photo" ? (
              <img
                key={media.id}
                src={media.value.path}
                alt={media.value.label}
                className={styles.multimediaFilePicture}
              />
            ) : (
              ENTITY_TYPE_DETAILS[media.value.type].label === "Vidéo" &&
              media.value.thumbnail && (
                <img
                  key={media.id}
                  src={media.value.thumbnail.value.path}
                  alt={media.value.label}
                  className={styles.multimediaFilePicture}
                />
              )
            )}
          </DraggableEntityOrSummary>
        ))}
      </div>
      <RelatedFooter
        numberData={entitySummaries?.length}
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default MultimediaFileComponent;
