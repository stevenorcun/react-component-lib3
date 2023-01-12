import React, { useEffect, useState } from "react";
import { EntityDto } from "../../API/DataModels/Database/NovaObject";
import { NovaEntityType } from "../../API/DataModels/Database/NovaEntityEnum";
import {
  ENTITY_DEFAULT_HEADER,
  ENTITY_DEFAULT_TABS,
  ENTITY_SHEET_DEFAULT,
} from "../../constants/entity-sheet-config";

import Tabs from "../../components/Tabs/Tabs";
import Tab from "../../components/Tabs/Tab";

const Sheet = ({
  type,
  entity,
  favorite,
}: {
  type: NovaEntityType;
  entity: EntityDto;
  favorite: boolean;
}) => {
  const [header, setHeader] = useState(null);
  const [tabs, setTabs] = useState<any[]>([]);
  useEffect(() => {
    // Create header and set props
    const HeaderElement =
      ENTITY_SHEET_DEFAULT[type]?.headerComponent ||
      ENTITY_DEFAULT_HEADER.component;
    // @ts-ignore
    setHeader(<HeaderElement entity={entity} favorite={favorite} />);
    // Create tabs and set props
    const tabsElements =
      ENTITY_SHEET_DEFAULT[type]?.defaultTabs || ENTITY_DEFAULT_TABS;
    const tabsElementsMapped = tabsElements.map((tab) => {
      const Element = tab.component;
      return {
        ...tab,
        tabComponent: Element ? <Element entity={entity} /> : undefined,
      };
    });
    setTabs(tabsElementsMapped);
  }, [entity, type]);
  return (
    <>
      {header}
      <Tabs
        className="tabs"
        tabs={tabs.map((tab) => ({ key: tab.key, title: tab.title }))}
        defaultActive={tabs && tabs[0] ? tabs[0].key : ""}
        active={tabs && tabs[0] ? tabs[0].key : ""}
      >
        {tabs?.map((tab) => (
          <Tab key={tab.key} state={tab.key}>
            {tab.tabComponent}
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default Sheet;
