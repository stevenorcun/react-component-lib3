import React, { useState } from "react";
import IconInboxSearch from "../../../../../assets/images/icons/IconInboxSearch";
import IconCross from "../../../../../assets/images/icons/IconCrossBlue";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import { BrowserSearchTemplate } from "../../../../../constants/browser-related";
import { unhandle } from "../../../../../utils/DOM";
import styles from "./CreateFormTemplate.scss";

interface CreateBrowserFormTemplateModalProps {
  templateSearchValue: string;
  onClose: () => void;
  onConfirm: ({ value }: { value: string }) => void;
}

export const ClickAwayOverlay = ({
  onClick,
  className,
  children,
}: {
  onClick: React.MouseEventHandler;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cx(styles.Wrapper, className)} onClick={onClick}>
    {children}
  </div>
);

export const CreateBrowserFormTemplateModal = ({
  templateSearchValue,
  onClose,
  onConfirm,
}: CreateBrowserFormTemplateModalProps) => {
  const [inputValue, setInputValue] = useState(templateSearchValue);

  const handleConfirm = (e) => {
    onConfirm({ value: inputValue });
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  return (
    <ClickAwayOverlay onClick={onClose}>
      <div
        onClick={unhandle}
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          styles.Container
        )}
      >
        <div className={cx(commons.Flex, styles.Header)}>
          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Title
            )}
          >
            <IconInboxSearch fill="#FFFFFF" />
            <span>Enregistrer une nouvelle requête</span>
          </div>
          <div className={styles.CloseButton} onClick={onClose}>
            <IconCross fill="#FFFFFF" />
          </div>
        </div>
        <div className={cx(styles.Body)}>
          <div className={cx(styles.Label)}>
            Saisir le nom de la nouvelle requête
          </div>
          <input
            className={cx(styles.Input)}
            placeholder="Nom de la nouvelle requête"
            value={inputValue}
            onChange={handleChange}
          />

          <div className={cx(styles.Footer)}>
            <button className={styles.Cancel} onClick={onClose}>
              Annuler
            </button>
            <button className={styles.Confirm} onClick={handleConfirm}>
              Enregistrer la requête
            </button>
          </div>
        </div>
      </div>
    </ClickAwayOverlay>
  );
};

interface OverwritePrivateBrowserFormTemplateModalProps {
  loadedTemplate?: BrowserSearchTemplate;
  onClose: () => void;
  onConfirm: ({ isOverwriting }: { isOverwriting: boolean }) => void;
}

export const OverwritePrivateBrowserFormTemplateModal = ({
  loadedTemplate,
  onClose,
  onConfirm,
}: OverwritePrivateBrowserFormTemplateModalProps) => {
  const [isOverwriting, setIsOverwriting] = useState(true);

  const toggleOverwriting = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOverwriting(e.target.name === "overwrite");
  };

  // TODO submit event / use a form
  const handleConfirm = () => {
    onConfirm({ isOverwriting });
  };

  return (
    <ClickAwayOverlay onClick={onClose}>
      <div
        onClick={unhandle}
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          styles.Container
        )}
      >
        <div className={cx(commons.Flex, styles.Header)}>
          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Title
            )}
          >
            <IconInboxSearch fill="#FFFFFF" />
            <span>Enregistrer une nouvelle requête</span>
          </div>
          <div className={styles.CloseButton} onClick={onClose}>
            <IconCross fill="#FFFFFF" />
          </div>
        </div>

        <div className={styles.Body}>
          <div className={styles.Label}>
            La requête &quot;
            {loadedTemplate?.title}
            &quot; a été modifiée, souhaitez-vous
          </div>
          <div className={styles.Label}>
            <label className={commons.Flex} htmlFor="new-input">
              <input
                type="checkbox"
                id="new-input"
                name="new"
                checked={!isOverwriting}
                onChange={toggleOverwriting}
              />
              l&apos;enregistrer comme une nouvelle requête
            </label>
          </div>
          <div className={styles.Label}>
            <label className={commons.Flex} htmlFor="overwrite-input">
              <input
                type="checkbox"
                id="overwrite-input"
                name="overwrite"
                checked={isOverwriting}
                onChange={toggleOverwriting}
              />
              mettre à jour la requête existante
            </label>
          </div>

          <div className={styles.Footer}>
            <button type="reset" className={styles.Cancel} onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className={styles.Confirm}
              onClick={handleConfirm}
            >
              Valider mon choix
            </button>
          </div>
        </div>
      </div>
    </ClickAwayOverlay>
  );
};

export default CreateBrowserFormTemplateModal;
