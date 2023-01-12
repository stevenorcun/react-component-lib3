/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ApiFactory from "../../../API/controllers/api-factory";
import MarkingsApi from "../../../API/controllers/markings-api";
import { TAG_TYPE_COLOR } from "../../../constants/tags";
import { useAppDispatch } from "../../../store/hooks";

import Modal from "../../../components/Modal/Modal";
import Autocomplete from "../../../components/Inputs/Autocomplete/Autocomplete";
import Switch from "../../../components/Inputs/Switch/Switch";
import Button from "../../../components/Buttons/Button/Button";
import Input from "../../../components/Input/Input";

import IconPens from "../../../assets/images/icons/IconPencilEdit";
import IconCross from "../../../assets/images/icons/IconCross";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import cx from "classnames";
import styles from "./styles.scss";
import {
  addExternalApp,
  editExternalApp,
  ExternalAppState,
} from "../../../store/externalApps";

interface ModalCustomizedActionsProps {
  className?: string;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  app?: ExternalAppState;
}

const defaultProps: ModalCustomizedActionsProps = {
  className: undefined,
  isOpen: false,
  setIsOpen: undefined,
  app: undefined,
};

const ModalExternalApps = ({
  className,
  isOpen,
  setIsOpen,
  app,
}: ModalCustomizedActionsProps) => {
  const dispatch = useAppDispatch();
  const [tags, setTags] = useState<any[]>([]);
  const [label, setLabel] = useState(app?.label || "");
  const [url, setUrl] = useState(app?.url || "");

  const [switchEnabled, setSwitchEnabled] = useState(app?.enabled || false);
  const [alwaysVisible, setAlwaysVisible] = useState(
    app?.isAlwaysVisible || false
  );
  const [selectedTagOptions, setSelectedTagOptions] = useState<
    any[] | undefined
  >(app?.tags || undefined);

  // Select style
  // const customStyles = {
  //     control: (provided) => ({
  //         ...provided,
  //         border: '1px solid #EDEDEE',
  //         boxShadow: '0px 7.58719px 34px rgb(42 46 115 / 5%)',
  //         borderRadius: '4px',
  //     }),
  //     indicatorSeparator: () => ({
  //         display: 'none',
  //     }),
  //     indicatorsContainer: (provided) => ({
  //         ...provided,
  //         paddingRight: '8px',
  //     }),
  //     dropdownIndicator: (provided) => ({
  //         ...provided,
  //         padding: 'unset',
  //         width: 12,
  //         height: 12,
  //         alignItems: 'center',
  //     }),
  //     valueContainer: (provided) => ({
  //         ...provided,
  //         fontSize: '12px',
  //         fontWeight: 700,
  //     }),
  //     menu: (provided) => ({
  //         ...provided,
  //         width: '100%',
  //     }),
  // };

  const init = async () => {
    const apiClient = ApiFactory.create<MarkingsApi>("MarkingsApi");
    const res = await apiClient.listMarkings();
    return res;
  };

  useEffect(() => {
    init()
      .then((res) => {
        // Tags of type "Timbre" aren't used and get only user tags
        const tagsFiltered = res.filter(
          (t) => t.type !== 5 && t.type !== 6 && t.type !== 3
        );
        setTags(tagsFiltered);
        return res;
      })
      .catch((e) => {
        toast.error(e);
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLabel(app?.label || "");
      setUrl(app?.url || "");
      setSwitchEnabled(app?.enabled || false);
      setSelectedTagOptions(app?.tags || undefined);
    }
  }, [app, isOpen]);

  const close = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const onChangeLabel = (e) => {
    setLabel(e.target.value);
  };
  const onUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const validate = (el): boolean => {
    if (!el) {
      toast.error("Données inconnues");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const appElement = {
      label,
      enabled: switchEnabled,
      tags: selectedTagOptions || [],
      url: url,
      isAlwaysVisible: alwaysVisible,
    };
    if (validate(appElement)) {
      // Edit
      if (app && app.id) {
        const editedApp = {
          id: app.id,
          ...appElement,
        };
        dispatch(editExternalApp({ id: app.id, app: editedApp }));
        close();
      }
      // Create
      if (!app) {
        dispatch(addExternalApp(appElement));
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

  // const renderAutocompleteObjectOption = (option, onSelect) => (
  //     <button
  //         type="button"
  //         className={cx(
  //             styles.optionElementInteractive,
  //             styles.optionElementProperties
  //         )}
  //         onClick={onSelect}
  //     >
  //         <span className={styles.autocompleteObjectOption}>
  //             {option.details.icon} {option.label}
  //         </span>
  //     </button>
  // );

  return (
    <Modal
      className={className}
      icon={<IconPens fill="#FFFFFF" />}
      title="Éditeur d'application"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
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
          <div>
            <div className={styles.inputContainer}>
              <label htmlFor="actionTags">Marquant(s)</label>
              <Autocomplete
                inputId="actionTags"
                // @ts-ignore
                className={{ input: styles.input }}
                options={tags}
                defaultOptions={app ? app.tags : undefined}
                multiple
                renderOption={renderAutocompleteOption}
                renderTag={renderAutocompleteTag}
                selectedOptions={selectedTagOptions}
                setSelectedOptions={setSelectedTagOptions}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="appUrl">Url de l'application</label>
              <Input
                id="appUrl"
                className={styles.inputText}
                name="url"
                value={url}
                onChange={onUrlChange}
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="appRequiresCase">Requiert affaire ouverte :</label>
            <div className={styles.switchContainer}>
              <Switch
                inputId="appRequiresCase"
                defaultActive={app ? app.isAlwaysVisible : undefined}
                checked={alwaysVisible}
                setChecked={setAlwaysVisible}
              />
              <span
                className={cx(styles.switchCheckedText, {
                  [styles.switchChecked]: alwaysVisible,
                })}
              >
                {alwaysVisible ? "oui" : "non"}
              </span>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="appEnabled">L&apos;application est :</label>
            <div className={styles.switchContainer}>
              <Switch
                inputId="appEnabled"
                defaultActive={app ? app.enabled : undefined}
                checked={switchEnabled}
                setChecked={setSwitchEnabled}
              />
              <span
                className={cx(styles.switchCheckedText, {
                  [styles.switchChecked]: switchEnabled,
                })}
              >
                {switchEnabled ? "activée" : "désactivée"}
              </span>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

ModalExternalApps.defaultProps = defaultProps;

export default ModalExternalApps;
