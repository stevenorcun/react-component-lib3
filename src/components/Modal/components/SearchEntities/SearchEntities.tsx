/* eslint-disable import/no-cycle */
import React, { Fragment } from "react";
import cx from "classnames";

import {
  ENTITY_PROPERTY_DETAILS,
  getEntityStrIcon,
  getEntityTitleProperty,
  getEntityTypeColor,
  getEntityTypeLabel,
} from "@/constants/entity-related";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";

import Accordion from "@/components/Accordion/Accordion";
import selectionStyles from "@/components/Drawer/Tabs/Selection/styles.scss";
import { EntityTypeTag } from "@/components/Browser/SearchResult/SearchResult";
import AdvancedSearchResultPropertyLine from "@/components/Browser/SearchResult/PropertyLine/PropertyLine";
import NoData from "@/lib/NoData/NoData";
import { selectOntologyConfig } from "@/store/ontology";
import { useAppSelector } from "@/store/hooks";

import IconBox from "@/assets/images/icons/IconBox";
import IconSearch from "@/assets/images/icons/IconSearch";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./searchEntities.scss";

const ResultSearchCard = ({ entity, handleSummaryClicked, selectedEntity }) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const Icon = getEntityStrIcon(entity, ont);
  return (
    <div
      key={entity.id}
      className={cx(commons.Flex, styles.Summary, {
        [styles.Summary_Selected]: selectedEntity?.id === entity.id,
      })}
      onClick={() => handleSummaryClicked(entity)}
    >
      <div className={cx(commons.Flex, styles.Summary__Left)}>
        <div
          className={cx(
            commons.Flex,
            commons.FlexAlignItemsCenter,
            styles.Summary__Icon
          )}
        >
          <Icon />
        </div>
        <span className={styles.Summary__Label}>
          {getEntityTitleProperty(entity, ont)}
        </span>
      </div>

      <div className={commons.Flex}>
        <EntityTypeTag
          key={entity.type}
          label={getEntityTypeLabel(entity, ont)}
          color={getEntityTypeColor(entity, ont)}
        />
      </div>
    </div>
  );
};

const SearchEntities = ({
  search,
  handleInputValueChange,
  dropdownEntities,
  selectedEntity,
  handleSummaryClicked,
  title,
  subtitle,
  type,
}: {
  search: string | undefined;
  handleInputValueChange: (e: React.FormEvent<HTMLInputElement>) => void;
  dropdownEntities: any;
  selectedEntity: EntityDto | null;
  handleSummaryClicked: (e: EntityDto) => void;
  title: string;
  subtitle: string;
  type: string;
}) => (
  <Accordion
    className={styles.Accordion}
    title={
      <div className={cx(commons.Flex, styles.AccordionTitle)}>
        <IconBox />
        {title}
      </div>
    }
    isOpened
  >
    <div
      className={cx(
        commons.Flex,
        commons.FlexDirectionColumn,
        styles.FusionTargetSelection
      )}
    >
      <div className={styles.Label}>{subtitle}</div>
      <div className={cx(commons.Flex, styles.SearchInput)}>
        <input
          placeholder="Rechercher"
          type="text"
          value={search}
          onChange={handleInputValueChange}
        />
        <div
          className={cx(
            commons.Flex,
            commons.FlexAlignItemsCenter,
            commons.FlexJustifyContentCenter,
            styles.SubmitButton
          )}
        >
          <IconSearch />
        </div>
      </div>

      <div className={cx(commons.PrettyScroll, styles.DropdownList)}>
        {dropdownEntities.map((e) => (
          <Fragment key={e.id}>
            <ResultSearchCard
              entity={e}
              handleSummaryClicked={handleSummaryClicked}
              selectedEntity={selectedEntity}
            />
            {selectedEntity?.id === e.id && (
              <div
                className={cx(
                  commons.Flex,
                  commons.FlexDirectionColumn,
                  commons.FlexWrap,
                  styles.Summary__Properties,
                  selectionStyles.GroupValuesContainer
                )}
              >
                {e.__properties.values.map((property) => (
                  <Fragment key={property.key}>
                    {(!!property.value || property.value === 0) &&
                      (!Array.isArray(property.value) ||
                        property.value.length) && (
                        <AdvancedSearchResultPropertyLine
                          key={property.key}
                          propertyKey={property.key}
                          label={
                            ENTITY_PROPERTY_DETAILS[property.key]?.label ||
                            property.key
                          }
                          value={property.value}
                          className={selectionStyles.Property}
                          labelClassName={selectionStyles.PropertyLabel}
                          valueClassName={selectionStyles.PropertyValue}
                        />
                      )}
                  </Fragment>
                ))}
                {!e?.__properties?.values?.length && (
                  <NoData>Aucune propriété</NoData>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {type !== "link" && (
        <div className={styles.Assistance}>
          Vous pouvez sélectionner uniquement un type d’objet identique à celui
          que vous souhaitez fusionner. Les autres types d’objet n’apparaitront
          donc pas dans la liste des propositions.
        </div>
      )}
    </div>
  </Accordion>
);

export default SearchEntities;
