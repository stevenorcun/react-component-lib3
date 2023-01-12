/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectMap,
  setOnImportEntities,
  setSelectedKMLEntities,
} from "../../../../store/map";
import * as React from "react";
import { useEffect, useState } from "react";
import cx from "classnames";
/* eslint-disable global-require */
import CheckboxTree from "react-checkbox-tree";
import LayersToolbar from "../LayersToolbar/LayersToolbar";
import styles from "./styles.scss";

function LayersData() {
  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const [checkboxTreeData, setCheckboxTreeData] = useState({
    checked: [],
    expanded: [],
  });

  const [nodes, setNodes] = useState([
    {
      value: "Couches de présentation",
      label: "Couches de présentation",
      className: cx(styles.head_label),
      disabled: true,
      children: [],
    },
    {
      id: "couche de données",
      value: "Couches de données",
      label: "Couches de données",
      className: cx(styles.head_label),
      children: [],
    },
  ]);

  const findReccusiv = (array, id) =>
    array.find((el) => {
      if (el.id === id) {
        return el;
      }
      if (el.children) {
        return findReccusiv(el.children, id);
      }
      return false;
    });

  useEffect(() => {
    const clone = JSON.parse(JSON.stringify(nodes));
    const result = findReccusiv(clone, "couche de données");
    if (result) {
      result.children = mapState.kmlEntities.map((el) => ({
        id: el.id,
        value: el.id,
        label: el.filename,
        className: cx(styles.label_layers),
      }));
      setNodes(clone);
    }
  }, [mapState.kmlEntities]);

  useEffect(() => {
    const kmlSelected = [];
    checkboxTreeData.checked.forEach((element) => {
      if (element) {
        const match = mapState.kmlEntities.find((el) => el.id === element);
        // @ts-ignore
        kmlSelected.push(match);
      }
    });
    dispatch(setSelectedKMLEntities(kmlSelected));
  }, [checkboxTreeData.checked]);

  const style = `
 .react-checkbox-tree ol ol {margin-top: 5%;}
 span.rct-icon.rct-icon-parent-open {color: #3083F7;}
 span.rct-icon.rct-icon-parent-close {color: #7B61FF;}
`;
  return (
    <div>
      <style>{style}</style>
      <LayersToolbar />
      <CheckboxTree
        nodes={nodes}
        checked={checkboxTreeData.checked}
        expanded={checkboxTreeData.expanded}
        onCheck={(checked) => {
          if (mapState.kmlEntities.length > 0) {
            // @ts-ignore
            setCheckboxTreeData({ ...checkboxTreeData, checked });
            dispatch(setOnImportEntities(true));
          }
        }}
        onExpand={(expanded) =>
          // @ts-ignore
          setCheckboxTreeData({ ...checkboxTreeData, expanded })
        }
      />
    </div>
  );
}
export default React.memo(LayersData);
