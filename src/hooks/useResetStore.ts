import { useAppDispatch } from "../store/hooks";
import { useState } from "react";
import { resetSliceBoard } from "../store/board/window";
import { resetSliceGraph } from "../store/graph";
import { resetSliceBrowser } from "../store/browser";
import { resetSliceCase } from "../store/case";
import { resetSliceMap } from "../store/map";
import { resetSliceTags } from "../store/tags";
import { resetSliceCustomizedActions } from "../store/customizedActions";
import { resetSliceLists } from "../store/lists";
import { resetSliceDrawer } from "../store/drawer";
import { resetSliceExplorer } from "../store/explorer";
import { resetSliceDocument } from "../store/document";
import { resetSliceMarkings } from "../store/markings";
import { resetSliceOntology } from "../store/ontology";
import { resetSliceToken, saveToken } from "../store/token";
import { toast } from "react-toastify";
import { useSocketContext } from "../hooks/useSocket";
import { SESSION_STORAGE_KEYS } from "../constants/storage-keys";
import { resetSliceExternalApps } from "../store/externalApps";

export default function useResetStore() {
  const socket = useSocketContext();
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [logoutActions] = useState({
    board: resetSliceBoard,
    graph: resetSliceGraph,
    browser: resetSliceBrowser,
    case: resetSliceCase,
    map: resetSliceMap,
    tags: resetSliceTags,
    customizedActions: resetSliceCustomizedActions,
    externalApps: resetSliceExternalApps,
    lists: resetSliceLists,
    drawer: resetSliceDrawer,
    explorer: resetSliceExplorer,
    document: resetSliceDocument,
    markingsConfig: resetSliceMarkings,
    ontologyConfig: resetSliceOntology,
    token: resetSliceToken,
  });

  const resetStore = () => {
    try {
      sessionStorage.clear();
      // still needed...
      // (ne semblait pas être fait "à temps" et donc on restait connecté...)
      dispatch(saveToken(null));
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.token);
      socket.close();
      Object.values(logoutActions).forEach((resetAction) => {
        dispatch(resetAction());
      });
      toast.info("Déconnecté");
    } catch (err: any) {
      toast.error(err.toString());
    } finally {
    }
  };

  return {
    resetStore,
  };
}
