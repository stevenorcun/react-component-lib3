import React, { useState } from "react";
import cx from "classnames";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createTabByType } from "../../../store/browser";
import { BrowserTabType } from "../../../constants/browser-related";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconNewTab from "../../../assets/images/icons/IconNewTab";
import AdvancedSearchResultPropertyLine from "../../../components/Browser/SearchResult/PropertyLine/PropertyLine";
import { EntityDto } from "../../../API/DataModels/Database/NovaObject";
import {
  ENTITY_PROPERTY_DETAILS,
  ENTITY_TYPE_DETAILS,
  getEntityPropLabel,
  getEntityStrIcon,
  getEntityTitleProperty,
  getEntityTypeLabel,
} from "../../../constants/entity-related";
import { selectOntologyConfig } from "../../../store/ontology";
import styles from "./SearchResult.scss";

interface BrowserSearchResultProps extends React.HTMLProps<HTMLDivElement> {
  entity: EntityDto;
  isSelected: boolean;
  hideCheckbox?: boolean;
  handleSelect: (entity: EntityDto, e: React.MouseEvent) => void;
  handleClick: (entity: EntityDto, e: React.MouseEvent) => void;
  handleDragStart: (entity: EntityDto, event: React.DragEvent) => void;
  handleOpen?: (e: React.MouseEvent) => void;
  onOpenTab?: () => void;
}

const BrowserSearchResult = ({
  entity,
  isSelected,
  hideCheckbox = false,
  handleClick,
  handleDragStart,
  handleSelect,
  handleOpen,
  onOpenTab,
  ...props
}: BrowserSearchResultProps) => {
  const dispatch = useAppDispatch();
  const ontologyStore = useAppSelector(selectOntologyConfig);

  const Icon = getEntityStrIcon(entity, ontologyStore.ont);

  // 0=Only Header and Footer
  // 1= show 4 props max
  // 2= show all props
  const [size, setSize] = useState(1);

  const handleShowMoreClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSize(size + 1);
  };
  const handleShowLessClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSize(size - 1);
  };

  const openInNewTab = (e: React.MouseEvent) => {
    if (handleOpen) {
      handleOpen(e);
      return;
    }
    e.stopPropagation();
    dispatch(
      createTabByType({
        // @ts-ignore
        value: getEntityTitleProperty(entity, ontologyStore.ont),
        type: BrowserTabType.EntityDetails,
        activeEntity: entity,
        isActive: !e.ctrlKey,
      })
    );
    onOpenTab?.();
  };

  const onDragStart = (e: React.DragEvent) => handleDragStart(entity, e);
  const onClick = (e: React.MouseEvent) => handleClick(entity, e);
  const onSelect = (e: React.MouseEvent) => handleSelect(entity, e);
  return (
    <div
      className={cx(
        styles.SearchResult,
        { [styles.SearchResult__Selected]: isSelected },
        props.className
      )}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className={styles.SearchResult__Header}>
        {!hideCheckbox && (
          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.SearchResult__Header__CheckboxContainer
            )}
            data-unextractable
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              onClick={onSelect}
            />
          </div>
        )}
        <div className={styles.SearchResult__Header__IconContainer}>
          <div className={styles.SearchResult__Header__Icon}>
            {entity.avatar?.value.path ? (
              <img
                src={entity.avatar.value.path}
                alt={entity.avatar.value.title}
              />
            ) : (
              Icon && <Icon />
            )}
          </div>
        </div>
        <div
          className={cx(
            commons.InvisibleScroll,
            styles.SearchResult__Header__TitleContainer
          )}
        >
          <div className={styles.SearchResult__Header__TitleContainer__Tags}>
            <EntityTypeTag
              label={
                ENTITY_TYPE_DETAILS[entity.type]?.label ||
                getEntityTypeLabel(entity, ontologyStore.ont)
              }
              color={ENTITY_TYPE_DETAILS[entity.type]?.color || "#113e9f"}
            />
          </div>
          <div className={styles.SearchResult__Header__TitleContainer__Name}>
            <span title={entity.label}>
              {entity.label ||
                getEntityTitleProperty(entity, ontologyStore.ont)}
            </span>
          </div>
        </div>
        <div
          className={cx(
            styles.SearchResult__Header__NewTabButton,
            commons.clickable
          )}
          onClick={openInNewTab}
          data-unextractable
        >
          <IconNewTab height={18} width={18} />
        </div>
      </div>

      {size > 0 && (
        <div className={styles.SearchResult__Body}>
          <AdvancedSearchResultPropertyLine
            propertyKey="__properties"
            label={ENTITY_PROPERTY_DETAILS.__properties?.label}
            value={entity.__properties?.count}
          />
          <AdvancedSearchResultPropertyLine
            propertyKey="artifacts"
            label={ENTITY_PROPERTY_DETAILS.artifacts.label}
            value={entity.artifacts?.length || 0}
          />
          {entity?.__properties?.values?.map((property, index) => {
            if ((index < 2 && size === 1) || size === 2) {
              return (
                <AdvancedSearchResultPropertyLine
                  key={property.key}
                  propertyKey={property.key}
                  // @ts-ignore
                  label={getEntityPropLabel(
                    entity._DATATYPE,
                    property.key,
                    ontologyStore.ont
                  )}
                  value={property.value}
                />
              );
            }
            return null;
          })}
        </div>
      )}

      <SearchResultFooter
        isShowMoreDisabled={size === 2}
        isShowLessDisabled={size === 0}
        onShowMoreClick={handleShowMoreClicked}
        onShowLessClick={handleShowLessClicked}
      />
    </div>
  );
};

interface EntityTypeTagProps {
  label: string | undefined;
  color: string | undefined;
  className?: string;
  children?: React.ReactNode;
}

export const EntityTypeTag = ({
  label,
  color = "#F04C8B",
  className = "",
  children,
}: EntityTypeTagProps) => (
  <span
    className={cx(styles.EntityTypeTag, className)}
    style={{ borderColor: color, color }}
  >
    {label}
    {children}
  </span>
);

const SearchResultFooter = ({
  className = "",
  isShowMoreDisabled,
  isShowLessDisabled,
  onShowMoreClick,
  onShowLessClick,
}) => (
  <div
    className={cx(styles.SearchResult__Footer, className)}
    data-unextractable
  >
    Voir :
    <span
      className={cx(
        { [styles.SearchResult__Footer__Link_Disabled]: isShowMoreDisabled },
        commons.clickable,
        styles.SearchResult__Footer__Link
      )}
      onClick={onShowMoreClick}
    >
      Plus
    </span>
    <span className={styles.SearchResult__Footer__Separator}>&middot;</span>
    <span
      className={cx(
        { [styles.SearchResult__Footer__Link_Disabled]: isShowLessDisabled },
        commons.clickable,
        styles.SearchResult__Footer__Link
      )}
      onClick={onShowLessClick}
    >
      Moins
    </span>
  </div>
);

export default BrowserSearchResult;
