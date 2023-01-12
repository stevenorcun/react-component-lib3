import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectMap, setActiveKmlMap } from "../../../store/map";
import * as React from "react";
import styles from "../MapServices/clustering_styles.scss";

function KmlPanel(props) {
  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const [checked, setChecked] = React.useState(mapState.activekml);

  const toggleChecked = () => {
    setChecked((value) => !value);
    if (checked === false) {
      dispatch(setActiveKmlMap(true));
    } else {
      dispatch(setActiveKmlMap(false));
    }
  };

  return (
    <div className={styles["control-panel-kml"]}>
      <h3 style={{ display: "inline-block" }}>Kml</h3>
      <input type="checkbox" checked={checked} onChange={toggleChecked} />
    </div>
  );
}

export default React.memo(KmlPanel);
