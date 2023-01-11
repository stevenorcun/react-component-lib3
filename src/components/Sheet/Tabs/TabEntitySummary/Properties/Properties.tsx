/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from "react";
import cx from "classnames";
import GridLayout from "react-grid-layout";

import {
  ENTITY_PROPERTY_DETAILS,
  getEntityPropLabel,
  getPropStrIcon,
} from "@/constants/entity-related";

import IconBars from "@/assets/images/icons/IconList";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import { NovaEntityType } from "@/API/DataModels/Database/NovaEntityEnum";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import RelatedFooter from "../Components/Footer/RelatedFooterComponent";
import HeaderComponent from "../Components/Header/HeaderComponent";
import styles from "./properties.scss";
import { useAppSelector } from "@/store/hooks";
import { selectOntologyConfig } from "@/store/ontology";

const layoutLocalStorageKey = "propertiesLayout";
const propertiesSettingsLocalStorageKey = "propertiesSettings";

interface PropertiesProps {
  dataProperties: EntityDto["__properties"];
  setIsExpanded: (bool: boolean) => void;
  isExpanded: boolean;
  type: NovaEntityType;
}

const Properties = ({
  dataProperties,
  setIsExpanded,
  isExpanded,
  type,
}: PropertiesProps) => {
  const [dataHeader, setDataHeader] = useState([]);
  const [layout, setLayout] = useState([]);
  const [filteredLayout, setFilteredLayout] = useState([]);

  const [hiddenProperties, setHiddenProperties] = useState({});
  const [preferenceVisibility, setPreferenceVisibility] = useState({});
  const [preferenceLayout, setPreferenceLayout] = useState({});

  const { ont } = useAppSelector(selectOntologyConfig);

  // INITIALISATION ( valeur par defaut ou localstorage)
  useEffect(() => {
    const preference = localStorage.getItem(propertiesSettingsLocalStorageKey);
    let tempLayout = {};
    let tempVisibility = {};
    let tempHidden = {};
    let isException = true;

    if (preference) {
      try {
        const parsedPreference = JSON.parse(preference);
        if (!parsedPreference[type]) {
          isException = false;
          tempVisibility = { ...parsedPreference, [type]: {} };
          tempHidden = {};
        } else {
          isException = false;
          tempVisibility = parsedPreference;
          tempHidden = parsedPreference[type];
        }
      } catch (error) {
        console.error("erreur: chargement des préférences", error);
        isException = true;
      }
    }
    if (isException) {
      tempVisibility = { [type]: {} };
      tempHidden = {};
    }
    setPreferenceVisibility(tempVisibility);
    setHiddenProperties(tempHidden);
    const localLayout = localStorage.getItem(layoutLocalStorageKey);

    isException = true;
    if (localLayout) {
      try {
        const parsedPreferenceLayout = JSON.parse(localLayout);
        if (!parsedPreferenceLayout[type]) {
          isException = false;

          tempLayout = { ...parsedPreferenceLayout, [type]: [] };
        } else {
          isException = false;
          tempLayout = parsedPreferenceLayout;
        }
      } catch (error) {
        console.error("erreur: chargement des préférences", error);
        isException = true;
      }
    }

    if (isException) {
      tempLayout = { [type]: [] };
    }

    const result = dataProperties.values.reduce(
      (acc: any, curr, index) => {
        const findY = tempLayout[type].find((el) => el.i === curr.key)?.y;
        acc.dataHeader.push({
          key: curr.key,
          label: ENTITY_PROPERTY_DETAILS[curr.key]?.label || curr.key,
          hidden: tempVisibility[type]?.[curr.key],
          value: curr.value,
          dataGrid: {
            x: 0,
            y: !isNaN(findY) ? findY : index,
            w: 12,
            h: 1,
          },
        });

        acc.layout.push({
          i: curr.key,
          x: 0,
          y: !isNaN(findY) ? findY : index,
          w: 12,
          h: 1,
        });
        return acc;
      },
      { layout: [], dataHeader: [] }
    );
    setDataHeader(result.dataHeader);
    setPreferenceLayout(
      Object.keys(tempLayout).length ? tempLayout : { [type]: result.layout }
    );
    setLayout(result.layout);
  }, [dataProperties]);

  // ADAPTATION LAYOUT
  useEffect(() => {
    const visibleOrderedProps = layout
      .reduce((acc: any, curr: any) => {
        const prop: any = dataHeader.find((el: any) => curr.i === el.key);
        if (prop && !prop.hidden) {
          acc.push({ ...curr, key: prop.key });
        }
        return acc;
      }, [])
      .sort((a, b) => (a.y >= b.y ? 1 : -1));

    const fixedOrderedProps = visibleOrderedProps.reduce((acc, curr) => {
      acc.push({ ...curr, y: acc.length });
      return acc;
    }, []);

    setFilteredLayout(fixedOrderedProps);
  }, [layout, dataHeader]);

  const isVisibleOption = (key: string) => {
    const resultDataHeader = dataHeader.map((el: any, index) => {
      if (key === el.key) {
        el.hidden = !el.hidden;
      }
      // @ts-ignore
      return { ...el, dataGrid: { ...layout[index] } };
    });
    // @ts-ignore
    setDataHeader(resultDataHeader);
    setLayout([...layout]);
    const changeHidden = { ...hiddenProperties, [key]: !hiddenProperties[key] };
    setHiddenProperties(changeHidden);

    localStorage.setItem(
      propertiesSettingsLocalStorageKey,
      JSON.stringify({ ...preferenceVisibility, [type]: changeHidden })
    );
  };

  const handleSettingsDataGridChange = (
    positionGrid: { key: string; y: number }[]
  ) => {
    const tempLayout = { ...preferenceLayout, [type]: positionGrid };
    setLayout(tempLayout[type]);
    setPreferenceLayout(tempLayout);
    localStorage.setItem(layoutLocalStorageKey, JSON.stringify(tempLayout));
  };

  return (
    <div className={styles.component}>
      <HeaderComponent
        icon={<IconBars fill="#3083F7" />}
        title="Propriétés"
        layout={layout}
        listProperties={dataHeader}
        isVisibleOption={isVisibleOption}
        handleDrop={handleSettingsDataGridChange}
        customizable
      />
      <GridLayout
        cols={12}
        rowHeight={60}
        width={495}
        margin={[5, 15]}
        className={cx("layout", commons.PrettyScroll, styles.propertyMain, {
          [styles.propertyMain_minus]: !isExpanded,
        })}
        // onDragStop={(e) => console.warn(e)}
        layout={filteredLayout}
      >
        {dataHeader.map((element: any) => {
          // @ts-ignore
          const Icon = getPropStrIcon(type, element.key, ont);
          return (
            !element.hidden && (
              <div
                className={cx(styles.propertyMainContent, {
                  [styles.hidden]: element.hidden,
                })}
                key={element.key}
                data-grid={{ ...element.dataGrid, static: true }}
                // @ts-ignore
                static
              >
                <>
                  <div className={styles.backgroundIcon}>
                    {Icon && <Icon />}
                  </div>
                  <div className={styles.contentDetail}>
                    <p className={styles.title}>
                      // @ts-ignore
                      {
                        // @ts-ignore
                        getEntityPropLabel(type, element.key, ont)
                      }
                    </p>
                    <p className={styles.text}>
                      {Array.isArray(element.value) ? (
                        element.value.map((val) => (
                          <div className={styles.text}>{val.label}</div>
                        ))
                      ) : (
                        <div className={styles.text}>{element.value}</div>
                      )}
                    </p>
                  </div>
                </>
              </div>
            )
          );
        })}
      </GridLayout>
      <RelatedFooter
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
        numberData={dataProperties.count}
      />
    </div>
  );
};

export default Properties;
