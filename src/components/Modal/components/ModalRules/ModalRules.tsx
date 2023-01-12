/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";

import ApiFactory from "../../../../API/controllers/api-factory";
import MarkingsApi from "../../../../API/controllers/markings-api";
import { TAG_TYPE_COLOR } from "../../../../constants/tags";
import { useAppDispatch } from "../../../../store/hooks";
import { addRule, editRule } from "../../../../store/tags";

import Modal from "../../../../components/Modal/Modal";
import Accordion from "../../../../components/Accordion/Accordion";
import Autocomplete from "../../../../components/Inputs/Autocomplete/Autocomplete";
import Switch from "../../../../components/Inputs/Switch/Switch";
import Button from "../../../../components/Buttons/Button/Button";
import Select from "react-select";

import IconPens from "../../../../assets/images/icons/IconPencilEdit";
import IconSettings from "../../../../assets/images/icons/IconSettings";
import IconCross from "../../../../assets/images/icons/IconCross";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import cx from "classnames";
import styles from "./styles.scss";

interface ModalRulesProps {
  className?: string;
  rule?: {
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
  };
}

const ModalRules = () => {
  const {
    modalProps,
    hideModal,
  }: { modalProps: ModalRulesProps; hideModal: () => void } =
    useGlobalModalContext();

  const { className, rule } = modalProps;

  const dispatch = useAppDispatch();
  const [allTags, setAllTags] = useState<any[]>([]);
  const [filteredTags, setFilteredTags] = useState(allTags);
  const [switchChecked, setSwitchChecked] = useState(
    rule ? rule.rule.isDataShown : false
  );
  const [selectedControlOptions, setSelectedControlOptions] = useState<
    any[] | undefined
  >(rule ? rule.rule.controlTags : undefined);
  const [selectedDataOptions, setSelectedDataOptions] = useState<
    any[] | undefined
  >(rule ? rule.rule.dataTags : undefined);
  const [reference, setReference] = useState(
    `#${Math.ceil(Math.random() * 1000000000)}`
  );

  // Select options and style
  const options = [
    { value: "context", label: "Contexte" },
    { value: "user", label: "Utilisateur" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(
    rule && rule.rule.controlTags[0].type === 6 ? options[0] : options[1]
  );
  // Select style
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "30%",
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
      width: "auto",
    }),
  };
  const handleSelectCategory = (option) => {
    setSelectedCategory(option);
  };

  const init = async () => {
    const apiClient = ApiFactory.create<MarkingsApi>("MarkingsApi");
    const res = await apiClient.listMarkings();
    return res;
  };

  useEffect(() => {
    init()
      .then((res) => {
        // Tags of type "Timbre" aren't used in rules
        const allTagsFiltered = res.filter((t) => t.type !== 5);
        setAllTags(allTagsFiltered);
        return res;
      })
      .catch((e) => {
        toast.error(e);
      });
  }, []);

  useEffect(() => {
    switch (selectedCategory.value) {
      case "user":
        setFilteredTags(allTags.filter((t) => t.type !== 6 && t.type !== 3));
        break;
      case "context":
        setFilteredTags(allTags.filter((t) => t.type === 6));
        break;
      default:
        break;
    }
  }, [allTags, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(
      rule && rule.rule.controlTags[0].type === 6 ? options[0] : options[1]
    );
    setSwitchChecked(rule ? rule.rule.isDataShown : false);
    setSelectedControlOptions(rule ? rule.rule.controlTags : undefined);
    setSelectedDataOptions(rule ? rule.rule.dataTags : undefined);
    setReference(`#${Math.ceil(Math.random() * 1000000000)}`);
  }, [rule]);

  const close = () => {
    hideModal();
  };

  const handleModalToggle = (opened: boolean) => {
    if (!opened) {
      close();
    }
  };

  const handleSubmit = () => {
    // Edit
    if (rule && rule.id) {
      const editedRule = {
        id: rule.id,
        reference: rule.reference,
        rule: {
          isDataShown: switchChecked,
          controlTags: selectedControlOptions || [],
          dataTags: selectedDataOptions || [],
        },
      };
      dispatch(editRule({ id: rule.id, rule: editedRule }));
      close();
    }
    if (!rule) {
      const addedRule = {
        reference,
        rule: {
          isDataShown: switchChecked,
          controlTags: selectedControlOptions || [],
          dataTags: selectedDataOptions || [],
        },
      };
      dispatch(addRule(addedRule));
      close();
    }
  };

  const renderAutocompleteOption = (option, onSelect) => (
    <button
      type="button"
      className={styles.optionElementInteractive}
      onClick={onSelect}
    >
      <span
        className={cx(commons.tag)}
        style={{ backgroundColor: TAG_TYPE_COLOR[option.type] }}
      >
        {option.label}
      </span>
    </button>
  );
  const renderAutocompleteTag = (option, onClose) => (
    <div
      className={cx(commons.tag, styles.inputTagElement)}
      style={{ backgroundColor: TAG_TYPE_COLOR[option.type] }}
    >
      <span className={styles.inputTagElementLabel}>{option.label}</span>
      <IconCross onClick={onClose} />
    </div>
  );

  return (
    <Modal
      className={className}
      icon={<IconPens fill="#FFFFFF" />}
      title="Éditeur de règle"
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
      <div className={cx(styles.inputContainer)}>
        <label>Numéro de la règle</label>
        <span>{rule ? <>{rule.reference}</> : <>{reference}</>}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <Accordion
          classNameHead={styles.accordion}
          title={
            <div className={styles.accordionTitle}>
              <IconSettings fill="#3083F7" width={18} height={18} />
              Grammaire de la règle
            </div>
          }
          isOpened
        >
          <div>
            <div className={styles.inputContainer}>
              <label htmlFor="tagCategory">Si</label>
              <Select
                id="tagCategory"
                name="category"
                options={options}
                defaultValue={options[1]}
                value={selectedCategory}
                onChange={handleSelectCategory}
                styles={customStyles}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="ruleTags">
                possède <span>(Marquant)</span>
              </label>
              <Autocomplete
                inputId="ruleTags"
                className={{ input: styles.input }}
                options={filteredTags}
                defaultOptions={rule ? rule.rule.controlTags : undefined}
                multiple
                renderOption={renderAutocompleteOption}
                renderTag={renderAutocompleteTag}
                selectedOptions={selectedControlOptions}
                setSelectedOptions={setSelectedControlOptions}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="ruleDataShown">Alors la donnée sera :</label>
              <div className={styles.switchContainer}>
                <Switch
                  inputId="ruleDataShown"
                  defaultActive={rule ? rule.rule.isDataShown : undefined}
                  checked={switchChecked}
                  setChecked={setSwitchChecked}
                />
                <span
                  className={cx(styles.switchCheckedText, {
                    [styles.switchChecked]: switchChecked,
                  })}
                >
                  {switchChecked ? "disponible" : "bloquée"}
                </span>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="ruleDataTags">
                Pour le marquant de donnée <span>(Marquant)</span>
              </label>
              <Autocomplete
                inputId="ruleDataTags"
                className={{ input: styles.input }}
                options={allTags.filter(
                  (t) => t.type !== 1 && t.type !== 4 && t.type !== 6
                )}
                defaultOptions={rule ? rule.rule.dataTags : undefined}
                multiple
                renderOption={renderAutocompleteOption}
                renderTag={renderAutocompleteTag}
                selectedOptions={selectedDataOptions}
                setSelectedOptions={setSelectedDataOptions}
              />
            </div>
          </div>
        </Accordion>
      </form>
    </Modal>
  );
};

export default ModalRules;
