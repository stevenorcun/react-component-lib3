import React from "react";

import { APP_ROUTES } from "../../constants/routes";
import {
  LOCAL_STORAGE_KEYS,
  SESSION_STORAGE_KEYS,
} from "../../constants/storage-keys";
import usePreferences from "../../hooks/usePreferences";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalHotKeys } from "react-hotkeys";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectCase, setCurrentCase } from "../../store/case";
import { selectEveryEntity as mapSelectEveryEntity } from "../../store/map";
import {
  invertSelection as graphInvertSelection,
  selectEveryEntity as graphSelectEveryEntity,
  selectEveryAnnotations,
  selectInvertSelectionAnnotations,
} from "../../store/graph";
import { selectOntologyConfig } from "../../store/ontology";
import {
  explorerInvertSelection,
  explorerSelectEveryEntity,
} from "../../store/explorer";
import preventDefaultHandlers from "./CommonShortcuts";

const ShortcutsHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const caseState = useAppSelector(selectCase);
  const { ont } = useAppSelector(selectOntologyConfig);

  const { preferences: keyMapData } = usePreferences(
    LOCAL_STORAGE_KEYS.shortcuts
  );

  const handlers = preventDefaultHandlers({
    MENU_DASHBOARD: () => navigate(APP_ROUTES.dashboard.path),
    MENU_HELP: () => navigate(APP_ROUTES.faq.path),
    CLOSE_CASE: (e) => {
      if (caseState.currentCase) {
        dispatch(setCurrentCase(null));
        sessionStorage.removeItem(SESSION_STORAGE_KEYS.currentCase);
        navigate(APP_ROUTES.dashboard.path);
      }
    },
    SELECT_ALL: () => {
      switch (location.pathname) {
        case APP_ROUTES.map.path:
          dispatch(mapSelectEveryEntity());
          break;
        case APP_ROUTES.graph.path:
          dispatch(graphSelectEveryEntity());
          dispatch(selectEveryAnnotations());
          break;
        case APP_ROUTES.explorer.path:
          dispatch(explorerSelectEveryEntity());
          break;
        default:
          break;
      }
    },
    INVERT_SELECTION: () => {
      switch (location.pathname) {
        case APP_ROUTES.graph.path:
          dispatch(graphInvertSelection(ont));
          dispatch(selectInvertSelectionAnnotations());
          break;
        case APP_ROUTES.explorer.path:
          dispatch(explorerInvertSelection());
          break;
        default:
          break;
      }
    },
  });

  return <GlobalHotKeys keyMap={keyMapData} handlers={handlers} allowChanges />;
};

export default ShortcutsHandler;
