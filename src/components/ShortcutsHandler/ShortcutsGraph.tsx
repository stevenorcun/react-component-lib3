import React from 'react';
import { HotKeys } from 'react-hotkeys';

import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import usePreferences from '@/hooks/usePreferences';
import { GraphLayout, setEntityCoordinatesGrid, setGraphLayout } from '@/store/graph';
import { useAppDispatch } from '@/store/hooks';
import preventDefaultHandlers from './CommonShortcuts';

const ShortcutsGraph = ({ children }) => {
  const { preferences: keyMapData } = usePreferences(
    LOCAL_STORAGE_KEYS.shortcuts,
  );
  const dispatch = useAppDispatch();
  const handlers = preventDefaultHandlers({
    MODE_GRID: () => {
      dispatch(setGraphLayout(GraphLayout.Grid));
      dispatch(setEntityCoordinatesGrid());
    },
    // MODE_CIRCLE: () => {
    //   dispatch(setGraphLayout(GraphLayout.Circular));
    //   // dispatch(representGraphCircularly());
    // },
  });

  return <HotKeys handlers={handlers} keyMap={keyMapData} allowChanges>{children}</HotKeys>;
};

export default ShortcutsGraph;
