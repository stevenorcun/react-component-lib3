import React, { useState } from 'react';

import CurrentSelection from './CurrentSelection/CurrentSelection';
import SetPalette from './SetPalette/SetPalette';

import styles from './paletteExplorer.scss';

const PaletteExplorer = () => {
  const [selectTab, setSelectTab] = useState('selection');

  const handleSelectTab = (tabCurrent: string) => {
    setSelectTab(tabCurrent);
  };

  return (
    <div className={styles.paletteExplorer}>
      <SetPalette
        selectTab={selectTab}
        changeSelectTab={handleSelectTab}
      />
      {selectTab === 'selection' && <CurrentSelection />}
    </div>
  );
};

export default PaletteExplorer;
