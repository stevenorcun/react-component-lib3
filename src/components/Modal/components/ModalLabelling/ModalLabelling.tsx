/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";

import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import {
  ENTITY_PROPERTY_DETAILS,
  ENTITY_TYPE_DETAILS,
} from "../../../../constants/entity-related";

import Modal from "../../../../components/Modal/Modal";
import Button from "../../../../components/Buttons/Button/Button";
import Input from "../../../../components/Input/Input";

import IconPens from "../../../../assets/images/icons/IconPencilEdit";

import cx from "classnames";
import styles from "./styles.scss";

interface ModalLabellingProps {
  className?: string;
  value: any;
  entity: EntityDto;
}

const ModalLabelling = () => {
  const {
    modalProps,
    hideModal,
  }: { modalProps: ModalLabellingProps; hideModal: () => void } =
    useGlobalModalContext();

  const { className, value, entity } = modalProps;

  const [propertyValue, setPropertyValue] = useState(value);

  // Select options and style
  const relatedEntities = entity?.related?.entities?.values
    ? entity?.related?.entities?.values.map((e) => {
        return {
          value: e.id,
          label: e.value.label,
          icon: e.value.type
            ? ENTITY_TYPE_DETAILS[e.value.type]?.icon
            : undefined,
        };
      })
    : [];
  const options = [
    {
      value: entity?.id,
      label: entity?.label,
      icon: entity?.type ? ENTITY_TYPE_DETAILS[entity.type]?.icon : undefined,
    },
    ...relatedEntities,
  ];
  const entityPropertiesDetailsAsArray = Object.keys(
    ENTITY_PROPERTY_DETAILS
  ).reduce(
    (
      acc: Array<{
        value: keyof EntityDto;
        label: string;
        icon?: React.ReactNode;
      }>,
      propertyKey: keyof EntityDto
    ) => {
      if (
        ENTITY_PROPERTY_DETAILS[propertyKey] &&
        !ENTITY_PROPERTY_DETAILS[propertyKey]?.isMeta
      )
        acc.push({
          value: propertyKey,
          label: ENTITY_PROPERTY_DETAILS[propertyKey].label,
          icon: ENTITY_PROPERTY_DETAILS[propertyKey]?.icon,
        });
      return acc;
    },
    []
  );
  const [selectedObject, setSelectedObject] = useState(options[0]);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
  };
  const customStylesProperties = {
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
      fontSize: "12px",
    }),
  };
  const handleSelectObject = (option) => {
    setSelectedObject(option);
  };
  const handleSelectProperty = (option) => {
    setSelectedProperty(option);
  };

  const close = () => {
    hideModal();
  };

  const handleModalToggle = (opened: boolean) => {
    if (!opened) {
      close();
    }
  };

  const onChangePropertyValue = (e) => {
    setPropertyValue(e.target.value);
  };

  const handleSubmit = () => {
    // TODO Waiting backend to edit object
    close();
  };

  const formatOptionObject = (option, labelMeta) => {
    if (labelMeta.context === "value") {
      return option.label;
    }
    return (
      <span className={styles.customOption}>
        {option.icon} {option.label}
      </span>
    );
  };

  const formatCreateLabel = (inputValue: string) => {
    return `Ajouter "${inputValue}"`;
  };

  useEffect(() => {
    setSelectedObject(options[0]);
  }, [entity]);

  useEffect(() => {
    setPropertyValue(value);
  }, [value]);

  return (
    <Modal
      className={className}
      icon={<IconPens fill="#FFFFFF" />}
      title="Étiqueter comme une propriété"
      isOpen
      setIsOpen={handleModalToggle}
      hasOverlay={false}
      position={{ top: "155px", right: "0", left: "unset" }}
      height="calc(100% - 260px)"
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
      <form className={styles.modalContent} onSubmit={handleSubmit}>
        <div className={styles.selectedValue}>
          Valeur sélectionnée : <span>{value}</span>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="object">Objet concerné</label>
          <Select
            id="object"
            name="object"
            options={options}
            defaultValue={options[0]}
            value={selectedObject}
            onChange={handleSelectObject}
            styles={customStyles}
            formatOptionLabel={formatOptionObject}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.inputContainer}>
            <label htmlFor="property">Propriété concernée</label>
            <CreatableSelect
              id="property"
              name="property"
              placeholder=""
              options={entityPropertiesDetailsAsArray}
              value={selectedProperty}
              onChange={handleSelectProperty}
              styles={customStylesProperties}
              formatOptionLabel={formatOptionObject}
              formatCreateLabel={formatCreateLabel}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="propertyValue">Valeur</label>
            <Input
              className={styles.inputText}
              id="propertyValue"
              name="propertyValue"
              value={propertyValue}
              onChange={onChangePropertyValue}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalLabelling;
