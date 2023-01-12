import * as NovaObject from "../Database/NovaObject";

export interface ObjectDto extends NovaObject.GraphEntityProperties {
  fill: string;
  textColor: string;
  icon: string;
  iconColor?: string;
  strokeLabel?: string;
  textLabelColor?: string;
}

function ObjectEntity({
  id = `Object-${Math.random()}-${Date.now()}`,
  fill = "red",
  textColor = "blue",
}) {
  return {
    id,
    fill,
    textColor,
  };
}

export default ObjectEntity;
