import React from "react";

import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Fréquence de communication", value: 400, phone: "06 10 02 03 05" },
  { name: "Fréquence de communication", value: 300, phone: "06 10 02 03 05" },
  { name: "Fréquence de communication", value: 300, phone: "06 10 03 07 22" },
  { name: "Fréquence de communication", value: 300, phone: "06 10 54 73 58" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    phone,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;

  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fontSize={12} fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      /> */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${phone} (${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

const RechartsCircular = () => {
  // const [activeIndex, setActiveIndex] = useState<number>(0);

  // const onPieEnter = (_, index: number) => {
  //   setActiveIndex(index);
  // };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          // activeIndex={activeIndex}
          // activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          label={renderActiveShape}
          fill="#8884d8"
          dataKey="value"
          // onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RechartsCircular;
