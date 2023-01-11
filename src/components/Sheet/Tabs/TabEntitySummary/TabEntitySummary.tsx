import React, { useState } from "react";

import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import styles from "@/pages/Entity/styles.scss";
import DraggableEntityOrSummary from "@/components/Sheet/Tabs/TabEntitySummary/Related/DraggableEntityOrSummary";
import PropertiesContent from "./Properties/Properties";
import MultimediaFile from "./MultimediaFileComponent/MultimediaFileComponent";
import Related from "./Related/Related";

const TabEntitySummary = ({ entity }: { entity: EntityDto }) => {
  const [isPropertyExpanded, setIsPropertyExpanded] = useState(false);
  const [isMultimediaExpanded, setIsMultimediaExpanded] = useState(false);
  const [isRelatedEntitiesExpanded, setIsRelatedEntitiesExpanded] =
    useState(false);
  const [isRelatedDocumentExpanded, setIsRelatedDocumentExpanded] =
    useState(false);
  const [isRelatedEventExpanded, setIsRelatedEventExpanded] = useState(false);

  return (
    <div className={styles.EntityDetailContentMain}>
      <div className={styles.EntityDetailContentMainLeft}>
        {entity?.__properties && (
          <PropertiesContent
            dataProperties={entity?.__properties}
            setIsExpanded={setIsPropertyExpanded}
            isExpanded={isPropertyExpanded}
            type={entity._DATATYPE || entity.type}
          />
        )}
        {entity?.related?.multimediaFiles && (
          <DraggableEntityOrSummary
            data={entity?.related?.multimediaFiles?.values || []}
          >
            <MultimediaFile
              setIsExpanded={setIsMultimediaExpanded}
              isExpanded={isMultimediaExpanded}
              entitySummaries={entity?.related?.multimediaFiles?.values || []}
            />
          </DraggableEntityOrSummary>
        )}
      </div>
      <div className={styles.EntityDetailContentMainRight}>
        {entity?.related && (
          <Related
            isRelatedEntitiesExpanded={isRelatedEntitiesExpanded}
            setIsRelatedEntitiesExpanded={setIsRelatedEntitiesExpanded}
            isRelatedDocumentExpanded={isRelatedDocumentExpanded}
            setIsRelatedDocumentExpanded={setIsRelatedDocumentExpanded}
            isRelatedEventExpanded={isRelatedEventExpanded}
            setIsRelatedEventExpanded={setIsRelatedEventExpanded}
            // @ts-ignore
            related={entity?.related}
          />
        )}
      </div>
    </div>
  );
};

export default TabEntitySummary;
