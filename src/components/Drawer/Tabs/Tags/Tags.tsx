/* eslint-disable no-restricted-syntax */
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cx from "classnames";

import { useGlobalModalContext } from "@/hooks/useGlobalModal";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import { NovaUserRole } from "@/API/DataModels/Database/User";
import {
  ENTITY_PROPERTY_DETAILS,
  getEntityStrIcon,
  getEntityTitleProperty,
  getEntityTypeLabel,
} from "@/constants/entity-related";
import { SESSION_STORAGE_KEYS } from "@/constants/storage-keys";
import { getTagColor, getTagLabel, TAG_TYPE_COLOR } from "@/constants/tags";
import { BrowserTabType } from "@/constants/browser-related";
import ModalTypes from "@/constants/modal";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createTabByType } from "@/store/browser";
import { selectTags } from "@/store/tags";
import { selectOntologyConfig } from "@/store/ontology";

import { isDark } from "@/utils/colors";

import Accordion from "@/components/Accordion/Accordion";
import Switch from "@/components/Inputs/Switch/Switch";
import NovaImage from "@/components/NovaImage/NovaImage";

import IconToolPencil from "@/assets/images/icons/IconFolderLinkNav";
import IconPens from "@/assets/images/icons/IconPencilEdit";
import IconTag from "@/assets/images/icons/IconTag";

import { APP_ROUTES } from "@/constants/routes";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface TagsDrawerProps {
  className?: string;
  entity?: EntityDto | null;
}

const TagsDrawerHeader = ({
  data,
  mode,
}: {
  data: any;
  mode: "entity" | "property";
}) => {
  const ontologyStore = useAppSelector(selectOntologyConfig);
  const Icon = getEntityStrIcon(data.entity, ontologyStore.ont);

  return (
    <div className={styles.entity}>
      {data && mode === "entity" && (
        <div className={styles.entityContent}>
          {data.avatar ? (
            <NovaImage
              fileId={data.avatar?.id}
              alt={data.avatar?.value?.title}
            />
          ) : (
            <div>{Icon && <Icon />}</div>
          )}
        </div>
      )}
      <div className={styles.entityDetails}>
        <div className={styles.EntityLabel}>{data.label}</div>
        {mode === "entity" ? (
          <div className={styles.entityType}>{data.type}</div>
        ) : (
          <div className={styles.entityType}>
            {ENTITY_PROPERTY_DETAILS[data.type]?.label}
          </div>
        )}
      </div>
    </div>
  );
};

const TagsDrawer = ({ className, entity }: TagsDrawerProps) => {
  const tagsState = useAppSelector(selectTags);
  const ontologyStore = useAppSelector(selectOntologyConfig);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(undefined);
  const [isPropertyMode, setIsPropertyMode] = useState(false);
  const [filteredRules, setFilteredRules] = useState<
    {
      id: string;
      reference: string;
      rule: {
        isDataShown: boolean;
        controlTags: {
          label: string;
          type: number;
        }[];
        dataTags: {
          label: string;
          type: number;
        }[];
      };
    }[]
  >([]);

  const { showModal } = useGlobalModalContext();

  const openEntity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (entity) {
      dispatch(
        createTabByType({
          type: BrowserTabType.EntityDetails,
          value: entity.label,
          isActive: true,
          activeEntity: entity,
        })
      );
    }
    navigate(APP_ROUTES.browser.path);
  };

  const openModal = (mode) => {
    showModal(ModalTypes.TAGS, {
      mode,
      value:
        mode === "property"
          ? tagsState.selectedProperty?.data?.entitled
          : getEntityTitleProperty(entity, ontologyStore.ont),
      tags:
        mode === "property"
          ? tagsState.selectedProperty?.data?.tags
          : entity?._MARKINGS,
      objectId: entity?.id,
    });
  };

  const filterRules = () => {
    const rules = tagsState.rules.filter((rule) => {
      const isTagInObject = rule.rule.dataTags.some((t) =>
        entity?.tags?.find((ta) => ta.label === t.label)
      );
      const isTagInProperty = rule.rule.dataTags.some((t) =>
        tagsState.selectedProperty?.data.tags?.find(
          (ta) => ta.label === t.label
        )
      );
      const isAdmin = currentUser?.roles.includes(NovaUserRole.superAdmin);
      const isTagInUser = rule.rule.controlTags.every((t) =>
        currentUser?.tags?.find((ta) => t.type !== 6 && ta.label === t.label)
      );
      const isTagInContext = rule.rule.controlTags.every((t) =>
        tagsState.contextTags?.find(
          (ta) => t.type === 6 && ta.label === t.label
        )
      );
      return (
        (isTagInObject || isTagInProperty) &&
        (isAdmin || ((isTagInUser || isTagInContext) && rule.rule.isDataShown))
      );
    });
    setFilteredRules(rules);
  };

  useEffect(() => {
    const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.userId);
    const user = tagsState?.users.find((u) => u.user._id === userId);
    setCurrentUser(user?.user);
  }, []);

  useEffect(() => {
    setIsPropertyMode(
      tagsState.selectedProperty && tagsState.selectedProperty.data
    );
  }, [tagsState.selectedProperty]);

  useEffect(() => {
    filterRules();
  }, [tagsState, entity]);

  return !entity ? (
    <>
      <div className={styles.emptySelection}>
        Aucune entité actuellement sélectionnée.
      </div>
    </>
  ) : (
    <>
      <div
        className={cx(className, commons.PrettyScroll, styles.selectionWrapper)}
      >
        <TagsDrawerHeader
          mode={isPropertyMode ? "property" : "entity"}
          data={
            isPropertyMode
              ? {
                  label: tagsState.selectedProperty?.data.entitled,
                  type: tagsState.selectedProperty?.title,
                }
              : {
                  entity,
                  avatar: entity.avatar,
                  label: getEntityTitleProperty(entity, ontologyStore.ont),
                  type: getEntityTypeLabel(entity, ontologyStore.ont),
                }
          }
        />
        <div className={styles.entityLinksContainer}>
          <div
            className={cx(
              commons.clickable,
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Link
            )}
            onClick={openEntity}
          >
            <IconToolPencil width={12} height={12} />
            <span>Ouvrir dans le navigateur</span>
          </div>
          <span className={styles.DotSeparator}>&middot;</span>
          <div
            className={cx(
              commons.clickable,
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Link
            )}
          >
            <IconPens width={12} height={12} />
            <span>Modifier</span>
          </div>
        </div>

        <Accordion
          classNameHead={styles.accordion}
          title={
            <div className={styles.accordionTitle}>
              <IconTag fill="#3083F7" />
              Marquants de l'objet
            </div>
          }
          isOpened
        >
          <div className={styles.accordionItemContainer}>
            {Array.isArray(entity?._MARKINGS) ? (
              entity?._MARKINGS?.map((tag, index) => (
                <span
                  key={index}
                  className={cx(commons.tag, {
                    [commons.tagLight]: isDark(
                      getTagColor(tag, ontologyStore.tagsConf)
                    ),
                  })}
                  style={{
                    backgroundColor: getTagColor(tag, ontologyStore.tagsConf),
                  }}
                >
                  {getTagLabel(tag, ontologyStore.tagsConf)}
                </span>
              ))
            ) : (
              <span
                key={`m-${entity._MARKINGS}`}
                className={cx(commons.tag, {
                  [commons.tagLight]: isDark(
                    getTagColor(entity._MARKINGS, ontologyStore.tagsConf)
                  ),
                })}
                style={{
                  backgroundColor: getTagColor(
                    entity._MARKINGS,
                    ontologyStore.tagsConf
                  ),
                }}
              >
                {getTagLabel(entity._MARKINGS, ontologyStore.tagsConf)}
              </span>
            )}
            <button
              type="button"
              className={cx(styles.addButton, styles.Link)}
              onClick={() => openModal("entity")}
            >
              Modifier les marquants de l'objet
            </button>
          </div>
        </Accordion>
        {isPropertyMode && (
          <Accordion
            classNameHead={styles.accordion}
            title={
              <div className={styles.accordionTitle}>
                <IconTag fill="#3083F7" />
                Marquants sur la propriété
              </div>
            }
            isOpened
          >
            <div className={styles.accordionItemContainer}>
              {tagsState.selectedProperty?.data?.tags?.map((tag, index) => (
                <Fragment key={index}>
                  <span
                    className={commons.tag}
                    style={{ backgroundColor: TAG_TYPE_COLOR[tag.type] }}
                  >
                    {tag.label}
                  </span>
                </Fragment>
              ))}
              <button
                type="button"
                className={cx(styles.addButton, styles.Link)}
                onClick={() => openModal("property")}
              >
                Modifier les marquants de la propriété
              </button>
            </div>
          </Accordion>
        )}
        <Accordion
          classNameHead={styles.accordion}
          title={
            <div className={styles.accordionTitle}>
              <IconTag fill="#3083F7" />
              Règles associées
            </div>
          }
          isOpened
        >
          <div className={styles.accordionItemContainer}>
            {filteredRules.map((rule) => (
              <div key={rule.id} className={styles.ruleLine}>
                <div className={styles.ruleTitleContainer}>
                  <span>
                    {rule.rule.controlTags[0].type === 6
                      ? "Contexte"
                      : "Utilisateur"}
                  </span>
                  <span className={styles.actionColumn}>Action</span>
                  <span>Donnée</span>
                </div>
                <div className={styles.ruleContent}>
                  <div>
                    {rule.rule.controlTags.map((tag, index) => (
                      <span
                        key={index}
                        className={commons.tag}
                        style={{ backgroundColor: TAG_TYPE_COLOR[tag.type] }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <div className={styles.actionColumn}>
                    <Switch defaultActive={rule.rule.isDataShown} disabled />
                  </div>
                  <div>
                    {rule.rule.dataTags.map((tag, index) => (
                      <span
                        key={index}
                        className={commons.tag}
                        style={{ backgroundColor: TAG_TYPE_COLOR[tag.type] }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </>
  );
};
export default TagsDrawer;
