import React, { useState, useEffect, Fragment } from "react";
import { ENTITY_TYPE_DETAILS } from "../../../../constants/entity-related";

import IconTarget from "../../../../assets/images/icons/wheelMenu/IconDotCircle";

import InfoBlock from "../../../../components/InfoBlock/InfoBlock";

import styles from "./styles.scss";
import NovaImage from "../../../../components/NovaImage/NovaImage";
import Man from "../../../../assets/images/icons/entityTypes/Man";

interface CaseTargetProps {
  targets?: any[];
}

const defaultProps = {
  targets: [],
};

const TargetElement = ({ image, name, type }: any) => {
  return (
    <div className={styles.target}>
      <NovaImage fileId={image} alt={name} fallBackTemplate={<Man />} />
      <span className={styles.targetName}>{name}</span>
      <span className={styles.targetType}>
        {ENTITY_TYPE_DETAILS[type].label}
      </span>
    </div>
  );
};

const CaseBlockTarget = ({ targets }: CaseTargetProps) => {
  const [numTargetsByType, setNumTargetByType] = useState<any[]>([]);
  // Number of items visible by default
  const numVisibleTargets = 3;

  useEffect(() => {
    const numTargets: any[] = [];
    if (targets) {
      targets.forEach((t) => {
        if (!numTargets[t.type]) {
          numTargets[t.type] = 1;
        } else {
          numTargets[t.type] += 1;
        }
      });
      setNumTargetByType(numTargets);
    }
  }, [targets]);
  return (
    <InfoBlock
      classNamePrefix="case-"
      icon={<IconTarget fill="#3083F7" width="18px" height="18px" />}
      title="Cible"
      subTitle={
        <>
          {numTargetsByType.map((value, index) => (
            <Fragment key={index}>
              {value} {ENTITY_TYPE_DETAILS[index].label}
              {numTargetsByType.length - 1 !== index && <> - </>}
            </Fragment>
          ))}
        </>
      }
      // @ts-ignore
      options
      hasShowMore={targets && targets.length > numVisibleTargets}
      showMoreCount={targets ? targets.length - numVisibleTargets : 0}
      showMoreSlot={
        <>
          {targets && targets.length > numVisibleTargets && (
            <div className={styles.targetContent}>
              {targets.slice(numVisibleTargets).map((target) => (
                <TargetElement
                  key={target.id}
                  image={target.avatar?.id}
                  name={target.label}
                  type={target.type}
                  labels={target.tags}
                />
              ))}
            </div>
          )}
        </>
      }
    >
      <div>
        <div className={styles.targetContent}>
          {targets &&
            targets
              ?.slice(0, 3)
              .map((target) => (
                <TargetElement
                  key={target.id}
                  image={target.avatar?.id}
                  name={target.label}
                  type={target.type}
                />
              ))}
        </div>
      </div>
    </InfoBlock>
  );
};

CaseBlockTarget.defaultProps = defaultProps;

export default CaseBlockTarget;
