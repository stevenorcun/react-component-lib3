/* eslint-disable max-len */
import React from "react";
import cx from "classnames";

import HeaderSubtitleIcon from "@/pages/Entity/ComponentsEntityDetail/ComponentHeaderSubtitleIcon/HeaderSubtitleIcon";
import RemoveButton from "@/components/Buttons/RemoveButton/RemoveButton";

import IconSelectionTool from "@/assets/images/icons/IconSelect";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeSelection,
  handleEntitiesSelected,
  handleSelected,
  selectExplorer,
} from "@/store/explorer";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./currentSelection.scss";

const HeaderCurrentSelection = ({ count }: { count: number }) => (
  <div className={styles.headerCurrentSelection}>
    <label className={styles.headerCurrentSelection__label} htmlFor="value">
      Entités
      <span className={styles.headerCurrentSelection__number}>({count})</span>
    </label>
  </div>
);

const LineCurrentSelection = ({
  icon,
  value,
  handleDelete,
  handleSelectEntity,
  id,
  stateId,
}: {
  handleDelete: (e?: MouseEvent) => void;
  handleSelectEntity: () => void;
  icon?: React.SVGProps<SVGSVGElement>;
  value: string;
  id: string;
  stateId: string;
}) => (
  <div
    onClick={handleSelectEntity}
    className={cx(styles.lineCurrentSelection, {
      [styles.lineCurrentSelection__selected]: id === stateId,
    })}
  >
    {
      //@ts-ignore
      <div className={styles.lineCurrentSelection__label}>
        {icon}
        <p className={styles.value}>{value}</p>
      </div>
    }
    <RemoveButton handleDelete={handleDelete} />
  </div>
);

const CurrentSelection = () => {
  const explorerState = useAppSelector(selectExplorer);
  const dispatch = useAppDispatch();

  const handleDelete = (id: string, index: number) => {
    const copyData = [
      ...explorerState.tabs[explorerState.activeExlorerTabIndex].data,
    ];
    const findIndex = copyData.findIndex((element) => element.id === id);
    copyData[findIndex] = {
      ...copyData[findIndex],
      isSelected: !copyData[findIndex].isSelected,
    };
    const copyEntitiesSelected = [
      ...explorerState.tabs[explorerState.activeExlorerTabIndex]
        .entitiesSelected,
    ];
    copyEntitiesSelected.splice(index, 1);
    dispatch(changeSelection(copyData));
    dispatch(handleEntitiesSelected(copyEntitiesSelected));
  };

  const handleSelectEntity = (id: string) => {
    dispatch(
      handleSelected(
        explorerState.tabs[explorerState.activeExlorerTabIndex].data.find(
          (element: { id: string }) => element.id === id
        )
      )
    );
  };

  return (
    <div className={styles.currentSelection}>
      <HeaderSubtitleIcon
        title="Sélection actuelle"
        icon={<IconSelectionTool />}
      />
      <HeaderCurrentSelection
        count={
          explorerState.tabs[explorerState.activeExlorerTabIndex]
            .entitiesSelected?.length ?? 0
        }
      />
      <div className={cx(styles.currentSelectionLines, commons.PrettyScroll)}>
        {explorerState.tabs[explorerState.activeExlorerTabIndex]
          .entitiesSelected &&
          explorerState.tabs[explorerState.activeExlorerTabIndex]
            .entitiesSelected.length > 0 &&
          explorerState.tabs[
            explorerState.activeExlorerTabIndex
          ].entitiesSelected.map(
            (element: { label: string; id: string }, index: number) => (
              <>
                <LineCurrentSelection
                  key={element.label}
                  value={element.label}
                  handleDelete={() => handleDelete(element.id, index)}
                  handleSelectEntity={() => handleSelectEntity(element.id)}
                  id={element.id}
                  stateId={
                    explorerState.tabs[explorerState.activeExlorerTabIndex]
                      ?.currentSelected?.id
                  }
                />
              </>
            )
          )}
      </div>
    </div>
  );
};

export default CurrentSelection;
