import React from "react";
import cx from "classnames";

import { getEntityPropLabelForExplorer } from "@/constants/entity-related";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOntologyConfig } from "@/store/ontology";
import {
  changeSelection,
  handleEntitiesSelected,
  handleSelected,
} from "@/store/explorer";

import IconSmartPhone from "@/assets/images/icons/entityTypes/IconSmartPhone";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./arrayExplorer.scss";

const ArrayExplorerContent = ({ explorer }) => {
  const { ont } = useAppSelector(selectOntologyConfig);
  const dispatch = useAppDispatch();

  const handleSelectline = (index: number) => {
    const copyData = [...explorer.data];
    copyData[index] = {
      ...copyData[index],
      isSelected: !copyData[index].isSelected,
    };
    const copyEntitiesSelected = explorer.entitiesSelected
      ? [...explorer?.entitiesSelected]
      : [];
    dispatch(changeSelection(copyData));

    if (copyData[index].isSelected) {
      copyEntitiesSelected.splice(0, 0, copyData[index]);
      dispatch(handleEntitiesSelected(copyEntitiesSelected));
      dispatch(handleSelected(copyData[index]));
    } else {
      const checkedEntities = copyEntitiesSelected.filter(
        (element) => element.id !== copyData[index].id
      );
      dispatch(handleEntitiesSelected(checkedEntities));
    }
  };

  return (
    <div className={cx(styles.content, commons.PrettyScroll)}>
      <table>
        <thead className={styles.thead}>
          <tr style={{ borderRadius: "5px" }}>
            {explorer.properties.map((element: string, index: number) => (
              <th key={index} className={styles.thHeader}>
                {getEntityPropLabelForExplorer(element, ont)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {explorer.data.map((element, index: number) => (
            <tr
              key={element.id}
              className={cx(styles.trBody, {
                [styles.trBodySelected]: element.isSelected,
                [styles.trBodySelectedOver]: element.isOverSelected,
              })}
              onClick={() => handleSelectline(index)}
            >
              {explorer.properties.map((property: string) => (
                <td key={property} title={element[property]}>
                  <div className={styles.textOverflowLines}>
                    {typeof property === "string" &&
                      property.startsWith("0") && (
                        <span style={{ marginRight: ".5rem" }}>
                          <IconSmartPhone width={8} height={14} />
                        </span>
                      )}
                    {element.properties[property]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArrayExplorerContent;
