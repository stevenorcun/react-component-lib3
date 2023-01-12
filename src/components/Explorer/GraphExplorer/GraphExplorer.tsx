import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import SearchExplorer from "../../../components/Explorer/SearchExplorer/SearchExplorer";

import styles from "./graphExplorer.scss";

const data = [
  {
    name: "06 10 02 03 05",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "06 10 02 03 06",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "06 10 02 03 07",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "06 10 02 03 08",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "06 10 02 03 09",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

const colors = ["#ff0000", "#00ff00", "#0000ff"];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

// const CustomBarLabel = ({
//   payload, x, y, width, height, value, test,
// }) => <text>{`value: ${test}`}</text>;

const Test = () => (
  <BarChart
    width={1000}
    height={300}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
    barSize={20}
  >
    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
    <YAxis />
    <Tooltip />
    <CartesianGrid strokeWidth="0.5px" stroke="#EDEDEE" vertical={false} />
    <Bar dataKey="pv" fill="#8884d8">
      {data.map((element, index) => (
        <Cell key={`cell-${index}`} fill={randomColor} />
      ))}
    </Bar>
  </BarChart>
);

const GraphExplorer = () => {
  return (
    <div className={styles.graphExplorer}>
      <SearchExplorer />
      <div className={styles.test}>
        <p>test</p>
        <Test />
      </div>
      Page Graphique
    </div>
  );
};

export default GraphExplorer;
