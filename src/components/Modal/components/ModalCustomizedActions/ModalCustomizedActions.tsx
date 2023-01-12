/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { sortAlphabeticallyAsc } from "../../../../utils/general";
import ApiFactory from "../../../../API/controllers/api-factory";
import MarkingsApi from "../../../../API/controllers/markings-api";
import { TAG_TYPE_COLOR } from "../../../../constants/tags";
import {
  CUSTOMIZED_ACTION_TYPE,
  CUSTOMIZED_ACTION_CALLBACK,
  CustomizedActionsType,
} from "../../../../constants/customization";
import { ENTITY_TYPE_DETAILS } from "../../../../constants/entity-related";
import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";
import { useAppDispatch } from "../../../../store/hooks";
import {
  ActionState,
  addAction,
  editAction,
} from "../../../../store/customizedActions";

import Modal from "../../../../components/Modal/Modal";
import Accordion from "../../../../components/Accordion/Accordion";
import Autocomplete from "../../../../components/Inputs/Autocomplete/Autocomplete";
import Switch from "../../../../components/Inputs/Switch/Switch";
import Button from "../../../../components/Buttons/Button/Button";
import Select from "react-select";
import Input from "../../../../components/Input/Input";

import IconPens from "../../../../assets/images/icons/IconPencilEdit";
import IconSettings from "../../../../assets/images/icons/IconSettings";
import IconCross from "../../../../assets/images/icons/IconCross";
import IconPlusOutline from "../../../../assets/images/icons/IconPlusOutline";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import cx from "classnames";
import styles from "./styles.scss";

interface ModalCustomizedActionsProps {
  className?: string;
  action?: ActionState;
}

const ModalCustomizedActions = () => {
  const {
    modalProps,
    hideModal,
  }: { modalProps: ModalCustomizedActionsProps; hideModal: () => void } =
    useGlobalModalContext();

  const { className, action } = modalProps;

  const dispatch = useAppDispatch();
  const [tags, setTags] = useState<any[]>([]);
  const [label, setLabel] = useState(action ? action.label : "");
  const [path, setPath] = useState(action ? action.path : "");
  const [apiKey, setApiKey] = useState(action ? action.apiKey : undefined);
  const [headers, setHeaders] = useState(
    action && action.headers ? Object.entries(action.headers) : undefined
  );
  const [requestBody, setRequestBody] = useState(
    action ? action.requestBody : undefined
  );
  const [callbackMapping, setCallbackMapping] = useState(
    action ? action.callbackMapping : undefined
  );
  const [switchChecked, setSwitchChecked] = useState(
    action ? action.enabled : false
  );
  const [selectedTagOptions, setSelectedTagOptions] = useState<
    any[] | undefined
  >(action ? action.tags : undefined);
  const [selectedKeyOptions, setSelectedKeyOptions] = useState<
    string[] | undefined
  >(action ? action.keys : undefined);
  const [selectedObjectTypeOptions, setSelectedObjectTypeOptions] = useState<
    any[] | undefined
  >(
    action
      ? action.objectTypes.map((o) => ({
          label: ENTITY_TYPE_DETAILS[o].label,
          details: ENTITY_TYPE_DETAILS[o],
          id: o,
        }))
      : undefined
  );

  // Autocomplete options
  const keys = ["multimedia"];
  const objectTypes = Object.keys(ENTITY_TYPE_DETAILS)
    .map((key) => ({
      label: ENTITY_TYPE_DETAILS[key].label,
      details: ENTITY_TYPE_DETAILS[key],
      id: parseInt(key, 10),
    }))
    .sort(sortAlphabeticallyAsc("label"));

  // Select options and style
  const actionTypes = Object.keys(CUSTOMIZED_ACTION_TYPE).map((key) => ({
    label: CUSTOMIZED_ACTION_TYPE[key],
    id: key,
    value: key,
  }));
  const [selectedActionType, setSelectedActionType] = useState<any | undefined>(
    action
      ? {
          label: CUSTOMIZED_ACTION_TYPE[action.actionType],
          id: action.actionType,
          value: action.actionType,
        }
      : undefined
  );
  const options = [
    {
      id: 0,
      label: "Aucun",
      value: 0,
    },
  ].concat(
    Object.keys(CUSTOMIZED_ACTION_CALLBACK).map((key) => ({
      id: key,
      ...CUSTOMIZED_ACTION_CALLBACK[key],
      value: key,
    }))
  );
  const [selectedCallback, setSelectedCallback] = useState(
    action && action.callback
      ? {
          ...CUSTOMIZED_ACTION_CALLBACK[action.callback],
          id: action.callback,
          value: action.callback,
        }
      : options[0]
  );
  const methods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "PURGE",
    "LINK",
    "UNLINK",
  ];
  const requestMethodOptions = methods.map((m) => ({
    id: m,
    label: m,
    value: m,
  }));
  const [selectedRequestMethod, setSelectedRequestMethod] = useState(
    action
      ? {
          id: action.requestMethod,
          label: action.requestMethod,
          value: action.requestMethod,
        }
      : requestMethodOptions[0]
  );
  const callbackResponseFormat = [
    { label: "JSON", value: "JSON" },
    { label: "XML", value: "XML" },
    { label: "Text", value: "Text" },
  ];
  const [selectedCallbackResponseFormat, setSelectedCallbackResponseFormat] =
    useState(
      action
        ? {
            label: action.callbackFormat,
            value: action.callbackFormat,
          }
        : callbackResponseFormat[0]
    );
  // Select style
  const customStyles = {
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
  const handleSelectCallback = (option) => {
    setSelectedCallback(option);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const apiClient = ApiFactory.create<MarkingsApi>("MarkingsApi");
        const res = await apiClient.listMarkings();
        const tagsFiltered = res.filter(
          (t) => t.type !== 5 && t.type !== 6 && t.type !== 3
        );
        setTags(tagsFiltered);
      } catch (error) {
        // @ts-ignore
        toast.error(error);
      }
    };
    init();
  }, []);

  // useEffect(async () => {
  //   try {
  //     const res = await init();
  //     // Tags of type "Timbre" aren't used and get only user tags
  //     const tagsFiltered = res.filter(
  //       (t) => t.type !== 5 && t.type !== 6 && t.type !== 3
  //     );
  //     setTags(tagsFiltered);
  //     return res;
  //   } catch (e) {
  //     toast.error(e);
  //   }
  // }, []);

  useEffect(() => {
    setLabel(action ? action.label : "");
    setPath(action ? action.path : "");
    setApiKey(action ? action.apiKey : undefined);
    setHeaders(
      action && action.headers ? Object.entries(action.headers) : undefined
    );
    setRequestBody(action ? action.requestBody : undefined);
    setCallbackMapping(action ? action.callbackMapping : undefined);
    setSwitchChecked(action ? action.enabled : false);
    setSelectedTagOptions(action ? action.tags : undefined);
    setSelectedKeyOptions(action ? action.keys : undefined);
    setSelectedObjectTypeOptions(
      action
        ? action.objectTypes.map((o) => ({
            label: ENTITY_TYPE_DETAILS[o].label,
            details: ENTITY_TYPE_DETAILS[o],
            id: o,
          }))
        : undefined
    );
    setSelectedActionType(
      action
        ? {
            label: CUSTOMIZED_ACTION_TYPE[action.actionType],
            id: action.actionType,
            value: action.actionType,
          }
        : actionTypes[0]
    );
    setSelectedCallback(
      action && action.callback
        ? {
            ...CUSTOMIZED_ACTION_CALLBACK[action.callback],
            id: action.callback,
            value: action.callback,
          }
        : options[0]
    );
    setSelectedRequestMethod(
      action
        ? {
            id: action.requestMethod,
            label: action.requestMethod,
            value: action.requestMethod,
          }
        : requestMethodOptions[0]
    );
    setSelectedCallbackResponseFormat(
      action
        ? {
            label: action.callbackFormat,
            value: action.callbackFormat,
          }
        : callbackResponseFormat[0]
    );
  }, [action]);

  const close = () => {
    hideModal();
  };

  const handleModalToggle = (opened: boolean) => {
    if (!opened) {
      close();
    }
  };

  const addHeader = () => {
    const newHeaders = headers ? [...headers] : [];
    newHeaders.push(["", ""]);
    setHeaders(newHeaders);
  };

  const onChangeLabel = (e) => {
    setLabel(e.target.value);
  };
  const onChangePath = (e) => {
    setPath(e.target.value);
  };
  const onChangeApiKey = (e) => {
    setApiKey(e.target.value);
  };
  const onChangeRequestBody = (e) => {
    setRequestBody(e.target.value);
  };
  const onChangeCallbackMapping = (e) => {
    setCallbackMapping(e.target.value);
  };
  const onChangeHeader = (e, isTitle: boolean, index: number) => {
    if (headers && headers[index]) {
      const newHeaders = [...headers];
      if (isTitle) {
        newHeaders[index][0] = e.target.value;
      } else {
        newHeaders[index][1] = e.target.value;
      }
      setHeaders(newHeaders);
    }
  };

  const validate = (el): boolean => {
    if (!el) {
      toast.error("Données inconnues");
      return false;
    }
    if (!el.actionType) {
      toast.error("Sélectionner un type d'action");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const actionElement = {
      keys: selectedKeyOptions || [],
      label,
      enabled: switchChecked,
      tags: selectedTagOptions || [],
      objectTypes: selectedObjectTypeOptions
        ? selectedObjectTypeOptions.map((o) => o.id)
        : [],
      actionType: selectedActionType?.id,
      path,
      callback: selectedCallback.id !== 0 ? selectedCallback.id : undefined,
      apiKey,
      headers: headers ? Object.fromEntries(headers) : undefined,
      requestMethod: selectedRequestMethod.value,
      requestBody,
      callbackFormat: selectedCallbackResponseFormat.value,
      callbackMapping,
    };
    if (validate(actionElement)) {
      // Edit
      if (action && action.id) {
        const editedAction = {
          id: action.id,
          ...actionElement,
        };
        dispatch(editAction({ id: action.id, action: editedAction }));
        close();
      }
      // Create
      if (!action) {
        dispatch(addAction(actionElement));
        close();
      }
    }
  };

  const renderAutocompleteOption = (option, onSelect) => (
    <button
      type="button"
      className={cx(styles.optionElementInteractive)}
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

  const renderAutocompleteObjectOption = (option, onSelect) => (
    <button
      type="button"
      className={cx(
        styles.optionElementInteractive,
        styles.optionElementProperties
      )}
      onClick={onSelect}
    >
      <span className={styles.autocompleteObjectOption}>
        {option.details.icon} {option.label}
      </span>
    </button>
  );

  return (
    <Modal
      className={className}
      icon={<IconPens fill="#FFFFFF" />}
      title="Éditeur d'actions"
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
      <form onSubmit={handleSubmit}>
        <div>
          <div className={styles.inputContainer}>
            <label htmlFor="actionLabel">Libellé</label>
            <Input
              className={styles.inputText}
              id="actionLabel"
              name="label"
              value={label}
              onChange={onChangeLabel}
            />
          </div>
          <Accordion
            classNameHead={styles.accordion}
            title={
              <div className={styles.accordionTitle}>
                <IconSettings fill="#3083F7" width={18} height={18} />
                Règles de l&apos;action
              </div>
            }
            isOpened
          >
            <div>
              <div className={styles.inputContainer}>
                <label htmlFor="actionKeys">Module</label>
                <Autocomplete
                  inputId="actionKeys"
                  className={{ input: styles.input }}
                  options={keys}
                  defaultOptions={action ? action.keys : undefined}
                  multiple
                  selectedOptions={selectedKeyOptions}
                  setSelectedOptions={setSelectedKeyOptions}
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="actionTags">Marquant(s)</label>
                <Autocomplete
                  inputId="actionTags"
                  className={{ input: styles.input }}
                  options={tags}
                  defaultOptions={action ? action.tags : undefined}
                  multiple
                  renderOption={renderAutocompleteOption}
                  renderTag={renderAutocompleteTag}
                  selectedOptions={selectedTagOptions}
                  setSelectedOptions={setSelectedTagOptions}
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="actionObjectTypes">Type(s) d&apos;objets</label>
                <Autocomplete
                  inputId="actionObjectTypes"
                  className={{ input: styles.input }}
                  options={objectTypes}
                  defaultOptions={
                    action
                      ? action.objectTypes.map((o) => ({
                          label: ENTITY_TYPE_DETAILS[o].label,
                          details: ENTITY_TYPE_DETAILS[o],
                          id: o,
                        }))
                      : undefined
                  }
                  multiple
                  renderOption={renderAutocompleteObjectOption}
                  selectedOptions={selectedObjectTypeOptions}
                  setSelectedOptions={setSelectedObjectTypeOptions}
                />
              </div>
            </div>
          </Accordion>
          <Accordion
            classNameHead={styles.accordion}
            title={
              <div className={styles.accordionTitle}>
                <IconSettings fill="#3083F7" width={18} height={18} />
                Définition de l&apos;action
              </div>
            }
            isOpened
          >
            <div>
              <div className={styles.inputContainer}>
                <label htmlFor="actionActionType">Type d&apos;action</label>
                <Select
                  id="actionActionType"
                  name="actionType"
                  placeholder=""
                  options={actionTypes}
                  value={selectedActionType}
                  onChange={setSelectedActionType}
                  styles={customStyles}
                />
              </div>
              {(selectedActionType?.id === CustomizedActionsType.API ||
                selectedActionType?.id === "1") && (
                <>
                  <div className={styles.inputContainer}>
                    <label htmlFor="actionApiKey">Clé d&apos;api</label>
                    <Input
                      id="actionApiKey"
                      className={styles.inputText}
                      name="apiKey"
                      value={apiKey}
                      onChange={onChangeApiKey}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="actionRequestMethod">Méthode Http</label>
                    <Select
                      id="actionRequestMethod"
                      name="requestMethod"
                      options={requestMethodOptions}
                      defaultValue={requestMethodOptions[0]}
                      value={selectedRequestMethod}
                      onChange={setSelectedRequestMethod}
                      styles={customStyles}
                    />
                  </div>
                  <Accordion
                    classNameHead={styles.accordionSecondary}
                    title="En-tête"
                    isOpened
                  >
                    <div>
                      {headers?.map((h, index) => (
                        <div
                          key={index}
                          className={styles.headerInputContainer}
                        >
                          <div className={styles.inputContainer}>
                            <label htmlFor={`headerTitle${index}`}>Titre</label>
                            <Input
                              id={`headerTitle${index}`}
                              className={styles.inputText}
                              value={h[0]}
                              onChange={(e) => onChangeHeader(e, true, index)}
                            />
                          </div>
                          <div className={styles.inputContainer}>
                            <label htmlFor={`headerValue${index}`}>
                              Valeur
                            </label>
                            <Input
                              id={`headerValue${index}`}
                              className={styles.inputText}
                              value={h[1]}
                              onChange={(e) => onChangeHeader(e, false, index)}
                            />
                          </div>
                        </div>
                      ))}
                      <div
                        className={cx(
                          commons.clickable,
                          commons.Hoverable,
                          styles.addFieldButton
                        )}
                        onClick={addHeader}
                      >
                        <IconPlusOutline />
                        <span>Ajouter un en-tête</span>
                      </div>
                      <div className={styles.divider} />
                    </div>
                  </Accordion>
                  <div className={styles.inputContainer}>
                    <label htmlFor="actionRequestBody">
                      Corps de la requête
                    </label>
                    <Input
                      id="actionRequestBody"
                      inputType="textarea"
                      className={styles.inputText}
                      name="requestBody"
                      value={requestBody}
                      onChange={onChangeRequestBody}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="actionPath">Url du service</label>
                    <Input
                      id="actionPath"
                      className={styles.inputText}
                      name="path"
                      value={path}
                      onChange={onChangePath}
                    />
                  </div>
                </>
              )}
              <div className={styles.inputContainer}>
                <label htmlFor="actionCallback">Callback</label>
                <Select
                  id="actionCallback"
                  name="callback"
                  options={options}
                  defaultValue={options[0]}
                  value={selectedCallback}
                  onChange={handleSelectCallback}
                  styles={customStyles}
                />
              </div>
              {selectedCallback?.id !== options[0].id && (
                <>
                  <div className={styles.inputContainer}>
                    <label htmlFor="actionCallbackResponseFormat">
                      Format du retour
                    </label>
                    <Select
                      id="actionCallbackResponseFormat"
                      name="callbackFormat"
                      options={callbackResponseFormat}
                      defaultValue={callbackResponseFormat[0]}
                      value={selectedCallbackResponseFormat}
                      onChange={setSelectedCallbackResponseFormat}
                      styles={customStyles}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="actionCallbackResponseMapping">
                      Mapping de la réponse
                    </label>
                    <Input
                      id="actionCallbackResponseMapping"
                      inputType="textarea"
                      placeholder="response.props.subprops;response.otherprops"
                      className={styles.inputText}
                      name="callbackMapping"
                      value={callbackMapping}
                      onChange={onChangeCallbackMapping}
                    />
                  </div>
                </>
              )}
            </div>
          </Accordion>
          <div className={styles.inputContainer}>
            <label htmlFor="actionEnabled">L&apos;action est :</label>
            <div className={styles.switchContainer}>
              <Switch
                inputId="actionEnabled"
                defaultActive={action ? action.enabled : undefined}
                checked={switchChecked}
                setChecked={setSwitchChecked}
              />
              <span
                className={cx(styles.switchCheckedText, {
                  [styles.switchChecked]: switchChecked,
                })}
              >
                {switchChecked ? "activée" : "désactivée"}
              </span>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalCustomizedActions;
