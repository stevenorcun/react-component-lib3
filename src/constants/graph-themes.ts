import { EntityIconProps } from "../assets/images/icons/entityTypes/EntityIconsProps";

export interface EntityObjectProps {
  // Fill for most of the icons
  iconByDefault: string;
  // Fill for the text inside some icons (i.e. "En prison")
  fontByDefault: string;
  // Fill for the Tile's text (i.e. Entity's name, card description etc.)
  textByDefault: string;
  strokeLabelByDefault: string;
  textLabelByDefault: string;
}

export const STROKES_FILLS_COLORS = [
  "transparent",
  "#DBF2FF",
  "#D6E6FD",
  "#D7F2D6",
  "#E7DAFC",
  "#F6D4E8",
  "#FFDEC9",
  "#D2D3D4",
  "#FFF",
  "#3083F7",
  "#113E9F",
  "#46885A",
  "#704F9F",
  "#AA2F78",
  "#B1602A",
  "#665B4F",
];

export const STROKES_FILLS_COLORS_OBJECTS = [
  "#3083F7",
  "#113E9F",
  "#46885A",
  "#704F9F",
  "#AA2F78",
  "#B1602A",
  "#665B4F",
];

export const STYLE_BY_FILL_COLORS: { [fillColor: string]: EntityIconProps } = {
  [STROKES_FILLS_COLORS[0]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[0],
    blackByDefault: "#444",
  },
  [STROKES_FILLS_COLORS[1]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[1],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[2]]: {
    blueByDefault: "red",
    whiteByDefault: STROKES_FILLS_COLORS[2],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[3]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[3],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[4]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[4],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[5]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[5],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[6]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[6],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[7]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[7],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[8]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[8],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[9]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[9],
    blackByDefault: "#fff",
  },
  [STROKES_FILLS_COLORS[10]]: {
    blueByDefault: "#fff",
    whiteByDefault: STROKES_FILLS_COLORS[10],
    blackByDefault: "#3083F7",
  },
  // Default style
  [STROKES_FILLS_COLORS[11]]: {
    blueByDefault: "#3083F7",
    whiteByDefault: STROKES_FILLS_COLORS[11],
    blackByDefault: "#444",
  },
  [STROKES_FILLS_COLORS[12]]: {
    blueByDefault: "#3083F7",
    whiteByDefault: STROKES_FILLS_COLORS[12],
    blackByDefault: "#444",
  },
  [STROKES_FILLS_COLORS[13]]: {
    blueByDefault: "#3083F7",
    whiteByDefault: STROKES_FILLS_COLORS[13],
    blackByDefault: "#444",
  },
  DEFAULT_STYLE: {
    blueByDefault: "#3083F7",
    whiteByDefault: "#fff",
    blackByDefault: "#444",
  },
};

// @ts-ignore
export const STYLES_BY_FILL_COLORS_OBJECT: {
  [fillColor: string]: EntityObjectProps;
} = [
  {
    iconByDefault: "#3083F7",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#3083F7",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#113E9F",
  },
  {
    iconByDefault: "#46885A",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#46885A",
  },
  {
    iconByDefault: "#704F9F",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#704F9F",
  },
  {
    iconByDefault: "#AA2F78",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#AA2F78",
  },
  {
    iconByDefault: "#B1602A",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#B1602A",
  },
  {
    iconByDefault: "#665B4F",
    fontByDefault: "#fff",
    textByDefault: "grey",
    textLabelByDefault: "#fff",
    strokeLabelByDefault: "#665B4F",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#DBF2FF",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[0],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#D6E6FD",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[1],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#D7F2D6",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[2],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#E7DAFC",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[3],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#F6D4E8",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[4],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#FFDEC9",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[5],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#113E9F",
    fontByDefault: "#D2D3D4",
    textByDefault: "#113E9F",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[6],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[0],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[0],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[1],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[1],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[2],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[2],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[3],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[3],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[4],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[4],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[5],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[5],
    strokeLabelByDefault: "#fff",
  },
  {
    iconByDefault: "#fff",
    fontByDefault: STROKES_FILLS_COLORS_OBJECTS[6],
    textByDefault: "#fff",
    textLabelByDefault: STROKES_FILLS_COLORS_OBJECTS[6],
    strokeLabelByDefault: "#fff",
  },
];

export const DEFAULT_TILE_STYLE = {
  fill: STROKES_FILLS_COLORS[8],
  stroke: STROKES_FILLS_COLORS[9],
  iconColor: "#3083F7",
  strokeLabel: "#3083F7",
  textColor: "grey",
  textLabelColor: "white",
};
