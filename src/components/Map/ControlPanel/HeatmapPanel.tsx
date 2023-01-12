import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectMap, setActiveHeatmap } from "../../../store/map";
import * as React from "react";
import { useState } from "react";
import styles from "../MapServices/clustering_styles.scss";

function formatTime(time) {
  const date = new Date(time);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function HeatmapPanel(props) {
  const {
    startTime,
    endTime,
    onChangeTime,
    allDays,
    onChangeAllDays,
    selectedTime,
  } = props;
  const day = 24 * 60 * 60 * 1000;
  const days = Math.round((endTime - startTime) / day);
  const selectedDay = Math.round((selectedTime - startTime) / day);

  const mapState = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState(mapState.activeHeatmap);
  const toggleChecked = () => {
    setChecked((value) => !value);
    if (checked == false) {
      dispatch(setActiveHeatmap(true));
    } else {
      dispatch(setActiveHeatmap(false));
    }
  };

  const onSelectDay = (evt) => {
    const daysToAdd = evt.target.value;
    // add selected days to start time to calculate new time
    const newTime = startTime + daysToAdd * day;
    onChangeTime(newTime);
  };

  return (
    <div className={styles["control-panel"]}>
      <div className={styles.head_container}>
        <h3
          style={{
            display: "inline-block",
            color: "white",
            marginRight: "15px",
            marginLeft: "33%",
          }}
        >
          Heatmap
        </h3>
        <input type="checkbox" checked={checked} onChange={toggleChecked} />
      </div>
      <div className={styles.div_container}>
        <p style={{ textAlign: "center" }}>
          Map : tremblement de terre
          <br />
          du <b>{formatTime(startTime)}</b> au <b>{formatTime(endTime)}</b>.
        </p>
        <hr />
        <div className="input">
          <label>Total</label>
          <input
            type="checkbox"
            name="allday"
            checked={allDays}
            onChange={(evt) => onChangeAllDays(evt.target.checked)}
          />
        </div>
        <div className={`input ${allDays ? "disabled" : ""}`}>
          <label>Par jour: {formatTime(selectedTime)}</label>
          <input
            type="range"
            disabled={allDays}
            min={1}
            max={days}
            value={selectedDay}
            step={1}
            onChange={onSelectDay}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(HeatmapPanel);
