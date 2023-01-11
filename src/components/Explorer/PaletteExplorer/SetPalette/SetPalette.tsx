import React from 'react';
import cx from 'classnames';

import SelectionExplorer from '@/components/Explorer/PaletteExplorer/SetPalette/SelectionExplorer/SelectionExplorer';
import HistogramExplorer from '@/components/Explorer/PaletteExplorer/SetPalette/HistogramExplorer/HistogramExplorer';

import { useAppSelector } from '@/store/hooks';
import { selectExplorer } from '@/store/explorer';
import NoData from '@/lib/NoData/NoData';
import styles from './setPalette.scss';

enum ListTab {
  selection = 'Sélection',
  histogram = 'Histogramme',
  search = 'Recherche',
}

interface SetPaletteProps {
  selectTab: string;
  changeSelectTab: (key: string) => void;
}

const HeaderPalette = ({ changeSelectTab, selectTab }: SetPaletteProps) => (
  <div className={styles.headerPalette}>
    {Object.entries(ListTab).map((element) => (
      <button
        type="button"
        onClick={() => changeSelectTab(element[0])}
        className={cx(styles.buttonTab, {
          [styles.buttonTabActive]: selectTab === element[0],
        })}
      >
        {element[1]}
      </button>
    ))}
  </div>
);

const SetPalette = ({ changeSelectTab, selectTab }: SetPaletteProps) => {
  const explorerState = useAppSelector(selectExplorer);
  const tabSelected = {
    selection: <SelectionExplorer />,
    histogram: <HistogramExplorer />,
  };

  return (
    <div className={cx(styles.setPalette, {
      [styles.setPaletteSelection]: selectTab === 'selection',
    })}
    >
      <HeaderPalette changeSelectTab={changeSelectTab} selectTab={selectTab} />
      {explorerState.tabs[explorerState.activeExlorerTabIndex].entitiesSelected.length > 0 ? (
        tabSelected[selectTab]
      ) : <NoData>Pas de sélection</NoData>}
    </div>
  );
};

export default SetPalette;
