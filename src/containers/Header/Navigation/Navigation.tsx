/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cx from "classnames";

import { useAppSelector } from "../../../store/hooks";
import { selectCase } from "../../../store/case";
import { APP_ROUTES } from "../../../constants/routes";

import NavigationItem from "../../../components/Navigation/NavigationItem";
import LeftNavigation from "./LeftNavigation/LeftNavigation";
import RightNavigation from "./RightNavigation/RightNavigation";

import styles from "./styles.scss";

declare global {
  interface Window {
    ondragend: any;
  }
}

window.ondragend = window.ondragend || {};

const Navigation = () => {
  const caseState = useAppSelector(selectCase);
  const navigate = useNavigate();
  const location = useLocation();

  const openInNewWindow = (_: React.SyntheticEvent, screen: string) => {
    window.ondragend = (event: React.DragEvent) => {
      if (
        event.pageX >= 0 &&
        event.pageY >= 0 &&
        event.pageX <= window.innerWidth &&
        event.pageY <= window.innerHeight
      ) {
        return (window.ondragend = null);
      }
      window.open(`${window.location.pathname}#${screen}`);
      window.ondragend = null;
    };
  };

  const navigateTo = (screen: string) => {
    navigate(screen);
  };

  return (
    <div className={styles.navigation}>
      <LeftNavigation
        activeMenu={location.pathname}
        openInNewWindow={openInNewWindow}
        navigateTo={navigateTo}
        caseState={caseState}
      />
      <div className={cx(styles.itemsContainer, styles.caseNameContainer)}>
        {caseState?.currentCase && (
          <NavigationItem
            className={styles.caseName}
            clickable
            active={
              location.pathname ===
              APP_ROUTES.case.path.replace(":id", caseState.currentCase.id)
            }
            onDragStart={(e) =>
              openInNewWindow(
                e,
                APP_ROUTES.case.path.replace(":id", caseState.currentCase.id)
              )
            }
            onClick={() =>
              navigateTo(
                APP_ROUTES.case.path.replace(":id", caseState.currentCase.id)
              )
            }
            label={caseState.currentCase.label}
          />
        )}
      </div>
      <RightNavigation
        activeMenu={location.pathname}
        openInNewWindow={openInNewWindow}
        navigateTo={navigateTo}
        caseState={caseState}
      />
    </div>
  );
};

export default Navigation;
