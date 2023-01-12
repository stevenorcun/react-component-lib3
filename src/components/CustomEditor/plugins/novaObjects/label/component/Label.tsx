import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EntityDto } from "../../../../../../API/DataModels/Database/NovaObject";
import { useAppSelector, useAppDispatch } from "../../../../../../store/hooks";
import { createTabByType } from "../../../../../../store/browser";
import { selectOntologyConfig } from "../../../../../../store/ontology";
import { APP_ROUTES } from "../../../../../../constants/routes";
import { BrowserTabType } from "../../../../../../constants/browser-related";
import {
  getEntityStrIcon,
  getEntityTypeColor,
} from "../../../../../../constants/entity-related";
import { isDark } from "../../../../../../utils/colors";
import cx from "classnames";
import styles from "./styles.scss";

const Label = ({ contentState, entityKey, blockKey, children }: any) => {
  const data = contentState.getEntity(entityKey).getData();
  const dispatch = useAppDispatch();
  const { ont } = useAppSelector(selectOntologyConfig);
  const navigate = useNavigate();
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState<number | undefined>(
    undefined
  );

  const openInNewTab = (e: React.MouseEvent, entity: EntityDto) => {
    e.stopPropagation();
    dispatch(
      createTabByType({
        value: entity.label,
        type: BrowserTabType.EntityDetails,
        activeEntity: entity,
        isActive: true,
      })
    );
  };

  const navigateTo = (screen: string) => {
    navigate(screen);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      openInNewTab(e, data);
      navigateTo(APP_ROUTES.browser.path);
    }
  };

  const handleCtrlPress = (e: KeyboardEvent, isPressed) => {
    if (e.code === "ControlLeft") {
      setCtrlPressed(isPressed);
    }
  };

  useEffect(() => {
    const contentBlock = contentState.getBlockForKey(blockKey);
    const previousFontSizeKey = contentBlock
      .getInlineStyleAt(0)
      .findLast((v, key) => {
        const regex = /FONT-SIZE-\d*/g;
        return regex.test(key);
      });
    if (previousFontSizeKey) {
      setCurrentFontSize(
        parseInt(previousFontSizeKey.replace("FONT-SIZE-", ""), 10)
      );
    } else {
      setCurrentFontSize(undefined);
    }
  }, [contentState]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleCtrlPress(e, true));
    document.addEventListener("keyup", (e) => handleCtrlPress(e, false));
    return () => {
      document.removeEventListener("keydown", (e) => handleCtrlPress(e, true));
      document.removeEventListener("keyup", (e) => handleCtrlPress(e, false));
    };
  }, []);

  const Icon = getEntityStrIcon(data, ont);

  return (
    <span
      className={cx(styles.link, {
        [styles.active]: ctrlPressed,
        [styles.light]: isDark(getEntityTypeColor(data, ont) || "#113e9f"),
      })}
      onClick={handleClick}
      style={{
        backgroundColor: getEntityTypeColor(data, ont) || "#113e9f",
        fontSize: currentFontSize || "",
      }}
    >
      {data && Icon && <span className={styles.icon}>{Icon && <Icon />}</span>}
      {children}
    </span>
  );
};

export default Label;
