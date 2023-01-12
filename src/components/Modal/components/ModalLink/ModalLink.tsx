/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Moment from "react-moment";
import cx from "classnames";

import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { createConnectionFromTo, selectGraph } from "../../../../store/graph";
import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import { NovaEntityConnexionType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import { unhandle } from "../../../../utils/DOM";
import DateTimePicker from "../../../../lib/DateTimePicker/DateTimePicker";

import Modal from "../../../../components/Modal/Modal";
import Button from "../../../../components/Buttons/Button/Button";
import Input from "../../../../components/Input/Input";
import Switch from "../../../../components/Inputs/Switch/Switch";
import Tile from "../../../../components/Tiles/Tile";
import Connection from "../../../../components/Connection/Connection";
import Accordion from "../../../../components/Accordion/Accordion";
import SearchEntities from "../../../../components/Modal/components/SearchEntities/SearchEntities";

import IconCycle from "../../../../assets/images/icons/IconCycle";
import IconCalendar from "../../../../assets/images/icons/IconCalendar";
import IconCross from "../../../../assets/images/icons/IconCross";
import IconCheck from "../../../../assets/images/icons/IconCheckCircle";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface ModalLinkProps {
  entityFrom: string | EntityDto;
  entityTo: string | EntityDto;
}

const ModalLink = () => {
  const {
    modalProps,
    hideModal,
  }: { modalProps: ModalLinkProps; hideModal: () => void } =
    useGlobalModalContext();

  const { entityFrom, entityTo } = modalProps;

  const graphState = useAppSelector(selectGraph);
  const dispatch = useAppDispatch();
  const [entity, setEntity] = useState<EntityDto | undefined>(undefined);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [linkText, setLinkText] = useState("");
  const [isHypotheticalLink, setIsHypotheticalLink] = useState(false);
  const [isInversedSens, setIsInversedSens] = useState(false);
  const [isHiddenCalendar, setIsHiddenCalendar] = useState(true);
  const [calendarDates, setCalendarDates] = useState<any[]>([null, null]);
  const [selectedEntity, setSelectedEntity] = useState<EntityDto | null>(null);
  const [entityDest, setEntityDest] = useState<EntityDto | null>(null);
  const [dropdownEntities, setDropdownEntities] = useState(
    // @ts-ignore
    graphState.entities.filter(({ type }) => type === entityFrom.type)
  );

  // Select options and style
  const linkTypeOptions = [
    { value: NovaEntityConnexionType.InvolvedIn, label: "Impliqué dans" },
    { value: NovaEntityConnexionType.LinkedTo, label: "Lié à" },
    { value: NovaEntityConnexionType.MarriedTo, label: "Marié à" },
    { value: NovaEntityConnexionType.UserOf, label: "Utilisateur de" },
    { value: NovaEntityConnexionType.HolderOf, label: "Titulaire de" },
  ];
  const [selectedLinkType, setSelectedLinkType] = useState(linkTypeOptions[0]);

  const linkSensOptions = [
    { value: "Unidirectionnel", label: "Unidirectionnel" },
    { value: "Bidirectionnel", label: "Bidirectionnel" },
  ];
  const [selectedLinkSens, setSelectedLinkSens] = useState(linkSensOptions[0]);
  // Select style
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      border: "1px solid #EDEDEE",
      boxShadow: "0px 7.58719px 34px rgb(42 46 115 / 5%)",
      borderRadius: "4px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: "8px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "unset",
      width: 12,
      height: 12,
      alignItems: "center",
    }),
    valueContainer: (provided) => ({
      ...provided,
      fontSize: "12px",
      fontWeight: 700,
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: 12,
    }),
  };
  const customLinkStyles = {
    ...customStyles,
    container: (provided) => ({
      ...provided,
      width: "50%",
    }),
  };
  const handleSelectLinkType = (option) => {
    setSelectedLinkType(option);
  };
  const handleSelectLinkSens = (option) => {
    setSelectedLinkSens(option);
  };

  const close = () => {
    hideModal();
  };

  const onChangeLinkText = (e) => {
    setLinkText(e.target.value);
  };

  const onToggleLinkSens = () => {
    setIsInversedSens(!isInversedSens);
  };

  const onChangeDate = (dates) => {
    setCalendarDates(dates);
  };

  const handleSubmit = () => {
    if (!entity || (!selectedEntity && !entityDest)) {
      return;
    }
    const currentSelectedEntity = entityDest ?? selectedEntity;
    if (currentSelectedEntity) {
      dispatch(
        // @ts-ignore
        createConnectionFromTo({
          from: isInversedSens ? currentSelectedEntity?.id : entity.id,
          to: isInversedSens ? entity.id : currentSelectedEntity.id,
          type: selectedLinkType.value,
          label: linkText || selectedLinkType.label,
          isBidirectionnal: selectedLinkSens.value === linkSensOptions[1].value,
          isHypothesis: isHypotheticalLink,
        })
      );
    }
    close();
  };

  const init = (e: string | EntityDto, callback) => {
    try {
      if (typeof e === "string") {
        const res = graphState.entities.filter((value) => value.id === e);
        if (res) {
          callback(res[0]);
        }
      } else {
        callback(e);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filterByLabelAndType = (searchValue) => {
    const regex = new RegExp(searchValue, "gi");
    const test = graphState.entities.find(
      (element) => element.id === entityFrom
    );
    return graphState.entities.filter(
      ({ id, label, type }) =>
        id !== test.id &&
        type === test.type &&
        (searchValue ? label.match(regex) : true)
    );
  };

  const handleInputValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTarget(e.currentTarget.value);
    setDropdownEntities(filterByLabelAndType(e.currentTarget.value));
  };

  const handleSummaryClicked = (e: EntityDto) => {
    setSelectedEntity(selectedEntity?.id !== e.id ? e : null);
  };

  useEffect(() => {
    init(entityFrom, setEntity);
  }, [entityFrom]);

  useEffect(() => {
    init(entityTo, setEntityDest);
  }, [entityTo]);

  useEffect(() => {
    // Risks matching the ID of an entity with a different type
    const obj2Id =
      graphState.selection.length === 2
        ? // @ts-ignore
          graphState.selection.find((id) => id !== entityFrom.id)
        : null;
    const tmpSelectedEntity = obj2Id
      ? graphState.entities.find(
          // @ts-ignore
          ({ id, type }) => obj2Id === id && entityFrom.type === type
        ) || null
      : null;
    setTarget(tmpSelectedEntity?.label || "");
    setSelectedEntity(tmpSelectedEntity);
    setDropdownEntities(filterByLabelAndType(tmpSelectedEntity?.label || ""));
  }, [entity]);

  return (
    <Modal
      className={styles.modalLink}
      icon={<IconCheck width={16} height={16} fill="#FFFFFF" />}
      title="Étiqueter comme un lien"
      isOpen
      setIsOpen={hideModal}
      hasOverlay
      position={{
        top: "145px",
        right: "0",
        left: `calc(100% - ${graphState.isActivePalette ? 880 : 500}px)`,
      }}
      height="calc(100% - 177px)"
      footer={
        <>
          <Button
            onClick={close}
            type="secondary"
            className={cx(styles.buttonFooter, styles.buttonCancel)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className={cx(styles.buttonFooter, styles.buttonValidate)}
          >
            Valider
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={cx(commons.Flex, styles.containerHeader)}>
          <p className={styles.selected}>Valeur sélectionnée :</p>
          <p className={cx(styles.selected, styles.selectedValue)}>
            {entity?.label}
          </p>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="linkType">Sélectionner le type de lien</label>
          <Select
            id="linkType"
            name="linkType"
            options={linkTypeOptions}
            defaultValue={linkTypeOptions[0]}
            value={selectedLinkType}
            onChange={handleSelectLinkType}
            styles={customStyles}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="linkText">
            Personnalisation du texte du lien <span>(facultatif)</span>
          </label>
          <Input
            className={styles.inputText}
            id="linkText"
            name="linkText"
            value={linkText}
            onChange={onChangeLinkText}
          />
        </div>
        <div className={cx(styles.inputContainer, styles.switchContainer)}>
          <Switch
            inputId="isHypothesis"
            checked={isHypotheticalLink}
            setChecked={setIsHypotheticalLink}
          />
          <label htmlFor="isHypothesis">Signifier comme une hypothèse</label>
        </div>
        <div className={styles.margin}>
          {!entityTo && (
            // @ts-ignore
            <SearchEntities
              title="Objet à lier"
              subtitle="Objet à lier"
              search={target}
              handleInputValueChange={handleInputValueChange}
              dropdownEntities={dropdownEntities}
              selectedEntity={selectedEntity}
              handleSummaryClicked={handleSummaryClicked}
            />
          )}
        </div>
        <div className={styles.linkPreviewContainer}>
          <div className={styles.tilesContainer}>
            <svg className={styles.tileContainer}>
              {entity && (
                // @ts-ignore
                <Tile
                  className={styles.tile}
                  entity={entity}
                  position={{ x: 0, y: 0 }}
                  scale={0.5}
                  isDraggable={false}
                  isSelected
                  selectionTogglable={false}
                  isLinkCreatable={false}
                />
              )}
            </svg>
            <div className={styles.connexionContainer}>
              <svg>
                {entity && (entityDest || selectedEntity) && (
                  // @ts-ignore
                  <Connection
                    from={entity.id}
                    // @ts-ignore
                    to={entityDest?.id || selectedEntity?.id}
                    label={linkText || selectedLinkType.label}
                    fromPos={{ x: isInversedSens ? 287 : -48, y: -29 }}
                    toPos={{ x: isInversedSens ? -48 : 287, y: -29 }}
                    isBidirectionnal={
                      selectedLinkSens.value === linkSensOptions[1].value
                    }
                    isHypothesis={isHypotheticalLink}
                  />
                )}
              </svg>
            </div>
            <svg className={styles.tileContainer}>
              {(entityDest || selectedEntity) && (
                <Tile
                  className={cx(styles.tile, styles.tileTarget)}
                  // @ts-ignore
                  entity={entityDest || selectedEntity}
                  position={{ x: 0, y: 0 }}
                  scale={0.5}
                  isDraggable={false}
                  selectionTogglable={false}
                  isLinkCreatable={false}
                />
              )}
            </svg>
          </div>
          <div className={styles.inputLinkContainer}>
            <div className={styles.inputContainer}>
              <Select
                id="linkType"
                name="linkType"
                options={linkSensOptions}
                defaultValue={linkSensOptions[0]}
                value={selectedLinkSens}
                onChange={handleSelectLinkSens}
                styles={customLinkStyles}
              />

              {selectedLinkSens.value === "Unidirectionnel" && (
                <button
                  type="button"
                  onClick={onToggleLinkSens}
                  disabled={selectedLinkSens.value === linkSensOptions[1].value}
                >
                  <IconCycle /> Changer le sens
                </button>
              )}
            </div>
          </div>
        </div>
        <Accordion
          classNameHead={styles.accordion}
          title={
            <div className={styles.accordionTitle}>
              <IconCalendar fill="#3083F7" width={18} height={18} />
              Horodatage du lien
            </div>
          }
          isOpened
        >
          <div>
            <div className={styles.inputContainer}>
              <label htmlFor="ruleDataTags">
                Sélectionner l&apos;intervalle de temps
              </label>
              <div
                role="searchbox"
                tabIndex={0}
                className={cx(styles.headerRowSearch, styles.inputCalendar)}
                onClick={(e) => {
                  setIsHiddenCalendar(false);
                  e.stopPropagation();
                }}
                onKeyPress={(e) => {
                  setIsHiddenCalendar(false);
                  e.stopPropagation();
                }}
              >
                <div>
                  <IconCalendar fill="#3083F7" />
                  <div>
                    <p
                      className={cx({
                        [styles.placeholder]: !calendarDates[0],
                      })}
                    >
                      {!calendarDates[0] && <>Rechercher</>}
                      {calendarDates[0] && (
                        <Moment format="DD MMMM YYYY">
                          {calendarDates[0]}
                        </Moment>
                      )}
                      {calendarDates[1] && (
                        <>
                          {" "}
                          -{" "}
                          <Moment format="DD MMMM YYYY">
                            {calendarDates[1]}
                          </Moment>
                        </>
                      )}
                    </p>
                  </div>
                  {calendarDates[0] && (
                    <IconCross
                      className={styles.iconRemove}
                      fill="#3083F7"
                      onClick={(e) => {
                        setCalendarDates([null, null]);
                        e.stopPropagation();
                      }}
                    />
                  )}
                </div>
              </div>
              <div
                onClick={unhandle}
                className={cx(styles.calendar, {
                  [commons.Hidden]: isHiddenCalendar,
                })}
              >
                <DateTimePicker
                  className={cx(styles.filterCalendar, {
                    [commons.Hidden]: isHiddenCalendar,
                  })}
                  selectRange
                  allowPartialRange
                  onChange={onChangeDate}
                  toggleVisibility={() =>
                    setIsHiddenCalendar(!isHiddenCalendar)
                  }
                  value={calendarDates}
                />
              </div>
            </div>
          </div>
        </Accordion>
      </form>
    </Modal>
  );
};

export default ModalLink;
