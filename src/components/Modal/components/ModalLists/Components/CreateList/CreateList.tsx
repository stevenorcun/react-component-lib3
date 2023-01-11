import React from 'react';

import cx from 'classnames';

import styles from './createList.scss';

const CreateList = ({
  inputValue,
  setInputValue,
} : {
  inputValue: string;
  setInputValue: (str: string) => void;
}) => (
  <div className={styles.createList}>
    <div className={styles.intro}>
      Saisir le nom de la nouvelle liste :
    </div>
    <input
      className={cx(styles.input)}
      value={inputValue}
      placeholder="Nom de la nouvelle liste"
      onChange={(e) => setInputValue(e.target.value)}
    />
  </div>
);

export default CreateList;
