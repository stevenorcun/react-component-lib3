import React, { useState, useEffect } from "react";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import InfoBlock from "../../../../components/InfoBlock/InfoBlock";

import IconTeam from "../../../../assets/images/icons/IconTeam";

import styles from "./styles.scss";

interface CaseTeamProps {
  agents?: any[];
}

const defaultProps = {
  agents: [],
};

const CaseBlockTeam = ({ agents }: CaseTeamProps) => {
  const [countServices, setCountServices] = useState<number>(0);

  useEffect(() => {
    let count = 0;
    const services: string[] = [];
    if (agents) {
      agents.forEach((a) => {
        if (!services.includes(a.service)) {
          services.push(a.service);
          count += 1;
        }
      });
      setCountServices(count);
    }
  }, [agents]);
  return (
    <InfoBlock
      icon={<IconTeam />}
      title="Équipe mobilisée"
      subTitle={countServices ? `${countServices} services` : undefined}
      // @ts-ignore
      options
    >
      <div className={styles.agentContent}>
        {agents &&
          agents.map((agent) => (
            <div key={agent.id} className={styles.agent}>
              <span className={styles.agentName}>{agent.name}</span>
              <span className={commons.fontSmall}>{agent.service}</span>
              <span className={commons.fontSmall}>{agent.job}</span>
            </div>
          ))}
      </div>
    </InfoBlock>
  );
};

CaseBlockTeam.defaultProps = defaultProps;

export default CaseBlockTeam;
