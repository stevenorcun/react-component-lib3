import React, { useEffect, useState } from "react";

import IconRelated from "@/assets/images/icons/IconRelated";
import { RelatedSummary } from "@/API/DataModels/Database/NovaObject";
import RelatedObject from "./RelatedObject";

import styles from "../styles.scss";
import DetailSheetHeader from "../Components/DetailSheetHeader";

export interface RelatedSummariesProps {
  isExpanded: boolean;
  setIsExpanded: (bool: boolean) => void;
  entitySummaries?: RelatedSummary[];
}

interface RelatedProps {
  isRelatedDocumentExpanded: boolean;
  setIsRelatedDocumentExpanded: (boo: boolean) => void;
  isRelatedEventExpanded: boolean;
  setIsRelatedEventExpanded: (boo: boolean) => void;
  isRelatedEntitiesExpanded: boolean;
  setIsRelatedEntitiesExpanded: (boo: boolean) => void;
  related: any[];
}

const Related = ({
  isRelatedDocumentExpanded,
  setIsRelatedDocumentExpanded,
  isRelatedEventExpanded,
  setIsRelatedEventExpanded,
  isRelatedEntitiesExpanded,
  setIsRelatedEntitiesExpanded,
  related,
}: RelatedProps) => {
  const [relatedObjects, setRelatedObjects] = useState<any[]>(related);

  useEffect(() => {
    setRelatedObjects(related);
  }, [related]);

  return (
    <div className={styles.component}>
      <DetailSheetHeader
        icon={<IconRelated />}
        title="Connexe"
        // @ts-ignore
        subtitle={`${related.entities?.count || 0} entités, ${
          // @ts-ignore
          related.events?.count || 0
          // @ts-ignore
        } évènements, ${related.documents?.count || 0} documents`}
        // @ts-ignore
        entities={relatedObjects.entities}
      />
      <div>
        {related && (
          <>
            {/* {related.documents
              && (
                <RelatedDocument
                  isExpanded={isRelatedDocumentExpanded}
                  setIsExpanded={setIsRelatedDocumentExpanded}
                  entitySummaries={related?.documents?.values || []}
                />
              )} */}
            {
              // @ts-ignore
              related.entities && (
                <RelatedObject
                  isExpanded={isRelatedEntitiesExpanded}
                  setIsExpanded={setIsRelatedEntitiesExpanded}
                  // @ts-ignore
                  entitySummaries={related?.entities || []}
                />
              )
            }
            {/* {related.events
              && (
                <RelatedEvent
                  setIsExpanded={setIsRelatedEventExpanded}
                  isExpanded={isRelatedEventExpanded}
                  entitySummaries={related?.events?.values || []}
                />
              )} */}
          </>
        )}
      </div>
    </div>
  );
};

export default Related;
